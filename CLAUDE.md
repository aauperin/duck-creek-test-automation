# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Duck Creek Test Automation Framework - Automated testing framework for Duck Creek Policy/Claims/Billing using Playwright and TypeScript. The core feature is intelligent requirements-to-test generation: JSON requirements are automatically converted into test scenarios (happy path, negative, edge cases) and executable Playwright tests.

## Environment Setup

Credentials are stored in `.env`:
```
DC_BASE_URL=https://your-instance.duckcreekondemand.com/policy/
DC_USERNAME=YOUR_USERNAME
DC_PASSWORD="YOUR_PASSWORD"
```

**IMPORTANT**: Passwords with special characters (#, $, etc.) MUST be quoted in .env to avoid being interpreted as comments.

TypeScript configuration uses CommonJS modules with ES2020 target. Project uses ts-node for direct TypeScript execution without compilation step.

### System Dependencies

If you get browser launch errors, install Playwright dependencies:
```bash
sudo npx playwright install-deps
```

The framework runs in headless mode by default (no GUI required), suitable for SSH/remote environments.

## Common Commands

### Running Tests
- `npm test` - Run all tests headless
- `npm run test:headed` - Run tests with visible browser (use for debugging)
- `npm run test:ui` - Interactive UI mode (best for exploring test execution)
- `npm run test:debug` - Step-through debugging mode
- `npx playwright test <file>` - Run specific test file
- `npx playwright test --grep @happy-path` - Run tests by tag

### Scenario Generation (Core Workflow)
- `npm run cli generate <requirements-file>` - Generate scenarios and tests from requirements JSON
- `npm run cli list-scenarios` - List all generated scenarios
- `npm run generate:scenarios` - Run default scenario generator (example usage)

### UI Exploration
- `npm run explore` - Explore login page (extracts selectors, saves to reports/login-page-structure.json)
- `npx ts-node utils/pageExplorer.ts home` - Explore home page after login (saves to reports/home-page-structure.json)
- `npx ts-node utils/inspectLoginPage.ts` - Detailed login page inspection with suggestions
- `npm run codegen` - Playwright's built-in codegen tool (requires X server/GUI)

### Test Data and Reporting
- `npm run generate:testdata` - Generate test data
- `npm run report` - Open HTML test report (standard Playwright report)
- `npm run report:evidence` - Generate consolidated evidence report with all screenshots/videos (custom HTML)

## Architecture

### Three-Tier Generation System

1. **Requirements Layer** (`scenarios/*.json`): JSON files containing business requirements with acceptance criteria
2. **Scenario Generator** (`utils/scenarioGenerator.ts`): Core engine that transforms requirements into test scenarios
   - Generates 3 scenario types per requirement: happy-path, negative (one per acceptance criteria), edge-case
   - Each scenario contains structured test steps with actions, data, and expectations
   - Auto-tags scenarios with module, priority, and type for filtering
3. **Test Generator**: Scenarios are automatically converted to executable Playwright test files in `tests/`

### Page Object Model

- `BasePage.ts`: Base class providing common methods (navigate, waitForPageLoad, takeScreenshot, getElementText, waitForElement)
- Module-specific page objects (e.g., `LoginPage.ts`) extend BasePage and define locators + actions
- All page objects use Playwright's Locator pattern for reliability

### Key Generators

**scenarioGenerator.ts**:
- `generateScenariosFromRequirement()`: Main entry point - returns TestScenario[]
- `generatePlaywrightTest()`: Converts scenario to executable test code
- `saveScenariosToFile()` / `savePlaywrightTest()`: Persistence layer
- Smart login detection: Only adds login steps to non-authentication tests

**cli.ts**: Command-line interface for batch operations on requirements files

### Test Structure

Generated tests follow pattern:
- Import LoginPage from pages/ (conditional based on scenario steps)
- Use test.describe() with scenario title
- Single test() block per scenario with scenario.id as test name
- Steps include comments with expected results
- Tests are tagged for filtering (@happy-path, @negative, @edge-case, @Policy, @Claims, @high, @medium, @low)

### Configuration

`playwright.config.ts`:
- Single browser: chromium (headless mode)
- Parallel execution enabled (fullyParallel: true)
- Screenshots: on (captured for every test)
- Videos: on (captured for every test)
- Traces: on (full trace for every test, rejouable with `npx playwright show-trace`)
- Timeouts: 15s action, 30s navigation, 60s test
- Reports: HTML + JSON + list format

## Development Workflow

1. Create/modify requirements JSON in `scenarios/` directory
2. Generate scenarios: `npm run cli generate scenarios/<file>.json`
3. Review generated tests in `tests/` directory - they contain TODO comments for implementation
4. **Explore UI to find selectors**:
   - Login page: `npm run explore` → `reports/login-page-structure.json`
   - After login: `npx ts-node utils/pageExplorer.ts home` → `reports/home-page-structure.json`
   - Check screenshots in `screenshots/` directory
5. Update page objects in `pages/` with actual selectors discovered from exploration
6. Implement TODO placeholders in generated tests with actual page object method calls
7. Run tests: `npm test` (all tests) or `npx playwright test tests/specific-test.spec.ts --workers=1` (single test)
8. Check results: `npm run report` (Playwright HTML) or `npm run report:evidence` (consolidated evidence)
9. Iterate on failing tests - screenshots/videos/traces are saved to test-results/

**Pro tip**: When testing new selectors, run a single test with `--workers=1` to avoid parallel execution issues.

## Working with Generated Tests

Generated tests contain placeholders like:
```typescript
// TODO: Implement step - Navigate to relevant module
// await page.click('selector');
```

Replace these with page object calls:
```typescript
const policyPage = new PolicyPage(page);
await policyPage.navigate();
```

Login steps are automatically generated with working code if credentials exist in scenario steps.

## File Locations

- Page objects: `pages/`
- Test files: `tests/`
- Scenarios (JSON): `scenarios/`
- Utility scripts: `utils/`
- Screenshots: `screenshots/` (full page screenshots for reference)
- Test results: `test-results/` (execution artifacts, videos on failure)
- HTML reports: `playwright-report/`
- Page analysis: `reports/` (output from pageExplorer)

## Module Tags

Tests are tagged by Duck Creek module:
- `@Authentication` - Login/session tests
- `@Policy` - Policy creation, search, endorsement
- `@Claims` - Claims submission and processing
- `@Billing` - Billing operations

Filter tests by module: `npx playwright test --grep @Policy`

## Adding New Page Objects

1. Create new file in `pages/` extending BasePage
2. Define readonly Locator properties for page elements
3. Initialize locators in constructor using `page.locator()`
4. Create action methods that combine locators (e.g., `async createPolicy()`)
5. Prefer data-testid attributes when available for selector stability
6. Use BasePage utility methods for common operations

## Known Duck Creek Selectors

### Login Page (working as of last exploration)
- Username field: `#username-inputEl` (name="_username")
- Password field: `#password-inputEl` (name="_password")
- **No submit button** - use `passwordField.press('Enter')` to submit
- Successful login redirects to: `*/defaultViewmodel`

### Home Page (after login)
- Search field: `#dfcb_0` (placeholder: "Search for Policies, Quotes, Bill Accounts or Claims")
- URL: `https://your-instance.duckcreekondemand.com/policy/me/express/defaultViewmodel`

## Common Issues & Solutions

### Password with # character not working
**Problem**: `.env` file treats `#` as comment delimiter
**Solution**: Quote the password: `DC_PASSWORD="YOUR_PASSWORD"`

### Browser fails to launch (Missing X server)
**Problem**: Headed mode requires GUI
**Solution**: All scripts now use `headless: true` by default

### Test passes but login actually failed
**Problem**: No assertions in test - just logs URL
**Solution**: Always use `expect()` assertions:
```typescript
expect(currentUrl).not.toBe('login-page-url');
expect(currentUrl).toContain('expected-keyword');
```

### Finding selectors for new pages
**Workflow**:
1. Run `npx ts-node utils/pageExplorer.ts home` (or modify for other pages)
2. Check `reports/home-page-structure.json` for all inputs/buttons/links
3. Check `screenshots/home-page.png` for visual reference
4. Use IDs or unique attributes found in JSON

## Test Data

Example requirements structure (5 examples in `scenarios/example-requirements.json`):
```json
{
  "id": "REQ-001",
  "title": "User Login to Duck Creek",
  "description": "User should be able to login...",
  "acceptance_criteria": ["Username is required", "Password is required"],
  "module": "Authentication",
  "priority": "high"
}
```

Each requirement generates multiple scenarios (typically 5-7 tests depending on acceptance criteria count).
