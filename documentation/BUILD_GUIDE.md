# Build System Guide

## Overview

This project now has a modern build system using Webpack 5, enabling optimization, bundling, and development features.

## Folder Structure

```
wpg-page/
├── build/              # Temporary build files (git ignored)
│   ├── css/           # Compiled CSS during development
│   ├── js/            # Compiled JS during development
│   └── images/        # Processed images
│
├── dist/              # Production build output (git ignored)
│   ├── css/           # Minified CSS with hash
│   ├── js/            # Minified JS with hash
│   ├── images/        # Optimized images
│   ├── assets/        # Other static assets
│   ├── data/          # YAML data files
│   ├── partials/      # HTML partials
│   ├── products/      # Product pages
│   └── *.html         # Processed HTML files
│
├── public/            # Source files
│   ├── css/          # Source CSS
│   ├── js/           # Source JavaScript
│   ├── images/       # Source images
│   ├── data/         # YAML content
│   └── *.html        # HTML pages
│
├── webpack.config.js  # Webpack configuration
├── postcss.config.js  # PostCSS configuration
├── .babelrc          # Babel configuration
└── package.json      # Dependencies and scripts
```

## Installation

First, install all dependencies:

```bash
npm install
```

This will install all build tools including:
- Webpack 5 and loaders
- Babel for JS transpilation
- PostCSS for CSS processing
- Development server
- Optimization plugins

## Available Scripts

### Development Mode

```bash
npm start
# or
npm run dev
```
- Starts webpack-dev-server on http://localhost:8080
- Hot module replacement enabled
- Source maps for debugging
- No minification for faster builds

### Production Build

```bash
npm run build
```
- Creates optimized production build in `dist/` folder
- Minifies HTML, CSS, and JavaScript
- Generates hashed filenames for cache busting
- Optimizes images
- Creates source maps

### Development Build

```bash
npm run build:dev
```
- Creates development build without minification
- Useful for debugging production issues

### Preview Production Build

```bash
npm run preview
```
- Serves the production build from `dist/` folder
- Uses Python HTTP server on port 8000

### Clean Build Folders

```bash
npm run clean
```
- Removes `dist/` and `build/` folders
- Run before build to ensure clean output

### Bundle Analysis

```bash
npm run analyze
```
- Analyzes bundle size and composition
- Opens interactive treemap in browser
- Requires building first with stats

### Serve Static Files (Legacy)

```bash
npm run serve:static
```
- Serves original files from `public/` folder
- No build process, useful for comparison

## Build Features

### JavaScript Processing
- **Babel Transpilation**: Modern JS to ES5
- **Code Splitting**: Automatic vendor/common chunks
- **Tree Shaking**: Removes unused code
- **Minification**: TerserPlugin for production

### CSS Processing
- **PostCSS**: Autoprefixer for browser compatibility
- **CSS Variables**: Modern custom properties support
- **Minification**: CSSNano for production
- **Source Maps**: For debugging

### HTML Processing
- **Template Processing**: HtmlWebpackPlugin
- **Minification**: Removes comments, whitespace
- **Asset Injection**: Automatic CSS/JS links

### Asset Optimization
- **Image Optimization**: Automatic compression
- **Font Loading**: Efficient font handling
- **Copy Static Assets**: Data files, partials

### Development Features
- **Hot Reload**: Instant updates without refresh
- **Source Maps**: Debug original source code
- **Error Overlay**: Shows errors in browser
- **History Fallback**: SPA routing support

## Production Optimizations

1. **Code Splitting**
   - Vendor chunks (node_modules)
   - Common chunks (shared code)
   - Dynamic imports support

2. **Caching Strategy**
   - Content hash in filenames
   - Long-term browser caching
   - Automatic cache busting

3. **Size Optimization**
   - Minification (HTML, CSS, JS)
   - Compression ready
   - Dead code elimination
   - Image optimization

4. **Performance**
   - Lazy loading support
   - Preload/prefetch hints
   - Optimal chunk sizes

## Configuration Files

### webpack.config.js
Main build configuration with:
- Entry/output settings
- Module rules (loaders)
- Plugins configuration
- Optimization settings

### postcss.config.js
CSS processing:
- Autoprefixer for vendor prefixes
- CSSnano for minification

### .babelrc
JavaScript transpilation:
- Browser targets
- Preset configurations
- Plugin settings

## Deployment

After building for production:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Contents of dist/ folder**:
   - All files ready for deployment
   - Self-contained with hashed assets
   - No server-side processing needed

3. **Deploy to any static host**:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3
   - Traditional web server

## Troubleshooting

### Build Errors

1. **Module not found**:
   ```bash
   npm install
   ```

2. **Port already in use**:
   - Change port in webpack.config.js
   - Or kill process using port 8080

3. **Out of memory**:
   ```bash
   NODE_OPTIONS=--max_old_space_size=4096 npm run build
   ```

### Clean Install

If experiencing issues:
```bash
rm -rf node_modules package-lock.json
npm install
npm run clean
npm run build
```

## Best Practices

1. **Always test production build**:
   ```bash
   npm run build && npm run preview
   ```

2. **Check bundle size**:
   ```bash
   npm run analyze
   ```

3. **Keep dependencies updated**:
   ```bash
   npm update
   ```

4. **Use appropriate build for environment**:
   - Development: `npm start`
   - Staging: `npm run build:dev`
   - Production: `npm run build`

## Environment Variables

Create `.env` files for different environments:

```bash
# .env.development
NODE_ENV=development
API_URL=http://localhost:3000

# .env.production
NODE_ENV=production
API_URL=https://api.wpgamenities.com
```

## Next Steps

1. Install dependencies: `npm install`
2. Start development: `npm start`
3. Make changes in `public/` folder
4. Build for production: `npm run build`
5. Deploy `dist/` folder contents

## Support

For issues or questions:
- Check webpack documentation
- Review error messages carefully
- Ensure all dependencies installed
- Verify Node.js version (14+)