class FooterPage {
  constructor(page) {
    this.page = page;
    this.footer = page.locator("footer");
    this.footerLinks = this.footer.locator("a");
  }

  async getFooterLinkDetails() {
    const links = [];
    const count = await this.footerLinks.count();

    for (let index = 0; index < count; index++) {
      const link = this.footerLinks.nth(index);
      links.push({text: (await link.innerText()).trim(),href: await link.getAttribute("href"),});
    }
    return links;
  }

  async getMainFooterLinks() {
    const links = await this.getFooterLinkDetails();
    const excludedLinkTexts = ["PracticeQAAutomation","Follow us on LinkedIn","Support this site","Privacy","Amir",];
    return links.filter((link) => {
      return !excludedLinkTexts.some((text) => link.text.includes(text));
    });
  }

  async getFooterLinkCount() {
    const links = await this.getMainFooterLinks();
    return links.length;
  }

  async openFooterLink(href) {
    const baseUrl = new URL(this.page.url()).origin;
    const targetUrl = new URL(href, baseUrl).href;
    const linkPage = await this.page.context().newPage();

    try {
      await linkPage.goto(targetUrl, {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });

      return {
        opened: true,
        url: linkPage.url(),
      };
    } catch (error) {
      return {
        opened: false,
        url: targetUrl,
        error: error.message,
      };
    } finally {
      await linkPage.close();
    }
  }
}
module.exports = FooterPage;