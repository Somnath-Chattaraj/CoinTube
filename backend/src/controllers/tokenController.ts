import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const transaction = asyncHandler(
    async (req: Request, res: Response) => {
        // Assuming you're using a middleware to set req.user
        const userId = (req as any).user?.id;
        const { tokenAddress } = req.params;

        const transactions = await prisma.transaction.findMany({
            where: {
                tokenAddress
            }
        });
        res.status(200).json(transactions);
    }
);

export const listedToken = asyncHandler(
    async (req: Request, res: Response) => {
        const listedTokens = await prisma.listedToken.findMany({
            select: {
                token: true,
                seller: {
                    select: {
                        walletAddress: true,
                        user: true
                    }
                },
                price: true,
                amount: true
            }
        });
        const formattedTokens = listedTokens.map(({ token, seller, price, amount }) => ({
            tokenId: token.id,
            tokenAddress: token.tokenAddress,
            name: token.name,
            symbol: token.symbol,
            tokenPrice: token.price,
            walletAddress: seller.walletAddress,
            Seller_name: seller.user.name,
            email: seller.user.email,
            amount
        }));
        res.status(200).json(formattedTokens);
    }
);
