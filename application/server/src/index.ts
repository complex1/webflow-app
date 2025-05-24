import 'reflect-metadata';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import fs from 'fs';
import { Server } from 'http';
import cors from 'cors';
import { initDB } from './db';
import apiRoutes from './routes';
import landingRoutes from './routes/landing.routes';
import { faviconMiddleware } from './middleware/favicon.middleware';

// Increase max listeners to avoid the warning
require('events').EventEmitter.defaultMaxListeners = 15;

// Create data directory if it doesn't exist
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3000;
let server: Server;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize the database
initDB().then(() => {
  console.log('Database initialized successfully');
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(faviconMiddleware);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', apiRoutes);
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Debug middleware - log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Landing page route - SSR
app.use('/', landingRoutes);

// Proxy middleware for other routes (app routes)
app.use('/app', (req, res, next) => {
  // Only proxy app routes to the client-side app
  createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/app': '/' },
    logLevel: 'warn',
  })(req, res, next);
});

// Proper server shutdown handling
function shutdown() {
  if (server) {
    server.close(() => {
      console.log('Server shut down gracefully');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

// Start server
function startServer() {
  // If server is already running, close it first
  if (server) {
    server.close();
  }

  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  // Handle process termination events
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer();

// For hot-reloading support
export { app, server, startServer };