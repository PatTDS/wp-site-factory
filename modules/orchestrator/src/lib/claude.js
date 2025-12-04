/**
 * Claude API Client Wrapper
 * Provides web search capabilities for research
 * Includes automatic token tracking
 */

import Anthropic from '@anthropic-ai/sdk';
import { config } from 'dotenv';
import { getTracker, TokenTracker } from './token-tracker.js';
import searchProviders from './search-providers.js';

// Load environment variables
config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  retryableStatusCodes: [429, 500, 502, 503, 504],
};

// Global tracker instance
let tracker = null;

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute with retry and exponential backoff
 * @param {Function} fn - Async function to execute
 * @param {object} options - Retry options
 * @returns {Promise} - Result of function
 */
async function withRetry(fn, options = {}) {
  const config = { ...RETRY_CONFIG, ...options };
  let lastError;
  let delay = config.initialDelayMs;

  for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if error is retryable
      const statusCode = error.status || error.statusCode;
      const isRetryable = config.retryableStatusCodes.includes(statusCode) ||
        error.code === 'ECONNRESET' ||
        error.code === 'ETIMEDOUT' ||
        error.message?.includes('rate limit');

      if (!isRetryable || attempt > config.maxRetries) {
        throw error;
      }

      // Log retry attempt
      console.log(`  API call failed (${error.message}), retrying in ${delay}ms (attempt ${attempt}/${config.maxRetries})...`);

      // Wait with exponential backoff
      await sleep(delay);
      delay = Math.min(delay * config.backoffMultiplier, config.maxDelayMs);
    }
  }

  throw lastError;
}

/**
 * Initialize token tracker for a project
 * @param {string} projectName - Project name for tracking
 */
export function initTracker(projectName) {
  tracker = getTracker(projectName);
  return tracker;
}

/**
 * Get current tracker instance
 * @returns {TokenTracker} Current tracker
 */
export function getCurrentTracker() {
  if (!tracker) {
    tracker = getTracker('default');
  }
  return tracker;
}

/**
 * Execute a research query using Claude with web search
 * @param {string} query - The research query
 * @param {object} options - Additional options
 * @returns {Promise<object>} - Research results
 */
