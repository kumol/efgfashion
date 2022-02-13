const { Schema, model } = require("mongoose")

const bannerSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: ""
    },
    title: {
        type: String,
        trim: true,
        default: ""
    },
    banner: {
        type: String,
        trim: true,
        default: ""
    },
    selected: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

module.exports = model("Banner", bannerSchema, "banner")