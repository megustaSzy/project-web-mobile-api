import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; // ✅ tambahkan ini

dotenv.config();

import express from "express";
import userRoute from "./routes/userRoute";
import authRoute from "./routes/authRoute";
import destinationRoute from "./routes/destinationRoute";
import pickupLocationRoute from "./routes/pickupLocationRoute";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",   // sesuaikan dengan frontend-mu
  credentials: true,                 // ✅ agar cookie bisa dikirim
}));

app.use(cookieParser()); // ✅ daftarkan middleware cookie-parser

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/destinations", destinationRoute);
app.use("/api/pickup-locations", pickupLocationRoute);

app.use(errorHandler);

export default app;
