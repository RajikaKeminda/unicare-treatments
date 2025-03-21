import express from "express";
const router = express.Router();

// Importing controllers for products
import { createProduct, deleteProduct, getProducts, updateProduct } from '../controllers/productContoller.ts';

// Import inventory controller functions
import { addItem, deleteItem, getInventory, updateItem, updateQuantity } from "../controllers/inventoryController.ts";

// Import treatment controller
import { addTreatment, deleteTreatment, getAllPatients, getPatientTreatment, updateTreatment } from '../controllers/treatmentController.ts';

//product-inquiry-pulindu
import { submitAdviceRequest, getAllAdviceRequests } from '../controllers/product-inquiry.ts'

import {
  checkUniqueUserName,
  signInUser,
  signUpUser,
  verifyUser,
} from "../controllers/userController.ts";
import appointmentRoute from "./appointmentRoute.ts";
import blogRoutes from "./blogRoutes.ts";
import commentRoutes from "./commentRoutes.ts";

import {
  createReport,
  getAllReports,
  removeReport,
} from "../controllers/reportController.ts";

// Middleware to parse JSON request bodies
router.use(express.json());

// Routes for handling products
router.post('/product/add', createProduct);  // Route to add a new product
router.get('/products', getProducts);  // Route to get all products

// Delete Product by ID
router.delete('/products/:id', deleteProduct);

// Update product route
router.put('/products/:id', updateProduct);

// api/treatments
router.post('/treatments', addTreatment);
router.get('/treatments', getAllPatients);
router.get('/treatments/:id', getPatientTreatment);
router.put('/treatments/:id', updateTreatment);
router.delete('/treatments/:id', deleteTreatment);


// api/inventory/
router.get("/inventory", getInventory); // Get all inventory items
router.post("/inventory", addItem); // Add an item to the inventory
router.put("/inventory/:id", updateQuantity); // Update the quantity of an inventory item
router.delete("/inventory/:id", deleteItem); // Delete an inventory item
router.put("/inventory-item/:id", updateItem); // Update this line


router.post('/treatments', addTreatment);


router.use("/appointments", appointmentRoute);
router.use("/comments", commentRoutes);
router.use("/blog", blogRoutes);

// --------------------------------------------------------
router.get("/user/check-username-unique/:username", checkUniqueUserName);
router.post("/user/sign-up", signUpUser);
router.post("/user/verify-code", verifyUser);
router.post("/user/sign-in", signInUser);


router.use("/comments", commentRoutes);
router.use("/blog", blogRoutes);

router.post('/submit-advice-request', submitAdviceRequest);

//fetch inquiries
// Fetch all advice requests
router.get('/advice-requests', getAllAdviceRequests);

export default router;