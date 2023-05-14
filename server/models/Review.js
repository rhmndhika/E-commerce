const mongoose = require('mongoose');

const ReviewShcema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true
  },
  order : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'orders',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  img : [String],
}, {
  timestamps: true
});

module.exports = mongoose.model('reviews', ReviewShcema);
