/**
 * Claude API Client Wrapper
 * Provides web search capabilities for research
 */

import Anthropic from '@anthropic-ai/sdk';
import { config } from 'dotenv';

// Load environment variables
config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';

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
  } = options;

  const messages = [
    {
      role: 'user',
      content: query,
    },
  ];

  try {
    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemPrompt || getDefaultSystemPrompt(),
      messages,
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
 * Execute a web search query using Claude's web search capability
 * Note: This uses the standard API - for actual web search,
 * you may need to use tools or a search API
 * @param {string} query - The search query
 * @param {object} options - Additional options
 * @returns {Promise<object>} - Search results
 */
export async function webSearch(query, options = {}) {
  const {
    model = DEFAULT_MODEL,
    maxTokens = 4096,
    context = '',
  } = options;

  // For now, we use Claude's knowledge and ask it to provide information
  // In production, you might integrate with a web search API
  const searchPrompt = `
You are a research assistant with access to current web information.
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

  return research(searchPrompt, { model, maxTokens });
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
};
