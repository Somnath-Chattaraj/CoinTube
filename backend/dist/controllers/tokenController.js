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
exports.listedToken = exports.transaction = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.transaction = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Assuming you're using a middleware to set req.user
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { tokenAddress } = req.params;
    const token = yield prisma_1.default.token.findUnique({
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
}));
exports.listedToken = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listedTokens = yield prisma_1.default.listedToken.findMany();
    res.status(200).json(listedTokens);
}));
