/**
 * WPF v2.0 Compliance Types
 *
 * Type definitions for KB compliance validation
 */

// Check types available for requirements
export type CheckType =
  | 'file_exists'
  | 'files_exist'
  | 'file_size'
  | 'grep'
  | 'wp_config'
  | 'plugin_active'
  | 'command'
  | 'lighthouse'
  | 'http_headers'
  | 'url_accessible'
  | 'html_contains';

// Check expectation types
export type CheckExpect =
  | 'found'
  | 'not_found'
  | 'exit_0'
  | 'found_if_forms_exist';

// Requirement check definition
export interface RequirementCheck {
  type: CheckType;
  path?: string;
  paths?: string[];
  files?: string[];
  pattern?: string;
  constant?: string;
  value?: boolean | string | number;
  expect?: CheckExpect;
  plugin?: string;
  plugins?: string[];
  match?: 'any' | 'all';
  metric?: string;
  threshold?: number;
  unit?: string;
  headers?: string[];
  pages?: string | 'all';
  max_size?: number;
  cmd?: string;
}

// Individual requirement
export interface Requirement {
  id: string;
  name: string;
  description: string;
  check: RequirementCheck;
  weight: number;
  required: boolean;
}

// Requirement categories
export type RequirementCategory =
  | 'architecture'
  | 'security'
  | 'performance'
  | 'seo'
  | 'testing';

// Requirements by category
export type Requirements = {
  [K in RequirementCategory]: Requirement[];
};

// Compliance level definitions
export interface ComplianceLevelDefinition {
  description: string;
  required_categories: RequirementCategory[];
  score_threshold: number;
}

// Full KB requirements document
export interface KBRequirements {
  version: string;
  last_updated: string;
  requirements: Requirements;
  compliance_levels: {
    minimal: ComplianceLevelDefinition;
    standard: ComplianceLevelDefinition;
    strict: ComplianceLevelDefinition;
  };
}

// Result of checking a single requirement
export interface RequirementResult {
  id: string;
  name: string;
  passed: boolean;
  message?: string;
  weight: number;
  required: boolean;
  category: RequirementCategory;
}

// Category result summary
export interface CategoryResult {
  category: RequirementCategory;
  passed: number;
  failed: number;
  total: number;
  score: number; // 0-100
  requirements: RequirementResult[];
}

// Full compliance report
export interface ComplianceReport {
  timestamp: string;
  project: string;
  level: 'minimal' | 'standard' | 'strict';
  score: number; // 0-100
  passed: boolean;
  summary: {
    total_requirements: number;
    passed: number;
    failed: number;
    required_failed: number;
  };
  categories: {
    architecture: CategoryResult;
    security: CategoryResult;
    performance: CategoryResult;
    seo: CategoryResult;
    testing: CategoryResult;
  };
  recommendations: string[];
  critical_failures: RequirementResult[];
}

// Compliance checker options
export interface ComplianceCheckOptions {
  level?: 'minimal' | 'standard' | 'strict';
  categories?: RequirementCategory[];
  skipLighthouse?: boolean;
  verbose?: boolean;
}
