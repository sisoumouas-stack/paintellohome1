const mongoose = require('mongoose');

const whatsappMessageSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true }, // format international, ex: "213555123456"
  customerName: { type: String, default: '' },
  direction: { type: String, enum: ['in', 'out'], required: true },
  text: { type: String, required: true },
  read: { type: Boolean, default: false }, // pour un badge "non lu" dans la liste
}, { timestamps: true });

module.exports = mongoose.model('WhatsAppMessage', whatsappMessageSchema);
