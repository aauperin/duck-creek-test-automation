
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('User Login to Duck Creek - Validation: Successful login redirects to home page', () => {
  test('REQ-001_NEG_4', async ({ page }) => {
    // Test: Verify system handles invalid data: Successful login redirects to home page

    const loginPage = new LoginPage(page);

    // Step 1: Attempt Successful login redirects to home page with invalid data
    await loginPage.navigate();
    await loginPage.login(process.env.DC_USERNAME || '', process.env.DC_PASSWORD || '');
    // Expected: Error message displayed

    // Expected Result: System displays appropriate error message
  });
});
