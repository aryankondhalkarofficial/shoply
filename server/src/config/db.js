import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(`Failed to connect MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
