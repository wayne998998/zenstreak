#!/bin/bash
# EdgeOne Deployment Script for ZenStreak

echo "🚀 Deploying ZenStreak to EdgeOne..."

# Check if EdgeOne CLI is installed
if ! command -v edgeone &> /dev/null; then
    echo "❌ EdgeOne CLI not found. Please install it first:"
    echo "npm install -g @tencent/edgeone-cli"
    exit 1
fi

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to EdgeOne
echo "🌐 Deploying to EdgeOne..."
edgeone deploy --dir dist --name zenstreak

echo "✅ Deployment complete!"
