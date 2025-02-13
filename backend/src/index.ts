import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/userRoutes";
import tokenRouter from "./routes/tokenRoutes";
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
    // console.log("Request logged:", req.method, req.path);
    next();
  });
  
  app.get("/", (req, res) => {
    res.send("Server is running");
  });
  
  app.use("/api/user", router);
  app.use("/api/token", tokenRouter);
app.listen((process.env.PORT || 3000), () => {
    console.log(`🚀 Server is running on port ${process.env.PORT || 3000}`);
});