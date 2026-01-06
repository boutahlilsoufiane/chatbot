import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/support_chatbot";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export const getNativeDB = () => {
  const client = mongoose.connection.getClient();
  return client.db("support_chatbot");
}