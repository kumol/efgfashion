const route = require("express").Router();
const { Admin } = require("../../common/middleware/Permission");
const BrandController = require("../controller/Brand");

route.post('/brand', Admin, BrandController.createNewBrand);
route.get('/brand', BrandController.getBrand);
route.get('/brand/:id', BrandController.getSingleBrand);
route.delete('/brand/:id', Admin, BrandController.deleteBrand);
route.put('/brand/:id', Admin, BrandController.updateBrand)
module.exports = route;