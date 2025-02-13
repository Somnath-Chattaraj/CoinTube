"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const tokenRoutes_1 = __importDefault(require("./routes/tokenRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((req, res, next) => {
    // console.log("Request logged:", req.method, req.path);
    next();
});
app.get("/", (req, res) => {
    res.send("Server is running");
});
app.use("/api/user", userRoutes_1.default);
app.use("/api/token", tokenRoutes_1.default);
app.listen((process.env.PORT || 3000), () => {
    console.log(`🚀 Server is running on port ${process.env.PORT || 3000}`);
});
