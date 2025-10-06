import CustomError from "../utils/CustomError.js";
import {
	createTask,
	deleteTaskById,
	fetchAuthorOrAssignedToTasks,
	findTaskById,
	updateTask,
} from "../models/methods/taskMethods.js";

const parseBoolean = (value) => value === "true";

export const postCreateTask = async (req, res, next) => {
	try {
		const { body } = req;
		const { _id: author } = req.user;

		const payload = {
			...body,
			author,
		};
		console.log("🚀 ~ postCreateTask ~ payload:", payload);

		// call db method to create task
		const dbResult = await createTask(payload);

		res.status(200).json({
			response: "000",
			data: dbResult,
			message: "Task created successfully",
		});
	} catch (error) {
		console.log("Error in create task controller: ", error);
		next(new CustomError(500));
	}
};

export const putUpdateTask = async (req, res, next) => {
	try {
		const { body } = req;
		const { taskId } = req.params;

		const payload = body;
		console.log("🚀 ~ putUpdateTask ~ payload:", payload);
		const dbResult = await updateTask(taskId, payload);
		console.log("🚀 ~ putUpdateTask ~ dbResult:", dbResult);
		if (!dbResult) {
			return next(new CustomError(500));
		}

		res.status(200).json({
			response: "000",
			data: {},
			message: "Task updated successfully",
		});
	} catch (error) {
		console.log("Error in update task controller: ", error);
		next(new CustomError(500));
	}
};

export const getFetchAllUserTask = async (req, res, next) => {
	try {
		const { _id: userId } = req.user;
		const { query } = req;
		query.low = parseBoolean(query.low);
		query.medium = parseBoolean(query.medium);
		query.high = parseBoolean(query.high);

		const { result, count } = await fetchAuthorOrAssignedToTasks(
			userId,
			query
		);

		res.status(200).json({
			response: "000",
			data: {
				tasks: result,
				count: Math.ceil(count / query.itemsPerPage),
			},
			message: "Task fetched successfully",
		});
	} catch (error) {
		console.log("Error in  fetchAllUserTask controller: ", error);
		next(new CustomError(500));
	}
};

export const getFetchSingleUserTask = async (req, res, next) => {
	try {
		const { _id: userId } = req.user;
		const { taskId } = req.params;

		const task = await findTaskById(taskId);
		console.log("🚀 ~ getFetchSingleUserTask ~ task:", task);
		if (!task) {
			return next(
				new CustomError(400, "The provided task id is not correct")
			);
		}

		if (
			task.author?._id.toString() !== userId.toString() &&
			task.assignedTo &&
			task.assignedTo._id.toString() !== userId.toString()
		) {
			return next(
				new CustomError(400, "You are not allowed to access the task")
			);
		}

		res.status(200).json({
			response: "000",
			data: {
				task,
			},
			message: "Task fetched successfully",
		});
	} catch (error) {
		console.log("Error in  getFetchSingleUserTask controller: ", error);
		next(new CustomError(500));
	}
};

export const deleteTask = async (req, res, next) => {
	try {
		const { _id: userId } = req.user;
		const { taskId } = req.params;

		// find task
		const task = await findTaskById(taskId);

		// check whether the task is created by the user
		if (!task) {
			return next(
				new CustomError(400, "The provided task id is not correct")
			);
		}
		console.log("🚀 ~ deleteTask ~ task.author:", task.author, userId);
		if (task.author._id.toString() !== userId.toString()) {
			return next(
				new CustomError(400, "Only author is allowed to delete task")
			);
		}

		const result = await deleteTaskById(taskId);
		if (!result) {
			new CustomError(500);
		}
		console.log("🚀 ~ deleteTask ~ result:", result);
		res.status(200).json({
			response: "000",
			data: {},
			message: "Task deleted successfully",
		});
		// if true delete the task
		// return
	} catch (error) {
		console.log("Error in  fetchAllUserTask controller: ", error);
		next(new CustomError(500));
	}
};
