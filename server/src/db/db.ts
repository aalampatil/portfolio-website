import mongoose from "mongoose";
const db_name = "portfolio-ap"

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${db_name}`
    );

    console.log(
      `mongoDB connected !! dbHost: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("\n db.js catch mongodb error", error);
    process.exit(1);
  }
};