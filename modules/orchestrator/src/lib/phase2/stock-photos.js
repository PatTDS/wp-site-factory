/**
 * Stock Photos Module
 * Fetches industry-specific stock photos from Unsplash and Pexels APIs
 * Implements hierarchical search cascade and caching
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../.env') });

// API Configuration
const UNSPLASH_API_URL = 'https://api.unsplash.com';
const PEXELS_API_URL = 'https://api.pexels.com/v1';

// Cache configuration
// Cache photos in industry-specific template directories: templates/{industry}/media/{section}/
const TEMPLATES_DIR = path.join(__dirname, '../../../templates');
const CACHE_MAX_AGE_HOURS = parseInt(process.env.CACHE_MAX_AGE_HOURS) || 24 * 7; // 1 week default

/**
 * Get cache directory for an industry
 * @param {string} industry - Industry category
 * @returns {string} - Cache directory path
 */
function getCacheDir(industry) {
  return path.join(TEMPLATES_DIR, industry, 'media');
}

/**
 * Search for images using hierarchical fallback
 * @param {Array<string>} keywords - Primary search keywords
 * @param {string} industry - Industry category for fallback
 * @param {object} options - Search options
 * @returns {Promise<object>} - Image data with URLs
 */
export async function findImage(keywords, industry, options = {}) {
  const {
    orientation = 'landscape',
    minResults = 3,
    preferredSource = 'unsplash',
    fallbackKeywords = null,
  } = options;

  // Build hierarchical search cascade
  const searchQueries = [
    keywords.join(' '),                              // 1. Specific: all keywords
    `${keywords[0]} ${industry}`,                    // 2. Primary keyword + industry
    industry,                                        // 3. Industry only
    fallbackKeywords?.join(' ') || 'professional business', // 4. Generic fallback
  ];

  console.log(`  Searching for image: "${keywords.join(', ')}" (${industry})`);

  for (const query of searchQueries) {
    console.log(`    Trying: "${query}"...`);

    // Try Unsplash first (if preferred)
    if (preferredSource === 'unsplash') {
      const unsplashResult = await searchUnsplash(query, { orientation, count: 5 });
      if (unsplashResult.success && unsplashResult.photos.length >= minResults) {
        const selected = selectBestMatch(unsplashResult.photos, keywords);
        console.log(`    ✓ Found on Unsplash`);
        return {
          success: true,
          source: 'unsplash',
          query: query,
          photo: selected,
        };
      }

      // Try Pexels as fallback
      const pexelsResult = await searchPexels(query, { orientation, count: 5 });
      if (pexelsResult.success && pexelsResult.photos.length >= minResults) {
        const selected = selectBestMatch(pexelsResult.photos, keywords);
        console.log(`    ✓ Found on Pexels`);
        return {
          success: true,
          source: 'pexels',
          query: query,
          photo: selected,
        };
      }
    } else {
      // Try Pexels first
      const pexelsResult = await searchPexels(query, { orientation, count: 5 });
      if (pexelsResult.success && pexelsResult.photos.length >= minResults) {
        const selected = selectBestMatch(pexelsResult.photos, keywords);
        console.log(`    ✓ Found on Pexels`);
        return {
          success: true,
          source: 'pexels',
          query: query,
          photo: selected,
        };
      }

      const unsplashResult = await searchUnsplash(query, { orientation, count: 5 });
      if (unsplashResult.success && unsplashResult.photos.length >= minResults) {
        const selected = selectBestMatch(unsplashResult.photos, keywords);
        console.log(`    ✓ Found on Unsplash`);
        return {
          success: true,
          source: 'unsplash',
          query: query,
          photo: selected,
        };
      }
    }
  }

  // Return local fallback
  console.log(`    ✗ No results, using local fallback`);
  return getLocalFallback(industry);
}

/**
 * Search Unsplash API
 * @param {string} query - Search query
 * @param {object} options - Search options
 * @returns {Promise<object>} - Search results
 */
