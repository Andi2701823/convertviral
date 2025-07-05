#!/bin/bash

# ConvertViral Deployment Script
# This script automates the deployment process for ConvertViral

set -e # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting ConvertViral deployment process..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Check environment argument
ENVIRONMENT=${1:-production}
if [ "$ENVIRONMENT" != "production" ] && [ "$ENVIRONMENT" != "preview" ] && [ "$ENVIRONMENT" != "development" ]; then
    echo "❌ Invalid environment. Use: production, preview, or development"
    exit 1
fi

echo "🔍 Environment: $ENVIRONMENT"

# Run tests
echo "🧪 Running tests..."
npm run lint

# Build application
echo "🏗️ Building application..."
npm run build

# Database migrations
echo "💾 Running database migrations..."
npx prisma migrate deploy

# Deploy to Vercel
echo "🚀 Deploying to Vercel ($ENVIRONMENT)..."
if [ "$ENVIRONMENT" = "production" ]; then
    vercel --prod
else
    vercel --env NEXT_PUBLIC_ENVIRONMENT="$ENVIRONMENT"
fi

echo "✅ Deployment completed successfully!"