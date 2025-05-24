// Google OAuth configuration
export const GOOGLE_CLIENT_ID = '816845651416-a9hlo52qv0dr86d0h3h7738oivvunmfm.apps.googleusercontent.com';

// This should be replaced with a real Google Client ID from the Google Cloud Console
// https://console.cloud.google.com/apis/credentials

// Authentication configuration
export const AUTH_CONFIG = {
  // Enable/disable Google authentication globally
  enableGoogleAuth: true,
};

// JWT Secret
export const JWT_SECRET = process.env.JWT_SECRET || 'workflow-app-secret-key';
