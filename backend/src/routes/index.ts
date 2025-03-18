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

// api/treatments
router.post('/treatments', addTreatment);
router.get('/treatments', getAllPatients);
router.get('/treatments/:id', getPatientTreatment);
router.put('/treatments/:id', updateTreatment);
router.delete('/treatments/:id', deleteTreatment);



export default router;
