const productRouter = require("express").Router();
const categoryRoute = require("./routes/category");
productRouter.use("/", categoryRoute);
productRouter.use("/", require("./routes/product"));
module.exports = productRouter;