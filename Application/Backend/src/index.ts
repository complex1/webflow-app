import './types/express-augment';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { swaggerSpec } from './config/swagger';
import { logDebug } from './utils/logger';
import { assertJwtSecretConfigured } from './utils/validateEnv';
import { startWebflowSchedulerLoop, stopWebflowSchedulerLoop } from './services/webflowSchedulerLoop';

// Import routes
import authRoutes from './routes/auth';
import envFileRoutes from './routes/envFiles';
import webFlowRoutes from './routes/webFlows';
import publicWebFlowRoutes from './routes/publicWebFlows';
import fileRoutes from './routes/files';
import proxyRoutes from './routes/proxy';
import proxyPlaygroundRoutes from './routes/proxyPlayground';
import scheduleRoutes from './routes/schedules';

// Import database
import sequelize, {
  ensureWebFlowExecutionVariablePoolColumn,
  ensureWebFlowExecutionScheduleIdColumn,
  ensureWebFlowPublicShareColumns,
} from './config/database';

// Import models to ensure they are initialized
import './models/User';
import './models/EnvFile';
import './models/EnvConfig';
import './models/WebFlow';
import './models/WebFlowConfig';
import './models/WebFlowExecution';
import './models/WebFlowSchedule';
import './models/File';
import './models/WebFlowEnvFile';

// Import associations to set up model relationships
import './models/associations';

// Load environment variables
dotenv.config();
assertJwtSecretConfigured();

const isDevelopment = process.env.NODE_ENV !== 'production';
const clientDistPath = path.join(__dirname, '..', 'public');
const PORT = Number.parseInt(process.env.PORT || '3000', 10) || 3000;

logDebug(`Starting server in ${isDevelopment ? 'development' : 'production'} mode`);
const app = express();

app.use(
  helmet({
    contentSecurityPolicy: isDevelopment ? false : undefined,
  })
);
app.use(morgan(isDevelopment ? 'dev' : 'combined'));
// Development-specific: Disable all caching and ETags
if (isDevelopment) {
  logDebug('🔧 Development mode: Disabling all caching and ETags');
  // Disable ETags completely
  app.set('etag', false);
}

const corsOrigin = (() => {
  const raw = process.env.CORS_ORIGIN?.trim();
  if (raw) {
    const list = raw.split(',').map((s) => s.trim()).filter(Boolean);
    return list.length === 1 ? list[0] : list;
  }
  return isDevelopment ? '*' : false;
})();

app.use(
  cors({
    origin: corsOrigin,
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: '*',
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

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
app.use('/api/public/web-flows', publicWebFlowRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/web-flows', webFlowRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/proxy/playground', proxyPlaygroundRoutes);
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
    logDebug('Database connection established successfully.');

    // Sync database (create tables if they don't exist)
    // For development, we'll use force: false to preserve data, alter: false to avoid SQLite issues
    // If you need to reset the database, change force to true temporarily
    const syncOptions = !isDevelopment
      ? { force: false, alter: false }
      : { force: false, alter: false };

    await sequelize.sync(syncOptions);
    await ensureWebFlowExecutionVariablePoolColumn();
    await ensureWebFlowPublicShareColumns();
    await ensureWebFlowExecutionScheduleIdColumn();
    logDebug('Database synchronized successfully.');

    startWebflowSchedulerLoop();
    logDebug('Webflow scheduler started (60s tick).');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      logDebug(`📊 Health check: http://localhost:${PORT}/api/health`);
      logDebug(`🔗 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  stopWebflowSchedulerLoop();
  await sequelize.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  stopWebflowSchedulerLoop();
  await sequelize.close();
  process.exit(0);
});
startServer();
