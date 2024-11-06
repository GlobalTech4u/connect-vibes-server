import mongoose from "mongoose";
import logger from "../lib/logger.lib.js";

const initializeMongoDB = async (url, server) => {
  const options = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 70000,
  };

  return mongoose
    .connect(url, options)
    .then(() => logger.info("mongodb connected"))
    .catch((error) => {
      logger.error("mongodb connection failed ", error);
      server.close(() => logger.error("server closed"));
    });
};

const db = mongoose.connection;

export { db };
export default initializeMongoDB;
