/**
 * Token Tracker - Automatic LLM API usage tracking
 *
 * Tracks all Claude API calls with:
 * - Token counts (input/output)
 * - Cost estimation
 * - Operation metadata
 * - Persistent logging
 */

import fs from 'fs';
import path from 'path';

// Claude model pricing (per 1M tokens) - Updated December 2024
const MODEL_PRICING = {
  'claude-3-5-sonnet-20241022': {
    input: 3.00,    // $3 per 1M input tokens
    output: 15.00   // $15 per 1M output tokens
  },
  'claude-3-sonnet-20240229': {
    input: 3.00,
    output: 15.00
  },
  'claude-3-haiku-20240307': {
    input: 0.25,
    output: 1.25
  },
  'claude-3-opus-20240229': {
    input: 15.00,
    output: 75.00
  }
};

// Default model if not specified
const DEFAULT_MODEL = 'claude-3-5-sonnet-20241022';

class TokenTracker {
  constructor(projectName = 'default') {
    this.projectName = projectName;
    this.sessionId = this._generateSessionId();
    this.operations = [];
    this.sessionStart = new Date().toISOString();
  }

  /**
   * Generate unique session ID
   */
  _generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Track an API operation
   * @param {Object} params - Operation parameters
   * @param {string} params.operation - Operation name (e.g., 'research_hero_section')
   * @param {string} params.model - Model used
   * @param {number} params.inputTokens - Input token count
   * @param {number} params.outputTokens - Output token count
   * @param {Object} params.metadata - Additional metadata
   */
  track({ operation, model = DEFAULT_MODEL, inputTokens, outputTokens, metadata = {} }) {
    const costUsd = this.calculateCost(model, inputTokens, outputTokens);

    const entry = {
      timestamp: new Date().toISOString(),
      operation,
      model,
      tokens: {
        input: inputTokens,
        output: outputTokens,
        total: inputTokens + outputTokens
      },
      cost_usd: costUsd,
      metadata
    };

    this.operations.push(entry);

    return entry;
  }

  /**
   * Calculate cost for an API call
   * @param {string} model - Model name
   * @param {number} inputTokens - Input token count
   * @param {number} outputTokens - Output token count
   * @returns {number} Cost in USD
   */
  calculateCost(model, inputTokens, outputTokens) {
    const pricing = MODEL_PRICING[model] || MODEL_PRICING[DEFAULT_MODEL];

    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;

    // Round to 6 decimal places
    return Math.round((inputCost + outputCost) * 1_000_000) / 1_000_000;
  }

  /**
   * Estimate tokens from text (rough approximation)
   * Claude uses ~4 characters per token on average
   * @param {string} text - Text to estimate
   * @returns {number} Estimated token count
   */
  static estimateTokens(text) {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }

  /**
   * Get session totals
   * @returns {Object} Session statistics
   */
  getTotals() {
    const totals = this.operations.reduce((acc, op) => {
      acc.input_tokens += op.tokens.input;
      acc.output_tokens += op.tokens.output;
      acc.total_tokens += op.tokens.total;
      acc.total_cost_usd += op.cost_usd;
      acc.operation_count += 1;
      return acc;
    }, {
      input_tokens: 0,
      output_tokens: 0,
      total_tokens: 0,
      total_cost_usd: 0,
      operation_count: 0
    });

    // Round cost
    totals.total_cost_usd = Math.round(totals.total_cost_usd * 1_000_000) / 1_000_000;

    return totals;
  }

  /**
   * Get breakdown by operation type
   * @returns {Object} Cost breakdown by operation
   */
  getBreakdownByOperation() {
    const breakdown = {};

    for (const op of this.operations) {
      if (!breakdown[op.operation]) {
        breakdown[op.operation] = {
          count: 0,
          tokens: 0,
          cost_usd: 0
        };
      }
      breakdown[op.operation].count += 1;
      breakdown[op.operation].tokens += op.tokens.total;
      breakdown[op.operation].cost_usd += op.cost_usd;
    }

    // Round costs
    for (const key of Object.keys(breakdown)) {
      breakdown[key].cost_usd = Math.round(breakdown[key].cost_usd * 1_000_000) / 1_000_000;
    }

    return breakdown;
  }

  /**
   * Export tracker data to JSON
   * @returns {Object} Full tracker data
   */
  toJSON() {
    return {
      project: this.projectName,
      session_id: this.sessionId,
      session_start: this.sessionStart,
      session_end: new Date().toISOString(),
      operations: this.operations,
      session_totals: this.getTotals(),
      breakdown_by_operation: this.getBreakdownByOperation()
    };
  }

  /**
   * Save tracker to file
   * @param {string} filePath - Path to save JSON
   */
  save(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(this.toJSON(), null, 2));
    return filePath;
  }

  /**
   * Load and merge existing tracker data
   * @param {string} filePath - Path to load from
   */
  load(filePath) {
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (data.operations && Array.isArray(data.operations)) {
          // Merge operations from previous session
          this.operations = [...data.operations, ...this.operations];
        }
      } catch (error) {
        console.error('Failed to load token tracker data:', error.message);
      }
    }
  }

  /**
   * Reset current session
   */
  reset() {
    this.operations = [];
    this.sessionId = this._generateSessionId();
    this.sessionStart = new Date().toISOString();
  }

  /**
   * Print summary to console
   */
  printSummary() {
    const totals = this.getTotals();
    const breakdown = this.getBreakdownByOperation();

    console.log('\n--- Token Usage Summary ---');
    console.log(`Session: ${this.sessionId}`);
    console.log(`Project: ${this.projectName}`);
    console.log(`Operations: ${totals.operation_count}`);
    console.log(`Total Tokens: ${totals.total_tokens.toLocaleString()}`);
    console.log(`  Input:  ${totals.input_tokens.toLocaleString()}`);
    console.log(`  Output: ${totals.output_tokens.toLocaleString()}`);
    console.log(`Estimated Cost: $${totals.total_cost_usd.toFixed(4)}`);

    if (Object.keys(breakdown).length > 0) {
      console.log('\nBy Operation:');
      for (const [op, stats] of Object.entries(breakdown)) {
        console.log(`  ${op}: ${stats.tokens.toLocaleString()} tokens ($${stats.cost_usd.toFixed(4)})`);
      }
    }
    console.log('----------------------------\n');
  }
}

// Singleton instance for global tracking
let globalTracker = null;

/**
 * Get or create global tracker
 * @param {string} projectName - Project name
 * @returns {TokenTracker} Global tracker instance
 */
export function getTracker(projectName) {
  if (!globalTracker || (projectName && globalTracker.projectName !== projectName)) {
    globalTracker = new TokenTracker(projectName);
  }
  return globalTracker;
}

/**
 * Quick track function for convenience
 */
export function trackTokens(operation, model, inputTokens, outputTokens, metadata = {}) {
  const tracker = getTracker();
  return tracker.track({ operation, model, inputTokens, outputTokens, metadata });
}

export { TokenTracker, MODEL_PRICING };
export default TokenTracker;
