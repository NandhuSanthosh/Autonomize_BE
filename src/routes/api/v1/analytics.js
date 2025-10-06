import express from "express";
import {
	fetchOverview,
	getTaskTrend,
	getUserPerformance,
} from "../../../controllers/analytics.js";
import { authenticateUser } from "../../../middleware/authenticat-user.js";
const router = express.Router();

router.use(authenticateUser);

router.get("/overview", fetchOverview);
router.get("/user-performance", getUserPerformance);
router.get("/task-trend", getTaskTrend);

export default router;
