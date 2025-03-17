import express, { Request, Response } from "express";
const router = express.Router();

// Importing controllers for products
import { createProduct, getProducts } from '../controllers/productContoller.ts';

// Middleware to parse JSON request bodies
router.use(express.json());

// Routes for handling products
router.post('/products/add', createProduct);  // Route to add a new product
router.get('/products', getProducts);  // Route to get all products



//Signup and login routes - pulindu
import { getAllUsers, registerUser, loginUser } from "../controllers/signupController.ts"; 

// api/users/
router.route("/users").get(getAllUsers).post(registerUser); // POST uses registerUser

// api/users/login (new login route)
router.route("/users/login").post(loginUser); // POST uses loginUser

export default router; // Export the router

