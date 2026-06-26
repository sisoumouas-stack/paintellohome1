const mongoose = require('mongoose');

const paintelloSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: [String]
});

module.exports = mongoose.model('Paintello', paintelloSchema);
