const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const UsersSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
	},
	{ timestamps: true }
);

// UsersSchema.statics.signup = async function (name, email, password) {
// 	const emailExists = await this.findOne({ email });

// 	if (emailExists) {
// 		throw new Error("Email already exists");
// 	}

// 	const hashPassword = await bcryptjs.hash(password, 10);

// 	const user = await this.create({
// 		name,
// 		email,
// 		password: hashPassword,
// 	});

// 	return user;
// };

const Users = mongoose.model("Users", UsersSchema);

module.exports = Users;
