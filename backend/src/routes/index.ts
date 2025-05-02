import express from "express";
const router = express.Router();

// Importing controllers for products
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  getProductById,
} from "../controllers/productContoller.ts";

// Import inventory controller functions
import {
  addItem,
  deleteItem,
  getInventory,
  updateItem,
  updateQuantity,
} from "../controllers/inventoryController.ts";

// Import treatment controller functions
import {
  addTreatment,
  deleteTreatment,
  getAllPatients,
  getPatientTreatment,
  updateTreatment,
  getPatientTreatments,
  addTreatmentMapping,
  getAllTreatmentMappings,
  getSuggestion,
} from "../controllers/treatmentController.ts";


// Product-inquiry-pulindu
import {
  submitAdviceRequest,
  getAllAdviceRequests,
} from "../controllers/product-inquiry.ts";

import {
  createReport,
  getAllReports,
  removeReport,
} from "../controllers/reportController.ts";

import userRoute from "./userRoute.ts";
import channelingRoute from "./channelingRoute.ts";
import appointmentRoute from "./appointmentRoute.ts";
import blogRoutes from "./blogRoutes.ts";
import categoryRoutes from "./categoryRoutes.js";
import commentRoutes from "./commentRoutes.ts";
import mediaRoutes from "./mediaRoutes.ts";

// Middleware to parse JSON request bodies
router.use(express.json());

// --------------------------------------------------------
// Routes for handling products
router.post("/product/add", createProduct); // Route to add a new product
router.get("/products", getProducts); // Route to get all products
// Delete Product by ID
router.delete("/products/:id", deleteProduct);
// Update product route
router.put("/products/:id", updateProduct);
router.get("/products/:id", getProductById);
// --------------------------------------------------------
// Routes for handling treatments
router.get("/treatments/patient/:email", getPatientTreatments);  // Get all treatments for a patient by email
router.post("/treatments", addTreatment); // Add a new treatment
router.get("/treatments", getAllPatients);  // Get all patients
router.get("/treatments/:id", getPatientTreatment);  // Get treatment for a specific patient
router.put("/treatments/:id", updateTreatment);  // Update treatment by ID
router.delete("/treatments/:id", deleteTreatment);  // Delete treatment by ID

// --------------------------------------------------------
// Routes for handling treatment mappings
router.post("/treatment-mappings", addTreatmentMapping);  // Add a new treatment mapping
router.get("/treatment-mappings", getAllTreatmentMappings);  // Get all treatment mappings
router.get('/suggestion/:diagnosis', getSuggestion); // Get treatment suggestion based on diagnosis


// --------------------------------------------------------
// Routes for handling inventory
router.get("/inventory", getInventory);  // Get all inventory items
router.post("/inventory", addItem);  // Add an item to the inventory
router.put("/inventory/:id", updateQuantity);  // Update the quantity of an inventory item
router.delete("/inventory/:id", deleteItem);  // Delete an inventory item
router.put("/inventory-item/:id", updateItem);  // Update an inventory item

// --------------------------------------------------------
// Other routes
router.use("/appointments", appointmentRoute);
router.use("/users", userRoute);
router.use("/channeling", channelingRoute);
router
  .route("/reports/:patientId")
  .post(createReport)
  .get(getAllReports)
  .put(removeReport);

// --------------------------------------------------------
router.use("/comments", commentRoutes);
router.use("/blog", blogRoutes);
router.use("/categories", categoryRoutes);
router.use("/media", mediaRoutes);
router.post("/submit-advice-request", submitAdviceRequest);

// Fetch all advice requests
router.get("/advice-requests", getAllAdviceRequests);

//order handling
//order
import { createOrder, getOrders, getOrderById, updateOrderStatus } from '../controllers/orderProductcontroller.ts';
router.post('/orders', createOrder);

// Get all orders
router.get('/', getOrders);

// Get single order by ID
router.get('/:id', getOrderById);

//update order status
router.patch('/orders/:id/status', updateOrderStatus);

export default router;
