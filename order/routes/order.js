const route = require("express").Router();
const { Customer, Admin } = require("../../common/middleware/Permission");
const OrderController = require("../controller/Order");

route.get("/", Admin, OrderController.getAllOrder);
route.post("/", Customer, OrderController.placeOrder);
route.get("/:id", Customer, OrderController.getSingleOrder);
route.put("/:id", Customer, OrderController.updateOrder);
route.delete("/:id", Customer, OrderController.deleteOrder);

module.exports = route;