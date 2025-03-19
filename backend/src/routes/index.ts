import express, { Request, Response } from "express";
const router = express.Router();

// Importing controllers for products
import { createProduct, getProducts, deleteProduct, updateProduct } from '../controllers/productContoller.ts';
import { getAllUsers, registerUser, loginUser } from "../controllers/signupController.ts"; 
// Import inventory controller functions
import { getInventory, addItem, updateQuantity, deleteItem, updateItem} from "../controllers/inventoryController.ts";

// Middleware to parse JSON request bodies
router.use(express.json());

// Routes for handling products
router.post('/product/add', createProduct);  // Route to add a new product
router.get('/products', getProducts);  // Route to get all products

// Delete Product by ID
router.delete('/products/:id', deleteProduct);

// Update product route
router.put('/products/:id', updateProduct);


//Signup and login routes - pulindu

// api/users/
router.route("/users").get(getAllUsers).post(registerUser); // POST uses registerUser

// api/users/login (new login route)
router.route("/users/login").post(loginUser); // POST uses loginUser


// api/inventory/
router.get("/inventory", getInventory); // Get all inventory items
router.post("/inventory", addItem); // Add an item to the inventory
router.put("/inventory/:id", updateQuantity); // Update the quantity of an inventory item
router.delete("/inventory/:id", deleteItem); // Delete an inventory item
router.put("/inventory-item/:id", updateItem); // Update this line
export default router;
