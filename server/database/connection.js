import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import ENV from "../config.js";

export const connect = async () => {
  const mongod = await MongoMemoryServer.create();
  const getUri = mongod.getUri();

  // const db = await mongoose.connect(getUri, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });
  const db = await mongoose.connect(ENV.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB connected at ${getUri}`);

  return db;
};
