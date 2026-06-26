const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  },
  cart: {type: Object, required: true},
  address: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  commune: {type: String, required: true},
  city: {type: String, required: true},
  country: {type: String, required: true},
  numero: {
    type: Number, 
    required: true
  },
  
  orderType: {
    type: String,
    enum: ['guest', 'user'],
    default: 'guest'
  },
  
  status: {
    type: String,
    required: true,
    enum: [
      'pending', 'confirmed', 'processing', 'ready_for_pickup', 
      'shipped', 'out_for_delivery', 'delivered', 'cancelled', 
      'refunded', 'on_hold'
    ],
    default: 'pending'
  },
  
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: String,
    changedBy: String
  }],
  
  shippingFee: { type: Number, default: 0 },
  deliveryDelay: { type: String },
  totalWithShipping: { type: Number },
  trackingNumber: String,
  carrier: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paymentMethod: String,
  
  returnRequest: { type: Schema.Types.ObjectId, ref: 'ReturnRequest' },
  returnStatus: {
    type: String,
    enum: ['none', 'requested', 'approved', 'rejected', 'processing', 'completed'],
    default: 'none'
  },
  
  adminNotes: String,
  customerNotes: String,
  statusUpdatedAt: Date

}, { 
  timestamps: true 
});

// Middleware to automatically update status history
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      changedBy: 'system',
      note: 'Status updated automatically'
    });
    this.statusUpdatedAt = new Date();
  }
  next();
});

// =========================================================
// 🛠️ HELPER: Smart Phone Number Normalization
// =========================================================
function normalizeAlgerianPhone(phoneInput) {
  if (!phoneInput) return null;

  // 1. Convert to string and remove all non-digits
  let str = phoneInput.toString().replace(/\D/g, '');
  
  // 2. Handle cases
  // Case A: Already has 213 prefix (e.g. 213551477635) -> Length 12
  if (str.startsWith('213') && str.length === 12) {
    return parseInt(str, 10);
  }
  
  // Case B: Starts with 0 (e.g. 0551477635) -> Length 10
  if (str.startsWith('0') && str.length === 10) {
    return parseInt('213' + str.substring(1), 10);
  }
  
  // Case C: Just the 9 digits (e.g. 551477635) -> Length 9
  if (str.length === 9) {
    return parseInt('213' + str, 10);
  }
  
  // Case D: Starts with 00213 -> Remove 00
  if (str.startsWith('00213')) {
    return parseInt(str.substring(2), 10);
  }

  // Fallback: Return what we have
  return parseInt(str, 10);
}

// =========================================================
// 🔍 STATIC METHODS
// =========================================================

orderSchema.statics.findByStatus = function(status) {
  return this.find({ status: status }).sort({ createdAt: -1 });
};

// ✅ FIXED: Correctly handles linking regardless of input format
orderSchema.statics.linkGuestOrdersToUser = async function(phoneNumber, userId) {
  const cleanNumero = normalizeAlgerianPhone(phoneNumber);
  
  console.log(`🔗 Linking guest orders: ${phoneNumber} -> Clean: ${cleanNumero} for user ${userId}`);
  
  if (!cleanNumero) return { modifiedCount: 0 };

  return this.updateMany(
    { 
      numero: cleanNumero,
      user: null, // Only unlinked guest orders
      orderType: 'guest'
    },
    { 
      $set: { 
        user: userId,
        orderType: 'user',
        updatedAt: new Date()
      }
    }
  );
};

// ✅ FIXED: Correctly finds user history
orderSchema.statics.findUserCompleteHistory = function(userId, userPhone) {
  const cleanNumero = normalizeAlgerianPhone(userPhone);
  
  console.log(`👤 User history search: ${userPhone} -> Clean: ${cleanNumero}`);
  
  // We search for EITHER the user ID OR the phone number
  // This ensures even if linking failed, they still see their orders
  const query = {
    $or: [
      { user: userId }
    ]
  };

  if (cleanNumero) {
    query.$or.push({ numero: cleanNumero });
  }
  
  return this.find(query).sort({ createdAt: -1 });
};

orderSchema.statics.findByPhoneNumber = function(phoneNumber) {
  const cleanNumero = normalizeAlgerianPhone(phoneNumber);
  console.log(`🔍 findByPhoneNumber: ${phoneNumber} -> ${cleanNumero}`);
  return this.find({ numero: cleanNumero }).sort({ createdAt: -1 });
};

// Universal search (tries multiple formats just in case DB is messy)
orderSchema.statics.findByAnyPhoneFormat = function(phoneNumber) {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  const clean213 = normalizeAlgerianPhone(phoneNumber);
  
  const searchValues = [];
  if (clean213) searchValues.push(clean213);
  
  // Also try raw digits if different
  const rawInt = parseInt(digitsOnly, 10);
  if (!isNaN(rawInt) && rawInt !== clean213) {
    searchValues.push(rawInt);
  }

  return this.find({
    numero: { $in: searchValues }
  }).sort({ createdAt: -1 });
};

// =========================================================
// 📋 INSTANCE METHODS & VIRTUALS
// =========================================================

orderSchema.methods.updateStatus = function(newStatus, note = '', changedBy = 'system') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    note: note,
    changedBy: changedBy,
    timestamp: new Date()
  });
  this.statusUpdatedAt = new Date();
  return this.save();
};

orderSchema.methods.isGuestOrder = function() {
  return this.orderType === 'guest' || !this.user;
};

orderSchema.methods.isUserOrder = function() {
  return this.orderType === 'user' && this.user;
};

// Virtuals
orderSchema.virtual('orderAge').get(function() {
  return Date.now() - this.createdAt;
});

orderSchema.virtual('isDelivered').get(function() {
  return this.status === 'delivered';
});

orderSchema.virtual('canReturn').get(function() {
  if (this.status !== 'delivered' || !this.actualDelivery) return false;
  const fourDays = 4 * 24 * 60 * 60 * 1000; 
  return (Date.now() - this.actualDelivery) <= fourDays;
});

orderSchema.virtual('formattedPhone').get(function() {
  if (!this.numero) return '';
  const numStr = this.numero.toString();
  
  // Format 213551477635 -> 0551477635
  if (numStr.startsWith('213') && numStr.length === 12) {
    return '0' + numStr.substring(3);
  }
  
  return numStr;
});

orderSchema.virtual('orderSource').get(function() {
  if (this.orderType === 'guest' || !this.user) {
    return { 
      type: 'guest', 
      label: 'Commande Invité', 
      color: 'gray',
      icon: 'fa-user-clock'
    };
  }
  return { 
    type: 'user', 
    label: 'Commande Compte', 
    color: 'green',
    icon: 'fa-user-check'
  };
});

orderSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'pending': 'En Attente',
    'confirmed': 'Confirmée',
    'processing': 'En Préparation',
    'ready_for_pickup': 'Prête à Expédier',
    'shipped': 'Expédiée',
    'out_for_delivery': 'En Livraison',
    'delivered': 'Livrée',
    'cancelled': 'Annulée',
    'refunded': 'Remboursée',
    'on_hold': 'En Attente'
  };
  return statusMap[this.status] || this.status;
});

orderSchema.virtual('returnStatusDisplay').get(function() {
  const statusMap = {
    'none': 'Aucun',
    'requested': 'Demandé',
    'approved': 'Approuvé',
    'rejected': 'Rejeté',
    'processing': 'En Cours',
    'completed': 'Terminé'
  };
  return statusMap[this.returnStatus] || this.returnStatus;
});

orderSchema.index({ numero: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
