/**
 * Blueprint Generator
 * Generates comprehensive website blueprints from research and client data
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import claude from './claude.js';
import research from './research.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Generate a complete Blueprint from client intake data
 * @param {object} clientData - Client intake data
 * @param {object} researchData - Pre-fetched research data (optional)
 * @returns {Promise<object>} - Generated Blueprint
 */
export async function generateBlueprint(clientData, researchData = null) {
  console.log('\n========================================');
  console.log('  WPF Blueprint Generator');
  console.log('========================================\n');

  // Get research data if not provided
  if (!researchData) {
    console.log('Running discovery research...\n');
    researchData = await research.runDiscoveryResearch(clientData);
  }

  // Initialize Blueprint structure
  const blueprint = {
    version: '1.0',
    created_at: new Date().toISOString(),
    status: 'draft',

    client_profile: extractClientProfile(clientData),
    research_summary: summarizeResearch(researchData),
    content_drafts: {},
    structure_recommendation: null,
  };

  // Generate content for each section
  console.log('\nGenerating content drafts...\n');

  // Hero section
  console.log('  - Hero section...');
  blueprint.content_drafts.hero = await generateHeroContent(
    clientData,
    researchData.bestPractices.hero
  );
  // Add image keywords for hero
  blueprint.content_drafts.hero.image_keywords = generateImageKeywords(
    'hero',
    clientData.industry.category,
    clientData.services
  );

  // About Us section
  console.log('  - About Us section...');
  blueprint.content_drafts.about_us = await generateAboutContent(
    clientData,
    researchData.bestPractices['about-us']
  );
  blueprint.content_drafts.about_us.image_keywords = generateImageKeywords(
    'about',
    clientData.industry.category,
    clientData.services
  );

  // Services section
  console.log('  - Services section...');
  blueprint.content_drafts.services = await generateServicesContent(
    clientData,
    researchData.bestPractices.services
  );
  // Enhance services with image keywords (from research or generated)
  if (researchData.serviceImageKeywords) {
    blueprint.content_drafts.services.services = enhanceServicesWithKeywords(
      blueprint.content_drafts.services.services,
      researchData.serviceImageKeywords,
      clientData.services
    );
  }

  // Testimonials section (AI-generated from partners)
  console.log('  - Testimonials section...');
  blueprint.content_drafts.testimonials = await generateTestimonialsContent(
    clientData,
    researchData.partners,
    researchData.bestPractices.testimonials
  );

  // Stats section
  console.log('  - Stats section...');
  blueprint.content_drafts.stats = await generateStatsContent(clientData);

  // Contact section
  console.log('  - Contact section...');
  blueprint.content_drafts.contact = await generateContactContent(
    clientData,
    researchData.bestPractices.contact
  );
  blueprint.content_drafts.contact.image_keywords = generateImageKeywords(
    'contact',
    clientData.industry.category,
    clientData.services
  );

  // Generate structure recommendation
  console.log('  - Structure recommendation...');
  blueprint.structure_recommendation = generateStructureRecommendation(clientData);

  console.log('\nBlueprint generation complete!\n');

  return blueprint;
}

/**
 * Generate image keywords for a section
 * @param {string} sectionType - Type of section
 * @param {string} industry - Industry category
 * @param {Array} services - Services list
 * @returns {Array} - Image search keywords
 */
