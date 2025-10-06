import jwt from "jsonwebtoken";
import {
	createOtp,
	findOtpByEmailAndType,
	updateExpiryOfOtp,
} from "../models/methods/otpMethods.js";
import {
	createNewUser,
	findUserByUserId,
	findUserWithEmail,
	updateUserWithEmail,
} from "../models/methods/usersMethods.js";
import CustomError from "../utils/CustomError.js";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import { createJWTToken, generateOTP } from "../utils/index.js";
import { createAccessAndRefreshToken } from "../utils/CreateJWTToken.js";

export const validateEmail = async (req, res, next) => {
	try {
		const { email } = req.body;

		const user = await findUserWithEmail({ email });

		// check whether otp is already created or not
		if (user) {
			return next(
				new CustomError(
					400,
					"This email is already associated with another account."
				)
			);
		}

		const isOtpAlreadyCreated = await findOtpByEmailAndType({
			email,
			type: "signin",
		});

		if (isOtpAlreadyCreated) {
			return res.status(200).json({
				response: "000",
				data: {
					otpAlreadySent: true,
				},
				message: "OTP is already created and sent to you mail id",
			});
		}

		// create and set otp
		const createOtpPayload = {
			otp: generateOTP(),
			type: "signin",
			email,
			expiryDate: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes in ms
		};

		const otp = await createOtp(createOtpPayload);
		console.log(otp);
		// send otp to mail id using nodemailer

		// send success response
		res.status(200).json({
			response: "000",
			data: {},
			message: "OTP is set to you email",
		});
	} catch (error) {
		console.log("Error in validate email controller: ", error);
		next(new CustomError(500));
	}
};

export const signup = async (req, res, next) => {
	try {
		const { firstName, secondName, email, password, otp } = req.body;
		console.log("🚀 ~ signup ~ req.body:", req.body);

		// check whether user already exists
		const user = await findUserWithEmail({ email });
		console.log("🚀 ~ signup ~ user:", user);

		// if user && isRegular
		if (user) {
			return next(
				new CustomError(
					400,
					"This email is already associated with another account."
				)
			);
		}

		// update otp mark it as expired
		const otpResult = await updateExpiryOfOtp({
			email,
			type: "signin",
			otp,
		});
		console.log("🚀 ~ signup ~ otpResult:", otpResult);
		if (!otpResult) {
			return next(
				new CustomError(
					400,
					"OTP verification failed. Please try again with a valid OTP."
				)
			);
		}

		// hash passoword
		const hashedPassword = await hashPassword(password);
		console.log("🚀 ~ signup ~ hashedPassword:", hashedPassword);

		const data = {
			email,
			password: hashedPassword,
			firstName,
			secondName,
			isRegularSignin: true,
		};
		const createResult = await createNewUser(data);
		console.log("🚀 ~ signup ~ createResult:", createResult);

		// create and set tokens
		const tokenPayload = {
			email: createResult.email,
			_id: createResult._id,
		};

		const { accessToken, refreshToken } =
			createAccessAndRefreshToken(tokenPayload);

		// create and set tokens
		res.status(200).json({
			response: "000",
			data: {
				accessToken,
				refreshToken,
				userData: {
					firstName: createResult.firstName,
					lastName: createResult.secondName,
					email: createResult.email,
				},
			},
			message: "User account updated",
		});
	} catch (error) {
		console.log("Error in validate email controller: ", error);
		next(new CustomError(500));
	}
};

export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// check whether user exists
		const user = await findUserWithEmail({ email });
		console.log("🚀 ~ signup ~ user:", user);

		let isPasswordMatched = false;
		if (user) {
			isPasswordMatched = await comparePassword(password, user.password);
			console.log("🚀 ~ login ~ isPasswordMatched:", isPasswordMatched);
		}

		// if user
		if (!user || !isPasswordMatched) {
			return next(new CustomError(400, "Invalid email or password."));
		}

		// create and set tokens
		const tokenPayload = {
			email: user.email,
			_id: user._id,
		};

		const accessToken = createJWTToken(
			tokenPayload,
			process.env.ACCESS_TOKEN_SECRET,
			"30m"
			// "15s"
		);

		const refreshToken = createJWTToken(
			tokenPayload,
			process.env.REFRESH_TOKEN_SECRET,
			"7d"
		);

		// res.cookie("refreshToken", refreshToken, {
		//   httpOnly: true,
		//   secure: true,
		//   sameSite: "none",
		//   path: "/",
		//   path: "/api/v1/auth/refresh",
		//   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		// });

		res.status(200).json({
			response: "000",
			data: {
				accessToken,
				refreshToken,
				userData: {
					firstName: user.firstName,
					lastName: user.secondName,
					email: user.email,
				},
			},
			message: "Login in successful",
		});
	} catch (error) {
		console.log("Error in validate email controller: ", error);
		next(new CustomError(500));
	}
};

export const refresh = async (req, res, next) => {
	try {
		const authHeader = req.headers["authorization"];

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return next(
				new CustomError(
					401,
					"Refresh token missing in the payloada",
					"000"
				)
			);
		}

		const refreshToken = authHeader.split(" ")[1];
		console.log("🚀 ~ refresh ~ refreshToken:", refreshToken);

		if (!refreshToken) {
			return next(
				new CustomError(
					401,
					"Refresh token missing in the payloadb",
					"000"
				)
			);
		}

		const payload = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);

		if (!payload || !payload._id) {
			return next(
				new CustomError(401, "Refresh token is invalid", "000")
			);
		}

		const userDetails = await findUserByUserId(payload._id);
		if (!userDetails) {
			return next(
				new CustomError(401, "Refresh token is invalid", "000")
			);
		}

		const tokenPayload = {
			email: userDetails.email,
			_id: userDetails._id,
		};

		const accessToken = createJWTToken(
			tokenPayload,
			process.env.ACCESS_TOKEN_SECRET,
			"30m"
		);

		return res.status(200).json({
			response: "000",
			data: {
				accessToken,
			},
			message: "Access token refresh successful",
		});
	} catch (error) {
		console.log("🚀 ~ refresh ~ error:", error);
		if (error.name === "TokenExpiredError") {
			return next(new CustomError(401, "Refresh token expired", "000"));
		}
		return next(new CustomError(500));
	}
};
