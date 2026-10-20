import mongoose from "mongoose";
import { config } from "./config";
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const connect = async () => {
  try {
    const user = config.mongo.username;
    const pass = config.mongo.password;
    const uri = `mongodb+srv://${user}:${pass}@cluster0.trekfmx.mongodb.net/hiveHub?appName=Cluster0`;
    await mongoose.connect(uri);
    console.log(`🍃 Database Established connection with MongoDB`);
  } catch (error: any) {
    console.error(`❌ Database Connection failed`);
    console.error(error.message);
  }
};
