/**
 * WPF v2.0 Configuration Loader
 *
 * Loads and validates wpf-config.yaml files
 */
import pkg from 'fs-extra';
const { readFile, pathExists } = pkg;
import { parse as parseYaml } from 'yaml';
import { ZodError } from 'zod';
import { WPFConfigSchema, type WPFConfig } from '../types/config.js';

export interface ConfigLoadResult {
  success: boolean;
  config?: WPFConfig;
  errors?: string[];
  warnings?: string[];
}

/**
 * Load and validate WPF configuration from YAML file
 */
export async function loadConfig(configPath: string): Promise<ConfigLoadResult> {
  const warnings: string[] = [];

  // Check if file exists
  if (!await pathExists(configPath)) {
    return {
      success: false,
      errors: [`Configuration file not found: ${configPath}`]
    };
  }

  // Read file
  let content: string;
  try {
    content = await readFile(configPath, 'utf-8');
  } catch (error) {
    return {
      success: false,
      errors: [`Failed to read configuration file: ${(error as Error).message}`]
    };
  }

  // Parse YAML
  let rawConfig: unknown;
  try {
    rawConfig = parseYaml(content);
  } catch (error) {
    return {
      success: false,
      errors: [`Invalid YAML syntax: ${(error as Error).message}`]
    };
  }

  // Validate against schema
  try {
    const config = WPFConfigSchema.parse(rawConfig);

    // Add warnings for optional but recommended fields
    if (!config.social) {
      warnings.push('No social media links defined');
    }
    if (!config.company.description) {
      warnings.push('No company description provided');
    }
    if (!config.hosting) {
      warnings.push('No hosting configuration - using Docker defaults');
    }

    return {
      success: true,
      config,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map(e => {
        const path = e.path.join('.');
        return `${path}: ${e.message}`;
      });
      return {
        success: false,
        errors
      };
    }
    return {
      success: false,
      errors: [`Validation failed: ${(error as Error).message}`]
    };
  }
}

/**
 * Validate configuration without loading from file
 */
export function validateConfig(config: unknown): ConfigLoadResult {
  try {
    const validConfig = WPFConfigSchema.parse(config);
    return {
      success: true,
      config: validConfig
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map(e => {
        const path = e.path.join('.');
        return `${path}: ${e.message}`;
      });
      return {
        success: false,
        errors
      };
    }
    return {
      success: false,
      errors: [`Validation failed: ${(error as Error).message}`]
    };
  }
}

/**
 * Get default configuration for a given industry
 */
export function getIndustryDefaults(industry: string): Partial<WPFConfig> {
  const industryDefaults: Record<string, Partial<WPFConfig>> = {
    technology: {
      branding: {
        primary_color: '#2563eb',
        secondary_color: '#1e40af',
        font_family: 'Inter'
      }
    },
    healthcare: {
      branding: {
        primary_color: '#0891b2',
        secondary_color: '#0e7490',
        font_family: 'Open Sans'
      }
    },
    legal: {
      branding: {
        primary_color: '#1e3a5f',
        secondary_color: '#0f172a',
        font_family: 'Merriweather'
      }
    },
    restaurant: {
      branding: {
        primary_color: '#dc2626',
        secondary_color: '#b91c1c',
        font_family: 'Playfair Display'
      }
    },
    construction: {
      branding: {
        primary_color: '#f59e0b',
        secondary_color: '#d97706',
        font_family: 'Roboto'
      }
    },
    beauty: {
      branding: {
        primary_color: '#ec4899',
        secondary_color: '#db2777',
        font_family: 'Poppins'
      }
    },
    finance: {
      branding: {
        primary_color: '#059669',
        secondary_color: '#047857',
        font_family: 'Source Sans Pro'
      }
    }
  };

  return industryDefaults[industry] || {
    branding: {
      primary_color: '#16a34a',
      secondary_color: '#15803d',
      font_family: 'Inter'
    }
  };
}
