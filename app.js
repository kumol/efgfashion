require("./config/db");
const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 8080;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, () => {
    console.log(`App running on ${port} port`)
});