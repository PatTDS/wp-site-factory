/**
 * WPF Orchestrator Module
 *
 * Provides LLM-powered research and content generation
 * for the Discovery Phase of website creation.
 *
 * Features:
 * - Industry best practices research
 * - Competitor analysis
 * - Blueprint generation
 * - Token tracking and cost estimation
 * - Schema validation
 * - Operator review workflow
 * - Automatic retry with exponential backoff
 * - Cache expiry for knowledge base
 */

// Core modules
export { default as claude, initTracker, getCurrentTracker, listSearchProviders, setSearchProvider } from './lib/claude.js';
export { default as research, getResearchTracker } from './lib/research.js';
export { default as blueprint } from './lib/blueprint.js';

// Support modules
export { default as validator, validateClientIntake, isValidIntake } from './lib/validator.js';
export { default as review, createReview, autoReview } from './lib/operator-review.js';
export { TokenTracker, getTracker, trackTokens } from './lib/token-tracker.js';
export { Logger, getLogger, createLogger } from './lib/logger.js';
export { default as searchProviders } from './lib/search-providers.js';
export { createSpinner, withSpinner, withMultiSpinner, createProgress } from './lib/spinner.js';

export const VERSION = '0.1.0';
