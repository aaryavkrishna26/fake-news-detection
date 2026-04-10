const express = require('express');
const authenticateToken = require('../middleware/auth');
const User = require('../models/User');
const Material = require('../models/Material');
const Order = require('../models/Order');

const router = express.Router();

// Middleware to check seller role
const checkSeller = (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ error: 'Only sellers can access this' });
  }
  next();
};

// 1. GET /api/seller/profile - Get seller's profile
router.get('/profile', authenticateToken, checkSeller, async (req, res) => {
  try {
    const seller = await User.findById(req.user.id).select('-password');
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    // Count total listings
    const totalListings = await Material.countDocuments({ sellerId: req.user.id });

    // Count total orders (where any item belongs to this seller)
    const totalOrders = await Order.countDocuments({
      'items.sellerId': req.user.id
    });

    res.json({
      profile: seller.shopProfile,
      totalListings,
      totalOrders,
      user: seller
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// 2. PUT /api/seller/profile - Update seller's profile
router.put('/profile', authenticateToken, checkSeller, async (req, res) => {
  try {
    const {
      shopName,
      ownerName,
      contactNumber,
      email,
      address,
      shopCategory,
      gstNumber,
      shopBio
    } = req.body;

    const seller = await User.findById(req.user.id);
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    // Update shopProfile
    seller.shopProfile = {
      shopName: shopName || seller.shopProfile.shopName,
      ownerName: ownerName || seller.shopProfile.ownerName,
      contactNumber: contactNumber || seller.shopProfile.contactNumber,
      email: email || seller.shopProfile.email,
      address: address || seller.shopProfile.address,
      shopCategory: shopCategory || seller.shopProfile.shopCategory,
      gstNumber: gstNumber || seller.shopProfile.gstNumber,
      shopBio: shopBio || seller.shopProfile.shopBio,
      isProfileComplete: !!(
        shopName &&
        ownerName &&
        contactNumber &&
        email &&
        address?.street &&
        address?.city &&
        address?.state &&
        address?.pincode &&
        shopCategory
      )
    };

    await seller.save();

    res.json({
      message: 'Profile updated successfully',
      profile: seller.shopProfile
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// 3. GET /api/seller/orders - Get all orders for this seller
router.get('/orders', authenticateToken, checkSeller, async (req, res) => {
  try {
    const orders = await Order.find({ 'items.sellerId': req.user.id })
      .populate('buyerId', 'name phone email')
      .sort({ createdAt: -1 });

    // Transform orders to show only items belonging to this seller
    const sellerOrders = orders
      .map(order => {
        const sellerItems = order.items.filter(
          item => item.sellerId.toString() === req.user.id.toString()
        );

        if (sellerItems.length === 0) return null;

        return {
          _id: order._id,
          orderId: order.orderId,
          buyerId: order.buyerId,
          buyerName: order.buyerId?.name || 'Unknown',
          buyerPhone: order.buyerId?.phone || 'N/A',
          buyerEmail: order.buyerId?.email || 'N/A',
          items: sellerItems,
          deliveryAddress: order.deliveryAddress,
          totalAmount: sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          paymentMethod: order.paymentMethod,
          orderStatus: order.orderStatus,
          createdAt: order.createdAt
        };
      })
      .filter(order => order !== null);

    res.json(sellerOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// 4. PUT /api/seller/orders/:orderId/status - Update order status
router.put('/orders/:orderId/status', authenticateToken, checkSeller, async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    // Validate status
    const validStatuses = ['Pending', 'Confirmed', 'Dispatched', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if seller owns any items in this order
    const sellerOwnsItems = order.items.some(
      item => item.sellerId.toString() === req.user.id.toString()
    );

    if (!sellerOwnsItems) {
      return res.status(403).json({ error: 'You do not own items in this order' });
    }

    // Update order status
    order.orderStatus = status;
    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
