const route = require("express").Router();
const ProductController = require("../controller/product");
const { Admin } = require("../../common/middleware/Permission");

route.post('/', Admin, ProductController.addNewProduct);
route.get('/', ProductController.getProduct);
route.get('/single/:id', ProductController.getSignle);
route.get('/cat/:id', ProductController.getProductByCategory);
route.put('/update/:id', Admin, ProductController.updateProduct);
route.delete('/remove/:id', Admin, ProductController.deleteProduct);
route.post('/search/', ProductController.searchProduct );
route.post('/filter/', ProductController.filterProduct);
module.exports = route;