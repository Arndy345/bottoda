const orderModel = require("../models/order.model");
const orderCart = [
	{ name: "Bread", price: 1250 },
	{ name: "Milk", price: 2050 },
	{ name: "Apples", price: 300 },
	{ name: "Burger", price: 1450 },
	{ name: "Pizza", price: 3050 },
];
let currentOrder = [];
let order = {};
let noOfUnits = "";

exports.placeOrder = () => {
	let botresponse = "List of items available ";
	for (let i = 0; i < orderCart.length; i++) {
		botresponse += `<p>${i + 1}. ${
			orderCart[i].name
		} - ${orderCart[i].price}</p>`;
	}
	return botresponse;
};
exports.saveOrder = (
	message,
	sessionId,
	progress
) => {
	let botresponse = "";

	if (progress === 3) {
		noOfUnits = Number(message);
		order.noOfUnits = noOfUnits;
		botresponse = `You made an order for ${message} units of ${order.order}`;
		order.totalCost = order.price * noOfUnits;

		currentOrder.push(order);
		return botresponse;
	}
	const newOrder = orderCart[message - 1];
	order = {
		order: newOrder.name,
		price: newOrder.price,
		sessionId,
	};
	botresponse = `${newOrder.name} was added to cart <br> Enter the number of units needed`;

	return botresponse;
};

exports.currentOrders = () => {
	let botresponse =
		"Here are current your orders ";
	if (currentOrder.length > 0) {
		for (
			let i = 0;
			i < currentOrder.length;
			i++
		) {
			botresponse += `<p>${currentOrder[i].noOfUnits} units of ${currentOrder[i].order} at a total cost of - ${currentOrder[i].totalCost}</p> `;
		}
		return botresponse;
	}
	botresponse = "You have not made any order yet";
	return botresponse;
};
exports.checkoutOrder = async () => {
	let botresponse = "No order to place";
	try {
		if (currentOrder.length > 0) {
			botresponse = "Order Checked Out";
			await orderModel.create(currentOrder);
			currentOrder = [];
			return botresponse;
		}

		currentOrder = [];
		return botresponse;
	} catch (error) {}
};

exports.cancelOrders = () => {
	let botresponse = "You have no orders yet";
	if (currentOrder.length > 0) {
		botresponse = "Orders Canceled";
		currentOrder = [];
		return botresponse;
	}

	return botresponse;
};

exports.orderHistory = async (sessionId) => {
	let botresponse = "You have made no orders yet";
	try {
		const orders = await orderModel.find({
			sessionId,
		});

		if (orders.length > 0) {
			botresponse = "Orders placed: <br>";
			for (let i = 0; i < orders.length; i++) {
				botresponse += `<li> ${orders[i].noOfUnits} units of ${orders[i].order} at a total cost of ${orders[i].totalCost}</li> <br> <span>${orders[i].createdAt}</span>`;
			}
			return botresponse;
		}
		return botresponse;
	} catch (error) {}
};
