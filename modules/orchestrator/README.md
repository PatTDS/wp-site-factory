# WPF Orchestrator Module

**Branch:** `feature/phase1-mvp`
**Version:** 0.1.0
**Status:** Phase 1 Discovery - Complete MVP

## Overview

The Orchestrator module powers the AI-driven Discovery Phase of WPF (WordPress Site Factory). It provides a complete end-to-end pipeline from client intake to production-ready blueprint.

### Features

- **Intake Validation** - Zod schema validation with detailed error messages
- **Industry Research** - Best practices for website sections (cached knowledge base)
- **Competitor Analysis** - Research competitor websites and patterns
- **Blueprint Generation** - AI-generated content drafts and structure recommendations
- **Operator Review** - Automated quality checks with scoring
- **Token Tracking** - Monitor LLM API usage and costs per operation
- **Export Formats** - JSON (machine) and Markdown (client review)

## Quick Start

```bash
# From project root
cd modules/orchestrator
npm install

# Create .env with your API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
echo "ANTHROPIC_MODEL=claude-opus-4-5-20251101" >> .env

# Run full Phase 1 pipeline
node src/cli/blueprint.js generate examples/client-intake-anywhere-solutions.json examples/

# Run auto review
node src/cli/review.js auto examples/blueprint-v1.0.json

# View results
node src/cli/blueprint.js view examples/blueprint-v1.0.json

# Export for client
node src/cli/blueprint.js export examples/blueprint-v1.0.json markdown
```

## Phase 1 Pipeline

```
┌─────────────┐    ┌────────────┐    ┌───────────┐    ┌─────────┐    ┌────────┐
│   Intake    │───►│  Validate  │───►│  Research │───►│Blueprint│───►│ Review │
│   (JSON)    │    │   (Zod)    │    │  (Cache)  │    │  (LLM)  │    │ (Auto) │
└─────────────┘    └────────────┘    └───────────┘    └─────────┘    └────────┘
                                                                          │
                                                                          ▼
                                                                    ┌──────────┐
                                                                    │  Export  │
                                                                    │(MD/JSON) │
                                                                    └──────────┘
```

### Pipeline Stages

| Stage | Input | Output | Cost |
|-------|-------|--------|------|
| Validate | `client-intake.json` | Validation result | $0 |
| Research | Client data | `research-summary.json` | $0 (cached) |
| Blueprint | Research + Client | `blueprint-v1.0.json` | ~$0.03 |
| Review | Blueprint | Score + recommendations | $0 |
| Export | Blueprint | `blueprint-v1.0.md` | $0 |

**Total Cost:** ~$0.03/project with Claude Opus 4.5

## CLI Commands

### Blueprint Command

```bash
node src/cli/blueprint.js <command> [options]

Commands:
  generate <intake> [output-dir]   Generate blueprint from client intake
  view <blueprint>                 Display blueprint contents
  export <blueprint> [format]      Export blueprint (json, markdown)

Options:
  --skip-research                  Skip research, use existing
  --help, -h                       Show help
```

### Review Command

```bash
node src/cli/review.js <command> [options]

Commands:
  auto <blueprint>                 Run automated review checks
  start <blueprint>                Start interactive manual review
  status <review-file>             Show review status
  report <review-file>             Generate review report

Options:
  --operator <name>                Reviewer name
  --output <dir>                   Output directory
```

### Research Command

```bash
node src/cli/research.js <intake> [options]

Options:
  --output <file>                  Output file path
  --force                          Force fresh research (ignore cache)
```

## File Formats

### Client Intake JSON

Complete schema at `src/lib/validator.js`. Required fields:

```json
{
  "company": {
    "name": "Company Name",
    "tagline": "Optional tagline",
    "years_in_business": 5
  },
  "contact": {
    "phone": "0400 000 000",
    "email": "contact@example.com"
  },
  "industry": {
    "category": "construction",
    "service_area": "Sydney, NSW"
  },
  "services": [
    {
      "name": "Service Name",
      "description": "What this service does",
      "is_primary": true
    }
  ]
}
```

### Blueprint Output JSON

