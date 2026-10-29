import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  style: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  alt: { type: String, required: true },
  size: { type: String, default: "" },
  description: { type: String, default: "" },
  sellerId: { type: String, required: true },
  status: { type: String, required: true },
});

export default mongoose.model("Product", productSchema);