export async function research(query, options = {}) {
  const {
    model = DEFAULT_MODEL,
    maxTokens = 4096,
    systemPrompt = null,
    operation = 'research', // Operation name for tracking
  } = options;

  const messages = [
    {
      role: 'user',
      content: query,
    },
  ];

  try {
    // Use retry wrapper for API calls
    const response = await withRetry(async () => {
      return await client.messages.create({
        model,
        max_tokens: maxTokens,
        system: systemPrompt || getDefaultSystemPrompt(),
        messages,
      });
    });

    // Automatic token tracking
    const currentTracker = getCurrentTracker();
    currentTracker.track({
      operation,
      model: response.model,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      metadata: {
        maxTokens,
        queryLength: query.length,
      }
    });

    return {
      success: true,
      content: response.content[0].text,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
      model: response.model,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Execute a web search query using configured search provider
 * Uses search providers (Brave, Serper, Bing, or Claude's knowledge)
 * and synthesizes results with Claude
 * @param {string} query - The search query
 * @param {object} options - Additional options
 * @returns {Promise<object>} - Search results
 */
export async function webSearch(query, options = {}) {
  const {
    model = DEFAULT_MODEL,
    maxTokens = 4096,
    context = '',
    searchProvider = null, // Use specific provider or auto-select
  } = options;

  // Auto-select best available provider if not specified
  if (searchProvider) {
    searchProviders.setActiveProvider(searchProvider);
  } else {
    searchProviders.autoSelectProvider();
  }

  try {
    // Get search results from provider
    const searchResults = await searchProviders.search(query);

    // Build prompt with search results
    const searchPrompt = `
${searchResults.synthesisPrompt}

${context ? `Additional Context: ${context}` : ''}

Provide your response in a structured format with:
1. Key findings (bullet points)
2. Sources (reference the URLs provided if applicable)
3. Confidence level (high/medium/low)
4. Any caveats or limitations

Be specific and factual. If you're uncertain about something, say so.
`;

    const result = await research(searchPrompt, { model, maxTokens, operation: 'web_search' });

    // Include provider info in result
    return {
      ...result,
      searchProvider: searchResults.provider,
      searchResultCount: searchResults.results.length,
    };
  } catch (error) {
    // If search fails, fall back to Claude's knowledge
    console.warn(`Search provider failed: ${error.message}. Falling back to Claude's knowledge.`);

    const fallbackPrompt = `
You are a research assistant with access to comprehensive knowledge.
Research the following query and provide comprehensive, factual information.

Query: ${query}

${context ? `Context: ${context}` : ''}

Provide your response in a structured format with:
1. Key findings (bullet points)
2. Sources (if you can identify authoritative sources)
3. Confidence level (high/medium/low)
4. Any caveats or limitations

Be specific and factual. If you're uncertain about something, say so.
`;

    return research(fallbackPrompt, { model, maxTokens, operation: 'web_search' });
  }
}

/**
 * List available search providers
 * @returns {Array} Provider info
 */
export function listSearchProviders() {
  return searchProviders.listProviders();
}

/**
 * Set search provider
 * @param {string} name - Provider name
 */
export function setSearchProvider(name) {
  searchProviders.setActiveProvider(name);
}

/**
 * Generate content based on research and guidelines
 * @param {object} params - Generation parameters
 * @returns {Promise<object>} - Generated content
 */
export async function generateContent(params) {
  const {
    sectionType,
    industry,
    clientData,
    bestPractices,
    competitorInsights,
    model = DEFAULT_MODEL,
    maxTokens = 4096,
  } = params;

  const prompt = buildContentGenerationPrompt({
    sectionType,
    industry,
    clientData,
    bestPractices,
    competitorInsights,
  });

  return research(prompt, {
    model,
    maxTokens,
    systemPrompt: getContentGenerationSystemPrompt(),
    operation: `generate_${sectionType}`,
  });
}

/**
 * Build content generation prompt
 */
function buildContentGenerationPrompt(params) {
  const { sectionType, industry, clientData, bestPractices, competitorInsights } = params;

  return `
Generate ${sectionType} section content for a ${industry} business website.

## Client Information
${JSON.stringify(clientData, null, 2)}

## Best Practices to Follow
${bestPractices || 'Use general best practices for this section type.'}

## Competitor Insights
${competitorInsights || 'No specific competitor insights available.'}

## Requirements
1. Write actual content, not placeholders
2. Use the client's brand voice and tone
3. Include specific details from client data
4. Apply best practices from research
5. Make it compelling and conversion-focused

## Output Format
Provide the content in a structured JSON format:
{
  "section": "${sectionType}",
  "content": {
    // Section-specific fields
  },
  "notes": "Any notes about the content or suggestions"
}
`;
}

/**
 * Get default system prompt for research
 */
function getDefaultSystemPrompt() {
  return `You are a professional web research assistant for WPF (WordPress Site Factory).
Your role is to research best practices and competitor information for website development.

Guidelines:
- Be factual and specific
- Cite sources when possible
- Provide actionable insights
- Focus on what works in real-world websites
- Consider the target industry context

Output should be structured and easy to parse.`;
}

/**
 * Get system prompt for content generation
 */
function getContentGenerationSystemPrompt() {
  return `You are a professional copywriter for WPF (WordPress Site Factory).
Your role is to generate compelling website content based on research and client data.

Guidelines:
- Write in the client's brand voice
- Be specific, not generic
- Focus on benefits, not features
- Include calls-to-action where appropriate
- Avoid jargon unless industry-specific
- Make content scannable (short paragraphs, bullet points)

Output should be in valid JSON format.`;
}

export default {
  research,
  webSearch,
  generateContent,
  initTracker,
  getCurrentTracker,
  listSearchProviders,
  setSearchProvider,
};
