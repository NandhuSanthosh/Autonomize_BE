import { createJWTToken } from "./index.js";

export function createAccessAndRefreshToken(tokenPayload) {
	const accessToken = createJWTToken(
		tokenPayload,
		process.env.ACCESS_TOKEN_SECRET,
		// "30m"
		"15s"
	);

	const refreshToken = createJWTToken(
		tokenPayload,
		process.env.REFRESH_TOKEN_SECRET,
		"7d"
	);

	return {
		accessToken,
		refreshToken,
	};
}
