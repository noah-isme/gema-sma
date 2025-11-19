import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function resetAdminPasswords() {
  console.log('🔐 Resetting Admin Passwords...')
  console.log('')

  const newPassword = 'admin123'
  const hashedPassword = await bcrypt.hash(newPassword, 12)

  // Admin accounts to reset
  const admins = [
    {
      email: 'superadmin@smawahidiyah.edu',
      name: 'Super Administrator',
      role: 'SUPER_ADMIN' as const
    },
    {
      email: 'admin.gema@smawahidiyah.edu',
      name: 'Admin GEMA',
      role: 'ADMIN' as const
    },
    {
      email: 'admin@smawahidiyah.edu',
      name: 'Admin SMA Wahidiyah',
      role: 'ADMIN' as const
    }
  ]

  for (const admin of admins) {
    try {
      const result = await prisma.admin.upsert({
        where: { email: admin.email },
        update: {
          password: hashedPassword,
          name: admin.name,
          role: admin.role
        },
        create: {
          email: admin.email,
          password: hashedPassword,
          name: admin.name,
          role: admin.role
        }
      })
      console.log(`✅ ${result.email} - Password reset`)
    } catch (error) {
      console.error(`❌ Failed to reset ${admin.email}:`, error)
    }
  }

  console.log('')
  console.log('📊 Current admin accounts:')
  const allAdmins = await prisma.admin.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  })

  allAdmins.forEach(admin => {
    console.log(`   - ${admin.email} (${admin.role})`)
  })

  console.log('')
  console.log('✅ Password reset complete!')
  console.log('')
  console.log('🔑 New credentials:')
  console.log('   Email:    admin.gema@smawahidiyah.edu')
  console.log('   Password: admin123')
  console.log('')
}

async function main() {
  try {
    await resetAdminPasswords()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
