const orderModel = require("../models/order.model");
const orderCart = [
	{ name: "Bread", price: 1250 },
	{ name: "Milk", price: 2050 },
	{ name: "Apples", price: 300 },
	{ name: "Burger", price: 1450 },
	{ name: "Pizza", price: 3050 },
];
let currentOrder = [];

exports.placeOrder = () => {
	let botresponse = "List of items available ";
	// "You selected option 1 <br> here is the menu <br> 1: Bread - #750 <br> 2: Milk - #1250 <br> 3: Milo - #1050";
	for (let i = 0; i < orderCart.length; i++) {
		botresponse += `<li>${orderCart[i].name} - ${orderCart[i].price}</li>`;
	}
	// console.log(botresponse);
	return botresponse;
};
exports.saveOrder = async (
	message,
	sessionId
) => {
	const newOrder = orderCart[message - 1];
	const order = {
		order: newOrder.name,
		price: newOrder.price,
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
	let botresponse = "No order to place";
	if (currentOrder.length > 0) {
		botresponse = "Order Placed";
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

	return botresponse;
};

exports.orderHistory = async (sessionId) => {
	let botresponse = "You have made no orders yet";
	const orders = await orderModel.find({
		sessionId,
	});

	if (orders.length > 0) {
		botresponse = "Orders placed: <br>";
		for (let i = 0; i < orders.length; i++) {
			botresponse += `<p>${orders[i].order}</p> <br> <span>${orders[i].createdAt}</span>`;
		}

		return botresponse;
	}
	return botresponse;
};
