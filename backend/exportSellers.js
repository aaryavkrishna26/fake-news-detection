const mongoose = require('mongoose');
const User = require('./models/User');
const Material = require('./models/Material');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const exportSellers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/buildmart');
    console.log('✅ Connected to MongoDB\n');

    const sellers = await User.find({ role: 'seller' });
    const materials = await Material.find({});

    // Group sellers by city
    const sellersByCity = {};
    sellers.forEach(seller => {
      if (!sellersByCity[seller.location]) {
        sellersByCity[seller.location] = [];
      }
      sellersByCity[seller.location].push(seller);
    });

    // Create files for each seller organized by city
    for (const [city, citySellers] of Object.entries(sellersByCity)) {
      console.log(`\n📍 Processing: ${city}`);
      
      citySellers.forEach(seller => {
        // Get seller's materials
        const sellerMaterials = materials.filter(m => m.seller && m.seller.toString() === seller._id.toString());
        
        const sellerData = {
          name: seller.name,
          email: seller.email,
          password: 'hello',
          contact: seller.phone,
          location: seller.location,
          address: sellerMaterials.length > 0 ? sellerMaterials[0].location.address : 'Address not available',
          totalMaterials: sellerMaterials.length,
          createdAt: seller.createdAt
        };

        const fileName = seller.email.split('@')[0] + '.json';
        const filePath = path.join(__dirname, '..', 'sellers', city, fileName);
        
        fs.writeFileSync(filePath, JSON.stringify(sellerData, null, 2));
        console.log(`   ✓ ${fileName} created`);
      });
    }

    console.log(`\n${'═'.repeat(50)}`);
    console.log(`✅ SELLER DATA EXPORTED SUCCESSFULLY!`);
    console.log(`${'═'.repeat(50)}`);
    console.log(`\n📂 Files created for all ${sellers.length} sellers\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error exporting sellers:', error);
    process.exit(1);
  }
};

exportSellers();
