const express = require('express');
const Order = require('../models/Order');
const Material = require('../models/Material');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get user's orders (buyers)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('buyer', 'name email phone')
      .populate('items.material', 'name category unit price')
      .populate('items.seller', 'name shopName phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch orders'
    });
  }
});

// Get single order details
router.get('/:orderId', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('buyer', 'name email phone')
      .populate('items.material', 'name category unit price')
      .populate('items.seller', 'name shopName phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check authorization: buyer or seller
    const isBuyer = order.buyer._id.toString() === req.user.id;
    const isSeller = order.items.some(item => item.seller._id.toString() === req.user.id);

    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch order'
    });
  }
});

// Create new order from checkout
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { paymentMethod, deliveryAddress, cartItems } = req.body;

    // Validation
    if (!paymentMethod || !['cod', 'card', 'upi'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment method'
      });
    }

    if (!deliveryAddress || !deliveryAddress.address || !deliveryAddress.city) {
      return res.status(400).json({
        success: false,
        error: 'Invalid delivery address'
      });
    }

    // Get cart from request body or localStorage (sent from frontend)
    let items = cartItems || [];

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
    }

    // Validate stock and prepare order items
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of items) {
      const material = await Material.findById(cartItem._id || cartItem.materialId);

      if (!material) {
        return res.status(400).json({
          success: false,
          error: `Material ${cartItem.name} not found`
        });
      }

      if (material.quantity < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${material.name}`
        });
      }

      const itemTotal = material.price * cartItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        material: material._id,
        name: material.name,
        category: material.category,
        unit: material.unit,
        unitPrice: material.price,
        quantity: cartItem.quantity,
        totalPrice: itemTotal,
        seller: material.seller
      });
    }

    // Calculate GST (18%)
    const gstAmount = (subtotal * 0.18).toFixed(2);
    const totalAmount = (parseFloat(subtotal) + parseFloat(gstAmount)).toFixed(2);

    // Create order
    const order = new Order({
      buyer: req.user.id,
      items: orderItems,
      deliveryAddress: {
        name: deliveryAddress.fullName,
        phone: deliveryAddress.mobile,
        pincode: deliveryAddress.pincode,
        address: deliveryAddress.street,
        landmark: deliveryAddress.landmark || '',
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        addressType: deliveryAddress.addressType || 'Home'
      },
      paymentMethod: paymentMethod,
      paymentDetails: {
        cardNumber: paymentMethod === 'card' ? req.body.paymentDetails?.cardNumber : undefined,
        cardholderName: paymentMethod === 'card' ? req.body.paymentDetails?.cardholderName : undefined,
        expiryDate: paymentMethod === 'card' ? req.body.paymentDetails?.expiryDate : undefined,
        upiId: paymentMethod === 'upi' ? req.body.paymentDetails?.upiId : undefined
      },
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'pending',
      subtotal: parseFloat(subtotal).toFixed(2),
      gstAmount: parseFloat(gstAmount),
      totalAmount: parseFloat(totalAmount)
    });

    // Save order
    await order.save();

    // Update material quantities (reduce stock)
    for (const orderItem of orderItems) {
      await Material.findByIdAndUpdate(
        orderItem.material,
        { $inc: { quantity: -orderItem.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.orderStatus
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create order'
    });
  }
});

// Update order status (for sellers or admins)
router.put('/:orderId/status', authenticateToken, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!orderStatus || !validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order status'
      });
    }

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user is a seller in this order or the buyer
    const isSeller = order.items.some(item => item.seller.toString() === req.user.id);
    const isBuyer = order.buyer.toString() === req.user.id;

    if (!isSeller && !isBuyer) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this order'
      });
    }

    // Update status
    order.orderStatus = orderStatus;

    // Set actual delivery date when marked as delivered
    if (orderStatus === 'delivered') {
      order.actualDeliveryDate = new Date();
      order.paymentStatus = 'completed';
    }

    // Set cancellation info if cancelled
    if (orderStatus === 'cancelled' && !order.cancelledDate) {
      order.cancelledDate = new Date();
      order.refundStatus = 'pending';
      order.refundAmount = order.totalAmount;
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update order'
    });
  }
});

// Cancel order (by buyer)
router.post('/:orderId/cancel', authenticateToken, async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Only buyer can cancel
    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Only order buyer can cancel this order'
      });
    }

    // Can't cancel if already shipped or delivered
    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        error: `Cannot cancel order that is already ${order.orderStatus}`
      });
    }

    // Update order
    order.orderStatus = 'cancelled';
    order.cancelledReason = reason || 'Cancelled by buyer';
    order.cancelledDate = new Date();
    order.refundStatus = 'pending';
    order.refundAmount = order.totalAmount;

    // Restore material quantities
    for (const item of order.items) {
      await Material.findByIdAndUpdate(
        item.material,
        { $inc: { quantity: item.quantity } }
      );
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to cancel order'
    });
  }
});

module.exports = router;
