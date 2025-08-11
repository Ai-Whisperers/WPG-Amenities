const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

async function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        protocol.get(url, (response) => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function downloadImage(imageUrl, downloadDir) {
    return new Promise((resolve, reject) => {
        try {
            const urlObj = new URL(imageUrl);
            const filename = path.basename(urlObj.pathname) || `image_${Date.now()}.jpg`;
            const filepath = path.join(downloadDir, filename);
            
            // Skip if file already exists
            if (fs.existsSync(filepath)) {
                console.log(`Skipping existing file: ${filename}`);
                resolve(filename);
                return;
            }
            
            const protocol = imageUrl.startsWith('https') ? https : http;
            const file = fs.createWriteStream(filepath);
            
            protocol.get(imageUrl, (response) => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`Downloaded: ${filename}`);
                    resolve(filename);
                });
            }).on('error', (err) => {
                fs.unlink(filepath, () => {}); // Delete the file on error
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function scrapeAndDownloadImages(websiteUrl, downloadDir) {
    try {
        // Create download directory if it doesn't exist
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        console.log(`Fetching HTML from ${websiteUrl}...`);
        const html = await fetchHTML(websiteUrl);
        
        console.log('Extracting image URLs...');
        const imageUrls = new Set();
        
        // Simple regex to find image URLs
        const imgRegex = /<img[^>]+src\s*=\s*["']([^"']+)["'][^>]*>/gi;
        const cssRegex = /background-image\s*:\s*url\(["']?([^"')]+)["']?\)/gi;
        
        let match;
        
        // Extract img src URLs
        while ((match = imgRegex.exec(html)) !== null) {
            let imgUrl = match[1];
            
            // Convert relative URLs to absolute
            if (imgUrl.startsWith('/')) {
                const baseUrl = new URL(websiteUrl);
                imgUrl = baseUrl.origin + imgUrl;
            } else if (!imgUrl.startsWith('http')) {
                imgUrl = websiteUrl + '/' + imgUrl;
            }
            
            // Only add image files
            if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(imgUrl)) {
                imageUrls.add(imgUrl);
            }
        }
        
        // Extract CSS background images
        while ((match = cssRegex.exec(html)) !== null) {
            let imgUrl = match[1];
            
            // Convert relative URLs to absolute
            if (imgUrl.startsWith('/')) {
                const baseUrl = new URL(websiteUrl);
                imgUrl = baseUrl.origin + imgUrl;
            } else if (!imgUrl.startsWith('http')) {
                imgUrl = websiteUrl + '/' + imgUrl;
            }
            
            // Only add image files
            if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(imgUrl)) {
                imageUrls.add(imgUrl);
            }
        }
        
        const uniqueUrls = Array.from(imageUrls);
        console.log(`Found ${uniqueUrls.length} unique image URLs`);
        
        // Download each image
        const downloadPromises = uniqueUrls.map(async (imageUrl, index) => {
            try {
                console.log(`Downloading ${index + 1}/${uniqueUrls.length}: ${imageUrl}`);
                await downloadImage(imageUrl, downloadDir);
            } catch (error) {
                console.error(`Failed to download ${imageUrl}:`, error.message);
            }
        });
        
        await Promise.all(downloadPromises);
        console.log('Download completed!');
        
    } catch (error) {
        console.error('Error during scraping:', error);
    }
}

// Usage
const websiteUrl = 'http://amenities.wpgsoftware.nl/';
const downloadDir = path.join(__dirname, '..', 'public', 'images', 'downloaded');

scrapeAndDownloadImages(websiteUrl, downloadDir)
    .then(() => console.log('Script completed'))
    .catch(console.error);