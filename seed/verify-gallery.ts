import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function verify() {
  console.log('\n🔍 Verifying Gallery Data...\n')

  const galleries = await prisma.gallery.findMany({
    orderBy: { createdAt: 'desc' }
  })

  console.log('━'.repeat(80))

  galleries.forEach((item, index) => {
    console.log(`\n${index + 1}. ${item.title}`)
    console.log(`   Category: ${item.category}`)
    console.log(`   Show on Homepage: ${item.showOnHomepage ? '✅ Yes' : '❌ No'}`)
    console.log(`   Active: ${item.isActive ? '✅ Yes' : '❌ No'}`)
    console.log(`   Image URL: ${item.imageUrl}`)
    console.log(`   Description: ${item.description?.substring(0, 60)}...`)
  })

  console.log('\n' + '━'.repeat(80))
  console.log(`\n📊 Summary:`)
  console.log(`   Total: ${galleries.length} gallery items`)
  console.log(`   Homepage items: ${galleries.filter(g => g.showOnHomepage).length}`)
  console.log(`   Active items: ${galleries.filter(g => g.isActive).length}`)

  // Check Cloudinary URLs
  const cloudinaryUrls = galleries.filter(g => g.imageUrl.includes('cloudinary.com'))
  console.log(`   Cloudinary URLs: ${cloudinaryUrls.length}`)

  // Categories
  const categories = [...new Set(galleries.map(g => g.category))]
  console.log(`   Categories: ${categories.join(', ')}`)

  console.log('\n✅ Verification complete!\n')

  await prisma.$disconnect()
}

verify().catch((error) => {
  console.error('❌ Error:', error)
  process.exit(1)
})
