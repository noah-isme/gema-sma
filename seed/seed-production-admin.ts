import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting production admin seed...')
  console.log('')

  // Hash password yang kuat untuk production
  const noahPassword = await bcrypt.hash('Noah@GEMA2024!Secure', 12)
  const kevinPassword = await bcrypt.hash('Kevin@GEMA2024!Secure', 12)

  console.log('👨‍💼 Creating admin accounts for production...')

  // Admin Noah
  const noah = await prisma.admin.upsert({
    where: { email: 'noah@smawahidiyah.edu' },
    update: {
      password: noahPassword,
      name: 'Noah Caesar',
      role: 'SUPER_ADMIN'
    },
    create: {
      email: 'noah@smawahidiyah.edu',
      password: noahPassword,
      name: 'Noah Caesar',
      role: 'SUPER_ADMIN'
    }
  })

  console.log(`✅ Created/Updated Super Admin: ${noah.name} (${noah.email})`)
  console.log(`   ID: ${noah.id}`)
  console.log(`   Role: ${noah.role}`)
  console.log('')

  // Admin Kevin
  const kevin = await prisma.admin.upsert({
    where: { email: 'kevin@smawahidiyah.edu' },
    update: {
      password: kevinPassword,
      name: 'Kevin Maulana',
      role: 'ADMIN'
    },
    create: {
      email: 'kevin@smawahidiyah.edu',
      password: kevinPassword,
      name: 'Kevin Maulana',
      role: 'ADMIN'
    }
  })

  console.log(`✅ Created/Updated Admin: ${kevin.name} (${kevin.email})`)
  console.log(`   ID: ${kevin.id}`)
  console.log(`   Role: ${kevin.role}`)
  console.log('')

  // Tampilkan informasi login
  console.log('📋 PRODUCTION LOGIN CREDENTIALS:')
  console.log('================================')
  console.log('')
  console.log('👑 SUPER ADMIN - Noah Caesar:')
  console.log('   Email: noah@smawahidiyah.edu')
  console.log('   Password: Noah@GEMA2024!Secure')
  console.log('   Role: SUPER_ADMIN')
  console.log('')
  console.log('👨‍💼 ADMIN - Kevin Maulana:')
  console.log('   Email: kevin@smawahidiyah.edu')
  console.log('   Password: Kevin@GEMA2024!Secure')
  console.log('   Role: ADMIN')
  console.log('')
  console.log('⚠️  IMPORTANT SECURITY NOTES:')
  console.log('   1. Save these credentials in a secure password manager')
  console.log('   2. Change passwords after first login')
  console.log('   3. Enable 2FA if available')
  console.log('   4. Never commit .env files with passwords')
  console.log('   5. Use strong, unique passwords for production')
  console.log('')
  console.log('✅ Production admin seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding production admins:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
