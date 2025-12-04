/**
 * Validator Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { validateClientIntake, formatErrors, isValidIntake } from '../src/lib/validator.js';

describe('Validator', () => {
  // Minimal valid intake data
  const validIntake = {
    company: {
      name: 'Test Company',
      slug: 'test-company',
    },
    industry: {
      category: 'construction',
    },
    services: [
      { name: 'Service 1', is_primary: true },
    ],
    contact: {
      phone: '1234567890',
      email: 'test@example.com',
    },
  };

  describe('validateClientIntake', () => {
    it('should validate a minimal valid intake', () => {
      const result = validateClientIntake(validIntake);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when company name is missing', () => {
      const intake = {
        ...validIntake,
        company: { slug: 'test' },
      };
      const result = validateClientIntake(intake);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path.includes('name'))).toBe(true);
    });

    it('should fail when industry category is missing', () => {
      const intake = {
        ...validIntake,
        industry: {},
      };
      const result = validateClientIntake(intake);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path.includes('category'))).toBe(true);
    });

    it('should fail when services array is empty', () => {
      const intake = {
        ...validIntake,
        services: [],
      };
      const result = validateClientIntake(intake);
      expect(result.valid).toBe(false);
    });

    it('should validate email format', () => {
      const intake = {
        ...validIntake,
        contact: {
          ...validIntake.contact,
          email: 'invalid-email',
        },
      };
      const result = validateClientIntake(intake);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('email'))).toBe(true);
    });

    it('should validate industry category enum', () => {
      const intake = {
        ...validIntake,
        industry: {
          category: 'invalid-category',
        },
      };
      const result = validateClientIntake(intake);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('one of'))).toBe(true);
    });
  });

  describe('formatErrors', () => {
    it('should format single error', () => {
      const errors = [
        { path: 'company.name', message: 'Missing required field' },
      ];
      const formatted = formatErrors(errors);
      expect(formatted).toContain('company.name');
      expect(formatted).toContain('Missing required field');
    });

    it('should format multiple errors', () => {
      const errors = [
        { path: 'field1', message: 'Error 1' },
        { path: 'field2', message: 'Error 2' },
      ];
      const formatted = formatErrors(errors);
      expect(formatted).toContain('1.');
      expect(formatted).toContain('2.');
    });

    it('should return no errors message when empty', () => {
      expect(formatErrors([])).toBe('No errors');
    });

    it('should include value when present', () => {
      const errors = [
        { path: 'field', message: 'Invalid value', value: 'bad' },
      ];
      const formatted = formatErrors(errors);
      expect(formatted).toContain('bad');
    });
  });

  describe('isValidIntake', () => {
    it('should return true for valid intake', () => {
      expect(isValidIntake(validIntake)).toBe(true);
    });

    it('should return false for invalid intake', () => {
      expect(isValidIntake({})).toBe(false);
    });
  });

  describe('complex validation scenarios', () => {
    it('should validate complete intake with all fields', () => {
      const completeIntake = {
        company: {
          name: 'Full Company',
          tagline: 'The best company',
          years_in_business: 10,
          employees: '11-25',
        },
        industry: {
          category: 'construction',
          niche: 'precast-concrete',
          service_area: 'Sydney, NSW',
        },
        services: [
          { name: 'Service 1', is_primary: true, description: 'Main service' },
          { name: 'Service 2', is_primary: false },
        ],
        brand: {
          colors: {
            primary: '#336699',
            secondary: '#FFFFFF',
          },
          tone: 'professional',
        },
        contact: {
          phone: '+61 400 000 000',
          email: 'info@example.com',
          address: {
            street: '123 Main St',
            city: 'Sydney',
            state: 'NSW',
            country: 'Australia',
          },
        },
      };

      const result = validateClientIntake(completeIntake);
      expect(result.valid).toBe(true);
    });

    it('should validate nested service objects', () => {
      const intake = {
        ...validIntake,
        services: [
          { name: 'Service 1', is_primary: true, features: ['Feature 1', 'Feature 2'] },
        ],
      };
      const result = validateClientIntake(intake);
      expect(result.valid).toBe(true);
    });
  });
});
