#!/bin/bash
set -e

echo "🚀 Starting Vercel build process..."

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
prisma generate

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL not set - skipping database migration"
  echo "ℹ️  This is normal for preview deployments without database"
else
  echo "🗄️  DATABASE_URL found - running migrations..."
  prisma migrate deploy
  
  # Seed database if not already seeded
  echo "🌱 Checking if database needs seeding..."
  npx tsx seed/seed.ts || echo "⚠️  Seeding skipped or already done"
fi

# Build Next.js application
echo "🏗️  Building Next.js application..."
next build

echo "✅ Build completed successfully!"
