import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import exchangeRoutes from "./routes/exchangeRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

const app = express();

// Middleware configurations
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/add_product", productRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/exchanges", exchangeRoutes);
app.use("/complaints", complaintRoutes);
app.use("/categories", categoryRoutes);

// Main baseline confirmation route
app.get("/", (req, res) => {
  res.send("Rewear Marketplace API is online and stable! 🚀");
});

const databaseURI = process.env.MONGO_URI;

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(databaseURI);
    console.log("Connected to MongoDB.");
    app.listen(PORT, () => {
      console.log(`Server actively listening on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failure:", error.message);
    process.exit(1);
  }
}

startServer();
