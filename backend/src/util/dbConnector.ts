import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  try {
    const URL = process.env.MONGODB_URL || "8081";
    await mongoose.connect(URL);
    const now = new Date().toLocaleString();
    console.log(`[${now}] ✅ MongoDB Connection Success!`);
  } catch (err) {
    const now = new Date().toLocaleString();
    console.error(`[${now}] ❌ MongoDB Connection Failed:`, err);
    process.exit(1); // Exit process with failure
  }
};
