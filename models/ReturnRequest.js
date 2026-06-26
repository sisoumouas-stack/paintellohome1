const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReturnRequestSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    numero: { type: String, required: true },
    reason: { 
        type: String, 
        required: true, 
        enum: ['wrong_item', 'defective', 'not_as_described', 'changed_mind', 'other']
    },
    refundMethod: { 
        type: String, 
        required: true, 
        enum: ['exchange', 'ccp_refund'] 
    },
    exchangeItem: String,
    ccpNumber: String,
    notes: String,
    status: { 
        type: String, 
        required: true, 
        enum: ['pending', 'approved', 'rejected', 'processing', 'completed'], 
        default: 'pending' 
    },
    
    // Return Status History
    statusHistory: [{
        status: {
            type: String,
            required: true,
            enum: ['pending', 'approved', 'rejected', 'processing', 'completed']
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        note: String,
        changedBy: String // 'system', 'admin', 'customer'
    }],
    
    processedAt: Date,
    adminNotes: String,
    
    // Return items details
    returnItems: [{
        productId: String,
        productName: String,
        quantity: Number,
        reason: String
    }],
    
    // Refund details
    refundAmount: Number,
    refundDate: Date,
    refundMethod: String
    
}, { timestamps: true });

// Middleware for return status history
ReturnRequestSchema.pre('save', function(next) {
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            changedBy: 'system',
            note: 'Status updated automatically'
        });
    }
    next();
});

module.exports = mongoose.model('ReturnRequest', ReturnRequestSchema);
