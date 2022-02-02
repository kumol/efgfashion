const mongoose = require("mongoose");
const dbUrl = "mongodb+srv://mamun166009:1118964208@cluster0-lkz2b.mongodb.net/efgfashion-api?retryWrites=true&w=majority"
mongoose.connect(dbUrl, (err)=>{
    console.log(!err ? "Successfully connected " : err);
})