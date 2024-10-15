import jwt from "jsonwebtoken";

import { API_RESPONSES } from "../constants/api.constants.js";

const authenticateUser = (req, res, next) => {
  if (req?.headers?.authorization) {
    const token = req?.headers?.authorization?.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res
          .status(403)
          .json({ error: error, message: API_RESPONSES.UNAUTHORISED });
      }
      return next();
    });
  } else {
    return res.status(403).json({ error: API_RESPONSES.NO_CREDENTIALS });
  }
};

export { authenticateUser };
