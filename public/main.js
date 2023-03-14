const chatForm =
	document.getElementById("input-form");
const userChat = document.getElementById("user");
const botChat = document.getElementById("bot");
const chatBox =
	document.querySelector(".chat-box");
const socket = io();

chatForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const message =
		e.target.elements.msg.value.trim();
	if (message.length > 0) {
		socket.emit("chatbox", message);
	}

	//clear the input field
	e.target.elements.msg.value = "";
	e.target.elements.msg.focus();
});

//LISTEN FOR MESSAGES FROM THE SERVER
socket.on("message", (message) => {
	outputMessage(message);
	chatBox.scrollTop = chatBox.scrollHeight;
});

const outputMessage = (message) => {
	const div = document.createElement("div");

	if (message.sender === "bot") {
		div.classList.add("bot-section");
		div.innerHTML = `<span>${message.message}</span>`;
	} else {
		div.classList.add("user-section");
		div.innerHTML = `<span>${message.message}</span>`;
	}

	document
		.querySelector(".chat-box")
		.appendChild(div);
};
