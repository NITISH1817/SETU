import { connectDB, closeDB } from '../config/db';
import { seedDefaultData } from './seedData';

const run = async () => {
  try {
    await connectDB();
    await seedDefaultData();
    console.log('🎉 Seeding finished.');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await closeDB();
    process.exit(0);
  }
};

run();
