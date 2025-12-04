# Feature Specification: Design Draft Phase

**Feature Branch**: `002-design-draft`
**Created**: 2024-12-04
**Status**: Draft
**Input**: Phase 2 Design Draft: Assemble HTML preview from template library using approved blueprint. Apply brand colors, typography, and content. Generate visual draft for client review. Support revision cycles before Phase 3 development.

## Overview

The Design Draft Phase is the second of three phases in the WPF Automated Web Agency workflow. After the client approves their website blueprint in Phase 1, this phase transforms that blueprint into a visual HTML preview. Using pre-built templates from the design system, the system assembles a complete website draft with the client's brand colors, content, and structure - similar to a design mockup but functional.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Template Selection and Assembly (Priority: P1)

When a client's blueprint is approved, the system (operated by human with Claude Code) selects appropriate templates from the design library for each page and section. Templates are matched based on the blueprint's structure: hero sections, service grids, contact forms, footers, etc.

**Why this priority**: Template assembly is the core function of this phase. Without properly matched templates, no visual draft can be created.

**Independent Test**: Can be fully tested by providing an approved blueprint and verifying that appropriate templates are selected for each section, then assembled into a coherent HTML structure.

**Acceptance Scenarios**:

1. **Given** an approved blueprint with defined pages, **When** the operator initiates design draft, **Then** the system suggests matching templates for each page section from the design library.
2. **Given** a blueprint section type (e.g., "hero with image"), **When** template matching runs, **Then** the system presents 2-3 template options ranked by relevance.
3. **Given** selected templates for all sections, **When** assembly completes, **Then** the system outputs a complete HTML file structure with all pages connected.

---

### User Story 2 - Brand Application (Priority: P1)

The system applies the client's brand colors (from Phase 1) to all templates. This includes primary colors, secondary colors, text colors, and accent colors. Typography is configured based on industry standards or client preferences.

**Why this priority**: Brand colors make the draft feel personalized to the client. Equal priority with template assembly as both are essential for a meaningful preview.

**Independent Test**: Can be tested by providing brand colors and a template, then verifying all color tokens are correctly replaced throughout the HTML/CSS.

**Acceptance Scenarios**:

1. **Given** client brand colors (primary, secondary, accent), **When** brand application runs, **Then** all template color variables are replaced with client colors.
2. **Given** a template with default colors, **When** viewed after brand application, **Then** the visual appearance reflects the client's brand palette.
3. **Given** insufficient color information, **When** brand application runs, **Then** the system generates complementary colors based on the primary color.

---

### User Story 3 - Content Population (Priority: P2)

The system populates templates with actual content from the blueprint: company name, service descriptions, about text, contact information. Content outlines from Phase 1 are expanded into full draft copy using LLM.

**Why this priority**: Content transforms a template into a personalized draft. Depends on template assembly being complete first.

**Independent Test**: Can be tested by providing blueprint content outlines and verifying expanded content appears in correct template locations.

**Acceptance Scenarios**:

1. **Given** a blueprint with service descriptions, **When** content population runs, **Then** each service section contains relevant, expanded content.
2. **Given** company contact information, **When** content population runs, **Then** contact details appear in header, footer, and contact page locations.
3. **Given** content outlines from competitor research, **When** LLM expands content, **Then** generated text is unique, relevant, and professional.

---

### User Story 4 - Visual Preview Generation (Priority: P2)

The assembled, branded, content-populated draft is rendered as a viewable preview. The client can browse all pages, see responsive behavior, and evaluate the overall design before approving.

**Why this priority**: The preview is the deliverable clients review. Essential for approval workflow but depends on assembly and content.

**Independent Test**: Can be tested by generating a complete draft and verifying all pages render correctly in a browser with working navigation.

**Acceptance Scenarios**:

1. **Given** a complete draft with all pages, **When** the client accesses the preview, **Then** they can navigate between all pages using the menu.
2. **Given** a preview on desktop, **When** viewed on mobile viewport, **Then** the design responds appropriately (responsive behavior).
3. **Given** a preview URL, **When** the client shares it, **Then** others can view the draft without authentication (time-limited link).

---

### User Story 5 - Client Review and Approval (Priority: P3)

The client reviews the visual draft and can approve it, request specific changes, or provide general feedback. Approval advances to Phase 3 (WordPress Development). Revision requests trigger updates to the draft.

**Why this priority**: The approval gate determines whether to proceed to development. Depends on preview being available.

