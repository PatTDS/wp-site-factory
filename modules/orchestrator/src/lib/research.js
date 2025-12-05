/**
 * Research Engine
 * Handles best practices and competitor research
 * With automatic token tracking
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import claude, { initTracker, getCurrentTracker } from './claude.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KNOWLEDGE_BASE_PATH = process.env.KNOWLEDGE_BASE_PATH ||
  path.join(__dirname, '../../../../knowledge');

// Cache configuration
const CACHE_CONFIG = {
  maxAgeDays: parseInt(process.env.CACHE_MAX_AGE_DAYS) || 30, // Default 30 days
  checkExpiry: process.env.CACHE_CHECK_EXPIRY !== 'false', // Default true
};

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
 * Research partner companies for testimonial generation
 * @param {Array} partners - Array of partner objects from client intake
 * @param {string} clientIndustry - Client's industry for context
 * @param {object} options - Additional options
 * @returns {Promise<object>} - Partner research results
 */
export async function researchPartners(partners, clientIndustry, options = {}) {
  if (!partners || partners.length === 0) {
    return {
      success: true,
      source: 'none',
      data: [],
      message: 'No partners provided for research',
    };
  }

  const { maxPartners = 5 } = options;

  // Normalize partner data (intake may use company_name or name)
  const normalizedPartners = partners.map(p => ({
    ...p,
    name: p.company_name || p.name,
  }));

  const partnersToResearch = normalizedPartners.slice(0, maxPartners);

  console.log(`\nResearching ${partnersToResearch.length} partner companies...`);

  const researchPromises = partnersToResearch.map(async (partner) => {
    if (!partner.can_use_as_reference && partner.can_use_as_reference !== undefined) {
      console.log(`  Skipping ${partner.name} (not authorized for reference)`);
      return { partner: partner.name, data: null, skipped: true };
    }

    console.log(`  Researching: ${partner.name}...`);

    const prompt = buildPartnerResearchPrompt(partner, clientIndustry);
    const result = await claude.webSearch(prompt, {
      context: `Partner research for testimonial generation`,
    });

    if (!result.success) {
      console.log(`  Failed to research ${partner.name}`);
      return { partner: partner.name, data: null, error: result.error };
    }

    return {
      partner: partner.name,
      data: parsePartnerResearchResults(result.content, partner),
    };
  });

  const results = await Promise.all(researchPromises);

  return {
    success: true,
    source: 'research',
    data: results.filter((r) => r.data !== null),
    skipped: results.filter((r) => r.skipped).map((r) => r.partner),
  };
}

/**
 * Research image keywords for services
 * @param {Array} services - Array of service objects
 * @param {string} industry - Industry category
 * @returns {Promise<object>} - Service image keyword suggestions
 */
export async function researchServiceImageKeywords(services, industry) {
  if (!services || services.length === 0) {
    return { success: true, data: [] };
  }

  console.log(`\nGenerating image keywords for ${services.length} services...`);

  const prompt = buildImageKeywordsPrompt(services, industry);
  const result = await claude.research(prompt, {
    maxTokens: 2000,
  });

  if (!result.success) {
    return result;
  }

  // Parse JSON response
  try {
    const parsed = JSON.parse(result.content);
    return {
      success: true,
      data: parsed,
    };
  } catch (e) {
    // Try to extract JSON from the response
    const jsonMatch = result.content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return { success: true, data: parsed };
      } catch (e2) {
        return {
          success: false,
          error: 'Failed to parse image keywords response',
        };
      }
    }
    return {
      success: false,
      error: 'Failed to parse image keywords response',
    };
  }
}

/**
 * Run full discovery research for a client
 * @param {object} clientData - Client intake data
 * @param {object} options - Options including project name and parallel mode
 * @returns {Promise<object>} - Complete research results
 */
