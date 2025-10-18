# API Flux Backend

A Node.js + TypeScript backend for the API Flux application with SQLite database and JWT authentication.

## Features

- **Authentication**: User registration and login with JWT tokens
- **Environment Files**: Create and manage environment configurations
- **Web Flows**: Manage API flows and collections
- **File Upload**: Upload and manage files
- **Database**: SQLite with Sequelize ORM (easily switchable to PostgreSQL)

## Tech Stack

- **Node.js** with **TypeScript**
- **Express.js** for REST API
- **SQLite** database with **Sequelize** ORM
- **JWT** for authentication
- **Multer** for file uploads
- **Bcrypt** for password hashing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp env.example .env
```

3. Update the `.env` file with your configuration:
```env
PORT=3000
NODE_ENV=development
DB_PATH=./database.sqlite
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
CORS_ORIGIN=http://localhost:5173
```

### Running the Application

#### Development
```bash
npm run dev
```

#### Production
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Environment Files
- `POST /api/env-files` - Create environment file (protected)
- `GET /api/env-files` - Get user's environment files (protected)
- `GET /api/env-files/:id` - Get specific environment file (protected)
- `PUT /api/env-files/:id` - Update environment file (protected)
- `DELETE /api/env-files/:id` - Delete environment file (protected)

### Web Flows
- `POST /api/web-flows` - Create web flow (protected)
- `GET /api/web-flows` - Get user's web flows (protected)
- `GET /api/web-flows/:id` - Get specific web flow (protected)
- `PUT /api/web-flows/:id` - Update web flow (protected)
- `DELETE /api/web-flows/:id` - Delete web flow (protected)
- `POST /api/web-flows/link-env` - Link environment file to web flow (protected)
- `DELETE /api/web-flows/unlink-env` - Unlink environment file from web flow (protected)

### Files
- `POST /api/files/upload` - Upload file (protected)
- `GET /api/files` - Get user's files (protected)
- `GET /api/files/:id` - Get specific file (protected)
- `GET /api/files/:id/download` - Download file (protected)
- `DELETE /api/files/:id` - Delete file (protected)

### Health Check
- `GET /api/health` - Server health status

## Database Schema

### Users
- id, username, email, password, createdAt, updatedAt

### Environment Files
- id, name, description, userId, createdAt, updatedAt

### Environment Configs
- id, key, description, value, envFileId, createdAt, updatedAt

### Web Flows
- id, name, description, icon, tags, isFolder, hasOpenApiConfig, openApiConfigType, openApiServerUrl, openApiFileId, hasPostmanCollection, postmanFileId, basePath, userId, createdAt, updatedAt

### Files
- id, name, originalName, extension, size, url, fileName, mimetype, webFlowId, userId, createdAt, updatedAt

### Web Flow Environment Files (Many-to-Many)
- id, webFlowId, envFileId, userId, createdAt, updatedAt

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## File Upload

Files are uploaded to the `./uploads` directory and can be accessed via `/uploads/<filename>` endpoint.

## Database Migration

The application automatically creates and syncs the database schema on startup. For production, consider using proper migrations.

## Error Handling

The API returns consistent error responses:
```json
{
  "error": "Error message",
  "message": "Detailed message (development only)"
}
```

## Development

- Uses TypeScript for type safety
- ESLint for code linting
- Nodemon for hot reloading
- Source maps for debugging

