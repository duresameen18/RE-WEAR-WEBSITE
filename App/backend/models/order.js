import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  buyerId: { type: String, required: true },
  buyerName: { type: String, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  sellerId: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  size: { type: String, default: "" },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  status: { type: String, default: "pending" },
  createdAt: { type: String, required: true },
});

export default mongoose.model("Order", orderSchema);
