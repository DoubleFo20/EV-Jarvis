"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const env_1 = require("./config/env");
const morgan_1 = require("./middlewares/morgan");
const errorHandler_1 = require("./middlewares/errorHandler");
// Routes
const health_route_1 = __importDefault(require("./routes/health.route"));
const app = (0, express_1.default)();
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN, credentials: true }));
// Performance Middlewares
app.use((0, compression_1.default)());
// Body Parsing Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Logging Middleware
app.use(morgan_1.morganMiddleware);
// API Routes
app.use('/api', health_route_1.default); // Prefix with /api if needed, or mount health check directly
app.use('/health', health_route_1.default);
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
app.use(errorHandler_1.errorHandler);
exports.default = app;
