import express from "express";
import "dotenv/config";
import cors from "cors";  // Import CORS
import apiRouter from "./routes/index.ts";
import { connectToMongoDB } from "./util/dbConnector.ts";

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your frontend
app.use(cors({
  origin: '*', // Your frontend URL
  methods: ['GET', 'POST', 'PATCH', 'DELETE','PUT'],
  allowedHeaders: ['Content-Type']
}));


app.options('*', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(200);
});

// DB Connection -->
connectToMongoDB();

// Middleware -->
app.use(cors()); // Enable CORS
app.use(express.json()); // Set req.body as JSON

// Routes -->
app.use("/api", apiRouter);

// Start server -->
app
  .listen(PORT, () => {
    const now = new Date().toLocaleString();
    console.log(`[${now}]  Server is up and running on port number: ${PORT}`);
  })
  .on("error", (error) => {
    console.error(`Error occurred: ${error.message}`);
  });

 