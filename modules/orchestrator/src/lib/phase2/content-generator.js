/**
 * Content Generator - Automated content and image generation for WPF
 *
 * Integrates:
 * - Stock photo APIs (Unsplash + Pexels)
 * - LLM content generation (future)
 * - Attribution management
 *
 * @module content-generator
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config();

/**
 * Stock Photo Service Integration
 */
class StockPhotoIntegration {
  constructor() {
    this.unsplashKey = process.env.UNSPLASH_API_KEY;
    this.pexelsKey = process.env.PEXELS_API_KEY;
    this.cacheDir = path.resolve(__dirname, '../../../output/stock-photos-cache');
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    // Ensure cache directory exists
    await fs.mkdir(this.cacheDir, { recursive: true });
    this.initialized = true;
  }

  /**
   * Get industry-specific search keywords
   */
  getIndustryKeywords(industry) {
    const keywordMap = {
      'construction': ['construction site', 'building construction', 'industrial work', 'workers', 'architecture', 'crane', 'blueprint'],
      'healthcare': ['medical team', 'hospital', 'doctor', 'nurse', 'healthcare professional', 'medical equipment', 'patient care'],
      'restaurant': ['restaurant interior', 'food plating', 'chef cooking', 'dining table', 'kitchen', 'waiter', 'gourmet food'],
      'professional': ['office team', 'business meeting', 'professional workspace', 'collaboration', 'corporate', 'handshake', 'conference'],
      'technology': ['technology office', 'software development', 'coding', 'computer screen', 'innovation', 'startup', 'digital'],
      'retail': ['retail store', 'shopping', 'customer service', 'products', 'storefront', 'cashier', 'display'],
      'creative': ['creative workspace', 'design studio', 'artist', 'creative team', 'brainstorming', 'innovation', 'art']
    };

    return keywordMap[industry] || ['business', 'professional', 'team', 'office'];
  }

  /**
   * Get pattern-specific search keywords
   */
  getPatternKeywords(patternCategory) {
    const patternMap = {
      'hero': ['hero image', 'banner', 'skyline', 'landscape', 'wide angle'],
      'about': ['team', 'office', 'people working', 'collaboration'],
      'services': ['service', 'professional', 'quality', 'expertise'],
      'testimonials': ['happy customer', 'satisfied client', 'thumbs up', 'positive'],
      'team': ['team photo', 'group portrait', 'professional headshot', 'staff'],
      'contact': ['office building', 'reception', 'contact', 'communication'],
      'gallery': ['portfolio', 'work samples', 'project', 'showcase'],
      'cta': ['action', 'motivation', 'success', 'achievement']
    };

    return patternMap[patternCategory] || ['professional', 'business'];
  }

  /**
   * Search photos from Unsplash
   */
  async searchUnsplash(query, count = 5) {
    if (!this.unsplashKey) {
      console.warn('⚠️  Unsplash API key not configured');
      return [];
    }

    try {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Client-ID ${this.unsplashKey}` }
      });

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results.map(photo => ({
        id: `unsplash-${photo.id}`,
        source: 'unsplash',
        urls: {
          thumbnail: photo.urls.thumb,
          small: photo.urls.small,
          regular: photo.urls.regular,
          large: photo.urls.full
        },
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        downloadUrl: photo.links.download_location,
        description: photo.description || photo.alt_description || '',
        width: photo.width,
        height: photo.height
      }));
    } catch (error) {
      console.error('Unsplash search error:', error.message);
      return [];
    }
  }

  /**
   * Search photos from Pexels
   */
  async searchPexels(query, count = 5) {
    if (!this.pexelsKey) {
      console.warn('⚠️  Pexels API key not configured');
      return [];
    }

    try {
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
      const response = await fetch(url, {
        headers: { 'Authorization': this.pexelsKey }
      });

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`);
      }

