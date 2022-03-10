const { Schema, model } = require("mongoose");

let bannerSchemaNew = new Schema({
    banner: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    subTitle: {
        type: String,
        required: true,
        trim: true
    },
    details: {
        type: String,
        required: true,
        trim: true
    },
    redirectUrl: {
        type: String,
        required: true,
        trim: true
    },
    btnName: {
        type: String,
        required: true,
        trim: true
    },
    published: {
        type: Boolean,
        default: true
    }
})

module.exports = model("BottomBannerNew", bannerSchemaNew, "bottomBannerNew");