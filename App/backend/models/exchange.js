import mongoose from "mongoose";

const exchangeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  buyerId: { type: String, required: true },
  buyerName: { type: String, required: true },
  offeredItem: { type: String, required: true },
  requestedItem: { type: String, required: true },
  offeredImage: { type: String, default: "" },
  size: { type: String, default: "" },
  description: { type: String, default: "" },
  status: { type: String, default: "pending" },
  createdAt: { type: String, required: true },
});

export default mongoose.model("Exchange", exchangeSchema);
