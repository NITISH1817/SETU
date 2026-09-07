import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import citizenRoutes from './routes/citizenRoutes';
import applicationRoutes from './routes/applicationRoutes';
import interoperabilityRoutes from './routes/interoperabilityRoutes';
import revenueRoutes from './routes/revenueRoutes';
import welfareRoutes from './routes/welfareRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app: Application = express();

// Security & Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger OpenAPI Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/citizen', citizenRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/income', interoperabilityRoutes);
app.use('/api/interoperability', interoperabilityRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/welfare', welfareRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'GovConnect Interoperability Middleware',
    timestamp: new Date().toISOString()
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
