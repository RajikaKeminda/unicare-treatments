import { Request, Response } from 'express';
import Supplier from '../models/SupplierModel';

// Get all suppliers
export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: suppliers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching suppliers",
      error: error.message,
    });
  }
};

// Get a single supplier
export const getSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }
    res.status(200).json({
      success: true,
      data: supplier,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching supplier",
      error: error.message,
    });
  }
};

// Create a new supplier
export const createSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      data: supplier,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Error creating supplier",
      error: error.message,
    });
  }
};

// Update a supplier
export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      data: supplier,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Error updating supplier",
      error: error.message,
    });
  }
};

// Delete a supplier
export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error deleting supplier",
      error: error.message,
    });
  }
}; 