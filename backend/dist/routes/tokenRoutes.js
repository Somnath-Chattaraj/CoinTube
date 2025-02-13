"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const tokenController_1 = require("../controllers/tokenController");
const tokenRouter = express_1.default.Router();
tokenRouter.route("/transaction/:tokenAddress").get(checkAuth_1.default, tokenController_1.transaction);
tokenRouter.route("/listedToken").get(checkAuth_1.default, tokenController_1.listedToken);
exports.default = tokenRouter;
