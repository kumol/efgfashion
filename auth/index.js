const router = require("express").Router();
const adminAuthRouter = require("./routes/admin");
const userAuthRouter = require("./routes/user");
router.use("/admin/", adminAuthRouter);
router.use("/user/", userAuthRouter)
module.exports = router;