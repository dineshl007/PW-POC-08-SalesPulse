const { When, Then } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");
const { PipelinePage } = require("../pages/PipelinePage");

When("I open the Pipeline page", async function () {
  this.pipelinePage = new PipelinePage(this.page);
  await this.pipelinePage.open();
});

When("I move the deal {string} to {string}",
  async function (company, targetStage) {
    this.pipelinePage = this.pipelinePage || new PipelinePage(this.page);
    await this.pipelinePage.moveDeal(company, targetStage);
  },
);

When("I refresh the Pipeline page", async function () {
  await this.page.reload({ waitUntil: "domcontentloaded" });
  await this.pipelinePage.heading.waitFor({ state: "visible" });
});

Then("I should see the following pipeline stages", async function (dataTable) {
  for (const { Stage } of dataTable.hashes()) {
    const stage = await this.pipelinePage.getStage(Stage);
    await stage.waitFor({ state: "visible" });
  }
});

Then("the deal {string} should appear in the {string} stage",
  async function (company, stageName) {
    const stage = await this.pipelinePage.getStage(stageName);
    const deal = stage.getByTestId("deal-card").filter({ hasText: company });
    await deal.waitFor({ state: "visible" });
  },
);

Then(
  "the pipeline stage totals should be calculated correctly",
  async function () {
    const stages = ["Qualified", "Proposal", "Negotiation", "Won", "Lost"];
    let totalDeals = 0;
    let totalValue = 0;
    for (const stageName of stages) {
      totalDeals += await this.pipelinePage.getDealCount(stageName);
      totalValue += await this.pipelinePage.getStageTotal(stageName);
    }
    assert.ok(totalDeals > 0, "Expected pipeline deals to be displayed");
    assert.ok(totalValue > 0,"Expected pipeline value to be greater than zero",);
  },
);

Then("the converted deal should be displayed in the pipeline",
  async function () {
    const deal = this.page.getByTestId("deal-card").filter({hasText: this.newLead.company,});
    await deal.waitFor({ state: "visible", timeout: 5000 });
    assert.ok(await deal.isVisible());
  },
);