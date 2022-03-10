const route = require("express").Router();
const DeliveryChargeController = require("../controller/deliveryChargeController");
const { Admin } = require("../../../common/middleware/Permission");
route.put("/", Admin, DeliveryChargeController.updateDelivery);
route.get("/calculate/", DeliveryChargeController.calculateDeliveryCharge);
route.get("/zones", DeliveryChargeController.getZone);
module.exports = route;