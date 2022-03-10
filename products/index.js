const productRouter = require("express").Router();
const categoryRoute = require("./routes/category");
const brandRoute = require("./routes/brand");
const variationRoute = require('./routes/variation')
const subCategoryRoute = require('./routes/subcategory')
productRouter.use("/", categoryRoute);
productRouter.use("/", require("./routes/product"));
productRouter.use("/", brandRoute);
productRouter.use("/", variationRoute);
productRouter.use("/", subCategoryRoute);
module.exports = productRouter;