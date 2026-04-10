const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testSellerDashboard = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/buildmart');
    console.log('✅ Connected to MongoDB\n');

    // Get a seller
    const seller = await User.findOne({ role: 'seller' });
    if (!seller) {
      console.log('❌ No sellers found');
      process.exit(1);
    }

    console.log('✅ Found seller:');
    console.log('   Name:', seller.name);
    console.log('   Email:', seller.email);
    console.log('   Location:', seller.location);
    console.log('   ID:', seller._id);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testSellerDashboard();