export async function searchUnsplash(query, options = {}) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.warn('    Unsplash API key not configured');
    return { success: false, error: 'API key not configured', photos: [] };
  }

  const { orientation = 'landscape', count = 10 } = options;

  try {
    const params = new URLSearchParams({
      query,
      orientation,
      per_page: count.toString(),
    });

    const response = await fetch(`${UNSPLASH_API_URL}/search/photos?${params}`, {
      headers: {
        'Authorization': `Client-ID ${accessKey}`,
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        console.warn('    Unsplash rate limit reached');
      }
      return { success: false, error: `API error: ${response.status}`, photos: [] };
    }

    const data = await response.json();

    const photos = data.results.map(photo => ({
      id: photo.id,
      url: {
        small: `${photo.urls.raw}&w=400&q=80`,
        medium: `${photo.urls.raw}&w=800&q=80`,
        large: `${photo.urls.raw}&w=1200&q=80`,
        full: `${photo.urls.raw}&w=1920&q=80`,
      },
      alt: photo.alt_description || photo.description || query,
      photographer: photo.user.name,
      photographer_url: photo.user.links.html,
      source: 'unsplash',
      source_url: photo.links.html,
      color: photo.color,
      width: photo.width,
      height: photo.height,
    }));

    return { success: true, photos };
  } catch (error) {
    console.warn(`    Unsplash error: ${error.message}`);
    return { success: false, error: error.message, photos: [] };
  }
}

/**
 * Search Pexels API
 * @param {string} query - Search query
 * @param {object} options - Search options
 * @returns {Promise<object>} - Search results
 */
export async function searchPexels(query, options = {}) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.warn('    Pexels API key not configured');
    return { success: false, error: 'API key not configured', photos: [] };
  }

  const { orientation = 'landscape', count = 10 } = options;

  try {
    const params = new URLSearchParams({
      query,
      orientation,
      per_page: count.toString(),
    });

    const response = await fetch(`${PEXELS_API_URL}/search?${params}`, {
      headers: {
        'Authorization': apiKey,
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('    Pexels rate limit reached');
      }
      return { success: false, error: `API error: ${response.status}`, photos: [] };
    }

    const data = await response.json();

    const photos = data.photos.map(photo => ({
      id: photo.id.toString(),
      url: {
        small: photo.src.small,
        medium: photo.src.medium,
        large: photo.src.large,
        full: photo.src.original,
      },
      alt: photo.alt || query,
      photographer: photo.photographer,
      photographer_url: photo.photographer_url,
      source: 'pexels',
      source_url: photo.url,
      color: photo.avg_color,
      width: photo.width,
      height: photo.height,
    }));

    return { success: true, photos };
  } catch (error) {
    console.warn(`    Pexels error: ${error.message}`);
    return { success: false, error: error.message, photos: [] };
  }
}

/**
 * Search Pexels for videos
 * @param {string} query - Search query
 * @param {object} options - Search options
 * @returns {Promise<object>} - Video results
 */
export async function searchPexelsVideos(query, options = {}) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'API key not configured', videos: [] };
  }

  const { orientation = 'landscape', count = 5 } = options;

  try {
    const params = new URLSearchParams({
      query,
      orientation,
      per_page: count.toString(),
    });

    const response = await fetch(`https://api.pexels.com/videos/search?${params}`, {
      headers: {
        'Authorization': apiKey,
      },
    });

    if (!response.ok) {
      return { success: false, error: `API error: ${response.status}`, videos: [] };
    }

    const data = await response.json();

    const videos = data.videos.map(video => {
      // Get HD and SD versions
      const hdFile = video.video_files.find(f => f.quality === 'hd' && f.width >= 1280);
      const sdFile = video.video_files.find(f => f.quality === 'sd');

      return {
        id: video.id.toString(),
        url: {
          hd: hdFile?.link || video.video_files[0]?.link,
          sd: sdFile?.link || video.video_files[0]?.link,
        },
        poster: video.image,
        duration: video.duration,
        width: video.width,
        height: video.height,
        source: 'pexels',
        source_url: video.url,
      };
    });

    return { success: true, videos };
  } catch (error) {
    return { success: false, error: error.message, videos: [] };
  }
}

