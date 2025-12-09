#!/usr/bin/env node
/**
 * Test Stock Photo Automation
 *
 * Usage:
 *   node test-automation.js [option]
 *
 * Options:
 *   basic      - Basic test (default)
 *   disabled   - Test with images disabled
 *   full       - Full test with file writing
 *   industry   - Test different industries
 */

import { assembleTheme } from './src/lib/phase2/theme-assembler.js';
import { generateBlueprintContent } from './src/lib/phase2/content-generator.js';
import fs from 'fs/promises';
import path from 'path';

const testType = process.argv[2] || 'basic';

async function runTest() {
  // Load example blueprint
  const blueprint = JSON.parse(
    await fs.readFile('./examples/blueprint-v1.0.json', 'utf-8')
  );

  console.log(`\n🧪 Running test: ${testType}\n`);

  switch (testType) {
    case 'basic':
      await testBasic(blueprint);
      break;

    case 'disabled':
      await testDisabled(blueprint);
      break;

    case 'full':
      await testFull(blueprint);
      break;

    case 'industry':
      await testIndustries();
      break;

    case 'direct':
      await testDirect(blueprint);
      break;

    default:
      console.log('Unknown test type. Options: basic, disabled, full, industry, direct');
  }
}

async function testBasic(blueprint) {
  console.log('📋 Basic Test - Dry run with images\n');

  const result = await assembleTheme(blueprint, {
    dryRun: true,
    generateImages: true
  });

  console.log('\n✅ Results:');
  console.log('Success:', result.success);
  console.log('Images generated:', result.images ? 'Yes' : 'No');

  if (result.images) {
    console.log('\nCategories:', Object.keys(result.images).join(', '));
    console.log('Total photos:', Object.values(result.images)
      .reduce((sum, photos) => sum + photos.length, 0));
  }
}

async function testDisabled(blueprint) {
  console.log('📋 Disabled Test - Images turned off\n');

  const result = await assembleTheme(blueprint, {
    dryRun: true,
    generateImages: false  // Disabled
  });

  console.log('\n✅ Results:');
  console.log('Success:', result.success);
  console.log('Images generated:', result.images ? 'Yes' : 'No ✅ (expected)');
}

async function testFull(blueprint) {
  console.log('📋 Full Test - Write files to disk\n');

  const outputDir = './output/test-theme';

  const result = await assembleTheme(blueprint, {
    outputDir,
    generateImages: true
  });

  console.log('\n✅ Results:');
  console.log('Success:', result.success);
  console.log('Files written:', result.files.length);
  console.log('Output directory:', outputDir);

  // Check assembly report
  const reportPath = path.join(outputDir, 'assembly-report.json');
  const report = JSON.parse(await fs.readFile(reportPath, 'utf-8'));

  console.log('\n📄 Assembly Report:');
  console.log('Preset:', report.preset.name);
  console.log('Patterns:', Object.keys(report.patterns).length);

  if (report.images) {
    console.log('Image categories:', report.images.categories.join(', '));
    console.log('Total photos:', report.images.totalPhotos);
  }
}

async function testIndustries() {
  console.log('📋 Industry Test - Test different industries\n');

  const industries = ['construction', 'healthcare', 'restaurant', 'technology'];

  for (const industry of industries) {
    console.log(`\n🏢 Testing ${industry}...`);

    const blueprint = {
      industry,
      client_profile: {
        company: {
          industry,
          name: `Test ${industry} Company`
        }
      }
    };

    const result = await generateBlueprintContent(blueprint, {
      includeImages: true,
      imagePatterns: ['hero', 'services']
    });

    if (result.images) {
      console.log(`  ✅ Generated ${Object.keys(result.images).length} categories`);
      for (const [category, photos] of Object.entries(result.images)) {
        console.log(`     ${category}: ${photos.length} photos`);
      }
    }
  }
}

async function testDirect(blueprint) {
  console.log('📋 Direct Test - Call ContentGenerator directly\n');

  const result = await generateBlueprintContent(blueprint, {
    includeImages: true,
    imagePatterns: ['hero', 'about', 'services']
  });

  console.log('\n✅ Results:');
  console.log('Industry:', result.metadata.industry);
  console.log('Generated:', result.metadata.generated);

  if (result.images) {
    console.log('\nImages:');
    for (const [category, photos] of Object.entries(result.images)) {
      console.log(`  ${category}:`);
      photos.forEach((photo, i) => {
        console.log(`    ${i + 1}. ${photo.description || 'No description'}`);
        console.log(`       Attribution: ${photo.attribution.text}`);
      });
    }
  }
}

runTest().catch(console.error);
