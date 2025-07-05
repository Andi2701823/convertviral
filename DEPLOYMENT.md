# Deployment Guide

## Environment Variables Setup

Before deploying to Netlify or any other platform, ensure all required environment variables are properly configured.

### Required Environment Variables

The following environment variables must be set in your deployment platform:

#### Core Configuration
```
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secure-random-string
```

#### Database
```
DATABASE_URL=postgresql://username:password@host:port/database
REDIS_URL=redis://username:password@host:port
```

#### Stripe Payment Processing
```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_GERMANY_TAX_RATE_ID=txr_your_germany_tax_rate_id
STRIPE_GERMANY_REDUCED_TAX_RATE_ID=txr_your_reduced_tax_rate_id
```

#### OAuth Providers
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

#### File Storage (AWS S3)
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name
AWS_CLOUDFRONT_DOMAIN=your_cloudfront_domain
STORAGE_URL=https://your_cloudfront_domain
```

#### Monitoring & Analytics
```
SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io/project
```

#### Performance & Security
```
CACHE_TTL=3600
MAX_UPLOAD_SIZE=104857600
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

## Netlify Deployment

### 1. Environment Variables Setup

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Add all the required environment variables listed above
4. Make sure to use production values (not test/development values)

### 2. Build Settings

Ensure your `netlify.toml` or build settings are configured correctly:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
```

### 3. Common Issues

#### "Neither apiKey nor config.authenticator provided" Error

This error occurs when Stripe environment variables are missing. Ensure:
- `STRIPE_SECRET_KEY` is set with a valid Stripe secret key
- `STRIPE_WEBHOOK_SECRET` is set with your webhook endpoint secret
- All Stripe-related environment variables are properly configured

#### OAuth Authentication Issues

Ensure:
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set if using Google OAuth
- `GITHUB_ID` and `GITHUB_SECRET` are set if using GitHub OAuth
- `NEXTAUTH_URL` matches your production domain
- `NEXTAUTH_SECRET` is a secure random string

### 4. Verification

After setting up environment variables:
1. Trigger a new deployment
2. Check the build logs for any missing environment variable errors
3. Test the authentication and payment flows in production

## Local Development

For local development, copy `.env.production.template` to `.env` and fill in your development/test values:

```bash
cp .env.production.template .env
# Edit .env with your local development values
```

## Security Notes

- Never commit actual environment variables to version control
- Use test/development keys for local development
- Use production keys only in production environment
- Regularly rotate sensitive keys and secrets
- Monitor your Stripe dashboard for any suspicious activity