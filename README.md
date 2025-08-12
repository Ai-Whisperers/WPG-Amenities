# AI-Whisperers Company Website

Official website for AI-Whisperers organization, showcasing our AI solutions and business services.

## 🌐 Live Website
- **Production**: https://ai-whisperers.com (Coming Soon)
- **Staging**: https://company-website-staging.vercel.app (Coming Soon)

## 🚀 Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript with Vite
- **Build Tool**: Vite 7.0
- **Testing**: Playwright for E2E testing  
- **Deployment**: Vercel/Netlify
- **Domain**: Custom domain ready

## 📁 Project Structure

```
company-website/
├── public/                 # Static website files
│   ├── index.html         # Homepage
│   ├── about.html         # About page
│   ├── contact.html       # Contact page
│   ├── products.html      # Products/services
│   ├── portfolio.html     # Portfolio showcase
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   ├── images/           # Images and assets
│   └── data/             # Content data files
├── scripts/              # Build and utility scripts
├── tests/               # Playwright tests
└── vite.config.js       # Vite configuration
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
# Website available at http://localhost:5173
```

3. **Build for production**:
```bash
npm run build
```

4. **Preview production build**:
```bash
npm run preview
```

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start Vite dev server
npm run build        # Build for production  
npm run preview      # Preview production build
npm start           # Serve with http-server

# Testing
npm run screenshot   # Take screenshots of all pages
npm run screenshot:desktop # Desktop screenshots only
npm run screenshot:mobile  # Mobile screenshots only  
npm run screenshot:tablet  # Tablet screenshots only

# Deployment
npm run deploy       # Build and prepare for deployment
```

## 🎨 Website Sections

### Pages
- **Homepage** (`index.html`) - Main landing page
- **About** (`about.html`) - Company information and team
- **Products** (`products.html`) - AI solutions and services
- **Portfolio** (`portfolio.html`) - Case studies and projects
- **Contact** (`contact.html`) - Contact information and forms
- **FAQ** (`faq.html`) - Frequently asked questions

### Key Features
- **Responsive Design** - Mobile-first approach
- **Modern UI/UX** - Clean, professional design
- **SEO Optimized** - Meta tags and structured data
- **Performance Optimized** - Fast loading times
- **Cross-browser Compatible** - Works on all modern browsers

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Set up custom domain: `ai-whisperers.com`

### Netlify Alternative
1. Connect GitHub repository
2. Build settings:
   - **Build Command**: `npm run build`  
   - **Publish Directory**: `dist`
3. Configure custom domain

### GitHub Pages
```bash
# Build and deploy to gh-pages branch
npm run build
# Push dist/ contents to gh-pages branch
```

## 🔧 Configuration

### Environment Variables
- `VITE_API_URL` - Backend API URL (if needed)
- `VITE_CONTACT_EMAIL` - Contact form email
- `VITE_GA_ID` - Google Analytics ID

### Domain Setup
- Update CNAME file for custom domain
- Configure DNS records:
  - A record: Point to hosting provider IP
  - CNAME record: www → ai-whisperers.com

## 📊 Analytics & SEO

### Google Analytics
- Set up GA4 tracking
- Configure conversion goals
- Monitor user behavior

### SEO Checklist
- ✅ Meta tags and descriptions
- ✅ Open Graph tags for social media
- ✅ Structured data markup
- ✅ XML sitemap
- ✅ Robots.txt file
- ✅ Page speed optimization

## 🧪 Testing

### Playwright Tests
```bash
# Run all tests
npx playwright test

# Run specific test
npx playwright test tests/homepage.spec.js

# Run in headed mode
npx playwright test --headed
```

### Manual Testing Checklist
- [ ] All pages load correctly
- [ ] Contact forms work
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility
- [ ] Performance metrics

## 🔄 Content Management

### Updating Content
- Edit HTML files directly in `public/` directory
- Update content data in `public/data/content.yml`
- Add new images to `public/images/`

### Adding New Pages
1. Create new HTML file in `public/`
2. Follow existing template structure
3. Add navigation links
4. Update sitemap

## 📱 Mobile Optimization

- Responsive breakpoints: 320px, 768px, 1024px, 1200px
- Touch-friendly navigation
- Optimized images for mobile
- Fast loading on mobile networks

## 🔒 Security

- HTTPS enforced
- Content Security Policy headers
- No sensitive data in client-side code
- Regular dependency updates

## 📈 Performance

### Optimization Techniques
- Image compression and WebP format
- CSS and JS minification
- Lazy loading for images
- Service worker for caching
- CDN for static assets

### Performance Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'feat: add new feature'`
6. Push: `git push origin feature/new-feature`
7. Create a Pull Request

## 📞 Support

- **Email**: business@ai-whisperers.com
- **Issues**: [GitHub Issues](https://github.com/Ai-Whisperers/company-website/issues)
- **Discussions**: [GitHub Discussions](https://github.com/orgs/Ai-Whisperers/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the AI-Whisperers team**