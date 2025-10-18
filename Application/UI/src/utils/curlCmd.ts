import { ApiNode } from '@/apifluxCore/nodes/apiNode';
import Variable from '@/apifluxCore/nodes/variable';

export interface CurlParseResult {
  success: boolean;
  apiNode?: ApiNode;
  error?: string;
}

/**
 * Parses a cURL command string and converts it to an ApiNode instance
 * @param curlCommand - The cURL command string to parse
 * @returns CurlParseResult containing the ApiNode or error information
 */
export function parseCurlToApiNode(curlCommand: string): CurlParseResult {
  try {
    // Clean and normalize the curl command
    const cleanCommand = curlCommand.trim().replace(/\\\s*\n\s*/g, ' ');
    
    // Create new ApiNode instance
    const apiNode = new ApiNode();
    
    // Extract URL
    const urlMatch = extractUrl(cleanCommand);
    if (!urlMatch.success) {
      return { success: false, error: urlMatch.error };
    }
    
    // Parse URL into base URL, path, and query parameters
    const urlParts = parseUrl(urlMatch.url!);
    apiNode.baseUrl.defaultValue = urlParts.baseUrl;
    apiNode.url.defaultValue = urlParts.path;
    
    // Add query parameters as variables
    urlParts.queryParams.forEach(param => {
      const variable = new Variable({ 
        name: param.key, 
        type: 'string',
        defaultValue: param.value 
      });
      apiNode.queryParams.push(variable);
    });
    
    // Add path parameters as variables (for parameterized paths)
    urlParts.pathParams.forEach(param => {
      const variable = new Variable({ 
        name: param.key, 
        type: 'string',
        defaultValue: param.value 
      });
      apiNode.pathParams.push(variable);
    });
    
    // Extract HTTP method
    apiNode.method = extractMethod(cleanCommand);
    
    // Extract headers
    const headers = extractHeaders(cleanCommand);
    headers.forEach(header => {
      const variable = new Variable({ 
        name: header.key, 
        type: 'string',
        defaultValue: header.value 
      });
      apiNode.headers.push(variable);
    });
    
    // Extract body data
    const bodyData = extractBody(cleanCommand);
    if (bodyData) {
      apiNode.body.defaultValue = bodyData;
    }
    
    // Set a default name for the node
    apiNode.name = 'Unnamed API Node';
    
    return { success: true, apiNode };
    
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to parse cURL command: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Extracts the URL from a cURL command
 */
function extractUrl(curlCommand: string): { success: boolean; url?: string; error?: string } {
  // Try different URL patterns
  const urlPatterns = [
    /curl\s+(?:-[^\s]+\s+)*['"]([^'"]+)['"]/,  // Quoted URL
    /curl\s+(?:-[^\s]+\s+)*([^\s]+)/,          // Unquoted URL
    /--url\s+['"]([^'"]+)['"]/,                // --url flag with quotes
    /--url\s+([^\s]+)/                         // --url flag without quotes
  ];
  
  for (const pattern of urlPatterns) {
    const match = curlCommand.match(pattern);
    if (match && match[1]) {
      const url = match[1];
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return { success: true, url };
      }
    }
  }
  
  return { success: false, error: 'No valid URL found in cURL command' };
}

/**
 * Parses a URL into its components
 */
function parseUrl(url: string): {
  baseUrl: string;
  path: string;
  queryParams: Array<{ key: string; value: string }>;
  pathParams: Array<{ key: string; value: string }>;
} {
  try {
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
    const path = urlObj.pathname;
    
    // Extract query parameters
    const queryParams: Array<{ key: string; value: string }> = [];
    urlObj.searchParams.forEach((value, key) => {
      queryParams.push({ key, value });
    });
    
    // Extract potential path parameters (placeholder detection)
    const pathParams: Array<{ key: string; value: string }> = [];
    const pathParamMatches = path.match(/\{([^}]+)\}/g);
    if (pathParamMatches) {
      pathParamMatches.forEach(match => {
        const paramName = match.slice(1, -1);
        pathParams.push({ key: paramName, value: '' });
      });
    }
    
    return { baseUrl, path, queryParams, pathParams };
  } catch (error) {
    // Fallback for malformed URLs
    return {
      baseUrl: url,
      path: '',
      queryParams: [],
      pathParams: []
    };
  }
}

/**
 * Extracts the HTTP method from a cURL command
 */
