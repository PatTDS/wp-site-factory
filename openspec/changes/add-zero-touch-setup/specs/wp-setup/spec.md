# WordPress Setup Capability

## ADDED Requirements

### Requirement: Zero-Touch WordPress Installation

The system SHALL provide a `wpf setup` command that automatically installs and configures WordPress without manual intervention.

#### Scenario: Fresh WordPress installation
- **WHEN** user runs `wpf setup` in a project directory with Docker running
- **THEN** WordPress core is installed via WP-CLI
- **AND** admin account is created with generated secure password
- **AND** admin password is displayed once to user
- **AND** site title is set from COMPANY_NAME in config

#### Scenario: WordPress already installed
- **WHEN** user runs `wpf setup` and WordPress is already installed
- **THEN** system skips core installation
- **AND** continues with remaining setup steps
- **AND** displays message indicating WordPress was already installed

#### Scenario: Docker not running
- **WHEN** user runs `wpf setup` and Docker containers are not running
- **THEN** system starts Docker containers automatically
- **AND** waits for WordPress and MySQL to be ready
- **AND** proceeds with installation

### Requirement: Theme Activation

The system SHALL automatically activate the project theme during setup.

#### Scenario: Theme activation success
- **WHEN** setup runs and project theme exists
- **THEN** theme is activated via `wp theme activate ${PROJECT_NAME}-theme`
- **AND** success message is displayed

#### Scenario: Theme not found
- **WHEN** setup runs and project theme does not exist
- **THEN** warning is displayed
- **AND** setup continues with default theme

### Requirement: Essential Plugin Installation

The system SHALL install and activate essential plugins during setup.

#### Scenario: Plugin installation
- **WHEN** setup runs
- **THEN** the following plugins are installed and activated:
  - Rank Math SEO
  - Autoptimize
  - ShortPixel Image Optimizer
  - Contact Form 7
  - Redis Cache (if Redis available)
- **AND** progress is displayed for each plugin

#### Scenario: Plugin installation failure
- **WHEN** a plugin fails to install
- **THEN** warning is displayed with plugin name
- **AND** setup continues with remaining plugins
- **AND** failed plugins are listed in final summary

### Requirement: Starter Page Creation

The system SHALL create starter pages with placeholder content.

#### Scenario: Page creation
- **WHEN** setup runs
- **THEN** Home page is created and set as static front page
- **AND** About page is created with company placeholder content
- **AND** Services page is created with services placeholder content
- **AND** Contact page is created with Contact Form 7 shortcode

#### Scenario: Pages already exist
- **WHEN** setup runs and pages with same slugs exist
- **THEN** existing pages are not overwritten
- **AND** informational message is displayed

### Requirement: Navigation Menu Creation

The system SHALL create and configure the primary navigation menu.

#### Scenario: Menu creation
- **WHEN** setup runs and starter pages are created
- **THEN** primary menu is created with name "${COMPANY_NAME} Menu"
- **AND** menu contains links to Home, About, Services, Contact in order
- **AND** menu is assigned to 'primary' theme location

### Requirement: WordPress Configuration

The system SHALL configure WordPress settings based on project config.

#### Scenario: Permalink structure
- **WHEN** setup runs
- **THEN** permalink structure is set to `/%postname%/`
- **AND** rewrite rules are flushed

#### Scenario: Default content removal
- **WHEN** setup runs on fresh WordPress
- **THEN** "Hello World" post is deleted
- **AND** "Sample Page" is deleted
- **AND** default comment is deleted
