const productRouter = require("express").Router();
const categoryRoute = require("./routes/category");
productRouter.use("/", categoryRoute);

module.exports = productRouter;