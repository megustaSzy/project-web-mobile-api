import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import passport from "./config/passport";

import { requestLogger } from "./middlewares/logger";

import userRoute from "./routes/userRoute";
import authRoute from "./routes/authRoute";
import destinationRoute from "./routes/destinationRoute";
import pickupLocationRoute from "./routes/pickupLocationRoute";
import scheduleRoute from "./routes/scheduleRoute";
import regionRoute from "./routes/regionRoute";
import orderRoute from "./routes/orderRoute";
import adminOrderRoute from "./routes/adminOrderRoute";
import categoryRoute from "./routes/categoryRoute";
import aboutRoute from "./routes/aboutRoute";
import statRoute from "./routes/statRoute";
import paymentRoute from "./routes/paymentRoute";
import teamRoute from "./routes/teamRoute";
import testimoniRoute from "./routes/testimoniRoute";

const app = express();

// Body parser
app.use(express.json());

app.use(requestLogger);

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Cookie parser
app.use(cookieParser());

// Passport
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "Welcome Server API",
    success: true,
  });
});

// ROUTES
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/destinations", destinationRoute);
app.use("/api/pickup-locations", pickupLocationRoute);
app.use("/api/schedules", scheduleRoute);
app.use("/api/region", regionRoute);
app.use("/api/orders", orderRoute);
app.use("/api/admin/orders", adminOrderRoute);
app.use("/api/category", categoryRoute);
app.use("/api/about", aboutRoute);
app.use("/api/count", statRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/team", teamRoute);
app.use("/api/testimoni", testimoniRoute);

// Public upload folder
app.use("/uploads", express.static("public/uploads"));

// TESTING
console.log(process.env.FRONTEND_URL);

export default app;

// total dest, kategori, pengguna,
