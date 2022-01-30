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
        default: null
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validateEmail, "Please provide a valid email address"],
        default: null
    },
    phone: {
        type: String,
        trim: true,
        require: true
    },
    gender: {
        type: String,
        trim: true,
        default: null,
        enum: [null, "Male", "Female", "Other"]
    },
    maritalStatus: {
        type: String,
        trim: true,
        default: null,
        enum: [null, "Single", "Married", "Separated", "Divorced", "Widowed"]
    },
    dob: {
        type: Date,
        trim: true,
        default: null
    },
    shippingAddress: [{
        type: String,
        trim: true,
        default: null
    }],
    deliveryAddress: [{
        type: String,
        trim: true,
        default: null
    }],
    postCode: [{
        type: String,
        trim: true,
        default: null
    }],
    postOffice: [{
        type: String,
        trim: true,
        default: null
    }],
    upazila: [{
        type: String,
        trim: true,
        default: null
    }],
    password: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
        default: null
    },
    otp: {
        type: Number,
        trim: true,
        default: null
    },
    phoneVerified: {
        type: Boolean,
        default: false,
        enum: [true, false]
    }
}, {
    timestamps: true
})


const User = model("User", userSchema)
module.exports = User
