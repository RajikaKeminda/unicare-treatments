import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  try {
    const URL = process.env.MONGODB_URL || "mongodb://localhost:27017/unicare";
    await mongoose.connect(URL);
    const now = new Date().toLocaleString();
    console.log(`[${now}] ✅ MongoDB Connection Success!`);
  } catch (err) {
    const now = new Date().toLocaleString();
    console.error(`[${now}] ❌ MongoDB Connection Failed:`, err);
    console.log("\nTo fix this error, you need to either:");
    console.log("1. Install and run MongoDB locally");
    console.log("2. Use MongoDB Atlas and set MONGODB_URL in your .env file");
    process.exit(1);
  }
};
