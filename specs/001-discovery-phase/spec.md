# Feature Specification: Discovery Phase

**Feature Branch**: `001-discovery-phase`
**Created**: 2024-12-04
**Status**: Draft
**Input**: Phase 1 Discovery: Client intake form for company details, colors, industry and scope. LLM-powered competitor research and analysis. Automated website blueprint generation with pages, sections, and services structure. Client approval workflow before proceeding to design phase.

## Overview

The Discovery Phase is the first of three phases in the WPF Automated Web Agency workflow. It replaces the traditional agency-client consultation meeting with an automated, LLM-powered process that gathers client information, researches their industry competitors, and generates a comprehensive website blueprint for approval.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Client Submits Company Information (Priority: P1)

A new client accesses the WPF dashboard and fills out a comprehensive intake form with their company details. The form captures all essential information needed to create their website: company name, address, phone, email, industry, colors (from logo or preference), and scope of services/products offered.

**Why this priority**: This is the foundation of the entire system. Without client data, no website can be generated. This must work flawlessly before any other functionality matters.

**Independent Test**: Can be fully tested by submitting a complete form and verifying all data is captured and stored correctly. Delivers immediate value by digitizing the client intake process.

**Acceptance Scenarios**:

1. **Given** a new client on the dashboard, **When** they complete all required fields and submit the form, **Then** the system confirms receipt and displays a summary of submitted information.
2. **Given** a client filling the form, **When** they leave required fields empty and attempt to submit, **Then** the system highlights missing fields and prevents submission.
3. **Given** a client with a logo file, **When** they upload the logo, **Then** the system extracts dominant colors and suggests a color palette.

---

### User Story 2 - Competitor Research Generation (Priority: P2)

After client information is submitted, the system automatically researches competitors in the client's industry. The LLM searches for successful companies in the same sector, analyzes their websites, and extracts common patterns: service offerings, page structures, content themes, and unique selling propositions.

**Why this priority**: Competitor research differentiates WPF from simple website builders. This automation provides real agency value - understanding the market before designing.

**Independent Test**: Can be tested by providing an industry (e.g., "plumbing services in Sydney") and verifying the system returns relevant competitor analysis with actionable insights.

**Acceptance Scenarios**:

1. **Given** a submitted client profile with industry defined, **When** the research process completes, **Then** the system displays a list of 5-10 competitor companies with their key service offerings.
2. **Given** competitor research in progress, **When** the client views their dashboard, **Then** they see a progress indicator showing research status.
3. **Given** completed competitor research, **When** the client reviews results, **Then** they can see common services, page structures, and content patterns used by successful competitors.

---

### User Story 3 - Website Blueprint Generation (Priority: P2)

Based on client information and competitor research, the system generates a website blueprint. This blueprint defines the recommended page structure (Home, About, Services, Contact, etc.), section layouts for each page, suggested content themes, and service/product organization.

**Why this priority**: The blueprint is the deliverable of Phase 1 - the document that gets approved before design work begins. Equal priority with research as they work together.

**Independent Test**: Can be tested by providing client data and research results, then verifying a coherent blueprint is generated with all required sections.

**Acceptance Scenarios**:

1. **Given** completed client profile and competitor research, **When** blueprint generation runs, **Then** the system produces a structured document with recommended pages and sections.
2. **Given** a generated blueprint, **When** the client views it, **Then** they see a clear outline of their future website with page names, section purposes, and content suggestions.
3. **Given** a blueprint with service pages, **When** the client reviews services section, **Then** each service has a name, brief description, and suggested content points derived from competitor analysis.

---

### User Story 4 - Client Approval Workflow (Priority: P3)

The client reviews the generated blueprint and can approve it, request changes, or provide feedback. Approval advances the project to Phase 2 (Design Draft). Requested changes trigger a revision cycle where the LLM adjusts the blueprint based on feedback.

**Why this priority**: The approval gate is essential for the workflow but depends on all previous stories being complete. It's the checkpoint before significant design work begins.

**Independent Test**: Can be tested by presenting a blueprint to a client and verifying they can approve, reject, or request specific changes, and that the system responds appropriately.

