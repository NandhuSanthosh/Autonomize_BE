import {
	taskOverview,
	taskTrend,
	userPerformance,
} from "../models/methods/taskMethods.js";

export const fetchOverview = async (req, res, next) => {
	try {
		const result = await taskOverview();

		if (!result) {
			throw new Error("Something went wrong during db operation");
		}
		res.status(200).json({
			response: "000",
			data: {
				result,
			},
			message: "Overview fetched successfully",
		});
	} catch (err) {
		console.error("Error fetching analytics overview:", err);
		new CustomError(500, "Something went wrong while fetching overview");
	}
};

export const getUserPerformance = async (req, res, next) => {
	try {
		const result = await userPerformance();

		if (!result) {
			throw new Error("Something went wrong during db operation");
		}
		res.status(200).json({
			response: "000",
			data: {
				result,
			},
			message: "User performance fetched successfully",
		});
	} catch (err) {
		console.error("Error fetching analytics overview:", err);
		new CustomError(500, "Something went wrong while fetching overview");
	}
};

export const getTaskTrend = async (req, res, next) => {
	try {
		const result = await taskTrend();

		if (!result) {
			throw new Error("Something went wrong during db operation");
		}
		res.status(200).json({
			response: "000",
			data: {
				result,
			},
			message: "User performance fetched successfully",
		});
	} catch (err) {
		console.error("Error fetching analytics overview:", err);
		new CustomError(500, "Something went wrong while fetching overview");
	}
};
