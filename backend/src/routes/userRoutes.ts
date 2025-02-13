import express from 'express';
import requireAuth from "../middleware/checkAuth"
import { getUser, getUserOwnedTokens, loginUser, logoutUser, registerUser, updateName, updateUserWallet } from '../controllers/userController';
const router = express.Router();

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/updateName").post(updateName);
router.route("/me").get(requireAuth, getUser);
router.route("/updateWallet").post(requireAuth, updateUserWallet);
router.route("/getTokens").get(requireAuth, getUserOwnedTokens);
router.route("/logout").post(logoutUser);

export default router;