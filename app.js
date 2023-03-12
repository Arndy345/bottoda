const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const port = 3000 || process.env.port;
const app = express();
const server = http.createServer(app);
app.use(
	express.static(path.join(__dirname, "public"))
);

const io = socket(server);

io.on("connection", (socket) => {
	console.log("LISTENING HERE");

	socket.on("chatbox", (msg) => {
		socket.emit(
			"message",
			`Hello ${msg}, what would you like to order?`
		);
	});
});

server.listen(port, () => {
	console.log("listening on port", port);
});
