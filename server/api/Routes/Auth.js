const AuthRouter = require("express").Router();

AuthRouter.post("/customer/register",(req,res,next)=>{
    res.json("Register user");
})

module.exports = AuthRouter;