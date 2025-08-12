const fs = require('fs');
const path = require('path');

function createDirectoryIfNotExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
}

function moveFile(source, destination) {
    try {
        fs.renameSync(source, destination);
        console.log(`Moved: ${path.basename(source)} -> ${path.dirname(destination)}`);
    } catch (error) {
        console.error(`Error moving ${source}:`, error.message);
    }
}

function organizeImages(sourceDir, baseDir) {
    const files = fs.readdirSync(sourceDir);
    
    // Define categories and their patterns
    const categories = {
        'client-logos': (filename) => {
            const hotelPatterns = [
                'hotel', 'suites', 'resort', 'plaza', 'casino', 'boutique', 
                'palace', 'crowne', 'sheraton', 'excelsior', 'grappa',
                'mision', 'lomas', 'margaritas', 'milord', 'moustier',
                'olimpo', 'pantanal', 'papillon', 'paseo', 'quinta',
                'trinidad', 'villamorra', 'westfalenhaus', 'altaer',
                'altagracia', 'altooeste', 'andares', 'casablanca',
                'cecilia', 'club', 'concepcion', 'faro', 'granados',
                'granhotel', 'hassler', 'luxsur', 'tacuru'
            ];
            return hotelPatterns.some(pattern => filename.toLowerCase().includes(pattern));
        },
        
        'products/bottles-caps': (filename) => {
            return filename.includes('botellas') || filename.includes('tapas');
        },
        
        'products/soaps': (filename) => {
            return filename.includes('jabon') || filename.includes('jabones');
        },
        
        'products/kits': (filename) => {
            return filename.includes('kits_');
        },
        
        'products/liquids': (filename) => {
            return filename.includes('liquidos');
        },
        
        'products/packaging': (filename) => {
            return filename.includes('cajas') || filename.includes('envoltorios') || 
                   filename.includes('stickers') || filename.includes('logos');
        },
        
        'products/services': (filename) => {
            return filename.includes('disenocreacion');
        },
        
        'hero-slides': (filename) => {
            return filename.startsWith('inicio') && filename.includes('.png');
        },
        
        'layout/header': (filename) => {
            return filename.toLowerCase().includes('header');
        },
        
        'layout/footer': (filename) => {
            return filename.includes('bottom');
        },
        
        'layout/navigation': (filename) => {
            return filename.includes('arrow') || filename.includes('menu');
        }
    };
    
    // Create all necessary directories
    Object.keys(categories).forEach(category => {
        createDirectoryIfNotExists(path.join(baseDir, category));
    });
    
    // Process each file
    files.forEach(filename => {
        const sourcePath = path.join(sourceDir, filename);
        const stats = fs.statSync(sourcePath);
        
        // Skip directories
        if (stats.isDirectory()) return;
        
        // Skip non-image files
        if (!/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(filename)) return;
        
        let moved = false;
        
        // Check each category
        for (const [category, matcher] of Object.entries(categories)) {
            if (matcher(filename)) {
                const destinationPath = path.join(baseDir, category, filename);
                moveFile(sourcePath, destinationPath);
                moved = true;
                break;
            }
        }
        
        // If no category matched, move to 'misc'
        if (!moved) {
            createDirectoryIfNotExists(path.join(baseDir, 'misc'));
            const destinationPath = path.join(baseDir, 'misc', filename);
            moveFile(sourcePath, destinationPath);
        }
    });
}

// Main execution
const downloadedDir = path.join(__dirname, '..', 'public', 'images', 'downloaded');
const imagesDir = path.join(__dirname, '..', 'public', 'images');

console.log('🗂️  Starting image organization...\n');

// Organize downloaded images
console.log('📁 Organizing downloaded images...');
organizeImages(downloadedDir, imagesDir);

// Also organize any loose images in the main images directory
console.log('\n📁 Organizing main images directory...');
organizeImages(imagesDir, imagesDir);

console.log('\n✅ Image organization completed!');
console.log('\n📊 Final directory structure:');

function showDirectoryStructure(dir, level = 0) {
    try {
        const items = fs.readdirSync(dir).sort();
        items.forEach(item => {
            const itemPath = path.join(dir, item);
            const stats = fs.statSync(itemPath);
            const indent = '  '.repeat(level);
            
            if (stats.isDirectory()) {
                console.log(`${indent}📁 ${item}/`);
                if (level < 2) { // Limit depth to avoid too much output
                    showDirectoryStructure(itemPath, level + 1);
                }
            } else if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(item)) {
                console.log(`${indent}🖼️  ${item}`);
            }
        });
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error.message);
    }
}

showDirectoryStructure(imagesDir);