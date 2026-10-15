const { When, Then } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");
const LeadManagementPage = require("../pages/LeadManagementPage");

function getLeadManagementPage(world) {
  if (!world.leadManagementPage) {
    world.leadManagementPage = new LeadManagementPage(world.page);
  }
  return world.leadManagementPage;
}

When("I create a lead with unique details", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  const uniqueId = Math.floor(100 + Math.random() * 900);
  this.newLead = {name: `Test ${uniqueId}`,company: `Test ${uniqueId}`,email: `Test${uniqueId}@gmail.com`,phone: "9000000000",source: "Website",value: "25000",};
  await leadManagementPage.createLead(this.newLead);
});

When("I open the lead {string}", async function (leadName) {
  const leadManagementPage = getLeadManagementPage(this);
  await leadManagementPage.openLead(leadName);
});

When("I open the newly created lead", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  await leadManagementPage.openLead(this.newLead.name);
});

When("I open the New Lead form", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  await leadManagementPage.openNewLeadForm();
});

When("I enter lead details with an existing email", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  this.duplicateLead = {name: "Duplicate Test",company: "Duplicate Company",email: "owen@oscorp.com",phone: "9876543210",source: "Cold call",value: "100",};
  await leadManagementPage.enterExistingEmailDetails(this.duplicateLead);
});

When("I leave the Contact Name field empty and submit the form",
  async function () {
    const leadManagementPage = getLeadManagementPage(this);
    await leadManagementPage.submitLeadWithoutContactName();
  },
);

When("I capture the current lead count", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  this.leadCountBeforeSubmission = await leadManagementPage.getLeadCount();
});

When("I add a valid note {string}", async function (note) {
  const leadManagementPage = getLeadManagementPage(this);
  this.noteText = note;
  this.activityCountBeforeNote = await leadManagementPage.getActivityCount();
  await leadManagementPage.enterNote(note);
  await leadManagementPage.saveNote();
});

When("I enter a note with fewer than five characters", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  this.activityCountBeforeInvalidNote =
  await leadManagementPage.getActivityCount();
  await leadManagementPage.enterNote("sdas");
  await leadManagementPage.saveNote();
});
 
When("I convert the lead to a deal", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  await leadManagementPage.convertLeadToDeal();
  this.convertedDealId = await leadManagementPage.getConvertedDealId();
});

When("I open the converted deal in the pipeline", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  await leadManagementPage.openConvertedDealInPipeline();
});

Then("the newly created lead should appear in the leads table",
  async function () {
    const leadManagementPage = getLeadManagementPage(this);
    assert.equal(await leadManagementPage.isLeadDisplayed(this.newLead.name),true,);
  },
);

Then("the duplicate email validation should be displayed", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  assert.equal(await leadManagementPage.isDuplicateEmailMessageVisible(),true,"The duplicate email validation message should be visible.",);
});

Then("the lead details page should be displayed", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  assert.equal(await leadManagementPage.isLeadDetailsDisplayed("Owen Scott"),true,);
});

Then("I should see the contact name validation message", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  assert.equal(await leadManagementPage.isContactNameValidationVisible(), true);
});

Then("the lead should not be created", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  const leadCount = await leadManagementPage.getLeadCount();
  assert.equal(leadCount,this.leadCountBeforeSubmission,"A lead was created even though the Contact Name was empty.",);
});

Then("the New Lead modal should be displayed", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  assert.equal(await leadManagementPage.isNewLeadModalVisible(),true, "The New Lead modal should be visible.",);
});

Then("all expected lead form fields should be visible", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  const visibleFields = await leadManagementPage.getVisibleNewLeadFormFields();
  assert.ok(visibleFields.length > 0,"Expected the New Lead modal to contain visible form fields.",);
});

Then("the saved note should appear in the activity timeline",
  async function () {
    const leadManagementPage = getLeadManagementPage(this);
    await this.page.getByText(this.noteText, { exact: true }).waitFor({ state: "visible" });
    const activityText = await leadManagementPage.getLatestActivityText();
    assert.ok(activityText.includes(this.noteText),`The saved note "${this.noteText}" was not found in the latest activity.`,);
    assert.equal(await leadManagementPage.getActivityCount(),this.activityCountBeforeNote + 1,"Expected exactly one new activity after saving the note.",);
  },
);

Then("the activity timestamp should be displayed", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  assert.equal(await leadManagementPage.isActivityTimestampVisible(),true,"The activity timestamp should be visible.",);
});

Then("the note validation message should be displayed", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  assert.equal(await leadManagementPage.isNoteValidationErrorVisible(),true,"The note validation message should be visible.",);
});

Then("the note should not be saved", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  const activityCountAfterSubmission =await leadManagementPage.getActivityCount();
  assert.equal(activityCountAfterSubmission,this.activityCountBeforeInvalidNote,"An invalid note was added to the activity timeline.",);
  const latestActivityText =activityCountAfterSubmission > 0? await leadManagementPage.getLatestActivityText(): "";
  assert.ok(!latestActivityText.includes("sdas"),'The invalid note "sdas" should not appear in the activity timeline.',);
});
 
Then("the lead should show the converted deal banner", async function () {
  const leadManagementPage = getLeadManagementPage(this);
  assert.equal(await leadManagementPage.isLeadConvertedToDeal(),true,"The converted deal banner should be visible.",);
});