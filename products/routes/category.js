const route = require("express").Router();
const CategoryController = require("../controller/category");
const NagadPaymentGateway = require("../../common/index");

route.post('/category', CategoryController.addNewCategory);
route.get('/category', CategoryController.getAllCategory);
route.get('/category/:id', CategoryController.getSingleCategory);

module.exports = route;