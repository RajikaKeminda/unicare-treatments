import { Router } from "express";

//test

import {
  getAllProducts,
  getProductById,
  updateProduct,
  createProduct,
  deleteProduct,
} from "../controllers/productController.ts";

const router = Router();

/*
import { getAllUsers } from "../controllers/userController.ts";
// api/users/
router.route("/users").get(getAllUsers);
*/

// api/products/
router.route("/products").get(getAllProducts).post(createProduct);

// api/products/:id
router
  .route("/products/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

//Signup and login routes - pulindu
import { getAllUsers, registerUser, loginUser } from "../controllers/signupController.ts"; 

// api/users/
router.route("/users").get(getAllUsers).post(registerUser); // POST uses registerUser

// api/users/login (new login route)
router.route("/users/login").post(loginUser); // POST uses loginUser

export default router; // Export the router

