const mongoose = require('mongoose');

const whatsappMessageSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true }, // format international, ex: "213555123456"
  customerName: { type: String, default: '' },
  direction: { type: String, enum: ['in', 'out'], required: true },
  text: { type: String, required: true },
  // Renseignés uniquement pour les messages entrants de type image/vidéo/audio/document/sticker.
  // mediaId est l'identifiant Meta, pas une URL - voir la route GET /admin/whatsapp/media/:mediaId
  // dans routes/user.js qui le résout à la demande (les URLs Meta expirent, l'ID non).
  mediaId: { type: String, default: null },
  mediaType: { type: String, enum: ['image', 'video', 'audio', 'document', 'sticker', null], default: null },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('WhatsAppMessage', whatsappMessageSchema);
