#!/bin/bash

# Script to seed dashboard stats data for testing
# Usage: bash scripts/seed-dashboard-stats.sh

set -e

echo "🌱 GEMA Dashboard Stats Seeder"
echo "================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file with DATABASE_URL"
    exit 1
fi

# Load environment variables
source .env

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL not set in .env"
    exit 1
fi

echo "📊 Database: $(echo $DATABASE_URL | sed 's/:.*/.../')"
echo ""

# Confirm before seeding
echo "⚠️  This will create test data for:"
echo "   - Students (3 test accounts)"
echo "   - Tutorial articles (5 articles)"
echo "   - Assignments (3 assignments)"
echo "   - Coding lab tasks (3 tasks)"
echo "   - Submissions and feedbacks for Ahmad Fauzi"
echo "   - Activities, contacts, and registrations"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Seeding cancelled"
    exit 1
fi

# Run the seed script
echo ""
echo "🚀 Running seed script..."
echo ""

npx tsx seed/seed-dashboard-stats.ts

echo ""
echo "✅ Seeding completed!"
echo ""
echo "🧪 Test with:"
echo "   Student Login: ahmad.fauzi@example.com / 123456"
echo "   Check Dashboard: http://localhost:3000/student/dashboard-simple"
echo "   Check Admin Dashboard: http://localhost:3000/admin/dashboard"
echo ""
