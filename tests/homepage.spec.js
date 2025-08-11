const { test, expect } = require('@playwright/test');
const fs = require('fs');
const yaml = require('js-yaml');

// Load content from YAML file to use in tests
const contentFile = fs.readFileSync('../public/data/content.yml', 'utf8');
const content = yaml.load(contentFile);

test.describe('Homepage E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the local server
    await page.goto('http://127.0.0.1:8080');
  });

  test('should load the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('WPG Amenities - Premium Hotel Amenities');
  });

  test('should display the main hero headline from YAML content', async ({ page }) => {
    // Find the h1 within the hero section and check its text
    const heroHeadline = page.locator('.hero h1');
    await expect(heroHeadline).toBeVisible();
    await expect(heroHeadline).toHaveText(content.homepage.hero.headline);
  });

  test('should load the featured products section with correct categories', async ({ page }) => {
    // Check that the section title is visible
    const productsTitle = page.locator('.featured-products h2');
    await expect(productsTitle).toBeVisible();
    await expect(productsTitle).toHaveText('Explore Our Products');

    // Check that the correct number of category cards are rendered
    const categoryCards = page.locator('.category-card');
    await expect(categoryCards).toHaveCount(content.products.categories.length);
  });

  test('should have a visible header with correct navigation links', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check for the presence of the correct number of nav links
    const navLinks = page.locator('header nav ul li');
    await expect(navLinks).toHaveCount(content.site.navigation.length);
  });

}); 