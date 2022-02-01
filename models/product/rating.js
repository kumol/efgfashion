const {Schema, model} = require("mongoose")

const ratingReviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    rating: {
        type: Number,
        trim: true,
        default: null
    },
    review: {
        type: String,
        trim: true,
        default: ""
    }
}, {
    timestamps: true
})


module.exports = model("RatingReview", ratingReviewSchema);
