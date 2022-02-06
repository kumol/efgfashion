const route = require("express").Router();
const RoleController = require("../controller/Role");
route.get("/", RoleController.getRoles);
route.post('/', RoleController.addNewRole);
route.get('/:id', RoleController.getSingleRole);
route.put('/:id', RoleController.updateRole);
route.delete('/:id', RoleController.deleteRole);

module.exports = route;