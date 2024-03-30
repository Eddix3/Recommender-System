const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    user_id: String,
    name: String,
    review_count: Number,
    yelping_since: String,
    useful: Number,
    funny: Number,
    cool: Number,
    elite: [Number],
    friends: [String],
    fans: Number,
    average_stars: Number,
    compliment_hot: Number,
    compliment_more: Number,
    compliment_profile: Number,
    compliment_cute: Number,
    compliment_list: Number,
    compliment_note: Number,
    compliment_plain: Number,
    compliment_cool: Number,
    compliment_funny: Number,
    compliment_writer: Number,
    compliment_photos: Number
}, {collection: 'user'});
userSchema.set('toObject', {getters: true});
module.exports = mongoose.model('user', userSchema);
