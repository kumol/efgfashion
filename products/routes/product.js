const route = require("express").Router();
const ProductController = require("../controller/product");

route.post('/', ProductController.addNewProduct);
route.get('/', ProductController.getProduct);
module.exports = route;