function generateImageKeywords(sectionType, industry, services) {
  const industryKeywords = {
    construction: ['construction site', 'building', 'crane', 'workers', 'industrial'],
    roofing: ['roof installation', 'roofing workers', 'shingles', 'roof repair'],
    plumbing: ['plumber working', 'pipes', 'bathroom fixtures', 'plumbing repair'],
    electrical: ['electrician', 'electrical panel', 'wiring', 'electrical work'],
    hvac: ['hvac technician', 'air conditioning', 'heating system', 'hvac unit'],
    landscaping: ['landscaping', 'garden', 'lawn care', 'outdoor design'],
    automotive: ['auto repair', 'mechanic', 'car service', 'garage'],
    healthcare: ['medical office', 'healthcare professional', 'clinic', 'patient care'],
    hospitality: ['hotel', 'restaurant', 'hospitality service', 'guest service'],
    retail: ['retail store', 'shopping', 'customer service', 'storefront'],
    'professional-services': ['office', 'business meeting', 'professional team', 'consultation'],
    technology: ['technology', 'computer', 'software development', 'tech office'],
    'food-beverage': ['restaurant', 'food preparation', 'chef', 'dining'],
    fitness: ['gym', 'fitness training', 'workout', 'exercise'],
    beauty: ['salon', 'beauty treatment', 'spa', 'skincare'],
    'real-estate': ['property', 'real estate', 'house', 'building exterior'],
  };

  const sectionKeywordModifiers = {
    hero: ['professional', 'dramatic lighting', 'wide shot'],
    about: ['team photo', 'workplace', 'company culture'],
    services: ['in action', 'working', 'detail shot'],
    contact: ['office exterior', 'reception', 'customer service'],
  };

  const baseKeywords = industryKeywords[industry] || ['professional', 'business', 'service'];
  const modifiers = sectionKeywordModifiers[sectionType] || [];

  // Combine base keywords with modifiers
  const keywords = [
    ...baseKeywords.slice(0, 3),
    ...modifiers.slice(0, 2),
  ];

  // Add service-specific keywords for hero
  if (sectionType === 'hero' && services && services.length > 0) {
    const primaryService = services.find(s => s.is_primary) || services[0];
    if (primaryService.image_keywords) {
      keywords.push(...primaryService.image_keywords.slice(0, 2));
    }
  }

  return keywords;
}

/**
 * Enhance services with image keywords from research
 */
function enhanceServicesWithKeywords(blueprintServices, researchKeywords, intakeServices) {
  return blueprintServices.map(service => {
    // Check if intake service has keywords
    const intakeService = intakeServices?.find(s => s.name === service.name);
    if (intakeService?.image_keywords && intakeService.image_keywords.length > 0) {
      return { ...service, image_keywords: intakeService.image_keywords };
    }

    // Check research keywords
    const research = researchKeywords?.find(r => r.service_name === service.name);
    if (research) {
      return {
        ...service,
        image_keywords: research.primary_keywords,
        image_keywords_fallback: research.secondary_keywords,
        image_mood: research.mood,
      };
    }

    // Generate basic keywords from service name
    return {
      ...service,
      image_keywords: [
        service.name.toLowerCase(),
        'professional service',
        'quality work',
      ],
    };
  });
}

/**
 * Extract client profile from intake data
 */
function extractClientProfile(clientData) {
  return {
    company: {
      name: clientData.company.name,
      tagline: clientData.company.tagline || null,
      years_in_business: clientData.company.years_in_business || null,
    },
    contact: {
      phone: clientData.contact.phone,
      email: clientData.contact.email,
      address: clientData.contact.address || null,
      hours: clientData.contact.hours || null,
    },
    brand: {
      colors: clientData.brand?.colors || null,
      tone: clientData.brand?.tone || 'professional',
    },
    industry: {
      category: clientData.industry.category,
      niche: clientData.industry.niche || null,
      target_audience: clientData.industry.target_audience || null,
      service_area: clientData.industry.service_area || null,
    },
  };
}

/**
 * Summarize research findings
 */
function summarizeResearch(researchData) {
  return {
    best_practices_researched: Object.keys(researchData.bestPractices || {}),
    competitors_analyzed: researchData.competitors ? true : false,
    partners_researched: researchData.partners?.length || 0,
    service_keywords_generated: researchData.serviceImageKeywords?.length || 0,
    research_date: researchData.timestamp,
  };
}

/**
 * Generate Hero section content
 */
