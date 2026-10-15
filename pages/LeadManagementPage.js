
class LeadManagementPage {
  constructor(page) {
    this.page = page;

    // New Lead form
    this.newLeadButton = page.getByTestId("new-lead");
    this.contactNameInput = page.getByLabel("Contact name");
    this.companyInput = page.getByLabel("Company");
    this.emailInput = page.getByLabel("Email");
    this.phoneInput = page.getByLabel("Phone");
    this.sourceDropdown = page.getByTestId("lead-source");
    this.estimatedValueInput = page.getByLabel("Est. value (USD)");
    this.saveLeadButton = page.getByRole("button", {
      name: "Save lead",
    });
    this.newLeadModal = page.getByTestId("new-lead-modal");

    // Leads table and validation
    this.leadsTable = page.getByTestId("leads-table");
    this.leadRows = this.leadsTable.getByTestId("open-lead");
    this.duplicateEmailMessage = page.getByTestId("error-lead-email");

    // Activity timeline
    this.activityText = page.getByTestId("activity-text");
    this.logActivityButton = page.getByTestId("log-activity");
    this.activityTimeline = page.getByTestId("activity-timeline");
    this.activityItems = page.getByTestId("activity-item");
    this.noteValidationError = page.getByTestId("error-activity");

    // Lead conversion
    this.convertLeadButton = page.getByTestId("convert-lead");
    this.convertModal = page.getByTestId("convert-modal");
    this.dealValueInput = page.getByTestId("deal-value");
    this.dealCloseDropdown = page.getByTestId("deal-close");
    this.createDealButton = this.convertModal.getByRole("button", {
      name: "Create deal",
    });
    this.convertedBanner = page.getByTestId("converted-banner");
    this.viewPipelineLink = page.getByTestId("view-pipeline");
  }

  // New Lead form
  async openNewLeadForm() {
    await this.newLeadButton.click();
  }

  async fillLeadDetails(lead) {
    await this.contactNameInput.fill(lead.name);
    await this.companyInput.fill(lead.company);
    await this.emailInput.fill(lead.email);
    await this.phoneInput.fill(lead.phone);
    await this.sourceDropdown.selectOption({ label: lead.source });
    await this.estimatedValueInput.fill(lead.value);
  }

  async saveLead() {
    await this.saveLeadButton.click();
  }

  async createLead(lead) {
    await this.openNewLeadForm();
    await this.fillLeadDetails(lead);
    await this.saveLead();
  }

  async enterExistingEmailDetails(lead) {
  await this.fillLeadDetails(lead);
  await this.saveLeadButton.click();

  await this.duplicateEmailMessage.waitFor({
    state: "visible",
    timeout: 5000,
  });
}

  async isDuplicateEmailMessageVisible() {
    return await this.duplicateEmailMessage.isVisible();
  }

  async submitLeadWithoutContactName() {
    await this.contactNameInput.clear();
    await this.saveLeadButton.click();
  }

  async isContactNameValidationVisible() {
    const message = this.page.getByText(
      "Enter the contact's name",
      { exact: true }
    );

    await message.waitFor({ state: "visible" });
    return await message.isVisible();
  }

  async isNewLeadModalVisible() {
    await this.newLeadModal.waitFor({ state: "visible" });
    return await this.newLeadModal.isVisible();
  }

  async getVisibleNewLeadFormFields() {
    const fields = this.newLeadModal.locator("input, select, textarea");
    const count = await fields.count();
    const visibleFields = [];

    for (let i = 0; i < count; i++) {
      const field = fields.nth(i);

      if (await field.isVisible()) {
        visibleFields.push(field);
      }
    }

    return visibleFields;
  }

  // Lead verification and navigation
  async isLeadDisplayed(leadName) {
    const createdLead = this.leadRows.filter({ hasText: leadName });

    await createdLead.waitFor({ state: "visible" });
    return (await createdLead.count()) === 1;
  }

  async openLead(leadName) {
    const lead = this.leadRows.filter({ hasText: leadName });

    await lead.waitFor({ state: "visible" });
    await lead.click();
    await this.page.waitForURL(/\/apps\/crm\/leads\/[^/]+$/);
  }

  async isLeadDetailsDisplayed(leadName) {
    const heading = this.page.getByRole("heading", {
      name: leadName,
      exact: true,
    });

    await heading.waitFor({ state: "visible" });
    return await heading.isVisible();
  }

  async getLeadCount() {
    return await this.leadRows.count();
  }

  async searchLead(leadName) {
    const searchInput = this.page.getByTestId("lead-search");
    await searchInput.fill(leadName);

    const matchingLead = this.leadRows.filter({ hasText: leadName });
    await matchingLead.waitFor({ state: "visible" });

    return (await matchingLead.count()) === 1;
  }

  // Activity timeline
  async enterNote(note) {
    await this.activityText.fill(note);
  }

  async saveNote() {
    await this.logActivityButton.click();
  }

  async getActivityCount() {
    return await this.activityItems.count();
  }

  async getLatestActivityText() {
    const count = await this.activityItems.count();

    if (count === 0) {
      throw new Error("No activity was found in the timeline.");
    }

    return (await this.activityItems.last().innerText()).trim();
  }

  async isActivityTimestampVisible() {
    const latestActivity = this.activityItems.last();
    const timestamp = latestActivity.locator("span.text-muted");

    return await timestamp.isVisible();
  }

  async isNoteValidationErrorVisible() {
    return await this.noteValidationError.isVisible();
  }

  // Lead conversion
  async convertLeadToDeal(dealValue = "25000") {
    await this.convertLeadButton.waitFor({ state: "visible" });
    await this.convertLeadButton.click();
    await this.convertModal.waitFor({ state: "visible" });

    await this.dealValueInput.fill(dealValue);
    await this.dealCloseDropdown.selectOption("30");
    await this.createDealButton.click();

    await this.convertedBanner.waitFor({
      state: "visible",
      timeout: 10000,
    });
  }

  async isLeadConvertedToDeal() {
    await this.convertedBanner.waitFor({ state: "visible" });
    return await this.convertedBanner.isVisible();
  }

  async getConvertedDealId() {
    await this.convertedBanner.waitFor({ state: "visible" });

    const bannerText = await this.convertedBanner.innerText();
    const match = bannerText.match(/D-[A-Z0-9]+/i);

    if (!match) {
      throw new Error(
        `Converted deal ID was not found. Banner text: "${bannerText}"`
      );
    }

    return match[0].toUpperCase();
  }

  async openConvertedDealInPipeline() {
    await this.viewPipelineLink.click();
  }
}

module.exports = LeadManagementPage;