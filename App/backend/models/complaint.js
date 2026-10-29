import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  subject: { type: String, required: true },
  details: { type: String, required: true },
  status: { type: String, default: "open" },
  createdAt: { type: String, required: true },
});

export default mongoose.model("Complaint", complaintSchema);
