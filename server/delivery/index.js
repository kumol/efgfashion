const route = require("express").Router();
const deliveryChargeRouter = require("./routes/deliveryChargeRoute");
route.use("/charge", deliveryChargeRouter);

module.exports = route;