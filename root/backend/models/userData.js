const mongoose = require('mongoose');

const ratingsSchema = new mongoose.Schema({
  _id: String,
  ratings: {
    type: [
      "Mixed"
    ]
  }
}, { collection: 'ratingsMatrix' });
ratingsSchema.set('toObject', { getters: true });
module.exports = mongoose.model('userData', ratingsSchema);
