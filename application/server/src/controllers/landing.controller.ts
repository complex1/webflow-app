import { Request, Response } from 'express';

/**
 * Logger for SSR operations
 */
const logSSR = (message: string, req: Request, additionalInfo: any = {}) => {
  const logData = {
    timestamp: new Date().toISOString(),
    message,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    ...additionalInfo
  };
  console.log(`[SSR] ${JSON.stringify(logData)}`);
};

export const landingController = {
  /**
   * Render the landing page
   */
  async renderLandingPage(req: Request, res: Response): Promise<void> {
    try {
      logSSR('Landing page requested', req);
      
      const data = {
        title: 'Webflow - Build Powerful Workflows Without Code',
        year: new Date().getFullYear(),
        stats: {
          activeUsers: '10,000+',
          workflowsCreated: '1M+',
          userRating: '4.9/5'
        }
      };
      
      // Render the landing page with EJS
      res.render('landing', data);
      
      logSSR('Landing page rendered successfully', req);
    } catch (error) {
      logSSR('Error rendering landing page', req, { error: error instanceof Error ? error.message : String(error) });
      console.error('Error rendering landing page:', error);
      res.status(500).send('Error rendering landing page');
    }
  }
};
