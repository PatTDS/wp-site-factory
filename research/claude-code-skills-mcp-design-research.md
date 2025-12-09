# Claude Code Custom Skills & MCP Servers for Web Design
**Research Report - December 9, 2025**

---

## Executive Summary

This research identifies effective SKILL.md patterns, MCP server configurations, and workflow strategies for web design and frontend development using Claude Code. Key findings:

- **Skills** teach Claude *how to do tasks* (procedural knowledge)
- **MCP Servers** give Claude *access to tools and data* (connectivity)
- **Combined workflow** leverages both for powerful design automation

---

## Part 1: Custom Skills for Web Design

### What Are Claude Code Skills?

Skills are folders containing a `SKILL.md` file with YAML frontmatter and instructions that Claude loads when relevant. They act as custom onboarding materials, making Claude a specialist in specific domains.

**Key Characteristics:**
- **Model-invoked**: Claude autonomously decides when to use them based on description
- **Progressive disclosure**: Metadata loads first (~100 tokens), full content only when relevant
- **Portable**: Work across Claude.ai, Claude Code, and API

**Sources:**
- [How to create Skills for Claude](https://www.claude.com/blog/how-to-create-skills-key-steps-limitations-and-examples)
- [Agent Skills - Claude Code Docs](https://code.claude.com/docs/en/skills)
- [How to create custom Skills | Claude Help Center](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)

### Official Frontend Design Skill Template

From the [official frontend-design skill](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md):

```yaml
---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
---

# Frontend Design Skill

## Design Thinking Process

Before coding, understand context and commit to a BOLD aesthetic direction:

1. **Purpose**: What problem does this interface solve? Who uses it?
2. **Tone**: Pick an extreme aesthetic direction:
   - Brutally minimal, maximalist chaos, retro-futuristic, organic/natural
   - Luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw
   - Art deco/geometric, soft/pastel, industrial/utilitarian
3. **Constraints**: Technical requirements (framework, performance, accessibility)
4. **Differentiation**: What makes this UNFORGETTABLE?

## Frontend Aesthetics Guidelines

### Typography
Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate aesthetics. Pair a distinctive display font with a refined body font.

### Color & Theme
Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.

### Motion
Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions.

### Spatial Composition
Unexpected layouts, asymmetry, overlap, diagonal flow, grid-breaking elements, generous negative space or controlled density.

### Backgrounds & Visual Details
Create atmosphere and depth: gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, grain overlays.

### What to AVOID
- Generic AI aesthetics
- Overused fonts (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (purple gradients on white)
- Predictable layouts and cookie-cutter patterns
- Lack of context-specific character

### Implementation Requirements
✓ Production-grade and functional
✓ Visually striking and memorable
✓ Cohesive with clear aesthetic POV
✓ Meticulously refined in every detail
```

**Source:** [frontend-design SKILL.md](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md)

### SKILL.md Template Pattern

```yaml
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it (max 1024 characters - CRITICAL for Claude to discover when to use it)
version: "1.0.0" # Optional
disable-model-invocation: false # Optional - set true to require manual /skill-name invocation
---

# Your Skill Name

## Purpose
[Clear explanation of what this skill accomplishes]

## When to Use
[Specific scenarios where Claude should invoke this skill]

## Instructions
[Step-by-step guidance for Claude]

## Examples
[Concrete examples showing expected inputs/outputs]

## Guidelines
[Best practices and constraints]

## Related Resources
[Links to documentation, design systems, etc.]
```

**Key Insights:**
- The `description` field is the most critical - it determines when Claude loads the skill
- Include both *what* the skill does and *when* to use it
- Keep metadata concise but instructions comprehensive
- Skills can reference MCP tools using fully qualified names: `ServerName:tool_name`

**Sources:**
- [How to create custom Skills](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- [Skill authoring best practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)

### Skill Storage Locations

```bash
# Personal Skills (available across all projects)
~/.claude/skills/

# Project Skills (shareable with team, version-controlled)
.claude/skills/

# Plugin-provided Skills
# Automatically discovered when plugin installed
```

**Configuration Example:**
```bash
# Create skill
mkdir -p ~/.claude/skills/design-system
cat > ~/.claude/skills/design-system/SKILL.md << 'EOF'
---
name: design-system
description: Apply company design system tokens, components, and guidelines when building UI. Use when user asks to create components following brand standards.
---
# Design System Skill
[Your instructions here]
EOF
```

**Source:** [Agent Skills - Claude Code Docs](https://code.claude.com/docs/en/skills)

### Community-Validated Skills

From the [awesome-claude-skills repository](https://github.com/travisvn/awesome-claude-skills):

**Web Design Related:**
1. **artifacts-builder** - Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using React, Tailwind CSS, shadcn/ui
2. **d3-visualization** - Teaches Claude to produce D3 charts and interactive data visualizations
3. **webapp-testing** - Tests local web applications using Playwright for verifying frontend functionality
4. **component-doc-generator** - Generates standardized component documentation following design system structure
5. **brand-guidelines** - Applies brand colors and typography consistently across projects

**Source:** [GitHub - awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)

### Skill Chaining Strategies

Skills can be composed together automatically. When Claude evaluates a task:

1. **Metadata loading** (~100 tokens): Scans all available skill descriptions
2. **Relevance evaluation**: Identifies which skills match the current task
3. **Full content loading** (<5k tokens per skill): Loads instructions for all relevant skills
4. **Execution**: Claude uses combined knowledge from multiple skills

**Multi-Skill Workflow Example:**

```markdown
Task: "Create a product card component following our design system"

Skills Loaded:
1. design-system (provides tokens and component patterns)
2. frontend-design (provides aesthetic guidance)
3. accessibility (ensures WCAG compliance)

Result: Claude generates component using design tokens, with distinctive styling,
and proper ARIA attributes - all without explicit prompting for each aspect.
```

**Best Practice for MCP Integration:**
Always use fully qualified tool names in skills to avoid "tool not found" errors:
```yaml
Use: GitHub:create_issue
Not: create_issue
```

**Sources:**
- [Skills explained: How Skills compares to prompts, Projects, MCP, and subagents](https://www.claude.com/blog/skills-explained)
- [Claude Agent Skills: A First Principles Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/)

---

## Part 2: MCP Servers for Web Design

### What Are MCP Servers?

The Model Context Protocol (MCP) is an open standard introduced by Anthropic in November 2024 to standardize how AI systems integrate with external tools and data sources. MCP servers run independently and communicate with Claude via the protocol.

**Architecture:**
- **MCP Servers**: Expose data/tools through standardized interface
- **MCP Clients**: AI applications (Claude Code) that connect to servers
- **Communication**: Structured protocol for reading files, executing functions, handling prompts

**Sources:**
- [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)
- [Model Context Protocol - Wikipedia](https://en.wikipedia.org/wiki/Model_Context_Protocol)

### Official MCP Servers (Reference Implementation)

From [@modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers):

| MCP Name | Purpose | Relevance to Web Design |
|----------|---------|------------------------|
| **Fetch** | Web content fetching and conversion for efficient LLM usage | ⭐⭐⭐ Retrieve web content, analyze designs |
| **Filesystem** | Secure file operations with configurable access controls | ⭐⭐⭐ Manage project files and assets |
| **Git** | Tools to read, search, and manipulate Git repositories | ⭐⭐ Version control for design projects |
| **Memory** | Knowledge graph-based persistent memory system | ⭐⭐ Remember design decisions and patterns |
| **Sequential Thinking** | Dynamic and reflective problem-solving through thought sequences | ⭐⭐ Complex design problem solving |

**Note:** Official reference servers are maintained by the MCP steering group. For specialized design tools, see community servers below.

**Source:** [Model Context Protocol Servers](https://github.com/modelcontextprotocol/servers)

### Browser Automation MCP Servers

| MCP Name | Purpose | GitHub URL | Stars | Design Use Case |
|----------|---------|------------|-------|-----------------|
| **Playwright** | Browser automation using structured accessibility snapshots | [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) | 24.1k | Test web interfaces, automate interactions, capture accessibility data |
| **Puppeteer MCP** | Comprehensive browser automation through Puppeteer | [jaenster/puppeteer-mcp-claude](https://github.com/jaenster/puppeteer-mcp-claude) | 24 | Navigate pages, screenshot capture, element interaction |
| **Browserbase** | Automate browser interactions in the cloud | [browserbase/mcp-server-browserbase](https://github.com/browserbase/mcp-server-browserbase) | N/A | Web navigation, data extraction, form filling |
| **Hyperbrowser** | Next-generation platform for AI agents with scalable automation | [hyperbrowserai/mcp](https://github.com/hyperbrowserai/mcp) | N/A | Enterprise-scale browser automation |
| **Notte** | Notte Web AI agents & cloud browser sessions | [nottelabs/notte](https://github.com/nottelabs/notte) | N/A | Cloud-based browser automation |

**Key Features (Playwright MCP):**
- Fast and lightweight (uses accessibility trees instead of screenshots)
- LLM-friendly (structured data, no vision model required)
- Deterministic (avoids screenshot ambiguity)

**Sources:**
- [GitHub - microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)
- [GitHub - jaenster/puppeteer-mcp-claude](https://github.com/jaenster/puppeteer-mcp-claude)
- [Puppeteer - Claude MCP Servers](https://www.claudemcp.com/servers/puppeteer)

### Design Tool Integration MCP Servers

| MCP Name | Purpose | GitHub URL | Stars | Design Use Case |
|----------|---------|------------|-------|-----------------|
| **Figma MCP** | Brings Figma directly into developer workflow | [figma/mcp-server-guide](https://github.com/figma/mcp-server-guide) | N/A | Generate code from Figma frames, extract design tokens, retrieve component data |
| **Figma Context MCP** | Provides Figma layout information to AI coding agents | [GLips/Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP) | 5k | Access live design data, hierarchy, layout rules |
| **Magic MCP** | Create crafted UI components inspired by 21st.dev | [21st-dev/magic-mcp](https://github.com/21st-dev/magic-mcp) | 4k | Generate modern UI components via natural language |

**Figma MCP Capabilities:**
- Generate code from selected frames
- Extract design context (variables, components, layout data)
- Retrieve Make resources from Make files
- Provides two deployment options: Desktop (local) or Remote (hosted)

**Configuration Example (Figma Desktop):**
```json
{
  "mcpServers": {
    "figma": {
      "command": "node",
      "args": ["/path/to/figma-mcp/index.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

**Sources:**
- [Introducing our MCP server: Bringing Figma into your workflow](https://www.figma.com/blog/introducing-figma-mcp-server/)
- [Guide to the Figma MCP server – Figma Learn](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)
- [GitHub - 21st-dev/magic-mcp](https://github.com/21st-dev/magic-mcp)

### CSS & Styling MCP Servers

| MCP Name | Purpose | GitHub URL | Stars | Design Use Case |
|----------|---------|------------|-------|-----------------|
| **CSS MCP** | MDN documentation + comprehensive CSS code analysis | [stolinski/css-mcp](https://github.com/stolinski/css-mcp) | 308 | Fetch CSS docs, analyze project CSS (150+ metrics), detect patterns |
| **Browser MCP** | Real-time web page interaction and styling | [browser-mcp](https://playbooks.com/mcp/browser) | N/A | Inject custom CSS, modify page styles, retrieve content as markdown |
| **Popmelt CSS Generator** | Generate component-specific CSS from talent profiles | [popmelt-css-generator](https://playbooks.com/mcp/popmelt-css-generator) | N/A | Dynamic UI component styling, consistent design systems |
| **Design System MCP** | Component properties and design tokens | N/A | N/A | Style Dictionary integration, CSS variables, TypeScript declarations |

**CSS MCP Server Features:**
- Framework-agnostic (works with SvelteKit, React, Vue, etc.)
- SQLite-based caching (7-day TTL)
- Analyzes color palettes, font sizes, spacing
- Detects code quality issues and performance problems

**Sources:**
- [GitHub - stolinski/css-mcp](https://github.com/stolinski/css-mcp)
- [Browser MCP](https://playbooks.com/mcp/browser)
- [14 MCP Servers for UI/UX Engineers | Snyk](https://snyk.io/articles/14-mcp-servers-for-ui-ux-engineers/)

### Tailwind CSS MCP Servers

| MCP Name | Purpose | GitHub URL | Stars | Design Use Case |
|----------|---------|------------|-------|-----------------|
| **tailwind-mcp-server** | Comprehensive Tailwind CSS MCP server | [coppinaphil/tailwind-mcp-server](https://github.com/coppinaphil/tailwind-mcp-server) | N/A | Generate components, optimize classes, create themes |
| **mcp-tailwind-gemini** | Tailwind CSS with Gemini AI integration | [Tai-DT/mcp-tailwind-gemini](https://github.com/Tai-DT/mcp-tailwind-gemini) | 10 | AI-powered Tailwind assistance across platforms |
| **tailwindcss-mcp-server** | TailwindCSS utilities, documentation, conversion | [CarbonoDev/tailwindcss-mcp-server](https://github.com/CarbonoDev/tailwindcss-mcp-server) | N/A | Real-time docs, CSS to Tailwind conversion, templates |
| **shadcn-vue-mcp** | shadcn-vue + Tailwind CSS integration | [HelloGGX/shadcn-vue-mcp](https://github.com/HelloGGX/shadcn-vue-mcp) | N/A | Generate Vue components with Tailwind via natural language |
| **FlyonUI MCP** | Tailwind AI Builder for production-ready components | [themeselection/flyonui-mcp](https://github.com/themeselection/flyonui-mcp) | N/A | Build UI blocks and landing pages, compatible with React/Vue |
| **daisyUI Blueprint** | Official daisyUI MCP server | [daisyui.com/blueprint](https://daisyui.com/blueprint/) | N/A | Generate Tailwind CSS code, convert Figma to Tailwind |

**tailwind-mcp-server Capabilities:**
- Generate production-ready Tailwind components (buttons, cards, modals, navbars, etc.)
- Support for variants, sizes, and framework integration
- UI elements, navigation components, layout sections, forms

**Sources:**
- [GitHub - coppinaphil/tailwind-mcp-server](https://github.com/coppinaphil/tailwind-mcp-server)
- [daisyUI Blueprint MCP](https://daisyui.com/blueprint/)
- [GitHub - HelloGGX/shadcn-vue-mcp](https://github.com/HelloGGX/shadcn-vue-mcp)

### Screenshot & Visual Testing MCP Servers

| MCP Name | Purpose | GitHub URL | Stars | Design Use Case |
|----------|---------|------------|-------|-----------------|
| **ScreenshotMCP** | Capture website screenshots | [upnorthmedia/ScreenshotMCP](https://github.com/upnorthmedia/ScreenshotMCP) | N/A | Full page, elements, device sizes |
| **ScreenshotOne** | Render website screenshots with ScreenshotOne | [screenshotone/mcp](https://github.com/screenshotone/mcp) | N/A | Professional screenshot rendering |

### UI Component Library MCP Servers

| MCP Name | Purpose | GitHub URL | Stars | Design Use Case |
|----------|---------|------------|-------|-----------------|
| **FlyonUI** | Build modern, production-ready UI blocks | [themeselection/flyonui-mcp](https://github.com/themeselection/flyonui-mcp) | N/A | Generate components and landing pages |
| **Gluestack UI MCP** | React Native–first development with Gluestack UI | [gauravsaini/gluestack-ui-mcp-server](https://github.com/gauravsaini/gluestack-ui-mcp-server) | N/A | Mobile-first UI development |

**Source:** [GitHub - wong2/awesome-mcp-servers](https://github.com/wong2/awesome-mcp-servers)

---

## Part 3: MCP Configuration for Claude Code

### Configuration File Locations

Claude Code saves server definitions in JSON files:

```bash
# User scope (available across all projects)
~/.claude.json

# Project scope (shareable with team, version-controlled)
.mcp.json  # in project root

# Alternative locations
~/.claude/settings.local.json  # user-specific
.claude/settings.local.json    # project-specific
```

**Source:** [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp)

### CLI Configuration Commands

```bash
# Add MCP server
claude mcp add [name] --scope user

# List configured servers
claude mcp list

# Remove server
claude mcp remove [name]

# Test server connection
claude mcp get [name]

# Quick install (for compatible servers)
claude mcp add puppeteer-mcp-claude
```

**Source:** [Configuring MCP Tools in Claude Code - The Better Way](https://scottspence.com/posts/configuring-mcp-tools-in-claude-code)

### Configuration JSON Examples

**Basic Setup (~/.claude.json):**
```json
{
  "projects": {
    "/path/to/your/project": {
      "mcpServers": {
        "filesystem": {
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/Desktop"]
        },
        "memory": {
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-memory"]
        },
        "fetch": {
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-fetch"]
        }
      }
    }
  }
}
```

**Custom Local Tool (.mcp.json in project):**
```json
{
  "mcpServers": {
    "my-custom-tool": {
      "type": "stdio",
      "command": "node",
      "args": ["/home/user/mcp-tools/my-custom-tool/build/index.js"]
    }
  }
}
```

**Puppeteer MCP Configuration:**
```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "puppeteer-mcp-claude"]
    }
  }
}
```

**Figma MCP Configuration:**
```json
{
  "mcpServers": {
    "figma": {
      "command": "node",
      "args": ["/path/to/figma-mcp/index.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

**CSS MCP Configuration:**
```json
{
  "mcpServers": {
    "css-mcp": {
      "command": "node",
      "args": ["/path/to/css-mcp/build/index.js"]
    }
  }
}
```

**Sources:**
- [Add MCP Servers to Claude Code - Setup & Configuration Guide](https://mcpcat.io/guides/adding-an-mcp-server-to-claude-code/)
- [Configuring MCP Tools in Claude Code](https://scottspence.com/posts/configuring-mcp-tools-in-claude-code)

### Enterprise Configuration

For centralized control:
- IT administrators can control which MCP servers employees access
- Deploy standardized set of approved MCP servers organization-wide
- Optionally restrict users from adding their own MCP servers

**Environment Variables:**
```bash
# Configure MCP startup timeout (default is 10 seconds)
MCP_TIMEOUT=10000 claude

# Example in shell config
export MCP_TIMEOUT=15000
```

**Source:** [Claude Code Configuration Guide](https://claudelog.com/configuration/)

---

## Part 4: Skill + MCP Workflow Patterns

### The Synergy: Skills + MCP

**Key Principle:**
> MCP connects Claude to data while Skills teach Claude what to do with that data.

**Decision Framework:**
- **Use Skills when:** Explaining *how to use* a tool or follow procedures
  - Example: "When querying our database, always filter by date range first"
- **Use MCP when:** Claude needs to *access* the tool/data in the first place
  - Example: Connecting to the database or Excel files
- **Use Both Together:** MCP for connectivity, Skills for procedural knowledge

**Source:** [Skills explained: How Skills compares to prompts, Projects, MCP, and subagents](https://www.claude.com/blog/skills-explained)

### Multi-Tool Workflow Examples

#### Example 1: Competitive Analysis Workflow

**Setup:**
- **MCP Connections:** Google Drive, GitHub, web search
- **Skills:** competitive-analysis (analytical framework)
- **Execution:** Claude searches Drive for competitor briefs, pulls GitHub data, applies analytical framework from skill

**Workflow:**
1. MCP activates: Search Google Drive for recent competitor briefs
2. MCP activates: Pull GitHub data for technical comparisons
3. Skill engages: Apply competitive-analysis framework
4. Prompts refine: "Focus especially on enterprise customers in healthcare"

**Source:** [10 Practical Claude MCP Examples For Your Workflow](https://www.getclockwise.com/blog/claude-mcp-use-cases-examples)

#### Example 2: Content Marketing Automation

**Setup:**
- **MCP Servers:** CMS, Social Media Publishing, Email Marketing
- **Skills:** brand-guidelines, content-strategy
- **Execution:** Claude reads blog posts, applies brand guidelines, creates platform-specific content

**Workflow:**
1. MCP: Read blog posts from CMS
2. Skill: Apply brand-guidelines for voice/tone
3. Skill: Use content-strategy for platform optimization
4. MCP: Schedule LinkedIn posts
5. MCP: Draft newsletter summaries

**Source:** [10 Practical Claude MCP Examples For Your Workflow](https://www.getclockwise.com/blog/claude-mcp-use-cases-examples)

#### Example 3: Design System Implementation

**Setup:**
- **MCP Servers:** Figma MCP, filesystem, CSS MCP
- **Skills:** design-system, frontend-design, component-doc-generator
- **Execution:** Extract Figma designs, generate code following design system, document components

**Workflow:**
1. MCP (Figma): Extract design tokens and component specs
2. Skill (design-system): Apply token naming conventions
3. Skill (frontend-design): Generate distinctive, production-grade code
4. MCP (filesystem): Write component files
5. Skill (component-doc-generator): Generate documentation
6. MCP (CSS MCP): Analyze generated CSS for quality

**Practical Commands:**
```bash
# User: "Create a button component from the Figma design using our design system"

# Behind the scenes:
1. Claude loads design-system skill (detects "design system" in prompt)
2. Claude loads frontend-design skill (detects "component" + "Figma")
3. Claude invokes Figma:get_frame to extract button design
4. Claude applies design-system naming conventions from skill
5. Claude generates code following frontend-design aesthetic guidelines
6. Claude writes files using filesystem:write_file
7. Claude analyzes CSS using CSS-MCP:analyze_css
8. Claude generates docs using component-doc-generator patterns
```

### PR Agent Workflow (Advanced Example)

From [Advanced MCP Development](https://huggingface.co/learn/mcp-course/en/unit3/introduction):

**Features:**
- Smart PR Management (automatic template selection based on code changes using MCP Tools)
- CI/CD Monitoring (tracking GitHub Actions with Cloudflare Tunnel)
- Team Communication (Slack notifications)

**Architecture:**
- **MCP Tools:** GitHub API integration, CI/CD status checks
- **MCP Prompts:** Standardized PR templates and workflows
- **MCP Resources:** Team conventions and communication patterns

This demonstrates all MCP primitives working together with Skills for team-aware, workflow-intelligent automation.

### Programmatic Tool Calling Pattern

**Advanced Feature:** Claude can orchestrate tools through code rather than individual API calls.

**Traditional Approach:**
```
Claude → Request Tool 1 → Wait for result → Add to context
Claude → Request Tool 2 → Wait for result → Add to context
Claude → Request Tool 3 → Wait for result → Add to context
```

**Programmatic Approach:**
```python
# Claude writes code that calls multiple tools
results = []
for page in pages:
    frame = figma.get_frame(page)
    tokens = design_system.extract_tokens(frame)
    code = generate_component(frame, tokens)
    results.append(code)

# Only final results enter Claude's context
return results
```

**Benefits:**
- More reliable, precise control flow
- Reduced context window usage
- Better handling of loops and conditionals

**Source:** [Introducing advanced tool use on the Claude Developer Console](https://www.anthropic.com/engineering/advanced-tool-use)

### Hybrid Skills + MCP Best Practices

**Pattern: Skills as MCP Clients**

Skills can invoke MCP servers for specific tasks while maintaining workflow orchestration:

```yaml
---
name: design-system-builder
description: Build design system components from Figma using company standards
---

# Design System Builder

When user provides Figma URL:

1. Use Figma:get_frame to extract design data
2. Use CSS-MCP:analyze_css to check existing patterns
3. Apply token naming: component-category-role-state
4. Generate code following frontend-design aesthetics
5. Use filesystem:write_file to save component
6. Use GitHub:create_pr to submit for review
```

**Advantages:**
- Reduces MCP server complexity by 40-60%
- Skills handle business logic, MCP handles connectivity
- Easier to maintain and version

**Source:** [Claude Skills vs. MCP: A Technical Comparison](https://intuitionlabs.ai/articles/claude-skills-vs-mcp)

---

## Part 5: Practical Implementation Guide

### Step 1: Set Up Core MCP Servers

**Recommended Starter Stack for Web Design:**

```bash
# Install via CLI (easiest)
claude mcp add @modelcontextprotocol/server-filesystem
claude mcp add @modelcontextprotocol/server-fetch
claude mcp add puppeteer-mcp-claude

# Or configure in ~/.claude.json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/projects"]
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "puppeteer-mcp-claude"]
    },
    "css-mcp": {
      "command": "node",
      "args": ["/path/to/css-mcp/build/index.js"]
    }
  }
}
```

### Step 2: Create Custom Design Skills

**Minimal Skill Template:**

```bash
mkdir -p ~/.claude/skills/my-design-system
cat > ~/.claude/skills/my-design-system/SKILL.md << 'EOF'
---
name: my-design-system
description: Apply my company design system tokens, component patterns, and brand guidelines when building UI. Use when user asks to create components or pages following our standards.
---

# My Design System

## Design Tokens

### Colors
- Primary: #1D4ED8 (blue-700)
- Secondary: #059669 (green-600)
- Accent: #DC2626 (red-600)
- Neutral: #6B7280 (gray-500)

### Typography
- Heading: Inter, sans-serif
- Body: Inter, sans-serif
- Display: Playfair Display, serif

### Spacing Scale
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)

## Component Patterns

### Buttons
```css
.btn-primary {
  @apply bg-blue-700 text-white px-6 py-3 rounded-lg
         hover:bg-blue-800 transition-colors;
}
```

### Cards
```css
.card {
  @apply bg-white shadow-lg rounded-xl p-6
         border border-gray-200;
}
```

## Guidelines
- Always use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Ensure WCAG AA contrast ratios
- Use semantic HTML elements
EOF
```

### Step 3: Test the Workflow

**Example Task:**
```
User: "Create a product card component using our design system"

Expected Flow:
1. Claude loads my-design-system skill (matches "design system" in description)
2. Claude uses filesystem:read_file to check existing components
3. Claude generates component following design tokens and patterns
4. Claude uses filesystem:write_file to save component
5. Claude uses CSS-MCP:analyze_css to verify quality
```

### Step 4: Add Figma Integration (Optional)

```bash
# Install Figma MCP
npm install -g @figma/mcp-server

# Configure in ~/.claude.json
{
  "mcpServers": {
    "figma": {
      "command": "figma-mcp",
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

**Enhanced Workflow:**
```
User: "Implement the hero section from Figma file XYZ"

Flow:
1. Claude uses Figma:get_frame to extract design
2. Claude loads my-design-system skill
3. Claude loads frontend-design skill for aesthetics
4. Claude generates code combining Figma design + design system tokens + aesthetic guidance
5. Claude saves files and analyzes CSS quality
```

### Step 5: Monitor and Refine

**Tips:**
- Use `claude mcp list` to see active servers
- Check Claude Code logs for MCP tool invocations
- Refine skill descriptions if Claude doesn't auto-load them
- Use `disable-model-invocation: true` for skills that should only be manually triggered

---

## Part 6: Key Takeaways & Best Practices

### When to Use Skills vs MCP

| Scenario | Use Skills | Use MCP |
|----------|-----------|---------|
| Define procedural knowledge | ✅ | ❌ |
| Access external tools/data | ❌ | ✅ |
| Apply brand guidelines | ✅ | ❌ |
| Query databases | ❌ | ✅ |
| Follow naming conventions | ✅ | ❌ |
| Fetch Figma designs | ❌ | ✅ |
| Generate standardized docs | ✅ | ❌ |
| Analyze CSS code | ❌ | ✅ |

**Combined Power:** Skills teach Claude *how* to use MCP tools effectively.

### Skill Authoring Best Practices

1. **Description is Critical**: Include both *what* and *when*
   - Good: "Apply design system tokens when building UI components"
   - Bad: "Design system helper"

2. **Progressive Disclosure**: Keep metadata minimal, instructions comprehensive
   - Metadata: <100 tokens (name, description)
   - Instructions: <5k tokens (detailed guidance)

3. **Use Fully Qualified Tool Names**: `ServerName:tool_name`
   - Prevents "tool not found" errors
   - Example: `Figma:get_frame`, not `get_frame`

4. **Include Examples**: Show expected inputs/outputs
   - Helps Claude understand patterns
   - Provides templates for generation

5. **Version Your Skills**: Track changes and compatibility
   - Use `version: "1.0.0"` in frontmatter
   - Document breaking changes

**Source:** [Skill authoring best practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)

### MCP Configuration Best Practices

1. **Start with Official Servers**: Stable, well-documented
   - filesystem, fetch, memory, sequential-thinking

2. **Use Project Scope for Team Sharing**: `.mcp.json` in repo
   - Version-controlled
   - Consistent across team

3. **Use User Scope for Personal Tools**: `~/.claude.json`
   - Experimental servers
   - Personal API keys

4. **Test Connections**: Use `claude mcp get [name]`
   - Verify server starts correctly
   - Check tool availability

5. **Configure Timeouts**: Some servers need more startup time
   - `MCP_TIMEOUT=15000 claude`

**Source:** [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp)

### Performance Considerations

**Skills:**
- Progressive loading minimizes context usage
- Metadata scanned first (~100 tokens)
- Full content only loaded when relevant
- Multiple skills can compose without context explosion

**MCP:**
- Programmatic tool calling reduces context usage
- Only final results enter Claude's context
- Persistent connections reused across invocations
- Consider server startup time (default 10s timeout)

### Security Considerations

**Skills:**
- Version-control project skills in `.claude/skills/`
- Don't commit sensitive data (API keys, passwords)
- Use `disable-model-invocation: true` for dangerous operations

**MCP:**
- Never commit API keys in `.mcp.json` (use `.mcp.local.json` + .gitignore)
- Use environment variables for secrets
- Configure filesystem server with specific allowed directories only
- Test in isolated environment before production use

---

## Part 7: Resources & References

### Official Documentation

**Skills:**
- [How to create Skills for Claude](https://www.claude.com/blog/how-to-create-skills-key-steps-limitations-and-examples)
- [Agent Skills - Claude Code Docs](https://code.claude.com/docs/en/skills)
- [Agent Skills - Claude Platform Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [How to create custom Skills | Claude Help Center](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- [Skill authoring best practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)

**MCP:**
- [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)
- [Model Context Protocol - Official Site](https://modelcontextprotocol.io)
- [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp)
- [Example Servers - Model Context Protocol](https://modelcontextprotocol.io/examples)

### GitHub Repositories

**Official:**
- [anthropics/skills](https://github.com/anthropics/skills) - Public repository for Skills
- [anthropics/claude-code](https://github.com/anthropics/claude-code) - Claude Code plugins
- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) - Official MCP servers
- [modelcontextprotocol/registry](https://github.com/modelcontextprotocol/registry) - MCP Registry

**Community:**
- [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) - Curated Claude Skills
- [wong2/awesome-mcp-servers](https://github.com/wong2/awesome-mcp-servers) - Curated MCP Servers
- [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) - Alternative skills list
- [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) - Another MCP collection

### Key MCP Servers (Starred Repositories)

| Server | Stars | URL |
|--------|-------|-----|
| Playwright | 24.1k | [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) |
| Figma Context | 5k | [GLips/Figma-Context-MCP](https://github.com/GLips/Figma-Context-MCP) |
| Magic MCP | 4k | [21st-dev/magic-mcp](https://github.com/21st-dev/magic-mcp) |
| CSS MCP | 308 | [stolinski/css-mcp](https://github.com/stolinski/css-mcp) |
| Puppeteer MCP | 24 | [jaenster/puppeteer-mcp-claude](https://github.com/jaenster/puppeteer-mcp-claude) |
| Tailwind Gemini | 10 | [Tai-DT/mcp-tailwind-gemini](https://github.com/Tai-DT/mcp-tailwind-gemini) |

### Registries & Marketplaces

- [MCP Registry](https://modelcontextprotocol.info/tools/registry/) - Community-driven registry
- [GitHub MCP Registry](https://github.com/mcp) - GitHub's official registry
- [MCPMarket Leaderboard](https://mcpmarket.com/leaderboards) - Top 100 MCP servers by stars
- [Awesome MCP Servers](https://mcpservers.org/) - Searchable directory
- [claude-plugins.dev](https://claude-plugins.dev) - Claude Code plugins and skills

### Tutorials & Guides

**Skills:**
- [How I Turned One Design Into a Claude Skill](https://www.nathanonn.com/claude-skill-design-system-reusable-frontend/)
- [Supercharging Front-End Development with Claude Skills](https://dev.to/rio14/supercharging-front-end-development-with-claude-skills-22bj)
- [Claude Code Skills Complete Guide for Developers (2025)](https://www.cursor-ide.com/blog/claude-code-skills)
- [How to Create Your First Claude Skill: Step-by-Step Tutorial](https://skywork.ai/blog/ai-agent/how-to-create-claude-skill-step-by-step-guide/)

**MCP:**
- [How to Automate Web Browsing with Puppeteer MCP](https://apidog.com/blog/puppeteer-mcp-server/)
- [Design to Code with the Figma MCP Server](https://www.builder.io/blog/figma-mcp-server)
- [Advanced MCP Development: Building Custom Workflow Servers](https://huggingface.co/learn/mcp-course/en/unit3/introduction)
- [Add MCP Servers to Claude Code with MCP Toolkit | Docker](https://www.docker.com/blog/add-mcp-servers-to-claude-code-with-mcp-toolkit/)

**Combined Workflows:**
- [10 Practical Claude MCP Examples For Your Workflow](https://www.getclockwise.com/blog/claude-mcp-use-cases-examples)
- [Skills explained: How Skills compares to prompts, Projects, MCP, and subagents](https://www.claude.com/blog/skills-explained)
- [Claude Skills vs. MCP: A Technical Comparison](https://intuitionlabs.ai/articles/claude-skills-vs-mcp)

### Industry Analysis

- [10 MCP Servers for Frontend Developers - The New Stack](https://thenewstack.io/10-mcp-servers-for-frontend-developers/)
- [Top 15 Model Context Protocol (MCP) Servers for Frontend Developers (2025)](https://www.marktechpost.com/2025/09/22/top-15-model-context-protocol-mcp-servers-for-frontend-developers-2025/)
- [14 MCP Servers for UI/UX Engineers | Snyk](https://snyk.io/articles/14-mcp-servers-for-ui-ux-engineers/)
- [Top 8 Open Source MCP Projects with the Most GitHub Stars](https://www.nocobase.com/en/blog/github-open-source-mcp-projects)

---

## Conclusion

**Skills** and **MCP servers** form a powerful combination for web design automation:

- **Skills** provide procedural knowledge (design systems, brand guidelines, component patterns)
- **MCP servers** provide tool connectivity (Figma, browsers, CSS analysis, file operations)
- **Combined workflows** leverage both for sophisticated, repeatable design automation

**Recommended Starter Stack:**
1. **Core Skills:** frontend-design, design-system (custom), brand-guidelines
2. **Core MCP:** filesystem, fetch, CSS MCP, Puppeteer
3. **Optional:** Figma MCP (for design-to-code), Tailwind MCP (for utility generation)

**Next Steps:**
1. Set up core MCP servers using CLI: `claude mcp add [name]`
2. Create custom design-system skill with your tokens/patterns
3. Test workflow with real design tasks
4. Refine skill descriptions based on Claude's auto-loading behavior
5. Add specialized MCP servers as needed (Figma, Tailwind, etc.)

**Key Success Factor:** Clear skill descriptions that tell Claude both *what* and *when* to use them, combined with well-configured MCP servers for reliable tool access.

---

**Research Date:** December 9, 2025
**Report Version:** 1.0
**Total Sources Referenced:** 50+
