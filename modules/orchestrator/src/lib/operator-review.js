/**
 * Operator Review Module
 * Quality checkpoint before client delivery
 */

import fs from 'fs/promises';
import path from 'path';

// Review checklist items
const REVIEW_CHECKLIST = {
  content_quality: {
    title: 'Content Quality',
    items: [
      { id: 'headline_compelling', label: 'Hero headline is compelling and clear', weight: 10 },
      { id: 'subheadline_supports', label: 'Subheadline supports the main message', weight: 5 },
      { id: 'services_complete', label: 'All services have descriptions', weight: 10 },
      { id: 'ctas_clear', label: 'CTAs are clear and actionable', weight: 10 },
      { id: 'about_authentic', label: 'About section tells authentic story', weight: 5 },
      { id: 'contact_complete', label: 'Contact info is complete and accurate', weight: 10 },
    ],
  },
  brand_alignment: {
    title: 'Brand Alignment',
    items: [
      { id: 'tone_consistent', label: 'Tone matches client brand voice', weight: 10 },
      { id: 'terminology_industry', label: 'Industry terminology is correct', weight: 5 },
      { id: 'usp_highlighted', label: 'Unique selling points are highlighted', weight: 10 },
      { id: 'values_reflected', label: 'Company values are reflected', weight: 5 },
    ],
  },
  technical_accuracy: {
    title: 'Technical Accuracy',
    items: [
      { id: 'services_accurate', label: 'Service descriptions are accurate', weight: 10 },
      { id: 'contact_verified', label: 'Contact details verified', weight: 10 },
      { id: 'service_area_correct', label: 'Service area is correct', weight: 5 },
      { id: 'hours_accurate', label: 'Business hours are accurate', weight: 5 },
    ],
  },
  structure: {
    title: 'Structure & Navigation',
    items: [
      { id: 'pages_logical', label: 'Page structure is logical', weight: 5 },
      { id: 'nav_intuitive', label: 'Navigation is intuitive', weight: 5 },
      { id: 'content_flow', label: 'Content flow makes sense', weight: 5 },
    ],
  },
};

/**
 * Create a new review for a blueprint
 * @param {object} blueprint - Blueprint to review
 * @param {string} operatorName - Name of reviewer
 * @returns {object} Review object
 */
export function createReview(blueprint, operatorName = 'Unknown') {
  const review = {
    id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    blueprint_id: blueprint.id || 'unknown',
    blueprint_version: blueprint.version || '1.0',
    project: blueprint.client_profile?.company?.slug || 'unknown',
    operator: operatorName,
    created_at: new Date().toISOString(),
    status: 'pending', // pending, in_progress, approved, needs_revision
    checklist: initializeChecklist(),
    comments: [],
    overall_score: 0,
    decision: null, // approve, revise
    decision_notes: '',
  };

  return review;
}

/**
 * Initialize checklist with all items unchecked
 */
function initializeChecklist() {
  const checklist = {};

  for (const [category, data] of Object.entries(REVIEW_CHECKLIST)) {
    checklist[category] = {
      title: data.title,
      items: data.items.map(item => ({
        ...item,
        checked: false,
        note: '',
      })),
    };
  }

  return checklist;
}

/**
 * Update a checklist item
 * @param {object} review - Review object
 * @param {string} category - Category key
 * @param {string} itemId - Item ID
 * @param {boolean} checked - Whether item is checked
 * @param {string} note - Optional note
 */
export function updateChecklistItem(review, category, itemId, checked, note = '') {
  const categoryData = review.checklist[category];
  if (!categoryData) {
    throw new Error(`Unknown category: ${category}`);
  }

  const item = categoryData.items.find(i => i.id === itemId);
  if (!item) {
    throw new Error(`Unknown item: ${itemId}`);
  }

  item.checked = checked;
  if (note) {
    item.note = note;
  }

  // Recalculate score
  review.overall_score = calculateScore(review);
  review.status = 'in_progress';
}

/**
 * Add a comment to the review
 * @param {object} review - Review object
 * @param {string} section - Section the comment refers to
 * @param {string} comment - Comment text
 * @param {string} severity - info, suggestion, issue, critical
 */
