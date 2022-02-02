const route = require("express").Router();
const CategoryController = require("../controller/category");

route.post('/category', CategoryController.addNewCategory);
route.get('/category', CategoryController.getAllCategory);
route.get('/category/:id', CategoryController.getSingleCategory);
route.delete('/category/:id', CategoryController.removeCategory);
module.exports = route;