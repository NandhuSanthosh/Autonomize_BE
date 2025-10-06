import mongoose from "mongoose";

export default async function conntToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connection established");
  } catch (error) {
    console.error("DB connection failed");
    throw error;
  }
}
