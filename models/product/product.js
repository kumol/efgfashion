const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
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
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
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
        ref: 'RatingReview'
    }],
    avgRating: {
        type: Number,
        default: 0,
        enum: [0, 1, 2, 3, 4, 5]
    }
});

const Product = mongoose.model('Product', productSchema, "products");
module.exports = Product;