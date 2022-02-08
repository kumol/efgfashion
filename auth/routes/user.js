const route = require("express").Router();
const {logIn, resetPassword} = require("../controller/User");

route.post("/login", logIn);
route.post("/reset/password", resetPassword);

module.exports = route;