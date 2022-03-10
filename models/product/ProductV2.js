const {Schema, model} = require("mongoose");

const productSchema = new Schema({
    productId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim:true
    },
    banglaName:{
        type: String
    },
    sku: {
        type: String,
        require: true,
        trim:true
    },
    barcodeType: {
        type: String,
        require: true,
        trim:true
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'ItemCategory'
    },
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: 'ItemSubCategory'
    },
    business_locations: [{
        type: String,
        required: true,
        trim:true
    }],
    manageStock: {
        type: Boolean,
        default: false
    },
    alertQuantity: {
        type: Number
    },
    description: {
        type: String,
        default: ""
    },
    shortDescription: {
        type: String,
        default: ""
    },
    featuredImage: {
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
    galleryImages: [{
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
    }],
    weight: {
        type: Number,
        required: true
    },
    length: {
        type: Number,
        default: null
    },
    width: {
        type: Number,
        default: null
    },
    height: {
        type: Number,
        default: null
    },
    customFields: [{
        label: {
            type: String,
            trim: true,
            required: true
        },
        value: {
            type: String,
            trim: true,
            required: true
        }
    }],
    applicableTax: {
        type: String,
        default: ""
    },
    sellingPriceTax: {
        type: String,
        default: ""
    },
    productType: {
        type: String,
        default: ""
    },
    variation: [{
        parent: {
            type: Schema.Types.ObjectId,
            ref: 'Variation'
        },
        values: [{
            sku: {
                type: String,
                trim: true,
                required: true
            },
            value: {
                type: String,
                trim: true,
                required: true
            },
            priceExcludingTax: {
                type: Number,
                required: true,
                trim: true
            },
            priceIncludingTax: {
                type: Number,
                required: true,
                trim: true
            },
            margin: {
                type: Number,
                required: true,
                trim: true
            },
            sellingPrice: {
                type: Number,
                required: true,
                trim: true
            },
            images: [{
                type: String,
                trim: true,
                required: true
            }],
            manageStock: {
                type: Boolean,
                default: true
            },
            alertAmount: {
                type: Number,
                default: 0
            },
            stockAmount: {
                type: Number,
                default: 0
            }
        }]
    }],
    published: {
        type: Boolean,
        default: true
    },
    stockAmount: {
        type: Number,
        default: 0
    }
});

module.exports = model("ProductV2", productSchema, "ProductV2");
