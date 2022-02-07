const route = require("express").Router();
const OrderController = require("../controller/Order");

route.get("/",(req,res)=>{
    res.json({"success": true});
});
route.post("/", OrderController.placeOrder);

module.exports = route;