async function generateHeroContent(clientData, bestPractices) {
  const prompt = `
Generate hero section content for ${clientData.company.name}, a ${clientData.industry.category} business.

Client Info:
- Company: ${clientData.company.name}
- Tagline: ${clientData.company.tagline || 'None provided'}
- Industry: ${clientData.industry.category}
- Service Area: ${clientData.industry.service_area || 'Local area'}
- Target Audience: ${clientData.industry.target_audience || 'General'}
- Unique Selling Points: ${clientData.mission?.unique_selling_points?.join(', ') || 'Not provided'}
- Brand Tone: ${clientData.brand?.tone || 'professional'}

Services offered:
${clientData.services.map(s => `- ${s.name}: ${s.description || ''}`).join('\n')}

Generate ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "headline": "Main headline (6-10 words, benefit-focused)",
  "subheadline": "Supporting text (15-25 words, address pain point or expand benefit)",
  "cta_primary": {
    "text": "Primary CTA button text",
    "action": "call|form|quote"
  },
  "cta_secondary": {
    "text": "Secondary CTA text (optional)",
    "action": "learn-more|services"
  }
}
`;

  const result = await claude.research(prompt, {
    systemPrompt: 'You are a copywriter. Return ONLY valid JSON, no markdown or explanation.',
    maxTokens: 1000,
  });

  if (result.success) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('  Warning: Could not parse hero content, using fallback');
    }
  }

  // Fallback content
  const yearsText = clientData.company.years_in_business
    ? `${clientData.company.years_in_business} years of`
    : 'extensive';

  return {
    headline: `${clientData.industry.service_area || 'Local'}'s Trusted ${capitalizeFirst(clientData.industry.category)} Experts`,
    subheadline: `${clientData.company.name} delivers quality ${clientData.industry.category} services with ${yearsText} experience.`,
    cta_primary: {
      text: 'Get Free Quote',
      action: 'form',
    },
    cta_secondary: {
      text: 'Our Services',
      action: 'services',
    },
  };
}

/**
 * Generate About Us section content
 */
async function generateAboutContent(clientData, bestPractices) {
  const prompt = `
Generate about us section content for ${clientData.company.name}.

Client Info:
- Company: ${clientData.company.name}
- Years in Business: ${clientData.company.years_in_business || 'Not specified'}
- Industry: ${clientData.industry.category}
- Vision: ${clientData.mission?.vision || 'Not provided'}
- Mission: ${clientData.mission?.mission || 'Not provided'}
- Values: ${clientData.mission?.values?.join(', ') || 'Not provided'}
- Brand Tone: ${clientData.brand?.tone || 'professional'}
- Notes: ${clientData.notes || 'None'}

Generate ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "headline": "About section headline",
  "story": "2-3 paragraph company story (use first person 'we')",
  "values": [
    {"title": "Value 1", "description": "Brief description"},
    {"title": "Value 2", "description": "Brief description"},
    {"title": "Value 3", "description": "Brief description"}
  ],
  "credentials": [
    "Credential or achievement 1",
    "Credential or achievement 2",
    "Credential or achievement 3"
  ]
}
`;

  const result = await claude.research(prompt, {
    systemPrompt: 'You are a copywriter. Return ONLY valid JSON, no markdown or explanation.',
    maxTokens: 2000,
  });

  if (result.success) {
    try {
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('  Warning: Could not parse about content, using fallback');
    }
  }

  // Fallback
  const yearsText = clientData.company.years_in_business
    ? `For ${clientData.company.years_in_business} years, `
    : '';
  const serviceArea = clientData.industry.service_area || 'local';
  const industry = clientData.industry.category;
  const companyName = clientData.company.name;

  // Build a more complete story from available data
  const storyParts = [
    `${yearsText}${companyName} has been serving the ${serviceArea} community with quality ${industry} services.`,
  ];

  if (clientData.mission?.mission) {
    storyParts.push(clientData.mission.mission);
  }

  if (clientData.mission?.vision) {
    storyParts.push(`Our vision: ${clientData.mission.vision}`);
  }

  // Extract values with proper formatting
  const values = (clientData.mission?.values || []).slice(0, 4).map(v => {
    const parts = v.split(' - ');
    return {
      title: parts[0]?.trim() || v,
      description: parts[1]?.trim() || v,
    };
  });

  return {
    headline: `About ${companyName}`,
    story: storyParts.join('\n\n'),
    values: values.length > 0 ? values : [
      { title: 'Quality', description: 'We deliver excellence in every project.' },
      { title: 'Reliability', description: 'You can count on us to deliver on time.' },
      { title: 'Expertise', description: 'Years of experience in the industry.' },
    ],
    credentials: clientData.mission?.unique_selling_points?.slice(0, 3) || [
      `Trusted ${industry} services in ${serviceArea}`,
      'Experienced and professional team',
      'Customer satisfaction guaranteed',
    ],
  };
}

