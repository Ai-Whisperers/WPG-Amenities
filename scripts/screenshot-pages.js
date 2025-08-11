#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  baseUrl: 'http://localhost:8080',
  outputDir: './screenshots',
  viewports: {
    desktop: { width: 1920, height: 1080 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 667 }
  },
  pages: [
    { name: 'home', url: '/index.html', title: 'Homepage' },
    { name: 'products', url: '/products.html', title: 'Products' },
    { name: 'customization', url: '/customization.html', title: 'Customization' },
    { name: 'portfolio', url: '/portfolio.html', title: 'Portfolio' },
    { name: 'about', url: '/about.html', title: 'About Us' },
    { name: 'faq', url: '/faq.html', title: 'FAQ' },
    { name: 'amenity-kits', url: '/products/amenity-kits.html', title: 'Amenity Kits' },
    { name: 'bottles-caps', url: '/products/bottles-caps.html', title: 'Bottles & Caps' },
    { name: 'soaps-liquids', url: '/products/soaps-liquids.html', title: 'Soaps & Liquids' },
    { name: 'accessories-extras', url: '/products/accessories-extras.html', title: 'Accessories & Extras' },
    { name: 'privacy-policy', url: '/privacy-policy.html', title: 'Privacy Policy' },
    { name: 'terms-of-service', url: '/terms-of-service.html', title: 'Terms of Service' }
  ],
  options: {
    fullPage: true,
    quality: 90,
    type: 'png'
  }
};

