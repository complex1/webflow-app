// Google Authentication Verification Script
import { GOOGLE_CLIENT_ID } from '../config/auth.config';

// This script helps diagnose Google Auth issues
// Add it to a page temporarily to troubleshoot auth problems

export function verifyGoogleSetup(): void {
  console.group('Google Auth Verification');
  
  // Check if Client ID is properly configured
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('YOUR_CLIENT_ID')) {
    console.error('❌ Invalid Google Client ID:', GOOGLE_CLIENT_ID);
    console.error('Please configure a valid Google Client ID in auth.config.ts');
  } else {
    console.log('✅ Google Client ID configured:', GOOGLE_CLIENT_ID);
  }
  
  // Check browser environment
  console.log('📊 Current origin:', window.location.origin);
  
  // Verify that this origin is allowed in Google Cloud Console
  console.log('⚠️ Verify that this origin is added to the authorized JavaScript origins in Google Cloud Console');
  
  // Check if Google API is loaded
  if (window.google && window.google.accounts && window.google.accounts.id) {
    console.log('✅ Google Sign-In API loaded successfully');
  } else {
    console.error('❌ Google Sign-In API not loaded');
    console.log('Attempting to load the script manually...');
    
    // Try to load the script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('✅ Google Sign-In script loaded manually');
      if (window.google && window.google.accounts && window.google.accounts.id) {
        console.log('✅ Google Sign-In API now available');
      } else {
        console.error('❌ Google Sign-In API still not available after loading');
      }
    };
    script.onerror = () => {
      console.error('❌ Failed to load Google Sign-In script');
      console.error('This could be due to network issues or content security policy restrictions');
    };
    
    document.head.appendChild(script);
  }
  
  // Check for third-party cookie restrictions
  console.log('📋 Checking for third-party cookie restrictions...');
  const cookiesEnabled = navigator.cookieEnabled;
  console.log(cookiesEnabled ? '✅ Cookies are enabled' : '❌ Cookies are disabled');
  
  // Check for CORS issues
  console.log('🔄 Testing CORS with a simple request to the server...');
  fetch('/api/health', { 
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    mode: 'cors'
  })
    .then(response => {
      if (response.ok) {
        console.log('✅ CORS is properly configured on the server');
      } else {
        console.error(`❌ Server responded with status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => console.log('Server response:', data))
    .catch(error => {
      console.error('❌ CORS test failed:', error);
      console.error('This suggests CORS is not properly configured on the server');
    });
  
  console.groupEnd();
}

export function checkGSIScript(): void {
  // Check if the GSI script is available
  const gsiScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
  if (gsiScript) {
    console.log('✅ GSI script is present in the document');
  } else {
    console.error('❌ GSI script is not found in the document');
  }
  
  // Additional diagnostics
  console.log('📋 Content Security Policy:', document.contentType);
  if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    console.warn('⚠️ CSP detected - might be blocking Google authentication');
  }
}
