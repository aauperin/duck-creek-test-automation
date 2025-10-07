import * as fs from 'fs';
import * as path from 'path';

export interface Requirement {
  id: string;
  title: string;
  description: string;
  acceptance_criteria?: string[];
  module?: string; // Policy, Claims, Billing, etc.
  priority?: 'high' | 'medium' | 'low';
}

export interface TestScenario {
  id: string;
  requirementId: string;
  title: string;
  description: string;
  steps: TestStep[];
  expectedResult: string;
  testData?: Record<string, any>;
  tags?: string[];
}

export interface TestStep {
  step: number;
  action: string;
  data?: Record<string, any>;
  expected?: string;
}

export class ScenarioGenerator {

  /**
   * Generate test scenarios from a requirement
   */
  static generateScenariosFromRequirement(requirement: Requirement): TestScenario[] {
    const scenarios: TestScenario[] = [];

    // Generate happy path scenario
    scenarios.push(this.generateHappyPathScenario(requirement));

    // Generate negative scenarios if acceptance criteria exist
    if (requirement.acceptance_criteria && requirement.acceptance_criteria.length > 0) {
      scenarios.push(...this.generateNegativeScenarios(requirement));
    }

    // Generate edge case scenarios
    scenarios.push(...this.generateEdgeCaseScenarios(requirement));

    return scenarios;
  }

  private static generateHappyPathScenario(requirement: Requirement): TestScenario {
    return {
      id: `${requirement.id}_HAPPY_PATH`,
      requirementId: requirement.id,
      title: `${requirement.title} - Happy Path`,
      description: `Verify ${requirement.description} works correctly with valid data`,
      steps: this.extractStepsFromDescription(requirement.description, 'positive'),
      expectedResult: 'Operation completes successfully',
      tags: ['happy-path', requirement.module || 'general', requirement.priority || 'medium'],
    };
  }

  private static generateNegativeScenarios(requirement: Requirement): TestScenario[] {
    const scenarios: TestScenario[] = [];

    requirement.acceptance_criteria?.forEach((criteria, index) => {
      scenarios.push({
        id: `${requirement.id}_NEG_${index + 1}`,
        requirementId: requirement.id,
        title: `${requirement.title} - Validation: ${criteria}`,
        description: `Verify system handles invalid data: ${criteria}`,
        steps: this.extractStepsFromDescription(criteria, 'negative'),
        expectedResult: 'System displays appropriate error message',
        tags: ['negative', 'validation', requirement.module || 'general'],
      });
    });

    return scenarios;
  }

  private static generateEdgeCaseScenarios(requirement: Requirement): TestScenario[] {
    return [{
      id: `${requirement.id}_EDGE`,
      requirementId: requirement.id,
      title: `${requirement.title} - Edge Cases`,
      description: `Test boundary conditions for ${requirement.description}`,
      steps: this.extractStepsFromDescription(requirement.description, 'edge'),
      expectedResult: 'System handles edge cases appropriately',
      tags: ['edge-case', requirement.module || 'general'],
    }];
  }

  private static extractStepsFromDescription(description: string, type: 'positive' | 'negative' | 'edge'): TestStep[] {
    // This is a simplified version - in a real implementation,
    // you could use AI/NLP to extract steps from requirements

    // Check if description already mentions login
    const isLoginTest = description.toLowerCase().includes('login') || description.toLowerCase().includes('sign in');

    const baseSteps: TestStep[] = [];

    if (!isLoginTest) {
      // Only add login step if it's not a login test - NO HARDCODED CREDENTIALS
      baseSteps.push({
        step: 1,
        action: 'Login to Duck Creek application',
        data: { username: '${process.env.DC_USERNAME}', password: '${process.env.DC_PASSWORD}' },
        expected: 'User successfully logged in',
      });
      baseSteps.push({
        step: 2,
        action: 'Navigate to relevant module',
        expected: 'Module page loads successfully',
      });
    }

    if (type === 'positive') {
      baseSteps.push({
        step: baseSteps.length + 1,
        action: isLoginTest ? description : `Perform action: ${description}`,
        data: isLoginTest ? { username: '${process.env.DC_USERNAME}', password: '${process.env.DC_PASSWORD}' } : undefined,
        expected: isLoginTest ? 'User successfully logged in' : 'Action completes successfully',
      });
    } else if (type === 'negative') {
      baseSteps.push({
        step: baseSteps.length + 1,
        action: isLoginTest ? `Attempt ${description} with invalid data` : `Attempt action with invalid data: ${description}`,
        expected: 'Error message displayed',
      });
    } else {
      baseSteps.push({
        step: baseSteps.length + 1,
        action: isLoginTest ? `Test login boundary conditions` : `Test boundary condition: ${description}`,
        expected: 'System handles edge case',
      });
    }

    return baseSteps;
  }

