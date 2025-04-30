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
router.get("/", getSuppliers as RequestHandler);

// Get a single supplier
router.get("/:id", getSupplier as RequestHandler);

// Create a new supplier
router.post("/", createSupplier as RequestHandler);

// Update a supplier
router.put("/:id", updateSupplier as RequestHandler);

// Delete a supplier
router.delete("/:id", deleteSupplier as RequestHandler);

export default router; 