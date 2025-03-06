import express from "express";

import "dotenv/config";

import apiRouter from "./routes/index.ts";

import { connectToMongoDB } from "./util/dbConnector.ts";

const app = express();
const PORT = process.env.PORT;

//  DB Connection -->
connectToMongoDB();

//  Middleware -->
app.use(express.json()); // set req.body as a JSON

//  Routes -->
app.use("/api", apiRouter);

//  Start server -->
app
  .listen(PORT, () => {
    const now = new Date().toLocaleString();
    console.log(`[${now}]  Server is up and running on port number: ${PORT}`);
  })
  .on("error", (error) => {
    console.error(`Error occurred: ${error.message}`);
  });
