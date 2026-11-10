class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByTestId("crm-email");
    this.passwordInput = page.getByLabel("Password", {exact: true,});
    this.signInButton = page.getByRole("button", {name: "Sign in",exact: true,});
    this.loginError = page.getByTestId("crm-login-error");
  }

  async open() {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      throw new Error("BASE_URL is missing from the .env file.");
    }
    await this.page.goto(baseUrl);
  }

  async signIn(email, password) {
    await this.emailInput.waitFor({ state: "visible" });
    await this.emailInput.fill(email);
    await this.passwordInput.waitFor({ state: "visible" });
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async login(email, password) {
    return this.signIn(email, password);
  }

  async submitEmptyCredentials() {
    await this.emailInput.waitFor({ state: "visible" });
    await this.emailInput.clear();
    await this.passwordInput.waitFor({ state: "visible" });
    await this.passwordInput.clear();
    await this.signInButton.click();
  }
  
  async isLoginErrorVisible() {
    await this.loginError.waitFor({ state: "visible" });
    return this.loginError.isVisible();
  }
}
module.exports = { LoginPage };