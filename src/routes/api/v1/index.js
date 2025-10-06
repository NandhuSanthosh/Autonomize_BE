import express from "express";
const router = express.Router();

import auth from "./auth.js";
import task from "./task.js";
import comment from "./comments.js";
import user from "./user.js";
import analytics from "./analytics.js";

router.use("/auth", auth);
router.use("/task", task);
router.use("/comment", comment);
router.use("/user", user);
router.use("/analytics", analytics);

router.get("/", (req, res) => {
	console.log("Api v1 routes working");
	res.status(200).json({
		message: "Api v1 routes working",
		responseCode: "000",
		data: {},
	});
});

export default router;
