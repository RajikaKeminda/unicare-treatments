import express, { Request, Response } from "express";
const router = express.Router();

// Importing controllers for products
//Signup and login routes - pulindu
import { createProduct, getProducts, deleteProduct, updateProduct } from '../controllers/productContoller.ts';
import { addTreatment } from '../controllers/treatmentController.ts';
import { getAllUsers, registerUser, loginUser } from "../controllers/signupController.ts"; 

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


  router.post('/treatments', addTreatment);

export default router; // Export the router

