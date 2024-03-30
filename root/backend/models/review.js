const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    review_id: String,
    user_id: String,
    business_id: String,
    stars: Number,
    date: {type: Date, index: -1},
    text: String,
    useful: Number,
    funny: Number,
    cool: Number
}, {collection: 'review'});
reviewSchema.set('toObject', {getters: true});
module.exports = mongoose.model('review', reviewSchema);
