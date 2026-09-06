const mongoose = require('mongoose');

const paintelloSchema = new mongoose.Schema({
  title: String,
  price: Number,
  buyPrice: {
    type: Number,
    default: 0
  },
  image: [String],
  href: String,
  status: String,
  category: {
    type: String,
    lowercase: true,
    trim: true,
    default: 'vase'
  },
  type: {
    type: String,
    lowercase: true,
    trim: true
  }
});

module.exports = mongoose.model('Paintello', paintelloSchema);