/**
 * Generate Services section content
 */
async function generateServicesContent(clientData, bestPractices) {
  const services = clientData.services || [];

  const prompt = `
Generate services section content for ${clientData.company.name}.

Services to describe:
${services.map(s => `- ${s.name}: ${s.description || 'No description'} (${s.price_range || 'Price varies'})`).join('\n')}

Client Info:
- Industry: ${clientData.industry.category}
- Brand Tone: ${clientData.brand?.tone || 'professional'}
- Target Audience: ${clientData.industry.target_audience || 'General'}

Generate ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "headline": "Services section headline",
  "intro": "Brief intro paragraph about services",
  "services": [
    {
      "name": "Service Name",
      "description": "2-3 sentence description focusing on customer benefit",
      "features": ["Feature 1", "Feature 2", "Feature 3"],
      "cta": "Learn More|Get Quote"
    }
  ]
}

Include ALL services from the list above.
`;

  const result = await claude.research(prompt, {
    systemPrompt: 'You are a copywriter. Return ONLY valid JSON, no markdown or explanation.',
    maxTokens: 3000,
  });

  if (result.success) {
    try {
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('  Warning: Could not parse services content, using fallback');
    }
  }

  // Fallback - extract features from description if possible
  const extractFeatures = (service) => {
    const features = [];
    const desc = service.description || '';

    // Try to extract key phrases from description
    // Look for patterns like "includes X, Y, and Z" or lists
    const includesMatch = desc.match(/includes?\s+([^.]+)/i);
    if (includesMatch) {
      const items = includesMatch[1].split(/,\s*(?:and\s+)?/).map(s => s.trim()).filter(s => s.length > 0);
      features.push(...items.slice(0, 3));
    }

    // If no features found, generate from service name
    if (features.length === 0) {
      const serviceName = service.name.toLowerCase();
      features.push(
        `Professional ${serviceName}`,
        'Quality workmanship',
        'Competitive pricing'
      );
    }

    return features.slice(0, 3);
  };

  return {
    headline: `Our ${capitalizeFirst(clientData.industry.category)} Services`,
    intro: `${clientData.company.name} offers a full range of ${clientData.industry.category} services tailored to meet your needs.`,
    services: services.map(s => ({
      name: s.name,
      description: s.description || `Professional ${s.name.toLowerCase()} services tailored to your specific requirements.`,
      features: extractFeatures(s),
      cta: s.is_primary ? 'Get Quote' : 'Learn More',
    })),
  };
}

/**
 * Generate AI-powered testimonials based on partner data
 * @param {object} clientData - Client intake data
 * @param {object} partnerResearch - Research data about partners
 * @param {object} bestPractices - Testimonial best practices
 * @returns {Promise<object>} - Testimonials section content
 */
