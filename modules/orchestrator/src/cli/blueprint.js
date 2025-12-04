#!/usr/bin/env node

/**
 * WPF Blueprint CLI
 * Generate and manage website blueprints
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import blueprint from '../lib/blueprint.js';
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
    case 'generate':
      await generateBlueprint(args.slice(1));
      break;
    case 'view':
      await viewBlueprint(args.slice(1));
      break;
    case 'export':
      await exportBlueprint(args.slice(1));
      break;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

function printHelp() {
  console.log(`
WPF Blueprint CLI

Usage:
  wpf-blueprint <command> [options]

Commands:
  generate <intake-file> [output-dir]   Generate blueprint from client intake
  view <blueprint-file>                 Display blueprint contents
  export <blueprint-file> [format]      Export blueprint (json, markdown)

Options:
  --skip-research                       Skip research, use existing knowledge base
  --help, -h                            Show this help message

Examples:
  wpf-blueprint generate ./examples/client-intake-roofer.json
  wpf-blueprint generate ./intake.json ./output/
  wpf-blueprint view ./blueprint-v1.json
  wpf-blueprint export ./blueprint-v1.json markdown
`);
}

async function generateBlueprint(args) {
  if (args.length < 1) {
    console.error('Error: generate requires <intake-file> argument');
    process.exit(1);
  }

  const intakeFile = args[0];
  const outputDir = args[1] || path.dirname(intakeFile);
  const skipResearch = args.includes('--skip-research');

  console.log(`
╔════════════════════════════════════════╗
║     WPF Blueprint Generator            ║
╚════════════════════════════════════════╝
`);

  try {
    // Load client intake data
    const intakePath = path.resolve(intakeFile);
    const intakeContent = await fs.readFile(intakePath, 'utf-8');
    const clientData = JSON.parse(intakeContent);

    console.log(`📋 Client: ${clientData.company.name}`);
    console.log(`   Industry: ${clientData.industry.category}`);
    console.log(`   Services: ${clientData.services.length} listed`);
    console.log(`   Brand tone: ${clientData.brand?.tone || 'professional'}\n`);

    let researchData = null;

    if (!skipResearch) {
      // Check for existing research
      const researchSummaryPath = path.join(path.dirname(intakePath), 'research-summary.json');
      try {
        const existingResearch = await fs.readFile(researchSummaryPath, 'utf-8');
        researchData = JSON.parse(existingResearch);
        console.log(`📚 Using existing research from: ${researchSummaryPath}\n`);
      } catch {
        console.log(`🔍 No existing research found, running discovery research...\n`);
        researchData = await research.runDiscoveryResearch(clientData);

        // Save research summary
        await fs.writeFile(researchSummaryPath, JSON.stringify(researchData, null, 2), 'utf-8');
        console.log(`\n📄 Research saved to: ${researchSummaryPath}`);
      }
    }

    // Generate blueprint
    console.log(`\n🏗️  Generating blueprint...\n`);
    const generatedBlueprint = await blueprint.generateBlueprint(clientData, researchData);

    // Save blueprint
    const outputPath = path.resolve(outputDir);
    const savedPath = await blueprint.saveBlueprint(generatedBlueprint, outputPath);

    console.log(`
╔════════════════════════════════════════╗
║     Blueprint Generated Successfully   ║
╚════════════════════════════════════════╝

📄 Saved to: ${savedPath}

Next steps:
1. Review the blueprint: wpf-blueprint view ${savedPath}
2. Edit content as needed
3. When ready, proceed to Phase 2 (Design Draft)
`);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function viewBlueprint(args) {
  if (args.length < 1) {
    console.error('Error: view requires <blueprint-file> argument');
    process.exit(1);
  }

  const blueprintFile = args[0];

  try {
    const blueprintPath = path.resolve(blueprintFile);
    const bp = await blueprint.loadBlueprint(blueprintPath);

    console.log(`
╔════════════════════════════════════════╗
║     WPF Blueprint Viewer               ║
╚════════════════════════════════════════╝

📋 Blueprint Version: ${bp.version}
📅 Created: ${bp.created_at}
📊 Status: ${bp.status}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 CLIENT PROFILE
   Company: ${bp.client_profile.company.name}
   Industry: ${bp.client_profile.industry.category}
   Service Area: ${bp.client_profile.industry.service_area || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 CONTENT DRAFTS
`);

    // Hero
    if (bp.content_drafts.hero) {
      console.log(`
   🎯 HERO SECTION
   Headline: ${bp.content_drafts.hero.headline}
   Subheadline: ${bp.content_drafts.hero.subheadline}
   CTA: ${bp.content_drafts.hero.cta_primary?.text || 'Not set'}
`);
    }

    // About
    if (bp.content_drafts.about_us) {
      console.log(`
   ℹ️  ABOUT US
   Headline: ${bp.content_drafts.about_us.headline}
   Story: ${(bp.content_drafts.about_us.story || '').substring(0, 100)}...
`);
    }

    // Services
    if (bp.content_drafts.services) {
      console.log(`
   🛠️  SERVICES
   Headline: ${bp.content_drafts.services.headline}
   Services: ${bp.content_drafts.services.services?.length || 0} defined
`);
      if (bp.content_drafts.services.services) {
        bp.content_drafts.services.services.forEach((s, i) => {
          console.log(`      ${i + 1}. ${s.name}`);
        });
      }
    }

    // Contact
    if (bp.content_drafts.contact) {
      console.log(`
   📞 CONTACT
   Phone: ${bp.content_drafts.contact.phone?.number || 'Not set'}
   Email: ${bp.content_drafts.contact.email || 'Not set'}
`);
    }

    // Structure
    if (bp.structure_recommendation) {
      console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 STRUCTURE RECOMMENDATION
   Pages: ${bp.structure_recommendation.pages?.map(p => p.name).join(', ')}
`);
      if (bp.structure_recommendation.recommendations) {
        console.log(`   Recommendations:`);
        bp.structure_recommendation.recommendations.forEach(r => {
          console.log(`      • ${r}`);
        });
      }
    }

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

async function exportBlueprint(args) {
  if (args.length < 1) {
    console.error('Error: export requires <blueprint-file> argument');
    process.exit(1);
  }

  const blueprintFile = args[0];
  const format = args[1] || 'json';

  try {
    const blueprintPath = path.resolve(blueprintFile);
    const bp = await blueprint.loadBlueprint(blueprintPath);

    if (format === 'markdown') {
      const markdown = convertToMarkdown(bp);
      const mdPath = blueprintPath.replace('.json', '.md');
      await fs.writeFile(mdPath, markdown, 'utf-8');
      console.log(`✅ Exported to: ${mdPath}`);
    } else if (format === 'json') {
      console.log(JSON.stringify(bp, null, 2));
    } else {
      console.error(`Unknown format: ${format}. Supported: json, markdown`);
      process.exit(1);
    }

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

function convertToMarkdown(bp) {
  let md = `# Website Blueprint: ${bp.client_profile.company.name}

**Version:** ${bp.version}
**Created:** ${bp.created_at}
**Status:** ${bp.status}

---

## Client Profile

- **Company:** ${bp.client_profile.company.name}
- **Industry:** ${bp.client_profile.industry.category}
- **Service Area:** ${bp.client_profile.industry.service_area || 'Not specified'}
- **Phone:** ${bp.client_profile.contact.phone}
- **Email:** ${bp.client_profile.contact.email}

---

## Content Drafts

### Hero Section

**Headline:** ${bp.content_drafts.hero?.headline || 'TBD'}

**Subheadline:** ${bp.content_drafts.hero?.subheadline || 'TBD'}

**Primary CTA:** ${bp.content_drafts.hero?.cta_primary?.text || 'TBD'}

---

### About Us

**Headline:** ${bp.content_drafts.about_us?.headline || 'TBD'}

${bp.content_drafts.about_us?.story || 'TBD'}

---

### Services

**Headline:** ${bp.content_drafts.services?.headline || 'TBD'}

${bp.content_drafts.services?.intro || ''}

`;

  if (bp.content_drafts.services?.services) {
    bp.content_drafts.services.services.forEach(s => {
      md += `
#### ${s.name}

${s.description || 'TBD'}

`;
    });
  }

  md += `
---

### Contact

**Headline:** ${bp.content_drafts.contact?.headline || 'TBD'}

- **Phone:** ${bp.content_drafts.contact?.phone?.number || 'TBD'}
- **Email:** ${bp.content_drafts.contact?.email || 'TBD'}

---

## Structure Recommendation

### Pages

`;

  if (bp.structure_recommendation?.pages) {
    bp.structure_recommendation.pages.forEach(p => {
      md += `- **${p.name}** (/${p.slug})\n`;
    });
  }

  md += `
### Recommendations

`;

  if (bp.structure_recommendation?.recommendations) {
    bp.structure_recommendation.recommendations.forEach(r => {
      md += `- ${r}\n`;
    });
  }

  return md;
}

main().catch(console.error);
