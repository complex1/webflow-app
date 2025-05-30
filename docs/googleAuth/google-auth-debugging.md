# Debugging Google Authentication

This guide provides solutions for common issues you might encounter with Google authentication in the Webflow App.

## Quick Diagnosis

First, run the Google auth verification tools from your browser console:

```javascript
import { verifyGoogleSetup, checkGSIScript } from "./utils/google-auth-verify";
verifyGoogleSetup();
checkGSIScript();
```

## Common Issues and Solutions

### 1. "Error initializing Google Sign-In" message

**Problem:** The Google Sign-In API fails to initialize.

**Solutions:**
- Verify that your Google Client ID is correct
- Check that the Google Sign-In script is loading properly
- Ensure your application domain is allowed in the Google Cloud Console
- Try clearing browser cache and cookies
- Check browser console for additional error messages
- Verify there are no CSP (Content Security Policy) restrictions blocking the script

### 2. "Token ID is required" error

**Problem:** The server is not receiving the token from the client.

**Solutions:**
- Check the network request to ensure the token is being sent correctly
- Verify the token is being properly extracted in the frontend code
- Ensure you're using the correct parameter name ('tokenId' not 'token')
- Check that the Google Sign-In callback is properly configured
- Verify that the Google Sign-In callback is correctly handling the credential
- Check for any client-side JavaScript errors in the console

### 3. "Google authentication is currently disabled" error

**Problem:** The server has Google authentication disabled, but the client is still trying to use it.

**Solutions:**
- Check the server's `auth.config.ts` file to ensure `enableGoogleAuth` is set to `true`
- Verify that the client's preference in localStorage (`enableGoogleAuth`) is synchronized with server settings
- If you've recently enabled Google auth on the server, you may need to restart the server

### 4. "Invalid token" error

**Problem:** The token received by the server is invalid or expired.

**Solutions:**
- Ensure the Google Client ID matches between client and server
- Verify the token hasn't expired (they typically expire after 1 hour)
- Check that the server's time is synchronized correctly
- Verify that the audience in the token matches your expected client ID
- Ensure the token hasn't been tampered with during transmission

### 5. "Failed to authenticate with Google" error

**Problem:** The server cannot verify the token with Google's servers.

**Solutions:**
- Check server connectivity to Google's authentication servers
- Ensure the Google Auth Library is properly installed (`npm install google-auth-library`)
- Verify that the token payload contains the expected fields (subject, email, etc.)
- Check for specific error details in the server logs

### 6. Toggle functionality not working

**Problem:** The Google authentication toggle doesn't show/hide the login button properly.

**Solutions:**
- Check that the toggle component is properly bound to the state variable
- Verify that localStorage is working correctly in your browser
- Ensure the toggle emits the correct events when changed
- Check CSS to make sure elements are not hidden by styling issues

### 7. Console errors related to Google Sign-In script

**Problem:** Issues with loading or executing the Google Sign-In script.

**Solutions:**
- Check for script loading errors in the console
- Ensure there are no Content Security Policy (CSP) restrictions blocking the script
- Try loading the script manually in the console to test
- Verify your internet connection is stable

## Debugging Steps

1. **Check browser console logs:**
   ```javascript
   // Open developer tools (F12) > Console tab
   // Look for errors related to Google authentication
   ```

2. **Examine network requests:**
   ```javascript
   // Open developer tools (F12) > Network tab > Filter for requests to /api/auth/google
   // Check the request payload and response status codes
   ```

3. **Check server logs:**
   ```bash
   # Check terminal where the server is running for authentication errors
   # Look for "Google auth error:" in the logs
   ```

4. **Validate Google Client ID:**
   ```javascript
   // In browser console
   import { GOOGLE_CLIENT_ID } from "./config/auth.config";
   console.log(GOOGLE_CLIENT_ID);
   // Verify against your Google Cloud Console settings
   ```

