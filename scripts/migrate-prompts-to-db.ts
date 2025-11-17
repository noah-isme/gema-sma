/**
 * Script to migrate prompts from JSON file to database
 * Run: npx tsx scripts/migrate-prompts-to-db.ts
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting prompt migration from JSON to database...\n');

  try {
    // Read JSON file
    const jsonPath = path.join(process.cwd(), 'src/data/prompts/webPortfolioSma.json');
    const jsonContent = await fs.readFile(jsonPath, 'utf-8');
    const promptData = JSON.parse(jsonContent);

    console.log(`📄 Found schema: ${promptData.schemaId}`);
    console.log(`📊 Total sections: ${promptData.sections?.length || 0}\n`);

    if (!promptData.sections || !Array.isArray(promptData.sections)) {
      throw new Error('No sections found in JSON file');
    }

    let created = 0;
    let skipped = 0;

    for (const section of promptData.sections) {
      const slug = section.meta.id || `${promptData.schemaId}-${Date.now()}`;

      // Check if already exists
      const existing = await prisma.prompt.findUnique({
        where: { slug }
      });

      if (existing) {
        console.log(`⏭️  Skipped (already exists): ${section.title}`);
        skipped++;
        continue;
      }

      // Create prompt in database
      await prisma.prompt.create({
        data: {
          schemaId: promptData.schemaId,
          title: section.title,
          titleShort: section.meta.titleShort,
          slug: slug,
          level: section.meta.level,
          durasiMenit: section.meta.durasiMenit,
          prasyarat: section.meta.prasyarat || [],
          tujuanPembelajaran: section.meta.tujuanPembelajaran || [],
          tags: section.meta.tag || [],
          starterZip: section.meta.assets?.starterZip || '',
          gambarContoh: section.meta.assets?.gambarContoh || '',
          roleDeskripsi: section.role?.deskripsi || '',
          roleFokus: section.role?.fokus || '',
          taskTujuan: section.task?.tujuan || [],
          taskInstruksi: section.task?.instruksi || '',
          contextSituasi: section.context?.situasi || [],
          reasoningPrinsip: section.reasoning?.prinsip || '',
          reasoningStruktur: section.reasoning?.strukturDasar || {},
          reasoningStrategi: section.reasoning?.strategi || [],
          outputBentuk: section.output?.bentuk || [],
          outputTugasSiswa: section.output?.tugasSiswa || '',
          stopKriteria: section.stop?.kriteria || [],
          tipsAksesibilitas: section.tips?.aksesibilitas || [],
          tipsKesalahanUmum: section.tips?.kesalahanUmum || [],
          tipsTantangan: section.tips?.tantangan || [],
          author: 'Admin GEMA',
          authorId: 'system',
          status: 'published',
          featured: created === 0, // First one is featured
          versi: section.meta.versi || '1.0.0',
          publishedAt: new Date(section.meta.terakhirDiperbarui || Date.now()),
        }
      });

      console.log(`✅ Created: ${section.title}`);
      created++;
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📝 Total: ${created + skipped}`);
    console.log('\n✨ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
