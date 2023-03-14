const orderModel = require("../models/order.model");
let currentOrder = [];
exports.saveOrder = async (orders, sessionId) => {
	const order = {
		order: orders,
		sessionId,
	};
	currentOrder.push(order);
};
exports.currentOrders = () => {
	let botresponse =
		"You selected option 97 <br> here is current your order ";
	if (currentOrder.length > 0) {
		for (
			let i = 0;
			i < currentOrder.length;
			i++
		) {
			botresponse += `<p>${currentOrder[i].order}</p> `;
		}
		return botresponse;
	}
	botresponse = "You have not made any order yet";
	return botresponse;
};
exports.checkoutOrder = async () => {
	let botresponse =
		"You have not made any order yet";
	if (currentOrder.length > 0) {
		botresponse =
			"You selected option 99 <br> checkout your order";
		await orderModel.create(currentOrder);
		currentOrder = [];
		return botresponse;
	}

	currentOrder = [];
	return botresponse;
};

exports.cancelOrders = () => {
	let botresponse = "You have no orders yet";
	if (currentOrder.length > 0) {
		botresponse = "Order Canceled";
		currentOrder = [];
		return botresponse;
	}
	console.log(currentOrder);
	return botresponse;
};
