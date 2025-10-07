import { chromium, Page } from '@playwright/test';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

export async function explorePage(url: string, outputFile: string) {
  const browser = await chromium.launch({ headless: true }); // Mode headless pour environnements sans GUI
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  try {
    console.log(`Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle' });

    // Take screenshot
    await page.screenshot({ path: `screenshots/page-exploration-${Date.now()}.png`, fullPage: true });

    // Extract page information
    const pageInfo = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input')).map(input => ({
        type: input.type,
        name: input.name,
        id: input.id,
        placeholder: input.placeholder,
        className: input.className,
        value: input.value,
      }));

      const buttons = Array.from(document.querySelectorAll('button, input[type="submit"]')).map(btn => ({
        type: btn.getAttribute('type'),
        text: btn.textContent?.trim(),
        id: btn.id,
        className: btn.className,
        name: btn.getAttribute('name'),
      }));

      const forms = Array.from(document.querySelectorAll('form')).map(form => ({
        id: form.id,
        name: form.name,
        action: form.action,
        method: form.method,
        className: form.className,
      }));

      const links = Array.from(document.querySelectorAll('a')).map(link => ({
        text: link.textContent?.trim(),
        href: link.href,
        id: link.id,
        className: link.className,
      }));

      return {
        title: document.title,
        url: window.location.href,
        inputs,
        buttons,
        forms,
        links: links.slice(0, 20), // Limit to first 20 links
      };
    });

    // Save to file
    fs.writeFileSync(outputFile, JSON.stringify(pageInfo, null, 2));
    console.log(`Page information saved to: ${outputFile}`);
    console.log(`Found ${pageInfo.inputs.length} inputs, ${pageInfo.buttons.length} buttons, ${pageInfo.forms.length} forms`);

    return pageInfo;
  } catch (error) {
    console.error('Error exploring page:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Explorer après login
async function exploreAfterLogin() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  try {
    // 1. Login
    console.log('🔐 Logging in...');
    await page.goto(process.env.DC_BASE_URL || 'https://your-instance.duckcreekondemand.com/policy/');
    await page.locator('#username-inputEl').fill(process.env.DC_USERNAME || 'YOUR_USERNAME');
    await page.locator('#password-inputEl').fill(process.env.DC_PASSWORD || '');
    await page.locator('#password-inputEl').press('Enter');
    await page.waitForLoadState('networkidle');

    console.log('✓ Logged in successfully');
    console.log('📍 Current URL:', page.url());

    // 2. Explorer la page d'accueil
    await page.screenshot({ path: 'screenshots/home-page.png', fullPage: true });
    const homePageInfo = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input')).map(input => ({
        type: (input as HTMLInputElement).type,
        name: (input as HTMLInputElement).name,
        id: input.id,
        placeholder: (input as HTMLInputElement).placeholder,
        className: input.className,
      }));

      const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"], a[role="button"]')).map(btn => ({
        type: btn.getAttribute('type'),
        text: btn.textContent?.trim().substring(0, 50),
        id: btn.id,
        className: btn.className,
        name: btn.getAttribute('name'),
      }));

      const links = Array.from(document.querySelectorAll('a')).map(link => ({
        text: link.textContent?.trim().substring(0, 50),
        href: (link as HTMLAnchorElement).href,
        id: link.id,
      }));

      return {
        title: document.title,
        url: window.location.href,
        inputs,
        buttons,
        links: links.slice(0, 50),
      };
    });

    fs.writeFileSync('reports/home-page-structure.json', JSON.stringify(homePageInfo, null, 2));
    console.log('✓ Home page structure saved to: reports/home-page-structure.json');
    console.log(`  Found ${homePageInfo.inputs.length} inputs, ${homePageInfo.buttons.length} buttons, ${homePageInfo.links.length} links`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args[0] === 'login' || args[0] === 'home') {
    // Explorer après login
    exploreAfterLogin()
      .then(() => console.log('✅ Exploration complete'))
      .catch(err => console.error('❌ Exploration failed:', err));
  } else {
    // Explorer la page de login par défaut
    const url = process.env.DC_BASE_URL || 'https://your-instance.duckcreekondemand.com/policy/';
    explorePage(url, 'reports/login-page-structure.json')
      .then(() => console.log('✅ Exploration complete'))
      .catch(err => console.error('❌ Exploration failed:', err));
  }
}
