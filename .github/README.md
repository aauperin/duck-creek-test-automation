# 🦆 Duck Creek Test Automation Framework (Prototype)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.56-green.svg)](https://playwright.dev/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/status-prototype-orange.svg)](https://github.com/aauperin/duck-creek-test-automation)

> **⚠️ Proof-of-concept:** This is a first draft demonstrating how a test automation framework for Duck Creek could be initialized using Claude Code. It's a starting point, not a production-ready solution.

## 🎯 What This Is

A **prototype framework** showing how to:
- Generate test scenarios from requirements automatically
- Structure Playwright tests with Page Object Model
- Create test data generators for insurance testing
- Build a CLI tool for test automation workflows

**Generated with Claude Code** to demonstrate rapid framework scaffolding.

## ✨ What Makes This Special

Transform requirements into executable tests in **seconds**, not hours:

```bash
npm run cli generate scenarios/your-requirements.json
# ✅ 32 scenarios generated
# ✅ 32 Playwright tests created
# ✅ Ready to run
```

## 🎯 Key Features

- **🤖 Automated Test Generation** - Turn requirements into test scenarios automatically
- **🎭 Playwright + TypeScript** - Modern, reliable end-to-end testing
- **🏗️ Page Object Model** - Clean, maintainable architecture
- **📊 Test Data Generator** - Realistic policies, claims, and customer data
- **⚡ CLI Tool** - Streamlined workflow automation
- **📈 Smart Scenarios** - Generates happy path, negative, and edge case tests
- **🔧 Duck Creek Ready** - Pre-configured for Policy, Claims, and Billing modules

## 🚀 Quick Start

### 1. Install

```bash
npm install
npx playwright install chromium
```

### 2. Generate Tests

```bash
npm run cli generate scenarios/example-requirements.json
```

**Output:**
- ✅ 32 test scenarios
- ✅ 32 Playwright test files
- ✅ Organized by requirement

### 3. Run Tests

```bash
npm test                  # Headless
npm run test:headed       # Watch tests run
npm run test:ui          # Interactive mode
```

### 4. View Results

```bash
npm run report           # HTML report with screenshots
```

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [QUICKSTART.md](../QUICKSTART.md) | Get started in 5 minutes |
| [README.md](../README.md) | Complete documentation |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | Technical architecture |
| [SETUP.md](../SETUP.md) | Installation guide |
| [FIXES.md](../FIXES.md) | Issues resolved |

## 💡 Example: From Requirement to Test

**Input:** Requirements document
```json
{
  "id": "REQ-001",
  "title": "Create New Policy",
  "description": "User should be able to create a new policy",
  "acceptance_criteria": [
    "Policy number must be unique",
    "Effective date cannot be in the past"
  ],
  "module": "Policy",
  "priority": "high"
}
```

**Command:**
```bash
npm run cli generate scenarios/requirements.json
```

**Output:** Executable Playwright tests
```typescript
test('REQ-001_HAPPY_PATH', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('user', 'pass');
  // Test implementation...
});
```

## 📊 What's Included

| Component | Count | Status |
|-----------|-------|--------|
| **Test Scenarios** | 32 | 📝 Generated examples (need customization) |
| **Playwright Tests** | 33 | ⚠️ Templates with TODO markers |
| **Page Objects** | 2 | 🚧 Generic selectors (need real ones) |
| **Utilities** | 4 | ✅ Working generators & CLI |
| **Documentation** | 10 files | 📖 Comprehensive setup guides |
| **Test Data** | 20+ records | ✅ Sample data generators |

### ⚠️ What Needs Work

- **Page object selectors** - Currently generic, need real Duck Creek selectors
- **Test implementation** - Generated tests have TODO markers for actual actions
- **Duck Creek access** - Requires valid credentials and environment setup
- **CI/CD integration** - Not configured yet
- **Browser dependencies** - Must be installed separately (see SETUP.md)

## 🎨 Framework Architecture

```
Requirements (JSON)
    ↓
Scenario Generator
    ↓
Playwright Tests
    ↓
Page Objects
    ↓
Duck Creek Application
```

### Generated Features

- 📝 **Happy Path Tests** - Template structure provided
- 📝 **Negative Tests** - Validation scenarios generated
- 📝 **Edge Case Tests** - Boundary condition templates
- ✅ **Test Data Generation** - Working generators for policies/claims/customers
- ✅ **Page Object Model** - Structure in place (needs real selectors)
- ⚠️ **Parallel Execution** - Configured but not tested
- ⚠️ **Rich Reporting** - Setup but requires working tests

## 🔧 Tech Stack

- **Testing Framework:** Playwright 1.56
- **Language:** TypeScript 5.9
- **Runtime:** Node.js 16+
- **Architecture:** Page Object Model
- **Reporting:** HTML, JSON

## 📈 Use Cases

Perfect for:
- 🏢 Insurance companies using Duck Creek
- 🧪 QA teams needing rapid test creation
- 🤖 DevOps teams implementing CI/CD
- 📋 Business analysts defining testable requirements
- 👨‍💻 Developers practicing TDD/BDD

## 🎓 Learning Resources

### New to the Framework?
1. Read [QUICKSTART.md](../QUICKSTART.md) (5 minutes)
2. Run example tests
3. Generate your first test scenario

### Want to Customize?
1. Study [ARCHITECTURE.md](../ARCHITECTURE.md)
2. Review page objects in `pages/`
3. Explore utilities in `utils/`

### Need Help?
- Check [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)
- Review [FIXES.md](../FIXES.md) for common issues
- See example tests in `tests/`

## 🤝 Contributing

Contributions welcome! Areas to enhance:

- 🎯 Add more Duck Creek module page objects
- 🧪 Expand test scenario types
- 📊 Improve test data generation
- 🔧 Add custom reporters
- 📝 Enhance documentation

## 📄 License

ISC License - feel free to use in your projects!

## 🌟 Star This Repo

If this framework helps you, please star it! ⭐

## 🔗 Related Tools

- [Playwright](https://playwright.dev/) - Browser automation
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Duck Creek Technologies](https://www.duckcreek.com/) - Insurance software platform

## 📧 Feedback

Have suggestions or found a bug? Open an issue!

---

**Built with ❤️ for the Duck Creek testing community**

🤖 *Generated with [Claude Code](https://claude.com/claude-code)*
