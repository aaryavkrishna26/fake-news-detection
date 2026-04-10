const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Material = require('./models/Material');
require('dotenv').config();

const CITIES = ['Mumbai', 'Delhi', 'Lucknow', 'Jaipur', 'Indore'];

// Unique seller names per city with price variations
const SELLERS_BY_CITY = {
  Mumbai: [
    { name: 'Bandra Building Materials', priceMultiplier: 0.95 },
    { name: 'Andheri Construction Hub', priceMultiplier: 1.0 },
    { name: 'Dadar Premium Supplies', priceMultiplier: 1.05 },
    { name: 'Thane Quality Materials', priceMultiplier: 0.92 },
    { name: 'Navi Mumbai Build Mart', priceMultiplier: 1.03 }
  ],
  Delhi: [
    { name: 'Okhla Industrial Traders', priceMultiplier: 0.98 },
    { name: 'Shahdara Construction Co', priceMultiplier: 1.0 },
    { name: 'Dwarka Build Solutions', priceMultiplier: 1.04 },
    { name: 'Noida Industrial Supplies', priceMultiplier: 0.94 },
    { name: 'Ghaziabad Materials House', priceMultiplier: 1.02 }
  ],
  Lucknow: [
    { name: 'Gomti Nagar Builders', priceMultiplier: 0.96 },
    { name: 'Lucknow Build Store', priceMultiplier: 1.0 },
    { name: 'Alambagh Construction', priceMultiplier: 1.03 },
    { name: 'Charbagh Quality Mart', priceMultiplier: 0.99 },
    { name: 'Nigam Bodh Ghat Materials', priceMultiplier: 1.01 }
  ],
  Jaipur: [
    { name: 'Mahesh Nagar Traders', priceMultiplier: 0.97 },
    { name: 'Jaipur City Builders', priceMultiplier: 1.0 },
    { name: 'Sodala Construction Hub', priceMultiplier: 1.02 },
    { name: 'Shyam Nagar Supplies', priceMultiplier: 0.98 },
    { name: 'Ajmer Road Materials', priceMultiplier: 1.04 }
  ],
  Indore: [
    { name: 'Indore Build Center', priceMultiplier: 0.96 },
    { name: 'Vijay Nagar Traders', priceMultiplier: 1.0 },
    { name: 'Prabhat Square Supplies', priceMultiplier: 1.03 },
    { name: 'Bada Bazaar Materials', priceMultiplier: 0.99 },
    { name: 'Racecourse Road Construction', priceMultiplier: 1.02 }
  ]
};

const MATERIALS_CATALOG = [
  {
    name: 'Cement',
    category: 'Cement',
    unit: 'per bag',
    basePrice: 380,
    quantities: 1000,
    description: 'Premium Portland Cement - Grade OPC 53'
  },
  {
    name: 'Sand',
    category: 'Sand',
    unit: 'per ton',
    basePrice: 1200,
    quantities: 500,
    description: 'M-Sand (Manufactured Sand) - Fine & Medium'
  },
  {
    name: 'Steel/TMT Bars',
    category: 'Steel/TMT Bars',
    unit: 'per ton',
    basePrice: 55000,
    quantities: 100,
    description: 'TMT Steel Bars - 12mm, 16mm, 20mm variants'
  },
  {
    name: 'Bricks',
    category: 'Bricks',
    unit: 'per piece',
    basePrice: 8,
    quantities: 50000,
    description: 'Clay Bricks - Standard & Quality Grade'
  },
  {
    name: 'Aggregates',
    category: 'Aggregates',
    unit: 'per ton',
    basePrice: 900,
    quantities: 500,
    description: '10mm & 20mm Aggregates - Graded & Washed'
  },
  {
    name: 'Paint',
    category: 'Paint',
    unit: 'per piece',
    basePrice: 250,
    quantities: 500,
    description: 'Premium Exterior & Interior Paint (20L can)'
  },
  {
    name: 'Tiles',
    category: 'Tiles',
    unit: 'per sqft',
    basePrice: 120,
    quantities: 10000,
    description: 'Ceramic & Vitrified Tiles - Various designs'
  },
  {
    name: 'Pipes',
    category: 'Pipes',
    unit: 'per piece',
    basePrice: 450,
    quantities: 500,
    description: 'PVC & Iron Pipes - 50mm, 75mm, 100mm'
  },
  {
    name: 'Electrical Wires',
    category: 'Electrical',
    unit: 'per piece',
    basePrice: 180,
    quantities: 2000,
    description: 'Copper Electrical Wires - 1sq mm, 1.5sq mm, 2.5sq mm'
  },
  {
    name: 'Wood/Timber',
    category: 'Wood/Timber',
    unit: 'per cubic foot',
    basePrice: 800,
    quantities: 200,
    description: 'Quality Teak & Sal Wood - Seasoned & Treated'
  }
];

