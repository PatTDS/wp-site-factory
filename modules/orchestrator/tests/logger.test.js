/**
 * Logger Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Logger, getLogger, createLogger, LOG_LEVELS } from '../src/lib/logger.js';

describe('Logger', () => {
  let logger;
  let consoleSpy;

  beforeEach(() => {
    // Create fresh logger for each test with colors disabled
    logger = new Logger({
      level: 'DEBUG',
      colors: false,
      timestamps: false,
      prefix: '[TEST]',
    });

    // Spy on console methods
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create logger with default config', () => {
      const defaultLogger = new Logger();
      expect(defaultLogger.config).toBeDefined();
      expect(defaultLogger.config.prefix).toBe('[WPF]');
    });

    it('should merge custom config with defaults', () => {
      expect(logger.config.prefix).toBe('[TEST]');
      expect(logger.config.colors).toBe(false);
    });

    it('should parse log level correctly', () => {
      const debugLogger = new Logger({ level: 'DEBUG' });
      expect(debugLogger.level).toBe(LOG_LEVELS.DEBUG);

      const errorLogger = new Logger({ level: 'ERROR' });
      expect(errorLogger.level).toBe(LOG_LEVELS.ERROR);
    });
  });

  describe('log levels', () => {
    it('should log debug messages when level is DEBUG', () => {
      logger.debug('Debug message');

      expect(consoleSpy.log).toHaveBeenCalled();
      expect(consoleSpy.log.mock.calls[0][0]).toContain('Debug message');
    });

    it('should log info messages', () => {
      logger.info('Info message');

      expect(consoleSpy.log).toHaveBeenCalled();
      expect(consoleSpy.log.mock.calls[0][0]).toContain('Info message');
    });

    it('should log warning messages to console.warn', () => {
      logger.warn('Warning message');

      expect(consoleSpy.warn).toHaveBeenCalled();
      expect(consoleSpy.warn.mock.calls[0][0]).toContain('Warning message');
    });

    it('should log error messages to console.error', () => {
      logger.error('Error message');

      expect(consoleSpy.error).toHaveBeenCalled();
      expect(consoleSpy.error.mock.calls[0][0]).toContain('Error message');
    });

    it('should not log below configured level', () => {
      const errorOnlyLogger = new Logger({
        level: 'ERROR',
        colors: false,
        timestamps: false,
      });

      errorOnlyLogger.debug('Debug');
      errorOnlyLogger.info('Info');
      errorOnlyLogger.warn('Warn');

      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();

      errorOnlyLogger.error('Error');
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    it('should log nothing when level is NONE', () => {
      const silentLogger = new Logger({
        level: 'NONE',
        colors: false,
      });

      silentLogger.debug('Debug');
      silentLogger.info('Info');
      silentLogger.warn('Warn');
      silentLogger.error('Error');

      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });
  });

  describe('formatting', () => {
    it('should include prefix in messages', () => {
      logger.info('Test message');

      expect(consoleSpy.log.mock.calls[0][0]).toContain('[TEST]');
    });

    it('should include level in messages', () => {
      logger.info('Test message');

      expect(consoleSpy.log.mock.calls[0][0]).toContain('[INFO]');
    });

    it('should include data as JSON when provided', () => {
      logger.info('Message with data', { key: 'value' });

      const output = consoleSpy.log.mock.calls[0][0];
      expect(output).toContain('{"key":"value"}');
    });

    it('should include timestamps when enabled', () => {
      const timestampLogger = new Logger({
        level: 'INFO',
        colors: false,
        timestamps: true,
        prefix: '[TEST]',
      });

      timestampLogger.info('Test');

      const output = consoleSpy.log.mock.calls[0][0];
      // Should match ISO timestamp pattern
      expect(output).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('success', () => {
    it('should log success with checkmark', () => {
      logger.success('Operation complete');

      expect(consoleSpy.log).toHaveBeenCalled();
      expect(consoleSpy.log.mock.calls[0][0]).toContain('✓');
      expect(consoleSpy.log.mock.calls[0][0]).toContain('Operation complete');
    });

    it('should respect log level for success', () => {
      const warnLogger = new Logger({
        level: 'WARN',
        colors: false,
        timestamps: false,
      });

      warnLogger.success('Success');

      expect(consoleSpy.log).not.toHaveBeenCalled();
    });
  });

  describe('child logger', () => {
    it('should create child logger with extended prefix', () => {
      const child = logger.child('CHILD');

      child.info('Child message');

      expect(consoleSpy.log.mock.calls[0][0]).toContain('[TEST] [CHILD]');
    });

    it('should inherit parent config', () => {
      const child = logger.child('CHILD');

      expect(child.config.colors).toBe(false);
      expect(child.config.timestamps).toBe(false);
    });
  });

  describe('timing', () => {
    it('should track timing with time/timeEnd', async () => {
      logger.time('operation');

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 50));

      const duration = logger.timeEnd('operation');

      expect(duration).toBeGreaterThanOrEqual(50);
      expect(duration).toBeLessThan(200); // Reasonable upper bound
    });

    it('should warn when timer not found', () => {
      logger.timeEnd('nonexistent');

      expect(consoleSpy.warn).toHaveBeenCalled();
      expect(consoleSpy.warn.mock.calls[0][0]).toContain('No timer found');
    });

    it('should clear timer after timeEnd', () => {
      logger.time('operation');
      logger.timeEnd('operation');

      // Second call should warn
      logger.timeEnd('operation');

      expect(consoleSpy.warn).toHaveBeenCalled();
    });
  });

  describe('formatTimestamp', () => {
    it('should return ISO formatted timestamp', () => {
      const timestamp = logger.formatTimestamp();

      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
    });
  });
});

describe('LOG_LEVELS', () => {
  it('should have correct level values', () => {
    expect(LOG_LEVELS.DEBUG).toBe(0);
    expect(LOG_LEVELS.INFO).toBe(1);
    expect(LOG_LEVELS.WARN).toBe(2);
    expect(LOG_LEVELS.ERROR).toBe(3);
    expect(LOG_LEVELS.NONE).toBe(4);
  });
});

describe('getLogger singleton', () => {
  it('should return same logger instance', () => {
    // Note: This test might not work perfectly due to module caching
    // but tests the intended behavior
    const logger1 = getLogger({ level: 'INFO', colors: false });
    const logger2 = getLogger();

    expect(logger1).toBe(logger2);
  });
});

describe('createLogger factory', () => {
  it('should create new logger instance', () => {
    const logger1 = createLogger({ prefix: '[A]', colors: false });
    const logger2 = createLogger({ prefix: '[B]', colors: false });

    expect(logger1).not.toBe(logger2);
    expect(logger1.config.prefix).toBe('[A]');
    expect(logger2.config.prefix).toBe('[B]');
  });
});
