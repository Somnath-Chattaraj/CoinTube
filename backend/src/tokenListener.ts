require("dotenv").config();
import { ethers } from "ethers";
import prisma from "./lib/prisma";
import { tokenFactor_abi } from "./lib/tokenFactor_abi";

async function main() {
    const alchemyKey = process.env.ALCHEMY_KEY;
    const contractAddress = process.env.TOKENFACTORY_CONTRACT;

    if (!alchemyKey) throw new Error("Missing ALCHEMY_KEY in .env");
    if (!contractAddress) throw new Error("Missing TOKENFACTORY_CONTRACT in .env");

    const provider = new ethers.WebSocketProvider(`wss://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`);
    const contract = new ethers.Contract(contractAddress, tokenFactor_abi, provider);

    console.log(`Listening for events on contract: ${contractAddress}`);

    contract.on("TokenCreated", async (creator, tokenAddress, name, symbol, initialSupply, royaltyFee) => {
        console.log(`New token created: ${name} (${symbol}) at ${tokenAddress} by ${creator}`);

        try {
            await prisma.$transaction(async (tx) => {
                // Ensure Wallet exists for creator
                const wallet = await tx.wallet.upsert({
                    where: { walletAddress: creator },
                    update: {},
                    create: { walletAddress: creator, userId: "default-user-id" } // Ensure a userId exists
                });

                // Create Token entry
                const token = await tx.token.create({
                    data: {
                        tokenAddress,
                        creatorAddress: creator,
                        name,
                        symbol,
                        price: 0.0,  // Default price, update later if needed
                        royaltyRecipientAddress: creator,  // Assuming creator gets royalties
                    },
                });

                // Add token to creator's wallet
                await tx.walletToken.create({
                    data: {
                        walletAddress: creator,
                        tokenAddress,
                        quantity: Number(initialSupply),
                        price: 0.0,
                    },
                });
            });

            console.log(`Token ${name} (${symbol}) stored in DB`);
        } catch (error) {
            console.error("Error storing TokenCreated event data:", error);
        }
    });
}

main().catch(console.error);
