const router = require("express").Router();
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const roleRouter = require("./routes/role");
router.use("/", userRouter);
router.use("/admin/", adminRouter);
router.use("/role/", roleRouter)
module.exports = router;