const chatForm =
	document.getElementById("input-form");
const userChat = document.getElementById("user");
const botChat = document.getElementById("bot");

chatForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const msg = e.target.elements.msg.value;
	socket.emit("chatbox", msg);
	const div = document.createElement("div");
	div.classList.add("user-section");
	div.innerHTML = `<span>${msg}</span>`;
	document
		.querySelector(".chat-box")
		.appendChild(div);
	e.target.msg.value = "";
	e.target.msg.focus();
});
const socket = io();
socket.on("message", (message) => {
	outputMessage(message);
});
const outputMessage = (message) => {
	const div = document.createElement("div");
	div.classList.add("bot-section");
	div.innerHTML = `<span>${message}</span>`;

	document
		.querySelector(".chat-box")
		.appendChild(div);
};
