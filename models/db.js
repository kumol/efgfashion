// const mongoose = require("mongoose");
// const dbUrl = "mongodb+srv://mamun166009:1118964208@cluster0-lkz2b.mongodb.net/efgfashion-api?retryWrites=true&w=majority"
// mongoose.connect(process.env.DB_URL, (err)=>{
//     console.log(!err ? "Successfully connected " : err);
// })

const DB_URL = "mongodb+srv://kumol:kumol254@cluster0.tsazd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const mongoose = require("mongoose");
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false
})
    .then(() => console.log("Database connected"))
    .catch(error => {
        if (error) console.log("Database connection failed")
    })