/**
 * Select best matching photo from results
 * @param {Array} photos - Photo results
 * @param {Array<string>} keywords - Original keywords
 * @returns {object} - Best matching photo
 */
function selectBestMatch(photos, keywords) {
  if (photos.length === 0) return null;
  if (photos.length === 1) return photos[0];

  // Score photos based on keyword match in alt text
  const scored = photos.map(photo => {
    let score = 0;
    const alt = (photo.alt || '').toLowerCase();

    keywords.forEach(keyword => {
      if (alt.includes(keyword.toLowerCase())) {
        score += 2;
      }
    });

    // Prefer landscape orientation
    if (photo.width > photo.height) {
      score += 1;
    }

    // Prefer larger images
    if (photo.width >= 1920) {
      score += 1;
    }

    return { photo, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored[0].photo;
}

/**
 * Get local fallback image for industry
 * @param {string} industry - Industry category
 * @returns {object} - Fallback image data
 */
function getLocalFallback(industry) {
  // Industry-specific placeholder colors
  const industryColors = {
    construction: '#f97316', // orange
    roofing: '#78716c', // stone
    plumbing: '#0ea5e9', // sky
    electrical: '#eab308', // yellow
    hvac: '#06b6d4', // cyan
    landscaping: '#22c55e', // green
    automotive: '#ef4444', // red
    healthcare: '#06b6d4', // cyan
    hospitality: '#a855f7', // purple
    retail: '#ec4899', // pink
    'professional-services': '#3b82f6', // blue
    technology: '#8b5cf6', // violet
    'food-beverage': '#f97316', // orange
    fitness: '#ef4444', // red
    beauty: '#ec4899', // pink
    'real-estate': '#10b981', // emerald
  };

  const color = industryColors[industry] || '#6b7280';

  return {
    success: true,
    source: 'placeholder',
    photo: {
      id: `placeholder-${industry}`,
      url: {
        small: `https://placehold.co/400x300/${color.slice(1)}/ffffff?text=${encodeURIComponent(industry)}`,
        medium: `https://placehold.co/800x600/${color.slice(1)}/ffffff?text=${encodeURIComponent(industry)}`,
        large: `https://placehold.co/1200x800/${color.slice(1)}/ffffff?text=${encodeURIComponent(industry)}`,
        full: `https://placehold.co/1920x1080/${color.slice(1)}/ffffff?text=${encodeURIComponent(industry)}`,
      },
      alt: `${industry} placeholder image`,
      photographer: 'Placeholder',
      photographer_url: null,
      source: 'placeholder',
      is_placeholder: true,
    },
  };
}

/**
 * Generate responsive srcset for an image
 * @param {object} photo - Photo object with URLs
 * @returns {string} - HTML srcset attribute value
 */
export function generateSrcset(photo) {
  if (!photo || !photo.url) return '';

  const sizes = [
    { width: 400, url: photo.url.small },
    { width: 800, url: photo.url.medium },
    { width: 1200, url: photo.url.large },
    { width: 1920, url: photo.url.full },
  ].filter(s => s.url);

  return sizes.map(s => `${s.url} ${s.width}w`).join(',\n    ');
}

/**
 * Generate responsive image HTML
 * @param {object} photo - Photo object
 * @param {object} options - HTML options
 * @returns {string} - HTML img tag
 */
export function generateResponsiveImageHtml(photo, options = {}) {
  const {
    sizes = '100vw',
    className = '',
    loading = 'lazy',
    fetchpriority = null,
    isPlaceholder = false,
  } = options;

  if (!photo) return '';

  const srcset = generateSrcset(photo);
  const attrs = [
    `src="${photo.url.medium || photo.url.large}"`,
    srcset ? `srcset="${srcset}"` : '',
    `sizes="${sizes}"`,
    `alt="${escapeHtml(photo.alt)}"`,
    className ? `class="${className}${isPlaceholder ? ' placeholder-image' : ''}"` : (isPlaceholder ? 'class="placeholder-image"' : ''),
    `loading="${loading}"`,
    fetchpriority ? `fetchpriority="${fetchpriority}"` : '',
    isPlaceholder ? 'data-placeholder="true"' : '',
    photo.width ? `width="${photo.width}"` : '',
    photo.height ? `height="${photo.height}"` : '',
  ].filter(Boolean);

  return `<img ${attrs.join(' ')} />`;
}

/**
 * Generate attribution HTML for a photo
 * @param {object} photo - Photo object
 * @returns {string} - Attribution HTML
 */
export function generateAttribution(photo) {
  if (!photo || photo.source === 'placeholder') return '';

  const sourceName = photo.source === 'unsplash' ? 'Unsplash' : 'Pexels';

  return `<span class="photo-attribution">
    Photo by <a href="${photo.photographer_url}" target="_blank" rel="noopener">${escapeHtml(photo.photographer)}</a>
    on <a href="${photo.source_url}" target="_blank" rel="noopener">${sourceName}</a>
  </span>`;
}

/**
 * Cache photo metadata to industry library
 * @param {string} industry - Industry category
 * @param {string} section - Section type (hero, services, etc.)
 * @param {object} photo - Photo data
 * @returns {Promise<void>}
 */
export async function cachePhoto(industry, section, photo) {
  if (!photo || photo.source === 'placeholder') return;

  const cacheDir = path.join(getCacheDir(industry), section);
  await fs.mkdir(cacheDir, { recursive: true });

  const filename = `${photo.id}.json`;
  const filepath = path.join(cacheDir, filename);

  const cacheData = {
    ...photo,
    cached_at: new Date().toISOString(),
    industry,
    section,
  };

  await fs.writeFile(filepath, JSON.stringify(cacheData, null, 2), 'utf-8');
}

/**
 * Get cached photos for industry/section
 * @param {string} industry - Industry category
 * @param {string} section - Section type
 * @param {number} maxAge - Maximum age in hours
 * @returns {Promise<Array>} - Cached photos
 */
export async function getCachedPhotos(industry, section, maxAge = CACHE_MAX_AGE_HOURS) {
  const cacheDir = path.join(getCacheDir(industry), section);

  try {
    const files = await fs.readdir(cacheDir);
    const photos = [];

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const filepath = path.join(cacheDir, file);
      const content = await fs.readFile(filepath, 'utf-8');
      const photo = JSON.parse(content);

      // Check if cache is still valid
      const cachedAt = new Date(photo.cached_at);
      const ageHours = (Date.now() - cachedAt.getTime()) / (1000 * 60 * 60);

      if (ageHours <= maxAge) {
        photos.push(photo);
      }
    }

    return photos;
  } catch (error) {
    return [];
  }
}

/**
 * Find image with caching support
 * @param {Array<string>} keywords - Search keywords
 * @param {string} industry - Industry category
 * @param {string} section - Section type
 * @param {object} options - Options
 * @returns {Promise<object>} - Image result
 */
export async function findImageWithCache(keywords, industry, section, options = {}) {
  const { useCache = true, saveToCache = true } = options;

  // Check cache first
  if (useCache) {
    const cached = await getCachedPhotos(industry, section);
    if (cached.length > 0) {
      console.log(`  Using cached image for ${section}/${industry}`);
      // Select randomly from cache for variety
      const selected = cached[Math.floor(Math.random() * cached.length)];
      return {
        success: true,
        source: 'cache',
        photo: selected,
      };
    }
  }

  // Fetch from API
  const result = await findImage(keywords, industry, options);

  // Cache the result
  if (saveToCache && result.success && result.photo) {
    await cachePhoto(industry, section, result.photo);
  }

  return result;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default {
  findImage,
  findImageWithCache,
  searchUnsplash,
  searchPexels,
  searchPexelsVideos,
  generateSrcset,
  generateResponsiveImageHtml,
  generateAttribution,
  cachePhoto,
  getCachedPhotos,
};
