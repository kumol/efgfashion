const router = require("express").Router();
const userController = require("../controller/user");

router.get("/", userController.getUser);
router.post("/", userController.registerUser);
router.delete("/:id", userController.deleteUser);
module.exports = router;
