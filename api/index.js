const indexRouter = require("express").Router();
const productRouter = require("../products/index");
indexRouter.use("/products",productRouter )
module.exports = indexRouter;