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
    contract.on("TokenListed", async (token: string, seller: string, priceInWei: BigInt, amount: BigInt) => {
        console.log("Token listed", token, seller, priceInWei, Number(amount));
        try {
            await prisma.$transaction(async (tx) => {
                const parsedPrice = parseFloat(ethers.formatEther(Number(priceInWei)));
                const parsedAmount = Number(amount);
    
                await tx.listedToken.upsert({
                    where: {
                        tokenAddress_sellerWalletAddress: {
                            tokenAddress: token,
                            sellerWalletAddress: seller
                        }
                    },
                    update: {
                        price: parsedPrice,
                        amount: parsedAmount
                    },
                    create: {
                        token: { connect: { tokenAddress: token } },
                        seller: { connect: { walletAddress: seller } },
                        price: parsedPrice,
                        amount: parsedAmount
                    }
                });
            });
        } catch (error) {
            console.error("Error handling TokenListed event:", error);
        }
    });


contract.on(
  "TokenSold",
  async (token: string, buyer: string, seller: string, amount: BigInt, priceInWei: BigInt) => {
    console.log("Token sold", token, buyer, seller, amount, priceInWei);
    try {
      const parsedPrice = parseFloat(ethers.formatEther(Number(priceInWei)));

      // ✅ Use Prisma transaction batch instead of wrapping in a single async function
      await prisma.$transaction([
        // Insert transaction record
        prisma.transaction.create({
          data: {
            token: { connect: { tokenAddress: token } },
            buyer: { connect: { walletAddress: buyer } },
            seller: { connect: { walletAddress: seller } },
            amount: Number(amount),
            price: parsedPrice,
          },
        }),

        // Remove listed tokens
        prisma.listedToken.deleteMany({
          where: { tokenAddress: token, sellerWalletAddress: seller },
        }),

        // ✅ Update buyer's wallet token (Upsert)
        prisma.walletToken.upsert({
          where: { walletAddress_tokenAddress: { walletAddress: buyer, tokenAddress: token } },
          update: {
            quantity: { increment: Number(amount) },
            price: parsedPrice,
          },
          create: {
            walletAddress: buyer,
            tokenAddress: token,
            quantity: Number(amount),
            price: parsedPrice,
          },
        }),

        // ✅ Update seller's wallet token (Upsert)
        prisma.walletToken.upsert({
          where: { walletAddress_tokenAddress: { walletAddress: seller, tokenAddress: token } },
          update: {
            quantity: { decrement: Number(amount) },
            price: parsedPrice,
          },
          create: {
            walletAddress: seller,
            tokenAddress: token,
            quantity: 0,
            price: parsedPrice,
          },
        }),
      ]);
    } catch (error) {
      console.error("Error handling TokenSold event:", error);
    }
  }
);


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
