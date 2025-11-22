#!/bin/bash

# 🧪 Test Production Admin Login
# This script tests if admin accounts were created successfully

echo "🧪 Testing Production Admin Accounts..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL not set${NC}"
    echo "Please set DATABASE_URL environment variable"
    exit 1
fi

echo -e "${GREEN}✅ DATABASE_URL found${NC}"
echo ""

# Test database connection
echo "🔌 Testing database connection..."
if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    exit 1
fi
echo ""

# Query admin accounts
echo "👥 Checking admin accounts..."
echo ""

QUERY="SELECT id, email, name, role, created_at FROM admins WHERE email IN ('noah@smawahidiyah.edu', 'kevin@smawahidiyah.edu');"

# Run query and format output
npx prisma db execute --stdin <<< "$QUERY" 2>/dev/null | head -20

echo ""
echo "🔍 Verification Results:"
echo "========================"

# Count admins
ADMIN_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM admins WHERE email IN ('noah@smawahidiyah.edu', 'kevin@smawahidiyah.edu');" 2>/dev/null | grep -o '[0-9]*' | head -1)

if [ "$ADMIN_COUNT" = "2" ]; then
    echo -e "${GREEN}✅ Both admin accounts found${NC}"
else
    echo -e "${YELLOW}⚠️  Only $ADMIN_COUNT admin account(s) found${NC}"
    echo "Expected: 2 admins (Noah and Kevin)"
fi

echo ""
echo "📝 Next Steps:"
echo "1. Test login at: /admin/login"
echo "2. Use credentials from PRODUCTION-ADMIN-CREDENTIALS.md"
echo "3. Change passwords after first login"
echo "4. Verify all features working correctly"
echo ""
echo "✨ Test completed!"
