
import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("Already connected to MongoDB.");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to MongoDB."); 
    
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
      throw new Error("Failed to connect to MongoDB");
    // Handle the error appropriately
  }
};

export default dbConnect;