async function generateTestimonialsContent(clientData, partnerResearch, bestPractices) {
  // Normalize partner data (intake may use company_name or name)
  const rawPartners = clientData.partners || [];
  const partners = rawPartners.map(p => ({
    name: p.company_name || p.name,
    industry: p.industry || null,
    services_provided: p.services_provided || p.project_types || [],
    project_keywords: p.project_keywords || p.project_types || [],
    relationship: p.relationship || 'one-time',
    can_use_as_reference: p.can_use_as_reference !== false,
    contact_name: p.contact_name || null,
    contact_role: p.contact_role || null,
    notes: p.notes || null,
  }));

  const companyName = clientData.company.name;
  const industry = clientData.industry.category;
  const serviceArea = clientData.industry.service_area || 'local';
  const services = clientData.services || [];

  // If no partners, return placeholder
  if (partners.length === 0) {
    return {
      headline: 'What Our Customers Say',
      intro: `See why ${serviceArea} customers trust ${companyName}.`,
      testimonials: [],
      is_placeholder: true,
      notes: 'No partner data provided. Add partners to client intake for AI-generated testimonials.',
    };
  }

  // Filter to usable partners
  const usablePartners = partners.filter(p =>
    p.can_use_as_reference !== false
  ).slice(0, 5);

  if (usablePartners.length === 0) {
    return {
      headline: 'What Our Customers Say',
      intro: `See why ${serviceArea} customers trust ${companyName}.`,
      testimonials: [],
      is_placeholder: true,
      notes: 'No partners authorized for reference. Update can_use_as_reference in client intake.',
    };
  }

  // Build context from partner research
  const partnerContext = (partnerResearch || []).map(pr => {
    return `Partner: ${pr.partner}\nResearch: ${pr.data?.research_content || 'No research available'}`;
  }).join('\n\n');

  // Generate testimonials via LLM
  const prompt = `
Generate ${usablePartners.length} realistic testimonials for ${companyName}, a ${industry} company in ${serviceArea}.

Company Services:
${services.map(s => `- ${s.name}: ${s.description || ''}`).join('\n')}

Partners/Clients to generate testimonials for:
${usablePartners.map(p => `
- Company: ${p.name}
  Contact Person: ${p.contact_name || 'Not specified'} (${p.contact_role || 'Project Manager'})
  Industry: ${p.industry || 'Not specified'}
  Services received: ${p.services_provided?.join(', ') || 'General services'}
  Project types: ${p.project_keywords?.join(', ') || 'Various projects'}
  Relationship: ${p.relationship || 'one-time'}
  Notes: ${p.notes || 'None'}
`).join('')}

Partner Research Context:
${partnerContext || 'No additional research available.'}

REQUIREMENTS for each testimonial:
1. Reference SPECIFIC services from the list above
2. Include believable project details (e.g., "45-panel installation", "3-day turnaround")
3. Use industry-appropriate language
4. Follow Problem → Solution → Result structure when possible
5. Vary the openings (don't all start with "We...")
6. Vary focus: quality, communication, timeliness, value, professionalism
7. Include location references where appropriate (${serviceArea})
8. Rating should be 4-5 (not all perfect 5s for authenticity)

Generate ONLY a JSON array (no markdown, no explanation):
[
  {
    "quote": "The testimonial text (2-4 sentences)",
    "author_name": "First Last or First L.",
    "author_role": "Job Title",
    "company": "Partner Company Name",
    "project_type": "Type of project (optional)",
    "rating": 5,
    "is_placeholder": true,
    "generated_from": "partner_data"
  }
]
`;

  const result = await claude.research(prompt, {
    systemPrompt: 'You are a marketing copywriter specializing in authentic testimonials. Return ONLY valid JSON array.',
    maxTokens: 3000,
  });

  if (result.success) {
    try {
      const jsonMatch = result.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const testimonials = JSON.parse(jsonMatch[0]);
        return {
          headline: 'What Our Partners Say',
          intro: `Trusted by leading companies across ${serviceArea}.`,
          testimonials: testimonials.map(t => ({
            ...t,
            is_placeholder: true,
            generated_from: 'partner_data',
          })),
          is_placeholder: true,
          notes: 'AI-generated from partner data. Review and refine before final use.',
        };
      }
    } catch (e) {
      console.warn('  Warning: Could not parse testimonials, using fallback');
    }
  }

  // Fallback - generate basic testimonials
  return {
    headline: 'What Our Partners Say',
    intro: `Trusted by leading companies across ${serviceArea}.`,
    testimonials: usablePartners.map((partner, i) => ({
      quote: `${companyName} delivered exceptional ${services[0]?.name || industry} services for our project. Professional team, on-time delivery, and quality results.`,
      author_name: partner.contact_name || `${partner.name} Representative`,
      author_role: partner.contact_role || 'Project Manager',
      company: partner.name,
      project_type: partner.project_keywords?.[0] || null,
      rating: i === 0 ? 5 : 4 + Math.round(Math.random()),
      is_placeholder: true,
      generated_from: 'fallback',
    })),
    is_placeholder: true,
    notes: 'Fallback testimonials generated. Consider re-running with partner research.',
  };
}