export function addComment(review, section, comment, severity = 'info') {
  review.comments.push({
    id: `comment-${Date.now()}`,
    section,
    comment,
    severity,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Calculate overall score based on checked items
 * @param {object} review - Review object
 * @returns {number} Score 0-100
 */
function calculateScore(review) {
  let totalWeight = 0;
  let earnedWeight = 0;

  for (const categoryData of Object.values(review.checklist)) {
    for (const item of categoryData.items) {
      totalWeight += item.weight;
      if (item.checked) {
        earnedWeight += item.weight;
      }
    }
  }

  return totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
}

/**
 * Make a decision on the review
 * @param {object} review - Review object
 * @param {string} decision - approve or revise
 * @param {string} notes - Decision notes
 */
export function makeDecision(review, decision, notes = '') {
  if (!['approve', 'revise'].includes(decision)) {
    throw new Error('Decision must be "approve" or "revise"');
  }

  review.decision = decision;
  review.decision_notes = notes;
  review.status = decision === 'approve' ? 'approved' : 'needs_revision';
  review.decided_at = new Date().toISOString();
}

/**
 * Generate review report
 * @param {object} review - Review object
 * @returns {string} Markdown report
 */
export function generateReport(review) {
  let report = `# Operator Review Report

**Project:** ${review.project}
**Blueprint Version:** ${review.blueprint_version}
**Reviewer:** ${review.operator}
**Date:** ${review.created_at}
**Status:** ${review.status.toUpperCase()}
**Overall Score:** ${review.overall_score}%

---

## Checklist Results

`;

  for (const [category, data] of Object.entries(review.checklist)) {
    const checkedCount = data.items.filter(i => i.checked).length;
    const totalCount = data.items.length;

    report += `### ${data.title} (${checkedCount}/${totalCount})

`;

    for (const item of data.items) {
      const status = item.checked ? '[x]' : '[ ]';
      report += `- ${status} ${item.label}`;
      if (item.note) {
        report += ` - *${item.note}*`;
      }
      report += '\n';
    }

    report += '\n';
  }

  if (review.comments.length > 0) {
    report += `---

## Comments

`;
    for (const comment of review.comments) {
      const severityIcon = {
        info: 'ℹ️',
        suggestion: '💡',
        issue: '⚠️',
        critical: '🚨',
      }[comment.severity] || '';

      report += `${severityIcon} **${comment.section}**: ${comment.comment}\n\n`;
    }
  }

  if (review.decision) {
    report += `---

## Decision

**Decision:** ${review.decision.toUpperCase()}

${review.decision_notes || 'No additional notes.'}
`;
  }

  return report;
}

/**
 * Save review to file
 * @param {object} review - Review object
 * @param {string} outputDir - Output directory
 * @returns {string} Saved file path
 */
export async function saveReview(review, outputDir) {
  await fs.mkdir(outputDir, { recursive: true });

  const filename = `review-${review.project}-${review.blueprint_version.replace(/\./g, '-')}.json`;
  const filePath = path.join(outputDir, filename);

  await fs.writeFile(filePath, JSON.stringify(review, null, 2), 'utf-8');

  return filePath;
}

/**
 * Load review from file
 * @param {string} filePath - Path to review file
 * @returns {object} Review object
 */
export async function loadReview(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Auto-review a blueprint (basic automated checks)
 * @param {object} blueprint - Blueprint to review
 * @returns {object} Auto-review results
 */
export function autoReview(blueprint) {
  const results = {
    passed: [],
    warnings: [],
    errors: [],
  };

  // Check hero section
  if (blueprint.content_drafts?.hero) {
    const hero = blueprint.content_drafts.hero;
    if (hero.headline && hero.headline.length >= 5) {
      results.passed.push('Hero headline exists');
    } else {
      results.errors.push('Missing or too short hero headline');
    }

    if (hero.subheadline) {
      results.passed.push('Subheadline exists');
    } else {
      results.warnings.push('No subheadline defined');
    }

    if (hero.cta_primary?.text) {
      results.passed.push('Primary CTA defined');
    } else {
      results.errors.push('Missing primary CTA');
    }
  } else {
    results.errors.push('Missing hero section');
  }

  // Check services
  if (blueprint.content_drafts?.services?.services?.length > 0) {
    results.passed.push(`${blueprint.content_drafts.services.services.length} services defined`);

    const emptyDescriptions = blueprint.content_drafts.services.services.filter(s => !s.description);
    if (emptyDescriptions.length > 0) {
      results.warnings.push(`${emptyDescriptions.length} services missing descriptions`);
    }
  } else {
    results.errors.push('No services defined');
  }

  // Check contact
  if (blueprint.content_drafts?.contact) {
    const contact = blueprint.content_drafts.contact;
    if (contact.phone?.number) {
      results.passed.push('Phone number defined');
    } else {
      results.errors.push('Missing phone number');
    }

    if (contact.email) {
      results.passed.push('Email defined');
    } else {
      results.warnings.push('No email address');
    }
  } else {
    results.errors.push('Missing contact section');
  }

  // Check structure
  if (blueprint.structure_recommendation?.pages?.length > 0) {
    results.passed.push(`${blueprint.structure_recommendation.pages.length} pages recommended`);
  } else {
    results.warnings.push('No page structure recommendations');
  }

  return {
    score: calculateAutoScore(results),
    results,
    recommendation: getRecommendation(results),
  };
}

/**
 * Calculate auto-review score
 */
function calculateAutoScore(results) {
  const passedPoints = results.passed.length * 10;
  const warningPenalty = results.warnings.length * 5;
  const errorPenalty = results.errors.length * 20;

  const score = Math.max(0, 100 - warningPenalty - errorPenalty);
  return Math.min(100, score + passedPoints / 2);
}

/**
 * Get recommendation based on results
 */
function getRecommendation(results) {
  if (results.errors.length > 2) {
    return 'needs_major_revision';
  } else if (results.errors.length > 0 || results.warnings.length > 3) {
    return 'needs_minor_revision';
  } else if (results.warnings.length > 0) {
    return 'ready_with_suggestions';
  }
  return 'ready_for_client';
}

export { REVIEW_CHECKLIST };

export default {
  createReview,
  updateChecklistItem,
  addComment,
  makeDecision,
  generateReport,
  saveReview,
  loadReview,
  autoReview,
  REVIEW_CHECKLIST,
};
