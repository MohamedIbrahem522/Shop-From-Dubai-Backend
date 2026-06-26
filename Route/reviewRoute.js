import express from "express";
import {
  uploadReview,
  getReviews,
  deleteReview,
} from "../controllers/reviewController.js";

import { protect, isSuperAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getReviews);

router.post("/", protect, isSuperAdmin, upload.single("image"), uploadReview);

router.delete("/:id", protect, isSuperAdmin, deleteReview);

export default router;
