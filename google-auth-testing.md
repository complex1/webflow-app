# Testing Google Authentication

This document provides steps for testing the Google authentication integration in the Webflow App.

## Prerequisites

- Ensure you have added a valid Google Client ID to:
  - `/application/ui/src/config/auth.config.ts`
  - `/application/server/src/config/auth.config.ts`

## Test Cases

### 1. Basic Authentication Flow

1. Navigate to the login page
2. Click the "Login with Google" button
3. Complete the Google OAuth consent screen
4. Verify you are redirected to the dashboard
5. Verify the token is stored in localStorage

### 2. New User Registration via Google

1. Use a Google account that has never logged into the app before
2. Click the "Login with Google" button
3. Complete the Google OAuth consent screen
4. Verify a new user is created in the database
5. Verify you are redirected to the dashboard

### 3. Existing User Login via Google

1. Use a Google account that has previously logged into the app
2. Click the "Login with Google" button
3. Complete the Google OAuth consent screen
4. Verify no new user is created
5. Verify you are redirected to the dashboard

### 4. Error Handling

1. Disconnect from the internet
2. Try logging in with Google
3. Verify an appropriate error message is displayed

### 5. Token Validation

1. Login with Google
2. Use the browser developer tools to modify the token in localStorage
3. Refresh the page
4. Verify you are redirected to the login page

## Troubleshooting

If you encounter issues:

1. Check browser console for errors
2. Verify the Google Client ID is correctly set in both client and server configs
3. Check server logs for authentication errors
4. Verify the redirect URI in the Google Developer Console matches your app's URL
