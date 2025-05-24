import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { userService } from '../services/user.service';
import { GOOGLE_CLIENT_ID, AUTH_CONFIG } from '../config/auth.config';

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleAuthController = {
  /**
   * Handle Google Sign-In
   */
  async googleLogin(req: Request, res: Response): Promise<void> {
    console.log('Google login request received:', req.body);
    
    // Check if Google Auth is enabled globally
    if (!AUTH_CONFIG.enableGoogleAuth) {
      console.error('Google authentication attempt when feature is disabled');
      res.status(403).json({ message: 'Google authentication is currently disabled' });
      return;
    }
    
    try {
      const { tokenId } = req.body;
      
      if (!tokenId) {
        console.error('Token ID is missing in request');
        res.status(400).json({ message: 'Token ID is required' });
        return;
      }
      
      console.log('Verifying Google token with Client ID:', GOOGLE_CLIENT_ID);
      
      // Verify Google token
      try {
        const ticket = await client.verifyIdToken({
          idToken: tokenId,
          audience: GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        if (!payload) {
          console.error('Token verification succeeded but payload is empty');
          res.status(401).json({ message: 'Invalid token - empty payload' });
          return;
        }
        
        console.log('Token verification successful, payload:', {
          email: payload.email,
          name: payload.name,
          sub: payload.sub,
          // Mask other potentially sensitive data
        });
        
        const { email, name, picture } = payload;
      
        if (!email) {
          res.status(400).json({ message: 'Email not provided in Google token' });
          return;
        }
        
        // Check if user already exists
        try {
          // Try to login the user if they already exist
          const { user, token } = await userService.loginWithGoogle(email);
          res.status(200).json({ user, token });
        } catch (error) {
          // User doesn't exist, create a new one
          const user = await userService.registerWithGoogle({
            email: email || '',
            name: name || 'Google User',
            avatar: picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random`
          });
          
          // Generate token for new user
          const { token } = await userService.loginWithGoogle(email || '');
          
          res.status(201).json({ user, token });
        }
      } catch (error: any) {
        throw error; // Re-throw to be caught by the outer try-catch
      }
    } catch (error: any) {
      console.error('Google auth error:', error);
      
      // Enhanced error reporting
      let errorMessage = 'Failed to authenticate with Google';
      let statusCode = 401;
      
      if (error.message.includes('Token used too late')) {
        errorMessage = 'Authentication token has expired. Please try again.';
      } else if (error.message.includes('Invalid value')) {
        errorMessage = 'Invalid authentication token received.';
      } else if (error.message.includes('audience')) {
        errorMessage = 'Token was not issued for this application.';
        console.error('Client ID mismatch. Check your Google Cloud Console configuration.');
      } else if (error.message.includes('network')) {
        statusCode = 500;
        errorMessage = 'Network error verifying your login. Please try again.';
      }
      
      res.status(statusCode).json({ 
        message: errorMessage, 
        error: error.message,
        details: 'See server logs for more information'
      });
    }
  }
};
