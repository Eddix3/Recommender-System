const mongoose = require('mongoose');
const geoJSON = require('./geocode');

const businessSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    business_id: String,
    name: String,
    address: String,
    city: String,
    state: String,
    postal_code: String,
    latitude: Number,
    longitude: Number,
    stars: Number,
    review_count: Number,
    is_open: Number,
    attributes: mongoose.Mixed,
    categories: String,
    hours: Map,
    geocode: {type: geoJSON, index: '2dsphere'}
}, {collection: 'business', id: false});
businessSchema.set('toObject', {getters: true});
module.exports = mongoose.model('business', businessSchema);
