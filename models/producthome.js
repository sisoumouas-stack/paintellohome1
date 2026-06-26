// models/product.js
const mongoose = require('mongoose');

// models/product.js - Update the type field
const producthomeSchema = new mongoose.Schema({
  title: String,
  price: Number,
  oldPrice: {          
    type: Number,
    default: null
  },
  disponible: {
    type: Boolean,
    default: true
  },
  image: [String],         
  description: String,     
  details: Object,         
  // 👇 MAKE TYPE MORE STRUCTURED
  type: {
    type: String,
    index: true,  // Add index for faster queries
    lowercase: true,  // Convert to lowercase for consistency
    trim: true  // Remove extra spaces
  },
  videoId: String,
  videoFile: {
    type: String,
    default: null
  },
  stlFile: {
    type: String,
    default: null
  },
  model3D: {
    enabled: {
      type: Boolean,
      default: false
    },
    autoRotate: {
      type: Boolean,
      default: true
    },
    defaultColor: {
      type: String
    }
  }
  // ❌ REMOVE relatedProducts array - we don't need it!
}, {
  timestamps: true
});
// Virtual property to check if product has 3D model
producthomeSchema.virtual('has3DModel').get(function() {
  return !!this.stlFile;
});

// Virtual property to check if product has video
producthomeSchema.virtual('hasVideo').get(function() {
  return !!(this.videoFile || this.videoId);
});

module.exports = mongoose.model('Producthome', producthomeSchema);
