const Users = require("./usersModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const newUsers = (req, res, _next) => {
	const { name, email, password, confirmPassword } = req.body;
	if (!name || !email || !password || !confirmPassword) {
		return res.status(400).json({
			message: "Please fill all fields",
		});
	}
	if (password !== confirmPassword) {
		return res.status(400).json({
			message: "Passwords do not match",
		});
	}
	Users.findOne({ email }, (error, data) => {
		if (error) {
			return res.status(500).json({
				message: "Something went wrong",
			});
		}
		if (data) {
			return res.status(400).json({
				message: "User already exists",
			});
		}
		const salt = bcryptjs.genSaltSync(10);
		const hash = bcryptjs.hashSync(password, salt);
		const newUsers1 = new Users({
			name,
			email,
			password: hash,
		});
		newUsers1.save((error1) => {
			if (error1) {
				return res.status(500).json({
					message: "Something went wrong",
				});
			}
			return res.status(201).json({
				message: "User created successfully",
			});
		});
	});
};

const getUsers = (_req, res, _next) => {
	Users.find({}, (error, data) => {
		if (error) {
			return res.status(500).json({
				message: "Something went wrong",
			});
		}
		if (!data) {
			return res.status(404).json({
				message: "No users found",
			});
		}
		return res.status(200).json(data);
	});
};

const deleteUsers = (_req, res, _next) => {
	Users.deleteMany({}, (error) => {
		if (error) {
			return res.status(500).json({
				message: "Something went wrong",
			});
		}
		return res.status(200).json({
			message: "Complete Users deleted successfully",
		});
	});
};

const loginUsers = (req, res, _next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({
			message: "Please fill all fields",
		});
	}
	Users.findOne({ email }, (error, data) => {
		if (error) {
			return res.status(500).json({
				message: "Something went wrong",
			});
		}
		if (!data) {
			return res.status(400).json({
				message: "User does not exist",
			});
		}
		const isPasswordMatch = bcryptjs.compareSync(password, data.password);
		if (!isPasswordMatch) {
			return res.status(400).json({
				message: "Email or Password is incorrect",
			});
		}
		const generateToken = (payload) => {
			return jwt.sign(payload, process.env.SECRET, {
				expiresIn: "1d",
			});
		};
		const token = generateToken({
			id: data._id,
			name: data.name,
			email: data.email,
		});
		return res.status(200).json({
			name: data.name,
			email: data.email,
			token,
		});
	});
};

// logout user
const logoutUsers = (req, res, next) => {
	const { token } = req.body;
	if (!token) {
		return res.status(400).json({
			message: "Please provide a token",
		});
	}
	jwt.verify(token, process.env.SECRET, (error, decoded) => {
		if (error) {
			return res.status(401).json({
				message: "Invalid token",
			});
		}
		return res.status(200).json({
			message: "Logout successfully",
		});
	});
};

// get user by email
const getUsersByEmail = (req, res, _next) => {
	const { email } = req.params;
	Users.findOne({ email }, (error, data) => {
		if (error) {
			return res.status(500).json({
				message: "Something went wrong",
			});
		}
		if (!data) {
			return res.status(404).json({
				message: "User not found",
			});
		}
		return res.status(200).json(data);
	});
};

module.exports = { newUsers, getUsers, deleteUsers, loginUsers, getUsersByEmail, logoutUsers };
