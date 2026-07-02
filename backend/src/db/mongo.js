import mongoose from "mongoose";
import config   from "../../config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongo.uri);
    console.log("🍃  MongoDB connected:", config.mongo.uri);
  } catch (err) {
    console.error("❌  MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
