import 'reflect-metadata';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import fs from 'fs';
import { Server } from 'http';
import cors from 'cors';
import { initDB } from './db';
import apiRoutes from './routes';

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

// Static file serving and client routing handling
const isDevelopment = process.env.NODE_ENV !== 'production';
const clientDistPath = path.join(__dirname, '..', 'public');

if (isDevelopment) {
  // Development mode: proxy non-API requests to the dev server
  app.use('/', (req, res, next) => {
    if (req.url.startsWith('/api')) {
      return next();
    }
    
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      logLevel: 'warn',
    })(req, res, next);
  });
} else {
  // Production mode: serve static files and handle client-side routing
  app.use(express.static(clientDistPath));
  
  // For any other request, send back the index.html file for client-side routing
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

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