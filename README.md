# SalesPulse UI Test Automation

A Playwright and Cucumber proof of concept for testing the SalesPulse CRM web application. Scenarios are written in Gherkin, with reusable browser interactions organized using the Page Object Model (POM).

## Features

- Readable Gherkin scenarios for CRM workflows
- Page objects for reusable page locators and actions
- Cucumber HTML execution report
- Failure screenshots and Playwright traces
- Chromium by default, with optional Firefox and WebKit runs

## Technology

| Tool | Purpose |
| --- | --- |
| JavaScript and Node.js | Test implementation and runtime |
| Playwright | Browser automation |
| Cucumber.js | Gherkin test execution |
| dotenv | Local environment configuration |

## Project Structure

PW-POC-08-SalesPulse/
├── config/                 # Test configuration
├── features/               # Gherkin feature files
├── pages/                  # Page Object Model classes
├── reports/                # Generated Cucumber HTML report
├── screenshots/            # Screenshots captured for failures
├── step-definitions/       # Gherkin step implementations
├── support/                # Cucumber hooks and browser lifecycle
├── test-data/              # Test data
├── traces/                 # Playwright traces captured for failures
├── .env.example            # Environment variable template
├── cucumber.js             # Cucumber configuration
├── package.json            # Dependencies and npm scripts
└── package-lock.json       # Locked dependency versions



├── .vscode/
├── config/
├── features/
│   ├── footer.feature
│   ├── leads.feature
│   ├── lead_management.feature
│   ├── login.feature
│   └── pipeline.feature
├── pages/
│   ├── FooterPage.js
│   ├── LeadManagementPage.js
│   ├── LeadsPage.js
│   ├── LoginPage.js
│   └── PipelinePage.js
├── reports/
│   └── cucumber-report.html
├── screenshots/
├── step-definitions/
│   ├── footer.steps.js
│   ├── leads.steps.js
│   ├── lead_management.steps.js
│   ├── login.steps.js
│   └── pipeline.steps.js
├── support/
│   └── hooks.js
├── test-data/
├── traces/
├── .env.example
├── .gitignore
├── cucumber.js
├── package.json
└── package-lock.json

## Prerequisites

- Node.js LTS and npm
- Access to the target SalesPulse CRM application
- Valid test credentials for the application

Check your Node.js and npm versions:

```powershell
node --version
npm --version
```

## Setup

Run these commands from the project root in PowerShell:

```powershell
npm install
npx playwright install chromium
Copy-Item .env.example .env
```

Open `.env` and provide the application URL and approved test credentials:

```dotenv
BASE_URL=https://www.practiceqaautomation.com/apps/crm
CRM_EMAIL=your_test_email
CRM_PASSWORD=your_test_password
```

Do not commit `.env` or put real credentials in source files. The checked-in `.env.example` contains placeholders for credentials.

## Run Tests

Run the complete suite:

```powershell
npm test
```

Run the valid-credentials login scenario:

```powershell
npm run test:login
```

Run an individual feature:

```powershell
npx cucumber-js features/login.feature
npx cucumber-js features/leads.feature
npx cucumber-js features/lead_management.feature
npx cucumber-js features/pipeline.feature
npx cucumber-js features/footer.feature
```

The hooks launch a visible Chromium browser by default. To use an installed Google Chrome instead:

```powershell
$env:BROWSER = "chromium"
$env:CHROME_CHANNEL = "chrome"
npx cucumber-js features/login.feature
```

Firefox and WebKit are optional. Install their browsers first with `npx playwright install firefox webkit`, then select one for the current PowerShell session:

```powershell
$env:BROWSER = "firefox"
npm test
```

```powershell
$env:BROWSER = "webkit"
npm test
```

WebKit provides browser-engine coverage; it is not a substitute for testing in native Safari on macOS or iOS. To restore the default configuration in the current session:

```powershell
$env:BROWSER = "chromium"
Remove-Item Env:CHROME_CHANNEL -ErrorAction SilentlyContinue
```

## Reports and Failure Artifacts

- **HTML report:** `reports/cucumber-report.html`. Open it after a run with `Invoke-Item reports/cucumber-report.html`.
- **Screenshots:** Full-page screenshots for failed scenarios are saved in `screenshots/`.
- **Traces:** Playwright trace archives for failed scenarios are saved in `traces/`. Open one with `npx playwright show-trace traces/failure-<timestamp>.zip`, replacing the example filename with the generated archive name.

The HTML report is regenerated on subsequent runs. Screenshots and traces may contain page content or test data; review them before sharing.

## Coverage

The current feature files cover login, leads, lead management, pipeline workflows, and footer links. Run `npm test` to see the current results; previous run counts may not reflect the current state of the suite.

## Troubleshooting

- **Browser executable is missing:** Run `npx playwright install chromium`, or install the browser you selected with `BROWSER`.
- **URL or credentials are unavailable:** Confirm `.env` exists in the project root and contains the expected values.
- **The wrong browser launches:** Check `BROWSER` and `CHROME_CHANNEL` in the current PowerShell session.
- **A scenario fails:** Review the HTML report, failure screenshot, and matching trace archive.

## Security and Project Status

Generated reports, screenshots, traces, `node_modules/`, and `.env` are excluded from version control by the project's `.gitignore`. Keep real credentials and customer data out of committed files, and review failure artifacts before sharing them.

This repository is a proof of concept. Validate browser coverage, test stability, test-data management, CI execution, and artifact retention against project requirements before relying on it as a production test framework.