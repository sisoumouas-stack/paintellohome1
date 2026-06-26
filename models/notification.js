// models/notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producthome',
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  notified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster lookups
notificationSchema.index({ productId: 1, email: 1 }, { unique: false });

module.exports = mongoose.model('Notification', notificationSchema);
