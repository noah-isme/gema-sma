#!/bin/bash
set -e

echo "🌱 Manual Production Database Seeding"
echo "======================================"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is not set"
  echo ""
  echo "Please set it first:"
  echo "  export DATABASE_URL='postgresql://user:pass@host/db?sslmode=require'"
  echo ""
  exit 1
fi

echo "✅ DATABASE_URL found"
echo ""

# Show database info (hide password)
DB_INFO=$(echo $DATABASE_URL | sed 's/:[^@]*@/:****@/')
echo "📊 Database: $DB_INFO"
echo ""

# Confirm
read -p "⚠️  This will seed the production database. Continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Seeding cancelled"
  exit 0
fi

echo ""
echo "🚀 Starting seed process..."
echo ""

# Generate Prisma Client
echo "1️⃣  Generating Prisma Client..."
npx prisma generate

# Check database connection
echo ""
echo "2️⃣  Testing database connection..."
npx prisma db pull --force || {
  echo "❌ Failed to connect to database"
  exit 1
}

# Run migrations
echo ""
echo "3️⃣  Running migrations..."
npx prisma migrate deploy

# Run seed
echo ""
echo "4️⃣  Seeding database..."
npx tsx seed/seed.ts

echo ""
echo "✅ Production database seeding completed!"
echo ""
echo "📝 Default credentials:"
echo "   Admin:   admin.gema@smawahidiyah.edu / admin123"
echo "   Student: 2025001 / student123"
echo ""
