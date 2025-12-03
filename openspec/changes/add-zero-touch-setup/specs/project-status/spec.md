# Project Status Capability

## ADDED Requirements

### Requirement: Project Status Display

The system SHALL provide a `wpf status` command that displays the current completion state of a project.

#### Scenario: Display all status checks
- **WHEN** user runs `wpf status` in a project directory
- **THEN** system displays status for each milestone:
  - Project created
  - Docker running
  - WordPress installed
  - Theme activated
  - Plugins installed
  - Pages created
  - Menu created
  - Tailwind built
  - Deployed to staging
  - Deployed to production
- **AND** completed items show checkmark (✓)
- **AND** incomplete items show circle (○)

#### Scenario: Show next action
- **WHEN** user runs `wpf status`
- **THEN** system displays recommended next action based on incomplete items
- **AND** shows the command to run for next step

#### Scenario: Not in project directory
- **WHEN** user runs `wpf status` outside a project directory
- **THEN** error message is displayed
- **AND** user is prompted to navigate to project or use `wpf continue <name>`

### Requirement: Status Check Accuracy

The system SHALL accurately detect the state of each project component.

#### Scenario: Docker status check
- **WHEN** status checks Docker state
- **THEN** returns true if WordPress and MySQL containers are running
- **AND** returns false otherwise

#### Scenario: WordPress installation check
- **WHEN** status checks WordPress state
- **THEN** returns true if `wp core is-installed` succeeds
- **AND** returns false otherwise

#### Scenario: Theme activation check
- **WHEN** status checks theme state
- **THEN** returns true if project theme is active
- **AND** returns false if default or other theme is active

#### Scenario: Plugin installation check
- **WHEN** status checks plugins state
- **THEN** returns true if all essential plugins are active
- **AND** returns false if any essential plugin is missing or inactive

#### Scenario: Pages check
- **WHEN** status checks pages state
- **THEN** returns true if Home, About, Services, Contact pages exist
- **AND** returns false if any required page is missing

#### Scenario: Menu check
- **WHEN** status checks menu state
- **THEN** returns true if primary menu exists and is assigned
- **AND** returns false otherwise

#### Scenario: Tailwind check
- **WHEN** status checks Tailwind state
- **THEN** returns true if compiled CSS exists in theme
- **AND** returns false if CSS is missing or outdated

#### Scenario: Deployment check
- **WHEN** status checks deployment state
- **THEN** returns staging:true if STAGING_URL responds with 200
- **AND** returns production:true if DOMAIN responds with 200
