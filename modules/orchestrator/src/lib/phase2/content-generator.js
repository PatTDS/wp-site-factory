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
 * Content Generator - Main orchestrator for automated content
 */
export class ContentGenerator {
  constructor() {
    this.stockPhotos = new StockPhotoIntegration();
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
   * Generate content for blueprint (future: LLM integration)
   *
   * @param {Object} blueprint - Blueprint object
   * @param {Object} options - Generation options
   * @returns {Object} Generated content
   */
  async generateContent(blueprint, options = {}) {
    // Placeholder for future LLM content generation
    console.log('\n📝 Content generation (LLM) - Coming soon!');

    return {
      pages: {},
      seo: {},
      copy: {}
    };
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
      includeContent = false, // LLM not yet implemented
      imagePatterns = ['hero', 'about', 'services', 'testimonials', 'team', 'gallery']
    } = options;

    const result = {
      images: {},
      content: {},
      metadata: {
        generated: new Date().toISOString(),
        industry: blueprint.industry || 'professional',
        company: blueprint.companyName || 'Unknown'
      }
    };

    // Generate images
    if (includeImages) {
      result.images = await this.generateImages(blueprint, {
        industry: blueprint.industry,
        patterns: imagePatterns
      });
    }

    // Generate content (future)
    if (includeContent) {
      result.content = await this.generateContent(blueprint, options);
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
