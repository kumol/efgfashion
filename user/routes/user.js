const router = require("express").Router();
const { Admin } = require("../../../api/middleware/permission.middleware");
const { Customer } = require("../../common/middleware/Permission");
const userController = require("../controller/user");

router.get("/", Admin, userController.getUser);
router.post("/register/", userController.registerUser);
router.delete("/:id", userController.deleteUser);
router.put("/:id", Customer, userController.editUser);
router.get("/:id", userController.getSingleUser);
module.exports = router;
