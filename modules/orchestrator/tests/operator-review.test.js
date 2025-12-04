/**
 * Operator Review Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createReview,
  updateChecklistItem,
  addComment,
  makeDecision,
  generateReport,
  autoReview,
  REVIEW_CHECKLIST,
} from '../src/lib/operator-review.js';

describe('Operator Review', () => {
  // Sample blueprint for testing
  const sampleBlueprint = {
    id: 'blueprint-123',
    version: '1.0',
    client_profile: {
      company: {
        name: 'Test Company',
        slug: 'test-company',
      },
    },
    content_drafts: {
      hero: {
        headline: 'Building Excellence in Every Project',
        subheadline: 'Your trusted partner for construction',
        cta_primary: {
          text: 'Get a Free Quote',
          action: 'scroll_to_contact',
        },
      },
      services: {
        services: [
          { name: 'Service 1', description: 'Description 1' },
          { name: 'Service 2', description: 'Description 2' },
        ],
      },
      contact: {
        phone: { number: '1234567890' },
        email: 'test@example.com',
      },
    },
    structure_recommendation: {
      pages: [
        { name: 'Home', slug: '/' },
        { name: 'About', slug: '/about' },
        { name: 'Services', slug: '/services' },
        { name: 'Contact', slug: '/contact' },
      ],
    },
  };

  describe('createReview', () => {
    it('should create a review with correct structure', () => {
      const review = createReview(sampleBlueprint, 'John Doe');

      expect(review.id).toMatch(/^review-\d+-[a-z0-9]+$/);
      expect(review.blueprint_id).toBe('blueprint-123');
      expect(review.blueprint_version).toBe('1.0');
      expect(review.project).toBe('test-company');
      expect(review.operator).toBe('John Doe');
      expect(review.status).toBe('pending');
      expect(review.overall_score).toBe(0);
      expect(review.comments).toEqual([]);
      expect(review.decision).toBeNull();
    });

    it('should initialize checklist with all items unchecked', () => {
      const review = createReview(sampleBlueprint, 'John');

      expect(review.checklist).toBeDefined();
      expect(review.checklist.content_quality).toBeDefined();
      expect(review.checklist.brand_alignment).toBeDefined();
      expect(review.checklist.technical_accuracy).toBeDefined();
      expect(review.checklist.structure).toBeDefined();

      // All items should be unchecked
      for (const category of Object.values(review.checklist)) {
        for (const item of category.items) {
          expect(item.checked).toBe(false);
          expect(item.note).toBe('');
        }
      }
    });

    it('should use defaults for missing operator', () => {
      const review = createReview(sampleBlueprint);
      expect(review.operator).toBe('Unknown');
    });
  });

  describe('updateChecklistItem', () => {
    let review;

    beforeEach(() => {
      review = createReview(sampleBlueprint, 'Tester');
    });

    it('should update item to checked', () => {
      updateChecklistItem(review, 'content_quality', 'headline_compelling', true);

      const item = review.checklist.content_quality.items.find(i => i.id === 'headline_compelling');
      expect(item.checked).toBe(true);
    });

    it('should add note when provided', () => {
      updateChecklistItem(review, 'content_quality', 'headline_compelling', true, 'Looks great!');

      const item = review.checklist.content_quality.items.find(i => i.id === 'headline_compelling');
      expect(item.note).toBe('Looks great!');
    });

    it('should recalculate score when item checked', () => {
      expect(review.overall_score).toBe(0);

      updateChecklistItem(review, 'content_quality', 'headline_compelling', true);

      expect(review.overall_score).toBeGreaterThan(0);
    });

    it('should change status to in_progress', () => {
      expect(review.status).toBe('pending');

      updateChecklistItem(review, 'content_quality', 'headline_compelling', true);

      expect(review.status).toBe('in_progress');
    });

    it('should throw error for unknown category', () => {
      expect(() => {
        updateChecklistItem(review, 'nonexistent', 'headline_compelling', true);
      }).toThrow('Unknown category: nonexistent');
    });

    it('should throw error for unknown item', () => {
      expect(() => {
        updateChecklistItem(review, 'content_quality', 'nonexistent_item', true);
      }).toThrow('Unknown item: nonexistent_item');
    });
  });

  describe('addComment', () => {
    let review;

    beforeEach(() => {
      review = createReview(sampleBlueprint, 'Tester');
    });

    it('should add comment with default severity', () => {
      addComment(review, 'hero', 'Consider stronger CTA text');

      expect(review.comments).toHaveLength(1);
      expect(review.comments[0].section).toBe('hero');
      expect(review.comments[0].comment).toBe('Consider stronger CTA text');
      expect(review.comments[0].severity).toBe('info');
    });

    it('should add comment with custom severity', () => {
      addComment(review, 'services', 'Missing service description', 'issue');

      expect(review.comments[0].severity).toBe('issue');
    });

    it('should add multiple comments', () => {
      addComment(review, 'hero', 'Comment 1');
      addComment(review, 'services', 'Comment 2', 'suggestion');
      addComment(review, 'contact', 'Comment 3', 'critical');

      expect(review.comments).toHaveLength(3);
    });

    it('should include timestamp in comment', () => {
      addComment(review, 'hero', 'Test comment');

      expect(review.comments[0].timestamp).toBeDefined();
      expect(new Date(review.comments[0].timestamp)).toBeInstanceOf(Date);
    });
  });

  describe('makeDecision', () => {
    let review;

    beforeEach(() => {
      review = createReview(sampleBlueprint, 'Tester');
    });

    it('should set approve decision', () => {
      makeDecision(review, 'approve', 'Ready for client');

      expect(review.decision).toBe('approve');
      expect(review.decision_notes).toBe('Ready for client');
      expect(review.status).toBe('approved');
      expect(review.decided_at).toBeDefined();
    });

    it('should set revise decision', () => {
      makeDecision(review, 'revise', 'Needs more work on services section');

      expect(review.decision).toBe('revise');
      expect(review.status).toBe('needs_revision');
    });

    it('should throw error for invalid decision', () => {
      expect(() => {
        makeDecision(review, 'maybe');
      }).toThrow('Decision must be "approve" or "revise"');
    });

    it('should allow empty notes', () => {
      makeDecision(review, 'approve');

      expect(review.decision_notes).toBe('');
    });
  });

  describe('generateReport', () => {
    let review;

    beforeEach(() => {
      review = createReview(sampleBlueprint, 'John Doe');
    });

    it('should generate markdown report', () => {
      const report = generateReport(review);

      expect(report).toContain('# Operator Review Report');
      expect(report).toContain('**Project:** test-company');
      expect(report).toContain('**Reviewer:** John Doe');
      expect(report).toContain('## Checklist Results');
    });

    it('should include checklist items in report', () => {
      updateChecklistItem(review, 'content_quality', 'headline_compelling', true);

      const report = generateReport(review);

      expect(report).toContain('[x] Hero headline is compelling and clear');
      expect(report).toContain('[ ] Subheadline supports the main message');
    });

    it('should include notes in report', () => {
      updateChecklistItem(review, 'content_quality', 'headline_compelling', true, 'Excellent!');

      const report = generateReport(review);

      expect(report).toContain('*Excellent!*');
    });

    it('should include comments in report', () => {
      addComment(review, 'hero', 'Great headline!', 'info');
      addComment(review, 'services', 'Add more detail', 'suggestion');

      const report = generateReport(review);

      expect(report).toContain('## Comments');
      expect(report).toContain('Great headline!');
      expect(report).toContain('Add more detail');
    });

    it('should include decision in report', () => {
      makeDecision(review, 'approve', 'All good to go!');

      const report = generateReport(review);

      expect(report).toContain('## Decision');
      expect(report).toContain('**Decision:** APPROVE');
      expect(report).toContain('All good to go!');
    });
  });

  describe('autoReview', () => {
    it('should pass checks for complete blueprint', () => {
      const result = autoReview(sampleBlueprint);

      expect(result.results.passed.length).toBeGreaterThan(0);
      expect(result.results.errors.length).toBe(0);
      expect(result.recommendation).toBe('ready_for_client');
    });

    it('should report missing hero section', () => {
      const incomplete = { ...sampleBlueprint, content_drafts: {} };
      const result = autoReview(incomplete);

      expect(result.results.errors).toContain('Missing hero section');
    });

    it('should report missing headline', () => {
      const incomplete = {
        ...sampleBlueprint,
        content_drafts: {
          ...sampleBlueprint.content_drafts,
          hero: { subheadline: 'Test' },
        },
      };
      const result = autoReview(incomplete);

      expect(result.results.errors.some(e => e.includes('headline'))).toBe(true);
    });

    it('should report missing CTA', () => {
      const incomplete = {
        ...sampleBlueprint,
        content_drafts: {
          ...sampleBlueprint.content_drafts,
          hero: {
            headline: 'Test Headline',
            subheadline: 'Test Subheadline',
          },
        },
      };
      const result = autoReview(incomplete);

      expect(result.results.errors).toContain('Missing primary CTA');
    });

    it('should warn about missing services descriptions', () => {
      const incomplete = {
        ...sampleBlueprint,
        content_drafts: {
          ...sampleBlueprint.content_drafts,
          services: {
            services: [
              { name: 'Service 1' }, // No description
              { name: 'Service 2', description: 'Has description' },
            ],
          },
        },
      };
      const result = autoReview(incomplete);

      expect(result.results.warnings.some(w => w.includes('missing descriptions'))).toBe(true);
    });

    it('should calculate score', () => {
      const result = autoReview(sampleBlueprint);

      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('should recommend revision for many errors', () => {
      const incomplete = { content_drafts: {} };
      const result = autoReview(incomplete);

      expect(result.recommendation).toBe('needs_major_revision');
    });

    it('should recommend minor revision for some errors', () => {
      const partial = {
        ...sampleBlueprint,
        content_drafts: {
          hero: {
            headline: 'Test',
            subheadline: 'Sub',
            cta_primary: { text: 'CTA' },
          },
          services: { services: [] },
          contact: {
            phone: { number: '123' },
          },
        },
      };
      const result = autoReview(partial);

      expect(['needs_minor_revision', 'needs_major_revision']).toContain(result.recommendation);
    });
  });

  describe('REVIEW_CHECKLIST constant', () => {
    it('should have all expected categories', () => {
      expect(REVIEW_CHECKLIST).toHaveProperty('content_quality');
      expect(REVIEW_CHECKLIST).toHaveProperty('brand_alignment');
      expect(REVIEW_CHECKLIST).toHaveProperty('technical_accuracy');
      expect(REVIEW_CHECKLIST).toHaveProperty('structure');
    });

    it('should have items with required properties', () => {
      for (const category of Object.values(REVIEW_CHECKLIST)) {
        expect(category).toHaveProperty('title');
        expect(category).toHaveProperty('items');
        expect(Array.isArray(category.items)).toBe(true);

        for (const item of category.items) {
          expect(item).toHaveProperty('id');
          expect(item).toHaveProperty('label');
          expect(item).toHaveProperty('weight');
          expect(typeof item.weight).toBe('number');
        }
      }
    });
  });
});
