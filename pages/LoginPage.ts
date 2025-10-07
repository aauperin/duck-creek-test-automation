import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    // Sélecteurs basés sur l'inspection de la page réelle Duck Creek
    this.usernameInput = page.locator('#username-inputEl');
    this.passwordInput = page.locator('#password-inputEl');
    this.errorMessage = page.locator('.error, .alert-danger, [role="alert"]').first();
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    // Duck Creek n'a pas de bouton visible - soumettre le formulaire via Enter
    await this.passwordInput.press('Enter');
    await this.waitForPageLoad();
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.errorMessage.isVisible().catch(() => false);
  }

  async getErrorMessage(): Promise<string> {
    return await this.getElementText(this.errorMessage);
  }
}
