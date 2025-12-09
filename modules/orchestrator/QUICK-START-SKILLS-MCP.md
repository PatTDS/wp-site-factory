# Quick Start: Skills & MCP

## TL;DR

Skills and MCP servers are now configured for Phase 2 orchestrator. Use slash commands and natural language to access tools.

## Installation (One-Time)

```bash
# 1. Install MCP dependencies
cd /home/atric/wp-site-factory/modules/orchestrator/mcp-servers
npm install

# 2. Configure API keys (optional - for stock photos)
cd ..
cp .env.example .env
# Edit .env and add UNSPLASH_API_KEY and PEXELS_API_KEY
```

## Usage

### Slash Commands

Available in Claude Code:

- `/validate-design` - Check for anti-patterns (banned fonts, colors, etc.)
- `/generate-pattern` - Create new WordPress block pattern
- `/export-theme` - Generate WordPress theme .zip
- `/wpf-preview-generate` - Create HTML preview of patterns

### MCP Tools

Access via natural language:

**Stock Photos:**
```
"Search for construction photos"
"Find healthcare images for hero section"
"Download that photo in large size"
```

**shadcn/ui Components:**
```
"Add a button component"
"Show me available card components"
```

**CSS Help:**
```
"What's the best way to center a div?"
"Analyze this CSS for performance"
```

## Skills Auto-Loading

Skills automatically activate when working on:
- Design system tasks → `wpf-design-system` skill
- Frontend code → `wpf-frontend` skill

## What Each Tool Does

### Skills (Background Knowledge)
- **wpf-design-system**: Pattern selection, anti-patterns, design tokens
- **wpf-frontend**: HTML/CSS best practices, component examples

### MCP Servers (Active Tools)
- **Stock Photos**: Search Unsplash + Pexels, download images, track attribution
- **shadcn/ui**: Browse and install UI components
- **CSS**: MDN docs, CSS analysis, pattern detection

## File Locations

```
.claude/
├── skills/
│   ├── wpf-design-system/SKILL.md
│   └── wpf-frontend/SKILL.md
└── commands/
    ├── validate-design.md
    ├── generate-pattern.md
    ├── export-theme.md
    └── wpf-preview-generate.md

.mcp.json (3 servers configured)

mcp-servers/
├── stock-photos.js (custom)
└── package.json
```

## Common Workflows

### Create New Pattern
```
User: "Create a hero section for construction company"
Assistant: [Uses wpf-design-system skill]
          [Validates against anti-patterns]
          [Generates pattern with /generate-pattern]
          [Creates preview with /wpf-preview-generate]
```

### Find Stock Photos
```
User: "Find professional office photos"
Assistant: [Uses stock-photos MCP]
          [Searches Unsplash + Pexels]
          [Returns 10 photos with attribution]

User: "Download the third one"
Assistant: [Downloads to cache]
          [Provides attribution HTML]
```

### Export Theme
```
User: "Export WordPress theme"
Assistant: [Uses /export-theme command]
          [Generates functions.php, style.css]
          [Creates block patterns]
          [Packages as .zip]
```

## Troubleshooting

**Skills not loading?**
- Check `.claude/skills/` directory exists
- Verify SKILL.md files have YAML frontmatter

**MCP server not responding?**
- Run `cd mcp-servers && npm install`
- Check Node.js version (>=18 required)

**Stock photos not working?**
- Add API keys to `.env` file
- Check rate limits (50/hr Unsplash, 200/hr Pexels)

## Documentation

- **Full Guide**: `SKILLS-MCP-SUMMARY.md`
- **Phase 2 Spec**: `specs/phase2-complete-implementation.md`
- **Skills**: `.claude/skills/*/SKILL.md`
- **Commands**: `.claude/commands/*.md`

## Status

✅ All systems operational
✅ Ready for production use
✅ Phase 2 (Category A & B) complete

---

**Version:** 1.0.0
**Last Updated:** 2025-12-09
**Maintenance:** Run `npm update` in mcp-servers/ monthly
