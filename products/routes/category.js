const route = require("express").Router();

route.get("/",(req,res)=>{
    res.json({
        body: "Hello"
    });
});

module.exports = route;