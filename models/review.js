const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producthome', required: true, index: true },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  // Array since a client may send anywhere from zero to several photos over
  // WhatsApp - each just a URL string, hosted wherever the admin chooses.
  imageUrls: { type: [String], default: [] },
  // Admin adds these manually from real WhatsApp exchanges, so there's no public
  // submission form to worry about spam on - this is just a quick show/hide toggle
  // rather than a moderation queue.
  published: { type: Boolean, default: true },
}, { timestamps: true });

reviewSchema.index({ productId: 1, published: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
