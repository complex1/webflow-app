# cURL to ApiNode Parser

This utility provides functionality to parse cURL commands and convert them into ApiNode instances that can be used within the API Flux system.

## Features

- ✅ Parse cURL commands with various formats
- ✅ Extract HTTP methods (GET, POST, PUT, DELETE, etc.)
- ✅ Parse URLs with query parameters
- ✅ Extract headers from -H flags
- ✅ Parse request body data from -d flags
- ✅ Support for different URL formats (quoted/unquoted)
- ✅ Convert ApiNode back to cURL command
- ✅ Validate cURL commands before parsing

## Usage

### Basic Parsing

```typescript
import { parseCurlToApiNode } from '@/utils/curlCmd'

const curlCommand = `curl -X POST "https://api.example.com/users" 
  -H "Content-Type: application/json" 
  -H "Authorization: Bearer token123" 
  -d '{"name": "John", "email": "john@example.com"}'`

const result = parseCurlToApiNode(curlCommand)

if (result.success) {
  const apiNode = result.apiNode
  console.log('Method:', apiNode.method) // POST
  console.log('Base URL:', apiNode.baseUrl.defaultValue) // https://api.example.com
  console.log('Path:', apiNode.url.defaultValue) // /users
  console.log('Headers:', apiNode.headers) // Array of Variable objects
  console.log('Body:', apiNode.body.defaultValue) // Parsed JSON object
} else {
  console.error('Parse failed:', result.error)
}
```

### Validation

```typescript
import { validateCurlCommand } from '@/utils/curlCmd'

const validation = validateCurlCommand(curlCommand)
if (!validation.isValid) {
  console.log('Validation errors:', validation.errors)
}
```

### Convert Back to cURL

```typescript
import { apiNodeToCurl } from '@/utils/curlCmd'

const curlCommand = apiNodeToCurl(apiNode, globalStore)
console.log('Generated cURL:', curlCommand)
```

## Supported cURL Formats

### GET Requests
```bash
curl -X GET "https://api.example.com/users?page=1&limit=10"
curl "https://api.example.com/users?page=1&limit=10"  # Method defaults to GET
```

### POST Requests
```bash
curl -X POST "https://api.example.com/users" \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}'
```

### PUT Requests
```bash
curl -X PUT "https://api.example.com/users/123" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated"}'
```

### DELETE Requests
```bash
curl -X DELETE "https://api.example.com/users/123" \
  -H "Authorization: Bearer token123"
```

### Headers
```bash
# Multiple header formats supported
curl -H "Authorization: Bearer token" -H "Content-Type: application/json" ...
curl --header "Authorization: Bearer token" --header "Content-Type: application/json" ...
```

### Data/Body
```bash
# Different data formats
curl -d '{"key": "value"}' ...          # JSON data
curl --data '{"key": "value"}' ...      # Same as -d
curl --data-raw '{"key": "value"}' ...  # Raw data
curl -d "key=value&other=data" ...      # Form data
```

## Return Types

### CurlParseResult
```typescript
interface CurlParseResult {
  success: boolean
  apiNode?: ApiNode      // Available when success is true
  error?: string         // Available when success is false
}
```

### Validation Result
```typescript
interface ValidationResult {
  isValid: boolean
  errors: string[]       // Array of validation error messages
}
```

## ApiNode Structure

The parsed cURL command creates an ApiNode with the following structure:

```typescript
class ApiNode {
  method: string                    // HTTP method (GET, POST, etc.)
  baseUrl: Variable                 // Base URL (protocol + host)
  url: Variable                     // Path part of URL
  queryParams: Variable[]           // Query parameters as Variable objects
  pathParams: Variable[]            // Path parameters (for parameterized URLs)
  headers: Variable[]               // Headers as Variable objects
  body: Variable                    // Request body data
  name: string                      // Auto-generated name for the node
}
```

## Example Implementations

### React/Vue Component Usage
```typescript
<script setup>
import { ref } from 'vue'
import { parseCurlToApiNode } from '@/utils/curlCmd'

const curlInput = ref('')
const apiNode = ref(null)

const handleParse = () => {
  const result = parseCurlToApiNode(curlInput.value)
  if (result.success) {
    apiNode.value = result.apiNode
  }
}
</script>
```

### Integration with API Flux Workflow
```typescript
import { parseCurlToApiNode } from '@/utils/curlCmd'

// Parse cURL and add to workflow
const result = parseCurlToApiNode(curlCommand)
if (result.success) {
  // Add the parsed node to your workflow
  workflow.addNode(result.apiNode)
}
```

## Error Handling

The parser includes comprehensive error handling for:
- Invalid cURL syntax
- Missing URLs
- Malformed headers
- Invalid JSON in body data
- Unsupported cURL flags

All errors are returned in a structured format with descriptive messages.

## Limitations

- Some advanced cURL features are not supported (file uploads, certificates, etc.)
- Complex shell escaping might not be handled perfectly
- Binary data uploads are not supported
- Custom authentication methods beyond headers are not parsed

## Examples Included

The utility includes several example cURL commands:

```typescript
import { curlExamples } from '@/utils/curlCmd'

console.log(curlExamples.get)     // GET example
console.log(curlExamples.post)    // POST example
console.log(curlExamples.put)     // PUT example
console.log(curlExamples.delete)  // DELETE example
```
