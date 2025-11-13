import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; // ✅ tambahkan ini

dotenv.config();

import express from "express";
import userRoutes from "./routes/userRoute";
import authRoutes from "./routes/authRoutes";
// import destinationRoutes from "./routes/destinationRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",   // sesuaikan dengan frontend-mu
  credentials: true,                 // ✅ agar cookie bisa dikirim
}));

app.use(cookieParser()); // ✅ daftarkan middleware cookie-parser

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/destinations", destinationRoutes);

app.use(errorHandler);

export default app;
