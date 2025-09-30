// Placeholder image generator using canvas
function generatePlaceholder(width, height, text, bgColor = '#e0e0e0', textColor = '#666') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // Draw border
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);
    
    // Add text
    ctx.fillStyle = textColor;
    ctx.font = `${Math.min(width, height) / 8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw dimensions
    ctx.fillText(text || `${width}×${height}`, width / 2, height / 2);
    
    return canvas.toDataURL('image/png');
}

// Create placeholder images for missing images
function createPlaceholderImages() {
    const placeholders = {
        // Logo
        'logo/wpg-logo.png': { width: 200, height: 80, text: 'WPG Logo' },
        
        // Hero slides
        'hero/slide-01.jpg': { width: 1920, height: 600, text: 'Hero Slide 1' },
        'hero/slide-02.jpg': { width: 1920, height: 600, text: 'Hero Slide 2' },
        'hero/slide-03.jpg': { width: 1920, height: 600, text: 'Hero Slide 3' },
        
        // Product categories
        'products/bottles-caps/category-thumbnail.jpg': { width: 400, height: 300, text: 'Bottles & Caps' },
        'products/soaps-liquids/category-thumbnail.jpg': { width: 400, height: 300, text: 'Soaps & Liquids' },
        'products/kits/category-thumbnail.jpg': { width: 400, height: 300, text: 'Amenity Kits' },
        'products/custom/category-thumbnail.jpg': { width: 400, height: 300, text: 'Custom Solutions' },
        
        // Sample product images
        'products/bottles-caps/tapa-bomba.jpg': { width: 800, height: 800, text: 'Tapa Bomba' },
        'products/soaps-liquids/shampoo-blanco.jpg': { width: 800, height: 800, text: 'Shampoo' },
        'products/kits/vanity-kit.jpg': { width: 800, height: 800, text: 'Vanity Kit' },
        
        // Team photos
        'team/sonia-weiss.jpg': { width: 300, height: 300, text: 'Team Member' },
        
        // Custom page hero
        'custom/custom-line-hero.jpg': { width: 1200, height: 400, text: 'Custom Solutions' },
        
        // Client logos samples
        'clients/sheraton.png': { width: 200, height: 100, text: 'Client Logo' },
        
        // Icons
        'icons/facebook.svg': { width: 24, height: 24, text: 'FB' },
        'icons/twitter.svg': { width: 24, height: 24, text: 'TW' },
        'icons/instagram.svg': { width: 24, height: 24, text: 'IG' }
    };
    
    return placeholders;
}

// Image fallback system
function setupImageFallbacks() {
    document.addEventListener('DOMContentLoaded', () => {
        const images = document.querySelectorAll('img');
        const placeholders = createPlaceholderImages();
        
        images.forEach(img => {
            img.addEventListener('error', function() {
                // Try to find a matching placeholder based on the src
                const src = this.getAttribute('src');
                let placeholderData = null;
                
                // Check if we have a specific placeholder for this image
                for (const [path, data] of Object.entries(placeholders)) {
                    if (src.includes(path.replace('.jpg', '').replace('.png', '').replace('.svg', ''))) {
                        placeholderData = data;
                        break;
                    }
                }
                
                // If no specific placeholder, create a generic one
                if (!placeholderData) {
                    placeholderData = { 
                        width: 400, 
                        height: 300, 
                        text: 'Image Not Found' 
                    };
                }
                
                // Generate and set the placeholder
                this.src = generatePlaceholder(
                    placeholderData.width,
                    placeholderData.height,
                    placeholderData.text
                );
                
                // Add a class to indicate this is a placeholder
                this.classList.add('placeholder-image');
                
                // Prevent infinite error loop
                this.removeEventListener('error', arguments.callee);
            });
        });
    });
}

// Initialize the fallback system
setupImageFallbacks();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generatePlaceholder, setupImageFallbacks };
}