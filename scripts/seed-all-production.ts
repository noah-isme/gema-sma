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
    codingLabTasks: await prisma.codingLabTask.count(),
    pythonCodingTasks: await prisma.pythonCodingTask.count(),
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
  
  // Check if ALL data is complete
  const isFullySeeded = initialState.admins >= 2 && 
                        initialState.students >= 20 && 
                        initialState.announcements >= 3 &&
                        initialState.articles >= 5 &&
                        initialState.assignments >= 5 &&
                        initialState.pythonCodingTasks >= 3
  
  if (isFullySeeded) {
    console.log('✅ Database already fully seeded. Skipping...')
    return
  }
  
  console.log('⚠️  Database incomplete. Running seed...')
  console.log('')
  
  // Import seed modules
  const { execSync } = require('child_process')
  
  try {
    // 1. Main seed (admins, students, announcements, events, etc)
    console.log('1️⃣  Seeding base data...')
    execSync('npx tsx seed/seed.ts', { stdio: 'inherit' })
    
    // 2. Tutorial articles (if not exist)
    if (initialState.articles === 0) {
      console.log('\n2️⃣  Seeding tutorial articles...')
      execSync('npx tsx seed/seed-tutorial-articles.ts', { stdio: 'inherit' })
    }
    
    // 3. Assignments (if not exist)
    if (initialState.assignments === 0) {
      console.log('\n3️⃣  Seeding assignments...')
      execSync('npx tsx seed/seed-realistic-assignments.ts', { stdio: 'inherit' })
    }
    
    // 4. Python Coding lab (if not exist)
    if (initialState.pythonCodingTasks === 0) {
      console.log('\n4️⃣  Seeding Python coding lab...')
      execSync('npx tsx seed/seed-python-coding-lab.ts', { stdio: 'inherit' })
    }
    
    // 5. Web Lab assignments
    console.log('\n5️⃣  Seeding Web Lab...')
    execSync('npx tsx seed/seed-web-lab.ts', { stdio: 'inherit' })
    
    // 6. Classroom
    console.log('\n6️⃣  Seeding Classroom...')
    execSync('npx tsx seed/seed-classroom.ts', { stdio: 'inherit' })
    
    // 7. Classroom Roadmap
    console.log('\n7️⃣  Seeding Classroom Roadmap...')
    execSync('npx tsx seed/seed-classroom-roadmap.ts', { stdio: 'inherit' })
    
    console.log('\n✅ All seeding completed!')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    // Don't throw, let build continue
  }
  
  console.log('')
  console.log('═'.repeat(50))
  console.log('📊 Final database state:')
  console.log('═'.repeat(50))
  await checkDatabaseState()
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