class PageScreenshotter {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async initialize() {
    console.log('🚀 Initializing screenshot tool...');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${config.outputDir}`);
    }

    // Launch browser
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    console.log('✅ Browser launched successfully');
  }

  async createContext(viewport) {
    if (this.context) {
      await this.context.close();
    }

    this.context = await this.browser.newContext({
      viewport,
      deviceScaleFactor: 1,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    this.page = await this.context.newPage();
    
    // Set longer timeout for page loads
    this.page.setDefaultTimeout(30000);
    
    // Block unnecessary resources for faster loading
    await this.page.route('**/*', (route) => {
      const resourceType = route.request().resourceType();
      if (['font', 'stylesheet'].includes(resourceType)) {
        route.continue();
      } else if (['image', 'media'].includes(resourceType)) {
        // Allow images but with timeout
        route.continue();
      } else {
        route.continue();
      }
    });
  }

  async takeScreenshot(pageInfo, viewportName, viewport) {
    const url = `${config.baseUrl}${pageInfo.url}`;
    const filename = `${pageInfo.name}_${viewportName}.${config.options.type}`;
    const filepath = path.join(config.outputDir, filename);

    try {
      console.log(`📸 Taking screenshot: ${pageInfo.title} (${viewportName})`);
      
      // Navigate to page
      await this.page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      // Wait for content to load
      await this.page.waitForLoadState('domcontentloaded');
      
      // Wait for JavaScript to execute
      await this.page.waitForTimeout(2000);

      // Wait for main content to be visible
      try {
        await this.page.waitForSelector('main', { timeout: 5000 });
      } catch (e) {
        console.log(`⚠️  Main content not found for ${pageInfo.name}, proceeding anyway`);
      }

      // Take screenshot
      await this.page.screenshot({
        path: filepath,
        fullPage: config.options.fullPage,
        quality: config.options.type === 'jpeg' ? config.options.quality : undefined,
        type: config.options.type
      });

      console.log(`✅ Screenshot saved: ${filename}`);
      return { success: true, filename, url };

    } catch (error) {
      console.error(`❌ Failed to screenshot ${pageInfo.name} (${viewportName}):`, error.message);
      return { success: false, filename, url, error: error.message };
    }
  }

  async screenshotAllPages() {
    const results = {
      success: [],
      failed: [],
      total: 0,
      successCount: 0,
      failedCount: 0
    };

    for (const [viewportName, viewport] of Object.entries(config.viewports)) {
      console.log(`\n🖥️  Processing viewport: ${viewportName} (${viewport.width}x${viewport.height})`);
      
      await this.createContext(viewport);

      for (const pageInfo of config.pages) {
        const result = await this.takeScreenshot(pageInfo, viewportName, viewport);
        results.total++;
        
        if (result.success) {
          results.success.push(result);
          results.successCount++;
        } else {
          results.failed.push(result);
          results.failedCount++;
        }
      }
    }

    return results;
  }

  async generateReport(results) {
    const reportPath = path.join(config.outputDir, 'screenshot-report.html');
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Screenshot Report - WPG Amenities</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #007acc;
            padding-bottom: 10px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #007acc;
        }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #007acc;
        }
        .screenshots-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .screenshot-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            background: white;
        }
        .screenshot-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            object-position: top;
        }
        .screenshot-info {
            padding: 15px;
        }
        .screenshot-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        .screenshot-meta {
            color: #666;
            font-size: 0.9em;
        }
        .failed {
            border-left-color: #dc3545;
        }
        .failed .stat-number {
            color: #dc3545;
        }
        .error-message {
            color: #dc3545;
            font-size: 0.85em;
            background: #f8d7da;
            padding: 8px;
            border-radius: 4px;
            margin-top: 8px;
        }
        .timestamp {
            text-align: center;
            color: #666;
            margin-top: 20px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📸 Screenshot Report - WPG Amenities</h1>
        
        <div class="summary">
            <div class="stat-card">
                <div class="stat-number">${results.total}</div>
                <div>Total Screenshots</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${results.successCount}</div>
                <div>Successful</div>
            </div>
            <div class="stat-card failed">
                <div class="stat-number">${results.failedCount}</div>
                <div>Failed</div>
            </div>
        </div>

        <h2>✅ Successful Screenshots</h2>
        <div class="screenshots-grid">
            ${results.success.map(item => `
                <div class="screenshot-card">
                    <img src="./${item.filename}" alt="Screenshot of ${item.filename}" loading="lazy">
                    <div class="screenshot-info">
                        <div class="screenshot-title">${item.filename}</div>
                        <div class="screenshot-meta">${item.url}</div>
                    </div>
                </div>
            `).join('')}
        </div>

        ${results.failed.length > 0 ? `
        <h2>❌ Failed Screenshots</h2>
        <div class="screenshots-grid">
            ${results.failed.map(item => `
                <div class="screenshot-card">
                    <div class="screenshot-info">
                        <div class="screenshot-title">${item.filename}</div>
                        <div class="screenshot-meta">${item.url}</div>
                        <div class="error-message">${item.error}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="timestamp">
            Generated on ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>
    `;

    fs.writeFileSync(reportPath, html);
    console.log(`📊 Report generated: ${reportPath}`);
  }

  async cleanup() {
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
    console.log('🧹 Browser closed');
  }

  async run() {
    try {
      await this.initialize();
      
      console.log(`\n🎯 Taking screenshots of ${config.pages.length} pages across ${Object.keys(config.viewports).length} viewports`);
      console.log(`📁 Output directory: ${path.resolve(config.outputDir)}`);
      
      const results = await this.screenshotAllPages();
      
      console.log('\n📊 Screenshot Summary:');
      console.log(`✅ Successful: ${results.successCount}`);
      console.log(`❌ Failed: ${results.failedCount}`);
      console.log(`📈 Success Rate: ${((results.successCount / results.total) * 100).toFixed(1)}%`);

      // Generate HTML report
      await this.generateReport(results);

      return results;

    } catch (error) {
      console.error('💥 Fatal error:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📸 WPG Amenities Page Screenshot Tool

Usage:
  node screenshot-pages.js [options]

Options:
  --help, -h          Show this help message
  --url <url>         Base URL (default: http://localhost:8080)
  --output <dir>      Output directory (default: ./screenshots)
  --format <format>   Image format: png|jpeg (default: png)
  --desktop-only      Only take desktop screenshots
  --mobile-only       Only take mobile screenshots
  --tablet-only       Only take tablet screenshots

Examples:
  node screenshot-pages.js
  node screenshot-pages.js --url http://localhost:3000
  node screenshot-pages.js --output ./images --format jpeg
  node screenshot-pages.js --desktop-only
    `);
    return;
  }

  // Parse command line arguments
  if (args.includes('--url')) {
    const urlIndex = args.indexOf('--url');
    config.baseUrl = args[urlIndex + 1];
  }

  if (args.includes('--output')) {
    const outputIndex = args.indexOf('--output');
    config.outputDir = args[outputIndex + 1];
  }

  if (args.includes('--format')) {
    const formatIndex = args.indexOf('--format');
    config.options.type = args[formatIndex + 1];
  }

  // Filter viewports based on flags
  if (args.includes('--desktop-only')) {
    config.viewports = { desktop: config.viewports.desktop };
  } else if (args.includes('--mobile-only')) {
    config.viewports = { mobile: config.viewports.mobile };
  } else if (args.includes('--tablet-only')) {
    config.viewports = { tablet: config.viewports.tablet };
  }

  const screenshotter = new PageScreenshotter();
  
  try {
    const results = await screenshotter.run();
    
    if (results.failedCount > 0) {
      console.log('\n⚠️  Some screenshots failed. Check the report for details.');
      process.exit(1);
    } else {
      console.log('\n🎉 All screenshots completed successfully!');
      process.exit(0);
    }
  } catch (error) {
    console.error('💥 Screenshot tool failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = PageScreenshotter;