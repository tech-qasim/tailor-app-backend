import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `\n mongo db connected !! db host: ${connectionInstance.connection.host}`
    );
  } catch (e) {
    console.log("mongo db connection error", e);
    process.exit(1);
  }
};

export default connectDB;
