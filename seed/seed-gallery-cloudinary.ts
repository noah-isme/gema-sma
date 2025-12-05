import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface GalleryData {
  title: string;
  description: string;
  imagePath: string;
  category: string;
  showOnHomepage: boolean;
}

const galleryData: GalleryData[] = [
  {
    title: "Belajar dengan Teachable Machine",
    description:
      "Siswa GEMA belajar Machine Learning menggunakan Teachable Machine dari Google untuk membuat model AI sederhana",
    imagePath: "public/images/belajar_dengan_teachable_machine.png",
    category: "pembelajaran",
    showOnHomepage: true,
  },
  {
    title: "Kegiatan Ekstra GEMA Setelah Sekolah",
    description:
      "Kegiatan ekstrakurikuler GEMA dengan berbagai aktivitas coding, robotik, dan teknologi terkini",
    imagePath: "public/images/kegiatan_ekstra_gema_setelah_sekolah.png",
    category: "ekstrakulikuler",
    showOnHomepage: true,
  },
  {
    title: "Mengerjakan Tugas Informatika",
    description:
      "Siswa fokus mengerjakan tugas informatika dengan pendampingan dari pengajar GEMA",
    imagePath: "public/images/mengerjakan_tugas_informatika.png",
    category: "pembelajaran",
    showOnHomepage: true,
  },
  {
    title: "Presentasi On The Job Training AI",
    description:
      "Presentasi hasil On The Job Training tentang implementasi Artificial Intelligence",
    imagePath: "public/images/presentasi_on_the_job_training_ai.png",
    category: "event",
    showOnHomepage: true,
  },
  {
    title: "Workshop Pemanfaatan AI",
    description:
      "Workshop pemanfaatan Artificial Intelligence dalam kehidupan sehari-hari dan pendidikan",
    imagePath: "public/images/workshop_pemanfaatan_ai.png",
    category: "workshop",
    showOnHomepage: true,
  },
];

async function uploadToCloudinary(
  imagePath: string,
  publicId: string,
): Promise<string> {
  try {
    const fullPath = path.join(process.cwd(), imagePath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  File not found: ${fullPath}`);
      throw new Error(`File not found: ${fullPath}`);
    }

    console.log(`   📤 Uploading ${path.basename(imagePath)} to Cloudinary...`);

    const result = await cloudinary.uploader.upload(fullPath, {
      folder: "gema-gallery",
      public_id: publicId,
      overwrite: true,
      resource_type: "image",
    });

    console.log(`   ✅ Uploaded successfully: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`   ❌ Failed to upload ${imagePath}:`, error);
    throw error;
  }
}

async function main() {
  console.log("🖼️  Starting gallery seed with Cloudinary upload...\n");

  // Check Cloudinary configuration
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error("❌ Cloudinary environment variables are not configured!");
    console.error(
      "Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET",
    );
    process.exit(1);
  }

  console.log(
    `✅ Cloudinary configured: ${process.env.CLOUDINARY_CLOUD_NAME}\n`,
  );

  let successCount = 0;
  let failedCount = 0;

  for (const [index, item] of galleryData.entries()) {
    console.log(
      `[${index + 1}/${galleryData.length}] Processing: ${item.title}`,
    );

    try {
      // Generate public_id from filename
      const filename = path.basename(
        item.imagePath,
        path.extname(item.imagePath),
      );
      const publicId = filename.replace(/\s+/g, "_").toLowerCase();

      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(item.imagePath, publicId);

      // Check if gallery item already exists
      const existing = await prisma.gallery.findFirst({
        where: { title: item.title },
      });

      if (existing) {
        await prisma.gallery.update({
          where: { id: existing.id },
          data: {
            title: item.title,
            description: item.description,
            imageUrl: cloudinaryUrl,
            category: item.category,
            showOnHomepage: item.showOnHomepage,
            isActive: true,
          },
        });
        console.log(`   ✅ Updated: ${item.title}\n`);
      } else {
        await prisma.gallery.create({
          data: {
            title: item.title,
            description: item.description,
            imageUrl: cloudinaryUrl,
            category: item.category,
            showOnHomepage: item.showOnHomepage,
            isActive: true,
          },
        });
        console.log(`   ✅ Created: ${item.title}\n`);
      }

      successCount++;
    } catch (error) {
      console.error(`   ❌ Failed to process ${item.title}:`, error);
      failedCount++;
      console.log("");
    }
  }

  console.log("━".repeat(60));
  console.log(`\n✅ Seeding completed!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failedCount}`);
  console.log(`   Total: ${galleryData.length}\n`);
}

main()
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
