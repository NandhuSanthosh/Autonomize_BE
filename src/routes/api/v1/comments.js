import express from "express";
const router = express.Router();

import { authenticateUser } from "../../../middleware/authenticat-user.js";
import {
	createComment,
	deleteComment,
	getCommentsByTaskId,
	updateComment,
} from "../../../controllers/comments.js";

router.use(authenticateUser);

router.post("/", createComment);
router.get("/:taskId", getCommentsByTaskId); // fetch all comments of a task
router.delete("/:commentId", deleteComment);
router.put("/:commentId", updateComment);

export default router;
