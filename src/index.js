import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import swaggerUi from "swagger-ui-express";
import logger from "./lib/logger.lib.js";

import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import authRouter from "./routes/auth.routes.js";
import initializeMongoDB from "./db/initializeDB.js";
import initializeSocket from "./socket/initializeSocket.js";
import { authenticateUser } from "./middlewares/auth.middleware.js";
import { API_RESPONSES } from "./constants/api.constants.js";
import { swaggerDocument, swaggerUIOptions } from "./docs/swagger.docs.js";

dotenv.config({ path: "./environments/.env.local" });

const app = express();
const PORT = process.env.PORT;
const MONGO_DB_URL = process.env.MONGO_DB_URL;
const CLIENT_APP_URL = process.env.CLIENT_APP_URL;

app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerDocument, swaggerUIOptions));

app.use(
  cors({
    origin: CLIENT_APP_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Refresh-Token"],
    credentials: true,
  })
);

app.options(
  "*",
  cors({
    origin: CLIENT_APP_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Refresh-Token"],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use("/api/users/*", authenticateUser);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/users/:userId/posts", postRouter);
app.get("*", (req, res) => {
  res.send(API_RESPONSES.DEFAULT_MESSAGE);
});

const httpServer = http.createServer(app);

const server = httpServer.listen(PORT, () =>
  logger.info(`server started at port ${PORT}`)
);
initializeMongoDB(MONGO_DB_URL, server);
initializeSocket(CLIENT_APP_URL, server);
