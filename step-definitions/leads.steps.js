const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");
const { LoginPage } = require("../pages/LoginPage");
const { LeadsPage } = require("../pages/LeadsPage");

Given("I am logged in to SalesPulse", async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.open();
  await this.loginPage.signIn(process.env.CRM_EMAIL, process.env.CRM_PASSWORD);
  await this.page.waitForURL("**/apps/crm/dashboard");
});

When("I open the Leads page", async function () {
  this.leadsPage = new LeadsPage(this.page);
  await this.leadsPage.open();
  await this.leadsPage.heading.waitFor({ state: "visible" });
});

When("I search for a lead named {string}", async function (name) {
  this.searchName = name;
  await this.leadsPage.searchLead(name);
});

When("I filter leads by status {string}", async function (status) {
  await this.leadsPage.filterLeadsByStatus(status);
});
When("I filter leads by source {string}", async function (source) {
  await this.leadsPage.filterLeadsBySource(source);
});
When("I select the lead {string} for assignment", async function (leadName) {
  await this.leadsPage.selectLeadForAssignment(leadName);
});

When("I assign the selected lead to {string}", async function (ownerName) {
  await this.leadsPage.assignSelectedLeadsToOwner(ownerName);
});

Then("I should see the Leads heading", async function () {
  await this.leadsPage.heading.waitFor({ state: "visible" });
});

Then("I should see the matching lead", async function () {
  const matchingLead = this.leadsPage.leadsTable.getByText(this.searchName, {exact: true,});
  await matchingLead.waitFor({ state: "visible" });
  const actualName = (await matchingLead.textContent()).trim();
  const rowCount = await this.leadsPage.leadRows.count();
  assert.equal(actualName, this.searchName);
  assert.equal(rowCount, 1);
});

Then("I should see only leads with status {string}", async function (status) {
  const rows = this.leadsPage.leadRows;
  const rowCount = await rows.count();
  assert.ok(rowCount > 0, `No leads found with status: ${status}`);
  for (let i = 0; i < rowCount; i++) {
    const actualStatus = (await rows.nth(i).locator("td").nth(4).innerText()).trim();
    assert.equal(actualStatus, status);
  }
});
Then("I should see only leads with source {string}", async function (source) {
  const rows = this.leadsPage.leadRows;
  const rowCount = await rows.count();
  assert.ok(rowCount > 0, `No leads found with source: ${source}`);
  for (let i = 0; i < rowCount; i++) {
    const actualSource = (await rows.nth(i).locator("td").nth(3).innerText()).trim();
    assert.equal(actualSource, source);
  }
});

Then("I should see the no matching leads message", async function () {
  const isVisible = await this.leadsPage.isNoMatchingLeadsMessageVisible();
  const assert = require("node:assert/strict");
  assert.equal(isVisible,true,'Expected the "No leads match." message to be visible.',);
});

Then("the Leads table should display its column headers", async function () {
  const headers = await this.leadsPage.getLeadsTableHeaders();
  assert.ok(headers.length > 0, "No column headers were found.");
  console.log("Leads table headers:", headers);
});

Then("the Leads table should contain at least one lead", async function () {
  const rowCount = await this.leadsPage.getLeadRowCount();
  assert.ok(rowCount > 0, "Expected at least one lead row in the Leads table.");
});

Then("the lead {string} should be assigned to {string}",
  async function (leadName, ownerName) {
    const actualOwner = await this.leadsPage.getLeadOwner(leadName);
    assert.equal(actualOwner, ownerName);
  },
);

Then("the assignment success message should be displayed", async function () {
  const isVisible = await this.leadsPage.isAssignmentSuccessVisible();
  assert.equal(isVisible, true);
});

Then("I should see only leads matching status {string} and source {string}",
  async function (status, source) {
    const matches = await this.leadsPage.verifyLeadsByStatusAndSource(status,source,);
    assert.equal( matches,true,`Expected all visible leads to have status "${status}" and source "${source}".`,);
  },
);
Then("the source filter should be set to {string}", async function (source) {
  const actualSource = await this.leadsPage.getSelectedSourceFilter();
  assert.equal(actualSource, source);
});

Then("the status filter should be set to {string}", async function (status) {
  const actualStatus = await this.leadsPage.getSelectedStatusFilter();
  assert.equal(actualStatus, status);
});

Then("the leads count should be zero", async function () {
  const countText = await this.leadsPage.getLeadsCountText();
  assert.match(countText,/\b0 leads\b/,`Expected the lead count to show 0 leads, but received: ${countText}`,);
});