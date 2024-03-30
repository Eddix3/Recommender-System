const mongoose = require('mongoose');
const geoJSON = require('./geocode');
const DAYS = require('../config/config.json').daysValid;

function daysFromNow(days) {
    return new Date(new Date().setDate(new Date().getDate() + days));
}

const mostPopularSchema = new mongoose.Schema({
    geocode: {type: geoJSON, index: '2dsphere'},
    online_only: {type: Boolean, required: true, default: false},
    business_ids: {type: [String], required: true},
    lasting_from: {type: Date, required: true, default: new Date()},
    lasting_until: {type: Date, required: true, default: daysFromNow(DAYS)}

}, {collection: 'mostPopular', versionKey: false});
mostPopularSchema.set('toObject', {getters: true});
module.exports = mongoose.model('mostPopular', mostPopularSchema);
