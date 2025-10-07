# 🚀 Quick Start Guide

Get started with Duck Creek test automation in 5 minutes!

## Step 1: Generate Test Scenarios from Requirements

We've included example requirements. Generate scenarios from them:

```bash
npm run cli generate scenarios/example-requirements.json
```

This will:
- ✅ Read 5 example requirements
- ✅ Generate 15+ test scenarios (happy path, negative, edge cases)
- ✅ Create executable Playwright test files in `tests/`

## Step 2: View Generated Scenarios

```bash
npm run cli list-scenarios
```

## Step 3: Explore the Duck Creek Application

Before running tests, let's map the actual UI selectors:

```bash
# Option 1: Use our page explorer
npm run explore

# Option 2: Use Playwright's interactive codegen
npm run codegen
```

This opens the Duck Creek login page and helps you:
- Identify correct selectors
- Understand the page structure
- Generate test code interactively

## Step 4: Run Your First Test

```bash
# Run tests with visible browser
npm run test:headed

# Or run in headless mode
npm test
```

## Step 5: View Test Results

```bash
npm run report
```

Opens an interactive HTML report with:
- Test execution timeline
- Screenshots
- Error details
- Videos (on failure)

---

## Next Steps

### Create Your Own Requirements

1. Create a new JSON file in `scenarios/`:

```json
[
  {
    "id": "REQ-100",
    "title": "Your Requirement Title",
    "description": "What the feature should do",
    "acceptance_criteria": [
      "Criterion 1",
      "Criterion 2"
    ],
    "module": "Policy",
    "priority": "high"
  }
]
```

2. Generate scenarios:

```bash
npm run cli generate scenarios/your-requirements.json
```

3. Run tests:

```bash
npm test
```

### Update Page Objects with Real Selectors

After exploring the Duck Creek UI, update the selectors in page objects:

**[pages/LoginPage.ts](pages/LoginPage.ts)**
```typescript
// Update these based on actual Duck Creek selectors
this.usernameInput = page.locator('#actual-username-id');
this.passwordInput = page.locator('#actual-password-id');
this.loginButton = page.locator('button[data-action="login"]');
```

### Add More Page Objects

Create page objects for other Duck Creek modules:

**pages/PolicyPage.ts**
```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PolicyPage extends BasePage {
  readonly newPolicyBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.newPolicyBtn = page.locator('[data-action="new-policy"]');
  }

  async createPolicy(data: any) {
    await this.newPolicyBtn.click();
    // Add your policy creation steps
  }
}
```

### Run Tests by Tag

```bash
# Run only high-priority tests
npx playwright test --grep @high

# Run only Policy module tests
npx playwright test --grep @Policy

# Run happy path tests only
npx playwright test --grep @happy-path

# Combine tags
npx playwright test --grep "@high.*@Policy"
```

### Advanced Features

**Run tests in parallel:**
```bash
npx playwright test --workers=4
```

**Debug a specific test:**
```bash
npm run test:debug tests/login.spec.ts
```

**Run tests with UI mode (interactive):**
```bash
npm run test:ui
```

**Generate tests from a live session:**
```bash
npm run codegen
# Perform actions in the browser
# Playwright generates test code for you
```

---

## Common Workflows

### Daily Testing Workflow

1. Pull latest code
2. Generate scenarios from new requirements
3. Update page objects if UI changed
4. Run tests: `npm test`
5. Review report: `npm run report`
6. Fix failing tests
7. Commit passing tests

### New Feature Testing

1. Get requirements document
2. Create JSON file: `scenarios/req-xxx-requirements.json`
3. Generate: `npm run cli generate scenarios/req-xxx-requirements.json`
4. Create page objects for new screens
5. Update generated tests with specific actions
6. Run: `npm run test:headed` (to watch execution)
7. Refine and iterate

### Debugging Failed Tests

1. Check HTML report: `npm run report`
2. View screenshot at failure point
3. Watch video recording (if available)
4. Run test in debug mode: `npm run test:debug tests/failing-test.spec.ts`
5. Step through test execution
6. Fix selectors or test logic
7. Re-run: `npm test`

---

## Tips & Tricks

### 💡 Use Data-Test-IDs

If you control the Duck Creek configuration, add `data-testid` attributes for reliable selectors:

```typescript
page.locator('[data-testid="new-policy-button"]')
```

### 💡 Wait for Specific Conditions

```typescript
await page.waitForSelector('.policy-saved-message');
await page.waitForURL('**/policies/**');
await page.waitForLoadState('networkidle');
```

### 💡 Handle Dynamic Content

```typescript
// Wait for AJAX to complete
await page.waitForResponse(resp =>
  resp.url().includes('/api/policy') && resp.status() === 200
);
```

### 💡 Reuse Common Actions

Add methods to `BasePage.ts`:

```typescript
async selectDropdown(locator: Locator, value: string) {
  await locator.selectOption(value);
}

async fillDate(locator: Locator, date: string) {
  await locator.fill(date);
  await locator.press('Enter');
}
```

---

## Troubleshooting

**Tests are slow:**
- Increase timeout in `playwright.config.ts`
- Use `waitForLoadState('domcontentloaded')` instead of `'networkidle'`
- Run fewer workers

**Selectors keep breaking:**
- Use more stable selectors (data-testid, role, label)
- Avoid CSS classes that might change
- Use relative positioning

**Can't login:**
- Check `.env` credentials
- Verify baseURL in `playwright.config.ts`
- Run `npm run explore` to inspect login page

**Tests pass locally but fail in CI:**
- Add more explicit waits
- Increase timeouts
- Check for timing issues
- Use retry strategy

---

## Getting Help

1. Check the [README.md](README.md) for detailed documentation
2. Review example tests in `tests/`
3. Run `npm run cli help` for CLI commands
4. Check Playwright docs: https://playwright.dev

Happy Testing! 🎉
