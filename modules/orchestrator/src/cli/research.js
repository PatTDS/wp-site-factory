#!/usr/bin/env node

/**
 * WPF Research CLI
 * Run research for a project
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import research from '../lib/research.js';

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

  console.log(`\n🔍 Researching ${sectionType} best practices for ${industry}...\n`);

  try {
    const result = await research.researchBestPractices(sectionType, industry, { forceRefresh });

    if (result.success) {
      console.log(`✅ Research complete (source: ${result.source})`);
      if (result.usage) {
        console.log(`   Tokens used: ${result.usage.input_tokens} in, ${result.usage.output_tokens} out`);
      }
      console.log(`\n📄 Results saved to knowledge base`);
    } else {
      console.error(`❌ Research failed: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
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

  console.log(`\n🔍 Researching ${industry} competitors${location ? ` in ${location}` : ''}...\n`);

  try {
    const result = await research.researchCompetitors(industry, location, { forceRefresh });

    if (result.success) {
      console.log(`✅ Research complete (source: ${result.source})`);
      if (result.usage) {
        console.log(`   Tokens used: ${result.usage.input_tokens} in, ${result.usage.output_tokens} out`);
      }
      console.log(`\n📄 Results saved to knowledge base`);
    } else {
      console.error(`❌ Research failed: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

async function runFullResearch(args) {
  if (args.length < 1) {
    console.error('Error: full requires <intake-file> argument');
    process.exit(1);
  }

  const intakeFile = args[0];

  console.log(`\n🔍 Running full discovery research...\n`);

  try {
    // Load client intake data
    const intakePath = path.resolve(intakeFile);
    const intakeContent = await fs.readFile(intakePath, 'utf-8');
    const clientData = JSON.parse(intakeContent);

    console.log(`📋 Loaded intake: ${clientData.company.name}`);
    console.log(`   Industry: ${clientData.industry.category}`);
    console.log(`   Services: ${clientData.services.length} listed\n`);

    // Run full research
    const result = await research.runDiscoveryResearch(clientData);

    console.log(`\n✅ Full research complete`);
    console.log(`   Best practices researched: ${Object.keys(result.bestPractices).join(', ')}`);
    console.log(`   Competitor research: ${result.competitors ? 'Yes' : 'No'}`);

    // Save research summary to project folder
    const projectDir = path.dirname(intakePath);
    const summaryPath = path.join(projectDir, 'research-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`\n📄 Research summary saved to: ${summaryPath}`);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);
