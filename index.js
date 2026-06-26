import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";

import Admin from "./models/admin.js";

import adminRoute from "./Route/adminRoute.js";
import productRoute from "./Route/productRoute.js";
import categoryRoute from "./Route/categoryRoute.js";
import reviewRoute from "./Route/reviewRoute.js";

import cloudinary from "./config/cloudinary.js";

const app = express();

// Debug: check Cloudinary env vars (remove later)
app.get("/debug/cloudinary", async (req, res) => {
  try {
    const ping = await cloudinary.api.ping();
    res.json({ status: "ok", cloud_name: process.env.CLOUDINARY_NAME, ping: ping.status });
  } catch (e) {
    res.json({ status: "error", cloud_name: process.env.CLOUDINARY_NAME, error: e.message });
  }
});


// ======================
// MIDDLEWARES
// ======================

app.use(express.json());
app.use(helmet());
app.use(cors());


// ======================
// ROUTES
// ======================

app.use("/reviews", reviewRoute);

app.use("/admin", adminRoute);
app.use("/products", productRoute);
app.use("/categories", categoryRoute);


// ======================
// GLOBAL ERROR HANDLER
// ======================

app.use((err, req, res, next) => {

  console.error("🔥 ERROR:", err);

  res.status(500).json({
    message: err.message,
  });

});


// ======================
// DATABASE + SERVER START
// ======================

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Mongo Connected");

    const existingAdmin = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (!existingAdmin) {
      await Admin.create({
        name: "Super Admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "super_admin",
        isActive: true,
      });
      console.log("Super Admin created");
    }
  })
  .catch((err) => {
    console.error("DB Connection Error:", err);
  });

if (process.env.NODE_ENV !== "vercel") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;