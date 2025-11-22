#!/bin/bash

# 👤 Add New Admin Account
# Interactive script to add new admin to production

echo "👤 Add New Admin Account"
echo "========================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL not set${NC}"
    echo "Set it with: export DATABASE_URL=\"your_database_url\""
    exit 1
fi

# Get admin details
echo -e "${BLUE}Enter admin details:${NC}"
echo ""

read -p "Email: " EMAIL
read -p "Name: " NAME
read -p "Role (ADMIN/SUPER_ADMIN): " ROLE

# Validate role
if [ "$ROLE" != "ADMIN" ] && [ "$ROLE" != "SUPER_ADMIN" ]; then
    echo -e "${RED}❌ Invalid role. Use ADMIN or SUPER_ADMIN${NC}"
    exit 1
fi

# Generate secure password
echo ""
echo "Choose password option:"
echo "1. Auto-generate secure password"
echo "2. Enter custom password"
read -p "Choice (1/2): " PASS_CHOICE

if [ "$PASS_CHOICE" = "1" ]; then
    # Generate random password
    PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)
    echo -e "${GREEN}Generated password: $PASSWORD${NC}"
elif [ "$PASS_CHOICE" = "2" ]; then
    read -sp "Enter password: " PASSWORD
    echo ""
    read -sp "Confirm password: " PASSWORD_CONFIRM
    echo ""
    
    if [ "$PASSWORD" != "$PASSWORD_CONFIRM" ]; then
        echo -e "${RED}❌ Passwords don't match${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Invalid choice${NC}"
    exit 1
fi

# Confirm
echo ""
echo -e "${YELLOW}Creating admin with:${NC}"
echo "Email: $EMAIL"
echo "Name: $NAME"
echo "Role: $ROLE"
echo ""
read -p "Proceed? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

# Create TypeScript temp file
TEMP_FILE=$(mktemp).ts

cat > "$TEMP_FILE" << 'EOF'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL!
  const name = process.env.ADMIN_NAME!
  const role = process.env.ADMIN_ROLE!
  const password = process.env.ADMIN_PASSWORD!
  
  const hashedPassword = await bcrypt.hash(password, 12)
  
  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      name,
      role
    },
    create: {
      email,
      password: hashedPassword,
      name,
      role
    }
  })
  
  console.log(`✅ Admin created: ${admin.name} (${admin.email})`)
  console.log(`   ID: ${admin.id}`)
  console.log(`   Role: ${admin.role}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
EOF

# Run script
echo ""
echo "🔄 Creating admin..."
ADMIN_EMAIL="$EMAIL" ADMIN_NAME="$NAME" ADMIN_ROLE="$ROLE" ADMIN_PASSWORD="$PASSWORD" \
  npx tsx "$TEMP_FILE"

# Cleanup
rm "$TEMP_FILE"

echo ""
echo -e "${GREEN}✅ Admin created successfully!${NC}"
echo ""
echo "📋 Save these credentials securely:"
echo "=================================="
echo "Email: $EMAIL"
echo "Password: $PASSWORD"
echo "Role: $ROLE"
echo ""
echo -e "${YELLOW}⚠️  Remember to save this password! It won't be shown again.${NC}"
