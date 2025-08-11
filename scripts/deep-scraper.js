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

async function findAllPages(baseUrl) {
    const pages = new Set([baseUrl]);
    const visited = new Set();
    
    try {
        console.log('Discovering all pages...');
        const html = await fetchHTML(baseUrl);
        
        // Find all internal links
        const linkRegex = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>/gi;
        let match;
        
        while ((match = linkRegex.exec(html)) !== null) {
            let href = match[1];
            
            // Convert relative URLs to absolute
            if (href.startsWith('/')) {
                const baseUrlObj = new URL(baseUrl);
                href = baseUrlObj.origin + href;
            } else if (!href.startsWith('http')) {
                href = baseUrl + '/' + href;
            }
            
            // Only add URLs from same domain
            const baseUrlObj = new URL(baseUrl);
            const hrefObj = new URL(href);
            if (hrefObj.hostname === baseUrlObj.hostname && !href.includes('#') && !href.includes('mailto:')) {
                pages.add(href);
            }
        }
        
        console.log(`Found ${pages.size} pages to scan`);
        return Array.from(pages);
        
    } catch (error) {
        console.error('Error finding pages:', error);
        return [baseUrl]; // Return at least the base URL
    }
}

async function scrapeImagesFromPage(pageUrl) {
    try {
        console.log(`Scanning page: ${pageUrl}`);
        const html = await fetchHTML(pageUrl);
        
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
                const baseUrl = new URL(pageUrl);
                imgUrl = baseUrl.origin + imgUrl;
            } else if (!imgUrl.startsWith('http')) {
                imgUrl = pageUrl + '/' + imgUrl;
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
                const baseUrl = new URL(pageUrl);
                imgUrl = baseUrl.origin + imgUrl;
            } else if (!imgUrl.startsWith('http')) {
                imgUrl = pageUrl + '/' + imgUrl;
            }
            
            // Only add image files
            if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(imgUrl)) {
                imageUrls.add(imgUrl);
            }
        }
        
        return Array.from(imageUrls);
        
    } catch (error) {
        console.error(`Error scraping ${pageUrl}:`, error.message);
        return [];
    }
}

async function deepScrapeAndDownload(websiteUrl, downloadDir) {
    try {
        // Create download directory if it doesn't exist
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        // Find all pages on the website
        const pages = await findAllPages(websiteUrl);
        
        // Collect all image URLs from all pages
        const allImageUrls = new Set();
        
        for (const page of pages) {
            const pageImages = await scrapeImagesFromPage(page);
            pageImages.forEach(url => allImageUrls.add(url));
        }
        
        const uniqueUrls = Array.from(allImageUrls);
        console.log(`\nFound ${uniqueUrls.length} total unique image URLs across all pages`);
        
        // Download each image
        const downloadPromises = uniqueUrls.map(async (imageUrl, index) => {
            try {
                console.log(`Downloading ${index + 1}/${uniqueUrls.length}: ${path.basename(imageUrl)}`);
                await downloadImage(imageUrl, downloadDir);
            } catch (error) {
                console.error(`Failed to download ${imageUrl}:`, error.message);
            }
        });
        
        await Promise.all(downloadPromises);
        console.log('\n🎉 Deep scan and download completed!');
        
    } catch (error) {
        console.error('Error during deep scraping:', error);
    }
}

// Usage
const websiteUrl = 'http://amenities.wpgsoftware.nl/';
const downloadDir = path.join(__dirname, '..', 'public', 'images', 'downloaded');

deepScrapeAndDownload(websiteUrl, downloadDir)
    .then(() => console.log('Deep scraper script completed'))
    .catch(console.error);