import { Router } from "express";

import {
  getAllProducts,
  getProductById,
  updateProduct,
  createProduct,
  deleteProduct,
} from "../controllers/productController.ts";
import { getAllUsers } from "../controllers/userController.ts";

const router = Router();

// api/users/
router.route("/users").get(getAllUsers);

// api/products/
router.route("/products").get(getAllProducts).post(createProduct);

// api/products/:id
router
  .route("/products/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

// Import inventory controller functions
import { getInventory, addItem, updateQuantity, deleteItem } from "../controllers/inventoryController.ts";

// api/inventory/
router.get("/inventory", getInventory); // Get all inventory items
router.post("/inventory", addItem); // Add an item to the inventory
router.put("/inventory/:id", updateQuantity); // Update the quantity of an inventory item
router.delete("/inventory/:id", deleteItem); // Delete an inventory item

export default router;
