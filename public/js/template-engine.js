// Template Engine for WPG Amenities
class TemplateEngine {
    constructor() {
        this.pageConfig = null;
        this.baseTemplate = null;
    }

    async init() {
        try {
            // Load page configuration
            const configResponse = await fetch('/data/page-config.json');
            this.pageConfig = await configResponse.json();
            
            // Load base template
            const templateResponse = await fetch('/template.html');
            this.baseTemplate = await templateResponse.text();
            
            return true;
        } catch (error) {
            console.error('Failed to initialize template engine:', error);
            return false;
        }
    }

    generatePageHTML(pageName) {
        if (!this.pageConfig || !this.baseTemplate) {
            throw new Error('Template engine not initialized');
        }

        const config = this.pageConfig.pages[pageName];
        if (!config) {
            throw new Error(`Page configuration not found for: ${pageName}`);
        }

        let html = this.baseTemplate;

        // Replace template placeholders
        html = html.replace('data-template="title"', `data-template="title"`);
        html = html.replace('>WPG Amenities<', `>${config.title}<`);
        html = html.replace('data-template="page-id"', `id="${config.pageId}"`);
        html = html.replace('data-template="css-path"', `href="${config.cssPath}"`);
        html = html.replace('data-template="config-path"', `src="${config.configPath}"`);
        html = html.replace('data-template="yaml-lib"', `src="${config.yamlLib}"`);
        html = html.replace('data-template="main-script"', `src="${config.mainScript}"`);

        // Remove template attributes
        html = html.replace(/data-template="[^"]*"/g, '');

        return html;
    }

    async generateAllPages() {
        if (!this.pageConfig) {
            throw new Error('Template engine not initialized');
        }

        const results = {};
        for (const [pageName, config] of Object.entries(this.pageConfig.pages)) {
            results[pageName] = this.generatePageHTML(pageName);
        }
        return results;
    }

    // Utility method to create HTML files
    downloadHTML(pageName, html) {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${pageName}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Template utilities
const TemplateUtils = {
    // Create element from template
    createFromTemplate(templateId, data = {}) {
        const template = document.getElementById(templateId);
        if (!template) {
            console.error(`Template with id "${templateId}" not found`);
            return null;
        }

        const element = template.content.cloneNode(true);
        
        // Apply data to template elements
        for (const [key, value] of Object.entries(data)) {
            const targetElement = element.querySelector(`[data-field="${key}"]`) || 
                                element.querySelector(key);
            if (targetElement) {
                if (targetElement.tagName === 'IMG') {
                    targetElement.src = value;
                    if (data.alt) targetElement.alt = data.alt;
                } else if (targetElement.tagName === 'A') {
                    targetElement.href = value;
                    if (data.text) targetElement.textContent = data.text;
                } else {
                    targetElement.textContent = value;
                }
            }
        }

        return element;
    },

    // Populate template with data
    populateTemplate(element, data) {
        // Handle images
        const img = element.querySelector('img');
        if (img && data.image) {
            img.src = data.image;
            img.alt = data.alt || data.name || '';
        }

        // Handle links
        const link = element.querySelector('a');
        if (link && data.url) {
            link.href = data.url;
        }

        // Handle text content
        const title = element.querySelector('h3, h4');
        if (title && data.name) {
            title.textContent = data.name;
        }

        // Handle description
        const description = element.querySelector('p:not(.product-code)');
        if (description && data.description) {
            description.textContent = data.description;
        }

        // Handle product code
        const codeElement = element.querySelector('.product-code');
        if (codeElement && data.code) {
            codeElement.textContent = `Code: ${data.code}`;
        }

        return element;
    },

    // Batch create elements from data array
    createMultiple(templateId, dataArray) {
        const fragment = document.createDocumentFragment();
        dataArray.forEach(data => {
            const element = this.createFromTemplate(templateId, data);
            if (element) {
                fragment.appendChild(element);
            }
        });
        return fragment;
    }
};

// Make available globally
window.TemplateEngine = TemplateEngine;
window.TemplateUtils = TemplateUtils;