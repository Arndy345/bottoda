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
	{ timestamps: true }
);

// orderSchema.pre("save", async (next) => {
// 	let order = this;

// 	await order.totalCost = order.unitPrice.order.
// 	await order.reduce((prev, curr) => {
// 		prev += curr.price * curr.quantity;
// 		order.total_price = prev;
// 		next();
// 	}, 0);
// });
module.exports = mongoose.model(
	"Order",
	orderSchema
);
