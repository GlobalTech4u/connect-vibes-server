import express from "express";

import { loginUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/login").post(loginUser);

export default router;