  /**
   * Save scenarios to JSON file
   */
  static saveScenariosToFile(scenarios: TestScenario[], outputPath: string) {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, JSON.stringify(scenarios, null, 2));
    console.log(`✓ Saved ${scenarios.length} scenarios to ${outputPath}`);
  }

  /**
   * Load requirements from JSON file
   */
  static loadRequirements(filePath: string): Requirement[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Generate Playwright test code from scenario
   */
  static generatePlaywrightTest(scenario: TestScenario): string {
    // Check if any step requires login
    const hasLoginStep = scenario.steps.some(step => step.action.toLowerCase().includes('login'));

    const testCode = `
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('${scenario.title}', () => {
  test('${scenario.id}', async ({ page }) => {
    // Test: ${scenario.description}
${hasLoginStep ? '\n    const loginPage = new LoginPage(page);' : ''}

${scenario.steps.map((step, index) => `    // Step ${step.step}: ${step.action}
    ${this.generateStepCode(step, index === 0)}${step.expected ? `\n    // Expected: ${step.expected}` : ''}`).join('\n\n')}

    // Expected Result: ${scenario.expectedResult}
  });
});
`;
    return testCode;
  }

  private static generateStepCode(step: TestStep, isFirstStep: boolean): string {
    if (step.action.toLowerCase().includes('login')) {
      // Check if data contains env var placeholders
      const username = step.data?.username?.includes('process.env')
        ? step.data.username.replace(/\$\{|\}/g, '')
        : `process.env.DC_USERNAME || ''`;
      const password = step.data?.password?.includes('process.env')
        ? step.data.password.replace(/\$\{|\}/g, '')
        : `process.env.DC_PASSWORD || ''`;

      return `await loginPage.navigate();
    await loginPage.login(${username}, ${password});`;
    }

    return `// TODO: Implement step - ${step.action}
    // await page.click('selector');`;
  }

  /**
   * Save Playwright test to file
   */
  static savePlaywrightTest(scenario: TestScenario, outputDir: string = './tests') {
    const testCode = this.generatePlaywrightTest(scenario);
    const fileName = `${scenario.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}.spec.ts`;
    const filePath = path.join(outputDir, fileName);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(filePath, testCode);
    console.log(`✓ Generated test: ${filePath}`);
    return filePath;
  }
}

// Example usage
if (require.main === module) {
  // Example requirement
  const exampleRequirement: Requirement = {
    id: 'REQ-001',
    title: 'Create New Policy',
    description: 'User should be able to create a new policy with valid customer information',
    acceptance_criteria: [
      'Policy number must be unique',
      'Effective date cannot be in the past',
      'Customer information is required',
    ],
    module: 'Policy',
    priority: 'high',
  };

  // Generate scenarios
  const scenarios = ScenarioGenerator.generateScenariosFromRequirement(exampleRequirement);

  // Save scenarios
  ScenarioGenerator.saveScenariosToFile(scenarios, './scenarios/req-001-scenarios.json');

  // Generate Playwright tests
  scenarios.forEach(scenario => {
    ScenarioGenerator.savePlaywrightTest(scenario, './tests');
  });
}
