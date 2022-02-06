const route = require("express").Router();
const Admin = require("../controller/Admin");

route.get('/', Admin.getAllAdmin);
route.post('/', Admin.addNewAdmin);
route.get('/:id', Admin.getSingleAdmin);
route.put('/:id', Admin.editAdmin);
route.delete('/:id', Admin.deleteAdmin);

module.exports = route;