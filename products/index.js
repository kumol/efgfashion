const productRouter = require("express").Router();
const categoryRoute = require("./routes/category");
const brandRoute = require("./routes/brand");
productRouter.use("/", categoryRoute);
productRouter.use("/", require("./routes/product"));
productRouter.use("/", brandRoute);
module.exports = productRouter;