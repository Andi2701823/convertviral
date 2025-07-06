# Google OAuth Setup for ConvertViral

This guide will walk you through setting up Google OAuth for the ConvertViral application.

## Google Cloud Console Setup

1. **Create a Google Cloud Project**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Click on the project dropdown at the top of the page
   - Click "New Project"
   - Enter a name for your project (e.g., "ConvertViral")
   - Click "Create"

2. **Configure OAuth Consent Screen**
   - In your new project, go to "APIs & Services" > "OAuth consent screen"
   - Select "External" user type (unless you have a Google Workspace organization)
   - Click "Create"
   - Fill in the required fields:
     - App name: "ConvertViral"
     - User support email: Your email address
     - Developer contact information: Your email address
   - Click "Save and Continue"
   - Under "Scopes", add the following scopes:
     - `userinfo.email`
     - `userinfo.profile`
     - `openid`
   - Click "Save and Continue"
   - Add test users if you're still in testing mode
   - Click "Save and Continue"
   - Review your settings and click "Back to Dashboard"

3. **Create OAuth 2.0 Client ID**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application" as the application type
   - Name: "ConvertViral Web Client"
   - Add the following Authorized JavaScript origins:
     - `https://convertviral.netlify.app`
     - `http://localhost:3000` (for local development)
   - Add the following Authorized redirect URIs:
     - `https://convertviral.netlify.app/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google` (for local development)
   - Click "Create"
   - Note your Client ID and Client Secret

4. **Enable Google People API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google People API"
   - Click on it and then click "Enable"

## Environment Variables Setup

1. **Create a .env.local file**
   - Copy the `.env.local.example` file to `.env.local`
   - Fill in the following variables:

```
# NextAuth Configuration
NEXTAUTH_URL=https://convertviral.netlify.app
# For local development, use: NEXTAUTH_URL=http://localhost:3000

# Generate a secret using: openssl rand -base64 32
NEXTAUTH_SECRET=your_generated_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_from_google_cloud_console
GOOGLE_CLIENT_SECRET=your_client_secret_from_google_cloud_console

# Database
DATABASE_URL=your_database_url_here
```

## Netlify Environment Variables

If deploying to Netlify, add the following environment variables in the Netlify dashboard:

1. Go to your site settings in Netlify
2. Navigate to "Build & deploy" > "Environment"
3. Add the following environment variables:
   - `NEXTAUTH_URL`: `https://convertviral.netlify.app`
   - `NEXTAUTH_SECRET`: Your generated secret
   - `GOOGLE_CLIENT_ID`: Your Google Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google Client Secret
   - `DATABASE_URL`: Your database URL

## Troubleshooting

- **Redirect URI Mismatch**: Ensure that the redirect URI in your Google Cloud Console matches exactly with your application's callback URL.
- **Scopes Not Configured**: Make sure you've added the necessary scopes in the OAuth consent screen.
- **API Not Enabled**: Ensure the Google People API is enabled for your project.
- **Environment Variables**: Double-check that all environment variables are correctly set.

## Testing

To test your Google OAuth setup:

1. Start your application locally with `npm run dev`
2. Navigate to the login page
3. Click the "Continue with Google" button
4. You should be redirected to Google's login page
5. After successful authentication, you should be redirected back to your application's dashboard