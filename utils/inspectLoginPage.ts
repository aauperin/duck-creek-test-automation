import { chromium } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

async function inspectLoginPage() {
  console.log('🔍 Inspection de la page de login Duck Creek...\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Naviguer vers la page
    console.log('📍 Navigation vers:', process.env.DC_BASE_URL || 'https://your-instance.duckcreekondemand.com/policy/');
    await page.goto(process.env.DC_BASE_URL || 'https://your-instance.duckcreekondemand.com/policy/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('✓ Page chargée');
    console.log('📄 URL actuelle:', page.url());
    console.log('📄 Titre:', await page.title());

    // Prendre un screenshot
    await page.screenshot({ path: 'screenshots/login-page-debug.png', fullPage: true });
    console.log('✓ Screenshot sauvegardé: screenshots/login-page-debug.png\n');

    // Extraire tous les inputs
    console.log('📝 === INPUTS TROUVÉS ===');
    const inputs = await page.$$('input');
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('name');
      const id = await input.getAttribute('id');
      const placeholder = await input.getAttribute('placeholder');
      const className = await input.getAttribute('class');
      const isVisible = await input.isVisible();

      console.log(`Input #${i + 1}:`);
      console.log(`  Type: ${type}`);
      console.log(`  Name: ${name}`);
      console.log(`  ID: ${id}`);
      console.log(`  Placeholder: ${placeholder}`);
      console.log(`  Class: ${className}`);
      console.log(`  Visible: ${isVisible}`);
      console.log('');
    }

    // Extraire tous les boutons
    console.log('🔘 === BOUTONS TROUVÉS ===');
    const buttons = await page.$$('button, input[type="submit"], input[type="button"]');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const type = await button.getAttribute('type');
      const name = await button.getAttribute('name');
      const id = await button.getAttribute('id');
      const text = await button.textContent();
      const className = await button.getAttribute('class');
      const isVisible = await button.isVisible();

      console.log(`Bouton #${i + 1}:`);
      console.log(`  Type: ${type}`);
      console.log(`  Name: ${name}`);
      console.log(`  ID: ${id}`);
      console.log(`  Texte: ${text?.trim()}`);
      console.log(`  Class: ${className}`);
      console.log(`  Visible: ${isVisible}`);
      console.log('');
    }

    // Extraire les formulaires
    console.log('📋 === FORMULAIRES ===');
    const forms = await page.$$('form');
    console.log(`Nombre de formulaires: ${forms.length}`);
    for (let i = 0; i < forms.length; i++) {
      const form = forms[i];
      const action = await form.getAttribute('action');
      const method = await form.getAttribute('method');
      const id = await form.getAttribute('id');
      const name = await form.getAttribute('name');

      console.log(`\nForm #${i + 1}:`);
      console.log(`  Action: ${action}`);
      console.log(`  Method: ${method}`);
      console.log(`  ID: ${id}`);
      console.log(`  Name: ${name}`);
    }

    // Sauvegarder le HTML
    const html = await page.content();
    const fs = require('fs');
    fs.writeFileSync('reports/login-page-html.html', html);
    console.log('\n✓ HTML sauvegardé: reports/login-page-html.html');

    // Suggestions de sélecteurs
    console.log('\n💡 === SÉLECTEURS SUGGÉRÉS ===');

    // Chercher des sélecteurs potentiels pour username
    const usernameSelectors = [
      'input[type="text"]',
      'input[name*="user"]',
      'input[id*="user"]',
      'input[placeholder*="user"]',
      '#username',
      '#userName',
      '[name="username"]'
    ];

    for (const selector of usernameSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✓ Username trouvé avec: ${selector} (${count} éléments)`);
      }
    }

    // Chercher des sélecteurs potentiels pour password
    const passwordSelectors = [
      'input[type="password"]',
      'input[name*="pass"]',
      'input[id*="pass"]',
      '#password',
      '[name="password"]'
    ];

    for (const selector of passwordSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✓ Password trouvé avec: ${selector} (${count} éléments)`);
      }
    }

    // Chercher des sélecteurs potentiels pour le bouton
    const buttonSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Login")',
      'button:has-text("Sign")',
      '[value*="Login"]',
      '[value*="Sign"]'
    ];

    for (const selector of buttonSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✓ Bouton trouvé avec: ${selector} (${count} éléments)`);
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await browser.close();
  }
}

inspectLoginPage();
