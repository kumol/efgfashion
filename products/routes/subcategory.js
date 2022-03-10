const route = require("express").Router();
//const { Admin } = require("../../common/middleware/Permission");
const { Admin } = require("../../../api/middleware/permission.middleware");
const SubCategoryController = require("../controller/SubCategory");

route.post('/subcategory', Admin, SubCategoryController.addNewSubCategory);
route.get('/subcategory', SubCategoryController.getAllSubCategory);
route.get('/client/subcategory/', SubCategoryController.getSubCategoryForClient);
route.get('/subcategory/:id', SubCategoryController.getSingleSubCategory);
route.delete('/subcategory/:id', Admin, SubCategoryController.removeSubCategory);
route.put("/subcategory/:id", Admin, SubCategoryController.updateSubCategory);
module.exports = route;