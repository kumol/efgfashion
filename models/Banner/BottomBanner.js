const { Schema, model } = require("mongoose");

let bannerSchema = new Schema({
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
    }
})

const bottomBannerSchema = new Schema({
    firstBanner: {
        type: bannerSchema
    },
    secondBanner: {
        type: bannerSchema
    },
    thirdBanner: {
        type: bannerSchema
    }
});

module.exports = model("BottomBanner", bottomBannerSchema, "bottomBanner");