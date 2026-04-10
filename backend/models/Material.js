const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, enum: ['per bag', 'per ton', 'per piece', 'per sqft', 'per cubic foot'], default: 'per bag' },
  category: {
    type: String,
    enum: ['Cement', 'Sand', 'Steel/TMT Bars', 'Bricks', 'Aggregates', 'Paint', 'Tiles', 'Pipes', 'Electrical', 'Wood/Timber'],
    required: true
  },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String },
    address: { type: String }
  },
  shopName: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Index for faster querying by city and category
materialSchema.index({ 'location.city': 1, 'category': 1 });
materialSchema.index({ 'location.city': 1 });

module.exports = mongoose.model('Material', materialSchema);