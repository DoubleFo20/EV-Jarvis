import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env';
import { morganMiddleware } from './middlewares/morgan';
import { errorHandler } from './middlewares/errorHandler';
import { apiRateLimiter } from './middlewares/rate-limit';
import { requestIdMiddleware } from './middlewares/request-id';

// Routes
import healthRoutes from './routes/health.route';

const app: Application = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

// Performance Middlewares
app.use(compression());

// Body Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use(requestIdMiddleware);
app.use(morganMiddleware);
app.use(apiRateLimiter);

// API Routes
app.use('/', healthRoutes);
app.use('/api/v1', healthRoutes);

// Fallback Route for 404
app.use((req, res) => {
  res.status(404).json({
    type: 'about:blank',
    title: 'Not Found',
    status: 404,
    code: 'ROUTE_NOT_FOUND',
    detail: 'The requested resource was not found on this server.',
    instance: req.originalUrl,
    requestId: req.requestId,
  });
});

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

export default app;
