const {Schema, model} = require("mongoose");

const brandSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim:true
    },
    logo: {
        type: String,
        default: ""
    },
    productCount: {
        type: Number,
        default: 0
    }
});

module.exports = model("Brand", brandSchema, "brand");
