"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.AUTH_CONFIG = exports.GOOGLE_CLIENT_ID = void 0;
// Google OAuth configuration
exports.GOOGLE_CLIENT_ID = '816845651416-a9hlo52qv0dr86d0h3h7738oivvunmfm.apps.googleusercontent.com';
// This should be replaced with a real Google Client ID from the Google Cloud Console
// https://console.cloud.google.com/apis/credentials
// Authentication configuration
exports.AUTH_CONFIG = {
    // Enable/disable Google authentication globally
    enableGoogleAuth: true,
};
// JWT Secret
exports.JWT_SECRET = process.env.JWT_SECRET || 'workflow-app-secret-key';
