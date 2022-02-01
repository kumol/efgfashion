const router = require("express").Router();
// const productRouter = require("../products/index");
// const userRouter = require("../user/index");
router.use("/products", require("../products/index"));
router.use("/user", require("../user/index"));

module.exports = router;