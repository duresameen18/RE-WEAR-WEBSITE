import { Router } from "express";
import {
  addExchange,
  deleteExchange,
  getExchange,
  getExchanges,
  updateExchange,
} from "../controllers/exchangeController.js";

const router = Router();

router.post("/", addExchange);
router.get("/", getExchanges);
router.get("/:id", getExchange);
router.put("/:id", updateExchange);
router.delete("/:id", deleteExchange);

export default router;
