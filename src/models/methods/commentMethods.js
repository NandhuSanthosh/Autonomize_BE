import Comment from "../schemas/commentSchema.js";

export const createCommentHandler = async (payload) => {
	const result = await Comment.create(payload);
	return result;
};

export const findCommentByTaskId = async (taskId) => {
	const result = await Comment.find({ taskId, isDeleted: false })
		.sort({ createdAt: -1 })
		.populate({
			path: "author",
		});
	return result;
};

export const findCommentById = async (commentId) => {
	const result = await Comment.findById(commentId);
	return result;
};

export const updateCommentById = async (id, payload) => {
	const result = await Comment.updateOne({ _id: id }, payload);
	if (result.modifiedCount) return true;
	return false;
};
