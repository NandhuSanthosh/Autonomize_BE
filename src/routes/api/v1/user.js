import express from "express";
import { findUserByEmail } from "../../../controllers/user.js";
import { authenticateUser } from "../../../middleware/authenticat-user.js";
const router = express.Router();

router.use(authenticateUser);

router.get("/", findUserByEmail);

export default router;
