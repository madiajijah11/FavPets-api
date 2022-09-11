const mongoose = require("mongoose");

const PetsSchema = new mongoose.Schema(
	{
		src: { type: String, required: true },
		height: { type: Number, required: true },
		width: { type: Number, required: true },
		name: { type: String, required: true },
		age: { type: Number, required: true },
		type: { type: String, required: true },
		breed: { type: String, required: true },
		description: { type: String, required: true },
		owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

const Pets = mongoose.model("Pets", PetsSchema);

module.exports = Pets;
