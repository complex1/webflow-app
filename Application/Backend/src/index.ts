import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { swaggerSpec } from './config/swagger';

// Import routes
import authRoutes from './routes/auth';
import envFileRoutes from './routes/envFiles';
import webFlowRoutes from './routes/webFlows';
import fileRoutes from './routes/files';
import proxyRoutes from './routes/proxy';

// Import database
import sequelize from './config/database';

// Import models to ensure they are initialized
import './models/User';
import './models/EnvFile';
import './models/EnvConfig';
import './models/WebFlow';
import './models/WebFlowConfig';
import './models/File';
import './models/WebFlowEnvFile';

// Import associations to set up model relationships
import './models/associations';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Development-specific: Disable all caching and ETags
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Development mode: Disabling all caching and ETags');

  // Disable ETags completely
  app.set('etag', false);
}

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));

// Enhanced CORS configuration
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: '*',
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

app.use(morgan('combined'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Flux Documentation',
}));

// Debug endpoint to test database connection (must be before routes)
app.get('/api/debug/db', async (req, res) => {
  try {
    const User = require('./models/User').default;
    const userCount = await User.count();
    res.json({
      message: 'Database connection working',
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Database error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Debug endpoint to test User model
app.get('/api/debug/user', async (req, res) => {
  try {
    const User = require('./models/User').default;
    const bcrypt = require('bcryptjs');

    // Test bcrypt
    const testPassword = 'test123';
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    const isValid = await bcrypt.compare(testPassword, hashedPassword);

    res.json({
      message: 'User model and bcrypt working',
      bcryptTest: { hashed: !!hashedPassword, isValid },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'User model error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/env-files', envFileRoutes);
app.use('/api/web-flows', webFlowRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/proxy', proxyRoutes);

const isDevelopment = process.env.NODE_ENV !== 'production';
const clientDistPath = path.join(__dirname, '..', 'public');

if (isDevelopment) {
  // Development mode: proxy non-API requests to the dev server
  app.use('/', (req, res, next) => {
    if (req.url.startsWith('/api')) {
      return next();
    }

    createProxyMiddleware({
      target: 'http://localhost:5173',
      changeOrigin: true,
    })(req, res, next);
  });
} else {
  // Production mode: serve static files and handle client-side routing
  app.use(express.static(clientDistPath));

  // For any other request that's not an API route, send back the index.html file
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      return next();
    }

    // Only handle GET requests for HTML pages
    if (req.method === 'GET' && !req.url.includes('.')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    } else {
      next();
    }
  });
}

// Development: Remove ETags from all responses (must be after routes)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    // Override the end method to remove ETags before sending
    const originalEnd = res.end;
    res.end = function (chunk?: any, encoding?: any, cb?: any) {
      // Remove ETag and set no-cache headers
      this.removeHeader('ETag');
      this.removeHeader('Last-Modified');
      this.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      console.log(`🚫 Cache disabled for: ${req.method} ${req.path}`);
      return originalEnd.call(this, chunk, encoding, cb);
    };

    next();
  });
}

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     description: Check if the API server is running and healthy
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-10-02T16:30:00.000Z
 *                 environment:
 *                   type: string
 *                   example: development
 */
app.get('/api/health', (req, res) => {
  // Force remove ETag and set no-cache headers
  res.removeHeader('ETag');
  res.removeHeader('Last-Modified');

  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint to verify no caching
app.get('/api/test-no-cache', (req, res) => {
  res.removeHeader('ETag');
  res.removeHeader('Last-Modified');

  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  res.json({
    message: 'No cache test',
    timestamp: new Date().toISOString(),
    random: Math.random()
  });
});


// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync database (create tables if they don't exist)
    // For development, we'll use force: false to preserve data, alter: false to avoid SQLite issues
    // If you need to reset the database, change force to true temporarily
    const syncOptions = process.env.NODE_ENV === 'development'
      ? { force: false, alter: false }
      : { force: false, alter: false };

    await sequelize.sync(syncOptions);
    console.log('Database synchronized successfully.');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await sequelize.close();
  process.exit(0);
});

startServer();
