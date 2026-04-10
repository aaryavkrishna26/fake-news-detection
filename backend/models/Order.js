const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        material: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Material',
          required: true
        },
        name: String,
        category: String,
        unit: String,
        unitPrice: {
          type: Number,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        totalPrice: {
          type: Number,
          required: true
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      }
    ],
    deliveryAddress: {
      name: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      pincode: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      landmark: String,
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      addressType: {
        type: String,
        enum: ['Home', 'Work', 'Other'],
        default: 'Home'
      }
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'card', 'upi'],
      required: true
    },
    paymentDetails: {
      cardNumber: String,
      cardholderName: String,
      expiryDate: String,
      upiId: String
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    subtotal: {
      type: Number,
      required: true
    },
    gstAmount: {
      type: Number,
      required: true
    },
    deliveryCharge: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    couponApplied: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon'
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    notes: String,
    trackingNumber: String,
    estimatedDeliveryDate: Date,
    actualDeliveryDate: Date,
    cancelledReason: String,
    cancelledDate: Date,
    refundAmount: {
      type: Number,
      default: 0
    },
    refundStatus: {
      type: String,
      enum: ['none', 'pending', 'completed'],
      default: 'none'
    }
  },
  {
    timestamps: true
  }
);

// Auto-increment order number
orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    try {
      const lastOrder = await mongoose.model('Order')
        .findOne({})
        .sort({ createdAt: -1 })
        .exec();

      let orderNum = 1001;
      if (lastOrder && lastOrder.orderNumber) {
        const lastNum = parseInt(lastOrder.orderNumber.replace('ORD-', ''));
        orderNum = lastNum + 1;
      }

      this.orderNumber = `ORD-${orderNum}`;
    } catch (error) {
      console.error('Error generating order number:', error);
    }
  }

  // Calculate estimated delivery date if not set (3-5 business days)
  if (!this.estimatedDeliveryDate) {
    const deliveryDate = new Date();
    const daysToAdd = Math.floor(Math.random() * 3) + 3;
    let addedDays = 0;

    while (addedDays < daysToAdd) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      addedDays++;
    }

    this.estimatedDeliveryDate = deliveryDate;
  }

  next();
});

// Calculate totals before saving
orderSchema.pre('save', function (next) {
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.gstAmount = (this.subtotal * 0.18).toFixed(2);
    this.totalAmount = (
      parseFloat(this.subtotal) +
      parseFloat(this.gstAmount) +
      (this.deliveryCharge || 0) -
      (this.discountAmount || 0)
    ).toFixed(2);
  }

  next();
});

// Populate references
orderSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }

  this.populate({
    path: 'buyer',
    select: 'name email phone'
  }).populate({
    path: 'items.material',
    select: 'name category unit price'
  }).populate({
    path: 'items.seller',
    select: 'name shopName phone'
  }).populate({
    path: 'couponApplied',
    select: 'code discountPercentage'
  });

  next();
});

module.exports = mongoose.model('Order', orderSchema);
