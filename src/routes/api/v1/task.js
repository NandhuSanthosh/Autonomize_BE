import express from "express";
const router = express.Router();

import { authenticateUser } from "../../../middleware/authenticat-user.js";
import {
	deleteTask,
	getFetchAllUserTask,
	getFetchSingleUserTask,
	postCreateTask,
	putUpdateTask,
} from "../../../controllers/task.js";

router.use(authenticateUser);

router.post("/", postCreateTask);
router.get("/", getFetchAllUserTask);
router.get("/:taskId", getFetchSingleUserTask);
router.put("/:taskId", putUpdateTask);
router.delete("/:taskId", deleteTask);

export default router;
