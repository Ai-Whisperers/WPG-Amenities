#!/usr/bin/env node

const PageScreenshotter = require('./screenshot-pages');

// Demo configuration for just a few pages
const demoConfig = {
  baseUrl: 'http://localhost:8080',
  outputDir: './demo-screenshots',
  viewports: {
    desktop: { width: 1920, height: 1080 }
  },
  pages: [
    { name: 'home', url: '/index.html', title: 'Homepage' },
    { name: 'products', url: '/products.html', title: 'Products' },
    { name: 'customization', url: '/customization.html', title: 'Customization' }
  ],
  options: {
    fullPage: true,
    quality: 90,
    type: 'png'
  }
};

async function demo() {
  console.log('🎬 Running Screenshot Tool Demo');
  console.log('📸 Taking screenshots of 3 pages (desktop only)');
  
  // Override the config temporarily
  const originalConfig = require('./screenshot-pages.js');
  Object.assign(originalConfig, demoConfig);
  
  const screenshotter = new PageScreenshotter();
  
  try {
    await screenshotter.run();
    console.log('\n🎉 Demo completed! Check ./demo-screenshots/ folder');
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  }
}

if (require.main === module) {
  demo();
}

module.exports = demo;