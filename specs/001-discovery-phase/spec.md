# Feature Specification: Discovery Phase

**Feature Branch**: `001-discovery-phase`
**Created**: 2024-12-04
**Updated**: 2024-12-04
**Status**: Draft
**Input**: Phase 1 Discovery: Client intake via dashboard form. Two-layer LLM research (best practices + competitor analysis). Automated blueprint generation with content drafts. Operator review and client approval workflow.

## Overview

The Discovery Phase is the first of three phases in the WPF Automated Web Agency workflow. It replaces the traditional agency-client consultation meeting with an automated, LLM-powered process that:

1. Gathers client information via dashboard intake form
2. Researches best practices for effective website sections
3. Analyzes competitors in the client's industry
4. Generates a comprehensive Blueprint with content drafts
5. Facilitates operator review and client approval

**Key Principle: Research-First Methodology**

Before generating any content, the system researches best practices from peer-reviewed and professional sources. This ensures every Blueprint reflects current industry standards, not assumptions.

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      DISCOVERY PHASE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. CLIENT INTAKE (Dashboard Form)                              │
│     └─→ Company details, industry, vision/mission, socials      │
│                                                                 │
│  2. BEST PRACTICES RESEARCH (LLM Web Search)                    │
│     └─→ "How to write effective hero for {industry}"            │
│     └─→ "Best practices for about us sections"                  │
│     └─→ Store findings in permanent knowledge base              │
│                                                                 │
│  3. COMPETITOR RESEARCH (LLM Web Search + Analysis)             │
│     └─→ Find top 5-10 {industry} websites                       │
│     └─→ Analyze their sections, messaging, structure            │
│     └─→ Extract patterns that work                              │
│                                                                 │
│  4. CONTENT DRAFTING (LLM Synthesis)                            │
│     └─→ Combine best practices + competitor insights            │
│     └─→ Generate section content drafts                         │
│     └─→ Produce Blueprint v1                                    │
│                                                                 │
│  5. OPERATOR REVIEW (Claude Code)                               │
│     └─→ Review drafts, fix issues, refine quality               │
│     └─→ Update Blueprint version                                │
│                                                                 │
│  6. CLIENT REVIEW (Dashboard)                                   │
│     └─→ Client views Blueprint in dashboard                     │
│     └─→ Approves, comments, or requests changes                 │
│     └─→ Iterate until approved                                  │
│                                                                 │
│  7. HANDOFF TO PHASE 2                                          │
│     └─→ Blueprint locked at approved version                    │
│     └─→ JSON exported to project folder                         │
│     └─→ Phase 2 receives approved Blueprint                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Client Submits Company Information (Priority: P1)

A new client accesses the WPF dashboard and fills out a comprehensive intake form with their company details. The form captures all essential information needed to create their website: company name, address, phone, email, social media links, industry category, vision, mission, and scope of services/products offered.

**Why this priority**: This is the foundation of the entire system. Without client data, no website can be generated. This must work flawlessly before any other functionality matters.

**Independent Test**: Can be fully tested by submitting a complete form and verifying all data is captured and stored correctly. Delivers immediate value by digitizing the client intake process.

**Acceptance Scenarios**:

1. **Given** a new client on the dashboard, **When** they complete all required fields and submit the form, **Then** the system confirms receipt and displays a summary of submitted information.
2. **Given** a client filling the form, **When** they leave required fields empty and attempt to submit, **Then** the system highlights missing fields and prevents submission.
3. **Given** a client with a logo file, **When** they upload the logo, **Then** the system extracts dominant colors and suggests a color palette.
4. **Given** a client selects their industry, **When** the form is submitted, **Then** the system validates the industry is supported and queues research.

---

### User Story 2 - Best Practices Research (Priority: P1)

After client information is submitted, the system researches best practices for writing effective website sections. Using LLM web search, it finds peer-reviewed and professional sources explaining how to write compelling hero sections, about us content, service descriptions, and other common sections for the client's industry.

**Why this priority**: Research-first methodology is a core principle. Without best practices research, content drafts are based on assumptions rather than proven patterns. This is foundational to quality output.

**Independent Test**: Can be tested by triggering research for a specific industry and verifying the system returns documented best practices with sources.

**Acceptance Scenarios**:

