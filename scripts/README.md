# 📸 WPG Amenities Page Screenshot Tool

A powerful Node.js tool for automatically taking screenshots of all website pages across different device viewports using Playwright.

## Features

- 🖥️ **Multi-viewport**: Desktop, tablet, and mobile screenshots
- 📱 **Responsive**: Automatically adjusts for different screen sizes
- 🎯 **Comprehensive**: Screenshots all pages including product categories
- 📊 **Reporting**: Generates detailed HTML report with visual gallery
- ⚡ **Fast**: Optimized for performance with resource blocking
- 🛡️ **Robust**: Error handling and retry logic
- 🎨 **Configurable**: Customizable settings and options

## Prerequisites

Make sure you have the required dependencies installed:

```bash
npm install
```

This will install Playwright and other necessary packages.

## Quick Start

1. **Start your development server:**
   ```bash
   npm run start
   ```

2. **Take screenshots of all pages:**
   ```bash
   npm run screenshot
   ```

3. **View results:**
   - Screenshots saved to `./screenshots/` directory
   - Open `./screenshots/screenshot-report.html` in your browser

## Usage Options

### NPM Scripts

```bash
# All viewports (desktop, tablet, mobile)
npm run screenshot

# Desktop only
npm run screenshot:desktop

# Mobile only  
npm run screenshot:mobile

# Tablet only
npm run screenshot:tablet
```

### Direct Node.js Usage

```bash
# Basic usage
node scripts/screenshot-pages.js

# Custom URL
node scripts/screenshot-pages.js --url http://localhost:3000

# Custom output directory
node scripts/screenshot-pages.js --output ./my-screenshots

# JPEG format instead of PNG
node scripts/screenshot-pages.js --format jpeg

# Desktop screenshots only
node scripts/screenshot-pages.js --desktop-only

# Help
node scripts/screenshot-pages.js --help
```

## Configuration

### Default Settings

The tool comes pre-configured for the WPG Amenities website:

```javascript
const config = {
  baseUrl: 'http://localhost:8080',
  outputDir: './screenshots',
  viewports: {
    desktop: { width: 1920, height: 1080 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 667 }
  },
  options: {
    fullPage: true,
    quality: 90,
    type: 'png'
  }
};
```

### Covered Pages

The tool automatically screenshots all website pages:

- **Main Pages**: Home, Products, Customization, Portfolio, About, Contact, FAQ
- **Product Categories**: Amenity Kits, Bottles & Caps, Soaps & Liquids, Accessories & Extras  
- **Legal Pages**: Privacy Policy, Terms of Service

### Output Structure

```
screenshots/
├── home_desktop.png
├── home_tablet.png
├── home_mobile.png
├── products_desktop.png
├── products_tablet.png
├── products_mobile.png
├── ...
└── screenshot-report.html
```

## HTML Report

The tool generates a comprehensive HTML report that includes:

- 📊 **Summary Statistics**: Success/failure counts and rates
- 🖼️ **Visual Gallery**: Thumbnail previews of all screenshots
- ❌ **Error Details**: Information about any failed screenshots
- 🕒 **Timestamp**: When the report was generated

## Troubleshooting

### Common Issues

**Server not running:**
```bash
# Make sure your development server is running
npm run start
# Then run screenshots in another terminal
npm run screenshot
```

**Permission errors:**
```bash
# On Windows, run as administrator if needed
# On macOS/Linux, check file permissions
chmod +x scripts/screenshot-pages.js
```

**Playwright browser not installed:**
```bash
# Install Playwright browsers
npx playwright install
```

**Page load timeouts:**
- Increase timeout in the script configuration
- Check that all pages load correctly in your browser first
- Ensure all JavaScript and CSS resources are available

### Advanced Configuration

To modify the tool behavior, edit `scripts/screenshot-pages.js`:

```javascript
// Add custom viewports
config.viewports.ultrawide = { width: 2560, height: 1440 };

// Add custom pages
config.pages.push({
  name: 'custom-page',
  url: '/custom-page.html', 
  title: 'Custom Page'
});

// Modify screenshot options
config.options.quality = 100; // For JPEG quality
config.options.fullPage = false; // For viewport-only screenshots
```

## Performance Tips

1. **Use specific viewports**: Use `--desktop-only` for faster single-viewport screenshots
2. **JPEG format**: Use `--format jpeg` for smaller file sizes
3. **Custom output**: Use `--output` to save to SSD for faster I/O
4. **Server optimization**: Use a fast local server (http-server is recommended)

## Integration

### CI/CD Integration

Add to your CI/CD pipeline:

```yaml
# GitHub Actions example
- name: Take Screenshots
  run: |
    npm run start &
    sleep 5  # Wait for server to start
    npm run screenshot
    
- name: Upload Screenshots
  uses: actions/upload-artifact@v3
  with:
    name: screenshots
    path: screenshots/
```

### Development Workflow

```bash
# 1. Make changes to your website
# 2. Start the server
npm run start

# 3. Take screenshots (in another terminal)
npm run screenshot

# 4. Review changes in the HTML report
open screenshots/screenshot-report.html
```

## License

This tool is part of the WPG Amenities website project.