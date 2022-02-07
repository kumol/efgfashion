const router = require("express").Router();
const orderRouter = require("./routes/order");
router.use("/", orderRouter);

module.exports = router;