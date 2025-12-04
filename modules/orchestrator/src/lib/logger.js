/**
 * Logger Module
 * Structured logging with levels and timestamps
 */

import fs from 'fs';
import path from 'path';

// Log levels
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

// ANSI colors
const COLORS = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Default configuration
const DEFAULT_CONFIG = {
  level: process.env.LOG_LEVEL || 'INFO',
  timestamps: process.env.LOG_TIMESTAMPS !== 'false',
  colors: process.env.LOG_COLORS !== 'false' && process.stdout.isTTY,
  prefix: process.env.LOG_PREFIX || '[WPF]',
  logFile: process.env.LOG_FILE || null,
};

class Logger {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.level = LOG_LEVELS[this.config.level.toUpperCase()] ?? LOG_LEVELS.INFO;
    this.logStream = null;

    if (this.config.logFile) {
      this.initFileLogging();
    }
  }

  /**
   * Initialize file logging
   */
  initFileLogging() {
    const logDir = path.dirname(this.config.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    this.logStream = fs.createWriteStream(this.config.logFile, { flags: 'a' });
  }

  /**
   * Format timestamp
   */
  formatTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Format log message
   */
  formatMessage(level, message, data = null) {
    const parts = [];

    if (this.config.timestamps) {
      parts.push(this.config.colors ? `${COLORS.dim}${this.formatTimestamp()}${COLORS.reset}` : this.formatTimestamp());
    }

    parts.push(this.config.prefix);
    parts.push(this.formatLevel(level));
    parts.push(message);

    return parts.join(' ');
  }

  /**
   * Format log level with color
   */
  formatLevel(level) {
    const levelColors = {
      DEBUG: COLORS.magenta,
      INFO: COLORS.blue,
      WARN: COLORS.yellow,
      ERROR: COLORS.red,
    };

    if (this.config.colors) {
      return `${levelColors[level] || COLORS.reset}[${level}]${COLORS.reset}`;
    }
    return `[${level}]`;
  }

  /**
   * Log at specified level
   */
  log(level, message, data = null) {
    if (LOG_LEVELS[level] < this.level) return;

    const formattedMessage = this.formatMessage(level, message);

    // Console output
    const output = data ? `${formattedMessage} ${JSON.stringify(data)}` : formattedMessage;

    switch (level) {
      case 'ERROR':
        console.error(output);
        break;
      case 'WARN':
        console.warn(output);
        break;
      default:
        console.log(output);
    }

    // File output
    if (this.logStream) {
      const plainMessage = `${this.formatTimestamp()} [${level}] ${message}`;
      const fileOutput = data ? `${plainMessage} ${JSON.stringify(data)}` : plainMessage;
      this.logStream.write(fileOutput + '\n');
    }
  }

  /**
   * Debug level
   */
  debug(message, data = null) {
    this.log('DEBUG', message, data);
  }

  /**
   * Info level
   */
  info(message, data = null) {
    this.log('INFO', message, data);
  }

  /**
   * Warning level
   */
  warn(message, data = null) {
    this.log('WARN', message, data);
  }

  /**
   * Error level
   */
  error(message, data = null) {
    this.log('ERROR', message, data);
  }

  /**
   * Success message (info level with green color)
   */
  success(message, data = null) {
    if (LOG_LEVELS.INFO < this.level) return;

    const prefix = this.config.colors ? `${COLORS.green}✓${COLORS.reset}` : '✓';
    this.log('INFO', `${prefix} ${message}`, data);
  }

  /**
   * Create child logger with additional prefix
   */
  child(prefix) {
    return new Logger({
      ...this.config,
      prefix: `${this.config.prefix} [${prefix}]`,
    });
  }

  /**
   * Log operation timing
   */
  time(label) {
    this.timers = this.timers || {};
    this.timers[label] = Date.now();
    this.debug(`Started: ${label}`);
  }

  /**
   * End timing and log duration
   */
  timeEnd(label) {
    if (!this.timers || !this.timers[label]) {
      this.warn(`No timer found for: ${label}`);
      return;
    }

    const duration = Date.now() - this.timers[label];
    delete this.timers[label];

    this.debug(`Completed: ${label}`, { durationMs: duration });
    return duration;
  }

  /**
   * Close file stream
   */
  close() {
    if (this.logStream) {
      this.logStream.end();
    }
  }
}

// Singleton instance
let defaultLogger = null;

/**
 * Get or create default logger
 */
export function getLogger(config = {}) {
  if (!defaultLogger) {
    defaultLogger = new Logger(config);
  }
  return defaultLogger;
}

/**
 * Create new logger instance
 */
export function createLogger(config = {}) {
  return new Logger(config);
}

// Export convenience methods from default logger
export const debug = (msg, data) => getLogger().debug(msg, data);
export const info = (msg, data) => getLogger().info(msg, data);
export const warn = (msg, data) => getLogger().warn(msg, data);
export const error = (msg, data) => getLogger().error(msg, data);
export const success = (msg, data) => getLogger().success(msg, data);

export { Logger, LOG_LEVELS };
export default Logger;
