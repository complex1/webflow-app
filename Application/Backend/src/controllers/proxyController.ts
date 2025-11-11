import { Request, Response } from 'express';
import axios from 'axios';

export const executeProxyRequest = async (req: Request, res: Response) => {
  try {
    console.log('Proxy request received:', req.body);
    
    // Extract axios config from request body
    const axiosConfig = req.body;

    // Validate that we have at least a URL
    if (!axiosConfig.url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required in the axios config'
      });
    }

    // Execute the axios request
    const response = await axios(axiosConfig);

    // Return the response data along with status and headers
    res.status(response.status).json(response.data);

  } catch (error: any) {
    res.status(200).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};