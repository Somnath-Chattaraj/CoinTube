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
exports.getUserOwnedTokens = exports.getUser = exports.logoutUser = exports.loginUser = exports.updateUserWallet = exports.updateName = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Register User
exports.registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res
            .status(400)
            .json({ message: "Please provide an email and a password" });
        return;
    }
    const userExists = yield prisma_1.default.user.findUnique({
        where: { email },
    });
    if (userExists) {
        res.status(400).json({ message: "User already exists" });
        return;
    }
    const user = yield prisma_1.default.user.create({
        data: {
            email
        }
    });
    const exp = Date.now() + 1000 * 60 * 60 * 5;
    const token = jsonwebtoken_1.default.sign({ sub: user.id, exp }, process.env.SECRET);
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
}));
exports.updateName = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    const user = yield prisma_1.default.user.update({
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
}));
exports.updateUserWallet = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const { wallet_address } = req.body;
    try {
        const wallet = yield prisma_1.default.wallet.upsert({
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
    }
    catch (error) {
        console.error("Error updating or creating wallet:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
    }
    const exp = Date.now() + 1000 * 60 * 60 * 5;
    const token = jsonwebtoken_1.default.sign({ sub: user.id, exp }, process.env.SECRET);
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
}));
exports.logoutUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
}));
exports.getUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.findUnique({
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
    }
    catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.getUserOwnedTokens = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        // @ts-ignore
        where: { id: req.user.id },
        select: {
            id: true,
            email: true,
            name: true,
            wallets: {
                select: {
                    walletAddress: true,
                    tokens: {
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
}));
