import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  server: {
    port: 8080,
    open: true
  },
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: 'public/index.html',
        about: 'public/about.html',
        contact: 'public/contact.html',
        products: 'public/products.html',
        customization: 'public/customization.html',
        faq: 'public/faq.html',
        login: 'public/login.html',
        'privacy-policy': 'public/privacy-policy.html',
        'terms-of-service': 'public/terms-of-service.html',
        template: 'public/template.html',
        'bottles-caps': 'public/products/bottles-caps.html',
        'soaps-liquids': 'public/products/soaps-liquids.html',
        'amenity-kits': 'public/products/amenity-kits.html',
        'miscellaneous': 'public/products/miscellaneous.html'
      }
    }
  }
});