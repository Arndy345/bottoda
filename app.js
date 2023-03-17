const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const session = require("express-session");
const connect = require("./connectDb");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const logger = require("./logger/logger");
const httpLogger = require("./logger/httpLogger");
const cors = require("cors");
const morgan = require("morgan");
const port = 3000 || process.env.port;
const app = express();
const {
	saveOrder,
	checkoutOrder,
	currentOrders,
	cancelOrders,
	orderHistory,
	placeOrder,
	noOfUnits,
} = require("./utils/controller");

const {
	emitResponder,
	defaultBotResponse,
} = require("./utils/helper");
const server = http.createServer(app);
// Defaults to in-memory store.
// You can use redis or any other store.
const limiter = rateLimit({
	windowMs: 0.5 * 60 * 1000, // 15 minutes
	max: 4, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

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

app.use(cors());
//add secuirty
app.use(helmet());
app.use(httpLogger);

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(morgan("dev"));

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
					message: `Welcome ${message}, good to have you here.<br> How may I help you today? <br>Here's a Menu of what you can do: <br>
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
					botresponse = defaultBotResponse;
					progress = 1;
					emitResponder(
						"bot",
						botresponse,
						sessionId,
						io
					);
					break;
				} else if (message === "1") {
					botresponse = placeOrder();
					emitResponder(
						"bot",
						botresponse,
						sessionId,
						io
					);
					progress = 2;
					break;
				} else if (message === "99") {
					botresponse = await checkoutOrder();
					emitResponder(
						"bot",
						botresponse,
						sessionId,
						io
					);

					progress = 1;
				} else if (message === "98") {
					botresponse = await orderHistory(
						sessionId
					);
					emitResponder(
						"bot",
						botresponse,
						sessionId,
						io
					);
					progress = 1;
				} else if (message === "97") {
					botresponse = currentOrders();
					progress = 1;
					emitResponder(
						"bot",
						botresponse,
						sessionId,
						io
					);
				} else if (message === "0") {
					botresponse = cancelOrders();
					emitResponder(
						"bot",
						botresponse,
						sessionId,
						io
					);
					progress = 1;
					return;
				} else {
					//if the user enters an invalid option, we send the default message
					botresponse =
						"Invalid option <br> Press any of the following keys: <br> 1. Place Order <br> 99. Checkout Order <br> 98. Order History <br> 97. Current orders <br> 0. Cancel Order <br>";
					//set the progess as 1 until the proper input is recieved
					progress = 1;
					emitResponder(
						"bot",
						botresponse,
						sessionId,
						io
					);
					return;
				}

				// io.to(sessionId).emit("message", {
				// 	sender: "bot",
				// 	message: defaultBotResponse,
				// });
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
						"Invalid input Press 1 to see Menu again";
					emitResponder(
						"bot",
						botresponse,
						sessionId,
						io
					);
					progress = 1;
					return;
				} else {
					[botresponse, progress] = saveOrder(
						message,
						sessionId
					);
					emitResponder(
						"bot",
						botresponse,
						sessionId,
						io
					);
					progress = progress;
					break;
				}

			case 3:
				const unit = Number(message);
				if (unit === 0 || !unit) {
					emitResponder(
						"bot",
						"Invalid number of units <br> Please enter valid amount",
						sessionId,
						io
					);
					progress = 3;
					return;
				}
				[botresponse, progress] = saveOrder(
					message,
					sessionId,
					progress
				);
				emitResponder(
					"bot",
					botresponse,
					sessionId,
					io
				);
				progress = 1;
				return;
		}
	});
});

server.listen(port, async () => {
	await connect();
	logger.info("listening on port", port);
});
