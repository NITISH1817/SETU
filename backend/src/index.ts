import app from './app';
import { connectDB } from './config/db';
import { seedDefaultData } from './seed/seedData';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedDefaultData();

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 GovConnect Interoperability Middleware Backend Live`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`📚 OpenAPI Docs: http://localhost:${PORT}/api-docs`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
