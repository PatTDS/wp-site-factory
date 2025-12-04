#!/usr/bin/env node

/**
 * WPF Research CLI
 * Run research for a project
 * With automatic token tracking
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import research, { getResearchTracker } from '../lib/research.js';
import { initTracker } from '../lib/claude.js';
import { validateClientIntake, formatErrors } from '../lib/validator.js';
import { createSpinner, withSpinner, createProgress } from '../lib/spinner.js';

// Load environment variables
config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const command = args[0];

  switch (command) {
    case 'best-practices':
      await runBestPracticesResearch(args.slice(1));
      break;
    case 'competitors':
      await runCompetitorResearch(args.slice(1));
      break;
    case 'full':
      await runFullResearch(args.slice(1));
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

function printHelp() {
  console.log(`
WPF Research CLI

Usage:
  wpf-research <command> [options]

Commands:
  best-practices <section> <industry>   Research best practices for a section type
  competitors <industry> [location]     Research competitors in an industry
  full <intake-file>                    Run full discovery research from intake file

Options:
  --force                               Force refresh (ignore cached research)
  --help, -h                            Show this help message

Examples:
  wpf-research best-practices hero roofing
  wpf-research competitors roofing "Sydney, Australia"
  wpf-research full ./examples/client-intake-roofer.json

Section Types:
  hero, about-us, services, testimonials, contact

Industries:
  roofing, plumbing, electrical, hvac, landscaping, construction,
  automotive, healthcare, education, hospitality, retail,
  professional-services, technology, manufacturing, real-estate,
  fitness, beauty, food-beverage, other
`);
}

async function runBestPracticesResearch(args) {
  if (args.length < 2) {
    console.error('Error: best-practices requires <section> and <industry> arguments');
    process.exit(1);
  }

  const [sectionType, industry] = args;
  const forceRefresh = args.includes('--force');

  // Initialize tracker
  const tracker = initTracker(`best-practices-${industry}`);

  const spinner = createSpinner(`Researching ${sectionType} best practices for ${industry}`);
  spinner.start();

  try {
    const result = await research.researchBestPractices(sectionType, industry, { forceRefresh });

    if (result.success) {
      spinner.succeed(`Research complete (source: ${result.source})`);

      // Show token usage from tracker
      const totals = tracker.getTotals();
      if (totals.total_tokens > 0) {
        console.log(`   Tokens used: ${totals.input_tokens} in, ${totals.output_tokens} out`);
        console.log(`   Estimated cost: $${totals.total_cost_usd.toFixed(4)}`);
      }

      console.log(`\n📄 Results saved to knowledge base`);
    } else {
      spinner.fail(`Research failed: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    spinner.fail(`Error: ${error.message}`);
    process.exit(1);
  }
}

async function runCompetitorResearch(args) {
  if (args.length < 1) {
    console.error('Error: competitors requires <industry> argument');
    process.exit(1);
  }

  const industry = args[0];
  const location = args[1] || '';
  const forceRefresh = args.includes('--force');

  // Initialize tracker
  const tracker = initTracker(`competitors-${industry}`);

  const spinner = createSpinner(`Researching ${industry} competitors${location ? ` in ${location}` : ''}`);
  spinner.start();

  try {
    const result = await research.researchCompetitors(industry, location, { forceRefresh });

    if (result.success) {
      spinner.succeed(`Research complete (source: ${result.source})`);

      // Show token usage from tracker
      const totals = tracker.getTotals();
      if (totals.total_tokens > 0) {
        console.log(`   Tokens used: ${totals.input_tokens} in, ${totals.output_tokens} out`);
        console.log(`   Estimated cost: $${totals.total_cost_usd.toFixed(4)}`);
      }

      console.log(`\n📄 Results saved to knowledge base`);
    } else {
      spinner.fail(`Research failed: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    spinner.fail(`Error: ${error.message}`);
    process.exit(1);
  }
}

async function runFullResearch(args) {
  if (args.length < 1) {
    console.error('Error: full requires <intake-file> argument');
    process.exit(1);
  }

  const intakeFile = args[0];
  const startTime = Date.now();

  console.log(`\n🚀 Starting full discovery research...\n`);

  try {
    // Load client intake data
    let loadSpinner = createSpinner('Loading intake file');
    loadSpinner.start();

    const intakePath = path.resolve(intakeFile);
    const intakeContent = await fs.readFile(intakePath, 'utf-8');
    const clientData = JSON.parse(intakeContent);
    loadSpinner.succeed('Intake file loaded');

    // Validate intake data
    const validateSpinner = createSpinner('Validating intake data');
    validateSpinner.start();

    const validation = validateClientIntake(clientData);

    if (!validation.valid) {
      validateSpinner.fail('Intake validation failed');
      console.error(`\n${formatErrors(validation.errors)}`);
      console.log(`\n💡 Fix the errors above and try again.`);
      process.exit(1);
    }
    validateSpinner.succeed('Intake validation passed');

    const projectName = clientData.company.slug || clientData.company.name.toLowerCase().replace(/\s+/g, '-');

    console.log(`\n📋 Project: ${clientData.company.name}`);
    console.log(`   Industry: ${clientData.industry.category}`);
    console.log(`   Services: ${clientData.services.length} listed\n`);

    // Run full research with progress
    const researchSpinner = createSpinner('Running discovery research (5 sections + competitors)');
    researchSpinner.start();

    const result = await research.runDiscoveryResearch(clientData, { projectName });

    researchSpinner.succeed('Discovery research complete');

    // Summary
    console.log(`\n✅ Research Results:`);
    console.log(`   Best practices: ${Object.keys(result.bestPractices).join(', ')}`);
    console.log(`   Competitor research: ${result.competitors ? 'Yes' : 'No'}`);

    // Show token usage
    if (result.tokenUsage) {
      console.log(`\n📊 Token Usage Summary:`);
      console.log(`   Total tokens: ${result.tokenUsage.total_tokens.toLocaleString()}`);
      console.log(`   Input: ${result.tokenUsage.input_tokens.toLocaleString()}`);
      console.log(`   Output: ${result.tokenUsage.output_tokens.toLocaleString()}`);
      console.log(`   Estimated cost: $${result.tokenUsage.total_cost_usd.toFixed(4)}`);
    }

    // Save research summary
    const saveSpinner = createSpinner('Saving research results');
    saveSpinner.start();

    const projectDir = path.dirname(intakePath);
    const summaryPath = path.join(projectDir, 'research-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(result, null, 2), 'utf-8');

    // Save token tracking log
    const tracker = getResearchTracker();
    const logPath = path.join(projectDir, `research-log-${projectName}.json`);
    tracker.save(logPath);

    saveSpinner.succeed('Results saved');

    // Final summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✨ Full research completed in ${duration}s`);
    console.log(`   Research summary: ${summaryPath}`);
    console.log(`   Token log: ${logPath}`);

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);
