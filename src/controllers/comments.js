import {
	createCommentHandler,
	findCommentById,
	findCommentByTaskId,
	updateCommentById,
} from "../models/methods/commentMethods.js";
import { findTaskById } from "../models/methods/taskMethods.js";
import CustomError from "../utils/CustomError.js";

export const createComment = async (req, res, next) => {
	try {
		const { taskId, text } = req.body;
		const { _id: author } = req.user;

		if (!taskId || !text) {
			return next(
				new CustomError(
					400,
					"Invalid request, taskId and text are required"
				)
			);
		}

		const task = await findTaskById(taskId);
		if (!task) {
			return next(
				new CustomError(400, "Invalid request, Task not found")
			);
		}

		const data = {
			taskId,
			author,
			text,
		};
		const comment = await createCommentHandler(data);

		res.status(200).json({
			response: "000",
			data: {
				comment,
			},
			message: "Comment posted successfully",
		});
	} catch (error) {
		console.log("Error in  createComment controller: ", error);
		next(new CustomError(500));
	}
};

export const getCommentsByTaskId = async (req, res, next) => {
	try {
		const { taskId } = req.params;

		if (!taskId) {
			return next(
				new CustomError(400, "Invalid request, taskId are required")
			);
		}

		const comments = await findCommentByTaskId(taskId);

		res.status(200).json({
			response: "000",
			data: {
				comments,
			},
			message: "Comments fetched successfully",
		});
	} catch (error) {
		console.log("Error in  getCommentsByTaskId controller: ", error);
		next(new CustomError(500));
	}
};

export const deleteComment = async (req, res, next) => {
	try {
		const { commentId } = req.params;
		const { _id: author } = req.user;

		if (!commentId) {
			return next(
				new CustomError(400, "Invalid request, commentId are required")
			);
		}

		const comment = await findCommentById(commentId);
		if (!comment) {
			return next(
				new CustomError(400, "Invalid request, comment not found")
			);
		}

		if (comment.author.toString() !== author.toString()) {
			return next(
				new CustomError(
					400,
					"Invalid request, comment can only be deleted by the author"
				)
			);
		}

		const result = await updateCommentById(commentId, {
			isDeleted: true,
		});

		if (!result) {
			return next(
				new CustomError(
					500,
					"Something went wrong while delete your comment"
				)
			);
		}

		res.status(200).json({
			response: "000",
			data: {},
			message: "Comments deleted successfully",
		});
	} catch (error) {
		console.log("Error in  deleteComment controller: ", error);
		next(new CustomError(500));
	}
};

export const updateComment = async (req, res, next) => {
	try {
		const { text } = req.body;
		const { commentId } = req.params;
		const { _id: author } = req.user;

		if (!commentId) {
			return next(
				new CustomError(400, "Invalid request, commentId are required")
			);
		}

		const comment = await findCommentById(commentId);
		if (!comment) {
			return next(
				new CustomError(400, "Invalid request, comment not found")
			);
		}

		if (comment.author.toString() !== author.toString()) {
			return next(
				new CustomError(
					400,
					"Invalid request, comment can only be updated by the author"
				)
			);
		}

		const result = await updateCommentById(commentId, {
			text,
		});

		if (!result) {
			return next(
				new CustomError(
					500,
					"Something went wrong while delete your comment"
				)
			);
		}

		res.status(200).json({
			response: "000",
			data: {},
			message: "Comments updated successfully",
		});
	} catch (error) {
		console.log("Error in  updateComment controller: ", error);
		next(new CustomError(500));
	}
};
