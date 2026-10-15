
class PipelinePage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByTestId('page-title');
    this.stageColumns = page.locator('[data-testid^="stage-"]');
    this.dealCards = page.getByTestId('deal-card');
  }

  async open() {
    await this.page.goto(`${process.env.BASE_URL}/pipeline`);
    await this.heading.waitFor({ state: 'visible' });
  }

  async getStage(stage) {
    return this.page.getByTestId(`stage-${stage.toLowerCase()}`);
  }

  async getDeal(company) {
    return this.dealCards.filter({ hasText: company });
  }

  async moveDeal(company, targetStage) {
    const deal = await this.getDeal(company);
    const dropdown = deal.getByRole('combobox');
    await dropdown.selectOption(targetStage.toLowerCase());
  }

  async getDealCount(stage) {
    const column = await this.getStage(stage);
    return column.getByTestId('deal-card').count();
  }

  async getStageTotal(stage) {
    const column = await this.getStage(stage);
    const totalText = await column.locator('header').innerText();
    const match = totalText.match(/\$[\d,]+/);
    if (!match) {
      throw new Error(`Could not find the total for stage: ${stage}`);
    }
    return Number(match[0].replace(/[$,]/g, ''));
  }
}
module.exports = { PipelinePage };