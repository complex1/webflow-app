import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
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
const isDevelopment = process.env.NODE_ENV !== 'production'
const clientDistPath = path.join(__dirname, '..', 'public');

console.log(`Starting server in ${isDevelopment ? 'development' : 'production'} mode`);
const app = express();
const PORT = 3000;
// Development-specific: Disable all caching and ETags
if (isDevelopment) {
  console.log('🔧 Development mode: Disabling all caching and ETags');
  // Disable ETags completely
  app.set('etag', false);
}

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/env-files', envFileRoutes);
app.use('/api/web-flows', webFlowRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/proxy', proxyRoutes);

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

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync database (create tables if they don't exist)
    // For development, we'll use force: false to preserve data, alter: false to avoid SQLite issues
    // If you need to reset the database, change force to true temporarily
    const syncOptions = !isDevelopment
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