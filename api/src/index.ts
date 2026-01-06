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
import regionRoute from "./routes/regionRoute";
import orderRoute from "./routes/orderRoute";
import adminOrderRoute from "./routes/adminOrderRoute";
import categoryRoute from "./routes/categoryRoute";
import aboutRoute from "./routes/aboutRoute";
import statRoute from "./routes/statRoute";
import paymentRoute from "./routes/paymentRoute";
import teamRoute from "./routes/teamRoute";
import testimoniRoute from "./routes/testimoniRoute";
import bannerRoute from "./routes/bannerRoute";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(requestLogger);

app.use(
  cors({
    origin: ["http://localhost:3000", "https://lamigo.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "Welcome Server API",
    success: true,
  });
});

app.use("/api/users", userRoute); // avatar
app.use("/api/team", teamRoute); // image
app.use("/api/region", regionRoute); // image
app.use("/api/destinations", destinationRoute); // image
app.use("/api/banner", bannerRoute); // image
app.use("/api/about", aboutRoute); // image

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/pickup-locations", pickupLocationRoute);
app.use("/api/orders", orderRoute);
app.use("/api/admin/orders", adminOrderRoute);
app.use("/api/category", categoryRoute);
app.use("/api/count", statRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/testimoni", testimoniRoute);

app.use(errorHandler);

export default app;
