"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.route("/signup").post(userController_1.registerUser);
router.route("/login").post(userController_1.loginUser);
router.route("/updateName").post(userController_1.updateName);
router.route("/me").get(checkAuth_1.default, userController_1.getUser);
router.route("/updateWallet").post(checkAuth_1.default, userController_1.updateUserWallet);
router.route("/getTokens").get(checkAuth_1.default, userController_1.getUserOwnedTokens);
router.route("/logout").post(userController_1.logoutUser);
exports.default = router;