/**
 * Generate stats section content
 * @param {object} clientData - Client intake data
 * @returns {Promise<object>} - Stats section content
 */
async function generateStatsContent(clientData) {
  const providedStats = clientData.stats || {};
  const company = clientData.company;
  const industry = clientData.industry;

  const stats = [];
  const estimatedStats = [];

  // Use provided stats first
  if (providedStats.projects_completed) {
    stats.push({
      value: `${providedStats.projects_completed}+`,
      label: 'Projects Completed',
      is_estimated: false,
      source: 'intake.stats.projects_completed',
    });
  }

  if (providedStats.customer_satisfaction) {
    stats.push({
      value: `${providedStats.customer_satisfaction}%`,
      label: 'Customer Satisfaction',
      is_estimated: false,
      source: 'intake.stats.customer_satisfaction',
    });
  }

  if (providedStats.team_size) {
    stats.push({
      value: `${providedStats.team_size}`,
      label: 'Team Members',
      is_estimated: false,
      source: 'intake.stats.team_size',
    });
  }

  if (company.years_in_business) {
    stats.push({
      value: `${company.years_in_business}`,
      label: 'Years Experience',
      is_estimated: false,
      source: 'intake.company.years_in_business',
    });
  }

  if (providedStats.service_area_coverage) {
    stats.push({
      value: providedStats.service_area_coverage,
      label: 'Service Coverage',
      is_estimated: false,
      source: 'intake.stats.service_area_coverage',
    });
  }

  if (providedStats.certifications_count) {
    stats.push({
      value: `${providedStats.certifications_count}`,
      label: 'Certifications',
      is_estimated: false,
      source: 'intake.stats.certifications_count',
    });
  }

  if (providedStats.response_time) {
    stats.push({
      value: providedStats.response_time,
      label: 'Response Time',
      is_estimated: false,
      source: 'intake.stats.response_time',
    });
  }

  // Add custom stats (supports both 'custom' and 'custom_stats' field names)
  const customStats = providedStats.custom || providedStats.custom_stats || [];
  if (Array.isArray(customStats)) {
    customStats.forEach(customStat => {
      stats.push({
        value: customStat.value,
        label: customStat.label,
        is_estimated: customStat.is_estimated || false,
        source: 'intake.stats.custom',
      });
    });
  }

  // Also handle additional intake stats fields
  if (providedStats.clients_served) {
    stats.push({
      value: `${providedStats.clients_served}+`,
      label: 'Clients Served',
      is_estimated: false,
      source: 'intake.stats.clients_served',
    });
  }

  if (providedStats.team_members) {
    stats.push({
      value: `${providedStats.team_members}`,
      label: 'Team Members',
      is_estimated: false,
      source: 'intake.stats.team_members',
    });
  }

  if (providedStats.years_experience) {
    stats.push({
      value: `${providedStats.years_experience}`,
      label: 'Years Experience',
      is_estimated: false,
      source: 'intake.stats.years_experience',
    });
  }

  // If we have fewer than 4 stats, estimate some based on industry and years
  if (stats.length < 4) {
    const yearsInBusiness = company.years_in_business || 5;

    // Estimate projects completed if not provided
    if (!providedStats.projects_completed) {
      // Rough estimate: 50-100 projects per year depending on industry
      const projectsPerYear = industry.category === 'construction' ? 30 : 50;
      const estimatedProjects = Math.round(yearsInBusiness * projectsPerYear / 10) * 10;
      estimatedStats.push({
        value: `${estimatedProjects}+`,
        label: 'Projects Completed',
        is_estimated: true,
        estimation_basis: `${projectsPerYear} projects/year × ${yearsInBusiness} years`,
      });
    }

    // Estimate customer satisfaction if not provided
    if (!providedStats.customer_satisfaction) {
      estimatedStats.push({
        value: '98%',
        label: 'Customer Satisfaction',
        is_estimated: true,
        estimation_basis: 'Industry standard for established businesses',
      });
    }

    // Add years if not already present
    if (!company.years_in_business && stats.every(s => s.label !== 'Years Experience')) {
      estimatedStats.push({
        value: '5+',
        label: 'Years Experience',
        is_estimated: true,
        estimation_basis: 'Default estimate',
      });
    }
  }

  // Combine stats, preferring provided over estimated, limit to 4-6
  const allStats = [...stats, ...estimatedStats].slice(0, 6);

  return {
    stats: allStats,
    has_estimated: estimatedStats.length > 0,
    notes: estimatedStats.length > 0
      ? 'Some stats are AI-estimated. Verify with client before final use.'
      : 'All stats from client intake.',
  };
}

