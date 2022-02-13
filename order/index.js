const router = require("express").Router();
const { Admin } = require("../common/middleware/Permission");
const orderRouter = require("./routes/order");
router.use("/", Admin, orderRouter);

module.exports = router;