**Acceptance Scenarios**:

1. **Given** a client reviewing their blueprint, **When** they click "Approve", **Then** the project status changes to "Ready for Design" and the client receives confirmation.
2. **Given** a client reviewing their blueprint, **When** they request changes with specific feedback, **Then** the system logs the feedback and triggers a revision process.
3. **Given** revision feedback submitted, **When** the LLM processes the feedback, **Then** an updated blueprint is generated addressing the client's concerns.

---

### Edge Cases

- What happens when the client's industry is too niche for competitor research? System should gracefully handle with broader industry analysis and flag for human review.
- How does system handle incomplete or contradictory client information? Validation should catch obvious issues; ambiguities flagged for clarification.
- What happens if LLM research returns no relevant competitors? System should expand search parameters or notify operator for manual research.
- How does system handle clients who repeatedly reject blueprints? After 3 revision cycles, escalate to human operator.

## Requirements *(mandatory)*

### Functional Requirements

**Client Intake:**
- **FR-001**: System MUST provide a multi-step intake form capturing: company name, business address, phone number, email, industry/sector, scope of services/products
- **FR-002**: System MUST allow clients to specify brand colors (hex codes or color picker) or upload a logo for color extraction
- **FR-003**: System MUST validate all required fields before allowing form submission
- **FR-004**: System MUST store client information securely and associate it with their account

**Competitor Research:**
- **FR-005**: System MUST automatically initiate competitor research when client profile is complete
- **FR-006**: System MUST identify 5-10 relevant competitors in the client's industry and geographic area
- **FR-007**: System MUST extract from competitors: service/product offerings, page structure patterns, content themes, unique selling propositions
- **FR-008**: System MUST present research results in a structured, readable format

**Blueprint Generation:**
- **FR-009**: System MUST generate a website blueprint including: recommended pages, section structure per page, content themes, service/product organization
- **FR-010**: System MUST base blueprint recommendations on both client input and competitor research findings
- **FR-011**: System MUST generate suggested content outlines for each major section

**Approval Workflow:**
- **FR-012**: System MUST provide clear approve/reject/revise options for the blueprint
- **FR-013**: System MUST capture specific feedback when client requests revisions
- **FR-014**: System MUST support up to 3 revision cycles before escalating to human operator
- **FR-015**: System MUST advance project to Phase 2 upon client approval

### Key Entities

- **Client**: The business owner purchasing website services. Has company details, contact info, brand preferences, and project status.
- **Project**: A website development engagement. Belongs to a Client, has phases (Discovery, Design, Development), status, and approval history.
- **CompetitorResearch**: Analysis of industry competitors. Contains competitor list, service patterns, page structures, content themes.
- **Blueprint**: The website plan document. Defines pages, sections, content outlines, and receives approval status from client.
- **RevisionRequest**: Client feedback on blueprint. Contains specific change requests, linked to Blueprint version.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Clients can complete the intake form in under 10 minutes
- **SC-002**: Competitor research completes within 5 minutes of form submission
- **SC-003**: Blueprint generation completes within 3 minutes of research completion
- **SC-004**: 80% of clients approve their blueprint within 2 revision cycles
- **SC-005**: Time from client signup to approved blueprint averages under 24 hours
- **SC-006**: Client satisfaction with blueprint quality averages 4+ out of 5 stars
- **SC-007**: 90% of generated blueprints require no human operator intervention

## Assumptions

- Clients have basic information about their business readily available
- LLM APIs (Claude/GPT-4) are available and can perform web research
- Clients access the system through a web browser on desktop or mobile
- English is the primary language (internationalization deferred)
- Payment/billing is handled separately (Phase handled by billing module)

## Dependencies

- **Platform Module**: Provides the dashboard UI for client interaction
- **Orchestrator Module**: Manages LLM API calls for research and generation
- **Billing Module**: Handles payment before project creation (out of scope for this spec)

## Out of Scope

- Visual design or mockups (Phase 2)
- WordPress development (Phase 3)
- Client authentication system (separate feature)
- Payment processing (billing module)
- Multi-language support
