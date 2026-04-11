const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const materialRoutes = require('./routes/materials');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const couponRoutes = require('./routes/coupons');
const profileRoutes = require('./routes/profile');
const sellerProfileRoutes = require('./routes/sellerProfile');

const app = express();

// Configure CORS to accept requests from Vercel frontend and localhost
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5000',
    'https://build-mart-lyart.vercel.app',
    'https://build-mart-k8h0val3w-aaryav-krishnas-projects.vercel.app',
    'https://build-mart-2ivekau2b-aaryav-krishnas-projects.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} from ${req.get('origin')}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/seller', sellerProfileRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/buildmart')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// Test route
app.get('/', (req, res) => res.send('Backend is running!'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📢 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.JWT_SECRET) {
    console.log('✅ JWT_SECRET is configured');
  } else {
    console.warn('⚠️ JWT_SECRET is not configured! Using default key.');
  }
});