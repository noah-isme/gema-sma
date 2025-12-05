import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinaryConnection() {
  console.log("🧪 Testing Cloudinary Configuration...\n");

  // 1. Check environment variables
  console.log("1️⃣  Checking environment variables...");
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("❌ Missing Cloudinary environment variables!");
    console.error(
      `   CLOUDINARY_CLOUD_NAME: ${cloudName ? "✅ Set" : "❌ Missing"}`,
    );
    console.error(`   CLOUDINARY_API_KEY: ${apiKey ? "✅ Set" : "❌ Missing"}`);
    console.error(
      `   CLOUDINARY_API_SECRET: ${apiSecret ? "✅ Set" : "❌ Missing"}`,
    );
    process.exit(1);
  }

  console.log("   ✅ All environment variables are set");
  console.log(`   Cloud Name: ${cloudName}\n`);

  // 2. Check if images exist
  console.log("2️⃣  Checking image files...");
  const imageFiles = [
    "public/images/belajar_dengan_teachable_machine.png",
    "public/images/kegiatan_ekstra_gema_setelah_sekolah.png",
    "public/images/mengerjakan_tugas_informatika.png",
    "public/images/presentasi_on_the_job_training_ai.png",
    "public/images/workshop_pemanfaatan_ai.png",
  ];

  let allFilesExist = true;
  for (const file of imageFiles) {
    const fullPath = path.join(process.cwd(), file);
    const exists = fs.existsSync(fullPath);
    const fileName = path.basename(file);

    if (exists) {
      const stats = fs.statSync(fullPath);
      const fileSizeKB = (stats.size / 1024).toFixed(2);
      console.log(`   ✅ ${fileName} (${fileSizeKB} KB)`);
    } else {
      console.error(`   ❌ ${fileName} - File not found!`);
      allFilesExist = false;
    }
  }

  if (!allFilesExist) {
    console.error("\n❌ Some image files are missing!");
    process.exit(1);
  }

  console.log("   ✅ All image files found\n");

  // 3. Test Cloudinary connection with ping
  console.log("3️⃣  Testing Cloudinary API connection...");
  try {
    const result = await cloudinary.api.ping();
    console.log("   ✅ Successfully connected to Cloudinary!");
    console.log(`   Response: ${JSON.stringify(result)}\n`);
  } catch (error) {
    console.error("   ❌ Failed to connect to Cloudinary!");
    console.error(`   Error: ${error}\n`);
    process.exit(1);
  }

  // 4. Test upload with first image
  console.log("4️⃣  Testing image upload (dry run)...");
  try {
    const testImagePath = path.join(process.cwd(), imageFiles[0]);
    const testFileName = path.basename(
      imageFiles[0],
      path.extname(imageFiles[0]),
    );

    console.log(`   Uploading: ${path.basename(imageFiles[0])}`);

    const uploadResult = await cloudinary.uploader.upload(testImagePath, {
      folder: "gema-gallery-test",
      public_id: `test_${testFileName}`,
      overwrite: true,
      resource_type: "image",
    });

    console.log("   ✅ Test upload successful!");
    console.log(`   URL: ${uploadResult.secure_url}`);
    console.log(`   Public ID: ${uploadResult.public_id}`);
    console.log(`   Format: ${uploadResult.format}`);
    console.log(`   Size: ${(uploadResult.bytes / 1024).toFixed(2)} KB\n`);

    // Delete test upload
    console.log("5️⃣  Cleaning up test upload...");
    await cloudinary.uploader.destroy(uploadResult.public_id);
    console.log("   ✅ Test upload cleaned up\n");
  } catch (error) {
    console.error("   ❌ Test upload failed!");
    console.error(`   Error: ${error}\n`);
    process.exit(1);
  }

  // Summary
  console.log("━".repeat(60));
  console.log("✅ All tests passed! Ready to seed gallery data.");
  console.log("\nTo proceed with seeding, run:");
  console.log("   npm run db:seed-gallery-cloudinary");
  console.log("━".repeat(60));
}

testCloudinaryConnection().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
