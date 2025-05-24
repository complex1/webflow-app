# Server-Side Proxy API Documentation

The Server-Side Proxy API allows the client application to make HTTP requests through the server, which helps in:

1. **Avoiding CORS issues**: The server acts as a middleware for external API calls
2. **Protecting sensitive data**: API keys and secrets can be kept on the server
3. **Adding security layers**: Request validation and domain whitelisting

## API Endpoint

```
POST /api/proxy
```

This endpoint requires authentication with a valid JWT token in the Authorization header.

## Request Format

```typescript
interface ProxyRequestBody {
  url: string;             // The URL path or full URL to request
  baseUrl?: string;        // Optional base URL to prepend to url
  method: string;          // HTTP method (GET, POST, PUT, DELETE, etc.)
  headers?: {              // Optional request headers
    [key: string]: string;
  };
  body?: any;              // Optional request body (for POST, PUT, etc.)
  params?: {               // Optional URL query parameters
    [key: string]: string;
  };
  timeout?: number;        // Optional request timeout in milliseconds
}
```

## Response Format

```typescript
interface ProxyResponse {
  data: any;               // The response data from the target API
  status: number;          // HTTP status code
  statusText: string;      // Status message
  headers: {               // Response headers
    [key: string]: string;
  };
}
```

## Error Response Format

```typescript
interface ErrorResponse {
  error: string;           // Error type
  status?: number;         // HTTP status code (if available)
  statusText?: string;     // Status message (if available)
  message?: string;        // Detailed error message
  data?: any;              // Any data returned in the error response
}
```

## Security Features

### Authentication

All proxy requests require a valid JWT token to prevent unauthorized use.

### Domain Whitelisting

Only requests to pre-approved domains are allowed. The current whitelist includes:

- jsonplaceholder.typicode.com
- api.github.com
- api.openai.com
- api.example.com
- (Additional domains can be added as needed)

### Header Filtering

Certain sensitive headers are not allowed to be overridden by clients.

## Client Usage

A proxy service is available in the client application to simplify making requests:

```typescript
// Import the proxy service
import { proxyService } from '@/services/proxy.service';

// Example GET request
const getData = async () => {
  const result = await proxyService.get('https://api.example.com/data');
  console.log(result.data);
};

// Example POST request
const createItem = async () => {
  const data = { name: 'New Item', value: 42 };
  const result = await proxyService.post(
    'https://api.example.com/items',
    data
  );
  console.log(result.data);
};
```

## Testing

A test page is available at `/proxy-test` to try out the proxy API and see the results of different requests.

## Limitations

1. File uploads are not currently supported
2. Streaming responses are not supported
3. WebSocket connections cannot be proxied
4. Maximum request/response size is limited to 10MB

## Error Handling

Error responses from the target API are preserved and passed back to the client with the same status code.
Connection errors, timeouts, and other issues will return appropriate error statuses (504, 502, etc.).

## Logging

All proxy requests are logged on the server with:
- Request method
- Target URL
- Status code
- Response time
- User ID (from the JWT token)

These logs can be used for monitoring and debugging.

## Future Enhancements

- Rate limiting per user
- Request/response caching
- Support for more authentication methods
- Custom middleware hooks for request/response processing
