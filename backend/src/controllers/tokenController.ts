import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const transaction = asyncHandler(
    async (req: Request, res: Response) => {
        // Assuming you're using a middleware to set req.user
        const userId = (req as any).user?.id;
        const { tokenAddress } = req.params;

        const token = await prisma.token.findUnique({
            where: { tokenAddress },
            select: {
                name: true,
                symbol: true,
                price: true,
                creatorAddress: true,
                royaltyRecipientAddress: true,
                transactions: true,
                listedTokens: true
            }
        });
        res.status(200).json(token);
    }
);

export const listedToken = asyncHandler(
    async (req: Request, res: Response) => {
        const listedTokens = await prisma.listedToken.findMany();
        res.status(200).json(listedTokens);
    }
);
