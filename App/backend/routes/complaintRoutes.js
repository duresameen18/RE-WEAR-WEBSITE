import { Router } from "express";
import {
  addComplaint,
  deleteComplaint,
  getComplaint,
  getComplaints,
  updateComplaint,
} from "../controllers/complaintController.js";

const router = Router();

router.post("/", addComplaint);
router.get("/", getComplaints);
router.get("/:id", getComplaint);
router.put("/:id", updateComplaint);
router.delete("/:id", deleteComplaint);

export default router;
