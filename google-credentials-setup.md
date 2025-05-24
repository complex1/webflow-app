# Google OAuth Credentials Setup Guide

This guide provides detailed instructions for obtaining Google OAuth credentials for use with the Webflow App.

## Step 1: Access the Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

## Step 2: Create a New Project

1. Click on the project dropdown at the top of the page
2. Click "New Project"
3. Enter "Webflow App" as the project name
4. Click "Create"
5. Wait for the project to be created, then select it from the dropdown

## Step 3: Enable the Google OAuth API

1. In the left sidebar, navigate to "APIs & Services" > "Library"
2. Search for "Google OAuth2 API"
3. Click on the API and select "Enable"

## Step 4: Configure the OAuth Consent Screen

1. In the left sidebar, navigate to "APIs & Services" > "OAuth consent screen"
2. Select "External" as the user type (or "Internal" if this is for an organization)
3. Click "Create"
4. Fill out the required information:
   - App name: "Webflow App"
   - User support email: Your email address
   - Developer contact information: Your email address
5. Click "Save and Continue"
6. Under "Scopes", click "Add or Remove Scopes"
7. Select the following scopes:
   - `openid` (usually automatically included)
   - `profile`
   - `email`
8. Click "Save and Continue"
9. If using External user type, add your email as a test user
10. Click "Save and Continue"
11. Review your settings and click "Back to Dashboard"

## Step 5: Create OAuth Client ID

1. In the left sidebar, navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" at the top of the page
3. Select "OAuth client ID"
4. For Application type, select "Web application"
5. Name: "Webflow App Web Client"
6. Under "Authorized JavaScript origins", add:
   - Development: `http://localhost:5173` (or your development server URL)
   - Production: Your production URL (e.g., `https://webflow-app.example.com`)
7. Under "Authorized redirect URIs", add:
   - Development: `http://localhost:5173` (or your development server URL)
   - Production: Your production URL (e.g., `https://webflow-app.example.com`)
8. Click "Create"
9. A modal will appear with your Client ID and Client Secret - copy the Client ID

## Step 6: Update Application Configuration

1. Open `/application/ui/src/config/auth.config.ts`
2. Replace the placeholder Google Client ID with your actual Client ID:
   ```typescript
   export const GOOGLE_CLIENT_ID = 'your-client-id-here.apps.googleusercontent.com';
   ```
3. Open `/application/server/src/config/auth.config.ts`
4. Replace the placeholder Google Client ID with your actual Client ID:
   ```typescript
   export const GOOGLE_CLIENT_ID = 'your-client-id-here.apps.googleusercontent.com';
   ```

## Step 7: Testing

1. Start both your server and UI applications
2. Navigate to the login page
3. Click "Login with Google"
4. Complete the Google authentication flow
5. You should be redirected to your application dashboard

## Security Considerations

- Never commit your Client ID to public repositories
- For production, consider using environment variables:

  **Client (ui):**
  ```typescript
  export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  ```
  
  **Server:**
  ```typescript
  export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  ```

- Regularly review access to your Google Cloud project
- Audit OAuth consent screen settings periodically
