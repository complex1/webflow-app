const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Define the directories
const PUBLIC_DIR = path.join(__dirname, '../src/public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

// Create directories if they don't exist
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Function to optimize images
function optimizeImages() {
  console.log('Starting image optimization...');
  
  // Check if required packages are installed
  try {
    // Find all image files in the images directory
    const imageFiles = fs.readdirSync(IMAGES_DIR).filter(file => 
      /\.(png|jpe?g|gif|svg)$/i.test(file)
    );
    
    if (imageFiles.length === 0) {
      console.log('No images found to optimize.');
      return;
    }
    
    console.log(`Found ${imageFiles.length} images to optimize.`);
    
    imageFiles.forEach(file => {
      const filePath = path.join(IMAGES_DIR, file);
      const extension = path.extname(file).toLowerCase();
      
      if (extension === '.svg') {
        // Optimize SVG files
        console.log(`Optimizing SVG: ${file}`);
        const tempFile = `${filePath}.temp`;
        
        // Basic SVG optimization (minification)
        const svgContent = fs.readFileSync(filePath, 'utf8');
        const minified = svgContent
          .replace(/>\s+</g, '><')  // Remove whitespace between tags
          .replace(/\s+/g, ' ')     // Collapse multiple whitespaces
          .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around special chars
          .trim();
          
        fs.writeFileSync(tempFile, minified);
        fs.renameSync(tempFile, filePath);
        console.log(`✓ Optimized SVG: ${file}`);
      }
      else if (extension === '.png' || extension === '.jpg' || extension === '.jpeg') {
        // For PNG/JPG files, we're just logging since we'd need external tools
        console.log(`Image file could be optimized with tools like ImageOptim or Sharp: ${file}`);
      }
    });
    
    console.log('Image optimization completed!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

// Run the optimization
optimizeImages();
