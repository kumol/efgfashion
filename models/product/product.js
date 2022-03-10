const {Schema, model} = require("mongoose");

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 250
    },
    banglaName:{
        type: String
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        require: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    shortDescription: {
        type: String,
        default: ""
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'ItemCategory',
        require: true
    },
    tags: [{
        type: String,
        required: true,
        trim: true
    }],
    purchasePrice: {
        type: Number,
        required: true,
        trim: true
    },
    salePrice: {
        type: Number,
        required: true,
        trim: true
    }, 
    discountType: {
        type: String,
        trim: true,
        default: null,
        enum: [null, 'Flat', 'Percentage']
    },
    discountAmount: {
        type: Number,
        trim: true,
        default: null
    },
    thumbnail: {
        small: {
            type: String,
            trim: true,
            required: true
        },
        large: {
            type: String,
            trim: true,
            required: true
        }
    },
    secondImage: {
        type: String,
        trim: true,
        default: ""
    },
    thirdImage: {
        type: String,
        trim: true,
        default: ""
    },
    fourthImage: {
        type: String,
        trim: true,
        default: ""
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    ratingReview: [{
        type: Schema.Types.ObjectId,
        ref: 'RatingReview',
        default: []
    }],
    avgRating: {
        type: Number,
        default: 0,
        enum: [0, 1, 2, 3, 4, 5]
    }
});

module.exports = model('Product', productSchema, "products");