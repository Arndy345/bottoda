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
	orderHistory,
	placeOrder,
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
	//get the session id from the socket
	const session = socket.request.session;
	const sessionId = session.id;

	//the socket.id changes every time the user refreshes the page, so we use the session id to identify the user and create a room for them
	socket.join(sessionId);
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
				if (message === "10") {
					botresponse = `Here is my menu: <br>
				1. Place Order <br>
				99. Checkout Order <br>
				98. Order History <br>
        97. Current Order <br>
				0. Cancel Order <br>`;
					progress = 1;
					io.to(sessionId).emit("message", {
						sender: "bot",
						message: botresponse,
					});
					break;
				} else if (message === "1") {
					botresponse = placeOrder();
					io.to(sessionId).emit("message", {
						sender: "bot",
						message: botresponse,
					});
					progress = 2;
					break;
				} else if (message === "99") {
					botresponse = await checkoutOrder();
					io.to(sessionId).emit("message", {
						sender: "bot",
						message: botresponse,
					});
					progress = 1;
				} else if (message === "98") {
					botresponse = await orderHistory(
						sessionId
					);
					io.to(sessionId).emit("message", {
						sender: "bot",
						message: botresponse,
					});
					progress = 1;
				} else if (message === "97") {
					botresponse = currentOrders();
					progress = 1;
					io.to(sessionId).emit("message", {
						sender: "bot",
						message: botresponse,
					});
				} else if (message === "0") {
					botresponse = cancelOrders();
					progress = 1;
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
					message:
						"Press 10 to return to main menu",
				});
				//set the progress to 2 to move on to next level
				// progress = 2;
				break;

			case 2:
				if (
					message !== "1" &&
					message !== "2" &&
					message !== "3" &&
					message !== "4" &&
					message !== "5"
				) {
					let botresponse = "Invalid Input";
					io.to(sessionId).emit("message", {
						sender: "bot",
						message: botresponse,
					});
					progress = 2;
				} else {
					let botresponse =
						"Order added to cart<br> Press 10 to return to main menu";
					saveOrder(message, sessionId);
					progress = 1;
					io.to(sessionId).emit("message", {
						sender: "bot",
						message: botresponse,
					});
					return;
				}
				botresponse = placeOrder();
				io.to(sessionId).emit("message", {
					sender: "bot",
					message: botresponse,
				});
			// break;
		}
	});
});

server.listen(port, async () => {
	await connect();
	console.log("listening on port", port);
});