function extractMethod(curlCommand: string): string {
  // Check for explicit method flag
  const methodMatch = curlCommand.match(/-X\s+([A-Z]+)|--request\s+([A-Z]+)/i);
  if (methodMatch) {
    const method = methodMatch[1] || methodMatch[2];
    return method ? method.toUpperCase() : 'GET';
  }
  
  // Check for implicit method indicators
  if (curlCommand.includes('-d ') || curlCommand.includes('--data')) {
    return 'POST';
  }
  
  // Default to GET
  return 'GET';
}

/**
 * Extracts headers from a cURL command
 */
function extractHeaders(curlCommand: string): Array<{ key: string; value: string }> {
  const headers: Array<{ key: string; value: string }> = [];
  
  // Pattern to match -H or --header flags
  const headerPatterns = [
    /-H\s+['"]([^'"]+)['"]/g,
    /--header\s+['"]([^'"]+)['"]/g,
    /-H\s+([^\s]+)/g,
    /--header\s+([^\s]+)/g
  ];
  
  headerPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(curlCommand)) !== null) {
      const headerString = match[1];
      if (headerString) {
        const colonIndex = headerString.indexOf(':');
        if (colonIndex > 0) {
          const key = headerString.substring(0, colonIndex).trim();
          const value = headerString.substring(colonIndex + 1).trim();
          headers.push({ key, value });
        }
      }
    }
  });
  
  return headers;
}

/**
 * Extracts body data from a cURL command
 */
function extractBody(curlCommand: string): any {
  // Pattern to match -d, --data, --data-raw, --data-binary flags
  const dataPatterns = [
    /-d\s+['"]([^'"]+)['"]/,
    /--data\s+['"]([^'"]+)['"]/,
    /--data-raw\s+['"]([^'"]+)['"]/,
    /--data-binary\s+['"]([^'"]+)['"]/,
    /-d\s+([^\s]+)/,
    /--data\s+([^\s]+)/,
    /--data-raw\s+([^\s]+)/,
    /--data-binary\s+([^\s]+)/
  ];
  
  for (const pattern of dataPatterns) {
    const match = curlCommand.match(pattern);
    if (match && match[1]) {
      const data = match[1];
      
      // Try to parse as JSON
      try {
        return JSON.parse(data);
      } catch {
        // If not JSON, return as string
        return data;
      }
    }
  }
  
  return null;
}

/**
 * Converts an ApiNode back to a cURL command string
 * @param apiNode - The ApiNode instance to convert
 * @param globalStore - Global store for variable resolution
 * @returns cURL command string
 */
export function apiNodeToCurl(apiNode: any, globalStore: Record<string, any> = {}): string {
  try {
    const url = apiNode.getUrl(globalStore);
    const headers = apiNode.getHeaders(globalStore);
    const body = apiNode.getBody(globalStore);
    
    let curlCommand = `curl -X ${apiNode.method}`;
    
    // Add URL
    curlCommand += ` "${url}"`;
    
    // Add headers
    Object.entries(headers).forEach(([key, value]) => {
      curlCommand += ` -H "${key}: ${value}"`;
    });
    
    // Add body for methods that support it
    if (body && !['GET', 'HEAD', 'DELETE'].includes(apiNode.method)) {
      const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
      curlCommand += ` -d '${bodyString}'`;
    }
    
    return curlCommand;
  } catch (error) {
    console.error('Error converting ApiNode to cURL:', error);
    return `curl -X ${apiNode.method} "${apiNode.baseUrl.defaultValue}${apiNode.url.defaultValue}"`;
  }
}

/**
 * Validates a cURL command string
 * @param curlCommand - The cURL command to validate
 * @returns Validation result
 */
export function validateCurlCommand(curlCommand: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!curlCommand || curlCommand.trim().length === 0) {
    errors.push('cURL command cannot be empty');
    return { isValid: false, errors };
  }
  
  if (!curlCommand.trim().startsWith('curl')) {
    errors.push('Command must start with "curl"');
  }
  
  const urlResult = extractUrl(curlCommand);
  if (!urlResult.success) {
    errors.push(urlResult.error || 'Invalid URL format');
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Example usage and test cases
 */
export const curlExamples = {
  get: 'curl -X GET "https://api.example.com/users?page=1&limit=10" -H "Authorization: Bearer token"',
  post: 'curl -X POST "https://api.example.com/users" -H "Content-Type: application/json" -d \'{"name": "John", "email": "john@example.com"}\'',
  put: 'curl -X PUT "https://api.example.com/users/123" -H "Content-Type: application/json" -d \'{"name": "John Updated"}\'',
  delete: 'curl -X DELETE "https://api.example.com/users/123" -H "Authorization: Bearer token"'
};
