#!/bin/bash

# KhmerGhost OMEGA Deployment Script
set -e

echo "🚀 Starting KhmerGhost OMEGA Deployment..."

# Pull latest code
echo "📦 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
cd backend
npm ci --production
cd ../frontend
npm ci --production

# Build applications
echo "🔨 Building applications..."
cd ../backend
npm run build
cd ../frontend
npm run build

# Run migrations
echo "🗄️ Running database migrations..."
cd ../backend
npm run migration:run

# Seed database
echo "🌱 Seeding database..."
npm run seed

# Restart services
echo "🔄 Restarting services..."
pm install -g pm2
pm2 restart khmerghost-backend || pm2 start dist/main.js --name khmerghost-backend
pm2 restart khmerghost-frontend || pm2 start npm --name khmerghost-frontend -- start

# Reload nginx
echo "🌐 Reloading nginx..."
sudo systemctl reload nginx

echo "✅ Deployment complete!"
echo "📊 Check status: pm2 status"
