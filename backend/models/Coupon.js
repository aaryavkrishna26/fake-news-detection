const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String, default: '' },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  maxUsage: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: null }, // For percentage - max discount cap
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  applicableCategories: { type: [String], default: [] }, // Empty = all categories
  applicableLocations: { type: [String], default: [] } // Empty = all locations
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
