import express from 'express';
import requireAuth from "../middleware/checkAuth"
import { listedToken, transaction } from '../controllers/tokenController';

const tokenRouter = express.Router();

tokenRouter.route("/transaction/:tokenAddress").get(requireAuth, transaction);
tokenRouter.route("/listedToken").get(requireAuth, listedToken);

export default tokenRouter;