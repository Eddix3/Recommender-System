const mongoose = require('mongoose');

const geoSchema = new mongoose.Schema({
    type: {type: String, enum: ['Point'], required: true},
    coordinates: {type: [Number], required: true}
}, {id: false, _id: false});
geoSchema.set('toObject', {getters: true});
module.exports = geoSchema
