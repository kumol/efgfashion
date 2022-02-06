require("./models/db");
require("dotenv").config()

const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1", require("./api/index"));

app.listen(port, () => {
    console.log(`App running on ${port} port`)
});