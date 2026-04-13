import express from "express";
import {
  createSlot,
  getAvailableSlots,
  bookSlot
} from "../controllers/slotController.js";

import { protect, isAdvisor, isStudent } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, isAdvisor, createSlot);
router.get("/available", protect, getAvailableSlots);
router.post("/book/:id", protect, isStudent, bookSlot);

export default router;