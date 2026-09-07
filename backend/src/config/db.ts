import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/govconnect';
  const forceMemory = process.env.USE_MEMORY_DB === 'true';

  if (forceMemory) {
    try {
      console.log('🔄 Initializing in-memory MongoDB instance for demo mode...');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log('✅ Connected to MongoDB Memory Server successfully!');
      return;
    } catch (err) {
      console.warn('⚠️ Could not start MongoMemoryServer, attempting standard URI connection...');
    }
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`✅ Connected to MongoDB at: ${uri}`);
  } catch (error) {
    console.warn(`⚠️ Standard MongoDB connection failed. Falling back to in-memory database...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log('✅ Fallback: Connected to MongoDB Memory Server successfully!');
    } catch (memError) {
      console.error('❌ Failed to connect to any MongoDB instance:', memError);
      process.exit(1);
    }
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
