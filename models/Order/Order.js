const {Schema, model, Types} = require("mongoose");

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    orderDate:{
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    orderId: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    deliveryAddress: {
        type: String,
        required: true,
        trim: true
    },
    deliveryCharge: {
        type: Number,
        required: true,
        trim: true
    },
    shippingArea: {
        type: String,
        required: true,
        trim: true
    },
    postCode: {
        type: String,
        required: true,
        trim: true
    },
    postOffice: {
        type: String,
        required: true,
        trim: true
    },
    upazila: {
        type: String,
        required: true,
        trim: true
    },
    paymentMethod: {
        type: String,
        default: "cash",
        enum: ["cash", "online"]
    },
    products: [
        {
            id: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            thumbnail: {
                type: String,
                trim: true,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            purchasePrice: {
                type: Number,
                trim: true,
                default: 0
            },
            subTotal: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                default: 0
            },
            category: {
                type: Schema.Types.ObjectId,
                required: true
            }
        }
    ],
    subTotalPrice: {
        type: Number,
        required: true,
        trim: true
    },
    totalPrice: {
        type: Number,
        required: true,
        trim: true
    },
    amountPaid: {
        type: Number,
        default: 0,
    },
    refundedAmount: {
        type: Number,
        default: 0
    },
    paymentStatus: {
        type: String,
        default: "pending",
        enum: ["paid", "pending","ready to refund",
        "refunded"]
    },
    status: {
        type: String,
        default: "created",
        enum: [
            "created",
            "pending",
            "confirmed",
            "picked",
            "Received by warehouse",
            "packed",
            "handed over to courier",
            "delivered",
            "cancelled"
        ]
    },
    transactionId: {
        type: Schema.Types.ObjectId
    },
    trackingNumber:{
        type: String,
        default: null
    },
    shippingCompany:{
        type: String,
        default: null
    },
    deliveryStatus: {
        type: String,
        default: "",
        enum:["", "picked",
        "Received by warehouse",
        "packed",
        "handed over to courier",
        "delivered"]
    },
    isCouponApplied: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },
    coupon: {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
        default: null
    }
}, {
    timestamps: true
});

module.exports = model("Order", OrderSchema, "order");