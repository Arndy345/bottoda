const chatForm =
	document.getElementById("input-form");
const userChat = document.getElementById("user");
const botChat = document.getElementById("bot");
const chatBox =
	document.querySelector(".chat-box");
const orderBox =
	document.querySelector(".order-box");
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
});

const timestamp = new Date().toLocaleTimeString(); // create timestamp

const outputMessage = (message) => {
	const div = document.createElement("div");
	const img = document.createElement("img");
	const span = document.createElement("span");

	if (message.sender === "bot") {
		div.classList.add("bot-section");

		span.innerHTML = `${message.message}<p class="time">${timestamp}</p>`;
		img.src = "header.jpg";
		div.appendChild(img);
		div.appendChild(span);
		document
			.querySelector(".chat-box")
			.appendChild(div);
	} else {
		div.classList.add("user-section");
		div.innerHTML = `<span>${message.message}<p class="time">${timestamp}</p></span>`;
		document
			.querySelector(".chat-box")
			.appendChild(div);
	}

	// document
	// 	.querySelector(".chat-box")
	// 	.appendChild(div);
	// 	.appendChild(img)
	orderBox.scrollTop = orderBox.scrollHeight;
};
