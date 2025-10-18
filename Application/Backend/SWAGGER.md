# API Documentation with Swagger

This document describes the Swagger/OpenAPI documentation setup for the API Flux backend.

## 📚 **Swagger UI Access**

The interactive API documentation is available at:
- **Local Development**: http://localhost:3000/api-docs
- **Production**: https://api.apiflux.com/api-docs

## 🚀 **Features**

### **Interactive Documentation**
- **Live API Testing**: Test all endpoints directly from the browser
- **Authentication Support**: Built-in JWT token authentication
- **Request/Response Examples**: Comprehensive examples for all endpoints
- **Schema Validation**: Automatic request/response validation

### **Comprehensive Coverage**
- ✅ **Authentication Endpoints** (Register, Login, Profile)
- ✅ **Environment Files** (CRUD operations)
- ✅ **Web Flows** (CRUD operations + linking)
- ✅ **File Management** (Upload, Download, Delete)
- ✅ **Health Check** (System status)

## 🔧 **Technical Implementation**

### **Dependencies**
```json
{
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.0",
  "@types/swagger-jsdoc": "^6.0.4",
  "@types/swagger-ui-express": "^4.1.6"
}
```

### **Configuration Files**
- `src/config/swagger.ts` - Main Swagger configuration
- Route files with JSDoc comments for endpoint documentation

### **Key Features**
- **OpenAPI 3.0** specification
- **JWT Bearer Authentication** support
- **Comprehensive Schemas** for all data models
- **Error Response Documentation** with examples
- **Pagination Support** for list endpoints

## 📖 **API Endpoints Documentation**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### **Environment Files**
- `POST /api/env-files` - Create environment file (protected)
- `GET /api/env-files` - List environment files (protected)
- `GET /api/env-files/{id}` - Get specific environment file (protected)
- `PUT /api/env-files/{id}` - Update environment file (protected)
- `DELETE /api/env-files/{id}` - Delete environment file (protected)

### **Web Flows**
- `POST /api/web-flows` - Create web flow (protected)
- `GET /api/web-flows` - List web flows (protected)
- `GET /api/web-flows/{id}` - Get specific web flow (protected)
- `PUT /api/web-flows/{id}` - Update web flow (protected)
- `DELETE /api/web-flows/{id}` - Delete web flow (protected)
- `POST /api/web-flows/link-env` - Link environment file (protected)
- `DELETE /api/web-flows/unlink-env` - Unlink environment file (protected)

### **File Management**
- `POST /api/files/upload` - Upload file (protected)
- `GET /api/files` - List files (protected)
- `GET /api/files/{id}` - Get file details (protected)
- `GET /api/files/{id}/download` - Download file (protected)
- `DELETE /api/files/{id}` - Delete file (protected)

### **Health Check**
- `GET /api/health` - System health status

## 🔐 **Authentication**

### **JWT Token Authentication**
1. **Register/Login** to get a JWT token
2. **Use the token** in the "Authorize" button in Swagger UI
3. **Format**: `Bearer <your-jwt-token>`

### **Example Usage**
```bash
# Get token from login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Use token in subsequent requests
curl -H "Authorization: Bearer <your-token>" \
  http://localhost:3000/api/env-files
```

## 📊 **Data Models**

### **User Schema**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "createdAt": "2025-10-02T16:30:00.000Z",
  "updatedAt": "2025-10-02T16:30:00.000Z"
}
```

### **Environment File Schema**
```json
{
  "id": 1,
  "name": "Production Environment",
  "description": "Production environment configuration",
  "userId": 1,
  "configs": [
    {
      "id": 1,
      "key": "API_URL",
      "description": "Base API URL",
      "value": "https://api.example.com",
      "envFileId": 1
    }
  ],
  "createdAt": "2025-10-02T16:30:00.000Z",
  "updatedAt": "2025-10-02T16:30:00.000Z"
}
```

### **Web Flow Schema**
```json
{
  "id": 1,
  "name": "E-commerce API",
  "description": "Complete e-commerce API flow",
  "icon": "fas fa-shopping-cart",
  "tags": ["ecommerce", "api", "rest"],
  "isFolder": false,
  "hasOpenApiConfig": true,
  "openApiConfigType": "SERVER",
  "openApiServerUrl": "https://api.example.com",
  "hasPostmanCollection": true,
  "basePath": "/api/v1",
  "userId": 1,
  "envFiles": [],
  "createdAt": "2025-10-02T16:30:00.000Z",
  "updatedAt": "2025-10-02T16:30:00.000Z"
}
```

## 🛠️ **Development**

### **Adding New Endpoints**
1. **Add JSDoc comments** to your route handlers:
```typescript
/**
 * @swagger
 * /your-endpoint:
 *   post:
 *     summary: Your endpoint description
 *     tags: [Your Tag]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: value
 *     responses:
 *       200:
 *         description: Success response
 */
```

2. **Update schemas** in `src/config/swagger.ts` if needed
3. **Test in Swagger UI** at http://localhost:3000/api-docs

### **Customizing Documentation**
- **Modify schemas**: Edit `src/config/swagger.ts`
- **Update server URLs**: Change the `servers` array
- **Add new tags**: Update the `tags` array
- **Customize UI**: Modify the `swaggerUi.setup()` options

## 🎯 **Best Practices**

### **Documentation Standards**
- ✅ **Clear descriptions** for all endpoints
- ✅ **Comprehensive examples** for requests/responses
- ✅ **Error handling** documentation
- ✅ **Authentication requirements** clearly marked
- ✅ **Parameter validation** with min/max values

### **API Design**
- ✅ **RESTful conventions** followed
- ✅ **Consistent response formats**
- ✅ **Proper HTTP status codes**
- ✅ **Pagination support** for list endpoints
- ✅ **Error handling** with meaningful messages

## 🔍 **Testing**

### **Using Swagger UI**
1. **Open** http://localhost:3000/api-docs
2. **Authorize** with a JWT token
3. **Test endpoints** directly in the browser
4. **View responses** and error handling

### **Using curl/Postman**
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test authentication
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'
```

## 📈 **Benefits**

### **For Developers**
- **Interactive Testing**: No need for external tools
- **Comprehensive Documentation**: All endpoints documented
- **Schema Validation**: Automatic request/response validation
- **Authentication Support**: Built-in JWT token handling

### **For API Consumers**
- **Clear Examples**: Copy-paste ready code examples
- **Response Schemas**: Know exactly what to expect
- **Error Handling**: Understand all possible error responses
- **Authentication Guide**: Step-by-step auth instructions

## 🚀 **Production Deployment**

### **Environment Variables**
```env
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

### **Security Considerations**
- **HTTPS Only**: Use HTTPS in production
- **CORS Configuration**: Properly configure CORS origins
- **Rate Limiting**: Consider adding rate limiting
- **API Versioning**: Plan for API versioning strategy

The Swagger documentation provides a complete, interactive reference for the API Flux backend, making it easy for developers to understand, test, and integrate with the API.
