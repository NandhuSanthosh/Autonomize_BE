import mongoose from "mongoose";
import Task from "../schemas/taskSchema.js";

export const createTask = async (payload) => {
	const result = await Task.create(payload);
	return result;
};

export const updateTask = async (taskId, payload) => {
	const result = await Task.updateOne({ _id: taskId }, payload);

	if (result.modifiedCount) {
		return true;
	} else {
		return false;
	}
};

export const fetchAuthorOrAssignedToTasks = async (userId, query) => {
	const whereClause = {
		$and: [
			{
				$or: [{ author: userId }, { assignedTo: userId }],
			},
			{
				isDeleted: false,
			},
		],
	};

	if (query.searchText) {
		whereClause.$and.push({
			$or: [
				{ title: { $regex: query.searchText, $options: "i" } },
				{ description: { $regex: query.searchText, $options: "i" } },
				{ status: { $regex: query.searchText, $options: "i" } },
				{ priority: { $regex: query.searchText, $options: "i" } },
				{ tags: { $regex: query.searchText, $options: "i" } }, // no need for $elemMatch
			],
		});
	}

	if (query.low || query.high || query.medium) {
		const array = [];
		if (query.low) {
			array.push({ priority: "low" });
		}
		if (query.high) {
			array.push({ priority: "high" });
		}
		if (query.medium) {
			array.push({ priority: "medium" });
		}

		whereClause.$and.push({
			$or: array,
		});
		console.log(
			`🚀 ~ fetchAuthorOrAssignedToTasks ~ {
			$or: array,
		}:`,
			{
				$or: array,
			}
		);
	}

	const result = await Task.find(whereClause)
		.sort({ createdAt: -1 })
		.skip(query.itemsPerPage * (query.page - 1))
		.limit(query.itemsPerPage)
		.populate({
			path: "assignedTo",
		});

	const countDocument = await Task.countDocuments(whereClause);

	return {
		result,
		count: countDocument,
	};
};

export const findTaskById = async (taskId) => {
	const result = await Task.findById(taskId).populate({
		path: "author",
		path: "assignedTo",
	});

	return result;
};

export const deleteTaskById = async (taskId) => {
	console.log("🚀 ~ deleteTaskById ~ taskId:", taskId);
	const result = await Task.updateOne({ _id: taskId }, { isDeleted: true });
	console.log("🚀 ~ deleteTaskById ~ result:", result);

	if (result.modifiedCount) {
		return true;
	} else {
		return false;
	}
};

export const taskOverview = async () => {
	try {
		// Aggregation pipeline
		const pipeline = [
			{
				$match: {
					isDeleted: false,
				},
			},
			{
				$facet: {
					byStatus: [
						{ $group: { _id: "$status", count: { $sum: 1 } } },
						{ $project: { status: "$_id", count: 1, _id: 0 } },
					],
					byPriority: [
						{ $group: { _id: "$priority", count: { $sum: 1 } } },
						{ $project: { priority: "$_id", count: 1, _id: 0 } },
					],
					total: [{ $count: "count" }],
				},
			},
		];

		const [result] = await Task.aggregate(pipeline);
		return result;
	} catch (error) {
		console.log("🚀 ~ taskOverview ~ error:", error);
		return false;
	}
};

export const userPerformance = async () => {
	try {
		// Aggregation pipeline
		const pipeline = [
			{ $match: { isDeleted: false } },
			{
				$group: {
					_id: "$assignedTo",
					tasksAssigned: { $sum: 1 },
					tasksCompleted: {
						$sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] },
					},
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "_id",
					foreignField: "_id",
					as: "user",
				},
			},
			{ $unwind: "$user" },
			{
				$project: {
					_id: 0,
					firstName: "$user.firstName",
					secondName: "$user.secondName",
					tasksAssigned: 1,
					tasksCompleted: 1,
				},
			},
		];

		const result = await Task.aggregate(pipeline);
		return result;
	} catch (error) {
		console.log("🚀 ~ taskOverview ~ error:", error);
		return false;
	}
};

export const taskTrend = async () => {
	try {
		let dateFormat = "%Y-%m-%d";

		const pipeline = [
			{ $match: { isDeleted: false } },
			{
				$facet: {
					created: [
						{
							$group: {
								_id: {
									$dateToString: {
										format: dateFormat,
										date: "$createdAt",
									},
								},
								count: { $sum: 1 },
							},
						},
						{ $sort: { _id: 1 } },
					],
				},
			},
		];

		const [result] = await Task.aggregate(pipeline);
		return result;
	} catch (error) {
		console.log("🚀 ~ taskOverview ~ error:", error);
		return false;
	}
};
