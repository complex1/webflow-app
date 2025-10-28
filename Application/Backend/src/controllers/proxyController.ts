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
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return res.status(error.response.status).json(error);
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(500).json(error);
    } else {
      // Something happened in setting up the request that triggered an Error
      return res.status(500).json({
        success: false,
        message: 'Error in setting up the request',
        error: error.message
      });
    }
  }
};