```json
{
  "version": "1.0",
  "created_at": "2025-12-04T22:41:35.313Z",
  "status": "draft",
  "client_profile": { ... },
  "research_summary": { ... },
  "content_drafts": {
    "hero": {
      "headline": "AI-generated headline",
      "subheadline": "AI-generated subheadline",
      "cta_primary": { "text": "CTA Text", "action": "quote" }
    },
    "about_us": {
      "headline": "...",
      "story": "Multi-paragraph company story",
      "values": [...],
      "credentials": [...]
    },
    "services": {
      "headline": "...",
      "intro": "...",
      "services": [
        {
          "name": "Service Name",
          "description": "AI-enhanced description",
          "features": ["Feature 1", "Feature 2", "Feature 3"],
          "cta": "Get Quote"
        }
      ]
    },
    "contact": { ... },
    "testimonials": { ... }
  },
  "structure_recommendation": {
    "pages": [...],
    "navigation": { ... },
    "recommendations": [...]
  }
}
```

## Directory Structure

```
modules/orchestrator/
├── src/
│   ├── cli/
│   │   ├── blueprint.js      # Blueprint generation CLI
│   │   ├── research.js       # Research CLI
│   │   └── review.js         # Operator review CLI
│   ├── lib/
│   │   ├── blueprint.js      # Blueprint generator
│   │   ├── claude.js         # Anthropic API client
│   │   ├── research.js       # Research engine
│   │   ├── validator.js      # Zod schema validation
│   │   ├── operator-review.js # Review logic
│   │   ├── token-tracker.js  # Cost tracking
│   │   ├── logger.js         # Logging utility
│   │   ├── spinner.js        # CLI spinners
│   │   └── search-providers.js # Web search abstraction
│   └── index.js              # Module exports
├── examples/
│   ├── client-intake-anywhere-solutions.json
│   ├── blueprint-v1.0.json
│   ├── blueprint-v1.0.md
│   └── research-summary.json
├── tests/
│   └── validator.test.js
├── .env.example
├── package.json
├── README.md
└── RULES.md
```

## Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-api03-...

# Optional (defaults shown)
ANTHROPIC_MODEL=claude-opus-4-5-20251101
```

## LLM Model Selection

Tested and recommended models for Phase 1:

| Model | Quality | Cost/Project | Speed |
|-------|---------|--------------|-------|
| Claude Opus 4.5 | Excellent | ~$0.03 | Slower |
| Claude Sonnet 4 | Good | ~$0.01 | Fast |

The system includes fallback templates for when API calls fail.

## Knowledge Base

Research is cached to avoid repeated API calls:

```
knowledge/
├── best-practices/
│   └── sections/
│       ├── hero/by-industry/construction.md
│       ├── about-us/by-industry/construction.md
│       ├── services/by-industry/construction.md
│       ├── testimonials/by-industry/construction.md
│       └── contact/by-industry/construction.md
└── industry-research/
    └── construction/
        └── competitors.md
```

## Token Tracking

All operations are logged with costs:

```json
{
  "project": "anywhere-solutions",
  "session_totals": {
    "input_tokens": 388,
    "output_tokens": 2953,
    "total_tokens": 3341,
    "total_cost_usd": 0.0282,
    "operation_count": 1
  }
}
```

## Auto Review Checks

The auto review validates:

- Hero headline exists
- Subheadline exists
- Primary CTA defined
- Services defined (count)
- Phone number defined
- Email defined
- Pages recommended (count)

Score: 100% = Ready for Client

## Fallback System

When LLM calls fail, the system uses intelligent fallbacks:

- **Hero**: Template with years_in_business and service_area
- **About**: Builds story from mission/vision data
- **Services**: Extracts features from descriptions or generates defaults

## Testing

```bash
npm test                    # Run all tests
npm test -- validator       # Run specific test
```

## Dependencies

```json
{
  "@anthropic-ai/sdk": "^0.71.1",
  "dotenv": "^17.2.3",
  "ora": "^9.0.0",
  "zod": "^3.25.76"
}
```

## Phase 1 Checklist

- [x] Client intake validation (Zod)
- [x] Discovery research (5 sections)
- [x] Knowledge base caching
- [x] Blueprint generation (LLM)
- [x] Fallback templates
- [x] Token tracking
- [x] Auto review (100% scoring)
- [x] Markdown export
- [x] CLI interface

## Next Steps (Phase 2)

- [ ] Design Draft module
- [ ] Component selection from blueprint
- [ ] WordPress theme generation
- [ ] SaaS API endpoints

## Related Modules

- **tools** - CLI framework integration
- **webdesign** - Design tokens and components
- **platform** - SaaS dashboard (Phase 3)
