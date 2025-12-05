/**
 * Template Selector
 * AI-powered template recommendation based on blueprint analysis
 */

import { loadTemplatePreset, listTemplatePresets, loadPresetPatterns } from './pattern-loader.js';

/**
 * Analyze blueprint to extract scoring factors
 */
export function analyzeBlueprint(blueprint) {
  const clientProfile = blueprint.client_profile || {};
  const company = clientProfile.company || {};
  const industry = clientProfile.industry || {};
  const contact = clientProfile.contact || {};
  const brand = clientProfile.brand || {};
  const contentDrafts = blueprint.content_drafts || {};
  const brandProfile = blueprint.brand_profile || brand || {};

  // Get services from either location
  const services = contentDrafts.services?.services || clientProfile.services || [];

  // Extract scoring factors from blueprint
  const factors = {
    // Industry factors - handle both formats
    industry: (industry.category || company.industry || 'general').toLowerCase(),
    industry_sub: (industry.niche || company.industry_subcategory || '').toLowerCase(),

    // Business model factors
    b2b_focus: determineBtoB(company, services, industry),
    b2c_focus: determineBtoC(company, services, industry),
    is_service_business: services.length > 0,
    service_area_business: !!industry.service_area || !!company.service_area,

    // Content factors
    has_tagline: !!company.tagline,
    has_hero_image: !!blueprint.assets?.hero_image,
    has_logo: !!blueprint.assets?.logo,
    has_testimonials: (contentDrafts.testimonials?.testimonials?.length || contentDrafts.testimonials?.items?.length || 0) > 0,
    testimonials_count: contentDrafts.testimonials?.testimonials?.length || contentDrafts.testimonials?.items?.length || 0,
    has_team_info: (contentDrafts.about_us?.team?.length || contentDrafts.about?.team?.length || 0) > 0,
    has_stats: (contentDrafts.about_us?.stats?.length || contentDrafts.about?.stats?.length || 0) > 0,
    has_company_history: !!contentDrafts.about_us?.story || !!contentDrafts.about?.history || !!contentDrafts.about?.description,
    has_portfolio: (contentDrafts.portfolio?.items?.length || 0) > 0,

    // Service factors
    services_count: services.length,
    services_count_3_6: services.length >= 3 && services.length <= 6,
    services_count_high: services.length > 6,
    has_service_descriptions: services.some(s => s.description),

    // Brand factors
    style_preference: brandProfile.style || brand.tone || 'modern',
    premium_positioning: determinePremium(company, brandProfile),
    budget_positioning: determineBudget(company, brandProfile),

    // Technical factors
    has_physical_address: !!contact.address || !!company.address,
    has_phone: !!contact.phone || !!company.phone,
    has_email: !!contact.email || !!company.email,
    established_business: determineEstablished(company),
  };

  return factors;
}

/**
 * Determine if business is B2B focused
 */
function determineBtoB(company, services, industry = {}) {
  const b2bKeywords = ['commercial', 'industrial', 'business', 'corporate', 'enterprise', 'b2b', 'contractor', 'construction', 'builders', 'developers'];
  const description = (company.description || '').toLowerCase();
  const serviceNames = services.map(s => (s.name || '').toLowerCase()).join(' ');
  const targetAudience = (industry.target_audience || '').toLowerCase();
  const combined = `${description} ${serviceNames} ${targetAudience}`;

  return b2bKeywords.some(kw => combined.includes(kw)) ? 0.8 : 0.3;
}

/**
 * Determine if business is B2C focused
 */
function determineBtoC(company, services, industry = {}) {
  const b2cKeywords = ['residential', 'home', 'family', 'personal', 'consumer', 'retail', 'homeowners'];
  const description = (company.description || '').toLowerCase();
  const serviceNames = services.map(s => (s.name || '').toLowerCase()).join(' ');
  const targetAudience = (industry.target_audience || '').toLowerCase();
  const combined = `${description} ${serviceNames} ${targetAudience}`;

  return b2cKeywords.some(kw => combined.includes(kw)) ? 0.8 : 0.3;
}

/**
 * Determine premium positioning
 */
function determinePremium(company, brandProfile) {
  const premiumKeywords = ['premium', 'luxury', 'exclusive', 'high-end', 'bespoke', 'elite'];
  const description = (company.description || '').toLowerCase();
  const style = (brandProfile.style || '').toLowerCase();

  if (premiumKeywords.some(kw => description.includes(kw) || style.includes(kw))) {
    return 0.9;
  }
  return 0.5;
}

/**
 * Determine budget positioning
 */
function determineBudget(company, brandProfile) {
  const budgetKeywords = ['affordable', 'budget', 'cheap', 'economical', 'value'];
  const description = (company.description || '').toLowerCase();

  if (budgetKeywords.some(kw => description.includes(kw))) {
    return 0.8;
  }
  return 0.3;
}

/**
 * Determine if established business
 */
function determineEstablished(company) {
  const establishedKeywords = ['established', 'since', 'years', 'experience', 'trusted'];
  const description = (company.description || '').toLowerCase();

  return establishedKeywords.some(kw => description.includes(kw)) ? 0.8 : 0.4;
}

/**
 * Calculate suitability score for a preset against blueprint factors
 */
