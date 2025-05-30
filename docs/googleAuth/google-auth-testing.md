# Testing Google Authentication

This document provides steps for testing the Google authentication integration in the Webflow App.

## Prerequisites

- Ensure you have added a valid Google Client ID to:
  - `/application/ui/src/config/auth.config.ts`
  - `/application/server/src/config/auth.config.ts`
- Ensure your Google Cloud Console project has:
  - The correct origins configured
  - OAuth consent screen properly set up
  - API credentials properly configured

## Test Cases

### 1. Toggle Functionality Test

1. Navigate to the login page
2. Locate the "Enable Google Login" toggle at the bottom of the login form
3. Toggle Google Login off and verify the Google login button disappears
4. Toggle Google Login on and verify the Google login button appears
5. Refresh the page and verify that your toggle preference is remembered

### 2. Basic Authentication Flow

1. Navigate to the login page
2. Ensure the Google Login toggle is enabled
3. Click the "Login with Google" button
4. Complete the Google OAuth consent screen
5. Verify you are redirected to the dashboard
6. Verify the token is stored in localStorage

### 3. New User Registration via Google

1. Use a Google account that has never logged into the app before
2. Click the "Login with Google" button
3. Complete the Google OAuth consent screen
4. Verify a new user is created in the database
5. Verify you are redirected to the dashboard

### 4. Existing User Login via Google

1. Use a Google account that has previously logged into the app
2. Click the "Login with Google" button
3. Complete the Google OAuth consent screen
4. Verify no new user is created
5. Verify you are redirected to the dashboard

### 5. Error Handling

1. Disconnect from the internet
2. Try logging in with Google
3. Verify an appropriate error message is displayed
4. Reconnect to the internet and try again to verify recovery

### 6. Server-side Toggle Enforcement

1. In the server's `auth.config.ts` file, set `enableGoogleAuth: false`
2. Try logging in with Google (even if the client toggle is enabled)
3. Verify that the server returns a 403 error with an appropriate message
4. Set `enableGoogleAuth: true` and verify login works again

### 7. Token Validation

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
5. Use the browser debugging tools to check network requests for any issues
6. Inspect the application tab in developer tools to check token storage
7. Use the verification utilities:
   - `verifyGoogleSetup()` to check your Google auth configuration
   - `checkGSIScript()` to ensure the Google API script is loading correctly
8. Check for Content Security Policy (CSP) issues by looking for CSP errors in console

## Performance Considerations

- Google auth initialization can cause a slight delay on initial page load
- Consider enabling the "auto_select" option for returning users
- If not using Google auth, disable it completely for better performance

## Security Best Practices

1. Always validate Google tokens on the server side
2. Never trust client-side validation alone
3. Set proper audience restrictions in the Google Cloud Console
4. Implement token expiration and refresh mechanisms
5. Store tokens securely and never expose them in client-side code

## Further Testing Resources

- Use [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) for token testing
- Create test accounts specifically for auth flow testing
- Consider implementing end-to-end tests for authentication flows
