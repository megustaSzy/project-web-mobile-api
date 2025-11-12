import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; // ✅ tambahkan ini

dotenv.config();

import express from "express";
import userRoutes from "./routes/userRoute";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",   // sesuaikan dengan frontend-mu
  credentials: true,                 // ✅ agar cookie bisa dikirim
}));

app.use(cookieParser()); // ✅ daftarkan middleware cookie-parser

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
