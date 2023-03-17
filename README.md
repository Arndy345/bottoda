# Bottoda

### ChatBot Requirements

- ChatBot interface would be like a chat interface
- No need for authentication but we should be able to store user session based on devices
- When a customer lands on the chatbot page, the bot should send these options to the customer:
- Select 1 to Place an order
- Select 99 to checkout order
- Select 98 to see order history
- Select 97 to see current order
- Select 0 to cancel order

- When a customer selects “1”, the bot should return a list of items from the restaurant. It is up to you to create the items in your restaurant for the customer. The order items can have multiple options but the customer should be able to select the preferred items from the list using this same number select system and place an order.
- When a customer selects “99” out an order, the bot should respond with “order placed” and if none the bot should respond with “No order to place”. Customer should also see an option to place a new order
- When a customer selects “98”, the bot should be able to return all placed order
- When a customer selects “97”, the bot should be able to return current order
- When a customer selects “0”, the bot should cancel the order if there is.

## Live Site

---

- [Chat Bot](https://bottoda.onrender.com//)

## Built With:

- Node.js
- Express.js
- Socket.io
- Express-session
- MongoDb

## Clone this Repo:

```
git clone https://github.com/Arndy345/bottoda.git
```

## Install Dependencies:

```
npm install
```

## Start Server:

```
npm run start:dev
```

## Open the application in your browser:

    - `http://localhost:3000`

### Usage

---

To use the restaurant chatbot, follow these steps:

- Visit the chatbot site [Chat Bot](https://bottoda.onrender.com/) on your device

- The chatbot will greet you and ask or your name when you respond, it will return the available options for you to choose from.
- You will be asked to:

  - Enter "1" to order food

  - Enter "99" to checkout your order

  - Enter "98" to see order history

  - Enter "97" to see your current order

  - Enter "0" to cancel your order

- If you select "1" to order food, the chatbot will present you with a menu of items with corresponding numbers and prices. You can enter the number of the item that correspond with the item you want to order.
- After selecting the item the chatbot will ask you for the number of units you want for the item
- The chatbot takes note of your response and replies with the item ordered and number of units and also sums the total cost
- The chatbot will ask if you want to check out your order or place a new one
- If you select "99" to checkout your order, the chatbot will let you know that your order has been placed and will show the main menu.
- If you select "98" to see order history, the chatbot will show you all orders checked out.
- If you select "97" to see your current order, the chatbot will show you your current orders that is orders that have been added to cart but not checked out.
- If you select "0" to cancel your order, the chatbot will let you know that your order has been cancelled and will show the main menu.

### Disclaimer

---

The Bottoda may have bugs or limitations. It is not intended for production use yet. Use at your own risk.