      const data = await response.json();
      return data.photos.map(photo => ({
        id: `pexels-${photo.id}`,
        source: 'pexels',
        urls: {
          thumbnail: photo.src.tiny,
          small: photo.src.small,
          regular: photo.src.medium,
          large: photo.src.large
        },
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        downloadUrl: photo.src.original,
        description: photo.alt || '',
        width: photo.width,
        height: photo.height
      }));
    } catch (error) {
      console.error('Pexels search error:', error.message);
      return [];
    }
  }

  /**
   * Search photos from both APIs and merge results
   */
  async searchPhotos(query, count = 10) {
    await this.initialize();

    const halfCount = Math.ceil(count / 2);
    const [unsplashResults, pexelsResults] = await Promise.all([
      this.searchUnsplash(query, halfCount),
      this.searchPexels(query, halfCount)
    ]);

    // Merge and shuffle results
    const allResults = [...unsplashResults, ...pexelsResults];
    return allResults.slice(0, count);
  }

  /**
   * Download photo to cache
   */
  async downloadPhoto(photo, size = 'regular') {
    await this.initialize();

    const url = photo.urls[size];
    const ext = url.includes('.jpg') || url.includes('jpeg') ? 'jpg' : 'png';
    const filename = `${photo.id}-${size}.${ext}`;
    const filepath = path.join(this.cacheDir, filename);

    // Check if already cached
    try {
      await fs.access(filepath);
      return {
        path: filepath,
        url: url,
        attribution: this.getAttribution(photo)
      };
    } catch {
      // Not cached, download it
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      await fs.writeFile(filepath, Buffer.from(buffer));

      // Trigger download endpoint for Unsplash (required by API terms)
      if (photo.source === 'unsplash' && photo.downloadUrl) {
        fetch(photo.downloadUrl, {
          headers: { 'Authorization': `Client-ID ${this.unsplashKey}` }
        }).catch(() => {}); // Fire and forget
      }

      return {
        path: filepath,
        url: url,
        attribution: this.getAttribution(photo)
      };
    } catch (error) {
      console.error('Photo download error:', error.message);
      return null;
    }
  }

  /**
   * Get attribution HTML for photo
   */
  getAttribution(photo) {
    const source = photo.source === 'unsplash' ? 'Unsplash' : 'Pexels';
    return {
      text: `Photo by ${photo.photographer} on ${source}`,
      html: `Photo by <a href="${photo.photographerUrl}" target="_blank" rel="noopener">${photo.photographer}</a> on <a href="${photo.source === 'unsplash' ? 'https://unsplash.com' : 'https://pexels.com'}" target="_blank" rel="noopener">${source}</a>`,
      photographer: photo.photographer,
      photographerUrl: photo.photographerUrl,
      source: source
    };
  }
}

/**
 * LLM Content Generator - AI-powered content generation using Claude
 */
class LLMContentGenerator {
  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.client = this.apiKey ? new Anthropic({ apiKey: this.apiKey }) : null;
    this.cacheDir = path.resolve(__dirname, '../../../output/generated-content');
    this.initialized = false;

