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

export default router;
