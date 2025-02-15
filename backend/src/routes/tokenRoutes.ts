import express from 'express';
import requireAuth from "../middleware/checkAuth"
import { createdToken, listedToken, transaction } from '../controllers/tokenController';

const tokenRouter = express.Router();

tokenRouter.route("/transaction/:tokenAddress").get(requireAuth, transaction);
tokenRouter.route("/listedToken").get(requireAuth, listedToken);
tokenRouter.route("/createdToken").get(requireAuth, createdToken);

export default tokenRouter;