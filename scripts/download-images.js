const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(filepath);
        
        protocol.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${path.basename(filepath)}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => {}); // Delete the file on error
            reject(err);
        });
    });
}

async function scrapeAndDownloadImages(websiteUrl, downloadDir) {
    // Create download directory if it doesn't exist
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
    }

    console.log('Launching browser...');
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--disable-features=VizDisplayCompositor']
    });
    const page = await browser.newPage();
    
    // Set a user agent to avoid being blocked
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Disable images to speed up loading and avoid blocking
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() === 'image') {
            req.abort();
        } else {
            req.continue();
        }
    });
    
    try {
        console.log(`Navigating to ${websiteUrl}...`);
        await page.goto(websiteUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        
        console.log('Extracting image URLs...');
        const imageUrls = await page.evaluate(() => {
            const images = [];
            
            // Get all img tags
            const imgTags = document.querySelectorAll('img');
            imgTags.forEach(img => {
                if (img.src && img.src.startsWith('http')) {
                    images.push(img.src);
                }
            });
            
            // Get background images from CSS
            const allElements = document.querySelectorAll('*');
            allElements.forEach(el => {
                const style = window.getComputedStyle(el);
                const bgImage = style.backgroundImage;
                if (bgImage && bgImage !== 'none') {
                    const matches = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
                    if (matches && matches[1] && matches[1].startsWith('http')) {
                        images.push(matches[1]);
                    }
                }
            });
            
            return [...new Set(images)]; // Remove duplicates
        });
        
        console.log(`Found ${imageUrls.length} unique images`);
        
        // Download each image
        for (let i = 0; i < imageUrls.length; i++) {
            const imageUrl = imageUrls[i];
            try {
                const urlObj = new URL(imageUrl);
                const filename = path.basename(urlObj.pathname) || `image_${i}.jpg`;
                const filepath = path.join(downloadDir, filename);
                
                console.log(`Downloading ${i + 1}/${imageUrls.length}: ${filename}`);
                await downloadImage(imageUrl, filepath);
            } catch (error) {
                console.error(`Failed to download ${imageUrl}:`, error.message);
            }
        }
        
        console.log('Download completed!');
        
    } catch (error) {
        console.error('Error during scraping:', error);
    } finally {
        await browser.close();
    }
}

// Usage
const websiteUrl = 'http://amenities.wpgsoftware.nl/';
const downloadDir = path.join(__dirname, '..', 'public', 'images', 'downloaded');

scrapeAndDownloadImages(websiteUrl, downloadDir)
    .then(() => console.log('Script completed'))
    .catch(console.error);