export function calculatePresetScore(preset, factors) {
  let score = 0;
  let maxScore = 0;

  const suitability = preset.suitability || {};

  // Industry match (high weight)
  if (preset.industry === factors.industry) {
    score += 0.4;
  } else if (factors.industry.includes(preset.industry) || preset.industry.includes(factors.industry)) {
    score += 0.2;
  }
  maxScore += 0.4;

  // B2B/B2C suitability
  score += (suitability.b2b || 0.5) * factors.b2b_focus * 0.15;
  score += (suitability.b2c || 0.5) * factors.b2c_focus * 0.15;
  maxScore += 0.3;

  // Premium/budget suitability
  score += (suitability.premium || 0.5) * factors.premium_positioning * 0.1;
  score += (1 - (suitability.premium || 0.5)) * factors.budget_positioning * 0.1;
  maxScore += 0.2;

  // Style match
  const styleMatch = preset.style === factors.style_preference ? 1 : 0.5;
  score += styleMatch * 0.1;
  maxScore += 0.1;

  // Normalize to 0-1 range
  return Math.min(1, score / maxScore);
}

/**
 * Calculate suitability score for a pattern against blueprint factors
 */
export function calculatePatternScore(patternManifest, factors) {
  let score = 0.5; // Base score

  const suitability = patternManifest.suitability || {};
  const scoreFactors = suitability.score_factors || {};

  // Industry match
  if (suitability.industries?.includes(factors.industry)) {
    score += 0.2;
  }

  // Style match
  if (suitability.styles?.includes(factors.style_preference)) {
    score += 0.1;
  }

  // Apply score factors from manifest
  for (const [factorName, weight] of Object.entries(scoreFactors)) {
    const factorValue = factors[factorName];
    if (factorValue !== undefined) {
      // Boolean factors
      if (typeof factorValue === 'boolean') {
        score += factorValue ? weight : 0;
      }
      // Numeric factors (normalize to 0-1)
      else if (typeof factorValue === 'number') {
        score += Math.min(1, factorValue) * weight;
      }
    }
  }

  return Math.min(1, Math.max(0, score));
}

/**
 * Select best template preset for a blueprint
 */
export async function selectBestPreset(blueprint, options = {}) {
  const {
    industry = null,
    forcePreset = null,
    returnAll = false,
  } = options;

  // Analyze blueprint
  const factors = analyzeBlueprint(blueprint);

  // Determine industry to search
  const targetIndustry = industry || factors.industry;

  // Get all presets for industry
  const presets = await listTemplatePresets(targetIndustry);

  if (presets.length === 0) {
    throw new Error(`No presets found for industry: ${targetIndustry}`);
  }

  // Force specific preset if requested
  if (forcePreset) {
    const forced = presets.find(p => p.id === forcePreset);
    if (forced) {
      return {
        preset: forced,
        score: 1,
        factors,
        alternatives: [],
      };
    }
  }

  // Score all presets
  const scoredPresets = presets.map(preset => ({
    preset,
    score: calculatePresetScore(preset, factors),
  }));

  // Sort by score (highest first)
  scoredPresets.sort((a, b) => b.score - a.score);

  const best = scoredPresets[0];

  if (returnAll) {
    return {
      preset: best.preset,
      score: best.score,
      factors,
      alternatives: scoredPresets.slice(1),
      all: scoredPresets,
    };
  }

  return {
    preset: best.preset,
    score: best.score,
    factors,
    alternatives: scoredPresets.slice(1, 4), // Top 3 alternatives
  };
}

/**
 * Select best pattern for a section based on blueprint
 */
export async function selectBestPattern(blueprint, section, availablePatterns, options = {}) {
  const factors = analyzeBlueprint(blueprint);

  // Score all patterns for this section
  const scoredPatterns = availablePatterns.map(pattern => ({
    pattern,
    score: calculatePatternScore(pattern, factors),
  }));

  // Sort by score
  scoredPatterns.sort((a, b) => b.score - a.score);

  const best = scoredPatterns[0];

  return {
    pattern: best.pattern,
    score: best.score,
    alternatives: scoredPatterns.slice(1, 3),
  };
}

/**
 * Generate A/B/C template comparison
 */
export async function generateTemplateComparison(blueprint, options = {}) {
  const result = await selectBestPreset(blueprint, { ...options, returnAll: true });

  // Get top 3 for A/B/C comparison
  const top3 = result.all.slice(0, 3);

  return {
    options: top3.map((item, index) => ({
      label: ['A', 'B', 'C'][index],
      preset: item.preset,
      score: item.score,
      scorePercent: Math.round(item.score * 100),
    })),
    recommendation: {
      label: 'A',
      preset: top3[0].preset,
      reason: `Best match for ${result.factors.industry} industry with ${result.factors.b2b_focus > 0.5 ? 'B2B' : 'B2C'} focus.`,
    },
    factors: result.factors,
  };
}

/**
 * Get configuration recommendations for a pattern based on blueprint
 */
export function getPatternConfigRecommendations(patternManifest, blueprint) {
  const factors = analyzeBlueprint(blueprint);
  const config = {};
  const configuration = patternManifest.configuration || {};

  for (const [key, option] of Object.entries(configuration)) {
    // Start with default
    config[key] = option.default;

    // Apply intelligent overrides based on factors
    switch (key) {
      case 'show_tagline':
        config[key] = factors.has_tagline;
        break;

      case 'show_stats':
        config[key] = factors.has_stats;
        break;

      case 'show_testimonials':
        config[key] = factors.has_testimonials;
        break;

      case 'columns':
        if (factors.services_count <= 2) config[key] = '2';
        else if (factors.services_count <= 4) config[key] = '3';
        else config[key] = '4';
        break;

      case 'variant':
        // Keep default for now, could add more logic
        break;

      case 'background':
        // Premium businesses might prefer darker/more dramatic backgrounds
        if (factors.premium_positioning > 0.7 && option.options?.includes('dark')) {
          config[key] = 'dark';
        }
        break;
    }
  }

  return config;
}

export default {
  analyzeBlueprint,
  calculatePresetScore,
  calculatePatternScore,
  selectBestPreset,
  selectBestPattern,
  generateTemplateComparison,
  getPatternConfigRecommendations,
};
