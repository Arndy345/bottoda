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
