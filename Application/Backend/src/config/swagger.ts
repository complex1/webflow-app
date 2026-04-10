import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Flux Backend',
    version: '1.0.0',
    description: 'A comprehensive API management system for environment files, web flows, and file uploads',
    contact: {
      name: 'API Flux Team',
      email: 'support@apiflux.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
    {
      url: 'https://api.apiflux.com/api',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'User ID',
            example: 1,
          },
          username: {
            type: 'string',
            description: 'Username',
            example: 'john_doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john@example.com',
          },
          avatar: {
            type: 'string',
            format: 'uri',
            description: 'User avatar URL',
            example: 'https://example.com/avatar.jpg',
          },
          userType: {
            type: 'string',
            enum: ['individual', 'organization', 'enterprise'],
            description: 'User type',
            example: 'individual',
          },
          userRole: {
            type: 'string',
            enum: ['admin', 'user', 'moderator'],
            description: 'User role',
            example: 'user',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'User creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'User last update timestamp',
          },
        },
      },
      EnvFile: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Environment file ID',
            example: 1,
          },
          name: {
            type: 'string',
            description: 'Environment file name',
            example: 'Production Environment',
          },
          description: {
            type: 'string',
            description: 'Environment file description',
            example: 'Production environment configuration',
          },
          userId: {
            type: 'integer',
            description: 'Owner user ID',
            example: 1,
          },
          configs: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/EnvConfig',
            },
            description: 'Environment configurations',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
        },
      },
      EnvConfig: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Configuration ID',
            example: 1,
          },
          key: {
            type: 'string',
            description: 'Configuration key',
            example: 'API_URL',
          },
          description: {
            type: 'string',
            description: 'Configuration description',
            example: 'Base API URL for the service',
          },
          value: {
            type: 'string',
            description: 'Configuration value',
            example: 'https://api.example.com',
          },
          envFileId: {
            type: 'integer',
            description: 'Parent environment file ID',
            example: 1,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
        },
      },
      WebFlow: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Web flow ID',
            example: 1,
          },
          name: {
            type: 'string',
            description: 'Web flow name',
            example: 'E-commerce API',
          },
          description: {
            type: 'string',
            description: 'Web flow description',
            example: 'Complete e-commerce API flow',
          },
          icon: {
            type: 'string',
            description: 'FontAwesome icon class',
            example: 'fas fa-shopping-cart',
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Web flow tags',
            example: ['ecommerce', 'api', 'rest'],
          },
          isFolder: {
            type: 'boolean',
            description: 'Whether this is a folder',
            example: false,
          },
          hasOpenApiConfig: {
            type: 'boolean',
            description: 'Whether OpenAPI config is enabled',
            example: true,
          },
          openApiConfigType: {
            type: 'string',
            enum: ['SERVER', 'FILE'],
            description: 'OpenAPI configuration type',
            example: 'SERVER',
          },
          openApiServerUrl: {
            type: 'string',
            description: 'OpenAPI server URL',
            example: 'https://api.example.com',
          },
          openApiFileId: {
            type: 'integer',
            description: 'OpenAPI file ID',
            example: 1,
          },
          hasPostmanCollection: {
            type: 'boolean',
            description: 'Whether Postman collection is enabled',
            example: true,
          },
          postmanFileId: {
            type: 'integer',
            description: 'Postman file ID',
            example: 1,
          },
          basePath: {
            type: 'string',
            description: 'Base path for the API',
            example: '/api/v1',
          },
          userId: {
            type: 'integer',
            description: 'Owner user ID',
            example: 1,
          },
          envFiles: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/EnvFile',
            },
            description: 'Linked environment files',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
        },
      },
      File: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'File ID',
            example: 1,
          },
          name: {
            type: 'string',
            description: 'File name',
            example: 'api-spec.json',
          },
          originalName: {
            type: 'string',
            description: 'Original file name',
            example: 'api-specification.json',
          },
          extension: {
            type: 'string',
            description: 'File extension',
            example: '.json',
          },
          size: {
            type: 'integer',
            description: 'File size in bytes',
            example: 1024,
          },
          url: {
            type: 'string',
            description: 'File URL',
            example: '/uploads/api-spec.json',
          },
          fileName: {
            type: 'string',
            description: 'Stored file name',
            example: 'uuid-filename.json',
          },
          mimetype: {
            type: 'string',
            description: 'File MIME type',
            example: 'application/json',
          },
          webFlowId: {
            type: 'integer',
            description: 'Associated web flow ID',
            example: 1,
          },
          userId: {
            type: 'integer',
            description: 'Owner user ID',
            example: 1,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error message',
            example: 'Internal server error',
          },
          message: {
            type: 'string',
            description: 'Detailed error message (development only)',
            example: 'Database connection failed',
          },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          errors: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'List of validation errors',
            example: ['Username must be at least 3 characters long', 'Valid email is required'],
          },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            description: 'Current page number',
            example: 1,
          },
          limit: {
            type: 'integer',
            description: 'Items per page',
            example: 10,
          },
          total: {
            type: 'integer',
            description: 'Total number of items',
            example: 100,
          },
          pages: {
            type: 'integer',
            description: 'Total number of pages',
            example: 10,
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and authorization',
    },
    {
      name: 'Environment Files',
      description: 'Environment file management',
    },
    {
      name: 'Web Flows',
      description: 'Web flow and API collection management',
    },
    {
      name: 'Files',
      description: 'File upload and management',
    },
    {
      name: 'Health',
      description: 'System health and status',
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API files
};

export const swaggerSpec = swaggerJsdoc(options);
