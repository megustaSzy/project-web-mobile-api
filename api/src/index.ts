import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";


import express from "express";
import userRoute from "./routes/userRoute";
import authRoute from "./routes/authRoute";
import destinationRoute from "./routes/destinationRoute";
import pickupLocationRoute from "./routes/pickupLocationRoute";
import scheduleRoute from "./routes/scheduleRoute";
import provinceRoute from "./routes/external";
import orderRoute from "./routes/orderRoute";
import adminOrderRoute from "./routes/adminOrderRoute";  
import categoryRoute from "./routes/categoryRoute";
import aboutRoute from "./routes/aboutRoute"
import passport from "./config/passport";

// import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

// CORS
app.use(cors({
  origin: true,
  credentials: true,
}));

// Cookie parser
app.use(cookieParser());
app.use(passport.initialize())

// ROUTES
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/destinations", destinationRoute);
app.use("/api/pickup-locations", pickupLocationRoute);
app.use("/api/schedules", scheduleRoute);
app.use("/api/region", provinceRoute);
app.use("/api/orders", orderRoute);
app.use("/api/admin/orders", adminOrderRoute);  
app.use("/api/category", categoryRoute);
app.use("/api/about", aboutRoute)

// console.log(process.env.GOOGLE_CLIENT_ID);
// console.log(process.env.GOOGLE_CLIENT_SECRET);
// Error handler
// app.use(errorHandler);

export default app;
