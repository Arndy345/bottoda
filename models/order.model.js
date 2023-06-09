const mongoose = require("mongoose");
const schema = mongoose.Schema;
const date = new Date();
const orderSchema = new schema(
	{
		sessionId: String,
		order: String,
		price: Number,
		noOfUnits: Number,
		totalCost: Number,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model(
	"Order",
	orderSchema
);
