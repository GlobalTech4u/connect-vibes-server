import fs from "fs";

function logReqRes(fileName) {
  return (req, res, next) => {
    fs.appendFile(
      fileName,
      `${Date.now()}:  ${req?.ip}  ${req?.method}  ${req?.path}\n`,
      (err) => {
        if (err) {
          throw err;
        }
        console.log("log created!");
        next();
      }
    );
  };
}

export { logReqRes };