5. **Test the toggle functionality:**
   ```javascript
   // In browser console
   localStorage.getItem('enableGoogleAuth');  // Check current value
   localStorage.setItem('enableGoogleAuth', 'true');  // Force enable
   ```

6. **Test Google Sign-In separately:**
   ```
   Use Google's test page: https://developers.google.com/identity/sign-in/web/sign-in
   ```

## Advanced Debugging

### Adding Enhanced Logging

Add these debug statements to your code to get more information:

1. **Client-side authentication flow:**

```javascript
// In your login component
const handleGoogleLogin = async () => {
  console.group('Google Login Flow');
  console.log('1. Initiating Google login');
  
  try {
    // Trigger Google login process
    console.log('2. Requesting Google Sign-In');
    const success = googleAuthUtil.prompt();
    console.log('3. Google Sign-In prompt result:', success);
    
    // Note: Google's callback will run asynchronously
  } catch (error) {
    console.error('Error during Google login:', error);
  }
  
  console.groupEnd();
};

// In credential response handler
const handleCredentialResponse = async (response) => {
  console.group('Google Credential Response');
  console.log('1. Received credential response:', response);
  
  try {
    console.log('2. Extracting token');
    const tokenId = response.credential;
    console.log('3. Sending token to server');
    
    const authResponse = await userService.googleLogin(tokenId);
    console.log('4. Server response:', authResponse);
    
    // Handle successful login
  } catch (error) {
    console.error('Error handling credential:', error);
  }
  
  console.groupEnd();
};
```

2. **Server-side token verification:**

```typescript
// In google-auth.controller.ts
console.group('Google Token Verification');
console.log('1. Token verification started');
console.log('2. Using Client ID:', GOOGLE_CLIENT_ID);

try {
  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: GOOGLE_CLIENT_ID
  });
  
  console.log('3. Token verified successfully');
  const payload = ticket.getPayload();
  console.log('4. Payload received:', {
    email: payload?.email,
    sub: payload?.sub
  });
} catch (error) {
  console.error('Token verification failed:', error);
}

console.groupEnd();
```

### Debugging Local Storage Issues

If the toggle state isn't being saved correctly:

```javascript
// In browser console
// Monitor localStorage changes
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  console.log(`Setting ${key} to ${value}`);
  originalSetItem.call(this, key, value);
};

// Check all stored values
Object.keys(localStorage).forEach(key => {
  console.log(`${key}: ${localStorage.getItem(key)}`);
});
```

### Testing Request/Response

Generate a test request to the Google auth endpoint:

```javascript
// In browser console
fetch('/api/auth/google', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    tokenId: 'YOUR_TEST_TOKEN' // Replace with actual token for testing
  })
})
.then(response => response.json())
.then(data => console.log('Response:', data))
.catch(error => console.error('Error:', error));
```

## Common Status Codes

| Status Code | Meaning                               | Possible Cause                                      |
|-------------|---------------------------------------|-----------------------------------------------------|
| 400         | Bad Request                           | Missing token ID or invalid request format          |
| 401         | Unauthorized                          | Invalid token, expired token, or verification failed|
| 403         | Forbidden                             | Google authentication is disabled on the server     |
| 500         | Internal Server Error                 | Server-side error during authentication process     |
| 200         | OK                                    | Authentication successful                           |
| 201         | Created                               | New user created via Google authentication          |

## Getting Additional Help

If you're still experiencing issues after trying these debugging steps:

1. Create a detailed report including browser, OS, and exact error messages
2. Export the network logs from your browser developer tools
3. Check for any CORS issues that might be affecting API calls
4. Verify your Google Cloud Console configuration is correct
5. Contact support with the collected information

Add these temporary logging statements to help debug:

**Client-side (login.vue):**
```javascript
// In handleCredentialResponse function:
console.log('Google credential response:', response);
```

**Server-side (google-auth.controller.ts):**
```javascript
// In googleLogin function:
console.log('Token payload:', payload);
```
