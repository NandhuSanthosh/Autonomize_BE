import express from "express";
const router = express.Router();

import v1Router from "./api/v1/index.js";
router.use("/api/v1/", v1Router);

export default router;
