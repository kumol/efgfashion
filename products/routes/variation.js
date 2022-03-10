const route = require("express").Router();
const { Admin } = require("../../common/middleware/Permission");
const VariationController = require("../controller/Variation");

route.post('/variation', Admin, VariationController.createVariation);
route.get('/variation', VariationController.getVariation);
route.get('/variation/:id', VariationController.getSingleVariation);
route.delete('/variation/:id', Admin, VariationController.deleteVariation);
route.put('/variation/:id', Admin, VariationController.updateVariation)

module.exports = route;