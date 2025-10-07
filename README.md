# Duck Creek Test Automation Framework

> **⚠️ Note:** This is a prototype/proof-of-concept created to demonstrate how a test automation framework could be initialized using Claude Code. It's a starting point that requires customization for actual Duck Creek environments.

Automated testing framework for Duck Creek Policy using Playwright and TypeScript with intelligent test scenario generation from requirements.

## 🎯 Features

- **Requirements-to-Scenario Generation**: Automatically generate test scenarios from requirement documents
- **Playwright Integration**: Modern, reliable end-to-end testing with TypeScript
- **Page Object Model**: Clean, maintainable page object architecture
- **Automatic Test Generation**: Convert scenarios to executable Playwright tests
- **Duck Creek Optimized**: Pre-configured for Duck Creek Policy, Claims, and Billing modules
- **Environment Management**: Secure credential handling with .env files
- **Rich Reporting**: HTML reports, screenshots, and videos on failure

## 📁 Project Structure

```
duckC/
├── pages/              # Page Object Models
│   ├── BasePage.ts    # Base page with common methods
│   └── LoginPage.ts   # Login page object
├── tests/             # Playwright test files
│   └── login.spec.ts  # Login test examples
├── scenarios/         # Generated test scenarios (JSON)
├── utils/             # Utility scripts
│   ├── pageExplorer.ts       # UI exploration tool
│   └── scenarioGenerator.ts  # Scenario generation engine
├── screenshots/       # Test screenshots
├── reports/          # Test reports and page analysis
├── test-results/     # Test execution results
└── .env             # Environment variables (credentials)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Configuration

The `.env` file contains your Duck Creek sandbox credentials:

```
DC_BASE_URL=https://your-instance.duckcreekondemand.com/policy/
DC_USERNAME=YOUR_USERNAME
DC_PASSWORD="YOUR_PASSWORD"
```

⚠️ **Important**: Quote passwords with special characters (#, $, etc.) to avoid `.env` parsing issues.

## 📖 Usage

### 1. Explore Duck Creek UI

Before writing tests, explore the application to understand its structure:

```bash
# Launch page explorer (opens browser, extracts selectors)
npm run explore

# OR use Playwright's built-in codegen
npm run codegen
```

This will:
- Open the Duck Creek application
- Extract all inputs, buttons, forms, and navigation elements
- Save structure to `reports/login-page-structure.json`
- Take screenshots for reference

### 2. Generate Test Scenarios from Requirements

Create a requirements file (JSON format):

```json
{
  "id": "REQ-001",
  "title": "Create New Policy",
  "description": "User should be able to create a new policy with valid customer information",
  "acceptance_criteria": [
    "Policy number must be unique",
    "Effective date cannot be in the past",
    "Customer information is required"
  ],
  "module": "Policy",
  "priority": "high"
}
```

Generate scenarios:

```bash
npm run generate:scenarios
```

This generates:
- **Happy path** test scenarios
- **Negative** test scenarios (validation)
- **Edge case** scenarios
- Executable Playwright test files in `tests/`

### 3. Run Tests

```bash
# Run all tests (headless)
npm test

# Run tests with browser visible
npm run test:headed

# Run tests with UI mode (interactive)
npm run test:ui

# Debug mode (step through tests)
npm run test:debug

# Run specific test file
npx playwright test tests/login.spec.ts

# Run tests in parallel
npx playwright test --workers=4
```

### 4. View Reports

```bash
# Open standard Playwright HTML report
npm run report

# Generate consolidated evidence report (all screenshots/videos in one HTML)
npm run report:evidence
```

All test executions capture:
- 📸 Screenshots at every step
- 🎥 Full video recordings
- 🔍 Playwright traces (rejouable with `npx playwright show-trace test-results/.../trace.zip`)

## 🛠️ Scenario Generation API

### Programmatic Usage

```typescript
import { ScenarioGenerator, Requirement } from './utils/scenarioGenerator';

// Define requirement
const requirement: Requirement = {
  id: 'REQ-002',
  title: 'Process Claim',
  description: 'Adjuster can process a claim and update claim status',
  acceptance_criteria: [
    'Claim amount must be within policy limits',
    'Valid claim number required'
  ],
  module: 'Claims',
  priority: 'high'
};

// Generate scenarios
const scenarios = ScenarioGenerator.generateScenariosFromRequirement(requirement);

// Save scenarios to file
ScenarioGenerator.saveScenariosToFile(scenarios, './scenarios/req-002-scenarios.json');

// Generate Playwright tests
scenarios.forEach(scenario => {
  ScenarioGenerator.savePlaywrightTest(scenario, './tests');
});
```

### Scenario Structure

Each generated scenario includes:

```typescript
{
  id: string;              // Unique scenario ID
  requirementId: string;   // Parent requirement
  title: string;           // Scenario title
  description: string;     // What's being tested
  steps: [                 // Test steps
    {
      step: number;
      action: string;
      data?: object;
      expected?: string;
    }
  ];
  expectedResult: string;  // Final expected outcome
  testData?: object;       // Test data
  tags?: string[];         // Tags for filtering
}
```

## 📝 Creating Page Objects

Example page object for Duck Creek modules:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PolicyPage extends BasePage {
  readonly newPolicyButton: Locator;
  readonly policyNumberInput: Locator;

  constructor(page: Page) {
    super(page);
    this.newPolicyButton = page.locator('[data-action="new-policy"]');
    this.policyNumberInput = page.locator('#policyNumber');
  }

  async createNewPolicy(policyData: any) {
    await this.newPolicyButton.click();
    await this.policyNumberInput.fill(policyData.policyNumber);
    // ... more actions
  }
}
```

## 🎨 Test Optimization Tips

1. **Parallel Execution**: Tests run in parallel by default
2. **Test Data Management**: Use fixtures for test data
3. **Reusable Actions**: Create helper methods in BasePage
4. **Smart Selectors**: Prefer `data-testid` attributes
5. **Retry Logic**: Configure retries in `playwright.config.ts`
6. **Screenshot on Failure**: Automatically enabled
7. **Video Recording**: Enabled on failure

## 📊 Reporting

After test execution, reports are available:

- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results/results.json`
- **Screenshots**: `screenshots/` directory
- **Videos**: `test-results/` directory (on failure)

## 🔧 Advanced Configuration

Edit `playwright.config.ts` to customize:

- Browsers to test on
- Timeouts
- Retry strategy
- Base URL
- Screenshot/video settings
- Parallel workers

## 🧪 Test Categories

Tests are automatically tagged:

- `happy-path`: Positive flow tests
- `negative`: Validation and error handling
- `edge-case`: Boundary conditions
- `Policy`, `Claims`, `Billing`: Module-specific tests
- `high`, `medium`, `low`: Priority levels

Filter tests by tag:

```bash
npx playwright test --grep @happy-path
npx playwright test --grep @Policy
npx playwright test --grep "@high.*@Policy"
```

## 📚 Next Steps

1. ✅ Run `npm run explore` to map the Duck Creek UI
2. ✅ Update selectors in page objects based on exploration
3. ✅ Create your first requirement document
4. ✅ Generate scenarios with `npm run generate:scenarios`
5. ✅ Run tests with `npm test`
6. ✅ Review HTML report
7. ✅ Iterate and expand coverage

## 🤝 Contributing

1. Add new page objects in `pages/`
2. Create reusable utilities in `utils/`
3. Document complex test scenarios
4. Update selectors as UI changes

## 📄 License

ISC
