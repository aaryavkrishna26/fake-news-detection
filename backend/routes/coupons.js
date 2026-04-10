const express = require('express');
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Validate and apply coupon to cart
router.post('/apply', authenticateToken, async (req, res) => {
  try {
    const { couponCode } = req.body;

    if (!couponCode) {
      return res.status(400).json({ error: 'Coupon code required' });
    }

    // Find coupon
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ error: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ error: 'Coupon is inactive' });
    }

    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({ error: 'Coupon has expired' });
    }

    if (coupon.usedCount >= coupon.maxUsage) {
      return res.status(400).json({ error: 'Coupon usage limit exceeded' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Check minimum order amount
    if (cart.totalPrice < coupon.minOrderAmount) {
      return res.status(400).json({ 
        error: `Minimum order amount of ₹${coupon.minOrderAmount} required` 
      });
    }

    // Calculate discount
    let discountAmount = 0;
    
    if (coupon.discountType === 'percentage') {
      discountAmount = (cart.totalPrice * coupon.discountValue) / 100;
      
      // Cap discount if maxDiscount is set
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed total
    if (discountAmount > cart.totalPrice) {
      discountAmount = cart.totalPrice;
    }

    // Apply coupon to cart
    cart.couponCode = couponCode.toUpperCase();
    cart.discountAmount = discountAmount;
    cart.finalPrice = cart.totalPrice - discountAmount;

    await cart.save();
    await cart.populate('items.material');

    res.json({
      message: 'Coupon applied successfully',
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discount: coupon.discountType === 'percentage' 
          ? `${coupon.discountValue}% off` 
          : `₹${coupon.discountValue} off`
      },
      discountAmount,
      cart
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove coupon from cart
router.post('/remove', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.couponCode = null;
    cart.discountAmount = 0;
    cart.finalPrice = cart.totalPrice;

    await cart.save();

    res.json({ message: 'Coupon removed', cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List all active coupons (for reference)
router.get('/list/active', async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gte: new Date() }
    }).select('code description discountType discountValue minOrderAmount');

    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Create coupon (optional)
router.post('/create', authenticateToken, async (req, res) => {
  try {
    // In production, check if user is admin
    const { code, description, discountType, discountValue, maxUsage, minOrderAmount, maxDiscount, expiryDate } = req.body;

    const coupon = new Coupon({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      maxUsage,
      minOrderAmount,
      maxDiscount,
      expiryDate: new Date(expiryDate)
    });

    await coupon.save();
    res.json({ message: 'Coupon created', coupon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
