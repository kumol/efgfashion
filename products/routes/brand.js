const route = require("express").Router();
const BrandController = require("../controller/Brand");

route.post('/brand', BrandController.createNewBrand);
route.get('/brand', BrandController.getBrand);
route.get('/brand/:id', BrandController.getSingleBrand);
route.delete('/brand/:id', BrandController.deleteBrand);
route.put('/brand/:id', BrandController.updateBrand)
module.exports = route;