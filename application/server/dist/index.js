"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
exports.startServer = startServer;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const routes_1 = __importDefault(require("./routes"));
// Increase max listeners to avoid the warning
require('events').EventEmitter.defaultMaxListeners = 15;
// Create data directory if it doesn't exist
const DATA_DIR = path_1.default.join(process.cwd(), 'data');
if (!fs_1.default.existsSync(DATA_DIR)) {
    fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
}
const app = (0, express_1.default)();
exports.app = app;
const PORT = process.env.PORT || 3000;
let server;
// Initialize the database
(0, db_1.initDB)().then(() => {
    console.log('Database initialized successfully');
}).catch(err => {
    console.error('Failed to initialize database:', err);
});
// CORS configuration
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API routes
app.use('/api', routes_1.default);
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});
// Debug middleware - log all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Static file serving and client routing handling
const isDevelopment = process.env.NODE_ENV !== 'production';
const clientDistPath = path_1.default.join(__dirname, '..', 'public');
if (isDevelopment) {
    // Development mode: proxy non-API requests to the dev server
    app.use('/', (req, res, next) => {
        if (req.url.startsWith('/api')) {
            return next();
        }
        (0, http_proxy_middleware_1.createProxyMiddleware)({
            target: 'http://localhost:3001',
            changeOrigin: true,
            logLevel: 'warn',
        })(req, res, next);
    });
}
else {
    // Production mode: serve static files and handle client-side routing
    app.use(express_1.default.static(clientDistPath));
    // For any other request, send back the index.html file for client-side routing
    app.get('*', (req, res, next) => {
        if (req.url.startsWith('/api')) {
            return next();
        }
        res.sendFile(path_1.default.join(clientDistPath, 'index.html'));
    });
}
// Proper server shutdown handling
function shutdown() {
    if (server) {
        server.close(() => {
            console.log('Server shut down gracefully');
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
}
// Start server
function startServer() {
    // If server is already running, close it first
    if (server) {
        server.close();
    }
    exports.server = server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    // Handle process termination events
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}
startServer();
