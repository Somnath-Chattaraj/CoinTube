require("dotenv").config();
import { ethers } from "ethers";
import prisma from "./lib/prisma";
import { marketplace_abi } from "./lib/marketplace_abi";


async function main() {
    const provider = new ethers.WebSocketProvider(`wss://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`);
    const contractAddress = process.env.MARKETPLACE_CONTRACT;

    if (!contractAddress) {
        throw new Error("No contract address found");
    }
    if (!provider) {
        throw new Error("No provider found");
    }

    const contract = new ethers.Contract(contractAddress, marketplace_abi, provider);
    if (contract) {
        console.log("Listening for events on contract", contractAddress);
    }
    contract.on("TokenListed", async (token, seller, priceInWei, amount) => {
        console.log("Token listed", token, seller, priceInWei, Number(amount));
        try {
            await prisma.$transaction(async (tx) => {
                await tx.listedToken.create({
                    data: {
                        tokenAddress: token,
                        sellerWalletAddress: seller,
                        price: parseFloat(ethers.formatEther(priceInWei)),
                        amount: Number(amount) // Explicit conversion
                    },
                });
            });
        } catch (error) {
            console.error("Error handling TokenListed event:", error);
        }
    });
    

    contract.on("TokenSold", async (token, buyer, seller, amount, priceInWei) => {
        console.log("Token sold", token, buyer, seller, amount, priceInWei);
        try {
            await prisma.$transaction(async (tx) => {
                await tx.transaction.create({
                    data: {
                        tokenAddress: token,
                        buyerWalletAddress: buyer,
                        sellerWalletAddress: seller,
                        amount : Number(amount),
                        price: parseFloat(ethers.formatEther(priceInWei)),
                    },
                });
                
                await tx.listedToken.deleteMany({
                    where: { tokenAddress: token, sellerWalletAddress: seller },
                });

                await tx.walletToken.upsert({
                    where: { walletAddress_tokenAddress: { walletAddress: buyer, tokenAddress: token } },
                    update: { quantity: { increment: Number(amount) } },
                    create: {
                        wallet: { connect: { walletAddress: buyer } },
                        token: { connect: { tokenAddress: token } },
                        walletAddress: buyer,
                        tokenAddress: token,
                        quantity: Number(amount),
                        price: parseFloat(ethers.formatEther(priceInWei)),
                    },
                });
                
                await tx.walletToken.upsert({
                    where: { walletAddress_tokenAddress: { walletAddress: seller, tokenAddress: token } },
                    update: { quantity: { decrement: Number(amount) } },
                    create: {
                        wallet: { connect: { walletAddress: seller } },
                        token: { connect: { tokenAddress: token } },
                        walletAddress: seller,
                        tokenAddress: token,
                        quantity: 0,
                        price: parseFloat(ethers.formatEther(priceInWei)),
                    },
                });
                
            });
        } catch (error) {
            console.error("Error handling TokenSold event:", error);
        }
    });

    contract.on("TokenDelisted", async (token, seller) => {
        console.log("Token delisted", token, seller);
        try {
            await prisma.$transaction(async (tx) => {
                await tx.listedToken.deleteMany({
                    where: { tokenAddress: token, sellerWalletAddress: seller },
                });
            });
        } catch (error) {
            console.error("Error handling TokenDelisted event:", error);
        }
    });

}

main();
