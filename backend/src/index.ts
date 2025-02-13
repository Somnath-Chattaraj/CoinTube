import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import { syncNFTHoldersHandler } from "./controllers/syncNFT";
const app = express();


app.listen((process.env.PORT || 3000), () => {
    console.log(`🚀 Server is running on port ${process.env.PORT || 3000}`);
});