1. **Given** a submitted client profile with industry defined, **When** best practices research runs, **Then** the system retrieves guidance on writing effective hero, about us, services, and contact sections for that industry.
2. **Given** best practices research completes, **When** findings are stored, **Then** they are saved to the permanent knowledge base with date, sources, and confidence level.
3. **Given** existing best practices in knowledge base for an industry, **When** new research runs, **Then** the system updates or supplements existing knowledge rather than duplicating.

---

### User Story 3 - Competitor Research (Priority: P2)

The system researches competitors in the client's industry using LLM web search. It finds successful companies in the same sector, analyzes their websites (sections, messaging, structure), and extracts patterns that work. This provides real-world examples to inform content drafts.

**Why this priority**: Competitor research differentiates WPF from simple website builders. This automation provides real agency value - understanding the market before designing. Depends on intake being complete.

**Independent Test**: Can be tested by providing an industry (e.g., "roofing companies in Australia") and verifying the system returns relevant competitor analysis with actionable insights.

**Acceptance Scenarios**:

1. **Given** a submitted client profile with industry defined, **When** competitor research completes, **Then** the system displays a list of 5-10 competitor companies with their key service offerings and website structure.
2. **Given** competitor research in progress, **When** the client views their dashboard, **Then** they see a progress indicator showing research status.
3. **Given** completed competitor research, **When** results are analyzed, **Then** the system extracts common services, page structures, messaging patterns, and effective CTAs used by successful competitors.
4. **Given** competitor insights, **When** stored, **Then** they are saved to the industry-specific section of the knowledge base for future reuse.

---

### User Story 4 - Blueprint Generation with Content Drafts (Priority: P2)

Based on client information, best practices research, and competitor analysis, the system generates a comprehensive Blueprint. This Blueprint defines the recommended page structure, section layouts, and includes **actual content drafts** for each section (hero headline, about us text, service descriptions, etc.).

**Why this priority**: The Blueprint with content drafts is the primary deliverable of Phase 1. It must synthesize all research into actionable content the client can review. Equal priority with competitor research as they work together.

**Independent Test**: Can be tested by providing client data and research results, then verifying a coherent Blueprint is generated with all required sections and draft content.

**Acceptance Scenarios**:

1. **Given** completed client profile, best practices, and competitor research, **When** Blueprint generation runs, **Then** the system produces a structured document with recommended pages, sections, and content drafts.
2. **Given** a generated Blueprint, **When** the client views the hero section, **Then** they see a draft headline, subheadline, and CTA text tailored to their business.
3. **Given** a Blueprint with services section, **When** reviewed, **Then** each service has a name, description paragraph, and key selling points derived from research.
4. **Given** Blueprint generation completes, **When** stored, **Then** it is saved to both database (for dashboard) and exported as JSON (for CLI/backup).

---

### User Story 5 - Operator Review (Priority: P2)

Before the client sees the Blueprint, the operator (human with Claude Code) reviews the generated content. They can fix issues, improve quality, adjust tone, and ensure the Blueprint meets WPF standards. This human-in-loop ensures quality control.

**Why this priority**: Human review catches LLM errors and ensures quality. Part of the hybrid LLM architecture - automated generation with human quality control.

**Independent Test**: Can be tested by generating a Blueprint and having an operator review it using Claude Code, making improvements, and saving a new version.

**Acceptance Scenarios**:

1. **Given** a generated Blueprint v1, **When** operator opens it in Claude Code, **Then** they can read all sections and identify areas for improvement.
2. **Given** operator makes changes, **When** they save, **Then** a new Blueprint version (v2) is created preserving the original.
3. **Given** operator approves quality, **When** they mark ready for client, **Then** the Blueprint status changes to "Pending Client Review".

---

### User Story 6 - Client Approval Workflow (Priority: P3)

The client reviews the Blueprint in the dashboard and can approve it, request changes, or provide feedback. Approval advances the project to Phase 2 (Design Draft). Requested changes trigger a revision cycle.

**Why this priority**: The approval gate is essential for the workflow but depends on all previous stories being complete. It's the checkpoint before significant design work begins.

**Independent Test**: Can be tested by presenting a Blueprint to a client and verifying they can approve, reject, or request specific changes, and that the system responds appropriately.

