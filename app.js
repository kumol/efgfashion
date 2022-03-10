require("./models/db");
require("dotenv").config({ path: 'ENV_FILENAME' })

const express = require("express");
const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 8080;
const fileUpload = require("express-fileupload")

app.use('/upload/category/banner', express.static('upload/category/banner/'));
app.use('/upload/brand/logo', express.static('upload/brand/logo/'));
app.use('/upload/product/', express.static("upload/product/"));
app.use('/upload/banner/', express.static("upload/banner/"));
app.use('/upload/user/', express.static("upload/user/"));

app.use("/upload", express.static('upload/'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());
app.use("/api/v1", cors(), require("./api/index"));

app.listen(port, () => {
    console.log(`App running on ${port} port`)
});