import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env';
import { morganMiddleware } from './middlewares/morgan';
import { errorHandler } from './middlewares/errorHandler';

// Routes
import healthRoutes from './routes/health.route';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// Performance Middlewares
app.use(compression());

// Body Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use(morganMiddleware);

// API Routes
app.use('/api', healthRoutes); // Prefix with /api if needed, or mount health check directly
app.use('/health', healthRoutes);

// Fallback Route for 404
app.use((req, res) => {
  res.status(404).json({
    type: 'about:blank',
    title: 'Not Found',
    status: 404,
    detail: 'The requested resource was not found on this server.',
    instance: req.originalUrl,
  });
});

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

export default app;
