const Router = require("express").Router();
const AuthRouter = require("./Routes/Auth");
Router.use("/auth", AuthRouter);

module.exports = Router;