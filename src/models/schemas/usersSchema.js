import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		trim: true,
	},
	secondName: {
		type: String,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		lowercase: true,
		index: true,
	},
	password: {
		type: String,
	},
});

const Users = mongoose.model("Users", userSchema);

export default Users;
