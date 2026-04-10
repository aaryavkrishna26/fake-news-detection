const express = require('express');
const Material = require('../models/Material');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify token
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Get all materials (with optional city, category, and sort filters)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    const { city, category, sortBy } = req.query;
    
    if (city) {
      filter['location.city'] = city;
    }
    if (category) {
      filter.category = category;
    }
    
    let query = Material.find(filter).populate('seller', 'name phone');
    
    // Apply sorting
    if (sortBy === 'price-low') {
      query = query.sort({ price: 1 });
    } else if (sortBy === 'price-high') {
      query = query.sort({ price: -1 });
    } else if (sortBy === 'newest') {
      query = query.sort({ createdAt: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }
    
    const materials = await query.exec();
    res.json(materials);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get unique cities
router.get('/cities/unique', async (req, res) => {
  try {
    const cities = await Material.find({ isAvailable: true }).distinct('location.city');
    res.json(cities.sort());
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add material (sellers only)
router.post('/', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'seller') return res.status(403).json({ error: 'Only sellers can add materials' });
    const material = new Material({ ...req.body, seller: req.user.id });
    await material.save();
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update material (owner only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material || material.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    Object.assign(material, req.body);
    await material.save();
    res.json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete material (owner only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ 
        success: false,
        error: 'Material not found' 
      });
    }
    
    if (material.seller.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        error: 'Not authorized to delete this material' 
      });
    }

    await Material.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true,
      message: 'Material deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(400).json({ 
      success: false,
      error: error.message || 'Failed to delete material'
    });
  }
});

// Get seller dashboard (seller's own shop and materials)
router.get('/seller-dashboard', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ error: 'Only sellers can access this' });
    }

    // Get seller info
    const seller = await User.findById(req.user.id);
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    // Get all materials for this seller
    const materials = await Material.find({ seller: req.user.id }).sort({ createdAt: -1 });

    res.json({
      shop: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        location: seller.location
      },
      materials: materials
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;