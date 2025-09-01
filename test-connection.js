require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testConnection() {
    try {
        console.log('🔄 Testing Water Speed database connection...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ SUCCESS! Connected to MongoDB Atlas');
        console.log('🌊 Database: water-speed');
        console.log('🏎️ Cluster: water-speed-cluster');
        await mongoose.disconnect();
        console.log('✅ Connection test completed successfully');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
}

testConnection();
