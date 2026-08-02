"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const startServer = () => {
    try {
        const port = env_1.env.PORT;
        app_1.default.listen(port, () => {
            logger_1.logger.info(`=================================`);
            logger_1.logger.info(`🚀 EV-JARVIS Server is running`);
            logger_1.logger.info(`🌍 Environment: ${env_1.env.NODE_ENV}`);
            logger_1.logger.info(`🔌 Port: ${port}`);
            logger_1.logger.info(`=================================`);
        });
    }
    catch (error) {
        logger_1.logger.error('Error starting server:', error);
        process.exit(1);
    }
};
startServer();
// Handle unexpected closures
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Optional: process.exit(1);
});
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught Exception thrown:', error);
    process.exit(1);
});
