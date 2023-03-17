const mongoose = require("mongoose");
const schema = mongoose.Schema;

const orderSchema = new schema(
	{
		sessionId: String,
		order: String,
		price: Number,
		noOfUnits: Number,
		totalCost: Number,
	},
	{
		timestamps: {
			currentTime: () => Math.floor(Date.now()),
		},
	}
);

module.exports = mongoose.model(
	"Order",
	orderSchema
);
