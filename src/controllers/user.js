import { findUserWithEmail } from "../models/methods/usersMethods.js";
import CustomError from "../utils/CustomError.js";

export const findUserByEmail = async (req, res, next) => {
	try {
		const { email } = req.query;

		if (!email) {
			return next(
				new CustomError(400, "Invalid request, email are required")
			);
		}

		const user = await findUserWithEmail({ email });

		if (!user) {
			return next(new CustomError(400, "User not found"));
		}

		res.status(200).json({
			response: "000",
			data: {
				user,
			},
			message: "User fetched successfully",
		});
	} catch (error) {
		console.log("Error in  findUserByEmail controller: ", error);
		next(new CustomError(500));
	}
};
