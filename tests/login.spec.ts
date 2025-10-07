import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('Duck Creek Login Tests', () => {

  test('should successfully login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    // Get credentials from environment
    const username = process.env.DC_USERNAME;
    const password = process.env.DC_PASSWORD;

    if (!username || !password) {
      throw new Error('Missing credentials: DC_USERNAME and DC_PASSWORD must be set in .env file');
    }

    await loginPage.login(username, password);

    // Wait for successful login
    await page.waitForLoadState('networkidle');

    // Take screenshot for verification
    await page.screenshot({ path: 'screenshots/after-login.png', fullPage: true });

    // Assert: URL should change after successful login
    const currentUrl = page.url();
    const baseURL = process.env.DC_BASE_URL || 'https://your-instance.duckcreekondemand.com/policy/';
    expect(currentUrl).not.toBe(baseURL);
    expect(currentUrl).toContain('defaultViewmodel'); // Page d'accueil après login

    console.log('✓ Login successful, redirected to:', currentUrl);
  });

  test('should display error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('invalid_user', 'invalid_pass');

    // Wait a bit for potential error message
    await page.waitForTimeout(2000);

    // Assert: URL should remain on login page (not redirected)
    const currentUrl = page.url();
    const baseURL = process.env.DC_BASE_URL || 'https://your-instance.duckcreekondemand.com/policy/';
    expect(currentUrl).toBe(baseURL);

    await page.screenshot({ path: 'screenshots/login-error.png' });

    console.log('✓ Login failed as expected, stayed on login page');
  });
});
