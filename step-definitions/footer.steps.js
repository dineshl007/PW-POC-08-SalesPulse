const { When, Then } = require("@cucumber/cucumber");
const assert = require("node:assert/strict");
const FooterPage = require("../pages/FooterPage");

function getFooterPage(world) {
  if (!world.footerPage) {
    world.footerPage = new FooterPage(world.page);
  }
  return world.footerPage;
}

When("I open each footer link", async function () {
  const footerPage = getFooterPage(this);
  this.footerLinkDetails = await footerPage.getFooterLinkDetails();
  this.footerLinkResults = [];
  for (const link of this.footerLinkDetails) {
    if (!link.href ||link.href.startsWith("#") ||link.href.startsWith("javascript:")) {
      this.footerLinkResults.push({text: link.text,opened: false,skipped: true,});
      continue;
    }
    const result = await footerPage.openFooterLink(link.href);
    this.footerLinkResults.push({text: link.text,...result,});
    console.log(result.opened ? "Opened:" : "Failed:", link.text, result.url);
  }
});

Then("each footer link should open successfully", async function () {
  const failedLinks = this.footerLinkResults.filter((result) => !result.opened && !result.skipped,);
  assert.equal(failedLinks.length,0,`Failed footer links: ${failedLinks.map((link) => link.text).join(", ")}`,);});

Then("the footer should contain {int} links", async function (expectedCount) {
  const footerPage = getFooterPage(this);
  const links = await footerPage.getMainFooterLinks();
  console.log(`Main footer link count: ${links.length}`);
  assert.equal(links.length,expectedCount,`Expected ${expectedCount} main footer links, but found ${links.length}`,);
});