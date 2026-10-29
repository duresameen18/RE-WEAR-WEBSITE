import mongoose from "mongoose";
import Complaint from "../models/complaint.js";

export async function addComplaint(req, res) {
  try {
    return res.status(201).json(await Complaint.create(req.body));
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Could not save complaint:", error.message);
    return res.status(500).json({ message: "The complaint could not be saved." });
  }
}

export async function getComplaints(req, res) {
  try {
    const filter = req.query.userId ? { userId: req.query.userId } : {};
    return res.json(await Complaint.find(filter));
  } catch (error) {
    console.error("Could not load complaints:", error.message);
    return res.status(500).json({ message: "Complaints could not be loaded." });
  }
}

export async function getComplaint(req, res) {
  try {
    const complaint = await Complaint.findOne({ id: req.params.id });
    if (!complaint) return res.status(404).json({ message: "Complaint not found." });
    return res.json(complaint);
  } catch (error) {
    console.error("Could not load complaint:", error.message);
    return res.status(500).json({ message: "The complaint could not be loaded." });
  }
}

export async function updateComplaint(req, res) {
  const updates = { status: req.body.status };
  try {
    const complaint = await Complaint.findOneAndUpdate(
      { id: req.params.id },
      updates,
      { returnDocument: "after", runValidators: true },
    );
    if (!complaint) return res.status(404).json({ message: "Complaint not found." });
    return res.json(complaint);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Could not update complaint:", error.message);
    return res.status(500).json({ message: "The complaint could not be updated." });
  }
}

export async function deleteComplaint(req, res) {
  try {
    const complaint = await Complaint.findOneAndDelete({ id: req.params.id });
    if (!complaint) return res.status(404).json({ message: "Complaint not found." });
    return res.json({ message: "Complaint deleted successfully." });
  } catch (error) {
    console.error("Could not delete complaint:", error.message);
    return res.status(500).json({ message: "The complaint could not be deleted." });
  }
}
