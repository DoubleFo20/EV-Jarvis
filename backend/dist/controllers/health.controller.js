"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHealth = void 0;
const env_1 = require("../config/env");
const checkHealth = (req, res) => {
    res.status(200).json({
        status: 'ok',
        version: '1.0.0',
        environment: env_1.env.NODE_ENV,
    });
};
exports.checkHealth = checkHealth;
