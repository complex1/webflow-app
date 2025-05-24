// Google authentication utility functions
import { GOOGLE_CLIENT_ID } from "../config/auth.config";

export interface GoogleCredentialResponse {
  credential: string;
}

/**
 * Google authentication utility for handling sign-in
 */
export const googleAuthUtil = {
  /**
   * Load the Google Sign-In API script
   */
  loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (document.getElementById('google-signin-script')) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.id = 'google-signin-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      
      document.head.appendChild(script);
    });
  },
  
  /**
   * Initialize Google Sign-In
   */
  initialize(callback: (response: GoogleCredentialResponse) => void): boolean {
    try {
      // Type assertion to access google object
      const googleObj = window.google as any;
      if (!googleObj || !googleObj.accounts || !googleObj.accounts.id) {
        console.error('Google Sign-In API not available');
        return false;
      }
      
      console.log('Initializing Google Sign-In with Client ID:', GOOGLE_CLIENT_ID);
      
      // More detailed configuration with debugging
      googleObj.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: callback,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signin',
        ux_mode: 'popup',
        debug: true // Enable Google's debug mode
      });
      
      return true;
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      return false;
    }
  },
  
  /**
   * Prompt the Google Sign-In flow
   */
  prompt(): boolean {
    try {
      const googleObj = window.google as any;
      if (!googleObj || !googleObj.accounts || !googleObj.accounts.id) {
        return false;
      }
      
      googleObj.accounts.id.prompt();
      return true;
    } catch (error) {
      console.error('Error prompting Google Sign-In:', error);
      return false;
    }
  }
};
