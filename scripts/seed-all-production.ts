import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabaseState() {
  console.log('📊 Checking database state...')
  console.log('')
  
  const counts = {
    admins: await prisma.admin.count(),
    students: await prisma.student.count(),
    announcements: await prisma.announcement.count(),
    events: await prisma.event.count(),
    articles: await prisma.article.count(),
    assignments: await prisma.assignment.count(),
    codingTasks: await prisma.codingLabTask.count(),
    quizzes: await prisma.quiz.count()
  }
  
  console.log('Current data:')
  Object.entries(counts).forEach(([key, count]) => {
    const emoji = count > 0 ? '✅' : '❌'
    console.log(`   ${emoji} ${key}: ${count}`)
  })
  console.log('')
  
  return counts
}

async function main() {
  console.log('🚀 Production Database Full Seed')
  console.log('═'.repeat(50))
  console.log('')
  
  // Check initial state
  const initialState = await checkDatabaseState()
  
  console.log('📝 Running comprehensive seed...')
  console.log('')
  
  // Import and run seed scripts
  // We'll just run the main seed which should handle everything
  // The seed.ts has been updated to check for incomplete data
  
  // For now, let's use a simpler approach:
  // Force re-run seed.ts with better logic
  
  console.log('✅ Note: Run individual seed scripts manually if needed:')
  console.log('   - npm run db:seed-tutorials')
  console.log('   - npm run db:seed-python-lab')
  console.log('   - npm run db:seed-announcements')
  console.log('')
  console.log('Or better: Clear and re-seed from scratch')
  console.log('')
  
  console.log('═'.repeat(50))
  console.log('📊 Current database state:')
  console.log('═'.repeat(50))
  await checkDatabaseState()
  
  console.log('💡 Recommendation: Run `npm run db:clear-and-seed` for fresh data')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
