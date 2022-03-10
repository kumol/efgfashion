const route = require("express").Router();
//const { Admin } = require("../../common/middleware/Permission");
const { Admin } = require("../../common/middleware/Permission");
const CategoryController = require("../controller/category");

route.post('/category', Admin, CategoryController.addNewCategory);
route.get('/category', CategoryController.getAllCategory);
route.get('/client/category/', CategoryController.getCategoryForClient);
route.get('/category/:id', CategoryController.getSingleCategory);
route.delete('/category/:id', Admin, CategoryController.removeCategory);
route.put("/category/:id", Admin, CategoryController.updateCategory);
module.exports = route;