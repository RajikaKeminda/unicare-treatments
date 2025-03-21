import { Request, Response } from "express";
import Inventory from "../models/InventoryModel.ts";

// Get all inventory items
export const getInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch inventory." });
  }
};

// Add a new item
export const addItem = async (req: Request, res: Response) => {
  try {
    const { name, quantity, unit, perItemPrice, expiryDate } = req.body;
    const newItem = new Inventory({ name, quantity, unit, perItemPrice, expiryDate });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add item." });
  }
};

// Update item quantity
export const updateQuantity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const item = await Inventory.findByIdAndUpdate(id, { quantity }, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to update quantity." });
  }
};

// Delete an item
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Inventory.findByIdAndDelete(id);
    res.json({ message: "Item removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete item." });
  }
};

export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, quantity, unit, perItemPrice, expiryDate } = req.body;

    // Validate required fields
    if (!name || !quantity || !unit || !perItemPrice || !expiryDate) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    // Find and update the item
    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      { name, quantity, unit, perItemPrice, expiryDate },
      { new: true } // Return the updated document
    );

    if (!updatedItem) {
      res.status(404).json({ error: "Item not found." });
      return;
    }

    // Return the updated item
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Failed to update item." });
  }
};