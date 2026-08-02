"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganMiddleware = void 0;
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("../config/logger");
const env_1 = require("../config/env");
// Stream morgan output to winston logger
const stream = {
    write: (message) => logger_1.logger.info(message.trim()),
};
exports.morganMiddleware = (0, morgan_1.default)(env_1.env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream });
