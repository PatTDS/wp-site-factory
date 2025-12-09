# Tasks: WPF Orchestrator Phase 2 Complete

**Feature ID**: phase2-complete
**Generated**: 2025-12-09
**Status**: In Progress (Parallel Execution)

---

## Execution Status

| Agent | Status | Progress |
|-------|--------|----------|
| Agent 1 (Skills/MCP) | 🔄 Running | In Progress |
| Agent 2 (Header/Footer) | 🔄 Running | In Progress |
| Agent 3 (CTA/Features/etc) | 🔄 Running | In Progress |
| Agent 4 (Theme Export) | 🔄 Running | In Progress |

---

## Task Breakdown by Agent

### Agent 1: Skills & MCP Configuration

- [ ] **A1.1** Create directory `.claude/skills/wpf-design-system/`
- [ ] **A1.2** Write `SKILL.md` with design tokens, banned fonts, color system
- [ ] **A1.3** Create directory `.claude/skills/wpf-frontend/`
- [ ] **A1.4** Write `SKILL.md` with Tailwind patterns, accessibility, anti-patterns
- [ ] **A1.5** Create `.mcp.json` with shadcn-ui server config
- [ ] **A1.6** Create directory `.claude/commands/`
- [ ] **A1.7** Write `generate-pattern.md` command template
- [ ] **A1.8** Write `validate-design.md` command template
- [ ] **A1.9** Write `export-theme.md` command template

### Agent 2: Pattern Library A (Header & Footer)

- [ ] **A2.1** Create `templates/shared/patterns/header/` directory
- [ ] **A2.2** Write `header-simple/manifest.json`
- [ ] **A2.3** Write `header-simple/template.php`
- [ ] **A2.4** Write `header-mega/manifest.json`
- [ ] **A2.5** Write `header-mega/template.php`
- [ ] **A2.6** Create `templates/shared/patterns/footer/` directory
- [ ] **A2.7** Write `footer-simple/manifest.json`
- [ ] **A2.8** Write `footer-simple/template.php`
- [ ] **A2.9** Write `footer-detailed/manifest.json`
- [ ] **A2.10** Write `footer-detailed/template.php`

### Agent 3: Pattern Library B (CTA, Features, FAQ, Team, Gallery)

- [ ] **A3.1** Create `templates/shared/patterns/cta/` directory
- [ ] **A3.2** Write `cta-banner/manifest.json` + `template.php`
- [ ] **A3.3** Write `cta-split/manifest.json` + `template.php`
- [ ] **A3.4** Create `templates/shared/patterns/features/` directory
- [ ] **A3.5** Write `features-grid/manifest.json` + `template.php`
- [ ] **A3.6** Write `features-alternating/manifest.json` + `template.php`
- [ ] **A3.7** Create `templates/shared/patterns/faq/` directory
- [ ] **A3.8** Write `faq-accordion/manifest.json` + `template.php`
- [ ] **A3.9** Create `templates/shared/patterns/team/` directory
- [ ] **A3.10** Write `team-grid/manifest.json` + `template.php`
- [ ] **A3.11** Create `templates/shared/patterns/gallery/` directory
- [ ] **A3.12** Write `gallery-masonry/manifest.json` + `template.php`

### Agent 4: Theme Export System

- [ ] **A4.1** Create `templates/theme/` directory structure
- [ ] **A4.2** Write `functions.php.template`
- [ ] **A4.3** Write `style.css.template`
- [ ] **A4.4** Write `inc/block-patterns.php.template`
- [ ] **A4.5** Create `src/lib/phase2/theme-exporter.js`
- [ ] **A4.6** Update `src/lib/phase2/index.js` with exports

---

## Post-Agent Tasks (Sequential)

### Integration & Testing

- [ ] **P1** Run `list-patterns` to verify all patterns load
- [ ] **P2** Run design generate to test full pipeline
- [ ] **P3** Verify HTML preview includes header/footer
- [ ] **P4** Test theme export generates valid WordPress theme

### Git Operations

- [ ] **G1** Stage all new files
- [ ] **G2** Commit with descriptive message
- [ ] **G3** Push to branch

---

## Verification Commands

```bash
# Verify Skills created
ls -la .claude/skills/

# Verify MCP config
cat .mcp.json

# Count total patterns
find templates -name "manifest.json" | wc -l

# List all pattern categories
node src/commands/design.js list-patterns construction industrial-modern

# Test theme export (after Agent 4 completes)
node -e "import('./src/lib/phase2/theme-exporter.js').then(m => console.log('Theme exporter loaded:', Object.keys(m)))"
```

---

## Success Criteria

| Metric | Target | Current |
|--------|--------|---------|
| SKILL.md files | 2 | 0 |
| Claude commands | 3 | 0 |
| .mcp.json | 1 | 0 |
| Header patterns | 2 | 0 |
| Footer patterns | 2 | 0 |
| CTA patterns | 2 | 0 |
| Features patterns | 2 | 0 |
| FAQ patterns | 1 | 0 |
| Team patterns | 1 | 0 |
| Gallery patterns | 1 | 0 |
| Theme templates | 3 | 0 |
| Theme exporter | 1 | 0 |
| **Total Files** | **21** | **0** |

---

## Dependencies Completed

- [x] spec.md created
- [x] plan.md created
- [x] Parallel agents launched
- [ ] Agent 1 complete
- [ ] Agent 2 complete
- [ ] Agent 3 complete
- [ ] Agent 4 complete
- [ ] Integration testing
- [ ] Git commit
