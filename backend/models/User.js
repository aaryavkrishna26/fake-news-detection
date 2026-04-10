const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['seller', 'buyer'], required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  shopName: { type: String, default: '' }, // For sellers
  shopDescription: { type: String, default: '' }, // For sellers
  shopProfile: {
    shopName: { type: String, default: '' },
    ownerName: { type: String, default: '' },
    contactNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' }
    },
    shopCategory: { type: String, default: '' },
    gstNumber: { type: String, default: '' },
    shopBio: { type: String, default: '' },
    isProfileComplete: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);