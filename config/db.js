const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    // Configure Node DNS to use Google/Cloudflare public DNS to bypass local DNS resolution limitations
    // (e.g. ECONNREFUSED on _mongodb._tcp SRV lookups)
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
      console.log('DNS resolver configured to use public DNS servers (8.8.8.8, 8.8.4.4, 1.1.1.1)');
    } catch (dnsError) {
      console.warn('Unable to override DNS servers, using system default:', dnsError.message);
    }

    // Attempt connecting to MongoDB Atlas with a short timeout to handle fallback gracefully
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hardware_inventory', {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.isMockMode = false;
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`);
    console.log('------------------------------------------------------------');
    console.log('WARNING: Local or Cloud MongoDB instance not detected/accessible.');
    console.log('Falling back to LOCAL JSON-FILE mock database mode (mock_db.json).');
    console.log('All CRUD operations will write directly to mock_db.json.');
    console.log('------------------------------------------------------------');
    global.isMockMode = true;
  }
};

module.exports = connectDB;

