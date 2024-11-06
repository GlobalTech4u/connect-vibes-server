import jwt from "jsonwebtoken";

import { API_RESPONSES } from "../constants/api.constants.js";
import { generateToken } from "../helpers/jwt.helper.js";
import User from "../models/user.model.js";

const authenticateUser = (req, res, next) => {
  if (req?.headers?.authorization) {
    const token = req?.headers?.authorization?.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
      if (error && error.name === "TokenExpiredError") {
        // Token expired, try to refresh
        const refreshToken = req?.headers["refresh-token"];
        if (!refreshToken) {
          return res
            .status(403)
            .json({ error: error, message: API_RESPONSES.NO_CREDENTIALS });
        }

        try {
          const decodedRefresh = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
          );
          const user = await User.findById(decodedRefresh.userId);
          if (!user) {
            return res.status(403).json({ error: API_RESPONSES.UNAUTHORISED });
          }

          const { accessToken, refreshToken: newRefreshToken } =
            generateToken(user);
          res.setHeader("Authorization", `Bearer ${accessToken}`);
          res.setHeader("Refresh-Token", newRefreshToken);
          return next();
        } catch (refreshError) {
          return res
            .status(403)
            .json({ error: refreshError, message: API_RESPONSES.UNAUTHORISED });
        }
      } else if (error) {
        return res
          .status(403)
          .json({ error: error, message: API_RESPONSES.UNAUTHORISED });
      } else {
        return next();
      }
    });
  } else {
    return res.status(403).json({ error: API_RESPONSES.NO_CREDENTIALS });
  }
};

export { authenticateUser };