/**
 * Generate Contact section content
 */
async function generateContactContent(clientData, bestPractices) {
  return {
    headline: 'Get In Touch',
    intro: `Ready to get started? Contact ${clientData.company.name} today.`,
    phone: {
      number: clientData.contact.phone,
      display: clientData.contact.phone,
      note: clientData.contact.hours?.notes || null,
    },
    email: clientData.contact.email,
    address: clientData.contact.address || null,
    hours: clientData.contact.hours || null,
    form: {
      fields: ['name', 'phone', 'email', 'message'],
      submit_text: 'Send Message',
      success_message: "Thanks! We'll be in touch within 24 hours.",
    },
    map: {
      show: clientData.contact.address ? true : false,
      address: clientData.contact.address
        ? `${clientData.contact.address.street}, ${clientData.contact.address.city}`
        : null,
    },
  };
}

/**
 * Generate structure recommendation
 */
function generateStructureRecommendation(clientData) {
  const pages = clientData.website_goals?.pages_needed || [
    'Home',
    'About',
    'Services',
    'Contact',
  ];

  const hasManyServices = (clientData.services?.length || 0) > 4;

  return {
    pages: pages.map(pageName => ({
      name: pageName,
      slug: pageName.toLowerCase().replace(/\s+/g, '-'),
      sections: getSectionsForPage(pageName, clientData),
    })),
    navigation: {
      primary: pages.filter(p => !['Privacy Policy', 'Terms'].includes(p)),
      footer: ['Privacy Policy', 'Terms of Service'],
    },
    recommendations: [
      hasManyServices
        ? 'Consider individual pages for each major service (better for SEO)'
        : 'Services can be on a single page with anchor links',
      'Add a blog/news section later for SEO value',
      'Ensure contact info is in header and footer',
    ],
  };
}

/**
 * Get sections for a page
 */
function getSectionsForPage(pageName, clientData) {
  const pageMap = {
    Home: ['hero', 'services-preview', 'about-preview', 'testimonials', 'cta', 'contact-preview'],
    About: ['hero-simple', 'about-full', 'team', 'values', 'cta'],
    Services: ['hero-simple', 'services-full', 'process', 'cta'],
    Contact: ['hero-simple', 'contact-full', 'map', 'faq'],
    Gallery: ['hero-simple', 'gallery-grid', 'cta'],
    Testimonials: ['hero-simple', 'testimonials-full', 'cta'],
  };

  return pageMap[pageName] || ['hero-simple', 'content', 'cta'];
}

/**
 * Save Blueprint to file
 * @param {object} blueprint - The generated blueprint
 * @param {string} projectPath - Path to save the blueprint
 * @returns {Promise<string>} - Path to saved file
 */
export async function saveBlueprint(blueprint, projectPath) {
  const blueprintDir = path.join(projectPath);
  await fs.mkdir(blueprintDir, { recursive: true });

  const version = blueprint.version || '1';
  const filename = `blueprint-v${version}.json`;
  const filepath = path.join(blueprintDir, filename);

  await fs.writeFile(filepath, JSON.stringify(blueprint, null, 2), 'utf-8');

  console.log(`Blueprint saved to: ${filepath}`);
  return filepath;
}

/**
 * Load Blueprint from file
 * @param {string} filepath - Path to blueprint file
 * @returns {Promise<object>} - Blueprint data
 */
export async function loadBlueprint(filepath) {
  const content = await fs.readFile(filepath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default {
  generateBlueprint,
  saveBlueprint,
  loadBlueprint,
};
