# 🏗️ Framework Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Duck Creek Test Framework                     │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │   Requirements   │
                    │   (JSON/Docs)    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Scenario Generator│
                    │ (scenarioGenerator│
                    │      .ts)        │
                    └────────┬─────────┘
                             │
                    ┌────────┴─────────┐
                    │                  │
         ┌──────────▼──────────┐      │
         │  Test Scenarios     │      │
         │    (JSON files)     │      │
         └──────────┬──────────┘      │
                    │                  │
                    ▼                  ▼
         ┌──────────────────┐  ┌──────────────────┐
         │  Playwright Tests │  │  Test Reports    │
         │   (.spec.ts)      │  │  (HTML/JSON)     │
         └────────┬──────────┘  └──────────────────┘
                  │
                  ▼
         ┌──────────────────┐
         │  Page Objects    │
         │  (BasePage,      │
         │   LoginPage)     │
         └────────┬──────────┘
                  │
                  ▼
         ┌──────────────────┐
         │  Duck Creek      │
         │  Application     │
         │  (Sandbox)       │
         └──────────────────┘
```

---

## Component Architecture

### 1. Requirements Layer

**Purpose**: Define what needs to be tested

```json
{
  "id": "REQ-XXX",
  "title": "Feature name",
  "description": "What it does",
  "acceptance_criteria": ["criterion 1", "criterion 2"],
  "module": "Policy|Claims|Billing",
  "priority": "high|medium|low"
}
```

**Files**: `scenarios/*.json`

---

### 2. Scenario Generation Layer

**Purpose**: Convert requirements into detailed test scenarios

```typescript
ScenarioGenerator
├── generateScenariosFromRequirement()
│   ├── generateHappyPathScenario()
│   ├── generateNegativeScenarios()
│   └── generateEdgeCaseScenarios()
│
├── saveScenariosToFile()
└── generatePlaywrightTest()
```

**Input**: Requirement JSON
**Output**:
- Test scenarios with steps
- Tagged and categorized
- Multiple test types per requirement

**Files**: `utils/scenarioGenerator.ts`

---

### 3. Test Generation Layer

**Purpose**: Create executable Playwright tests from scenarios

```typescript
Test Structure:
├── test.describe('Scenario Title')
│   └── test('Scenario ID')
│       ├── Setup (login, navigate)
│       ├── Test Steps (actions)
│       ├── Assertions (verifications)
│       └── Expected Results
```

**Generated Tests Include**:
- Import statements
- Page object usage
- Test data references
- TODO markers for customization

**Files**: `tests/*.spec.ts`

---

### 4. Page Object Layer

**Purpose**: Abstract UI interactions for maintainability

```
BasePage (Abstract)
├── Common methods
│   ├── navigate()
│   ├── waitForPageLoad()
│   ├── takeScreenshot()
│   └── getElementText()
│
├── LoginPage extends BasePage
│   ├── Locators (username, password, loginBtn)
│   └── Actions (login(), isErrorDisplayed())
│
├── PolicyPage extends BasePage
│   ├── Locators (policy-specific)
│   └── Actions (createPolicy(), searchPolicy())
│
└── ClaimsPage extends BasePage
    ├── Locators (claims-specific)
    └── Actions (submitClaim(), updateClaim())
```

**Files**: `pages/*.ts`

---

### 5. Test Data Layer

**Purpose**: Generate realistic test data

```typescript
TestDataGenerator
├── generateCustomerData()
├── generatePolicyData()
├── generateClaimData()
├── generateEndorsementData()
├── generateBillingData()
└── generateBatch()
```

**Generates**:
- Customers (names, addresses, SSN, phone)
- Policies (numbers, dates, coverage, premium)
- Claims (loss types, amounts, dates)
- Billing (payment methods, accounts)

**Files**:
- `utils/testDataGenerator.ts`
- `test-data/*.json`

---

### 6. Execution Layer

**Purpose**: Run tests and generate reports

```
Playwright Test Runner
├── Configuration (playwright.config.ts)
│   ├── Base URL
│   ├── Browsers
│   ├── Timeouts
│   ├── Retry logic
│   └── Reporters
│
├── Execution Modes
│   ├── Headless (npm test)
│   ├── Headed (npm run test:headed)
│   ├── UI Mode (npm run test:ui)
│   └── Debug (npm run test:debug)
│
└── Reporting
    ├── HTML Report
    ├── JSON Results
    ├── Screenshots
    └── Videos
```

---

### 7. Utility Layer

**Purpose**: Supporting tools and scripts

```
Utils
├── scenarioGenerator.ts    # Scenario generation
├── testDataGenerator.ts    # Test data creation
├── pageExplorer.ts         # UI mapping tool
└── cli.ts                  # Command-line interface
```

---

## Data Flow

### Test Generation Flow

```
1. Write Requirements
   └─> requirements.json
       │
       ▼
2. Run CLI Generator
   └─> npm run cli generate
       │
       ▼
3. Scenario Generation
   ├─> Happy Path scenarios
   ├─> Negative scenarios
   └─> Edge Case scenarios
       │
       ▼
4. Test File Creation
   └─> *.spec.ts files
       │
       ▼
5. Manual Enhancement
   └─> Add specific selectors/actions
       │
       ▼
6. Test Execution
   └─> npm test
       │
       ▼
7. Results & Reports
   └─> HTML report + screenshots
```

### Test Execution Flow

```
Test Runner
    │
    ├─> Load Configuration
    │   └─> playwright.config.ts
    │
    ├─> Initialize Browser
    │   └─> Chromium (configurable)
    │
    ├─> Execute Tests
    │   ├─> Create Page Object
    │   ├─> Navigate to URL
    │   ├─> Perform Actions
    │   ├─> Assert Results
    │   └─> Capture on Failure
    │
    └─> Generate Reports
        ├─> HTML Report
        ├─> JSON Results
        ├─> Screenshots
        └─> Videos (on failure)
```

---

## Integration Points

### 1. Duck Creek Sandbox

```
Framework ←→ Duck Creek Application
    │
    ├─> Authentication
    │   └─> Login with credentials (.env)
    │
    ├─> Navigation
    │   └─> Module access (Policy, Claims, Billing)
    │
    ├─> Actions
    │   └─> Create, Read, Update, Delete operations
    │
    └─> Verification
        └─> Assert expected results
```

### 2. CI/CD Integration (Future)

```
Pipeline
    │
    ├─> Checkout Code
    ├─> Install Dependencies (npm install)
    ├─> Generate Tests (npm run cli generate)
    ├─> Run Tests (npm test)
    ├─> Publish Reports
    └─> Notify Team
```

---

## Design Patterns

### 1. Page Object Model (POM)

**Benefits**:
- Separation of test logic and UI
- Reusable components
- Easy maintenance
- Readable tests

**Implementation**:
```typescript
// Page Object
class LoginPage {
  async login(user, pass) { ... }
}

// Test
test('login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('user', 'pass');
});
```

### 2. Factory Pattern

**Used in**: Test Data Generator

```typescript
TestDataGenerator.generatePolicyData()
TestDataGenerator.generateClaimData()
TestDataGenerator.generateCustomerData()
```

### 3. Builder Pattern

**Used in**: Scenario Generation

```typescript
ScenarioGenerator
  .generateScenariosFromRequirement(req)
  .forEach(scenario => {
    ScenarioGenerator.savePlaywrightTest(scenario);
  });
```

### 4. Strategy Pattern

**Used in**: Multiple scenario types

```typescript
// Different strategies for different test types
- Happy Path Strategy
- Negative Test Strategy
- Edge Case Strategy
```

---

## Scalability Considerations

### Horizontal Scaling

```
Test Execution
    │
    ├─> Worker 1 (tests 1-10)
    ├─> Worker 2 (tests 11-20)
    ├─> Worker 3 (tests 21-30)
    └─> Worker N (tests N...)
```

**Configuration**: `playwright.config.ts` → `workers: 4`

### Vertical Scaling

```
Module Structure
    │
    ├─> Policy Tests (isolated)
    ├─> Claims Tests (isolated)
    ├─> Billing Tests (isolated)
    └─> Cross-Module Tests
```

**Benefits**:
- Independent execution
- Module-specific page objects
- Easier maintenance

---

## Security Architecture

### Credentials Management

```
Environment Variables (.env)
    │
    ├─> DC_BASE_URL
    ├─> DC_USERNAME
    └─> DC_PASSWORD
        │
        └─> NOT committed to git (.gitignore)
```

### Test Data Isolation

```
Test Data
    │
    ├─> Generated (non-sensitive)
    ├─> Sandboxed (test environment only)
    └─> Disposable (no production data)
```

---

## Error Handling & Debugging

### Debugging Layers

```
1. Console Logs
   └─> console.log() in tests

2. Screenshots
   └─> Automatic on failure

3. Videos
   └─> Recorded on failure

4. Trace Files
   └─> Full execution trace

5. Debug Mode
   └─> Step-through debugging
```

### Retry Logic

```
Test Failure
    │
    ├─> Retry 1 (with trace)
    ├─> Retry 2 (with trace)
    └─> Final Failure
        └─> Capture all artifacts
```

---

## Performance Optimization

### 1. Parallel Execution
- Tests run in parallel by default
- Configurable worker count

### 2. Smart Waiting
- `waitForSelector()` instead of hard waits
- `waitForLoadState()` for page loads

### 3. Resource Management
- Browser context reuse
- Efficient locator strategies

### 4. Test Data Caching
- Reuse test data when possible
- Generate once, use multiple times

---

## Extensibility Points

### 1. New Page Objects
Add new page objects for additional modules:

```typescript
export class BillingPage extends BasePage {
  // Add billing-specific methods
}
```

### 2. Custom Reporters
Add custom reporters in `playwright.config.ts`:

```typescript
reporter: [
  ['html'],
  ['custom-reporter']
]
```

### 3. New Scenario Types
Extend `ScenarioGenerator`:

```typescript
static generatePerformanceScenarios(req) { ... }
static generateAccessibilityScenarios(req) { ... }
```

### 4. Test Data Plugins
Extend `TestDataGenerator`:

```typescript
static generateComplexPolicyData() { ... }
static loadDataFromExternalSource() { ... }
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Testing Framework** | Playwright |
| **Language** | TypeScript |
| **Runtime** | Node.js |
| **Test Runner** | Playwright Test Runner |
| **Reporting** | HTML, JSON |
| **CLI** | ts-node |
| **Version Control** | Git (recommended) |
| **CI/CD** | Jenkins/GitHub Actions (future) |

---

## Directory Structure Philosophy

```
/pages/          # UI abstraction (what you interact with)
/tests/          # Test logic (what you test)
/scenarios/      # Test plans (what scenarios exist)
/utils/          # Tools (how you generate/support)
/test-data/      # Data (what data you use)
/reports/        # Results (what happened)
```

**Principle**: Separation of concerns for maintainability

---

## Summary

This architecture provides:

✅ **Modularity**: Each component has a single responsibility
✅ **Scalability**: Easy to add new tests, modules, and features
✅ **Maintainability**: Page Object Model keeps tests clean
✅ **Flexibility**: Multiple execution modes and reporting options
✅ **Automation**: Generate scenarios and tests from requirements
✅ **Reliability**: Retry logic and comprehensive error handling
✅ **Visibility**: Detailed reports, screenshots, and videos

**Goal**: Enable rapid, reliable test automation for Duck Creek applications.
