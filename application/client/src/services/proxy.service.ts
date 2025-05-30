import { HttpService } from './http';
import { localProxyFn } from './localhostProxy.service';

/**
 * ProxyService - A service to make API calls through the server proxy
 * Helps avoid CORS issues and keeps API keys/tokens on the server
 */
export const proxyService = {
  /**
   * Make a request through the server's proxy API
   * @param {Object} options - The request options
   * @param {string} options.url - The URL path (combined with baseUrl if provided)
   * @param {string} [options.baseUrl] - The base URL for the API
   * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param {Object} [options.headers] - Request headers
   * @param {Object} [options.body] - Request body (for POST, PUT, etc.)
   * @param {Object} [options.params] - URL query parameters
   * @param {number} [options.timeout] - Request timeout in milliseconds
   * @returns {Promise<any>} - The API response
   */
  async request(options: any) {
      const localhostRegex = /(localhost|127\.0\.0\.1)/;
      const isLocalhost = localhostRegex.test(options.url);
      if (isLocalhost) {
          // If the request is to localhost, use the local proxy function
          return localProxyFn(options);
      }

      const httpService = new HttpService();
      httpService.url = '/api/proxy';
      httpService.method = 'POST';
      httpService.body = options;
      return httpService.run();
  }
};
