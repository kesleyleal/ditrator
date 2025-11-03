import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should have "HOME" as the active link on the homepage', async ({ page }) => {
    await page.goto('http://localhost:8000/newsite.html');
    await page.locator('#mobile-menu-button').click();
    const homeLink = page.locator('#mobile-menu a[href="#"]');
    await expect(homeLink).toHaveClass(/nav-link-active/);
  });

  test('should navigate to the homepage from the company page', async ({ page }) => {
    await page.goto('http://localhost:8000/empresa.html');
    await page.locator('#mobile-menu-button').click();
    await page.locator('#mobile-menu a[href="./newsite.html"]').click();
    await expect(page).toHaveURL(/newsite.html/);
  });
});
