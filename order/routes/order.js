const route = require("express").Router();
const OrderController = require("../controller/Order");

route.get("/", OrderController.getAllOrder);
route.post("/", OrderController.placeOrder);
route.get("/:id", OrderController.getSingleOrder);
route.put("/:id", OrderController.updateOrder);
route.delete("/:id", OrderController.deleteOrder);

module.exports = route;