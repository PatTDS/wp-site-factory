#!/usr/bin/env node

/**
 * Stock Photos MCP Server
 *
 * Provides access to Unsplash and Pexels APIs for stock photo search and download.
 * Implements MCP (Model Context Protocol) for Claude Code integration.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const CACHE_DIR = path.join(__dirname, '../output/stock-photos-cache');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Industry keywords mapping
const INDUSTRY_KEYWORDS = {
  construction: ['construction', 'building', 'contractor', 'renovation', 'architecture', 'workers', 'crane', 'blueprint'],
  healthcare: ['healthcare', 'medical', 'hospital', 'doctor', 'nurse', 'clinic', 'patient', 'care'],
  restaurant: ['restaurant', 'food', 'dining', 'chef', 'kitchen', 'culinary', 'plate', 'meal'],
  professional: ['office', 'business', 'professional', 'meeting', 'team', 'corporate', 'workplace'],
  technology: ['technology', 'computer', 'coding', 'software', 'data', 'digital', 'innovation'],
  retail: ['store', 'shopping', 'retail', 'customer', 'products', 'display', 'checkout'],
  creative: ['creative', 'design', 'art', 'studio', 'workspace', 'inspiration', 'collaboration']
};

/**
 * Unsplash API Client
 */
class UnsplashClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.unsplash.com';
  }

  async search(query, count = 10, orientation = null) {
    if (!this.apiKey) {
      throw new Error('UNSPLASH_API_KEY not configured');
    }

    const params = new URLSearchParams({
      query,
      per_page: count,
      client_id: this.apiKey
    });

    if (orientation) {
      params.append('orientation', orientation);
    }

    const response = await fetch(`${this.baseUrl}/search/photos?${params}`);

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.results.map(photo => ({
      id: photo.id,
      source: 'unsplash',
      urls: {
        raw: photo.urls.raw,
        full: photo.urls.full,
        regular: photo.urls.regular,
        small: photo.urls.small,
        thumb: photo.urls.thumb
      },
      width: photo.width,
      height: photo.height,
      description: photo.description || photo.alt_description,
      photographer: {
        name: photo.user.name,
        username: photo.user.username,
        profile_url: photo.user.links.html
      },
      download_url: photo.links.download_location,
      attribution: `Photo by ${photo.user.name} on Unsplash`
    }));
  }

  async triggerDownload(downloadUrl) {
    // Unsplash requires triggering download endpoint for attribution
    if (!this.apiKey) return;

    try {
      await fetch(`${downloadUrl}?client_id=${this.apiKey}`);
    } catch (error) {
      console.error('Failed to trigger Unsplash download:', error);
    }
  }
}

/**
 * Pexels API Client
 */
class PexelsClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.pexels.com/v1';
  }

  async search(query, count = 10, orientation = null) {
    if (!this.apiKey) {
      throw new Error('PEXELS_API_KEY not configured');
    }

    const params = new URLSearchParams({
      query,
      per_page: count
    });

    if (orientation) {
      params.append('orientation', orientation);
    }

    const response = await fetch(`${this.baseUrl}/search?${params}`, {
      headers: {
        'Authorization': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.photos.map(photo => ({
      id: photo.id.toString(),
      source: 'pexels',
      urls: {
        original: photo.src.original,
        large2x: photo.src.large2x,
        large: photo.src.large,
        medium: photo.src.medium,
        small: photo.src.small,
        tiny: photo.src.tiny
      },
      width: photo.width,
      height: photo.height,
      description: photo.alt,
      photographer: {
        name: photo.photographer,
        url: photo.photographer_url
      },
      attribution: `Photo by ${photo.photographer} on Pexels`
    }));
  }
}

/**
 * Stock Photo Service
 */
class StockPhotoService {
  constructor() {
    this.unsplash = new UnsplashClient(UNSPLASH_API_KEY);
    this.pexels = new PexelsClient(PEXELS_API_KEY);
  }

  /**
   * Get industry-specific keywords
   */
  getIndustryKeywords(industry) {
    return INDUSTRY_KEYWORDS[industry] || [industry];
  }

  /**
   * Search photos by industry
   */
  async searchByIndustry(industry, count = 10, orientation = null) {
    const keywords = this.getIndustryKeywords(industry);
    const query = keywords.slice(0, 3).join(' '); // Use first 3 keywords

    return await this.search(query, count, orientation);
  }

  /**
   * Search photos by keyword
   */
  async search(query, count = 10, orientation = null) {
    const results = [];

    // Search both APIs in parallel
    try {
      const [unsplashResults, pexelsResults] = await Promise.allSettled([
        this.unsplash.search(query, Math.ceil(count / 2), orientation).catch(() => []),
        this.pexels.search(query, Math.ceil(count / 2), orientation).catch(() => [])
      ]);

      if (unsplashResults.status === 'fulfilled') {
        results.push(...unsplashResults.value);
      }

      if (pexelsResults.status === 'fulfilled') {
        results.push(...pexelsResults.value);
      }
    } catch (error) {
      console.error('Error searching photos:', error);
    }

    // Shuffle and limit results
    return this.shuffleArray(results).slice(0, count);
  }

  /**
   * Download photo to cache
   */
  async downloadPhoto(photo, size = 'regular') {
    const sizeUrl = this.getPhotoUrl(photo, size);
    const ext = '.jpg';
    const filename = `${photo.source}-${photo.id}-${size}${ext}`;
    const filepath = path.join(CACHE_DIR, filename);

    // Return cached file if exists
    if (fs.existsSync(filepath)) {
      return {
        path: filepath,
        url: sizeUrl,
        attribution: photo.attribution,
        cached: true
      };
    }

    // Download photo
    try {
      const response = await fetch(sizeUrl);

      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      fs.writeFileSync(filepath, Buffer.from(buffer));

      // Trigger download for Unsplash attribution
      if (photo.source === 'unsplash' && photo.download_url) {
        await this.unsplash.triggerDownload(photo.download_url);
      }

      return {
        path: filepath,
        url: sizeUrl,
        attribution: photo.attribution,
        cached: false
      };
    } catch (error) {
      throw new Error(`Failed to download photo: ${error.message}`);
    }
  }

  /**
   * Get photo URL for specific size
   */
  getPhotoUrl(photo, size) {
    if (photo.source === 'unsplash') {
      const sizeMap = {
        thumb: 'thumb',
        small: 'small',
        regular: 'regular',
        large: 'full'
      };
      return photo.urls[sizeMap[size] || 'regular'];
    } else if (photo.source === 'pexels') {
      const sizeMap = {
        thumb: 'tiny',
        small: 'small',
        regular: 'medium',
        large: 'large'
      };
      return photo.urls[sizeMap[size] || 'medium'];
    }
    return photo.urls.regular || photo.urls.medium;
  }

  /**
   * Get photo attribution HTML
   */
  getAttributionHtml(photo) {
    if (photo.source === 'unsplash') {
      return `<a href="${photo.photographer.profile_url}" target="_blank">${photo.photographer.name}</a> on <a href="https://unsplash.com" target="_blank">Unsplash</a>`;
    } else if (photo.source === 'pexels') {
      return `<a href="${photo.photographer.url}" target="_blank">${photo.photographer.name}</a> on <a href="https://www.pexels.com" target="_blank">Pexels</a>`;
    }
    return photo.attribution;
  }

  /**
   * Shuffle array (Fisher-Yates)
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Clear cache
   */
  clearCache() {
    if (fs.existsSync(CACHE_DIR)) {
      const files = fs.readdirSync(CACHE_DIR);
      let deleted = 0;

      for (const file of files) {
        const filepath = path.join(CACHE_DIR, file);
        if (fs.statSync(filepath).isFile()) {
          fs.unlinkSync(filepath);
          deleted++;
        }
      }

      return { deleted, directory: CACHE_DIR };
    }
    return { deleted: 0, directory: CACHE_DIR };
  }
}

// Initialize service
const stockPhotoService = new StockPhotoService();

// Create MCP server
const server = new Server(
  {
    name: 'stock-photos',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_photos',
        description: 'Search stock photos from Unsplash and Pexels by keyword or industry',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query or keyword (e.g., "office", "team", "construction")',
            },
            count: {
              type: 'number',
              description: 'Number of photos to return (default: 10, max: 30)',
              default: 10,
            },
            orientation: {
              type: 'string',
              enum: ['landscape', 'portrait', 'squarish'],
              description: 'Photo orientation filter (optional)',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'search_by_industry',
        description: 'Search stock photos optimized for specific industries with pre-defined keywords',
        inputSchema: {
          type: 'object',
          properties: {
            industry: {
              type: 'string',
              enum: ['construction', 'healthcare', 'restaurant', 'professional', 'technology', 'retail', 'creative'],
              description: 'Industry type for contextual photo search',
            },
            count: {
              type: 'number',
              description: 'Number of photos to return (default: 10)',
              default: 10,
            },
            orientation: {
              type: 'string',
              enum: ['landscape', 'portrait', 'squarish'],
              description: 'Photo orientation filter (optional)',
            },
          },
          required: ['industry'],
        },
      },
      {
        name: 'download_photo',
        description: 'Download a specific photo from search results to local cache',
        inputSchema: {
          type: 'object',
          properties: {
            photo: {
              type: 'object',
              description: 'Photo object from search results',
            },
            size: {
              type: 'string',
              enum: ['thumb', 'small', 'regular', 'large'],
              description: 'Photo size to download (default: regular)',
              default: 'regular',
            },
          },
          required: ['photo'],
        },
      },
      {
        name: 'get_attribution',
        description: 'Get attribution HTML for a photo',
        inputSchema: {
          type: 'object',
          properties: {
            photo: {
              type: 'object',
              description: 'Photo object from search results',
            },
          },
          required: ['photo'],
        },
      },
      {
        name: 'clear_cache',
        description: 'Clear all cached photos',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'search_photos': {
        const { query, count = 10, orientation } = args;
        const results = await stockPhotoService.search(query, Math.min(count, 30), orientation);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                query,
                count: results.length,
                photos: results,
              }, null, 2),
            },
          ],
        };
      }

      case 'search_by_industry': {
        const { industry, count = 10, orientation } = args;
        const results = await stockPhotoService.searchByIndustry(industry, count, orientation);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                industry,
                keywords: stockPhotoService.getIndustryKeywords(industry),
                count: results.length,
                photos: results,
              }, null, 2),
            },
          ],
        };
      }

      case 'download_photo': {
        const { photo, size = 'regular' } = args;
        const result = await stockPhotoService.downloadPhoto(photo, size);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_attribution': {
        const { photo } = args;
        const html = stockPhotoService.getAttributionHtml(photo);

        return {
          content: [
            {
              type: 'text',
              text: html,
            },
          ],
        };
      }

      case 'clear_cache': {
        const result = stockPhotoService.clearCache();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: error.message,
            tool: name,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Stock Photos MCP Server running');
  console.error(`Unsplash API: ${UNSPLASH_API_KEY ? 'configured' : 'missing'}`);
  console.error(`Pexels API: ${PEXELS_API_KEY ? 'configured' : 'missing'}`);
  console.error(`Cache directory: ${CACHE_DIR}`);
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
