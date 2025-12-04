/**
 * Research Engine
 * Handles best practices and competitor research
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import claude from './claude.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KNOWLEDGE_BASE_PATH = process.env.KNOWLEDGE_BASE_PATH ||
  path.join(__dirname, '../../../../knowledge');

/**
 * Research best practices for a section type and industry
 * @param {string} sectionType - hero, about-us, services, testimonials, contact
 * @param {string} industry - Industry category
 * @param {object} options - Additional options
 * @returns {Promise<object>} - Research results
 */
export async function researchBestPractices(sectionType, industry, options = {}) {
  const { forceRefresh = false } = options;

  // Check existing knowledge first
  const existingKnowledge = await getExistingKnowledge(sectionType, industry);

  if (existingKnowledge && !forceRefresh) {
    console.log(`Using existing knowledge for ${sectionType}/${industry}`);
    return {
      success: true,
      source: 'cache',
      data: existingKnowledge,
    };
  }

  console.log(`Researching best practices for ${sectionType} sections in ${industry} industry...`);

  const prompt = buildBestPracticesPrompt(sectionType, industry);
  const result = await claude.webSearch(prompt, {
    context: `Industry: ${industry}, Section: ${sectionType}`,
  });

  if (!result.success) {
    return result;
  }

  // Parse and store the results
  const parsedResults = parseResearchResults(result.content, sectionType, industry);

  // Save to knowledge base
  await saveToKnowledgeBase(sectionType, industry, parsedResults);

  return {
    success: true,
    source: 'research',
    data: parsedResults,
    usage: result.usage,
  };
}

/**
 * Research competitors in an industry
 * @param {string} industry - Industry category
 * @param {string} location - Geographic location (optional)
 * @param {object} options - Additional options
 * @returns {Promise<object>} - Competitor research results
 */
export async function researchCompetitors(industry, location = '', options = {}) {
  const { forceRefresh = false, maxCompetitors = 10 } = options;

  // Check existing research
  const existingResearch = await getExistingCompetitorResearch(industry);

  if (existingResearch && !forceRefresh) {
    console.log(`Using existing competitor research for ${industry}`);
    return {
      success: true,
      source: 'cache',
      data: existingResearch,
    };
  }

  console.log(`Researching competitors in ${industry} industry${location ? ` (${location})` : ''}...`);

  const prompt = buildCompetitorResearchPrompt(industry, location, maxCompetitors);
  const result = await claude.webSearch(prompt);

  if (!result.success) {
    return result;
  }

  // Parse and store the results
  const parsedResults = parseCompetitorResults(result.content, industry);

  // Save to knowledge base
  await saveCompetitorResearch(industry, parsedResults);

  return {
    success: true,
    source: 'research',
    data: parsedResults,
    usage: result.usage,
  };
}

/**
 * Run full discovery research for a client
 * @param {object} clientData - Client intake data
 * @returns {Promise<object>} - Complete research results
 */
export async function runDiscoveryResearch(clientData) {
  const { industry, services } = clientData;
  const industryCategory = industry.category;

  const results = {
    bestPractices: {},
    competitors: null,
    timestamp: new Date().toISOString(),
  };

  // Research best practices for each section type
  const sectionTypes = ['hero', 'about-us', 'services', 'testimonials', 'contact'];

  for (const sectionType of sectionTypes) {
    console.log(`\nResearching ${sectionType} best practices...`);
    const research = await researchBestPractices(sectionType, industryCategory);
    results.bestPractices[sectionType] = research.data;
  }

  // Research competitors
  console.log(`\nResearching ${industryCategory} competitors...`);
  const serviceArea = industry.service_area || '';
  const competitorResearch = await researchCompetitors(industryCategory, serviceArea);
  results.competitors = competitorResearch.data;

  return results;
}

// ============ Helper Functions ============

/**
 * Build prompt for best practices research
 */
function buildBestPracticesPrompt(sectionType, industry) {
  const sectionDescriptions = {
    hero: 'hero section (main banner with headline, subheadline, and CTA)',
    'about-us': 'about us section (company story, mission, values, team)',
    services: 'services section (service listings with descriptions)',
    testimonials: 'testimonials section (customer reviews and social proof)',
    contact: 'contact section (contact form, phone, address, hours)',
  };

  return `
Research best practices for writing an effective ${sectionDescriptions[sectionType]} for a ${industry} business website.

I need:
1. **Key principles** - What makes this section effective?
2. **What works** - Specific patterns from successful ${industry} websites
3. **What to avoid** - Common mistakes
4. **Formula/template** - A reusable structure
5. **Examples** - Real examples of effective ${sectionType} content for ${industry}

Focus on:
- Conversion optimization
- Industry-specific messaging
- Trust building
- Clear calls-to-action

Provide actionable, specific advice that can be directly applied.
Format your response with clear headings and bullet points.
`;
}

