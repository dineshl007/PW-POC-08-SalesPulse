class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('#crm-email');
    this.passwordInput = page.locator('input[type="password"]');
    this.signInButton = page.getByTestId('crm-login');
  }

  async open() {
    const baseUrl = process.env.BASE_URL || 'https://www.practiceqaautomation.com/apps/crm';
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  }

  async signIn(email, password) {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.signInButton.waitFor({ state: 'visible' });

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
  async submitEmptyCredentials() {
    await this.emailInput.clear();
    await this.passwordInput.clear();
    await this.signInButton.click();
}

async isLoginErrorVisible() {
    const errorMessage = this.page.getByTestId("crm-login-error");
    await errorMessage.waitFor({ state: "visible" });
    return await errorMessage.isVisible();
}
}

module.exports = { LoginPage };