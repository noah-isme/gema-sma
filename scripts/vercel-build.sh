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
  
  # Seed database with all data
  echo "🌱 Seeding database with all data..."
  npx tsx scripts/seed-all-production.ts || echo "⚠️  Seeding completed with warnings"
fi

# Build Next.js application with Turbopack (Next.js 16+)
echo "🏗️  Building Next.js application with Turbopack..."
next build --turbopack

echo "✅ Build completed successfully!"
