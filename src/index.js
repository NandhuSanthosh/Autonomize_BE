import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import conntToDB from "./configs/db/index.js";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/error-handling.js";

dotenv.config();
const app = express();

app.use(
	cors({
		origin: ["http://localhost:5173", "http://localhost:5174"],
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json());

app.use(router);
app.use(errorHandler);

app.listen(8080, () => {
	console.log("App listening at 8080");
	conntToDB();
});
