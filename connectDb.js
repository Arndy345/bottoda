const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};
const connect = () => {
	return mongoose
		.connect(process.env.MONGO_URI, options)
		.then((data) => {
			console.log(
				"Connected to",
				data.connections[0].name
			);
		})
		.catch((err) => {
			console.log(err);
		});
};

module.exports = connect;
