import express, { RequestHandler } from "express";
import {
  createSupplier,
  deleteSupplier,
  getSupplier,
  getSuppliers,
  updateSupplier,
} from "../controllers/supplierController.ts";

const router = express.Router();

// Get all suppliers
router.get("/", getSuppliers);

// Get a single supplier
router.get("/:id", getSupplier);

// Create a new supplier
router.post("/", createSupplier);

// Update a supplier
router.put("/:id", updateSupplier as RequestHandler);

// Delete a supplier
router.delete("/:id", deleteSupplier);

export default router; 