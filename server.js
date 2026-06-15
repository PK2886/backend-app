const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const Product = require('./models/Product');
const Counter = require('./models/Counter');

// Database connection will be initialized in startServer()

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API Routes
app.use('/api/products', productRoutes);

// Seed Database Function
const seedDatabase = async () => {
  if (global.isMockMode) {
    console.log('Mock database mode active. Skipping MongoDB seeding.');
    return;
  }
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Seeding initial sample products...');

      // Clear counter to restart sequencing
      await Counter.deleteMany({});

      const sampleProducts = [
        // Electrical Category
        {
          productName: 'Finolex 1.5 Sqmm Copper Wire (90m)',
          category: 'Wires & Cables',
          parentCategory: 'Electrical',
          size: '1.5 sqmm',
          brand: 'Finolex',
          unitPrice: 1200,
          sellingPrice: 1500,
          quantity: 25,
          reorderLevel: 10,
          supplierName: 'Finolex Distributors Ltd',
          supplierContact: 'sales@finolexdist.com'
        },
        {
          productName: 'Anchor Roma 1 Way Switch 6A',
          category: 'Switches',
          parentCategory: 'Electrical',
          size: 'Standard',
          brand: 'Anchor',
          unitPrice: 25,
          sellingPrice: 35,
          quantity: 120,
          reorderLevel: 50,
          supplierName: 'Anchor Electrical Junction',
          supplierContact: '+919876543210'
        },
        {
          productName: 'Havells 16A Single Pole MCB',
          category: 'MCB',
          parentCategory: 'Electrical',
          size: '16A SP',
          brand: 'Havells',
          unitPrice: 150,
          sellingPrice: 210,
          quantity: 8,
          reorderLevel: 15, // Critical (8 <= 15)
          supplierName: 'Havells India Logistics',
          supplierContact: 'order@havellslogistics.com'
        },
        {
          productName: 'Syska 9W LED Bulb B22',
          category: 'LED Lights',
          parentCategory: 'Electrical',
          size: '9W B22',
          brand: 'Syska',
          unitPrice: 70,
          sellingPrice: 99,
          quantity: 15,
          reorderLevel: 10, // Low Stock (15 <= 20)
          supplierName: 'Syska Light Agencies',
          supplierContact: 'support@syskalights.com'
        },
        {
          productName: 'Orient Electric Apex-FX 1200mm Ceiling Fan',
          category: 'Fans',
          parentCategory: 'Electrical',
          size: '1200mm',
          brand: 'Orient',
          unitPrice: 1400,
          sellingPrice: 1850,
          quantity: 12,
          reorderLevel: 5, // Safe (12 > 10)
          supplierName: 'Orient Fans Distributor',
          supplierContact: '+919988776655'
        },
        {
          productName: 'Luminous RC 18000 150 Ah Battery',
          category: 'Battery',
          parentCategory: 'Electrical',
          size: '150 Ah',
          brand: 'Luminous',
          unitPrice: 9500,
          sellingPrice: 12500,
          quantity: 3,
          reorderLevel: 2, // Low Stock (3 <= 4)
          supplierName: 'Luminous Power Hub',
          supplierContact: 'power@luminoushub.com'
        },
        // Hardware Category
        {
          productName: 'Supreme PVC Pipe 4 Inch',
          category: 'Pipes',
          parentCategory: 'Hardware',
          size: '4 inch x 10ft',
          brand: 'Supreme',
          unitPrice: 350,
          sellingPrice: 480,
          quantity: 40,
          reorderLevel: 20, // Safe
          supplierName: 'Supreme Pipe Depot',
          supplierContact: 'pipes@supreme.com'
        },
        {
          productName: 'Asian Paints Apcolite Premium Emulsion White',
          category: 'Paints',
          parentCategory: 'Hardware',
          size: '4 Litres',
          brand: 'Asian Paints',
          unitPrice: 850,
          sellingPrice: 1100,
          quantity: 5,
          reorderLevel: 5, // Critical (5 <= 5)
          supplierName: 'Asian Paints Dealers',
          supplierContact: '+918887776665'
        },
        {
          productName: 'Taparia Combination Pliers 8 Inch',
          category: 'Tools',
          parentCategory: 'Hardware',
          size: '8 inch',
          brand: 'Taparia',
          unitPrice: 180,
          sellingPrice: 250,
          quantity: 18,
          reorderLevel: 5, // Safe
          supplierName: 'Taparia Tools Ltd',
          supplierContact: 'sales@tapariatools.co.in'
        },
        {
          productName: 'M8 Steel Hex Bolt & Nut Set',
          category: 'Nuts & Bolts',
          parentCategory: 'Hardware',
          size: 'M8 x 50mm',
          brand: 'Unbrako',
          unitPrice: 8,
          sellingPrice: 12,
          quantity: 500,
          reorderLevel: 100, // Safe
          supplierName: 'Unbrako Fasteners Corp',
          supplierContact: 'info@unbrakocorp.com'
        },
        {
          productName: 'Fevicol SH Synthetic Resin Adhesive',
          category: 'Adhesives',
          parentCategory: 'Hardware',
          size: '1 kg',
          brand: 'Pidilite',
          unitPrice: 210,
          sellingPrice: 270,
          quantity: 14,
          reorderLevel: 8, // Low Stock (14 <= 16)
          supplierName: 'Pidilite Industrial Agents',
          supplierContact: 'fevicol@pidilite.com'
        },
        {
          productName: 'Godrej Round Padlock 7 Levers',
          category: 'Locks',
          parentCategory: 'Hardware',
          size: '50mm',
          brand: 'Godrej',
          unitPrice: 280,
          sellingPrice: 380,
          quantity: 22,
          reorderLevel: 5, // Safe
          supplierName: 'Godrej Locks Center',
          supplierContact: '+917776665554'
        }
      ];

      // Save each to run the pre-save hook that increments the serial ID
      await Product.create(sampleProducts);
      console.log('Sample products successfully seeded!');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

let server;

// Start Server Function
const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Seed database on startup
  await seedDatabase();

  server = app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n------------------------------------------------------------`);
      console.error(`ERROR: Port ${PORT} is already in use by another process.`);
      console.error(`Please close that process or change the PORT in your .env file.`);
      console.error(`------------------------------------------------------------\n`);
      process.exit(1);
    } else {
      console.error(`Server error: ${err.message}`);
      process.exit(1);
    }
  });
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process if started
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});
