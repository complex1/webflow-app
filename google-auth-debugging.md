# Debugging Google Authentication

This guide provides solutions for common issues you might encounter with Google authentication in the Webflow App.

## Common Issues and Solutions

### 1. "Error initializing Google Sign-In" message

**Problem:** The Google Sign-In API fails to initialize.

**Solutions:**
- Verify that your Google Client ID is correct
- Check that the Google Sign-In script is loading properly
- Ensure your application domain is allowed in the Google Developer Console

### 2. "Token ID is required" error

**Problem:** Server is not receiving the token from the client.

**Solutions:**
- Check the network request to ensure the token is being sent correctly
- Verify that the Google Sign-In callback is correctly handling the credential
- Check for any client-side JavaScript errors in the console

### 3. "Invalid token" error

**Problem:** The token received by the server is invalid or expired.

**Solutions:**
- Ensure the Google Client ID matches between client and server
- Verify the token hasn't expired
- Check that the server's time is synchronized correctly

### 4. "Failed to authenticate with Google" error

**Problem:** The server cannot verify the token with Google's servers.

**Solutions:**
- Check server connectivity to Google's authentication servers
- Ensure the Google Auth Library is properly installed
- Verify that the token payload contains the expected fields

### 5. Console errors related to Google Sign-In script

**Problem:** Issues with loading or executing the Google Sign-In script.

**Solutions:**
- Check for script loading errors in the console
- Ensure there are no Content Security Policy (CSP) restrictions blocking the script
- Try loading the script manually in the console to test

## Debugging Steps

1. **Check browser console logs:**
   ```
   Open developer tools (F12) > Console tab
   ```

2. **Examine network requests:**
   ```
   Open developer tools (F12) > Network tab > Filter for requests to /api/auth/google
   ```

3. **Check server logs:**
   ```
   Check terminal where the server is running for authentication errors
   ```

4. **Validate Google Client ID:**
   ```
   Verify the Client ID matches between client and server configurations
   ```

5. **Test Google Sign-In separately:**
   ```
   Use Google's test page: https://developers.google.com/identity/sign-in/web/demo
   ```

## Logging for Debugging

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
