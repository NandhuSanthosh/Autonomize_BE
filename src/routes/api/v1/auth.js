import express from "express";
const router = express.Router();

import {
	login,
	refresh,
	signup,
	validateEmail,
} from "../../../controllers/auth.js";

router.post("/login", login);

router.post("/validate_email", validateEmail);
router.post("/signin", signup);
router.post("/refresh", refresh);

export default router;
