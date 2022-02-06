const route = require("express").Router();
const ProductController = require("../controller/product");

route.post('/', ProductController.addNewProduct);
route.get('/', ProductController.getProduct);
route.get('/single/:id', ProductController.getSignle);
route.get('/cat/:id', ProductController.getProductByCategory);
route.put('/update/:id', ProductController.updateProduct);
route.delete('/remove/:id', ProductController.deleteProduct)
module.exports = route;