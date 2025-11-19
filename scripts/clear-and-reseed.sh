#!/bin/bash
set -e

echo "🔄 Clear and Re-seed Production Database"
echo "========================================"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL is not set"
  echo "Please export DATABASE_URL first"
  exit 1
fi

echo "⚠️  WARNING: This will DELETE ALL data and re-seed from scratch!"
echo ""
read -p "Are you sure? Type 'yes' to continue: " confirmation

if [ "$confirmation" != "yes" ]; then
  echo "❌ Operation cancelled"
  exit 0
fi

echo ""
echo "🗑️  Clearing database..."
npx prisma migrate reset --force --skip-seed

echo ""
echo "🌱 Seeding base data (admins, students, announcements, events)..."
npx tsx seed/seed.ts

echo ""
echo "📚 Seeding tutorial articles..."
npx tsx seed/seed-tutorial-articles.ts || echo "⚠️  Tutorial articles seeding skipped"

echo ""
echo "📝 Seeding assignments..."
npx tsx seed/seed-realistic-assignments.ts || echo "⚠️  Assignments seeding skipped"

echo ""
echo "💻 Seeding Python coding lab..."
npx tsx seed/seed-python-coding-lab.ts || echo "⚠️  Coding lab seeding skipped"

echo ""
echo "🗺️  Seeding classroom roadmap..."
npx tsx seed/seed-classroom-roadmap.ts || echo "⚠️  Roadmap seeding skipped"

echo ""
echo "📊 Seeding student progress..."
npx tsx seed/seed-student-progress.ts || echo "⚠️  Progress seeding skipped"

echo ""
echo "✅ Database cleared and re-seeded successfully!"
echo ""
echo "🔑 Default credentials:"
echo "   Admin:   admin.gema@smawahidiyah.edu / admin123"
echo "   Student: 2025001 / student123"
echo ""
