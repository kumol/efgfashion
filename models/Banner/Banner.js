const { Schema, model } = require("mongoose")

const bannerSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    details: {
        type: String,
        trim: true,
        required: true
    },
    buttonOneText: {
        type: String,
        trim: true,
        default: ""
    },
    buttonOneUrl: {
        type: String,
        trim: true,
        default: ""
    },
    buttonTwoText: {
        type: String,
        trim: true,
        default: ""
    },
    buttonTwoUrl: {
        type: String,
        trim: true,
        default: ""
    },
    banner: {
        type: String,
        trim: true,
        required: true
    },
    publish: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

module.exports = model("Banner", bannerSchema, "banner")