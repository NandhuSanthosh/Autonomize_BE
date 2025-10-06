import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		status: {
			type: String,
			enum: ["todo", "inprogress", "inreview", "done"], // common task statuses
			default: "todo",
		},
		priority: {
			type: String,
			enum: ["high", "medium", "low"],
			default: "medium",
		},
		dueDate: {
			type: Date,
		},
		tags: {
			type: [String],
			default: [],
		},
		assignedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Users",
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Users",
			required: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		files: {
			type: [String], // URLs or file paths
			default: [],
		},
	},
	{
		timestamps: true, // adds createdAt and updatedAt
	}
);

export default mongoose.model("Task", taskSchema);
