<<<<<<< HEAD
import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  updateProduct,
  createProduct,
  deleteProduct,
} from "../controllers/productController.ts";
import { getAllUsers } from "../controllers/userController.ts";
import { addTreatment, deleteTreatment, getAllPatients, getPatientTreatment, updateTreatment } from '../controllers/treatmentController.ts';  // Corrected import
=======
import express, { Request, Response } from "express";
const router = express.Router();
>>>>>>> cc22e1b7b7260b8ecf651b72e0cacc655645d6cc

// Importing controllers for products
import { createProduct, getProducts, deleteProduct, updateProduct } from '../controllers/productContoller.ts';
//Signup and login routes - pulindu
import { getAllUsers, registerUser, loginUser } from "../controllers/signupController.ts"; 
// Import inventory controller functions
import { getInventory, addItem, updateQuantity, deleteItem } from "../controllers/inventoryController.ts";
import { addTreatment } from '../controllers/treatmentController.ts';

// Middleware to parse JSON request bodies
router.use(express.json());

// Routes for handling products
router.post('/product/add', createProduct);  // Route to add a new product
router.get('/products', getProducts);  // Route to get all products

// Delete Product by ID
router.delete('/products/:id', deleteProduct);

// Update product route
router.put('/products/:id', updateProduct);

// api/users/
router.route("/users").get(getAllUsers).post(registerUser); // POST uses registerUser

// api/users/login (new login route)
router.route("/users/login").post(loginUser); // POST uses loginUser


// api/inventory/
router.get("/inventory", getInventory); // Get all inventory items
router.post("/inventory", addItem); // Add an item to the inventory
router.put("/inventory/:id", updateQuantity); // Update the quantity of an inventory item
router.delete("/inventory/:id", deleteItem); // Delete an inventory item

// api/treatments
router.post('/treatments', addTreatment);
router.get('/treatments', getAllPatients);
router.get('/treatments/:id', getPatientTreatment);
router.put('/treatments/:id', updateTreatment);
router.delete('/treatments/:id', deleteTreatment);


<<<<<<< HEAD
=======
  router.post('/treatments', addTreatment);
>>>>>>> cc22e1b7b7260b8ecf651b72e0cacc655645d6cc

export default router;
