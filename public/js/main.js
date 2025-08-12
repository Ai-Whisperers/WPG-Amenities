// js/main.js

// -------------------
// Core Application Logic
// -------------------

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    App.init();
});

const App = {
    // Application state
    state: {
        siteData: null,
        currentPage: null,
    },

    // Initialize the application
    async init() {
        try {
            // Fetch and load YAML data
            const response = await fetch(config.paths.content);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const yamlText = await response.text();
            this.state.siteData = jsyaml.load(yamlText);

            // Set the current page based on the body ID
            this.state.currentPage = document.body.id;

            // Render common elements and page-specific content
            this.render();
        } catch (error) {
            console.error('Error initializing app:', error);
            document.body.innerHTML = '<h1>Error loading website content.</h1>';
        }
    },

    // Central render function
    async render() {
        if (!this.state.siteData) return;

        // Load and render common elements
        await this.loadHeader();
        await this.loadFooter();

        // Set page title and meta
        this.setPageMeta();

        // Route to the appropriate page renderer
        const pageRenderer = this.router[this.state.currentPage];
        if (pageRenderer) {
            pageRenderer(this.state.siteData);
        } else {
            console.warn(`No renderer found for page: ${this.state.currentPage}`);
        }
    },

    // -------------------
    // Element Renderers
    // -------------------

    // Load header partial and populate with data
    async loadHeader() {
        const header = document.querySelector('header');
        if (!header) return;
        
        try {
            const response = await fetch('/partials/header.html');
            const headerHtml = await response.text();
            header.innerHTML = headerHtml;
            
            // Populate header with data
            this.populateHeader();
        } catch (error) {
            console.error('Error loading header:', error);
        }
    },

    // Load footer partial and populate with data
    async loadFooter() {
        const footer = document.querySelector('footer');
        if (!footer) return;
        
        try {
            const response = await fetch('/partials/footer.html');
            const footerHtml = await response.text();
            footer.innerHTML = footerHtml;
            
            // Populate footer with data
            this.populateFooter();
            
            // Initialize footer enhancements
            this.initializeFooterEnhancements();
            
            // Initialize modern UI enhancements
            this.initializeModernUI();
  } catch (error) {
            console.error('Error loading footer:', error);
        }
    },

    // Populate header with dynamic content
    populateHeader() {
        const { site } = this.state.siteData;
        
        // Set logo
        const logoLink = document.querySelector('.logo-link');
        if (logoLink && site.logo) {
            logoLink.innerHTML = `<img src="${site.logo}" alt="${site.title}" class="logo">`;
        }
        
        // Set navigation links
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && site.navigation) {
            navLinks.innerHTML = site.navigation.map(link =>
                `<li><a href="${link.url}" ${window.location.pathname === link.url ? 'class="active"' : ''}>${link.text}</a></li>`
            ).join('');
        }
    },

    // Populate footer with dynamic content
    populateFooter() {
        const { footer: footerData } = this.state.siteData;
        
        // Set company name
        const companyName = document.querySelector('.company-name');
        if (companyName) {
            companyName.textContent = footerData.company_name;
        }
        
        // Set contact details
        const contactDetails = document.querySelector('.contact-details');
        if (contactDetails) {
            contactDetails.innerHTML = `
                <p>📍 ${footerData.address}</p>
                <p>📞 ${footerData.phone}</p>
                <p>📱 ${footerData.cel}</p>
                <p>✉️ <a href="mailto:${footerData.email}">${footerData.email}</a></p>
            `;
        }
        
        // Set footer logo
        const footerLogo = document.querySelector('.footer-logo');
        const { site } = this.state.siteData;
        if (footerLogo && site && site.logo) {
            footerLogo.innerHTML = `<img src="${site.logo}" alt="${site.title}" loading="lazy">`;
        }
        
        // Set quick links
        const quickLinks = document.querySelector('.quick-links ul');
        if (quickLinks && footerData.quick_links) {
            quickLinks.innerHTML = footerData.quick_links.map(link =>
                `<li><a href="${link.url}">${link.text}</a></li>`
            ).join('');
        }
        
        // Set social links
        const socialLinks = document.querySelector('.social-links');
        if (socialLinks && footerData.social_links) {
            socialLinks.innerHTML = footerData.social_links.map(link =>
                `<a href="${link.url}" target="_blank" rel="noopener" aria-label="${link.platform}">
                    <img src="images/icons/${link.icon}" alt="${link.platform}">
                </a>`
            ).join('');
        }
        
        // Set copyright
        const copyright = document.querySelector('.copyright');
        if (copyright) {
            copyright.innerHTML = this.state.siteData.site.footer.copyright;
        }
        
        // Set legal links
        const legalLinks = document.querySelector('.legal-links');
        if (legalLinks && footerData.legal_links) {
            legalLinks.innerHTML = footerData.legal_links.map(link =>
                `<a href="${link.url}">${link.text}</a>`
            ).join(' | ');
        }
    },

    // Set page title and meta tags
    setPageMeta() {
        const { pages, seo } = this.state.siteData;
        const currentPageData = pages[this.state.currentPage] || pages.home;
        
        // Set title
        document.title = currentPageData.title || seo.default_title;
        
        // Set description
        const descriptionMeta = document.querySelector('meta[name="description"]');
        if (descriptionMeta) {
            descriptionMeta.setAttribute('content', currentPageData.description || seo.default_description);
        }
        
        // Set keywords
        const keywordsMeta = document.querySelector('meta[name="keywords"]');
        if (keywordsMeta) {
            keywordsMeta.setAttribute('content', seo.keywords);
        }
    },

    // -------------------
    // Page-specific Renderers (Router)
    // -------------------

    router: {
        'home': (data) => {
            const { homepage, products, portfolio } = data;
            const main = document.querySelector('main');
            if (!main) return;

            // Hero Section
            const heroSection = `
                <section class="hero" style="background-image: url('${homepage.hero.slides && homepage.hero.slides[0] ? homepage.hero.slides[0].image : ''}');">
        <div class="container">
                        <h1>${homepage.hero.headline}</h1>
                        <p>${homepage.hero.tagline}</p>
        </div>
                </section>
            `;

            // Other sections
            const valuePropSection = App.createSection('value-prop', `
                <h2>${homepage.value_proposition.headline}</h2>
                <p>${homepage.value_proposition.text}</p>
            `);

            const featuredProductsSection = App.createSection('featured-products', `
                <h2>Explore Our Products</h2>
                <div class="categories-grid">
                    ${products && products.categories ? products.categories.slice(0, 4).map(cat => `
        <div class="category-card">
                            <a href="${cat.url}">
                                <img src="${cat.category_image || cat.image}" alt="${cat.title}" loading="lazy">
                                <h3>${cat.title}</h3>
                            </a>
        </div>
                    `).join('') : ''}
          </div>
            `);

            main.innerHTML = heroSection + valuePropSection + featuredProductsSection;
        },

        'products': (data) => {
            const { products } = data;
    const main = document.querySelector('main');
            if (!main) return;

            const categoryLinks = products.categories.map(cat => `
                <a href="${cat.url}" class="category-link">
                    <h3>${cat.title}</h3>
                    <p>${cat.description}</p>
                </a>
        `).join('');

            main.innerHTML = `
                <div class="container">
                    <h1>${products.main.headline}</h1>
                    <p>${products.main.introduction}</p>
                    <div class="categories-list">${categoryLinks}</div>
          </div>
        `;
        },

        'product-category': (data) => {
            const pageId = App.state.currentPage;
            const category = data.products.categories.find(c => c.id === pageId);
            const main = document.querySelector('main');
            if (!main || !category) return;

            const productGrid = document.createElement('div');
            productGrid.className = 'product-grid';

            const template = document.getElementById('product-card-template');

            category.items.forEach(item => {
                const card = template.content.cloneNode(true);
                card.querySelector('img').src = `${config.paths.images.products}${item.image}`;
                card.querySelector('img').alt = item.name;
                card.querySelector('h4').textContent = item.name;
                if (item.code) {
                    card.querySelector('.product-code').textContent = `Code: ${item.code}`;
                }
                productGrid.appendChild(card);
            });

            const bulkNoteSection = category.bulk_note ? `
                <div class="bulk-note">
                    <p><strong>Nota:</strong> ${category.bulk_note}</p>
                </div>
            ` : '';

            main.innerHTML = `
                <div class="container">
                    <h1>${category.title}</h1>
                    <p class="category-description">${category.description}</p>
                    ${bulkNoteSection}
                    <div class="product-grid-container"></div>
                </div>
            `;
            main.querySelector('.product-grid-container').appendChild(productGrid);
        },

        'customization': (data) => {
            const { customization } = data;
            const main = document.querySelector('main');
            if (!main) return;

            const heroSection = `
                <section class="hero customization-hero">
                    <div class="container">
                        <h1>${customization.headline}</h1>
                        <img src="${customization.hero_image}" alt="Custom amenity line design" class="hero-image">
                        <p>${customization.introduction}</p>
            </div>
          </section>
            `;

            const servicesSection = App.createSection('services', `
                <h2>Our Custom Services</h2>
                <div class="services-grid">
                    ${customization.services ? customization.services.map(service => `
                        <div class="service-card">
                            <h3>${service.title}</h3>
                            <p>${service.description}</p>
                            ${service.applicable_products ? `<p class="applicable-products"><strong>Aplicable a:</strong> ${service.applicable_products}</p>` : ''}
                        </div>
                    `).join('') : ''}
                </div>
            `);

            const processSection = App.createSection('process', `
                <h2>${customization.process ? customization.process.headline : 'Our Process'}</h2>
                <div class="process-steps">
                    ${customization.process && customization.process.steps ? customization.process.steps.map(step => `
                        <div class="process-step">
                            <div class="step-number">${step.step}</div>
                            <h3>${step.title}</h3>
                            <p>${step.description}</p>
              </div>
                    `).join('') : ''}
          </div>
            `);

            const ctaSection = App.createSection('cta', `
                <div class="cta-content">
                    <h2>Ready to Create Your Custom Line?</h2>
                    <a href="${customization.cta ? customization.cta.url : '/contact.html'}" class="btn btn-primary">
                        ${customization.cta ? customization.cta.text : 'Contact Us'}
                    </a>
        </div>
            `);

            main.innerHTML = heroSection + servicesSection + processSection + ctaSection;
        },

        'about': (data) => {
            const { about_us } = data;
    const main = document.querySelector('main');
            if (!main) return;

            const heroSection = `
                <section class="hero about-hero">
        <div class="container">
                        <h1>${about_us.page_hero ? about_us.page_hero.headline : 'About Us'}</h1>
                        <p>${about_us.page_hero ? about_us.page_hero.tagline : ''}</p>
                    </div>
                </section>
            `;

            const storySection = App.createSection('our-story', `
                <h2>${about_us.our_story ? about_us.our_story.headline : 'Our Story'}</h2>
                <p>${about_us.our_story ? about_us.our_story.text : ''}</p>
            `);

            const missionSection = App.createSection('our-mission', `
                <h2>${about_us.our_mission ? about_us.our_mission.headline : 'Our Mission'}</h2>
                <p>${about_us.our_mission ? about_us.our_mission.text : ''}</p>
            `);

            const valuesSection = App.createSection('our-values', `
                <h2>${about_us.our_values ? about_us.our_values.headline : 'Our Values'}</h2>
                <div class="values-grid">
                    ${about_us.our_values && about_us.our_values.values ? about_us.our_values.values.map(value => `
                        <div class="value-card">
                            <h3>${value.title}</h3>
                            <p>${value.description}</p>
                        </div>
                    `).join('') : ''}
                </div>
            `);

            const teamSection = App.createSection('team', `
                <h2>${about_us.team ? about_us.team.headline : 'Meet the Team'}</h2>
            <div class="team-grid">
                    ${about_us.team && about_us.team.members ? about_us.team.members.map(member => `
                <div class="team-member">
                            <img src="${member.image}" alt="${member.name}" loading="lazy">
                  <h3>${member.name}</h3>
                  <p class="role">${member.role}</p>
                            ${member.bio ? `<p class="bio">${member.bio}</p>` : ''}
                        </div>
                    `).join('') : ''}
                </div>
            `);

            main.innerHTML = heroSection + storySection + missionSection + valuesSection + teamSection;
        },


        'portfolio': (data) => {
            const { portfolio } = data;
            const main = document.querySelector('main');
            if (!main) return;

            const heroSection = `
                <section class="hero portfolio-hero">
                    <div class="container">
                        <h1>${portfolio.headline}</h1>
                        <p>${portfolio.introduction}</p>
                    </div>
                </section>
            `;

            const featuredClientsSection = App.createSection('featured-clients', `
                <h2>Featured Clients</h2>
                <div class="clients-grid">
                    ${portfolio.featured_clients ? portfolio.featured_clients.map(client => `
                        <div class="client-card">
                            <a href="${client.url}" target="_blank" rel="noopener">
                                <img src="${client.logo}" alt="${client.name}" loading="lazy">
                                <h3>${client.name}</h3>
                                <p>${client.description}</p>
                            </a>
                        </div>
                    `).join('') : ''}
                </div>
            `);

            const allClientsSection = App.createSection('all-clients', `
                <h2>All Our Clients</h2>
                <div class="logos-carousel">
                    ${portfolio.all_clients ? portfolio.all_clients.map(client => `
                        <a href="${client.url}" target="_blank" rel="noopener">
                            <img src="${client.logo}" alt="${client.name}" loading="lazy">
                        </a>
                    `).join('') : ''}
                </div>
            `);

            main.innerHTML = heroSection + featuredClientsSection + allClientsSection;
        },

        'faq': (data) => {
            const main = document.querySelector('main');
            if (!main) return;

            main.innerHTML = `
                <section class="hero faq-hero">
                    <div class="container">
                        <h1>Frequently Asked Questions</h1>
                        <p>Find answers to common questions about our products and services.</p>
                    </div>
                </section>
                <section class="faq-content">
                    <div class="container">
                        <p>FAQ content will be loaded here.</p>
            </div>
          </section>
            `;
        },

        'privacy-policy': (data) => {
            const main = document.querySelector('main');
            if (!main) return;

            main.innerHTML = `
                <section class="hero policy-hero">
                    <div class="container">
                        <h1>Privacy Policy</h1>
                    </div>
          </section>
                <section class="policy-content">
                    <div class="container">
                        <p>Privacy policy content will be loaded here.</p>
        </div>
                </section>
      `;
        },

        'terms-of-service': (data) => {
    const main = document.querySelector('main');
            if (!main) return;

      main.innerHTML = `
                <section class="hero policy-hero">
                    <div class="container">
                        <h1>Terms of Service</h1>
                    </div>
                </section>
                <section class="policy-content">
                    <div class="container">
                        <p>Terms of service content will be loaded here.</p>
          </div>
                </section>
            `;
        },
    },

    // -------------------
    // Helper Utilities
    // -------------------

    createSection(className, content) {
        return `<section class="${className}"><div class="container">${content}</div></section>`;
    },

    // Enhanced template utilities
    createFromTemplate(templateId, data = {}) {
        return TemplateUtils.createFromTemplate(templateId, data);
    },

    populateTemplate(element, data) {
        return TemplateUtils.populateTemplate(element, data);
    },

    createMultipleFromTemplate(templateId, dataArray) {
        return TemplateUtils.createMultiple(templateId, dataArray);
    },

    // Initialize modern UI enhancements
    initializeModernUI() {
        // Scroll animations
        this.initializeScrollAnimations();
        
        // Mobile menu functionality
        this.initializeMobileMenu();
        
        // Loading states
        this.initializeLoadingStates();
        
        // Enhanced interactions
        this.initializeInteractions();
    },

    // Initialize scroll-based animations
    initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    entry.target.style.animationDelay = '0s';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.animate-on-scroll, .category-card, .product-card, .service-card, .value-card, .team-member, .client-card');
        animateElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    },

    // Initialize mobile menu functionality
    initializeMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileToggle && navLinks) {
            // Create mobile menu overlay
            const mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu-overlay';
            mobileMenu.innerHTML = `
                <div class="mobile-menu-content">
                    <button class="mobile-menu-close" aria-label="Close menu">&times;</button>
                    <nav class="mobile-nav">
                        ${navLinks.innerHTML}
                    </nav>
          </div>
            `;
            document.body.appendChild(mobileMenu);

            // Toggle functionality
            mobileToggle.addEventListener('click', () => {
                const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
                mobileToggle.setAttribute('aria-expanded', !isExpanded);
                mobileMenu.classList.toggle('active');
                document.body.classList.toggle('mobile-menu-open');
            });

            // Close menu
            const closeBtn = mobileMenu.querySelector('.mobile-menu-close');
            closeBtn.addEventListener('click', () => {
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
            });

            // Close on overlay click
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) {
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('mobile-menu-open');
                }
            });
        }
    },

    // Initialize loading states
    initializeLoadingStates() {
        const main = document.querySelector('main');
        if (main && main.innerHTML.trim() === '') {
            main.innerHTML = `
                <div class="main-loading">
                    <div class="loading-spinner"></div>
        </div>
      `;
    }
    },

    // Initialize enhanced interactions
    initializeInteractions() {
        // Enhanced hover effects for cards
        const cards = document.querySelectorAll('.card, .product-card, .category-card, .client-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.boxShadow = 'var(--shadow-2xl)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Parallax effect for hero sections
        const heroes = document.querySelectorAll('.hero');
        heroes.forEach(hero => {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rect = hero.getBoundingClientRect();
                const speed = scrolled * 0.5;
                
                if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                    hero.style.transform = `translateY(${speed}px)`;
                }
            });
        });

        // FAQ accordion functionality
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('.faq-icon');
                
                if (answer.style.display === 'block') {
                    answer.style.display = 'none';
                    if (icon) icon.textContent = '+';
                } else {
                    // Close other FAQ items
                    faqQuestions.forEach(q => {
                        const a = q.nextElementSibling;
                        const i = q.querySelector('.faq-icon');
                        if (a !== answer) {
                            a.style.display = 'none';
                            if (i) i.textContent = '+';
                        }
                    });
                    
                    answer.style.display = 'block';
                    if (icon) icon.textContent = '−';
                }
            });
        });
    },

    // Initialize footer enhancements
    initializeFooterEnhancements() {
        // Back to top functionality
        const backToTopBtn = document.getElementById('back-to-top-btn');
        if (backToTopBtn) {
            // Show/hide button based on scroll
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTopBtn.style.display = 'flex';
                    backToTopBtn.style.opacity = '0.7';
                } else {
                    backToTopBtn.style.opacity = '0';
                    setTimeout(() => {
                        if (window.pageYOffset <= 300) {
                            backToTopBtn.style.display = 'none';
                        }
                    }, 300);
                }
            });

            // Smooth scroll to top
            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Newsletter form functionality
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const emailInput = newsletterForm.querySelector('input[type="email"]');
                const submitBtn = newsletterForm.querySelector('button');
                
                if (emailInput && submitBtn) {
                    const email = emailInput.value.trim();
                    if (!email) return;

                    // Visual feedback
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Subscribing...';
                    submitBtn.disabled = true;

                    // Simulate API call (replace with actual newsletter service)
                    try {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        // Success feedback
                        submitBtn.textContent = 'Subscribed!';
                        submitBtn.style.background = '#28a745';
                        emailInput.value = '';
                        
                        // Show thank you message
                        const thankYouMsg = document.createElement('p');
                        thankYouMsg.textContent = 'Thank you for subscribing!';
                        thankYouMsg.style.color = '#28a745';
                        thankYouMsg.style.fontSize = '0.9em';
                        thankYouMsg.style.marginTop = '8px';
                        newsletterForm.appendChild(thankYouMsg);

                        // Reset after 3 seconds
                        setTimeout(() => {
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                            submitBtn.style.background = '';
                            if (thankYouMsg.parentNode) {
                                thankYouMsg.parentNode.removeChild(thankYouMsg);
                            }
                        }, 3000);

                    } catch (error) {
                        // Error feedback
                        submitBtn.textContent = 'Try Again';
                        submitBtn.style.background = '#dc3545';
                        
                        setTimeout(() => {
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                            submitBtn.style.background = '';
                        }, 2000);
                    }
                }
            });
        }

        // Enhanced social link interactions
        const socialLinks = document.querySelectorAll('.social-links a');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-3px) scale(1.1)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) scale(1)';
            });
        });
    },
};

// Assign render function to product categories
App.router['bottles-caps'] = App.router['product-category'];
App.router['soaps-liquids'] = App.router['product-category'];
App.router['amenity-kits'] = App.router['product-category'];
App.router['miscellaneous'] = App.router['product-category'];
App.router['accessories-extras'] = App.router['product-category']; 