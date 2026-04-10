const express = require('express');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address, city, state, pincode, profileImage, shopName, shopDescription } = req.body;

    const updateData = {
      name,
      phone,
      address,
      city,
      state,
      pincode
    };

    // Only sellers can update shop info
    if (req.body.role === 'seller' || req.user.role === 'seller') {
      updateData.shopName = shopName;
      updateData.shopDescription = shopDescription;
    }

    if (profileImage) {
      updateData.profileImage = profileImage;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get seller profile (for viewing by others)
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const seller = await User.findById(req.params.sellerId)
      .select('name phone location shopName shopDescription profileImage city state');
    
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ error: 'Seller not found' });
    }

    res.json(seller);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update delivery addresses (for buyers)
router.post('/addresses', authenticateToken, async (req, res) => {
  try {
    const { address, city, state, pincode } = req.body;

    if (!address || !city || !state || !pincode) {
      return res.status(400).json({ error: 'All address fields required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { address, city, state, pincode },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Address updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
