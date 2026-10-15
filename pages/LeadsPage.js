
class LeadsPage {
  constructor(page) {
    this.page = page;
    this.leadsNavigation = page.getByTestId("nav-leads");
    this.heading = page.getByRole("heading", { name: "Leads" });
    this.searchInput = page.getByTestId("lead-search");
    this.leadsTable = page.getByTestId("leads-table");
    this.leadRows = page.getByTestId("lead-row");
    this.newLeadButton = page.getByRole("button", { name: /New lead/i });
    this.statusFilter = page.getByTestId("lead-status-filter");
    this.sourceFilter = page.getByTestId("lead-source-filter");
    this.ownerDropdown = page.getByTestId("bulk-owner");
    this.applyAssignmentButton = page.getByTestId("apply-bulk");
    this.assignmentSuccessMessage = page.getByText(/lead\(s\) assigned to/i);
  }

  async open() {
    await this.leadsNavigation.click();
  }

  async searchLead(searchText) {
    await this.searchInput.fill(searchText);
  }

  async filterLeadsByStatus(status) {
    await this.statusFilter.selectOption({ label: status });
  }

  async filterLeadsBySource(source) {
    await this.sourceFilter.selectOption({ label: source });
  }

  async isNoMatchingLeadsMessageVisible() {
    const noLeadsMessage = this.page.getByTestId("no-leads");
    await noLeadsMessage.waitFor({ state: "visible" });

    return await noLeadsMessage
      .getByText("No leads match.", { exact: true })
      .isVisible();
  }

  async getLeadsTableHeaders() {
    await this.leadsTable.waitFor({ state: "visible" });

    const headers = this.leadsTable.locator("thead th");
    const headerCount = await headers.count();
    const headerTexts = [];

    for (let i = 0; i < headerCount; i++) {
      headerTexts.push((await headers.nth(i).innerText()).trim());
    }

    return headerTexts;
  }

  async getLeadRowCount() {
    await this.leadsTable.waitFor({ state: "visible" });
    return await this.leadRows.count();
  }

  async selectLeadForAssignment(leadName) {
    const row = this.leadsTable
      .getByTestId("lead-row")
      .filter({ hasText: leadName });

    await row.getByRole("checkbox").check();
  }

  async assignSelectedLeadsToOwner(ownerName) {
    await this.ownerDropdown.selectOption({ label: ownerName });
    await this.applyAssignmentButton.click();
  }

  async getLeadOwner(leadName) {
    const row = this.leadsTable
      .getByTestId("lead-row")
      .filter({ hasText: leadName });

    return (await row.locator("td").nth(5).innerText()).trim();
  }

  async isAssignmentSuccessVisible() {
    await this.assignmentSuccessMessage.waitFor({ state: "visible" });
    return await this.assignmentSuccessMessage.isVisible();
  }

  async verifyLeadsByStatusAndSource(status, source) {
    const rows = this.leadRows;
    const rowCount = await rows.count();
    let visibleCount = 0;

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);

      if (!(await row.isVisible())) {
        continue;
      }

      visibleCount++;

      const actualSource = (
        await row.locator("td").nth(3).innerText()
      ).trim();

      const actualStatus = (
        await row.locator("td").nth(4).innerText()
      ).trim();

      if (actualStatus !== status || actualSource !== source) {
        return false;
      }
    }

    return visibleCount > 0;
  }

  async getSelectedStatusFilter() {
    return (
      await this.statusFilter.locator("option:checked").innerText()
    ).trim();
  }

  async getSelectedSourceFilter() {
    return (
      await this.sourceFilter.locator("option:checked").innerText()
    ).trim();
  }

  async getLeadsCountText() {
    return (
      await this.page.locator("h1").locator("..").locator("..").innerText()
    ).trim();
  }
}

module.exports = { LeadsPage };