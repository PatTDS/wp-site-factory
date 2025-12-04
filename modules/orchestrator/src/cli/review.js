#!/usr/bin/env node

/**
 * WPF Review CLI
 * Operator review commands for blueprints
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import readline from 'readline';
import blueprint from '../lib/blueprint.js';
import review from '../lib/operator-review.js';

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
    case 'auto':
      await runAutoReview(args.slice(1));
      break;
    case 'start':
      await startManualReview(args.slice(1));
      break;
    case 'status':
      await showReviewStatus(args.slice(1));
      break;
    case 'report':
      await generateReviewReport(args.slice(1));
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

function printHelp() {
  console.log(`
WPF Review CLI - Operator Quality Review

Usage:
  wpf review <command> [options]

Commands:
  auto <blueprint>          Run automated review checks
  start <blueprint>         Start interactive manual review
  status <review-file>      Show review status
  report <review-file>      Generate review report

Options:
  --operator <name>         Reviewer name (default: current user)
  --output <dir>            Output directory for review files
  --help, -h                Show this help message

Examples:
  wpf review auto ./blueprint-v1.json
  wpf review start ./blueprint-v1.json --operator "John"
  wpf review status ./review-project-v1.json
  wpf review report ./review-project-v1.json
`);
}

async function runAutoReview(args) {
  if (args.length < 1) {
    console.error('Error: auto requires <blueprint> argument');
    process.exit(1);
  }

  const blueprintFile = args[0];

  console.log(`
╔════════════════════════════════════════╗
║     WPF Auto Review                    ║
╚════════════════════════════════════════╝
`);

  try {
    const blueprintPath = path.resolve(blueprintFile);
    const bp = await blueprint.loadBlueprint(blueprintPath);

    console.log(`📋 Blueprint: ${bp.client_profile?.company?.name || 'Unknown'}`);
    console.log(`   Version: ${bp.version}`);
    console.log(`\n🔍 Running automated checks...\n`);

    const autoResult = review.autoReview(bp);

    // Display results
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`\n✅ PASSED (${autoResult.results.passed.length}):`);
    autoResult.results.passed.forEach(p => console.log(`   • ${p}`));

    if (autoResult.results.warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS (${autoResult.results.warnings.length}):`);
      autoResult.results.warnings.forEach(w => console.log(`   • ${w}`));
    }

    if (autoResult.results.errors.length > 0) {
      console.log(`\n🚨 ERRORS (${autoResult.results.errors.length}):`);
      autoResult.results.errors.forEach(e => console.log(`   • ${e}`));
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`\n📊 Auto Review Score: ${Math.round(autoResult.score)}%`);
    console.log(`📋 Recommendation: ${formatRecommendation(autoResult.recommendation)}`);

    // Suggest next steps
    console.log(`\n📌 Next Steps:`);
    if (autoResult.recommendation === 'ready_for_client') {
      console.log(`   1. Run manual review: wpf review start ${blueprintFile}`);
      console.log(`   2. If approved, export for client: wpf blueprint export ${blueprintFile} markdown`);
    } else {
      console.log(`   1. Fix the issues listed above`);
      console.log(`   2. Regenerate or edit the blueprint`);
      console.log(`   3. Run auto review again`);
    }
    console.log('');

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

async function startManualReview(args) {
  if (args.length < 1) {
    console.error('Error: start requires <blueprint> argument');
    process.exit(1);
  }

  const blueprintFile = args[0];
  const operatorIndex = args.indexOf('--operator');
  const operatorName = operatorIndex !== -1 ? args[operatorIndex + 1] : process.env.USER || 'Operator';
  const outputIndex = args.indexOf('--output');
  const outputDir = outputIndex !== -1 ? args[outputIndex + 1] : path.dirname(blueprintFile);

  console.log(`
╔════════════════════════════════════════╗
║     WPF Manual Review                  ║
╚════════════════════════════════════════╝
`);

  try {
    const blueprintPath = path.resolve(blueprintFile);
    const bp = await blueprint.loadBlueprint(blueprintPath);

    console.log(`📋 Blueprint: ${bp.client_profile?.company?.name || 'Unknown'}`);
    console.log(`   Version: ${bp.version}`);
    console.log(`   Reviewer: ${operatorName}`);
    console.log('');

    // Create review
    const reviewObj = review.createReview(bp, operatorName);

    // Interactive checklist
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

    console.log(`Starting review checklist. Press y/n for each item, or s to skip.\n`);

    for (const [category, data] of Object.entries(reviewObj.checklist)) {
      console.log(`\n━━━ ${data.title} ━━━\n`);

      for (const item of data.items) {
        const answer = await question(`${item.label}? (y/n/s): `);

        if (answer.toLowerCase() === 'y') {
          item.checked = true;
        } else if (answer.toLowerCase() === 'n') {
          item.checked = false;
          const note = await question(`  Note (optional): `);
          if (note) {
            item.note = note;
          }
        }
        // 's' skips (leaves unchecked with no note)
      }
    }

    // Ask for comments
    console.log(`\n━━━ Additional Comments ━━━\n`);
    let addingComments = true;
    while (addingComments) {
      const addComment = await question(`Add a comment? (y/n): `);
      if (addComment.toLowerCase() === 'y') {
        const section = await question(`Section (hero/services/about/contact/general): `);
        const comment = await question(`Comment: `);
        const severity = await question(`Severity (info/suggestion/issue/critical): `);
        review.addComment(reviewObj, section, comment, severity || 'info');
      } else {
        addingComments = false;
      }
    }

    // Calculate final score
    reviewObj.overall_score = calculateScoreFromReview(reviewObj);

    // Make decision
    console.log(`\n━━━ Decision ━━━\n`);
    console.log(`Overall Score: ${reviewObj.overall_score}%\n`);

    const decision = await question(`Decision (approve/revise): `);
    const notes = await question(`Notes: `);

    review.makeDecision(reviewObj, decision.toLowerCase(), notes);

    rl.close();

    // Save review
    const savedPath = await review.saveReview(reviewObj, path.resolve(outputDir));
    console.log(`\n✅ Review saved to: ${savedPath}`);

    // Generate report
    const reportPath = savedPath.replace('.json', '.md');
    const report = review.generateReport(reviewObj);
    await fs.writeFile(reportPath, report, 'utf-8');
    console.log(`📄 Report saved to: ${reportPath}\n`);

    // Summary
    console.log(`
╔════════════════════════════════════════╗
║     Review Complete                    ║
╚════════════════════════════════════════╝

Decision: ${reviewObj.status.toUpperCase()}
Score: ${reviewObj.overall_score}%

${reviewObj.decision === 'approve' ?
      'Blueprint is approved for client delivery.' :
      'Blueprint needs revision before client delivery.'}
`);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

async function showReviewStatus(args) {
  if (args.length < 1) {
    console.error('Error: status requires <review-file> argument');
    process.exit(1);
  }

  const reviewFile = args[0];

  try {
    const reviewPath = path.resolve(reviewFile);
    const reviewObj = await review.loadReview(reviewPath);

    console.log(`
Review Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project: ${reviewObj.project}
Version: ${reviewObj.blueprint_version}
Reviewer: ${reviewObj.operator}
Created: ${reviewObj.created_at}
Status: ${reviewObj.status.toUpperCase()}
Score: ${reviewObj.overall_score}%
${reviewObj.decision ? `Decision: ${reviewObj.decision.toUpperCase()}` : ''}
${reviewObj.comments.length > 0 ? `Comments: ${reviewObj.comments.length}` : ''}
`);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

async function generateReviewReport(args) {
  if (args.length < 1) {
    console.error('Error: report requires <review-file> argument');
    process.exit(1);
  }

  const reviewFile = args[0];

  try {
    const reviewPath = path.resolve(reviewFile);
    const reviewObj = await review.loadReview(reviewPath);
    const report = review.generateReport(reviewObj);

    console.log(report);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

function calculateScoreFromReview(reviewObj) {
  let totalWeight = 0;
  let earnedWeight = 0;

  for (const categoryData of Object.values(reviewObj.checklist)) {
    for (const item of categoryData.items) {
      totalWeight += item.weight;
      if (item.checked) {
        earnedWeight += item.weight;
      }
    }
  }

  return totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
}

function formatRecommendation(rec) {
  const labels = {
    needs_major_revision: '🔴 Needs Major Revision',
    needs_minor_revision: '🟡 Needs Minor Revision',
    ready_with_suggestions: '🟢 Ready (with suggestions)',
    ready_for_client: '✅ Ready for Client',
  };
  return labels[rec] || rec;
}

main().catch(console.error);
