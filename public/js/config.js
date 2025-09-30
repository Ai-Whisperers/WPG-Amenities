// js/config.js

// Get base path from current location (handles both root and subdirectory deployments)
const getBasePath = () => {
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(Boolean);
    // If deployed to subdirectory, use it; otherwise use root
    return pathParts.length > 0 && !pathParts[0].includes('.html')
        ? `/${pathParts[0]}/`
        : '/';
};

const basePath = getBasePath();

const config = {
    // Environment settings
    production: true, // Set to false for development mode with debug logs

    // Base path for deployment
    basePath: basePath,

    // Data and resource paths
    paths: {
        content: `${basePath}data/content.yml`,
        images: {
            logo: `${basePath}images/logo/`,
            hero: `${basePath}images/hero/`,
            footer: `${basePath}images/footer/`,
            products: `${basePath}images/products/`,
            clients: `${basePath}images/clients/`,
            team: `${basePath}images/team/`,
            icons: `${basePath}images/icons/`,
            custom: `${basePath}images/custom/`,
            about: `${basePath}images/about/`
        }
    }
}; 