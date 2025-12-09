/**
 * Test Blueprint and Helper Functions
 *
 * Provides shared test data and utilities for E2E tests
 */

/**
 * Minimal test blueprint for testing
 * Uses minimal data to speed up tests
 */
export const testBlueprint = {
  industry: 'construction',
  preset: 'industrial-modern',
  client_profile: {
    company: {
      name: 'Test Construction Co',
      industry: 'construction',
      services: ['Commercial Building', 'Residential Construction'],
      location: {
        city: 'Test City',
        state: 'TC',
        country: 'Test Country'
      }
    },
    contact: {
      phone: '(11) 99999-9999',
      email: 'test@example.com'
    }
  },
  design: {
    colors: {
      primary: '#16a34a',
      secondary: '#0f766e',
      accent: '#dc2626'
    },
    typography: {
      primaryFont: 'Poppins',
      secondaryFont: 'Open Sans'
    }
  }
};

/**
 * Healthcare industry test blueprint
 */
export const healthcareBlueprint = {
  industry: 'healthcare',
  preset: 'medical-professional',
  client_profile: {
    company: {
      name: 'Test Health Clinic',
      industry: 'healthcare',
      services: ['Family Medicine', 'Pediatrics'],
      location: {
        city: 'Test City',
        state: 'TC',
        country: 'Test Country'
      }
    },
    contact: {
      phone: '(11) 99999-9999',
      email: 'test@healthclinic.com'
    }
  },
  design: {
    colors: {
      primary: '#0ea5e9',
      secondary: '#8b5cf6',
      accent: '#10b981'
    },
    typography: {
      primaryFont: 'Inter',
      secondaryFont: 'Roboto'
    }
  }
};

/**
 * Get a temporary output directory for tests
 */
import { mkdtemp } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';

export async function getTempDir() {
  return await mkdtemp(path.join(tmpdir(), 'wpf-test-'));
}

/**
 * Clean up temporary directory
 */
import { rm } from 'fs/promises';

export async function cleanupTempDir(dir) {
  try {
    await rm(dir, { recursive: true, force: true });
  } catch (error) {
    // Ignore cleanup errors
  }
}

/**
 * Check if a file exists
 */
import { access } from 'fs/promises';

export async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Verify ZIP file structure
 */
import { readFile } from 'fs/promises';

export async function verifyZipStructure(zipPath) {
  // Simple verification: check file exists and size > 0
  try {
    const stats = await import('fs/promises').then(fs => fs.stat(zipPath));
    return stats.size > 0;
  } catch {
    return false;
  }
}
