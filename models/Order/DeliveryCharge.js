const {Schema, model} = require("mongoose");

const delveryChargeSchema = new Schema({
    zoneInsideDhaka: {
        type: [String],
        default: []
    },
    zoneInsideDhakaCharge: {
        type: Number,
        required: true
    },
    zoneOutsideDhaka: {
        type: [String],
        default: []
    },
    zoneOutsideDhakaCharge: {
        type: Number,
        required: true
    },
    origin: {
        type: String,
        required: true
    }
});

module.exports = model("DeliveryCharge", delveryChargeSchema, "deliveryCharge")