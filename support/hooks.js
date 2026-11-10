require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");

const {
  Before,
  After,
  Status,
  setDefaultTimeout,
} = require("@cucumber/cucumber");

const { chromium, firefox, webkit } = require("playwright");

setDefaultTimeout(30000);

const browsers = { chromium, firefox, webkit };
const screenshotDir = path.join(process.cwd(), "screenshots");
const traceDir = path.join(process.cwd(), "traces");

fs.mkdirSync(screenshotDir, { recursive: true });
fs.mkdirSync(traceDir, { recursive: true });

Before(async function () {
  const browserName = (process.env.BROWSER || "chromium").toLowerCase();
  const browserType = browsers[browserName];

  if (!browserType) {
    throw new Error(
      `Unsupported BROWSER="${browserName}". Use chromium, firefox, or webkit.`,
    );
  }

  const headless =(process.env.HEADLESS || (process.env.CI ? "true" : "false")).toLowerCase() === "true";
  const launchOptions = { headless };

  if (browserName === "chromium" && process.env.CHROME_CHANNEL === "chrome") {
    launchOptions.channel = "chrome";
  }

  console.log(`Starting ${browserName} (headless=${headless})...`);

  this.browser = await browserType.launch(launchOptions);

  this.context = await this.browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  await this.context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  this.page = await this.context.newPage();

  console.log(`${browserName} launched successfully.`);
});

After(async function (scenario) {
  const failed = scenario.result?.status === Status.FAILED;
  const timestamp = Date.now();

  try {
    if (failed && this.page) {
      const screenshotPath = path.join(
        screenshotDir,
        `failure-${timestamp}.png`,
      );

      try {
        await this.page.screenshot({
          path: screenshotPath,
          fullPage: true,
        });
        console.log(`Failure screenshot saved: ${screenshotPath}`);
      } catch (error) {
        console.error("Could not save failure screenshot:", error.message);
      }
    }

    if (this.context) {
      if (failed) {
        const tracePath = path.join(traceDir, `failure-${timestamp}.zip`);

        try {
          await this.context.tracing.stop({ path: tracePath });
          console.log(`Failure trace saved: ${tracePath}`);
        } catch (error) {
          console.error("Could not save failure trace:", error.message);
        }
      } else {
        await this.context.tracing.stop();
      }
    }
  } finally {
    if (this.browser) {
      await this.browser.close();
    }
  }
});
