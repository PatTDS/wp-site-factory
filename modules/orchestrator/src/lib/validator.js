/**
 * Schema Validator
 * Validates client intake and other data against JSON schemas
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMAS_DIR = path.join(__dirname, '../../schemas');

// Cache loaded schemas
const schemaCache = {};

/**
 * Load a JSON schema
 * @param {string} schemaName - Schema name (without .schema.json extension)
 * @returns {object} Parsed schema
 */
function loadSchema(schemaName) {
  if (schemaCache[schemaName]) {
    return schemaCache[schemaName];
  }

  const schemaPath = path.join(SCHEMAS_DIR, `${schemaName}.schema.json`);

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema not found: ${schemaName}`);
  }

  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  schemaCache[schemaName] = schema;
  return schema;
}

/**
 * Validate data against a schema
 * This is a simplified validator - for production, use Ajv or similar
 * @param {object} data - Data to validate
 * @param {object} schema - JSON schema
 * @param {string} path - Current path (for error messages)
 * @returns {object} Validation result
 */
function validateAgainstSchema(data, schema, currentPath = '') {
  const errors = [];

  // Check type
  if (schema.type) {
    const actualType = getType(data);
    if (!isTypeCompatible(schema.type, actualType)) {
      // Special case: null for optional fields
      if (data !== null && data !== undefined) {
        errors.push({
          path: currentPath || 'root',
          message: `Expected ${schema.type}, got ${actualType}`,
          value: data,
        });
        return { valid: false, errors };
      }
    }
  }

  // Check required properties for objects
  if (schema.type === 'object' && schema.required && data) {
    for (const requiredProp of schema.required) {
      if (!(requiredProp in data) || data[requiredProp] === undefined) {
        errors.push({
          path: currentPath ? `${currentPath}.${requiredProp}` : requiredProp,
          message: `Missing required field: ${requiredProp}`,
        });
      }
    }
  }

  // Validate object properties
  if (schema.type === 'object' && schema.properties && data) {
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      if (propName in data) {
        const propPath = currentPath ? `${currentPath}.${propName}` : propName;
        const propResult = validateAgainstSchema(data[propName], propSchema, propPath);
        errors.push(...propResult.errors);
      }
    }
  }

  // Validate array items
  if (schema.type === 'array' && schema.items && Array.isArray(data)) {
    data.forEach((item, index) => {
      const itemPath = `${currentPath}[${index}]`;
      const itemResult = validateAgainstSchema(item, schema.items, itemPath);
      errors.push(...itemResult.errors);
    });

    // Check minItems
    if (schema.minItems && data.length < schema.minItems) {
      errors.push({
        path: currentPath,
        message: `Array must have at least ${schema.minItems} items`,
        value: data.length,
      });
    }
  }

  // Check enum values
  if (schema.enum && data !== undefined && data !== null) {
    if (!schema.enum.includes(data)) {
      errors.push({
        path: currentPath,
        message: `Value must be one of: ${schema.enum.join(', ')}`,
        value: data,
      });
    }
  }

  // Check string patterns
  if (schema.pattern && typeof data === 'string') {
    const regex = new RegExp(schema.pattern);
    if (!regex.test(data)) {
      errors.push({
        path: currentPath,
        message: `Value does not match pattern: ${schema.pattern}`,
        value: data,
      });
    }
  }

  // Check string format
  if (schema.format && typeof data === 'string') {
    const formatError = validateFormat(data, schema.format, currentPath);
    if (formatError) {
      errors.push(formatError);
    }
  }

  // Check minLength / maxLength
  if (typeof data === 'string') {
    if (schema.minLength && data.length < schema.minLength) {
      errors.push({
        path: currentPath,
        message: `String must be at least ${schema.minLength} characters`,
        value: data,
      });
    }
    if (schema.maxLength && data.length > schema.maxLength) {
      errors.push({
        path: currentPath,
        message: `String must be at most ${schema.maxLength} characters`,
        value: data,
      });
    }
  }

  // Check minimum / maximum for numbers
  if (typeof data === 'number') {
    if (schema.minimum !== undefined && data < schema.minimum) {
      errors.push({
        path: currentPath,
        message: `Value must be at least ${schema.minimum}`,
        value: data,
      });
    }
    if (schema.maximum !== undefined && data > schema.maximum) {
      errors.push({
        path: currentPath,
        message: `Value must be at most ${schema.maximum}`,
        value: data,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get JavaScript type as JSON schema type
 */
function getType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'number') {
    // JSON Schema distinguishes between integer and number
    return Number.isInteger(value) ? 'integer' : 'number';
  }
  return typeof value;
}

/**
 * Check if types are compatible
 */
function isTypeCompatible(schemaType, actualType) {
  if (schemaType === actualType) return true;
  // Integer is a subset of number
  if (schemaType === 'number' && actualType === 'integer') return true;
  return false;
}

/**
 * Validate string format
 */
function validateFormat(value, format, path) {
  const formatValidators = {
    email: {
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format',
    },
    uri: {
      regex: /^https?:\/\/.+/,
      message: 'Invalid URI format (must start with http:// or https://)',
    },
    'date-time': {
      regex: /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/,
      message: 'Invalid date-time format',
    },
    phone: {
      regex: /^[\d\s\-\+\(\)]+$/,
      message: 'Invalid phone format',
    },
  };

  const validator = formatValidators[format];
  if (validator && !validator.regex.test(value)) {
    return {
      path,
      message: validator.message,
      value,
    };
  }
  return null;
}

/**
 * Validate client intake data
 * @param {object} intakeData - Client intake data
 * @returns {object} Validation result
 */
export function validateClientIntake(intakeData) {
  const schema = loadSchema('client-intake');
  return validateAgainstSchema(intakeData, schema);
}

/**
 * Validate any data against a named schema
 * @param {object} data - Data to validate
 * @param {string} schemaName - Schema name
 * @returns {object} Validation result
 */
export function validate(data, schemaName) {
  const schema = loadSchema(schemaName);
  return validateAgainstSchema(data, schema);
}

/**
 * Format validation errors for display
 * @param {Array} errors - Validation errors
 * @returns {string} Formatted error string
 */
export function formatErrors(errors) {
  if (errors.length === 0) return 'No errors';

  return errors.map((e, i) =>
    `${i + 1}. ${e.path}: ${e.message}${e.value !== undefined ? ` (got: ${JSON.stringify(e.value)})` : ''}`
  ).join('\n');
}

/**
 * Quick check if intake data is valid
 * @param {object} intakeData - Client intake data
 * @returns {boolean} True if valid
 */
export function isValidIntake(intakeData) {
  return validateClientIntake(intakeData).valid;
}

export default {
  validateClientIntake,
  validate,
  formatErrors,
  isValidIntake,
  loadSchema,
};
