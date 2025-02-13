import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Register User
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const {email} = req.body;

    if (!email) {
      res
        .status(400)
        .json({ message: "Please provide an email and a password" });
      return;
    }

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await prisma.user.create({
        data: {
            email
        }
    });

    const exp = Date.now() + 1000 * 60 * 60 * 5;
    const token = jwt.sign({ sub: user.id, exp }, process.env.SECRET!);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  }
);

export const updateName = asyncHandler(
    async (req: Request, res: Response) => {
        const { name,email } = req.body;
    
        const user = await prisma.user.update({
        where: { email },
        data: {
            name,
        },
        });
    
        res.status(200).json({
        message: "Name updated successfully",
        user: {
            id: user.id,
            name: user.name,
        },
        });
    }
);

export const updateUserWallet = asyncHandler(
    async (req: Request, res: Response) => {
      // @ts-ignore
      const { wallet_address } = req.body;
      try {
        const wallet = await prisma.wallet.upsert({
          where: {
            walletAddress: wallet_address,
          },
          update: {
            // @ts-ignore
            userId: req.user.id,
          },
          create: {
            walletAddress: wallet_address,
            // @ts-ignore
            userId: req.user.id,
          },
        });
  
        res.json(wallet);
      } catch (error) {
        console.error("Error updating or creating wallet:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
);

export const loginUser = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.body;
        const user = await prisma.user.findUnique({
        where: { email },
        });
    
        if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
        }
    
        const exp = Date.now() + 1000 * 60 * 60 * 5;
        const token = jwt.sign({ sub: user.id, exp }, process.env.SECRET!);
    
        res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        });
    
        res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user.id,
            email: user.email,
        },
        });
    }
);

export const logoutUser = asyncHandler(
    async (req: Request, res: Response) => {
        res.clearCookie("token");
        res.status(200).json({ message: "User logged out successfully" });
    }
);

export const getUser = asyncHandler(
    async (req: Request, res: Response) => {
        try{
        const user = await prisma.user.findUnique({
            // @ts-ignore
        where: { id: req.user.id },
        select: {
            id: true,
            email: true,
            name: true,
            wallets: {
                select: {
                    walletAddress: true,
                }
            }
        },
        });
    
        res.status(200).json(user);
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    }
);

export const getUserOwnedTokens = asyncHandler(
    async (req: Request, res: Response) => {
        const user = await prisma.user.findUnique({
            // @ts-ignore
        where: { id: req.user.id },
        select: {
            id: true,
            email: true,
            name: true,
            wallets: {
                select: {
                    walletAddress: true,
                        tokens:  {
                            select: {
                                token: true,
                                quantity: true,
                            }
                        }
                }
            }
        },
        });
    
        res.status(200).json(user);
    }
);