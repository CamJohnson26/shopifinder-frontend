/**
 * Script to copy data assets to the public folder
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define source and destination paths
const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'src', 'data');
const publicDir = path.join(rootDir, 'public');

// Create screenshots directory in public if it doesn't exist
const publicScreenshotsDir = path.join(publicDir, 'screenshots');
if (!fs.existsSync(publicScreenshotsDir)) {
  fs.mkdirSync(publicScreenshotsDir, { recursive: true });
}

// Copy JSON files
const jsonFiles = ['shopify_sites.json', 'tags_summary.json'];
jsonFiles.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(publicDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to public folder`);
  } else {
    console.warn(`Warning: ${file} not found in src/data`);
  }
});

// Copy screenshots
const screenshotsDir = path.join(sourceDir, 'screenshots');
if (fs.existsSync(screenshotsDir)) {
  const screenshots = fs.readdirSync(screenshotsDir);
  
  screenshots.forEach(file => {
    const sourcePath = path.join(screenshotsDir, file);
    const destPath = path.join(publicScreenshotsDir, file);
    
    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
  
  console.log(`Copied ${screenshots.length} screenshots to public/screenshots folder`);
} else {
  console.warn('Warning: screenshots directory not found in src/data');
}

console.log('Asset copying complete!');