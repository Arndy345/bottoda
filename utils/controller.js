const orderModel = require("../models/order.model");
const {
	defaultBotResponse,
} = require("./helper");

const orderCart = [
	{ name: "Bread", price: 1250 },
	{ name: "Milk", price: 2050 },
	{ name: "Apples", price: 300 },
	{ name: "Burger", price: 1450 },
	{ name: "Pizza", price: 3050 },
];
let currentOrder = [];
let orderType = [];
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
		botresponse = `You made an order for ${message} units of ${order.order}: <br> 1. Place new order <br> 99. To checkout orders <br>10. Return to main menu`;
		order.totalCost = order.price * noOfUnits;
		currentOrder.push(order);
		orderType.push(order.order);
		progress = 1;
		return [botresponse, progress];
	}

	const newOrder = orderCart[message - 1];
	if (currentOrder.length > 0) {
		if (orderType.includes(newOrder.name)) {
			botresponse = `You already made an order for ${newOrder.name}: <br> 1. Place new order <br> 99. To checkout orders <br>10. Return to main menu`;

			progress = 1;
			return [botresponse, progress];
		} else {
			order = {
				order: newOrder.name,
				price: newOrder.price,
				sessionId,
			};
			botresponse = `${newOrder.name} was added to cart <br> Enter the number of units needed`;
			progress = 3;
			return [botresponse, progress];
		}
	}

	order = {
		order: newOrder.name,
		price: newOrder.price,
		sessionId,
	};
	botresponse = `${newOrder.name} was added to cart <br> Enter the number of units needed`;
	progress = 3;
	return [botresponse, progress];
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
			botresponse += `<p>${currentOrder[i].noOfUnits} units of ${currentOrder[i].order} at a total cost of - ${currentOrder[i].totalCost}:</p><br> 1. Place new order <br> 99. To checkout orders <br>10. Return to main menu`;
		}
		return botresponse;
	}
	botresponse =
		"You have not made any order yet <br> Press 1 to place an order";
	return botresponse;
};
exports.checkoutOrder = async () => {
	let botresponse =
		"No order to place <br>Press 10 to return to main menu";
	try {
		if (currentOrder.length > 0) {
			botresponse =
				"Order Checked Out <br>Press 10 to return to main menu";
			await orderModel.create(currentOrder);
			currentOrder = [];
			return botresponse;
		}

		currentOrder = [];
		return botresponse;
	} catch (error) {}
};

exports.cancelOrders = () => {
	let botresponse =
		"You have no orders yet <br>1. Place an order <br> 10. to return to main menu";
	if (currentOrder.length > 0) {
		botresponse =
			"Orders canceled <br> 1. Place new order <br>10. Return to main menu";
		currentOrder = [];
		orderType = [];
		return botresponse;
	}

	return botresponse;
};

exports.orderHistory = async (sessionId) => {
	let botresponse =
		"You have made no orders yet <br>";
	try {
		const orders = await orderModel.find({
			sessionId,
		});

		if (orders.length > 0) {
			botresponse = "Orders placed: <br>";
			for (let i = 0; i < orders.length; i++) {
				botresponse += `<li> ${orders[i].noOfUnits} units of ${orders[i].order} at a total cost of ${orders[i].totalCost}</li>  <p>${orders[i].createdAt}</p> <br> Press 10 to return to main menu`;
			}
			return botresponse;
		}
		return botresponse;
	} catch (error) {}
};
