/**
 * Web Search Providers
 * Pluggable architecture for web search capabilities
 *
 * To add a new provider:
 * 1. Create a class that implements search(query, options)
 * 2. Register it with registerProvider(name, provider)
 * 3. Set the active provider with setActiveProvider(name)
 */

// Provider registry
const providers = {};
let activeProvider = 'claude-knowledge';

/**
 * Base search result format
 * @typedef {Object} SearchResult
 * @property {string} title - Result title
 * @property {string} url - Source URL
 * @property {string} snippet - Text excerpt
 * @property {string} [content] - Full content if available
 */

/**
 * Claude Knowledge Provider (Default)
 * Uses Claude's training knowledge - no external API needed
 */
class ClaudeKnowledgeProvider {
  constructor() {
    this.name = 'claude-knowledge';
    this.description = 'Uses Claude\'s built-in knowledge (no external API)';
  }

  async search(query, options = {}) {
    // This provider doesn't actually search - it returns instructions
    // for Claude to use its own knowledge
    return {
      provider: this.name,
      query,
      results: [],
      synthesisPrompt: `Based on your knowledge, research the following topic and provide comprehensive information:

${query}

Provide practical, actionable information including:
1. Key principles and best practices
2. Common patterns used by successful examples
3. What to avoid (common mistakes)
4. Specific recommendations that can be directly applied`,
    };
  }
}

/**
 * Brave Search Provider
 * Requires BRAVE_API_KEY environment variable
 * Sign up at: https://brave.com/search/api/
 */
class BraveSearchProvider {
  constructor() {
    this.name = 'brave';
    this.description = 'Brave Search API';
    this.apiKey = process.env.BRAVE_API_KEY;
    this.baseUrl = 'https://api.search.brave.com/res/v1/web/search';
  }

  isConfigured() {
    return !!this.apiKey;
  }

  async search(query, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('BRAVE_API_KEY not configured. Get one at https://brave.com/search/api/');
    }

    const { count = 10 } = options;
    const url = new URL(this.baseUrl);
    url.searchParams.append('q', query);
    url.searchParams.append('count', count);

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Brave Search API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const results = (data.web?.results || []).map(r => ({
      title: r.title,
      url: r.url,
      snippet: r.description,
    }));

    return {
      provider: this.name,
      query,
      results,
      synthesisPrompt: `I searched for: "${query}"

Here are the search results:

${results.map((r, i) => `${i + 1}. **${r.title}**
   URL: ${r.url}
   ${r.snippet}`).join('\n\n')}

Please synthesize this information and provide comprehensive insights on the topic.`,
    };
  }
}

/**
 * Serper.dev Provider
 * Requires SERPER_API_KEY environment variable
 * Sign up at: https://serper.dev/
 */
class SerperProvider {
  constructor() {
    this.name = 'serper';
    this.description = 'Serper.dev Google Search API';
    this.apiKey = process.env.SERPER_API_KEY;
    this.baseUrl = 'https://google.serper.dev/search';
  }

  isConfigured() {
    return !!this.apiKey;
  }

  async search(query, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('SERPER_API_KEY not configured. Get one at https://serper.dev/');
    }

    const { count = 10 } = options;

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.apiKey,
      },
      body: JSON.stringify({
        q: query,
        num: count,
      }),
    });

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const results = (data.organic || []).map(r => ({
      title: r.title,
      url: r.link,
      snippet: r.snippet,
    }));

    return {
      provider: this.name,
      query,
      results,
      synthesisPrompt: `I searched Google for: "${query}"

Here are the search results:

${results.map((r, i) => `${i + 1}. **${r.title}**
   URL: ${r.url}
   ${r.snippet}`).join('\n\n')}

Please synthesize this information and provide comprehensive insights on the topic.`,
    };
  }
}

/**
 * Bing Search Provider
 * Requires BING_API_KEY environment variable
 * Sign up at: https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/
 */
class BingSearchProvider {
  constructor() {
    this.name = 'bing';
    this.description = 'Microsoft Bing Search API';
    this.apiKey = process.env.BING_API_KEY;
    this.baseUrl = 'https://api.bing.microsoft.com/v7.0/search';
  }

  isConfigured() {
    return !!this.apiKey;
  }

  async search(query, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('BING_API_KEY not configured');
    }

    const { count = 10 } = options;
    const url = new URL(this.baseUrl);
    url.searchParams.append('q', query);
    url.searchParams.append('count', count);

    const response = await fetch(url.toString(), {
      headers: {
        'Ocp-Apim-Subscription-Key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Bing Search API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const results = (data.webPages?.value || []).map(r => ({
      title: r.name,
      url: r.url,
      snippet: r.snippet,
    }));

    return {
      provider: this.name,
      query,
      results,
      synthesisPrompt: `I searched Bing for: "${query}"

Here are the search results:

${results.map((r, i) => `${i + 1}. **${r.title}**
   URL: ${r.url}
   ${r.snippet}`).join('\n\n')}

Please synthesize this information and provide comprehensive insights on the topic.`,
    };
  }
}

// Register default providers
providers['claude-knowledge'] = new ClaudeKnowledgeProvider();
providers['brave'] = new BraveSearchProvider();
providers['serper'] = new SerperProvider();
providers['bing'] = new BingSearchProvider();

/**
 * Register a custom search provider
 * @param {string} name - Provider name
 * @param {object} provider - Provider instance with search method
 */
export function registerProvider(name, provider) {
  if (!provider.search || typeof provider.search !== 'function') {
    throw new Error('Provider must have a search(query, options) method');
  }
  providers[name] = provider;
}

/**
 * Set the active search provider
 * @param {string} name - Provider name
 */
export function setActiveProvider(name) {
  if (!providers[name]) {
    throw new Error(`Unknown search provider: ${name}. Available: ${Object.keys(providers).join(', ')}`);
  }
  activeProvider = name;
}

/**
 * Get the active search provider
 * @returns {object} Active provider
 */
export function getActiveProvider() {
  return providers[activeProvider];
}

/**
 * List all available providers
 * @returns {Array} Provider info
 */
export function listProviders() {
  return Object.entries(providers).map(([name, provider]) => ({
    name,
    description: provider.description,
    configured: provider.isConfigured ? provider.isConfigured() : true,
    active: name === activeProvider,
  }));
}

/**
 * Search using the active provider
 * @param {string} query - Search query
 * @param {object} options - Search options
 * @returns {Promise<object>} Search results
 */
export async function search(query, options = {}) {
  const provider = getActiveProvider();
  return provider.search(query, options);
}

/**
 * Auto-detect and use the best available provider
 * Priority: serper > brave > bing > claude-knowledge
 */
export function autoSelectProvider() {
  const priority = ['serper', 'brave', 'bing', 'claude-knowledge'];

  for (const name of priority) {
    const provider = providers[name];
    if (provider.isConfigured ? provider.isConfigured() : true) {
      setActiveProvider(name);
      return name;
    }
  }

  return activeProvider;
}

export default {
  search,
  registerProvider,
  setActiveProvider,
  getActiveProvider,
  listProviders,
  autoSelectProvider,
};
