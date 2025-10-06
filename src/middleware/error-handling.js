import { ERROR_MESSAGES } from "../constants/errorMessages.constants.js";

export function errorHandler(error, req, res, next) {
	const status = error.status ? error.status : 500;
	const message =
		status === 500 || !error.message
			? ERROR_MESSAGES.serverError
			: error.message;
	console.log("🚀 ~ errorHandler ~ message:", message, status);

	res.status(status).json({
		message,
		responseCode: error.responseCode,
		data: {},
	});
}
