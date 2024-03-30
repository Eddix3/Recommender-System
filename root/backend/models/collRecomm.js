const mongoose = require('mongoose');
const DAYS = require('../config/config.json').daysValid;

function daysFromNow(days) {
  return new Date(new Date().setDate(new Date().getDate() + days));
}

const collRecommSchema = new mongoose.Schema({
  _id: String,
  recommendations: {
    type: [
      "Mixed"
    ]
  },
  lasting_from: {type: Date, required: true, default: new Date()},
  lasting_until: {type: Date, required: true, default: daysFromNow(DAYS)}
}, { collection: 'collRecomm' });
collRecommSchema.set('toObject', { getters: true });
module.exports = mongoose.model('collRecomm', collRecommSchema);