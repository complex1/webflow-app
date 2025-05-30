# Setting Up Google Authentication

This guide will walk you through setting up Google authentication for the webflow-app project.

## 1. Create a Google Developer Console Project

1. Go to the [Google Developer Console](https://console.developers.google.com/)
2. Click on "Create Project" or select an existing project
3. Give your project a name (e.g., "Webflow App")
4. Click "Create"

## 2. Configure OAuth Consent Screen

1. In the sidebar, click on "OAuth consent screen"
2. Choose the appropriate user type (External or Internal)
3. Fill in the required information:
   - App name: "Webflow App"
   - User support email: Your email
   - Developer contact information: Your email
4. Click "Save and Continue"
5. Add scopes (at minimum, you need `profile` and `email`)
6. Click "Save and Continue"
7. Add test users (if you selected External)
8. Click "Save and Continue"

## 3. Create OAuth Client ID

1. In the sidebar, click on "Credentials"
2. Click "Create Credentials" and select "OAuth client ID"
3. Choose "Web application" as the Application type
4. Name: "Webflow App Web Client"
5. Add authorized JavaScript origins:
   - For development: `http://localhost:5173` (or your Vue.js development server URL)
   - For production: Your production URL
6. Add authorized redirect URIs:
   - For development: `http://localhost:5173` (or your Vue.js development server URL)
   - For production: Your production URL
7. Click "Create"
8. Copy the Client ID and Client Secret (you'll only need the Client ID for this implementation)

## 4. Update Configuration Files

1. Update the Client ID in the UI config file:
   - File: `/application/ui/src/config/auth.config.ts`
   - Replace the placeholder with your actual Client ID
   
2. Update the Client ID in the server config file:
   - File: `/application/server/src/config/auth.config.ts`
   - Replace the placeholder with your actual Client ID

## 5. Testing the Authentication Flow

1. Start both the server and UI applications
2. Navigate to the login page
3. Click the "Sign in with Google" button
4. Complete the Google authentication process
5. Verify that you are redirected to the dashboard page after successful authentication
