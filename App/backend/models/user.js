import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: "" },
  shopName: { type: String, default: "" },
  passwordHash: { type: String, required: true, select: false },
  passwordSalt: { type: String, required: true, select: false },
  role: { type: String, enum: ["buyer", "seller"], required: true },
  status: { type: String, default: "active" },
  moderationReason: { type: String, default: "" },
});

export default mongoose.model("User", userSchema);