**Acceptance Scenarios**:

1. **Given** a client reviewing their Blueprint in dashboard, **When** they click "Approve", **Then** the project status changes to "Ready for Design" and the client receives confirmation.
2. **Given** a client reviewing their Blueprint, **When** they add comments to specific sections, **Then** the comments are saved and visible to the operator.
3. **Given** a client requests changes, **When** they submit feedback, **Then** the system notifies the operator and triggers a revision cycle.
4. **Given** a Blueprint is approved, **When** handoff occurs, **Then** the Blueprint is locked, JSON exported, and Phase 2 can begin.

---

### Edge Cases

- What happens when the client's industry is too niche for competitor research? System should gracefully handle with broader industry analysis and flag for human review.
- How does system handle incomplete or contradictory client information? Validation should catch obvious issues; ambiguities flagged for clarification.
- What happens if LLM research returns no relevant competitors? System should expand search parameters or notify operator for manual research.
- How does system handle clients who repeatedly reject Blueprints? After 3 revision cycles, escalate to human operator for direct consultation.
- What if best practices research conflicts with competitor patterns? Flag conflict for operator review; prefer peer-reviewed best practices over competitor mimicry.

## Requirements *(mandatory)*

### Functional Requirements

**Client Intake (Dashboard Form):**
- **FR-001**: System MUST provide a multi-step intake form capturing: company name, business address, phone number, email, social media links, industry/sector, vision statement, mission statement, scope of services/products
- **FR-002**: System MUST allow clients to specify brand colors (hex codes or color picker) or upload a logo for color extraction
- **FR-003**: System MUST validate all required fields before allowing form submission
- **FR-004**: System MUST store client information in database and associate it with their account
- **FR-005**: System MUST support industry selection from a curated list with "Other" option for custom entry

**Best Practices Research (LLM Web Search):**
- **FR-006**: System MUST research best practices for writing effective sections (hero, about us, services, testimonials, contact) when intake is submitted
- **FR-007**: System MUST use LLM web search to find peer-reviewed and professional sources
- **FR-008**: System MUST store research findings in permanent knowledge base with: date, sources, confidence level, industry tags
- **FR-009**: System MUST check existing knowledge base before researching to avoid duplicate effort
- **FR-010**: System MUST update existing knowledge when new research provides better insights

**Competitor Research (LLM Web Search + Analysis):**
- **FR-011**: System MUST identify 5-10 relevant competitors in the client's industry using LLM web search
- **FR-012**: System MUST analyze competitor websites for: service/product offerings, page structure patterns, messaging themes, effective CTAs, unique selling propositions
- **FR-013**: System MUST synthesize competitor patterns into actionable insights
- **FR-014**: System MUST store industry-specific competitor insights in knowledge base for reuse
- **FR-015**: System SHOULD support optional deep fetch of specific URLs when exceptional examples are found

**Blueprint Generation:**
- **FR-016**: System MUST generate a Blueprint containing: client profile summary, research findings summary, content drafts for all sections, structure recommendation, approval status
- **FR-017**: System MUST generate draft content for: hero (headline, subheadline, CTA), about us (company story, values), services (name, description, selling points for each), contact (hours, location info, form fields)
- **FR-018**: System MUST base content drafts on both best practices research and competitor insights
- **FR-019**: System MUST store Blueprint in database with version history
- **FR-020**: System MUST export approved Blueprint as JSON to project folder

**Operator Review:**
- **FR-021**: System MUST allow operator to view and edit Blueprint content via Claude Code or dashboard
- **FR-022**: System MUST create new Blueprint version when operator makes changes (preserve history)
- **FR-023**: System MUST allow operator to mark Blueprint as "Ready for Client Review"

**Client Approval Workflow (Dashboard):**
- **FR-024**: System MUST provide Blueprint viewer in client dashboard showing all sections
- **FR-025**: System MUST provide approve/request-changes options for the Blueprint
- **FR-026**: System MUST allow clients to add comments to specific sections
- **FR-027**: System MUST support up to 3 revision cycles before escalating to human operator
- **FR-028**: System MUST advance project to Phase 2 upon client approval and lock Blueprint