**Independent Test**: Can be tested by presenting a draft and verifying clients can submit approval, rejection, or specific change requests.

**Acceptance Scenarios**:

1. **Given** a client viewing their draft, **When** they click "Approve Design", **Then** the project advances to "Ready for Development" status.
2. **Given** a client requesting changes, **When** they specify "Change hero image" or "Adjust service section colors", **Then** the feedback is logged for revision.
3. **Given** revision feedback, **When** the operator updates the draft, **Then** the client sees a new preview version with changes applied.

---

### Edge Cases

- What happens if no suitable template exists for a blueprint section? Flag for human operator to create custom section or suggest alternative structure.
- How does system handle very long content that breaks template layouts? Content should be truncated with "read more" or template should expand gracefully.
- What happens if brand colors have poor contrast? System should warn about accessibility issues and suggest adjustments.
- How does system handle clients who request changes outside the blueprint scope? Log feedback but clarify that structural changes require returning to Phase 1.

## Requirements *(mandatory)*

### Functional Requirements

**Template Management:**
- **FR-001**: System MUST provide a library of pre-built HTML/CSS templates for common website sections (heroes, features, services, testimonials, contact, footer)
- **FR-002**: System MUST categorize templates by section type and industry suitability
- **FR-003**: System MUST support template selection based on blueprint section requirements
- **FR-004**: Operator MUST be able to preview templates before selection

**Brand Application:**
- **FR-005**: System MUST accept brand colors in hex format and apply them to CSS variables
- **FR-006**: System MUST generate a complete color palette from primary color if secondary/accent not provided
- **FR-007**: System MUST apply typography settings (font family, sizes, weights) consistently
- **FR-008**: System MUST warn if color combinations fail accessibility contrast requirements

**Content Population:**
- **FR-009**: System MUST map blueprint content to template content areas
- **FR-010**: System MUST expand content outlines into full draft copy using LLM
- **FR-011**: System MUST populate company information (name, address, phone, email) in appropriate locations
- **FR-012**: System MUST handle missing content gracefully with placeholder indicators

**Preview Generation:**
- **FR-013**: System MUST generate a browsable HTML preview with all pages linked
- **FR-014**: System MUST provide responsive preview (desktop, tablet, mobile viewports)
- **FR-015**: System MUST generate shareable preview URLs with optional time expiration
- **FR-016**: System MUST version previews so previous versions remain accessible

**Approval Workflow:**
- **FR-017**: System MUST provide approve/revise options for the design draft
- **FR-018**: System MUST capture specific, actionable feedback when revisions requested
- **FR-019**: System MUST support up to 3 revision cycles before escalating
- **FR-020**: System MUST advance project to Phase 3 upon client approval

### Key Entities

- **DesignDraft**: The visual preview output. Contains HTML files, applied brand settings, content, version number, and approval status.
- **Template**: A reusable HTML/CSS component. Has type (hero, features, etc.), industry tags, preview image, and content slots.
- **BrandSettings**: Client's visual identity. Contains color palette, typography choices, and logo reference.
- **ContentSlot**: A placeholder in a template. Defines location, content type expected, and character limits.
- **PreviewVersion**: A snapshot of the draft. Has version number, creation date, and client feedback received.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Design draft generation completes within 30 minutes of blueprint approval (operator time)
- **SC-002**: 90% of blueprint sections have at least 2 matching templates available
- **SC-003**: Brand colors are applied consistently across 100% of template elements
- **SC-004**: Preview pages load in under 3 seconds on standard connections
- **SC-005**: 75% of clients approve their design draft within 2 revision cycles
- **SC-006**: Client satisfaction with visual draft quality averages 4+ out of 5 stars
- **SC-007**: Time from blueprint approval to design approval averages under 48 hours

## Assumptions

- Operator (human with Claude Code) performs template selection and assembly
- Template library contains sufficient variety for common business website needs
- Client has approved blueprint with clear structure from Phase 1
- LLM can generate professional website copy from content outlines
- Preview hosting is available (local development server or cloud hosting)

## Dependencies

- **Phase 1 (Discovery)**: Requires approved blueprint with pages, sections, content outlines
- **Webdesign Module**: Provides template library and design tokens
- **Orchestrator Module**: Manages LLM calls for content expansion
- **Platform Module**: Hosts preview and provides approval interface

## Out of Scope

- WordPress development (Phase 3)
- Custom template creation (templates must exist in library)
- Animation or interactive elements beyond basic hover states
- E-commerce functionality
- Blog/news section templates (future enhancement)
