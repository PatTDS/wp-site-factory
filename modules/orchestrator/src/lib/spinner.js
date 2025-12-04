/**
 * Spinner Utility
 * Provides consistent progress indicators for CLI commands
 */

import ora from 'ora';

// Default spinner options
const DEFAULT_OPTIONS = {
  spinner: 'dots',
  color: 'cyan',
};

/**
 * Create a spinner with consistent styling
 * @param {string} text - Initial text
 * @param {object} options - Ora options
 * @returns {ora.Ora} Ora spinner instance
 */
export function createSpinner(text, options = {}) {
  return ora({
    text,
    ...DEFAULT_OPTIONS,
    ...options,
  });
}

/**
 * Run an async function with spinner feedback
 * @param {string} text - Spinner text
 * @param {Function} fn - Async function to run
 * @param {object} options - Options
 * @returns {Promise} Result of fn
 */
export async function withSpinner(text, fn, options = {}) {
  const {
    successText,
    failText,
    showDuration = true,
  } = options;

  const spinner = createSpinner(text);
  spinner.start();
  const startTime = Date.now();

  try {
    const result = await fn(spinner);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    const durationText = showDuration ? ` (${duration}s)` : '';
    spinner.succeed((successText || text) + durationText);
    return result;
  } catch (error) {
    spinner.fail(failText || `${text} - Error: ${error.message}`);
    throw error;
  }
}

/**
 * Run multiple tasks with progress indicators
 * @param {Array} tasks - Array of { name, fn } objects
 * @param {object} options - Options
 * @returns {Promise<Array>} Results
 */
export async function withMultiSpinner(tasks, options = {}) {
  const { parallel = false, verbose = false } = options;

  if (parallel) {
    // Run all in parallel with overall progress
    const spinner = createSpinner(`Running ${tasks.length} tasks in parallel...`);
    spinner.start();
    const startTime = Date.now();

    let completed = 0;

    const promises = tasks.map(async (task) => {
      try {
        const result = await task.fn();
        completed++;
        spinner.text = `Running tasks... (${completed}/${tasks.length} complete)`;
        if (verbose) {
          spinner.info(`✓ ${task.name}`);
          spinner.start(`Running tasks... (${completed}/${tasks.length} complete)`);
        }
        return { name: task.name, success: true, result };
      } catch (error) {
        completed++;
        spinner.text = `Running tasks... (${completed}/${tasks.length} complete)`;
        return { name: task.name, success: false, error };
      }
    });

    const results = await Promise.all(promises);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    const successCount = results.filter(r => r.success).length;

    if (successCount === tasks.length) {
      spinner.succeed(`All ${tasks.length} tasks completed (${duration}s)`);
    } else {
      spinner.warn(`${successCount}/${tasks.length} tasks completed (${duration}s)`);
    }

    return results;
  } else {
    // Run sequentially
    const results = [];

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const prefix = `[${i + 1}/${tasks.length}] `;
      const spinner = createSpinner(prefix + task.name);
      spinner.start();
      const startTime = Date.now();

      try {
        const result = await task.fn();
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        spinner.succeed(`${prefix}${task.name} (${duration}s)`);
        results.push({ name: task.name, success: true, result });
      } catch (error) {
        spinner.fail(`${prefix}${task.name} - ${error.message}`);
        results.push({ name: task.name, success: false, error });
      }
    }

    return results;
  }
}

/**
 * Create a progress bar style spinner
 * @param {string} text - Text to display
 * @param {number} total - Total items
 * @returns {object} Progress controller
 */
export function createProgress(text, total) {
  const spinner = createSpinner(`${text} [0/${total}]`);
  let current = 0;

  return {
    start() {
      spinner.start();
      return this;
    },
    increment(message = '') {
      current++;
      const percentage = Math.round((current / total) * 100);
      spinner.text = `${text} [${current}/${total}] ${percentage}%${message ? ' - ' + message : ''}`;
      return this;
    },
    succeed(message) {
      spinner.succeed(message || `${text} - Complete (${total} items)`);
      return this;
    },
    fail(message) {
      spinner.fail(message || `${text} - Failed`);
      return this;
    },
    get spinner() {
      return spinner;
    },
  };
}

// Convenience methods for common operations
export const spinners = {
  /**
   * Spinner for research operations
   */
  research(topic) {
    return createSpinner(`Researching ${topic}...`);
  },

  /**
   * Spinner for generation operations
   */
  generate(item) {
    return createSpinner(`Generating ${item}...`);
  },

  /**
   * Spinner for validation operations
   */
  validate(item) {
    return createSpinner(`Validating ${item}...`);
  },

  /**
   * Spinner for save operations
   */
  save(item) {
    return createSpinner(`Saving ${item}...`);
  },

  /**
   * Spinner for loading operations
   */
  load(item) {
    return createSpinner(`Loading ${item}...`);
  },
};

export default {
  createSpinner,
  withSpinner,
  withMultiSpinner,
  createProgress,
  spinners,
};
