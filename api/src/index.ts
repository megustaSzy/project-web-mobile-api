import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userRoutes from "./routes/userRoute"
import authRoutes from "./routes/authRoutes"
import { errorHandler } from "./middlewares/errorHandler";


const app = express();
app.use(express.json());


app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)

app.use(errorHandler);

export default app;