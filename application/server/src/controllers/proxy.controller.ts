import { Request, Response } from 'express';
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';

interface ProxyRequestBody {
  url: string;
  baseUrl?: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  timeout?: number;
}

export const proxyController = {
  /**
   * Handle proxy requests by forwarding them to the target API
   */
  async handleProxyRequest(req: Request, res: Response): Promise<void> {
    try {
      const {
        url,
        baseUrl,
        method,
        headers = {},
        body,
        params,
        timeout = 30000 // Default 30 seconds timeout
      } = req.body as ProxyRequestBody;
      
      // Basic validation
      if (!url && !baseUrl) {
        res.status(400).json({ error: 'Either url or baseUrl is required' });
        return;
      }
      
      if (!method) {
        res.status(400).json({ error: 'Method is required' });
        return;
      }
      
      // Prepare request config
      const requestConfig: AxiosRequestConfig = {
        method: method as Method,
        url: baseUrl ? `${baseUrl}${url}` : url,
        headers: {
          // Default headers
          'Content-Type': 'application/json',
          // Merge with user-provided headers
          ...headers
        },
        timeout
      };
      
      // Add request data for appropriate methods
      if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
        requestConfig.data = body;
      }
      
      // Add URL parameters if provided
      if (params) {
        requestConfig.params = params;
      }
      
      // Make the request
      const response: AxiosResponse = await axios(requestConfig);
      
      // Return the response data, status, and headers
      res.json({
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      
    } catch (err) {
      const error = err as any; // Type assertion for error handling
      console.error('[PROXY] Error:', error?.message || 'Unknown error');
      
      // Handle Axios errors
      if (error?.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        res.json({
          error: error.response.data || 'Unknown error',
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      } else if (error?.request) {
        // The request was made but no response was received
        res.json({
          error: 'No response from target server',
          message: 'The request was made but no response was received'
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        res.json({
          error: 'Failed to make proxy request',
          message: error?.message || 'Unknown error'
        });
      }
    }
  }
};
