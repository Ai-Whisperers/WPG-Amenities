// main.js - Core script for content loading and templating

document.addEventListener('DOMContentLoaded', () => {
  loadContent();
});

async function loadContent() {
  try {
    const response = await fetch('/data/content.yml');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const yamlText = await response.text();
    const data = jsyaml.load(yamlText);

    // Make data globally accessible for templating
    window.siteData = data;

    // Populate common elements like header and footer
    populateHeader();
    populateFooter();

    // Populate page-specific content
    populatePageContent();

  } catch (error) {
    console.error('Error loading or parsing YAML file:', error);
    document.body.innerHTML = '<h1>Error: Could not load website content.</h1><p>Please check the console for details.</p>';
  }
}

function populateHeader() {
  const header = document.querySelector('header');
  if (header && window.siteData) {
    const navLinks = window.siteData.site.navigation.map(link => `
      <li><a href="${link.url}">${link.text}</a></li>
    `).join('');
    
    header.innerHTML = `
      <div class="container">
        <div class="logo">
          <a href="/index.html">${window.siteData.site.title}</a>
        </div>
        <nav>
          <ul>
            ${navLinks}
          </ul>
        </nav>
      </div>
    `;
  }
}

function populateFooter() {
  const footer = document.querySelector('footer');
  if (footer && window.siteData) {
    const socialLinks = window.siteData.site.footer.social_links.map(link => `
      <a href="${link.url}" target="_blank" aria-label="${link.name}">
        <img src="${link.icon}" alt="${link.name} icon" />
      </a>
    `).join('');

    const utilityLinks = window.siteData.site.footer.utility_links.map(link => `
      <a href="${link.url}">${link.text}</a>
    `).join(' | ');

    footer.innerHTML = `
      <div class="container">
        <div class="social-links">
          ${socialLinks}
        </div>
        <div class="footer-info">
          <p>${window.siteData.site.footer.copyright}</p>
          <p>${window.siteData.site.footer.address}</p>
        </div>
        <div class="utility-links">
          ${utilityLinks}
        </div>
      </div>
    `;
  }
}

function populatePageContent() {
  // This function will be expanded upon for each page
  // It checks the body's ID to know which page's content to load.
  const pageId = document.body.id;
  if (!pageId || !window.siteData) return;

  const pageData = window.siteData.pages[pageId];
  if (!pageData) {
    console.warn(`No content found for page with ID: ${pageId}`);
    return;
  }
  
  // Example for homepage hero
  if (pageId === 'home') {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.style.backgroundImage = `url(${pageData.hero.image})`;
      heroSection.innerHTML = `
        <div class="container">
          <h1>${pageData.hero.title}</h1>
          <p>${pageData.hero.tagline}</p>
          <a href="${pageData.hero.cta_primary.url}" class="button button-primary">${pageData.hero.cta_primary.text}</a>
          <a href="${pageData.hero.cta_secondary.url}" class="button">${pageData.hero.cta_secondary.text}</a>
        </div>
      `;
    }
  }
} 