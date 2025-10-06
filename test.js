const bcrypt = require("bcrypt");

const hashPassword = async (plainPassword) => {
	const saltRounds = 10; // cost factor (higher = more secure but slower)
	const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
	console.log(hashedPassword);
	return hashedPassword;
};

hashPassword("Nandhu@1");
