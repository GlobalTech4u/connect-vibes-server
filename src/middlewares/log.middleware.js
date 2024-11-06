import fs from "fs";
import logger from "../lib/logger.lib.js";

function logReqRes(fileName) {
  return (req, res, next) => {
    fs.appendFile(
      fileName,
      `${Date.now()}:  ${req?.ip}  ${req?.method}  ${req?.path}\n`,
      (err) => {
        if (err) {
          throw err;
        }
        logger.info("log created!");
        next();
      }
    );
  };
}

export { logReqRes };
