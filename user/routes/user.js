const router = require("express").Router();
const { Admin } = require("../../common/middleware/Permission");
const userController = require("../controller/user");

router.get("/", userController.getUser);
router.post("/", userController.registerUser);
router.delete("/:id", Admin, userController.deleteUser);
module.exports = router;
