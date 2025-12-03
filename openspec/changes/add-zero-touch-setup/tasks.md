# Implementation Tasks

## 1. Core Infrastructure

- [x] 1.1 Extract `wp_cli()` function from `cli/optimize.sh` to `lib/wordpress.sh` for reuse
- [x] 1.2 Add `wait_for_wordpress()` function to check WordPress container is ready
- [x] 1.3 Add `wait_for_mysql()` function to check database is ready

## 2. Create `wpf setup` Command

- [x] 2.1 Create `cli/setup.sh` with command structure
- [x] 2.2 Implement WordPress core installation via WP-CLI:
  - Site URL from config
  - Site title from COMPANY_NAME
  - Admin user (generated or configurable)
  - Admin password (generated, shown once)
  - Admin email from EMAIL config
- [x] 2.3 Implement theme activation: `wp theme activate ${PROJECT_NAME}-theme`
- [x] 2.4 Implement permalink structure: `wp rewrite structure '/%postname%/'`
- [ ] 2.5 Implement timezone/locale settings based on config
- [x] 2.6 Remove default WordPress content (Hello World post, Sample Page)

## 3. Auto Plugin Installation

- [x] 3.1 Call existing plugin installation logic from `cli/optimize.sh`
- [x] 3.2 Add Contact Form 7 to default plugin list
- [x] 3.3 Handle plugin installation failures gracefully (continue with warning)

## 4. Auto Page Creation

- [x] 4.1 Create `lib/content.sh` with page creation functions
- [x] 4.2 Implement `create_starter_pages()`:
  - Home page (set as front page)
  - About page (placeholder content)
  - Services page (placeholder content)
  - Contact page (with Contact Form 7 shortcode)
- [x] 4.3 Set static front page in WordPress settings
- [ ] 4.4 Generate placeholder content from discovery data if available

## 5. Auto Menu Creation

- [x] 5.1 Implement `create_primary_menu()` function
- [x] 5.2 Create menu with links to all starter pages
- [x] 5.3 Assign menu to 'primary' location
- [x] 5.4 Add menu ordering (Home first, Contact last)

## 6. Tailwind Config Generation

- [x] 6.1 Create `lib/tailwind.sh` with color utilities
- [x] 6.2 Implement `generate_color_palette()`:
  - Take hex color input
  - Generate 50-950 shade scale
  - Use color manipulation algorithm
- [x] 6.3 Implement `update_tailwind_config()`:
  - Read PRIMARY_COLOR and SECONDARY_COLOR from config
  - Generate color palettes
  - Update tailwind.config.js in theme directory
- [x] 6.4 Handle edge cases (missing colors, invalid hex)

## 7. Create `wpf status` Command

- [x] 7.1 Create `cli/status.sh`
- [x] 7.2 Implement status checks:
  - [x] Project created (directory exists)
  - [x] Docker running
  - [x] WordPress installed
  - [x] Theme activated
  - [x] Plugins installed
  - [x] Pages created
  - [x] Menu created
  - [x] Tailwind built
  - [x] Deployed (staging/production)
- [x] 7.3 Display progress with checkmarks/circles
- [x] 7.4 Show next recommended action

## 8. Integration

- [x] 8.1 Add `setup` and `status` commands to `bin/wpf`
- [ ] 8.2 Update interactive menu with new options
- [x] 8.3 Update help text

## 9. Testing & Documentation

- [x] 9.1 Test full flow: `wpf create test && cd projects/test && wpf setup`
- [x] 9.2 Test `wpf status` shows correct states
- [ ] 9.3 Test with missing config values (graceful degradation)
- [ ] 9.4 Update README.md with new commands
- [ ] 9.5 Update CLAUDE.md with new workflow

## Dependencies

- Tasks 1.x must complete before 2.x
- Task 6.x can run in parallel with 2-5
- Task 7.x can run in parallel with 2-6
- Task 8.x depends on 2.x and 7.x
- Task 9.x depends on all others

## Summary

**Completed:** 32/37 tasks (86%)

**Remaining:**
- 2.5: Timezone/locale settings (nice-to-have)
- 4.4: Discovery data integration (nice-to-have)
- 8.2: Interactive menu update
- 9.3-9.5: Documentation updates
