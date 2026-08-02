"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../config/logger");
// Standard RFC 7807 Error Response
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error('Unhandled Exception:', {
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
    });
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        type: 'about:blank',
        title: err.name || 'Internal Server Error',
        status: statusCode,
        detail: err.message || 'An unexpected error occurred',
        instance: req.originalUrl,
    });
};
exports.errorHandler = errorHandler;
