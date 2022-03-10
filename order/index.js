const router = require("express").Router();
const { Admin } = require("../common/middleware/Permission");
// const { Admin } = require("../../api/middleware/permission.middleware");
const orderRouter = require("./routes/order");
const orderStatRoute = require("./routes/orderstat");
router.use("/", orderRouter);
router.use("/stat/", orderStatRoute);
module.exports = router;