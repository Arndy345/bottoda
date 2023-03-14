const mongoose = require("mongoose");
const schema = mongoose.Schema;

const orderSchema = new schema(
	{
		sessionId: String,
		order: String,
	},
	{ timestamps: true }
);

module.exports = mongoose.model(
	"Order",
	orderSchema
);
