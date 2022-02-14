const { Schema, model } = require("mongoose")

const validateEmail = function (email) {
    if (email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email)
    }
    return true
}

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: ""
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validateEmail, "Please provide a valid email address"],
        default: ""
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    gender: {
        type: String,
        trim: true,
        default: "",
        enum: ["", "Male", "Female", "Other"]
    },
    maritalStatus: {
        type: String,
        trim: true,
        default: "",
        enum: ["", "Single", "Married", "Separated", "Divorced", "Widowed"]
    },
    dob: {
        type: String,
        trim: true,
        default: ""
    },
    shippingAddress: {
        type: String,
        trim: true,
        default: ""
    },
    deliveryAddress: {
        type: String,
        trim: true,
        default: ""
    },
    postCode: {
        type: String,
        trim: true,
        default: ""
    },
    postOffice: {
        type: String,
        trim: true,
        default: ""
    },
    upazila: {
        type: String,
        trim: true,
        default: ""
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
        default: ""
    },
    otp: {
        type: Number,
        trim: true,
        default: null
    },
    emailVerified: {
        type: Boolean,
        default: false,
        enum: [true, false]
    },
    phoneVerified: {
        type: Boolean,
        default: false,
        enum: [true, false]
    }
}, {
    timestamps: true
})


module.exports = model("User", userSchema)
