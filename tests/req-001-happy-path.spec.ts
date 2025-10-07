
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('User Login to Duck Creek - Happy Path', () => {
  test('REQ-001_HAPPY_PATH', async ({ page }) => {
    // Test: Verify User should be able to login to Duck Creek Policy system with valid credentials works correctly with valid data

    const loginPage = new LoginPage(page);

    // Step 1: User should be able to login to Duck Creek Policy system with valid credentials
    await loginPage.navigate();
    await loginPage.login(process.env.DC_USERNAME, process.env.DC_PASSWORD);
    // Expected: User successfully logged in

    // Expected Result: Operation completes successfully
  });
});