/**
 * Build prompt for competitor research
 */
function buildCompetitorResearchPrompt(industry, location, maxCompetitors) {
  return `
Research the top ${maxCompetitors} ${industry} company websites${location ? ` in ${location}` : ''}.

For each website, analyze:
1. **Company name and URL**
2. **Hero section** - Headline, subheadline, CTA
3. **Services offered** - How they present their services
4. **Unique selling points** - What makes them stand out
5. **Trust signals** - Certifications, reviews, guarantees
6. **Overall impression** - What works well

Also provide:
- **Common patterns** across successful ${industry} websites
- **Differentiation opportunities** - What's missing or could be done better
- **Messaging themes** - Common language and positioning

Focus on actionable insights that can inform website content creation.
`;
}

/**
 * Parse research results into structured format
 */
function parseResearchResults(content, sectionType, industry) {
  return {
    section: sectionType,
    industry: industry,
    content: content,
    metadata: {
      researched_at: new Date().toISOString(),
      confidence: 'medium', // Default, can be updated
      version: '1.0',
    },
  };
}

/**
 * Parse competitor research results
 */
function parseCompetitorResults(content, industry) {
  return {
    industry: industry,
    content: content,
    metadata: {
      researched_at: new Date().toISOString(),
      confidence: 'medium',
      version: '1.0',
    },
  };
}

/**
 * Get existing knowledge from knowledge base
 */
async function getExistingKnowledge(sectionType, industry) {
  const industryPath = path.join(
    KNOWLEDGE_BASE_PATH,
    'best-practices',
    'sections',
    sectionType,
    'by-industry',
    `${industry}.md`
  );

  try {
    const content = await fs.readFile(industryPath, 'utf-8');
    // Check if it's just a template (not populated)
    if (content.includes('*To be populated through research*')) {
      return null;
    }
    return content;
  } catch (error) {
    // File doesn't exist, no cached knowledge
    return null;
  }
}

/**
 * Get existing competitor research
 */
async function getExistingCompetitorResearch(industry) {
  const researchPath = path.join(
    KNOWLEDGE_BASE_PATH,
    'industry-research',
    industry,
    'patterns.md'
  );

  try {
    const content = await fs.readFile(researchPath, 'utf-8');
    return content;
  } catch (error) {
    return null;
  }
}

/**
 * Save research to knowledge base
 */
async function saveToKnowledgeBase(sectionType, industry, data) {
  const industryDir = path.join(
    KNOWLEDGE_BASE_PATH,
    'best-practices',
    'sections',
    sectionType,
    'by-industry'
  );

  // Ensure directory exists
  await fs.mkdir(industryDir, { recursive: true });

  const filePath = path.join(industryDir, `${industry}.md`);

  const markdown = formatAsMarkdown(data, sectionType, industry);
  await fs.writeFile(filePath, markdown, 'utf-8');

  console.log(`Saved best practices to: ${filePath}`);
}

/**
 * Save competitor research to knowledge base
 */
async function saveCompetitorResearch(industry, data) {
  const industryDir = path.join(
    KNOWLEDGE_BASE_PATH,
    'industry-research',
    industry
  );

  // Ensure directory exists
  await fs.mkdir(industryDir, { recursive: true });

  const filePath = path.join(industryDir, 'patterns.md');

  const markdown = formatCompetitorResearchAsMarkdown(data, industry);
  await fs.writeFile(filePath, markdown, 'utf-8');

  console.log(`Saved competitor research to: ${filePath}`);
}

/**
 * Format research data as markdown
 */
function formatAsMarkdown(data, sectionType, industry) {
  return `---
section: ${sectionType}
industry: ${industry}
sources: []
confidence: ${data.metadata.confidence}
last_updated: ${data.metadata.researched_at}
version: ${data.metadata.version}
tags:
  - section:${sectionType}
  - industry:${industry}
  - quality:researched
---

# ${capitalizeFirst(sectionType.replace('-', ' '))} Best Practices for ${capitalizeFirst(industry)}

${data.content}

---

**Research Date**: ${data.metadata.researched_at}
**Confidence**: ${data.metadata.confidence}
`;
}

/**
 * Format competitor research as markdown
 */
function formatCompetitorResearchAsMarkdown(data, industry) {
  return `---
industry: ${industry}
type: competitor-research
confidence: ${data.metadata.confidence}
last_updated: ${data.metadata.researched_at}
version: ${data.metadata.version}
---

# ${capitalizeFirst(industry)} Industry - Competitor Research

${data.content}

---

**Research Date**: ${data.metadata.researched_at}
**Confidence**: ${data.metadata.confidence}
`;
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default {
  researchBestPractices,
  researchCompetitors,
  runDiscoveryResearch,
};
