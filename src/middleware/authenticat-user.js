import jwt from "jsonwebtoken";
import { findUserByUserId } from "../models/methods/usersMethods.js";
import CustomError from "../utils/CustomError.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unautorized");
    }

    const token = authHeader.split(" ")[1];

    const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!data || !data._id) {
      next(new CustomError(401, "Unauthorized"));
    }

    const userDetails = await findUserByUserId(data._id);
    req.user = userDetails;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new CustomError(401, "Access token expired"));
    }
    return next(new CustomError(401, "Unauthorized"));
  }
};
