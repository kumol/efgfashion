const route = require("express").Router();
const { Admin } = require("../../common/middleware/Permission");
const RoleController = require("../controller/Role");
route.get("/", Admin, RoleController.getRoles);
route.post('/', Admin, RoleController.addNewRole);
route.get('/:id', Admin, RoleController.getSingleRole);
route.put('/:id', Admin, RoleController.updateRole);
route.delete('/:id', Admin, RoleController.deleteRole);

module.exports = route;