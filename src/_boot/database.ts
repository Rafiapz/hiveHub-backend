import mongoose from "mongoose";
import { config } from "./config";

export const connect = async () => {
  try {
    const user = config.mongo.username;
    const pass = config.mongo.password
    const uri = `mongodb+srv://rafikandathuvayal:${pass}@cluster0.trekfmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(uri);

    console.log(`🍃 Database Established connection with MongoDB`);

  } catch (error: any) {
    console.error(`❌ Database Connection failed`);
    console.error(error.message);
  }
};
