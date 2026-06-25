import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  restoreCategory,
  hardDeleteCategory
} from "../controllers/categoryController.js";

import { protect, isSuperAdmin } from "../middleware/auth.js";

const router = express.Router();

/* ======================
   PUBLIC
====================== */
router.get("/", getCategories);

/* ======================
   ADMIN (SUPER ADMIN ONLY)
====================== */
router.post("/", protect, isSuperAdmin, createCategory);

router.put("/restore/:id", protect, isSuperAdmin, restoreCategory);
router.delete("/hard/:id", protect, isSuperAdmin, hardDeleteCategory);

router.put("/:id", protect, isSuperAdmin, updateCategory);
router.delete("/:id", protect, isSuperAdmin, deleteCategory);

export default router;