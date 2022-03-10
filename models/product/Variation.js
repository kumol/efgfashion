const {Schema, model} = require("mongoose");

const variationSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim:true
    },
    values: [{
        type: String,
        required: true,
        trim:true
    }]
});

module.exports = model("Variation", variationSchema, "variation");
