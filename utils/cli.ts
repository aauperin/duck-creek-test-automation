#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { ScenarioGenerator, Requirement } from './scenarioGenerator';

const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(`
🦆 Duck Creek Test Automation CLI

Usage:
  npm run cli <command> [options]

Commands:
  generate <requirements-file>    Generate test scenarios from requirements file
  create-requirement             Interactive requirement creation
  list-scenarios                 List all generated scenarios
  help                          Show this help message

Examples:
  npm run cli generate scenarios/example-requirements.json
  npm run cli create-requirement
  npm run cli list-scenarios

For more information, see README.md
  `);
}

function generateFromFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`📖 Loading requirements from: ${filePath}`);
  const requirements: Requirement[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  console.log(`✓ Found ${requirements.length} requirements\n`);

  let totalScenarios = 0;

  requirements.forEach((req, index) => {
    console.log(`\n[${index + 1}/${requirements.length}] Processing: ${req.id} - ${req.title}`);

    const scenarios = ScenarioGenerator.generateScenariosFromRequirement(req);
    console.log(`  Generated ${scenarios.length} scenarios`);

    // Save scenarios
    const scenarioFile = path.join('scenarios', `${req.id.toLowerCase()}-scenarios.json`);
    ScenarioGenerator.saveScenariosToFile(scenarios, scenarioFile);

    // Generate Playwright tests
    scenarios.forEach(scenario => {
      ScenarioGenerator.savePlaywrightTest(scenario, 'tests');
    });

    totalScenarios += scenarios.length;
  });

  console.log(`\n✅ Complete! Generated ${totalScenarios} total scenarios and Playwright tests`);
  console.log(`\n📁 Scenarios saved to: scenarios/`);
  console.log(`📁 Tests saved to: tests/`);
  console.log(`\n🚀 Run tests with: npm test`);
}

function listScenarios() {
  const scenariosDir = 'scenarios';

  if (!fs.existsSync(scenariosDir)) {
    console.log('No scenarios found. Generate some first!');
    return;
  }

  const files = fs.readdirSync(scenariosDir).filter(f => f.endsWith('-scenarios.json'));

  if (files.length === 0) {
    console.log('No scenarios found. Generate some first!');
    return;
  }

  console.log(`\n📋 Found ${files.length} scenario files:\n`);

  files.forEach(file => {
    const filePath = path.join(scenariosDir, file);
    const scenarios = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`  ${file}`);
    console.log(`    └─ ${scenarios.length} scenarios`);
    scenarios.forEach((s: any) => {
      console.log(`       • ${s.id}: ${s.title}`);
    });
    console.log('');
  });
}

function createRequirement() {
  console.log('\n🆕 Create New Requirement (Interactive)\n');
  console.log('This feature requires an interactive prompt library.');
  console.log('For now, please create a JSON file manually in scenarios/');
  console.log('\nExample format:');
  console.log(JSON.stringify({
    id: 'REQ-XXX',
    title: 'Your requirement title',
    description: 'Detailed description',
    acceptance_criteria: ['Criteria 1', 'Criteria 2'],
    module: 'Policy|Claims|Billing',
    priority: 'high|medium|low'
  }, null, 2));
}

// Main command handler
switch (command) {
  case 'generate':
    if (!args[1]) {
      console.error('❌ Error: Please provide a requirements file');
      console.log('Usage: npm run cli generate <requirements-file>');
      process.exit(1);
    }
    generateFromFile(args[1]);
    break;

  case 'list-scenarios':
    listScenarios();
    break;

  case 'create-requirement':
    createRequirement();
    break;

  case 'help':
  default:
    showHelp();
    break;
}
