const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      try {
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`[MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
      } catch (externalErr) {
        console.warn(`[MongoDB] Could not connect to configured MONGO_URI (${externalErr.message}).`);
        if (process.env.NODE_ENV === 'production') {
          throw externalErr;
        }
      }
    }

    // Development Fallback: In-memory MongoDB Server
    console.log('[MongoDB] Starting in-memory MongoDB fallback server...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected to in-memory MongoDB: ${uri}`);

    // Auto-seed if database is empty
    setTimeout(async () => {
      try {
        const User = require('../models/User');
        const count = await User.countDocuments();
        if (count === 0) {
          console.log('[MongoDB] Empty database detected. Auto-seeding initial resources and accounts...');
          const seedDatabase = require('../seed');
          await seedDatabase(false);
          console.log('[MongoDB] Auto-seeding completed successfully.');
        }
      } catch (e) {
        console.error('[MongoDB] Auto-seed error:', e.message);
      }
    }, 500);

    return conn;
  } catch (err) {
    console.error(`[MongoDB] Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
