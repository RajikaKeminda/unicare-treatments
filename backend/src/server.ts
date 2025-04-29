import "./polyfills.js";
import express from "express";
import "dotenv/config";
import cors from "cors"; // Import CORS middleware
import apiRouter from "./routes/index"; // Your API routes
import { connectToMongoDB } from "./util/dbConnector"; // MongoDB connection utility
import { handleOtherErrors, handleURIError } from "./util/individualErrors"; // error handling

const app = express();
const PORT = process.env.PORT || 8001; // Ensure a default port if not set

connectToMongoDB();

// Middleware -->
// Enable CORS for requests only from localhost:3000 (your Next.js frontend)
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' })); // CORS for specific origin
app.use(express.json()); // Parse incoming JSON requests

// Routes -->
app.use("/api", apiRouter); // All routes will be prefixed with "/api"

// Error handling middleware
app.use(handleURIError);
app.use(handleOtherErrors);

// Start server -->
app.listen(PORT, () => {
  const now = new Date().toLocaleString();
  console.log(`[${now}] Server is up and running on port number: ${PORT}`);
})
.on("error", (error) => {
  console.error(`Error occurred: ${error.message}`);
});
