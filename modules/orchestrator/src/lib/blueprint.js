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

  // About Us section
  console.log('  - About Us section...');
  blueprint.content_drafts.about_us = await generateAboutContent(
    clientData,
    researchData.bestPractices['about-us']
  );

  // Services section
  console.log('  - Services section...');
  blueprint.content_drafts.services = await generateServicesContent(
    clientData,
    researchData.bestPractices.services
  );

  // Testimonials section
  console.log('  - Testimonials section...');
  blueprint.content_drafts.testimonials = generateTestimonialsPlaceholder(clientData);

  // Contact section
  console.log('  - Contact section...');
  blueprint.content_drafts.contact = await generateContactContent(
    clientData,
    researchData.bestPractices.contact
  );

  // Generate structure recommendation
  console.log('  - Structure recommendation...');
  blueprint.structure_recommendation = generateStructureRecommendation(clientData);

  console.log('\nBlueprint generation complete!\n');

  return blueprint;
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
    best_practices_researched: Object.keys(researchData.bestPractices),
    competitors_analyzed: researchData.competitors ? true : false,
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
 * Generate Testimonials placeholder
 */
function generateTestimonialsPlaceholder(clientData) {
  return {
    headline: 'What Our Customers Say',
    intro: `See why ${clientData.industry.service_area || 'local'} customers trust ${clientData.company.name}.`,
    testimonials: [
      {
        placeholder: true,
        format: {
          quote: 'Customer testimonial text',
          name: 'Customer Name',
          location: 'City/Suburb',
          rating: 5,
        },
      },
    ],
    review_platforms: {
      google_rating: null,
      google_review_count: null,
      facebook_rating: null,
    },
    notes: 'Collect real testimonials from client. Consider pulling from Google Reviews.',
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
