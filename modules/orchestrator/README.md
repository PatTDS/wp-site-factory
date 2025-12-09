# WPF Orchestrator Module

**Branch:** `002-phase2-design-draft`
**Version:** 0.3.0
**Status:** Phase 2 Design Draft - HTML Preview MVP

## Overview

The Orchestrator module powers WPF (WordPress Site Factory), providing a complete end-to-end pipeline from client intake to production-ready WordPress themes.

### Phase 1: Discovery (Complete)
- **Intake Validation** - Zod schema validation with detailed error messages
- **Industry Research** - Best practices for website sections (cached knowledge base)
- **Competitor Analysis** - Research competitor websites and patterns
- **Blueprint Generation** - AI-generated content drafts and structure recommendations
- **Operator Review** - Automated quality checks with scoring
- **Token Tracking** - Monitor LLM API usage and costs per operation
- **Export Formats** - JSON (machine) and Markdown (client review)

### Phase 2: Design Draft (Complete)
- **Pattern Library** - Pre-built WordPress Block Patterns per industry
- **Design Tokens** - Auto-generated theme.json and tailwind.config.js
- **Template Selection** - AI-powered template recommendation based on blueprint analysis
- **Content Injection** - Maps blueprint data to pattern content slots
- **Theme Assembly** - Generates complete WordPress hybrid theme files
- **HTML Preview** - Standalone HTML preview with Tailwind CDN for fast iteration
- **Stock Photos** - Unsplash/Pexels integration for realistic previews
- **Research-Based Design** - Industry-specific fonts, animations, and micro-interactions (NEW)

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

# Phase 2: Generate theme from blueprint
node src/commands/design.js examples/blueprint-anywhere-solutions.json

# Output includes:
# - WordPress theme files (patterns/*.php, theme.json, etc.)
# - HTML preview (index.html) - open directly in browser

# Preview template selection without generating
node src/commands/design.js preview examples/blueprint-anywhere-solutions.json

# Generate design tokens only
node src/commands/design.js tokens examples/blueprint-anywhere-solutions.json

# List available presets and patterns
node src/commands/design.js list-presets
node src/commands/design.js list-patterns
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

## Phase 2 Pipeline

```
┌───────────┐    ┌──────────┐    ┌─────────┐    ┌─────────┐    ┌──────────┐
│ Blueprint │───►│ Template │───►│ Content │───►│  Theme  │───►│  Output  │
│  (JSON)   │    │ Selector │    │Injector │    │Assembler│    │ (Files)  │
└───────────┘    └──────────┘    └─────────┘    └─────────┘    └──────────┘
                      │                                              │
                      ▼                                              ▼
                ┌──────────┐                                  ┌───────────┐
                │  Design  │                                  │ theme.json│
                │  Tokens  │                                  │tailwind.js│
                └──────────┘                                  │patterns/*.│
                                                              └───────────┘
```

### Phase 2 Stages

| Stage | Input | Output | Cost |
|-------|-------|--------|------|
| Template Selection | Blueprint | Preset + patterns | $0 |
| Design Tokens | Blueprint colors/fonts | theme.json, tailwind.config | $0 |
| Content Injection | Blueprint + patterns | Populated patterns | $0 |
| Theme Assembly | All above | Complete theme folder | $0 |

**Phase 2 Cost:** $0 (no LLM calls, template-based)

### Generated Files

- `index.html` - **Standalone HTML preview** (open in browser, no WordPress needed)
- `theme.json` - WordPress block editor configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `css/variables.css` - CSS custom properties
- `patterns/*.php` - WordPress Block Patterns
- `assembly-report.json` - Generation metadata

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

### Design Command (Phase 2)

