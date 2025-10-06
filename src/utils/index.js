import jwt from "jsonwebtoken";

import CustomError from "./CustomError.js";

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function asyncErrorHandler(cb) {
  return (req, res, next) => {
    cb(req, res, next).catch((error) => {
      console.log("Error from async Error Handler: ", error);
      next(new CustomError(500));
    });
  };
}

export function createJWTToken(payload, secret, expiryTime) {
  return jwt.sign(payload, secret, { expiresIn: expiryTime });
}
