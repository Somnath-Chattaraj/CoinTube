"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const ethers_1 = require("ethers");
const prisma_1 = __importDefault(require("./lib/prisma"));
const marketplace_abi_1 = require("./lib/marketplace_abi");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = new ethers_1.ethers.WebSocketProvider(`wss://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`);
        const contractAddress = process.env.MARKETPLACE_CONTRACT;
        if (!contractAddress) {
            throw new Error("No contract address found");
        }
        if (!provider) {
            throw new Error("No provider found");
        }
        const contract = new ethers_1.ethers.Contract(contractAddress, marketplace_abi_1.marketplace_abi, provider);
        if (contract) {
            console.log("Listening for events on contract", contractAddress);
        }
        contract.on("TokenListed", (token, seller, priceInWei, amount) => __awaiter(this, void 0, void 0, function* () {
            console.log("Token listed", token, seller, priceInWei, amount);
            try {
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    yield tx.listedToken.create({
                        data: {
                            tokenAddress: token,
                            sellerWalletAddress: seller,
                            price: parseFloat(ethers_1.ethers.formatEther(priceInWei)),
                            amount,
                        },
                    });
                }));
            }
            catch (error) {
                console.error("Error handling TokenListed event:", error);
            }
        }));
        contract.on("TokenSold", (token, buyer, seller, amount, priceInWei) => __awaiter(this, void 0, void 0, function* () {
            console.log("Token sold", token, buyer, seller, amount, priceInWei);
            try {
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    yield tx.transaction.create({
                        data: {
                            tokenAddress: token,
                            buyerWalletAddress: buyer,
                            sellerWalletAddress: seller,
                            amount,
                            price: parseFloat(ethers_1.ethers.formatEther(priceInWei)),
                        },
                    });
                    yield tx.listedToken.deleteMany({
                        where: { tokenAddress: token, sellerWalletAddress: seller },
                    });
                    yield tx.walletToken.upsert({
                        where: { walletAddress_tokenAddress: { walletAddress: buyer, tokenAddress: token } },
                        update: { quantity: { increment: amount } },
                        create: {
                            wallet: { connect: { walletAddress: buyer } },
                            token: { connect: { tokenAddress: token } },
                            walletAddress: buyer,
                            tokenAddress: token,
                            quantity: amount,
                            price: parseFloat(ethers_1.ethers.formatEther(priceInWei)),
                        },
                    });
                    yield tx.walletToken.upsert({
                        where: { walletAddress_tokenAddress: { walletAddress: seller, tokenAddress: token } },
                        update: { quantity: { decrement: amount } },
                        create: {
                            wallet: { connect: { walletAddress: seller } },
                            token: { connect: { tokenAddress: token } },
                            walletAddress: seller,
                            tokenAddress: token,
                            quantity: 0,
                            price: parseFloat(ethers_1.ethers.formatEther(priceInWei)),
                        },
                    });
                }));
            }
            catch (error) {
                console.error("Error handling TokenSold event:", error);
            }
        }));
        contract.on("TokenDelisted", (token, seller) => __awaiter(this, void 0, void 0, function* () {
            console.log("Token delisted", token, seller);
            try {
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    yield tx.listedToken.deleteMany({
                        where: { tokenAddress: token, sellerWalletAddress: seller },
                    });
                }));
            }
            catch (error) {
                console.error("Error handling TokenDelisted event:", error);
            }
        }));
    });
}
main();
