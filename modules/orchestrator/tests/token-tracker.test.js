/**
 * Token Tracker Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TokenTracker, getTracker, MODEL_PRICING } from '../src/lib/token-tracker.js';

describe('TokenTracker', () => {
  let tracker;

  beforeEach(() => {
    tracker = new TokenTracker('test-project');
  });

  describe('constructor', () => {
    it('should create tracker with project name', () => {
      expect(tracker.projectName).toBe('test-project');
    });

    it('should generate unique session ID', () => {
      const tracker2 = new TokenTracker('test-project');
      expect(tracker.sessionId).not.toBe(tracker2.sessionId);
    });

    it('should initialize with empty operations', () => {
      expect(tracker.operations).toEqual([]);
    });
  });

  describe('track', () => {
    it('should track an operation', () => {
      const entry = tracker.track({
        operation: 'test_operation',
        model: 'claude-3-5-sonnet-20241022',
        inputTokens: 100,
        outputTokens: 50,
      });

      expect(entry.operation).toBe('test_operation');
      expect(entry.tokens.input).toBe(100);
      expect(entry.tokens.output).toBe(50);
      expect(entry.tokens.total).toBe(150);
    });

    it('should calculate cost correctly', () => {
      const entry = tracker.track({
        operation: 'test_operation',
        model: 'claude-3-5-sonnet-20241022',
        inputTokens: 1000000, // 1M tokens
        outputTokens: 1000000, // 1M tokens
      });

      // Expected: $3 input + $15 output = $18
      expect(entry.cost_usd).toBe(18);
    });

    it('should add operation to list', () => {
      tracker.track({
        operation: 'op1',
        model: 'claude-3-5-sonnet-20241022',
        inputTokens: 100,
        outputTokens: 50,
      });

      expect(tracker.operations).toHaveLength(1);
    });
  });

  describe('calculateCost', () => {
    it('should calculate cost for Sonnet model', () => {
      const cost = tracker.calculateCost('claude-3-5-sonnet-20241022', 1000000, 1000000);
      expect(cost).toBe(18); // $3 + $15
    });

    it('should calculate cost for Haiku model', () => {
      const cost = tracker.calculateCost('claude-3-haiku-20240307', 1000000, 1000000);
      expect(cost).toBe(1.5); // $0.25 + $1.25
    });

    it('should handle small token counts', () => {
      const cost = tracker.calculateCost('claude-3-5-sonnet-20241022', 100, 100);
      expect(cost).toBeGreaterThan(0);
      expect(cost).toBeLessThan(0.01);
    });
  });

  describe('getTotals', () => {
    it('should return zero totals when empty', () => {
      const totals = tracker.getTotals();
      expect(totals.total_tokens).toBe(0);
      expect(totals.total_cost_usd).toBe(0);
      expect(totals.operation_count).toBe(0);
    });

    it('should sum multiple operations', () => {
      tracker.track({
        operation: 'op1',
        model: 'claude-3-5-sonnet-20241022',
        inputTokens: 100,
        outputTokens: 50,
      });
      tracker.track({
        operation: 'op2',
        model: 'claude-3-5-sonnet-20241022',
        inputTokens: 200,
        outputTokens: 100,
      });

      const totals = tracker.getTotals();
      expect(totals.total_tokens).toBe(450);
      expect(totals.input_tokens).toBe(300);
      expect(totals.output_tokens).toBe(150);
      expect(totals.operation_count).toBe(2);
    });
  });

  describe('getBreakdownByOperation', () => {
    it('should group by operation type', () => {
      tracker.track({ operation: 'research', model: 'claude-3-5-sonnet-20241022', inputTokens: 100, outputTokens: 50 });
      tracker.track({ operation: 'research', model: 'claude-3-5-sonnet-20241022', inputTokens: 100, outputTokens: 50 });
      tracker.track({ operation: 'generate', model: 'claude-3-5-sonnet-20241022', inputTokens: 200, outputTokens: 100 });

      const breakdown = tracker.getBreakdownByOperation();

      expect(breakdown.research.count).toBe(2);
      expect(breakdown.research.tokens).toBe(300);
      expect(breakdown.generate.count).toBe(1);
      expect(breakdown.generate.tokens).toBe(300);
    });
  });

  describe('estimateTokens', () => {
    it('should estimate tokens from text', () => {
      const tokens = TokenTracker.estimateTokens('Hello World'); // 11 chars
      expect(tokens).toBe(3); // ~4 chars per token
    });

    it('should return 0 for empty text', () => {
      expect(TokenTracker.estimateTokens('')).toBe(0);
      expect(TokenTracker.estimateTokens(null)).toBe(0);
    });
  });

  describe('reset', () => {
    it('should clear operations', () => {
      tracker.track({ operation: 'op1', model: 'claude-3-5-sonnet-20241022', inputTokens: 100, outputTokens: 50 });
      tracker.reset();
      expect(tracker.operations).toEqual([]);
    });

    it('should generate new session ID', () => {
      const oldSessionId = tracker.sessionId;
      tracker.reset();
      expect(tracker.sessionId).not.toBe(oldSessionId);
    });
  });

  describe('toJSON', () => {
    it('should export valid JSON structure', () => {
      tracker.track({ operation: 'op1', model: 'claude-3-5-sonnet-20241022', inputTokens: 100, outputTokens: 50 });

      const json = tracker.toJSON();

      expect(json.project).toBe('test-project');
      expect(json.session_id).toBeDefined();
      expect(json.operations).toHaveLength(1);
      expect(json.session_totals).toBeDefined();
      expect(json.breakdown_by_operation).toBeDefined();
    });
  });
});

describe('getTracker singleton', () => {
  it('should return same tracker for same project', () => {
    const tracker1 = getTracker('singleton-project');
    const tracker2 = getTracker('singleton-project');
    expect(tracker1).toBe(tracker2);
  });
});
