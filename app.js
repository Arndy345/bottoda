const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const session = require("express-session");
const connect = require("./connectDb");
const port = 3000 || process.env.port;
const app = express();
const {
	saveOrder,
	checkoutOrder,
	currentOrders,
	cancelOrders,
} = require("./utils/controller");
const server = http.createServer(app);

//session configuration
const sessionMiddleware = session({
	secret: "session",
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: false,
		//set expiry time for session to 7 days
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
});

app.use(
	express.static(path.join(__dirname, "public"))
);
const io = socket(server);
//using the session middleware
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);
let botresponse = "";
io.on("connection", (socket) => {
	// console.log("LISTENING HERE");

	//get the session id from the socket
	const session = socket.request.session;
	const sessionId = session.id;

	//the socket.id changes every time the user refreshes the page, so we use the session id to identify the user and create a room for them
	socket.join(sessionId);
	// console.log(session, sessionId);
	//a random variable to store the user's progress
	let progress = 0;
	socket.on("chatbox", async (message) => {
		//output the user message to the DOM by emitting the chat message event to the client
		io.to(sessionId).emit("message", {
			sender: "user",
			message,
		});

		switch (progress) {
			case 0:
				//if the user replies, increase the progress and send the default message
				io.to(sessionId).emit("message", {
					sender: "bot",
					message: `Welcome ${message}, good to have you here.<br> How may I help you today? <br>Here is my menu: <br>
				1. Place Order <br>
				99. Checkout Order <br>
				98. Order History <br>
        97. Current Order <br>
				0. Cancel Order <br>`,
				});
				progress = 1;
				break;

			case 1:
				//the user has selected an option, so we check which option they selected
				// let botresponse = "";

				if (message === "1") {
					botresponse =
						"You selected option 1 <br> here is the menu <br> 1: Bread - #750 <br> 2: Milk - #1250 <br> 3: Milo - #1050";
				} else if (message === "99") {
					botresponse = await checkoutOrder();
				} else if (message === "98") {
					botresponse =
						"You selected option 98 <br> here is your order history";
					//orderHistory()
				} else if (message === "97") {
					botresponse = currentOrders();
				} else if (message === "0") {
					botresponse = cancelOrders();
				} else {
					//if the user enters an invalid option, we send the default message
					botresponse =
						"Invalid option <br> Press any of the following keys: <br> 1. Place Order <br> 2. Checkout Order <br> 3. Order History <br> 4. Cancel Order <br>";
					//set the progess as 1 until the proper input is recieved
					progress = 1;
					io.to(sessionId).emit("message", {
						sender: "bot",
						message: botresponse,
					});
					return;
				}

				io.to(sessionId).emit("message", {
					sender: "bot",
					message: botresponse,
				});
				//set the progress to 2 to move on to next level
				progress = 2;
				break;
			case 2:
				if (
					message !== "1" &&
					message !== "2" &&
					message !== "3" &&
					message !== "4" &&
					message !== "5"
				) {
					let botresponse =
						"Invalid Input. Enter 1 or 2 or 3 or 4 or 5";
					io.to(sessionId).emit(
						"bot message",
						botresponse
					);
					progress = 2;
					return;
				} else {
					let botresponse =
						"Done<br> Would you like to order anything else?";
					saveOrder("Cake", sessionId);
					io.to(sessionId).emit("message", {
						sender: "bot",
						message: botresponse,
					});
				}
				progress = 0;
				break;
		}
	});
});

server.listen(port, async () => {
	await connect();
	console.log("listening on port", port);
});
