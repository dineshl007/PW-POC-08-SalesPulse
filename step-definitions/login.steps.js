const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");

Given("I am on the SalesPulse login page", async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.open();
});

When("I sign in with valid credentials", async function () {
  const email = process.env.CRM_EMAIL;
  const password = process.env.CRM_PASSWORD;

  if (!email || !password) {
    throw new Error("CRM_EMAIL or CRM_PASSWORD is missing from .env");
  }

  await this.loginPage.signIn(email, password);
});

When("I sign in with invalid credentials", async function () {
  await this.loginPage.signIn(
    "invalid-user@example.com",
    "InvalidPassword123!",
  );
});

When("I submit the login form with empty credentials", async function () {
  await this.loginPage.submitEmptyCredentials();
});

Then("I should be redirected to the CRM dashboard", async function () {
  await expect(this.page).toHaveURL(/\/apps\/crm\/dashboard\/?$/);
});

Then("I should see the dashboard welcome heading", async function () {
  await expect(
    this.page.getByRole("heading", { name: "Welcome, Maya" }),
  ).toBeVisible();
});

Then("I should remain on the login page", async function () {
  await expect(this.page).not.toHaveURL(/\/apps\/crm\/dashboard\/?$/);
});

Then("I should see the login error message", async function () {
  await expect(this.page.getByTestId("crm-login-error")).toHaveText(
    "Those credentials don't match an account",
  );
});
