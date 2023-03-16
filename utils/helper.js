exports.emitResponder = (
	sender,
	botresponse,
	sessionId,
	io
) => {
	io.to(sessionId).emit("message", {
		sender,
		message: botresponse,
	});
};

exports.defaultBotResponse = `Main Menu: <br>
				1. Place Order <br>
				99. Checkout Order <br>
				98. Order History <br>
        97. Current Order <br>
				0. Cancel Order <br>`;