```bash
node src/commands/design.js <command> [options]

Commands:
  generate <blueprint> [output-dir]  Generate complete WordPress theme
  preview <blueprint>                Preview template selection without generating
  compare <blueprint>                Compare A/B/C template options
  tokens <blueprint>                 Generate design tokens only
  list-presets                       List available template presets
  list-patterns                      List all available patterns

Options:
  --preset <id>                      Force specific preset (skip AI selection)
  --output <dir>                     Output directory (default: output/)
  --help, -h                         Show help
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
│   ├── cli/                        # Phase 1 CLI commands
│   │   ├── blueprint.js            # Blueprint generation CLI
│   │   ├── research.js             # Research CLI
│   │   └── review.js               # Operator review CLI
│   ├── commands/                   # Phase 2 CLI commands
│   │   └── design.js               # Design/theme generation CLI
│   ├── lib/
│   │   ├── blueprint.js            # Blueprint generator
│   │   ├── claude.js               # Anthropic API client
│   │   ├── research.js             # Research engine
│   │   ├── validator.js            # Zod schema validation
│   │   ├── operator-review.js      # Review logic
│   │   ├── token-tracker.js        # Cost tracking
│   │   ├── logger.js               # Logging utility
│   │   ├── spinner.js              # CLI spinners
│   │   ├── search-providers.js     # Web search abstraction
│   │   └── phase2/                 # Phase 2 modules
│   │       ├── pattern-schema.js   # Zod schemas for patterns
│   │       ├── pattern-loader.js   # Load manifests & templates
│   │       ├── design-tokens.js    # Generate theme.json/tailwind
│   │       ├── template-selector.js # AI template recommendation
│   │       ├── content-injector.js # Map blueprint to patterns
│   │       ├── theme-assembler.js  # Full theme generation
│   │       └── index.js            # Phase 2 exports
│   └── index.js                    # Module exports
├── templates/                      # Pattern templates
│   └── construction/               # Industry: Construction
│       └── industrial-modern/      # Preset: Industrial Modern
│           ├── preset.json         # Preset configuration
│           └── patterns/           # Pattern definitions
│               ├── hero/hero-split/
│               ├── services/services-grid/
│               ├── about/about-split/
│               ├── contact/contact-split/
│               └── testimonials/testimonials-cards/
├── examples/
│   ├── client-intake-anywhere-solutions.json
│   ├── blueprint-anywhere-solutions.json  # Phase 1 output
│   ├── blueprint-v1.0.json
│   ├── blueprint-v1.0.md
│   └── research-summary.json
├── output/                         # Generated themes (gitignored)
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

## Phase 2 Checklist

- [x] Pattern manifest schema (Zod)
- [x] Pattern loader (manifests + templates)
- [x] Design token generator (theme.json, tailwind.config)
- [x] Template selector (AI recommendation)
- [x] Content injector (blueprint → patterns)
- [x] Theme assembler (full pipeline)
- [x] Construction industry patterns (5 sections)
- [x] Industrial-modern preset
- [x] CLI interface (design.js)
- [x] HTML preview generation (Tailwind CDN)
- [x] Stock photo integration (Unsplash/Pexels)
- [x] Research-based design system (fonts, animations, micro-interactions)
- [ ] AI-generated testimonials from partner data
- [ ] Responsive image srcset generation
- [ ] Placeholder toggle for sample content

## Research-Based Design System

The HTML preview generator implements best practices from Claude Code web design research to avoid generic "AI slop" aesthetics.

### Industry-Specific Font Pairings

Instead of generic fonts (Inter, Roboto, Arial), the system selects distinctive fonts per industry:

| Industry | Display Font | Body Font | Aesthetic |
|----------|-------------|-----------|-----------|
| Construction | DM Sans | Source Sans 3 | Industrial |
| Professional | Playfair Display | Lato | Editorial |
| Restaurant | Cormorant Garamond | Nunito | Elegant |
| Healthcare | Poppins | Open Sans | Clean |
| Technology | Space Grotesk | IBM Plex Sans | Modern |
| Retail | Outfit | Work Sans | Contemporary |
| Creative | Sora | Plus Jakarta Sans | Bold |
| Default | Bricolage Grotesque | Instrument Sans | Distinctive |

### CSS Animations

- **Staggered reveals** - Elements animate in sequence (delay-100 through delay-800)
- **Slide animations** - slideInLeft/slideInRight for asymmetric layouts
- **Card hover effects** - Transform + shadow micro-interactions
- **Button interactions** - Lift effect with colored shadows

### Background Treatments

- **Gradient backgrounds** - Subtle gradients for depth (not flat colors)
- **Decorative elements** - Blurred shapes, patterns, quote marks
- **Visual hierarchy** - Dominant colors with sharp accents

### Section Enhancements

| Section | Enhancements |
|---------|-------------|
| Hero | Background pattern, staggered content reveals |
| Services | Gradient background, animated cards with stagger |
| About | Slide-in animations, decorative gradient |
| Testimonials | Decorative quote marks, card-hover effects |
| Contact | Slide-in form/info, blurred decorative shapes |
| Footer | Gradient background, subtle top border accent |

### Reference

Based on research in:
- `wordpress-knowledge-base/tools/ref-claude-code-web-design-best-practices.md`
- `wordpress-knowledge-base/tools/howto-claude-code-web-design-implementation.md`

## Anti-Pattern Validation

The orchestrator now includes anti-pattern validation to prevent generic "AI slop" aesthetics:

```javascript
import { validateDesign, autoFixDesign, getRecommendedFonts } from './src/lib/phase2/anti-pattern-validator.js';

// Validate design choices
const validation = await validateDesign({
  typography: { headings: 'Inter', body: 'Roboto' },
  colors: { primary: '#0F2942', secondary: '#4DA6FF' },
  industry: 'construction'
});

// Auto-fix banned patterns
const { fixed, changes } = await autoFixDesign(input);
```

**Banned Fonts:** Inter, Roboto, Arial, Helvetica, Open Sans, Montserrat

**Banned Color Patterns:** Purple-pink gradients, neon colors

## Shared Pattern Library

New cross-industry patterns available in `templates/shared/`:

| Pattern | Category | Best For | Features |
|---------|----------|----------|----------|
| hero-centered | hero | SaaS, Technology | Gradient text, trust logos, decorative BG |
| hero-fullscreen | hero | Hospitality, Portfolio | Full-bleed image, overlays, scroll indicator |
| pricing-grid | pricing | SaaS, Consulting | 3-tier cards, featured highlight |

## Design Tokens

Located in `tokens/`:

- **variants.json** - Standardized sizes, button styles, badge styles, card styles
- **anti-patterns.json** - Rules for font/color/layout validation

## Next Steps (Phase 2B - Realistic Preview)

See `docs/SPEC-realistic-preview-content.md` for full specification.

**Priority Tasks:**
1. Stock photo integration (Unsplash API)
2. AI-generated testimonials from partner data
3. Stats generation (client input or AI estimates)
4. Responsive srcset generation
5. Placeholder toggle UI

## Phase 3 (Future)

- [ ] Additional industries (healthcare, retail, professional services)
- [ ] Additional presets per industry
- [ ] WordPress theme refinement (functions.php, style.css)
- [ ] SaaS API endpoints

## Related Modules

- **tools** - CLI framework integration
- **webdesign** - Design tokens and components
- **platform** - SaaS dashboard (Phase 3)
