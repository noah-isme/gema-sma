const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
  const logoPath = path.join(__dirname, '../public/gema.svg');
  const faviconPath = path.join(__dirname, '../src/app/favicon.ico');
  const iconPath = path.join(__dirname, '../src/app/icon.png');
  const appleIconPath = path.join(__dirname, '../src/app/apple-icon.png');
  
  console.log('🎨 Generating favicon from GEMA logo...');
  
  try {
    // Generate favicon.ico (32x32)
    await sharp(logoPath)
      .resize(32, 32)
      .toFile(faviconPath);
    console.log('✅ favicon.ico created (32x32)');
    
    // Generate icon.png (192x192 for PWA)
    await sharp(logoPath)
      .resize(192, 192)
      .png()
      .toFile(iconPath);
    console.log('✅ icon.png created (192x192)');
    
    // Generate apple-icon.png (180x180)
    await sharp(logoPath)
      .resize(180, 180)
      .png()
      .toFile(appleIconPath);
    console.log('✅ apple-icon.png created (180x180)');
    
    console.log('🎉 All favicons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    process.exit(1);
  }
}

generateFavicon();