export async function runDiscoveryResearch(clientData, options = {}) {
  const { industry, services, company, partners } = clientData;
  const industryCategory = industry.category;
  const parallel = options.parallel !== false; // Default to parallel

  // Initialize tracker with project name
  const projectName = options.projectName || company?.slug || 'unknown-project';
  const tracker = initTracker(projectName);

  const results = {
    bestPractices: {},
    competitors: null,
    partners: null,
    serviceImageKeywords: null,
    timestamp: new Date().toISOString(),
    project: projectName,
  };

  // Research best practices for each section type
  const sectionTypes = ['hero', 'about-us', 'services', 'testimonials', 'contact'];

  if (parallel) {
    // Run all section research in parallel
    console.log(`\nResearching ${sectionTypes.length} sections in parallel...`);
    const startTime = Date.now();

    const researchPromises = sectionTypes.map(async (sectionType) => {
      console.log(`  Starting: ${sectionType}...`);
      const research = await researchBestPractices(sectionType, industryCategory);
      console.log(`  Completed: ${sectionType}`);
      return { sectionType, data: research.data };
    });

    const researchResults = await Promise.all(researchPromises);

    for (const { sectionType, data } of researchResults) {
      results.bestPractices[sectionType] = data;
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\nAll ${sectionTypes.length} sections completed in ${duration}s (parallel)`);
  } else {
    // Sequential mode (original behavior)
    for (const sectionType of sectionTypes) {
      console.log(`\nResearching ${sectionType} best practices...`);
      const research = await researchBestPractices(sectionType, industryCategory);
      results.bestPractices[sectionType] = research.data;
    }
  }

  // Research competitors
  console.log(`\nResearching ${industryCategory} competitors...`);
  const serviceArea = industry.service_area || '';
  const competitorResearch = await researchCompetitors(industryCategory, serviceArea);
  results.competitors = competitorResearch.data;

  // Research partners for testimonial generation (if provided)
  if (partners && partners.length > 0) {
    console.log(`\nResearching ${partners.length} partner companies for testimonials...`);
    const partnerResearch = await researchPartners(partners, industryCategory);
    results.partners = partnerResearch.data;
  }

  // Generate image keywords for services (if services have no keywords)
  const servicesNeedingKeywords = services?.filter((s) => !s.image_keywords || s.image_keywords.length === 0);
  if (servicesNeedingKeywords && servicesNeedingKeywords.length > 0) {
    console.log(`\nGenerating image keywords for ${servicesNeedingKeywords.length} services...`);
    const keywordsResult = await researchServiceImageKeywords(servicesNeedingKeywords, industryCategory);
    if (keywordsResult.success) {
      results.serviceImageKeywords = keywordsResult.data;
    }
  }

  // Attach token usage summary
  results.tokenUsage = tracker.getTotals();

  return results;
}

/**
 * Get current token tracker
 * @returns {TokenTracker} Current tracker
 */
export function getResearchTracker() {
  return getCurrentTracker();
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
 * Build prompt for partner company research
 */
function buildPartnerResearchPrompt(partner, clientIndustry) {
  const servicesContext = partner.services_provided
    ? `Services provided: ${partner.services_provided.join(', ')}`
    : '';
  const projectContext = partner.project_keywords
    ? `Project types: ${partner.project_keywords.join(', ')}`
    : '';

  return `
Research the company "${partner.name}"${partner.industry ? ` in the ${partner.industry} industry` : ''}.

Context: This company is a client/partner of a ${clientIndustry} business.
${servicesContext}
${projectContext}

I need to understand this company to generate realistic testimonial content. Provide:

1. **Company Overview**
   - What type of company is this?
   - Approximate size (employees, revenue range if public)
   - Primary business focus

2. **Industry Context**
   - What industry sector?
   - Common challenges in their industry
   - What services they typically need from ${clientIndustry} providers

3. **Project Context** (if applicable)
   - Types of projects they typically undertake
   - Scale of operations
   - Geographic focus

4. **Professional Language**
   - Job titles used in this company/industry
   - Industry-specific terminology
   - Professional communication style

5. **Credibility Signals**
   - Any notable projects or achievements
   - Industry reputation
   - Certifications or memberships

Focus on factual, verifiable information that will make testimonial content believable and specific.
`;
}

/**
 * Build prompt for service image keywords
 */
function buildImageKeywordsPrompt(services, industry) {
  const serviceList = services.map((s) => `- ${s.name}${s.description ? `: ${s.description}` : ''}`).join('\n');

  return `
Generate stock photo search keywords for these ${industry} services:

${serviceList}

For each service, provide 3-5 specific image search keywords that would find relevant, professional stock photos.

Requirements:
- Keywords should find REAL photos (not illustrations or clipart)
- Include action/process keywords (e.g., "workers installing", "team working")
- Include equipment/subject keywords (e.g., "construction crane", "concrete panels")
- Be specific to the ${industry} industry
- Avoid generic terms like "business" or "professional" alone

Return as JSON array:
[
  {
    "service_name": "Service Name",
    "primary_keywords": ["keyword1", "keyword2", "keyword3"],
    "secondary_keywords": ["fallback1", "fallback2"],
    "mood": "professional|dramatic|warm|clean"
  }
]

Return ONLY the JSON array, no other text.
`;
}

/**
 * Parse partner research results
 */
function parsePartnerResearchResults(content, partner) {
  return {
    partner_name: partner.name,
    partner_industry: partner.industry,
    services_provided: partner.services_provided || [],
    project_keywords: partner.project_keywords || [],
    relationship: partner.relationship || 'one-time',
    research_content: content,
    metadata: {
      researched_at: new Date().toISOString(),
      confidence: 'medium',
    },
  };
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
 * Checks for cache expiry based on frontmatter last_updated
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

    // Check cache expiry if enabled
    if (CACHE_CONFIG.checkExpiry) {
      const lastUpdated = extractLastUpdated(content);
      if (lastUpdated && isCacheExpired(lastUpdated)) {
        console.log(`  Cache expired for ${sectionType}/${industry} (older than ${CACHE_CONFIG.maxAgeDays} days)`);
        return null;
      }
    }

    return content;
  } catch (error) {
    // File doesn't exist, no cached knowledge
    return null;
  }
}

/**
 * Extract last_updated from frontmatter
 */
function extractLastUpdated(content) {
  const match = content.match(/last_updated:\s*(\d{4}-\d{2}-\d{2}[T\d:.\-Z]*)/);
  if (match) {
    return new Date(match[1]);
  }
  return null;
}

/**
 * Check if cache is expired
 */
function isCacheExpired(lastUpdated) {
  const now = new Date();
  const ageMs = now - lastUpdated;
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  return ageDays > CACHE_CONFIG.maxAgeDays;
}

/**
 * Get existing competitor research
 * Checks for cache expiry based on frontmatter last_updated
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

    // Check cache expiry if enabled
    if (CACHE_CONFIG.checkExpiry) {
      const lastUpdated = extractLastUpdated(content);
      if (lastUpdated && isCacheExpired(lastUpdated)) {
        console.log(`  Cache expired for ${industry} competitor research (older than ${CACHE_CONFIG.maxAgeDays} days)`);
        return null;
      }
    }

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
  researchPartners,
  researchServiceImageKeywords,
  runDiscoveryResearch,
  getResearchTracker,
};
