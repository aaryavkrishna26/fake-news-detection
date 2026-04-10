const express = require('express');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Material = require('../models/Material');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.material').populate('items.seller');
    
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { materialId, quantity } = req.body;
    
    if (!materialId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid material or quantity' });
    }

    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    if (material.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient quantity available' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if item already in cart
    const existingItem = cart.items.find(item => item.material.toString() === materialId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        material: materialId,
        quantity,
        price: material.price,
        seller: material.seller
      });
    }

    // Recalculate totals
    let totalPrice = 0;
    cart.items.forEach(item => {
      totalPrice += item.price * item.quantity;
    });

    cart.totalPrice = totalPrice;
    
    // Apply coupon if exists
    if (cart.couponCode) {
      // Discount recalculation will happen when coupon is validated
      cart.finalPrice = cart.totalPrice - cart.discountAmount;
    } else {
      cart.finalPrice = totalPrice;
    }

    await cart.save();
    await cart.populate('items.material').populate('items.seller');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from cart
router.post('/remove/:materialId', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.material.toString() !== req.params.materialId);

    // Recalculate totals
    let totalPrice = 0;
    cart.items.forEach(item => {
      totalPrice += item.price * item.quantity;
    });

    cart.totalPrice = totalPrice;
    cart.finalPrice = cart.totalPrice - cart.discountAmount;

    await cart.save();
    await cart.populate('items.material').populate('items.seller');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update item quantity
router.post('/update/:materialId', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const material = await Material.findById(req.params.materialId);
    if (!material || material.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient quantity available' });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find(i => i.material.toString() === req.params.materialId);
    if (!item) {
      return res.status(404).json({ error: 'Item not in cart' });
    }

    item.quantity = quantity;

    // Recalculate totals
    let totalPrice = 0;
    cart.items.forEach(item => {
      totalPrice += item.price * item.quantity;
    });

    cart.totalPrice = totalPrice;
    cart.finalPrice = cart.totalPrice - cart.discountAmount;

    await cart.save();
    await cart.populate('items.material').populate('items.seller');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
router.post('/clear', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }
    cart.items = [];
    cart.totalPrice = 0;
    cart.finalPrice = 0;
    cart.couponCode = null;
    cart.discountAmount = 0;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
