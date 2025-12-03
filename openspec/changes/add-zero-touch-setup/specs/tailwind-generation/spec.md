# Tailwind Configuration Generation Capability

## ADDED Requirements

### Requirement: Brand Color Palette Generation

The system SHALL generate a complete Tailwind CSS color palette from brand colors specified in project config.

#### Scenario: Generate primary color palette
- **WHEN** setup runs with PRIMARY_COLOR defined in .wpf-config
- **THEN** system generates color shades 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- **AND** shade 500 matches the PRIMARY_COLOR value
- **AND** lighter shades (50-400) are progressively lighter
- **AND** darker shades (600-950) are progressively darker

#### Scenario: Generate secondary color palette
- **WHEN** setup runs with SECONDARY_COLOR defined in .wpf-config
- **THEN** system generates complete secondary color palette
- **AND** follows same shade generation rules as primary

#### Scenario: Missing color configuration
- **WHEN** setup runs without PRIMARY_COLOR defined
- **THEN** system uses default color (#16a34a green)
- **AND** warning message is displayed

### Requirement: Tailwind Config File Generation

The system SHALL update the theme's tailwind.config.js with generated color palettes.

#### Scenario: Update existing tailwind.config.js
- **WHEN** setup runs and tailwind.config.js exists in theme directory
- **THEN** system updates the `colors` section in `theme.extend`
- **AND** preserves existing non-color configuration
- **AND** adds `primary` and `secondary` color objects

#### Scenario: Config file format
- **WHEN** tailwind.config.js is updated
- **THEN** colors are formatted as:
  ```javascript
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          // ... all shades
          950: '#052e16'
        },
        secondary: {
          // ... all shades
        }
      }
    }
  }
  ```
- **AND** file remains valid JavaScript

#### Scenario: Backup before modification
- **WHEN** setup modifies tailwind.config.js
- **THEN** original file is backed up to tailwind.config.js.backup
- **AND** backup can be restored if needed

### Requirement: Color Manipulation Algorithm

The system SHALL use a consistent algorithm for generating color shades.

#### Scenario: Shade generation accuracy
- **WHEN** generating shades from hex color
- **THEN** system converts to HSL color space
- **AND** adjusts lightness for each shade level
- **AND** maintains hue and saturation consistency
- **AND** returns valid hex color codes

#### Scenario: Shade lightness values
- **WHEN** generating shade scale
- **THEN** approximate lightness targets are:
  - 50: 97% lightness
  - 100: 94% lightness
  - 200: 86% lightness
  - 300: 77% lightness
  - 400: 66% lightness
  - 500: 55% lightness (base color adjusted to match)
  - 600: 45% lightness
  - 700: 37% lightness
  - 800: 27% lightness
  - 900: 20% lightness
  - 950: 10% lightness

### Requirement: CSS Build Integration

The system SHALL trigger Tailwind CSS build after config update.

#### Scenario: Automatic CSS rebuild
- **WHEN** tailwind.config.js is updated
- **THEN** system runs `npm run build` in theme directory
- **AND** waits for build completion
- **AND** verifies output CSS exists

#### Scenario: Build failure handling
- **WHEN** CSS build fails
- **THEN** error message is displayed with npm output
- **AND** original tailwind.config.js is restored from backup
- **AND** setup continues with warning
