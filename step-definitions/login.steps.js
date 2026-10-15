const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");
const { LoginPage } = require("../pages/LoginPage");

Given("I am on the SalesPulse login page", async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.open();
});

When("I sign in with valid credentials", async function () {
  await this.loginPage.signIn(process.env.CRM_EMAIL, process.env.CRM_PASSWORD);
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
  await this.page.waitForURL("**/apps/crm/dashboard");

  assert.match(this.page.url(), /\/apps\/crm\/dashboard\/?$/);
});

Then("I should see the dashboard welcome heading", async function () {
  const heading = this.page.getByRole("heading", {
    name: "Welcome, Maya",
  });

  await heading.waitFor({ state: "visible" });
});
Then("I should remain on the login page", async function () {
  await this.page.waitForLoadState("domcontentloaded");

  assert.doesNotMatch(this.page.url(), /\/apps\/crm\/dashboard\/?$/);
});

 

Then("I should see the login error message", async function () {
    const assert = require("node:assert/strict");

    const errorMessage = this.page.getByTestId("crm-login-error");

    await errorMessage.waitFor({ state: "visible" });

    assert.equal(
        await errorMessage.textContent(),
        "Those credentials don't match an account"
    );
});
