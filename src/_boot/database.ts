import mongoose from "mongoose";
import { config } from "./config";

export const connect = async () => {
  try {
    const dns = require("node:dns");
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    const user = config.mongo.username;
    const pass = config.mongo.password;
    const uri = `mongodb+srv://${user}:${pass}@cluster0.trekfmx.mongodb.net/?appName=Cluster0`;
    await mongoose.connect(uri);
    console.log(`🍃 Database Established connection with MongoDB`);
  } catch (error: any) {
    console.error(`❌ Database Connection failed`);
    console.error(error.message);
  }
};