**Knowledge Base Management:**
- **FR-029**: System MUST maintain permanent knowledge base that grows with each project
- **FR-030**: System MUST organize knowledge by: section type (hero, about, services), industry, confidence level
- **FR-031**: System MUST follow knowledge curation rules: add with sources, update don't delete, flag conflicts

### Key Entities

- **Client**: The business owner purchasing website services. Has company details, contact info, social links, brand preferences, vision/mission, and project status.

- **Project**: A website development engagement. Belongs to a Client, has phases (Discovery, Design, Development), status, and approval history.

- **Blueprint**: The comprehensive website plan document. Structure:
  ```
  Blueprint
  ├── client_profile (company, contact, brand, industry)
  ├── research_findings
  │   ├── best_practices (per section type)
  │   └── competitor_analysis (patterns, examples)
  ├── content_drafts
  │   ├── hero (headline, subheadline, cta)
  │   ├── about_us (story, values, team)
  │   ├── services[] (name, description, points)
  │   ├── testimonials (format, placeholders)
  │   └── contact (hours, location, form)
  ├── structure_recommendation
  │   ├── pages[] (name, purpose, sections)
  │   └── navigation
  ├── version (number, created_at, created_by)
  └── status (draft, pending_review, approved)
  ```

- **KnowledgeBase**: Permanent storage of research findings. Organized by section type and industry. Grows with each project.

- **RevisionRequest**: Client feedback on Blueprint. Contains section-specific comments, linked to Blueprint version.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Clients can complete the intake form in under 10 minutes
- **SC-002**: Best practices research completes within 3 minutes of form submission
- **SC-003**: Competitor research completes within 5 minutes of form submission
- **SC-004**: Blueprint generation completes within 3 minutes of research completion
- **SC-005**: 80% of clients approve their Blueprint within 2 revision cycles
- **SC-006**: Time from client signup to approved Blueprint averages under 24 hours
- **SC-007**: Client satisfaction with Blueprint quality averages 4+ out of 5 stars
- **SC-008**: 90% of generated Blueprints require no escalation to human operator
- **SC-009**: Knowledge base contains best practices for 20+ industries after 50 projects

## Assumptions

- Clients have basic information about their business readily available
- LLM APIs (Claude) with web search capability are available
- Clients access the system through a web browser on desktop or mobile
- English is the primary language (internationalization deferred)
- Payment/billing is handled separately before project creation
- Operator (human with Claude Code) is available for review within 24 hours

## Dependencies

- **Platform Module**: Provides the dashboard UI for client intake form, Blueprint viewer, and approval interface
- **Orchestrator Module**: Manages LLM API calls for research and content generation
- **Billing Module**: Handles payment before project creation (out of scope for this spec)
- **Knowledge Base**: Shared resource that grows across all projects

## Out of Scope

- Visual design or mockups (Phase 2)
- WordPress development (Phase 3)
- Client authentication system (separate feature)
- Payment processing (billing module)
- Multi-language support
- Logo design or brand identity creation (client provides)

## Technical Notes

### LLM Web Search Strategy

The system uses LLM web search (hybrid approach) rather than raw web scraping:

1. **Search**: LLM queries for "best {industry} websites 2024", "how to write effective hero section for {industry}"
2. **Analyze**: LLM synthesizes patterns and insights from search results
3. **Deep Fetch (Optional)**: If exceptional example found, fetch specific URL for detailed analysis
4. **Store**: Save insights to knowledge base for reuse

**Benefits over raw scraping:**
- Intelligent synthesis across sources
- Understanding of WHY something works, not just WHAT
- Less maintenance, fewer anti-bot issues
- Insights compound in knowledge base

### Blueprint Storage

| Storage | Purpose |
|---------|---------|
| Database (PostgreSQL) | Primary storage, version history, dashboard queries |
| JSON Export | `projects/{name}/blueprint-v{n}.json` for CLI, backup, Phase 2 handoff |

### Knowledge Base Structure

```
knowledge/
├── best-practices/
│   └── sections/
│       ├── hero/
│       │   ├── _general.md
│       │   └── by-industry/
│       │       ├── roofers.md
│       │       ├── schools.md
│       │       └── automotive.md
│       ├── about-us/
│       ├── services/
│       └── contact/
├── industry-research/
│   └── {industry}/
│       ├── top-competitors.md
│       └── patterns.md
└── _knowledge-rules.md
```
