"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyController = void 0;
const axios_1 = __importDefault(require("axios"));
exports.proxyController = {
    /**
     * Handle proxy requests by forwarding them to the target API
     */
    handleProxyRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { url, baseUrl, method, headers = {}, body, params, timeout = 30000 // Default 30 seconds timeout
                 } = req.body;
                // Basic validation
                if (!url && !baseUrl) {
                    res.status(400).json({ error: 'Either url or baseUrl is required' });
                    return;
                }
                if (!method) {
                    res.status(400).json({ error: 'Method is required' });
                    return;
                }
                // Prepare request config
                const requestConfig = {
                    method: method,
                    url: baseUrl ? `${baseUrl}${url}` : url,
                    headers: Object.assign({ 
                        // Default headers
                        'Content-Type': 'application/json' }, headers),
                    timeout
                };
                // Add request data for appropriate methods
                if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
                    requestConfig.data = body;
                }
                // Add URL parameters if provided
                if (params) {
                    requestConfig.params = params;
                }
                // Make the request
                const response = yield (0, axios_1.default)(requestConfig);
                // Return the response data, status, and headers
                res.json({
                    data: response.data,
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            }
            catch (err) {
                const error = err; // Type assertion for error handling
                console.error('[PROXY] Error:', (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error');
                // Handle Axios errors
                if (error === null || error === void 0 ? void 0 : error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    res.json({
                        error: error.response.data || 'Unknown error',
                        status: error.response.status,
                        statusText: error.response.statusText,
                        data: error.response.data
                    });
                }
                else if (error === null || error === void 0 ? void 0 : error.request) {
                    // The request was made but no response was received
                    res.json({
                        error: 'No response from target server',
                        message: 'The request was made but no response was received'
                    });
                }
                else {
                    // Something happened in setting up the request that triggered an Error
                    res.json({
                        error: 'Failed to make proxy request',
                        message: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'
                    });
                }
            }
        });
    }
};
