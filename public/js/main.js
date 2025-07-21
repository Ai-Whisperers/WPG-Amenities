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
  
  if (pageId === 'home') {
    // Populate Hero
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

    // Create and Populate other sections
    const main = document.querySelector('main');
    if (main) {
      // Value Proposition
      const valuePropSection = document.createElement('section');
      valuePropSection.className = 'value-prop container';
      valuePropSection.innerHTML = `
        <h2>${pageData.value_prop.title}</h2>
        <p>${pageData.value_prop.text}</p>
      `;
      main.appendChild(valuePropSection);

      // Featured Products
      const featuredProductsSection = document.createElement('section');
      featuredProductsSection.className = 'featured-products';
      const categoriesHTML = pageData.featured_products.categories.map(cat => `
        <div class="category-card">
          <img src="${cat.image}" alt="${cat.alt}">
          <h3>${cat.name}</h3>
          <a href="${cat.url}" class="button">Explore</a>
        </div>
      `).join('');
      featuredProductsSection.innerHTML = `
        <div class="container">
          <h2>${pageData.featured_products.title}</h2>
          <div class="categories-grid">
            ${categoriesHTML}
          </div>
        </div>
      `;
      main.appendChild(featuredProductsSection);

      // Social Proof
      const socialProofSection = document.createElement('section');
      socialProofSection.className = 'social-proof container';
      const logosHTML = pageData.social_proof.client_logos.map(client => `
        <img src="${client.logo}" alt="${client.alt}">
      `).join('');
      socialProofSection.innerHTML = `
        <h2>${pageData.social_proof.title}</h2>
        <div class="logos-carousel">
          ${logosHTML}
        </div>
      `;
      main.appendChild(socialProofSection);
    }
  }
  
  if (pageId === 'products') {
    const main = document.querySelector('main');
    if (main) {
      const pageTitle = document.createElement('h1');
      pageTitle.className = 'container';
      pageTitle.textContent = pageData.title;
      main.appendChild(pageTitle);

      const intro = document.createElement('p');
      intro.className = 'container';
      intro.textContent = pageData.intro;
      main.appendChild(intro);

      pageData.categories.forEach(category => {
        const section = document.createElement('section');
        section.id = category.id;
        section.className = 'product-category container';

        const itemsHTML = category.items.map(item => `
          <div class="product-card">
            <img src="${item.image}" alt="${item.name}">
            <h4>${item.name}</h4>
          </div>
        `).join('');

        section.innerHTML = `
          <h2>${category.name}</h2>
          <p>${category.description}</p>
          <div class="product-grid">
            ${itemsHTML}
          </div>
        `;
        main.appendChild(section);
      });
    }
  }

  if (pageId === 'customization') {
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = `
        <div class="container">
          <h1>${pageData.title}</h1>
          <p>${pageData.intro}</p>

          <section class="services-grid">
            ${pageData.services.map(service => `
              <div class="service-card">
                <img src="${service.icon}" alt="" class="service-icon">
                <h3>${service.title}</h3>
                <p>${service.text}</p>
              </div>
            `).join('')}
          </section>

          <section class="process">
            <h2>${pageData.process.title}</h2>
            <div class="process-steps">
              ${pageData.process.steps.map(step => `
                <div class="step">
                  <h4>${step.title}</h4>
                  <p>${step.text}</p>
                </div>
              `).join('')}
            </div>
          </section>

          <section class="cta">
            <a href="${pageData.cta.url}" class="button button-primary">${pageData.cta.text}</a>
          </section>
        </div>
      `;
    }
  }

  if (pageId === 'portfolio') {
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = `
        <div class="container">
          <h1>${pageData.title}</h1>
          <p>${pageData.intro}</p>
          <div class="portfolio-grid">
            ${pageData.projects.map(project => `
              <div class="project-card">
                <img src="${project.image}" alt="${project.title}">
                <div class="project-card-content">
                  <h3>${project.title}</h3>
                  <p>${project.challenge}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  if (pageId === 'about') {
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = `
        <div class="container">
          <h1>${pageData.title}</h1>
          
          <section class="about-section">
            <h2>${pageData.our_story.title}</h2>
            <p>${pageData.our_story.text}</p>
          </section>

          <section class="about-section">
            <h2>${pageData.our_mission.title}</h2>
            <p>${pageData.our_mission.text}</p>
          </section>

          <section class="team">
            <h2>${pageData.team.title}</h2>
            <div class="team-grid">
              ${pageData.team.members.map(member => `
                <div class="team-member">
                  <img src="${member.image}" alt="${member.name}">
                  <h3>${member.name}</h3>
                  <p class="role">${member.role}</p>
                  <p>${member.bio}</p>
                </div>
              `).join('')}
            </div>
          </section>

          <section class="about-section">
            <h2>${pageData.sustainability.title}</h2>
            <p>${pageData.sustainability.text}</p>
          </section>
        </div>
      `;
    }
  }

  if (pageId === 'contact') {
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = `
        <div class="container contact-layout">
          <div class="contact-info">
            <h1>${pageData.title}</h1>
            <p>${pageData.intro}</p>
            <ul>
              ${pageData.info.map(item => `
                <li><strong>${item.label}:</strong> ${item.value}</li>
              `).join('')}
            </ul>
          </div>
          <div class="contact-form">
            <form>
              <label for="name">Name</label>
              <input type="text" id="name" name="name" required>

              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>

              <label for="interest">I'm interested in...</label>
              <select id="interest" name="interest">
                ${pageData.form.interest_options.map(option => `<option value="${option}">${option}</option>`).join('')}
              </select>

              <label for="message">Message</label>
              <textarea id="message" name="message" rows="5" required></textarea>

              <button type="submit" class="button button-primary">Send Message</button>
            </form>
          </div>
        </div>
      `;
    }
  }
} 