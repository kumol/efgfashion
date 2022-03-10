const { Schema, model } = require("mongoose")

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 50
    },
    banner: {
        type: String,
        required: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'ProductV2',
        default: []
    }],
    isActive: {
        type: Boolean,
        trim: true,
        default: true,
        enum: [true, false]
    },
    indexId: {
        type: Number,
        trim: true,
        default: 0
    },
    id:{
        type: String,
        default:""
    },
    icon:{
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

module.exports = model('ItemCategory', categorySchema, "item_category")
