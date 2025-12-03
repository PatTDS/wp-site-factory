# Proposal: Add Zero-Touch WordPress Setup

## Why

Currently, after `wpf create`, users must manually:
1. Complete WordPress installation wizard in browser
2. Activate the project theme
3. Install and activate plugins
4. Create initial pages (Home, About, Services, Contact)
5. Set up navigation menus
6. Edit Tailwind config with brand colors

This manual process takes 15-30 minutes and introduces friction. Automating these steps will reduce site creation time from hours to minutes.

## What Changes

- **NEW: `wpf setup` command** - Zero-touch WordPress installation via WP-CLI in Docker
- **NEW: Auto plugin installation** - Install and activate essential plugins during setup
- **NEW: Auto page creation** - Create starter pages with placeholder content
- **NEW: Auto menu creation** - Create primary navigation with page links
- **NEW: Tailwind config generation** - Generate tailwind.config.js from brand colors in .wpf-config
- **NEW: `wpf status` command** - Show project completion progress

## Impact

- Affected specs: wp-setup (new), project-status (new), tailwind-generation (new)
- Affected code:
  - `cli/setup.sh` (new)
  - `cli/status.sh` (new)
  - `lib/tailwind.sh` (new)
  - `bin/wpf` (add new commands)
  - `cli/optimize.sh` (reuse wp_cli function)

## Dependencies

- Docker must be running
- WP-CLI available in WordPress container
- Node.js for Tailwind (existing requirement)

## Success Criteria

After running `wpf create <name> && wpf setup`:
- WordPress fully installed with admin account
- Theme activated
- Essential plugins installed and activated
- 4 starter pages created (Home, About, Services, Contact)
- Primary menu created with page links
- Tailwind config updated with brand colors
- `wpf status` shows all steps complete