const SHOP_ADDRESSES = {
  Mumbai: [
    'Bandra Industrial Area, Bandra',
    'Andheri East, Near Metro Station',
    'Dadar West, Central Mumbai',
    'Thane East, Off Eastern Express Highway',
    'Navi Mumbai, Vashi'
  ],
  Delhi: [
    'Okhla Industrial Area, Phase-1',
    'Shahdara, Near Delhi Border',
    'Dwarka Industrial Area, Dwarka',
    'Noida City Center, Noida',
    'Ghaziabad Mandi, Ghaziabad'
  ],
  Lucknow: [
    'Gomti Nagar, Block A',
    'Lucknow City Center, Krishna Nagar',
    'Alambagh, Main Road',
    'Charbagh, Near Railway Station',
    'Nigam Bodh Ghat, Vidhan Bhawan Area'
  ],
  Jaipur: [
    'Mahesh Nagar, C-Block',
    'Jaipur City Center, Ram Nagar',
    'Sodala, Industrial Area',
    'Shyam Nagar, Near Ajmer Road',
    'Ajmer Road, Bypass Area'
  ],
  Indore: [
    'Indore City Center, Vijay Nagar',
    'Vijay Nagar, Gandhi Marg',
    'Prabhat Square, Main Indore',
    'Bada Bazaar, Old Indore',
    'Racecourse Road, Near MR-10'
  ]
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/buildmart');
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    await User.deleteMany({ role: 'seller' });
    await Material.deleteMany({});
    console.log('🗑️  Cleared existing sellers and materials\n');

    let createdMaterialsCount = 0;
    let createdSellersCount = 0;

    // Create sellers for each city
    for (const city of CITIES) {
      console.log(`\n📍 ${city.toUpperCase()}`);
      console.log('═'.repeat(50));
      
      const sellers = SELLERS_BY_CITY[city];
      
      for (let i = 0; i < sellers.length; i++) {
        const sellerInfo = sellers[i];
        // Generate email from first word of seller name: e.g., "Ajmer Road Materials" -> "ajmer@test.com"
        const firstWord = sellerInfo.name.split(' ')[0].toLowerCase();
        const uniqueEmail = firstWord + '@test.com';
        const uniquePhone = `${9876543200 + (CITIES.indexOf(city) * 1000) + (i * 100)}`;

        // Hash the password
        const hashedPassword = await bcrypt.hash('hello', 10);

        // Create seller user
        const seller = await User.create({
          name: sellerInfo.name,
          email: uniqueEmail,
          phone: uniquePhone,
          password: hashedPassword,
          role: 'seller',
          location: city
        });

        createdSellersCount++;
        console.log(`\n  🏪 Seller ${i + 1}: ${seller.name}`);
        console.log(`     📧 ${uniqueEmail}`);
        console.log(`     📱 ${uniquePhone}`);

        // Add materials for this seller
        const shopAddress = SHOP_ADDRESSES[city][i % SHOP_ADDRESSES[city].length];
        console.log(`     📍 ${shopAddress}`);
        console.log(`     💰 Price Factor: ${(sellerInfo.priceMultiplier * 100).toFixed(0)}%`);
        console.log(`     📦 Materials:`);

        for (const material of MATERIALS_CATALOG) {
          // Apply price multiplier with slight variation
          const adjustedPrice = Math.round(material.basePrice * sellerInfo.priceMultiplier);

          const newMaterial = await Material.create({
            name: material.name,
            category: material.category,
            unit: material.unit,
            price: adjustedPrice,
            quantity: material.quantities,
            description: material.description,
            location: {
              city: city,
              state: 'State',
              pincode: '000000',
              address: shopAddress
            },
            shopName: seller.name,
            isAvailable: true,
            seller: seller._id
          });

          createdMaterialsCount++;
          console.log(`        ✓ ${material.name}: ₹${adjustedPrice} ${material.unit}`);
        }
      }
    }

    console.log(`\n\n${'═'.repeat(50)}`);
    console.log(`✅ DATABASE SEEDING COMPLETED!`);
    console.log(`${'═'.repeat(50)}`);
    console.log(`\n📊 STATISTICS:`);
    console.log(`   • Total Sellers Created: ${createdSellersCount}`);
    console.log(`   • Total Material Listings: ${createdMaterialsCount}`);
    console.log(`   • Cities Covered: ${CITIES.join(', ')}`);
    console.log(`   • Items per Seller: ${MATERIALS_CATALOG.length}`);
    console.log(`\n💡 FEATURES:`);
    console.log(`   ✓ Unique seller names per city`);
    console.log(`   ✓ Price variations (92%-105%) for comparison`);
    console.log(`   ✓ Specific shop addresses per location`);
    console.log(`   ✓ Realistic contact information`);
    console.log(`\n🚀 Ready to browse your marketplace!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
