const route = require("express").Router();
const { Customer } = require("../../common/middleware/Permission");
const { Admin } = require("../../common/middleware/Permission");
const OrderStatController = require("../controller/OrderStat");

route.get("/count-all-status-order", OrderStatController.getOrderCounter);

module.exports = route;