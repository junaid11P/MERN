const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  shippingAddress: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentDetails: {
    cardNumber: String,
    cardExpiry: String,
    cardCVV: String
  },
  trackingNumber: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Generate tracking number before saving
orderSchema.pre('save', function(next) {
  if (!this.trackingNumber) {
    // Generate a unique tracking number: ORD-TIMESTAMP-RANDOM
    this.trackingNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

// Virtual for order status updates
orderSchema.virtual('statusUpdates').get(function() {
  const updates = [];
  
  updates.push({
    status: 'pending',
    date: this.createdAt
  });

  if (this.status !== 'pending') {
    updates.push({
      status: this.status,
      date: this.updatedAt
    });
  }

  return updates;
});

// Method to update order status
orderSchema.methods.updateStatus = async function(newStatus) {
  this.status = newStatus;
  return this.save();
};

// Method to cancel order
orderSchema.methods.cancelOrder = async function() {
  if (this.status === 'shipped' || this.status === 'delivered') {
    throw new Error('Cannot cancel order that has been shipped or delivered');
  }
  
  this.status = 'cancelled';
  return this.save();
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;