    // Model configuration for cost optimization
    this.models = {
      content: 'claude-sonnet-4-5-20250929',  // Sonnet 4.5 (Sep 2025) - high quality, $3/$15 per million tokens
      seo: 'claude-3-5-haiku-20241022',       // Haiku 3.5 (Oct 2024) - fast and cheap for structured output
      alt: 'claude-3-5-haiku-20241022'        // Haiku 3.5 (Oct 2024) - fast and cheap for short text
    };
  }

  async initialize() {
    if (this.initialized) return;
    await fs.mkdir(this.cacheDir, { recursive: true });
    this.initialized = true;
  }

  /**
   * Get industry-specific tone
   */
  getToneForIndustry(industry) {
    const toneMap = {
      'construction': 'Professional, confident, results-oriented',
      'healthcare': 'Compassionate, trustworthy, expert',
      'restaurant': 'Warm, inviting, sensory-focused',
      'professional': 'Expert, reliable, clear',
      'technology': 'Innovative, precise, forward-thinking',
      'retail': 'Friendly, helpful, customer-focused',
      'creative': 'Bold, expressive, unique'
    };
    return toneMap[industry] || 'Professional, clear, engaging';
  }

  /**
   * Generate cache key from parameters
   */
  getCacheKey(params) {
    const str = JSON.stringify(params);
    return crypto.createHash('md5').update(str).digest('hex');
  }

  /**
   * Get cached content
   */
  async getCached(key) {
    await this.initialize();
    const filepath = path.join(this.cacheDir, `${key}.json`);
    try {
      const data = await fs.readFile(filepath, 'utf-8');
      const cached = JSON.parse(data);
      // Cache valid for 30 days
      const age = Date.now() - new Date(cached.generated).getTime();
      if (age < 30 * 24 * 60 * 60 * 1000) {
        return cached.content;
      }
    } catch {
      return null;
    }
    return null;
  }

  /**
   * Set cached content
   */
  async setCached(key, content) {
    await this.initialize();
    const filepath = path.join(this.cacheDir, `${key}.json`);
    const data = {
      generated: new Date().toISOString(),
      content
    };
    await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  }

  /**
   * Parse JSON from Claude response (handles markdown wrapping)
   */
  parseJSONResponse(text) {
    // Try direct parse first
    try {
      return JSON.parse(text);
    } catch {
      // Try extracting JSON from markdown code block
      const jsonMatch = text.match(/```json\s*\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      // Try finding any JSON object
      const objMatch = text.match(/\{[\s\S]*\}/);
      if (objMatch) {
        return JSON.parse(objMatch[0]);
      }
      throw new Error('Could not parse JSON from response');
    }
  }

  /**
   * Generate page content using Claude
   */
  async generatePageContent(blueprint, pageType = 'home') {
    if (!this.client) {
      console.warn('⚠️  Anthropic API key not configured');
      return this.getFallbackContent(pageType);
    }

    const industry = blueprint.client_profile?.company?.industry ||
                    blueprint.industry ||
                    'professional';

    const companyName = blueprint.client_profile?.company?.name ||
                       blueprint.companyName ||
                       'Your Company';

    const services = blueprint.services?.map(s => s.name || s).join(', ') ||
                    'professional services';

    const tone = this.getToneForIndustry(industry);

    // Check cache
    const cacheKey = this.getCacheKey({ type: 'page', industry, companyName, pageType });
    const cached = await this.getCached(cacheKey);
    if (cached) {
      console.log(`   📦 Using cached ${pageType} content`);
      return cached;
    }

    console.log(`   🤖 Generating ${pageType} content with Claude...`);

    const prompt = `You are an expert copywriter specializing in ${industry} businesses.

Task: Write compelling ${pageType} page content for ${companyName}.

Context:
- Industry: ${industry}
- Company: ${companyName}
- Services: ${services}
- Tone: ${tone}

Requirements:
1. headline: Compelling, action-oriented, max 10 words
2. subheadline: Supporting the headline, max 20 words
3. bodyCopy: 2-3 paragraphs, 150-200 words total, focus on benefits not features
4. ctaText: Clear action verb, max 5 words

Output format: Valid JSON only, no markdown wrapper
{
  "headline": "...",
  "subheadline": "...",
  "bodyCopy": "...",
  "ctaText": "..."
}`;

    try {
      const response = await this.client.messages.create({
        model: this.models.content,
        max_tokens: 1024,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = this.parseJSONResponse(response.content[0].text);

      // Cache the result
      await this.setCached(cacheKey, content);

      return content;
    } catch (error) {
      console.error(`   ❌ Content generation error: ${error.message}`);
      return this.getFallbackContent(pageType);
    }
  }

  /**
   * Generate SEO metadata
   */
  async generateSEOMeta(blueprint, content) {
    if (!this.client) {
      return this.getFallbackSEO();
    }

    const industry = blueprint.client_profile?.company?.industry ||
                    blueprint.industry ||
                    'professional';

    const companyName = blueprint.client_profile?.company?.name ||
                       blueprint.companyName ||
                       'Your Company';

    // Check cache
    const cacheKey = this.getCacheKey({ type: 'seo', industry, companyName, headline: content.headline });
    const cached = await this.getCached(cacheKey);
    if (cached) {
      console.log(`   📦 Using cached SEO metadata`);
      return cached;
    }

    console.log(`   🤖 Generating SEO metadata with Claude...`);

    const prompt = `Generate SEO metadata for a ${industry} business website.

Company: ${companyName}
Headline: ${content.headline}
Subheadline: ${content.subheadline}

Requirements:
1. metaTitle: 50-60 characters, include company name
2. metaDescription: 150-160 characters, compelling, includes call-to-action
3. keywords: array of 5-8 relevant keywords for ${industry}

Output format: Valid JSON only
{
  "metaTitle": "...",
  "metaDescription": "...",
  "keywords": [...]
}`;

    try {
      const response = await this.client.messages.create({
        model: this.models.seo,
        max_tokens: 512,
        temperature: 0.5,
        messages: [{ role: 'user', content: prompt }]
      });

      const seo = this.parseJSONResponse(response.content[0].text);

      // Validate lengths
      if (seo.metaTitle && seo.metaTitle.length > 60) {
        seo.metaTitle = seo.metaTitle.substring(0, 57) + '...';
      }
      if (seo.metaDescription && seo.metaDescription.length > 160) {
        seo.metaDescription = seo.metaDescription.substring(0, 157) + '...';
      }

      await this.setCached(cacheKey, seo);

      return seo;
    } catch (error) {
      console.error(`   ❌ SEO generation error: ${error.message}`);
      return this.getFallbackSEO();
    }
  }

  /**
   * Generate alt text for image
   */
  async generateAltText(pattern, industry, photoDescription = '') {
    if (!this.client) {
      return `${industry} ${pattern} image`;
    }

    const prompt = `Generate descriptive alt text for a ${pattern} section image on a ${industry} website.

Image description: ${photoDescription || 'professional image'}

Requirements:
- Descriptive and specific
- 80-125 characters
- Include relevant keywords
- Accessibility-focused

Output: Plain text only, no quotes or formatting.`;

    try {
      const response = await this.client.messages.create({
        model: this.models.alt,
        max_tokens: 128,
        temperature: 0.5,
        messages: [{ role: 'user', content: prompt }]
      });

      let altText = response.content[0].text.trim();

      // Remove quotes if present
      altText = altText.replace(/^["']|["']$/g, '');

      // Ensure length constraint
      if (altText.length > 125) {
        altText = altText.substring(0, 122) + '...';
      }

      return altText;
    } catch (error) {
      console.error(`   ❌ Alt text generation error: ${error.message}`);
      return `${industry} ${pattern} showcasing professional services`;
    }
  }

  /**
   * Fallback content when API unavailable
   */
  getFallbackContent(pageType) {
    const templates = {
      home: {
        headline: 'Welcome to Our Services',
        subheadline: 'Professional solutions tailored to your needs',
        bodyCopy: 'We provide exceptional service and expertise to help your business succeed. Our team is dedicated to delivering quality results that exceed expectations.',
        ctaText: 'Get Started Today'
      },
      about: {
        headline: 'About Our Company',
        subheadline: 'Experience and dedication you can trust',
        bodyCopy: 'With years of experience in the industry, we have built a reputation for excellence and reliability. Our team of professionals is committed to your success.',
        ctaText: 'Learn More'
      },
      services: {
        headline: 'Our Services',
        subheadline: 'Comprehensive solutions for your business',
        bodyCopy: 'We offer a full range of professional services designed to meet your specific needs. From consultation to implementation, we are with you every step of the way.',
        ctaText: 'View Services'
      }
    };
    return templates[pageType] || templates.home;
  }

  /**
   * Fallback SEO when API unavailable
   */
  getFallbackSEO() {
    return {
      metaTitle: 'Professional Services | Your Company',
      metaDescription: 'Discover exceptional professional services tailored to your needs. Contact us today to learn how we can help your business succeed.',
      keywords: ['professional services', 'business solutions', 'expert consulting']
    };
  }
}

/**
 * Content Generator - Main orchestrator for automated content
 */
export class ContentGenerator {
  constructor() {
    this.stockPhotos = new StockPhotoIntegration();
    this.llmContent = new LLMContentGenerator();
  }

  /**
   * Generate images for a blueprint
   *
   * @param {Object} blueprint - Blueprint object
   * @param {Object} options - Generation options
   * @returns {Object} Image assignments for patterns
   */
  async generateImages(blueprint, options = {}) {
    const {
      industry = 'professional',
      photosPerPattern = 3,
      sizes = ['regular', 'large'],
      patterns = [] // Array of pattern categories to generate images for
    } = options;

    console.log('\n🖼️  Generating stock photos for blueprint...');
    console.log(`Industry: ${industry}`);
    console.log(`Patterns: ${patterns.join(', ')}`);

    const imageAssignments = {};
    const industryKeywords = this.stockPhotos.getIndustryKeywords(industry);

    for (const patternCategory of patterns) {
      console.log(`\n📸 Searching photos for: ${patternCategory}`);

      // Combine industry and pattern keywords
      const patternKeywords = this.stockPhotos.getPatternKeywords(patternCategory);
      const searchQuery = `${industryKeywords[0]} ${patternKeywords[0]}`;

      // Search for photos
      const photos = await this.stockPhotos.searchPhotos(searchQuery, photosPerPattern);

      if (photos.length === 0) {
        console.warn(`   ⚠️  No photos found for ${patternCategory}`);
        continue;
      }

      console.log(`   ✅ Found ${photos.length} photos`);

      // Download photos in specified sizes
      const downloadedPhotos = [];
      for (const photo of photos) {
        const downloads = {};

        for (const size of sizes) {
          const result = await this.stockPhotos.downloadPhoto(photo, size);
          if (result) {
            downloads[size] = result;
          }
        }

        if (Object.keys(downloads).length > 0) {
          downloadedPhotos.push({
            id: photo.id,
            description: photo.description,
            downloads,
            attribution: this.stockPhotos.getAttribution(photo)
          });
        }
      }

      imageAssignments[patternCategory] = downloadedPhotos;
      console.log(`   ✅ Downloaded ${downloadedPhotos.length} photos`);
    }

    return imageAssignments;
  }

  /**
   * Generate content for blueprint using LLM
   *
   * @param {Object} blueprint - Blueprint object
   * @param {Object} options - Generation options
   * @returns {Object} Generated content
   */
  async generateContent(blueprint, options = {}) {
    const {
      pageTypes = ['home', 'about', 'services'],
      generateSEO = true,
      generateAltText = true
    } = options;

    console.log('\n📝 Generating LLM content for blueprint...');

    const result = {
      pages: {},
      seo: {},
      altText: {}
    };

    try {
      // Generate content for each page type
      for (const pageType of pageTypes) {
        console.log(`\n📄 Generating ${pageType} page content...`);

        const pageContent = await this.llmContent.generatePageContent(blueprint, pageType);
        result.pages[pageType] = pageContent;

        // Generate SEO metadata for this page
        if (generateSEO) {
          const seoMeta = await this.llmContent.generateSEOMeta(blueprint, pageContent);
          result.seo[pageType] = seoMeta;
        }
      }

      // Generate alt text for images if requested
      if (generateAltText && options.images) {
        const industry = blueprint.client_profile?.company?.industry ||
                        blueprint.industry ||
                        'professional';

        console.log(`\n🖼️  Generating alt text for images...`);

        for (const [pattern, photos] of Object.entries(options.images)) {
          result.altText[pattern] = [];

          for (const photo of photos) {
            const altText = await this.llmContent.generateAltText(
              pattern,
              industry,
              photo.description
            );
            result.altText[pattern].push(altText);
          }

          console.log(`   ✅ Generated ${result.altText[pattern].length} alt texts for ${pattern}`);
        }
      }

      console.log(`\n✅ LLM content generation complete!`);

    } catch (error) {
      console.error(`\n❌ LLM content generation error: ${error.message}`);
      // Return partial results even if there was an error
    }

    return result;
  }

  /**
   * Generate complete content package for blueprint
   *
   * @param {Object} blueprint - Blueprint object
   * @param {Object} options - Generation options
   * @returns {Object} Complete content package
   */
  async generate(blueprint, options = {}) {
    const {
      includeImages = true,
      includeContent = true,  // LLM now implemented!
      imagePatterns = ['hero', 'about', 'services', 'testimonials', 'team', 'gallery'],
      pageTypes = ['home', 'about', 'services'],
      generateSEO = true,
      generateAltText = true
    } = options;

    const result = {
      images: {},
      content: {},
      metadata: {
        generated: new Date().toISOString(),
        industry: blueprint.industry || blueprint.client_profile?.company?.industry || 'professional',
        company: blueprint.companyName || blueprint.client_profile?.company?.name || 'Unknown'
      }
    };

    // Generate images
    if (includeImages) {
      result.images = await this.generateImages(blueprint, {
        industry: result.metadata.industry,
        patterns: imagePatterns
      });
    }

    // Generate content with LLM
    if (includeContent) {
      result.content = await this.generateContent(blueprint, {
        pageTypes,
        generateSEO,
        generateAltText,
        images: result.images  // Pass images for alt text generation
      });
    }

    return result;
  }
}

/**
 * Helper function to integrate content generation into blueprint workflow
 */
export async function generateBlueprintContent(blueprint, options = {}) {
  const generator = new ContentGenerator();
  return await generator.generate(blueprint, options);
}

// Default export
export default ContentGenerator;
