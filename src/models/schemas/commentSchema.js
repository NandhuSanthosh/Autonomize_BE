import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		taskId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Task",
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Users",
			required: true,
		},
		text: {
			type: String,
			required: true,
			trim: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
