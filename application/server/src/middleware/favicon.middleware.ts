import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

/**
 * Middleware to handle favicon requests
 * This improves performance by serving the favicon directly from the file system
 */
export const faviconMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/favicon.ico') {
    const faviconPath = path.join(__dirname, '../public/images/favicon.ico');
    
    // Check if favicon exists
    if (fs.existsSync(faviconPath)) {
      res.set('Content-Type', 'image/x-icon');
      res.sendFile(faviconPath);
      return;
    }
  }
  next();
};
