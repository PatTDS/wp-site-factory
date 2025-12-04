/**
 * WPF Orchestrator Module
 *
 * Provides LLM-powered research and content generation
 * for the Discovery Phase of website creation.
 */

export { default as claude } from './lib/claude.js';
export { default as research } from './lib/research.js';
export { default as blueprint } from './lib/blueprint.js';

export const VERSION = '0.1.0';
