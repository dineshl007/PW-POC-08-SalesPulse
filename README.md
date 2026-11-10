# SalesPulse UI Test Automation — PW-POC-08

## 1. Project Overview

SalesPulse UI Test Automation is a Proof of Concept (POC) for automating business workflows in the SalesPulse CRM web application using Playwright, JavaScript, and Cucumber.js.

The project uses Gherkin feature files to describe test scenarios and the Page Object Model (POM) to organize reusable page locators and browser interactions.

The objective is to demonstrate maintainable UI automation, business workflow validation, negative testing, browser compatibility, and automated test reporting.

**Application under test:** [SalesPulse CRM](https://www.practiceqaautomation.com/apps/crm)

**Project status:** Proof of Concept — further validation and improvements are required before acceptance as a complete automation framework.

## 2. Objectives

- Automate critical CRM workflows.
- Validate login, lead management, and deal pipeline functionality.
- Extract and verify business outcomes using meaningful assertions.
- Implement positive, negative, and boundary test scenarios.
- Reuse browser interactions through page objects.
- Generate Cucumber HTML reports and diagnostic artifacts.
- Support Chromium, Firefox, and WebKit execution.
- Document setup, execution, test coverage, and known limitations.

## 3. Features

- Readable Gherkin scenarios using Cucumber.js.
- Page Object Model for reusable page interactions.
- Login and authentication scenarios.
- Lead creation and lead management scenarios.
- Deal pipeline management and stage-transition scenarios.
- Footer link checks.
- Positive and negative validation scenarios.
- Cucumber HTML execution reporting.
- Failure screenshots and Playwright trace support.
- Browser selection through environment variables.
- Environment-based configuration using dotenv.

## 4. Technology Stack

| Technology | Purpose |
|---|---|
| JavaScript | Test implementation |
| Node.js and npm | Runtime and dependency management |
| Playwright | Browser automation |
| Cucumber.js | BDD test execution |
| Gherkin | Business-readable test scenarios |
| Page Object Model | Reusable page locators and actions |
| dotenv | Environment configuration |
| VS Code | Development and debugging |

## 5. Project Structure

```text
PW-POC-08-SalesPulse/
├── .vscode/
│   └── settings.json
├── config/
├── features/
│   ├── footer.feature
│   ├── lead_management.feature
│   ├── leads.feature
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
│   ├── lead_management.steps.js
│   ├── leads.steps.js
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
├── package-lock.json
└── README.md
```

**Directory responsibilities**

- `config/` — configuration-related files, if implemented.
- `features/` — Gherkin feature files and scenarios.
- `pages/` — Page Object Model classes.
- `reports/` — generated Cucumber HTML reports.
- `screenshots/` — screenshots captured during test failures.
- `step-definitions/` — implementations of Gherkin steps.
- `support/` — Cucumber hooks and browser lifecycle management.
- `test-data/` — test data files, if implemented.
- `traces/` — Playwright trace archives, if generated.
- `.env.example` — template for required environment variables.
- `cucumber.js` — Cucumber configuration.
- `package.json` — project dependencies and npm scripts.
- `package-lock.json` — locked dependency versions.

Generated reports, screenshots, traces, and local credentials may not exist until the relevant test runs or setup steps are completed.

## 6. Test Coverage

The project currently contains five feature files covering the following areas.

| Feature file | Coverage area |
|---|---|
| `login.feature` | Login and authentication scenarios |
| `leads.feature` | Lead-related operations |
| `lead_management.feature` | Lead management and related workflows |
| `pipeline.feature` | Deal pipeline and stage management |
| `footer.feature` | Footer links and navigation checks |

The reported repository review identified 25 scenarios, tagged from `TC-001` to `TC-026`, with gaps in end-to-end workflow coverage and some business assertions.

The coverage areas include:

- Valid, invalid, and empty login inputs.
- Lead creation and duplicate-email validation.
- Contact and note validation.
- Lead filtering and no-results behavior.
- Pipeline stage transitions and persistence after refresh.
- Footer navigation checks.

**Coverage status:** The scenario list describes the current scope; it does not establish that every scenario passes or meets its acceptance criteria. Review the latest execution report and scenario assertions to determine actual coverage.

## 7. Prerequisites

Install the following:

- Node.js LTS.
- npm.
- Visual Studio Code or another compatible editor.
- Access to the target SalesPulse CRM application.
- Approved test credentials.

Verify the installation:

```bash
node --version
npm --version
```

## 8. Environment Configuration and Credentials

Create a local `.env` file from the provided template.

### PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Configure the required values in `.env` using the actual variable names expected by the project:

```dotenv
BASE_URL=https://www.practiceqaautomation.com/apps/crm
CRM_EMAIL=your_approved_test_email
CRM_PASSWORD=your_approved_test_password
```

Use only approved test credentials supplied by the project owner or environment administrator. Replace the example values with your own authorized test values.

**Security requirements**

- Never commit `.env` to GitHub.
- Do not place real credentials in feature files, page objects, or step definitions.
- Keep `.env.example` limited to placeholder values.
- Ensure `.gitignore` excludes `.env`.
- Review screenshots, traces, and reports before sharing because they may contain sensitive page content.

The `.env` variables must match the names used by the current project code.

## 9. Installation

Open a terminal in the project root.

Install dependencies:

```bash
npm install
```

Install Chromium:

```bash
npx playwright install chromium
```

To run Firefox and WebKit, install their browsers:

```bash
npx playwright install firefox webkit
```

These commands install browser binaries; the browser tests still need to be executed to demonstrate compatibility.

## 10. Running the Tests

### Run the complete test suite

```bash
npm test
```

This command assumes the `test` script is configured in `package.json`.

### Run the login feature

```bash
npm run test:login
```

This command assumes the `test:login` script exists in `package.json`.

### Run individual features

```bash
npx cucumber-js features/login.feature
npx cucumber-js features/leads.feature
npx cucumber-js features/lead_management.feature
npx cucumber-js features/pipeline.feature
npx cucumber-js features/footer.feature
```

If the project uses custom Cucumber profiles or configuration, use the corresponding configured command.

## 11. Browser Configuration

The project supports browser selection through environment variables where implemented.

### Chromium

```powershell
$env:BROWSER = "chromium"
npm test
```

### Google Chrome channel

```powershell
$env:BROWSER = "chromium"
$env:CHROME_CHANNEL = "chrome"
npm test
```

### Firefox

```powershell
$env:BROWSER = "firefox"
npm test
```

### WebKit

```powershell
$env:BROWSER = "webkit"
npm test
```

To restore the default browser selection in PowerShell:

```powershell
$env:BROWSER = "chromium"
Remove-Item Env:CHROME_CHANNEL -ErrorAction SilentlyContinue
```

These commands assume the hooks read the specified environment variables and launch the selected browser.

WebKit provides browser-engine coverage; it is not equivalent to testing native Safari on macOS or iOS.

**Cross-browser status:** Record the actual result for each browser after execution. Browser configuration alone is not evidence of successful cross-browser testing.

## 12. Reports and Debugging

### Cucumber HTML report

The configured report location is:

```text
reports/cucumber-report.html
```

Open it in PowerShell:

```powershell
Invoke-Item reports/cucumber-report.html
```

The report is generated or updated according to the current Cucumber configuration.

### Failure screenshots

Screenshots are intended to be saved in:

```text
screenshots/
```

### Playwright traces

Trace archives are intended to be saved in:

```text
traces/
```

Open a generated trace:

```bash
npx playwright show-trace traces/<actual-trace-filename>.zip
```

Replace the placeholder with the real filename created by the test run.

**Execution evidence:** Attach or reference a genuine test report and representative failure artifacts when submitting the POC. Do not claim a pass count or browser result without an actual run.

## 13. Test Assertions and Validation

Automation should validate business outcomes, not only page navigation or element presence.

Examples of useful assertions include:

- Confirm that login succeeds with valid credentials.
- Confirm that invalid credentials produce the expected error.
- Confirm that a newly created lead appears in the lead list.
- Confirm that duplicate-email validation prevents an invalid duplicate record.
- Confirm that a pipeline stage changes to the expected target.
- Confirm that the deal value remains correct after a stage transition.
- Confirm that the updated pipeline state persists after refreshing the page.

The actual expected results should be based on the application's behavior and the acceptance criteria for each scenario.

## 14. Known Limitations and Improvement Areas

The current review identified the following areas requiring further work:

1. Domain overview and workflow documentation need to be added.
2. Three critical end-to-end workflows need to be demonstrated.
3. Some assertions need stronger business-outcome validation.
4. Test data and seed values need more maintainable management.
5. Cross-browser execution evidence needs to be produced.
6. Browser headless mode and CI execution need improvement.
7. Page-object responsibilities and duplicated locators need review.
8. Field validation and boundary-case coverage need expansion.
9. Screenshots and traces should be reviewed for appropriate report attachment and retention.
10. The use of JavaScript should be confirmed against the project's TypeScript requirement.

These are improvement items, not claims that every issue has already been resolved.

## 15. Continuous Integration

A CI workflow has not been demonstrated in the reviewed repository.

A future CI setup should:

- Install the required Node.js version and npm dependencies.
- Install the required Playwright browser binaries.
- Load credentials through secure CI secrets.
- Run the intended test suite in headless mode.
- Publish test reports and appropriate failure artifacts.
- Return a failing status when required assertions fail.

Add a CI workflow only after confirming the required execution commands and environment settings.

## 16. Troubleshooting

### Browser executable missing

Install the required browser:

```bash
npx playwright install chromium
```

For Firefox or WebKit, install the relevant browser binaries.

### Environment variables are missing

Confirm that `.env` exists in the project root and contains the variable names used by the code.

### The wrong browser launches

Check `BROWSER`, `CHROME_CHANNEL`, and the browser-launching logic in `support/hooks.js`.

### A scenario fails

Review:

1. The Cucumber console output.
2. The generated HTML report.
3. The screenshot, if generated.
4. The Playwright trace, if generated.
5. The relevant feature file, step definition, and page object.

### The test passes without validating the expected business result

Review the assertions in the step definition and page object. Replace weak checks with explicit assertions against the expected application state.

## 17. Future Enhancements

- Complete three critical end-to-end workflows.
- Strengthen assertions for business outcomes.
- Move hard-coded values into reusable test data.
- Add missing email-format and boundary validations.
- Investigate drag-and-drop pipeline interaction where supported.
- Improve page-object and component separation.
- Demonstrate Chromium, Firefox, and WebKit execution.
- Add CI integration and headless execution.
- Improve report attachment and artifact management.
- Add linting and formatting checks where appropriate.

## 18. Conclusion

SalesPulse UI Test Automation is a Playwright and Cucumber proof of concept demonstrating BDD-style scenario definition, reusable page objects, CRM workflow automation, and test reporting.

The framework provides a useful foundation. The next steps are to strengthen business assertions, complete required end-to-end coverage, make execution reproducible, improve test-data management, and provide verifiable execution evidence.

The POC should be considered ready for acceptance only after the required criteria have been implemented, executed, and reviewed.