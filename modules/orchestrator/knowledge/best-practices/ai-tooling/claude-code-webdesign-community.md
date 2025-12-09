# Claude Code Web Design Best Practices: Community Research

**Category:** AI Tooling & Workflow
**Last Updated:** 2025-12-09
**Purpose:** Community-validated best practices for web design workflows with Claude Code
**Status:** Research compilation from Reddit, GitHub, dev.to, and Hacker News
**Confidence:** High (based on official Anthropic docs + community validation)

---

## Executive Summary

**Primary Finding:** Claude Code excels at frontend development when properly configured with Skills, CLAUDE.md files, and the official frontend-design plugin. The tool is production-ready for web projects but requires specific workflow patterns for optimal results.

**Key Success Factors:**
1. Use the official frontend-design plugin/skill (avoids "AI slop" aesthetics)
2. Implement CLAUDE.md for project-specific context
3. Leverage subagents for complex, multi-step workflows
4. Clear specifications before coding (2-hour spec = 6-10 hours saved)
5. Progressive disclosure over exhaustive upfront documentation

**Community Consensus:** Claude Code is transforming from "helpful assistant" to "autonomous developer" when configured correctly. Teams report building MVPs in days instead of weeks.

---

## Official Anthropic Resources

### Frontend Design Plugin (Released 2025)

**Source:** [Anthropic Blog - Improving Frontend Design Through Skills](https://claude.com/blog/improving-frontend-design-through-skills) | [GitHub - frontend-design Plugin](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design)

**Problem Solved:** Without guidance, LLMs produce "Inter fonts, purple gradients on white backgrounds, and minimal animations" due to distributional convergence - safe design choices dominate training data.

**Solution:** The frontend-design skill teaches Claude to:
- Commit to BOLD aesthetic directions (not timid, generic designs)
- Choose distinctive fonts (avoid Inter, Arial, Roboto)
- Use atmospheric backgrounds over solid colors
- Implement real working code with attention to micro-interactions

**Design Philosophy:**
Before coding, Claude should:
1. Understand context: What problem does this solve? Who uses it?
2. Pick a tone from extremes: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian

**Typography Guidelines:**
- Choose beautiful, unique, interesting fonts
- Pair distinctive display font with refined body font
- Avoid generic fonts like Arial and Inter

**Color & Theme:**
- Commit to cohesive aesthetic
- Use CSS variables for consistency
- Dominant colors with sharp accents > evenly-distributed palettes

**Motion:**
- Use animations for effects and micro-interactions
- Prioritize CSS-only solutions for HTML
- Use Motion library for React
- Focus on high-impact moments (one well-orchestrated page load > scattered micro-interactions)

**Example Prompts:**
- "Create a dashboard for a music streaming app"
- "Build a landing page for an AI security startup"
- "Design a settings panel with dark mode"

**Confidence:** ★★★★★ (Official Anthropic plugin)

---

## CLAUDE.md Configuration Best Practices

### What is CLAUDE.md?

**Sources:**
- [Anthropic Blog - Using CLAUDE.md Files](https://www.claude.com/blog/using-claude-md-files)
- [Arize.com - CLAUDE.md Best Practices](https://arize.com/blog/claude-md-best-practices-learned-from-optimizing-claude-code-with-prompt-learning/)
- [HumanLayer - Writing a Good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)

**Problem Solved:** Repeatedly explaining architectural decisions, testing requirements, and code style preferences.

**Solution:** CLAUDE.md files give Claude persistent context about your project, automatically incorporated into every conversation.

### File Locations (Hierarchy)

1. **Project root** (most common): Check into git to share across team
2. **Parent directories**: Useful for monorepos
3. **Child directories**: Claude pulls in on-demand when working with files
4. **Home folder** (~/.claude/CLAUDE.md): Applies to all Claude sessions

### Community-Validated Format

**From [Next.js + TypeScript + Tailwind + shadcn Example](https://gist.github.com/gregsantos/2fc7d7551631b809efa18a0bc4debd2a):**

```markdown
# Project Stack
- TypeScript (^5.0.0)
- Next.js (App Router)
- Tailwind CSS styling
- shadcn/ui component library
- React Query (TanStack) for data fetching
- pnpm as package manager

# Directory Structure
app/          # App Router structure
components/   # UI components (shadcn or custom)
hooks/        # Custom React hooks
lib/          # Client helpers and API wrappers
styles/       # Tailwind customizations
tests/        # Unit and integration tests

# Bash commands
npm run build       # Build the project
npm run typecheck   # Run the typechecker
npm run test        # Run test suite

# Code Style
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible
- Use shadcn/ui components by default for form elements, cards, dialogs

# What NOT to Touch
- Do not rewrite working legacy code in `/legacy`
- Do not modify configuration files without asking
- Do not skip accessibility checks
```

### Key Best Practices

**1. Keep It Concise**
- Include only universally applicable instructions
- Remove generic guidance that doesn't apply to your project
- Most effective CLAUDE.md files are 50-200 lines, not 1000+

**2. Use Progressive Disclosure**
"Don't tell Claude all the information you could possibly want it to know. Rather, tell it how to find important information so it can find and use it only when needed."

**3. Include What Claude Can't Infer**
- Branch naming conventions
- Deployment processes
- Code review requirements
- Testing commands
- Custom slash commands

**4. Use # Key for Quick Updates**
Press # to give Claude an instruction that it will automatically incorporate into the relevant CLAUDE.md. Many engineers use # frequently while coding, then include CLAUDE.md changes in commits.

**5. Iterate and Refine**
"CLAUDE.md files become part of Claude's prompts, so they should be refined like any frequently used prompt. A common mistake is adding extensive content without iterating on its effectiveness."

**Confidence:** ★★★★★ (Official Anthropic guidance + community validation)

---

## Workflow Patterns from Community

### Planning & Research First

**Sources:**
- [Anthropic Engineering - Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Hacker News Discussion - Getting Good Results](https://news.ycombinator.com/item?id=44836879)

**Key Finding:** "The big trick is having clear specs" - One developer spent 2 hours writing a 12-step implementation document, which Claude followed step by step, saving an estimated 6-10 hours.

**Workflow:**
1. **Research & Discovery** - Ask Claude to research and understand context WITHOUT coding
2. **Planning** - Use built-in planning mode for complex changes to align on plan before execution
3. **Clear Context** - Exit session or use /clear after planning to get maximum context window for implementation
4. **Execute** - Implement with fresh context
5. **Verify** - Use subagents to verify implementation

**Anti-Pattern:** Letting Claude jump straight to coding without research/planning phase.

**Confidence:** ★★★★★ (Community consensus + official Anthropic recommendation)

### Subagents for Complex Tasks

**Sources:**
- [Claude Code Docs - Subagents](https://code.claude.com/docs/en/sub-agents)
- [PubNub - Best Practices for Subagents](https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/)
- [GitHub - VoltAgent Subagents Collection](https://github.com/VoltAgent/awesome-claude-code-subagents)

**Key Finding:** Subagents preserve main context while handling specialized tasks. Claude Code can run up to 10 tasks in parallel.

**Best Use Cases:**
1. **Context Preservation** - Research/verification without bloating main context
2. **Parallelization** - Independent tasks (scaffolding, testing, docs) run concurrently
3. **Specialization** - Task-specific configurations with customized system prompts

**Subagent Roles:**
- **Read-only agents** (reviewers, auditors): Read, Grep, Glob
- **Research agents** (analysts): Read, Grep, Glob, WebFetch, WebSearch
- **Code writers** (developers): Read, Write, Edit, Bash, Glob, Grep

**Example Workflow:**
```
Main Agent: "First use the code-analyzer to find performance issues,
             then use the optimizer to fix them."
```

**Trade-offs:**
- ✅ Dramatically increased output and velocity
- ⚠️ Higher token usage (hits usage caps faster)
- ⚠️ No stepwise plans for subagents (they execute immediately)

**Git Worktrees for Isolation:**
Use Git worktrees to prevent conflicts when running multiple agents on same codebase.

**Confidence:** ★★★★☆ (Official documentation + community adoption)

### Custom Slash Commands

**Sources:**
- [My Claude Code Workflow](https://thegroundtruth.substack.com/p/my-claude-code-workflow-and-personal-tips)
- [How I Use Claude Code](https://www.builder.io/blog/claude-code)

**Key Finding:** Automate repetitive tasks with custom slash commands to reclaim up to 30% of weekly coding time.

**Setup:**
Store prompt templates in Markdown files within `.claude/commands/` folder. These become available through slash commands menu when you type `/`.

**Example Commands:**
- `/qplan` - Quick planning mode
- `/qcode` - "Implement your plan, run tests, run prettier, run turbo typecheck lint"
- `/review` - Code review workflow
- `/deploy` - Deployment checklist

**Sharing:**
Check commands into git to make them available for entire team.

**Confidence:** ★★★★☆ (Community best practice, not official)

### Context Management

**Sources:**
- [A Week with Claude Code](https://dev.to/ujjavala/a-week-with-claude-code-lessons-surprises-and-smarter-workflows-23ip)
- [Builder.io - How I Use Claude Code](https://www.builder.io/blog/claude-code)

**Key Finding:** Claude Code is capable of working autonomously for 10-20 minutes before effectiveness decreases as context fills up.

**Best Practices:**
1. **Scope to one project/feature** - Keep all context relevant
2. **Use /clear often** - Every time you start something new
3. **Use /compact mid-session** - Summarizes conversation to fit within limits (useful for complex debugging)
4. **One task per session** - Avoid wasting tokens on irrelevant history

**Thinking Depth Control:**
```
think < think hard < think harder < ultrathink
```
More thinking = more tokens = more cost. Don't use a sledgehammer for a nail.

**Confidence:** ★★★★★ (Community consensus)

---

## Tailwind CSS + shadcn/ui Workflow

### Shadcn MCP Integration

**Sources:**
- [Shadcn.io - MCP for Claude Code](https://www.shadcn.io/mcp/claude-code)
- [GitHub Gist - Next.js + Tailwind + shadcn Guide](https://gist.github.com/gregsantos/2fc7d7551631b809efa18a0bc4debd2a)

**Key Finding:** MCP (Model Context Protocol) gives Claude Code direct access to shadcn/ui component registry instead of working off training data.

**What MCP Provides:**
- Current component data from registry
- Access to shadcn.io community ecosystem
- Real-time component specifications

**Recommended Workflow:**

1. **Component Usage:**
   - Default to shadcn/ui for form elements, cards, dialogs
   - Components copy directly into project (full ownership)
   - Built on Radix UI + Tailwind CSS

2. **Tailwind v4 Considerations:**
   - Only new projects use Tailwind v4 + React 19
   - Wrap color values with `hsl()` in `:root` and `.dark`
   - Use `@theme` inline to map CSS variables
   - Set `"tailwind.config": ""` in components.json
   - Use `@tailwindcss/vite` plugin (NOT PostCSS)

3. **Example Prompts:**
   - "Claude, scaffold a new Button.tsx using shadcn/ui and Tailwind"
   - "Claude, generate the Tailwind styles for this mockup screenshot"
   - "use shadcn and implement the color picker component in my app"

**Confidence:** ★★★★☆ (Official shadcn integration + community usage)

---

## Testing & CI/CD Integration

### Test-Driven Development (TDD)

**Source:** [Anthropic Engineering - Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

**Key Finding:** TDD becomes even more powerful with agentic coding.

**Workflow:**
1. Ask Claude to write tests based on expected input/output pairs
2. Be explicit about TDD so it avoids creating mock implementations
3. Use subagents to verify implementation isn't overfitting to tests
4. Run tests automatically before commits

**Pre-commit Hooks:**
```bash
# .pre-commit-config.yaml
- Run linters
- Type checking
- Tests
- Format checking
```

"The robot REALLY wants to commit" - Use pre-commit hooks to ensure quality.

**Confidence:** ★★★★★ (Official Anthropic recommendation)

### GitHub Integration

**Source:** [Builder.io - How I Use Claude Code](https://www.builder.io/blog/claude-code)

**Key Finding:** After running `/install-github-app`, Claude automatically reviews PRs and often finds bugs humans miss - actual logic errors and security issues.

**Advantages:**
- Similar to Cursor's background agents but more customizable
- You control entire container and environment
- Stronger sandboxing and audit controls
- More access to data

**Confidence:** ★★★★☆ (Official feature, growing community adoption)

---

## Productivity & Cost Optimization

### Permission Management

**Sources:**
- [Builder.io - Claude Code Tips](https://www.builder.io/blog/claude-code)
- [Harper Reed's Blog](https://harper.blog/2025/05/08/basic-claude-code/)

**Key Finding:** Setting up always-approved permissions for git, npm, docker, and gh commands eliminates 90% of permission dialogs.

**Options:**
1. Configure always-approved permissions in settings
2. Run `claude --dangerously-skip-permissions` (not as dangerous as it sounds)

**Confidence:** ★★★★☆ (Community best practice)

### Cost Management

**Source:** [Claude Code Workflow Best Practices](https://www.sidetool.co/post/unlocking-efficiency-claude-code-workflow-best-practices-explained/)

**Strategies:**
1. Use custom slash commands for repetitive tasks
2. Clear context frequently to avoid compaction costs
3. Use appropriate thinking depth (don't use ultrathink for simple tasks)
4. Limit subagent chaining (increases token usage significantly)

**Token-Based Pricing:**
Claude Code uses token-based system ($20-$100/month), providing flexibility for varied workloads without abrupt interruptions.

**Confidence:** ★★★★☆ (Community experience)

---

## Claude Code vs Cursor (Community Comparison)

**Sources:**
- [Qodo - Claude Code vs Cursor Deep Comparison](https://www.qodo.ai/blog/claude-code-vs-cursor/)
- [Northflank - Complete Comparison Guide](https://northflank.com/blog/claude-code-vs-cursor-comparison)
- [Stark Insider - Dual AI Workflow](https://www.starkinsider.com/2025/10/claude-vs-cursor-dual-ai-coding-workflow.html)

### Key Differences

| Aspect | Claude Code | Cursor |
|--------|-------------|--------|
| Interface | CLI (terminal-first) | IDE (forked from VS Code) |
| Best For | Autonomous multi-file operations, docs | Real-time code completion, in-editor assistance |
| Workflow | Plan → Execute → Verify | Interactive, exploratory |
| Pricing | Token-based ($20-$100/mo) | Flat tiers ($20-$200/mo) with caps |

### When to Use Which

**Claude Code excels at:**
- Large-scale refactoring
- Automated testing
- Complex project setup
- Documentation generation (loves creating README.md, CLAUDE.md)
- Multi-file operations requiring deep codebase understanding

**Cursor excels at:**
- Inline completion (the star feature)
- Plan mode (dynamically changing document)
- Real-time assistance
- Direct manipulation
- Live experimentation

### Hybrid Approach (Community Consensus)

"Many find that a hybrid approach works best - using Claude Code for heavy lifting and multi-file architecture, and Cursor for precise edits, live experimentation, and direct manipulation."

**Integration:**
With Claude Code Cursor extension, developers get best of both worlds: Claude's natural-language reasoning and Cursor's in-IDE workflow.

**Confidence:** ★★★★☆ (Community comparison, subjective preferences)

---

## Common Pitfalls & Solutions

### Issue: Generic "AI Slop" Design

**Problem:** Claude produces Inter fonts, purple gradients, generic layouts

**Solution:**
1. Use official frontend-design plugin
2. Explicitly tell Claude: "avoid Inter and Roboto"
3. Specify bold aesthetic direction before coding
4. "Use atmospheric backgrounds instead of solid colors"

**Confidence:** ★★★★★ (Official Anthropic guidance)

### Issue: Context Window Fills Up

**Problem:** After 10-20 minutes, effectiveness decreases

**Solution:**
1. Use /clear between major task switches
2. Use /compact for mid-session summarization
3. Use subagents for research to preserve main context
4. Review plan, then start fresh session for implementation

**Confidence:** ★★★★★ (Community consensus)

### Issue: Code Quality Degrades

**Problem:** "LLMs love to output code that technically works but looks awful. The 'sloppification factor' increases linearly with lines written without cleaning."

**Solution:**
1. Implement pre-commit hooks (linting, type checking, tests)
2. Regular code reviews (human or `/install-github-app`)
3. Treat AI output as junior developer work - review everything
4. Use clear CLAUDE.md style guidelines

**Confidence:** ★★★★★ (Community experience)

### Issue: Multimodal Not Working

**Problem:** Pasting images from clipboard doesn't work with Command+V

**Solution:**
- Use Control+V instead
- Or drag-and-drop files (hold Shift to reference properly)
- Claude Code is multimodal - can analyze Figma mocks via paste or file path

**Confidence:** ★★★★☆ (Community troubleshooting)

### Issue: Can't Stop Claude

**Problem:** Control+C exits entirely instead of stopping current task

**Solution:**
- Use Escape to actually stop Claude (not Control+C)

**Confidence:** ★★★★★ (Official keyboard shortcut)

---

## Plugin Marketplace & Skills

**Sources:**
- [Claude Code Plugins Marketplace](https://claudecodemarketplace.com/)
- [GitHub - Claude Code Plugins Plus](https://github.com/jeremylongshore/claude-code-plugins-plus)
- [Claude Code Skills Hub](https://claudecodeplugins.io/)

### Key Marketplaces

1. **Claude Code Plugins Plus Hub** - 243 plugins, 175 with Agent Skills v1.2.0 (100% compliant with Anthropic 2025 Skills schema)
2. **Claude Code Skills Hub** - 185 AI Skills + 255+ plugins
3. **Anthropic Official Skills** - github.com/anthropics/skills

### Popular Skill Categories

| Category | Examples | Auto-Activates When |
|----------|----------|---------------------|
| Git Operations | Auto-stage, commit, push with conventional messages | User mentions pushing changes |
| Testing | Identify and fix failing tests with error grouping | User reports test failures |
| Code Review | Process PR feedback with todo tracking | User provides reviewer comments |
| Documentation | Mintlify components, technical writing | User asks to document code |
| Browser Testing | Chrome DevTools Protocol (27 tools) | User wants web app testing |
| Codebase Analysis | Architecture, security, performance audit | User wants code quality audit |

### Skills vs Commands

**Commands:** Require explicit `/command` trigger
**Skills:** Activate automatically based on context (progressive disclosure)

### Installation

```bash
# Add marketplace
/plugin marketplace add your-org/plugins

# Install plugin
/plugin install plugin-name@marketplace

# Verify
/help
```

**Confidence:** ★★★★★ (Official plugin system)

---

## Real-World Success Stories

### From Zero Frontend Experience to Production

**Source:** [Hacker News Discussion](https://news.ycombinator.com/item?id=45735264)

"User with ZERO experience with frontend built an entire collaborative pixel canvas project using coding AI tools over two days."

**Confidence:** ★★★☆☆ (Anecdotal, impressive claim)

### MVP in One Day

**Source:** [DEV Community - Building Side Project in a Day](https://dev.to/composiodev/i-built-my-complete-side-project-in-a-day-using-claude-code-and-mcp-now-you-know-why-they-dont-22gk)

"Complete MVP for invoice management platform in one day using Claude Code and MCPs. What normally takes weeks, Claude Code handled automatically from database setup to email testing."

**Confidence:** ★★★★☆ (Detailed case study)

### Blog Aggregator from Dusty Requirements

**Source:** [DEV Community - Dusty Requirements to Live Website](https://dev.to/wheeleruniverse/from-dusty-requirements-to-live-website-how-claude-code-built-my-blog-aggregator-in-a-single-day-3jbo)

"From dusty requirements to live website: Claude Code built blog aggregator in a single day."

**Confidence:** ★★★★☆ (Detailed walkthrough)

---

## WPF Integration Recommendations

### Phase 2 Design Draft Integration

Based on this research, WPF's orchestrator should:

1. **Use Frontend-Design Skill**
   - Install official Anthropic frontend-design plugin
   - Configure for industry-specific aesthetic tones
   - Example: Construction = "industrial/utilitarian", Childcare = "playful/soft"

2. **Implement CLAUDE.md Templates**
   - Create industry-specific CLAUDE.md templates
   - Include: Stack (WordPress, Tailwind, etc.), Directory structure, Commands, Style guidelines
   - Use progressive disclosure for documentation

3. **Configure Subagent Workflows**
   - Design Analyzer (reads design spec, suggests aesthetic direction)
   - Code Generator (implements with frontend-design skill)
   - Performance Auditor (runs Lighthouse, suggests optimizations)
   - Content Writer (generates professional copy)

4. **Custom Slash Commands**
   - `/wpf-plan` - Generate implementation plan from discovery data
   - `/wpf-design` - Implement design with industry aesthetic
   - `/wpf-test` - Run Playwright + Lighthouse tests
   - `/wpf-deploy` - Deployment checklist

5. **Pre-commit Hooks**
   - Tailwind CSS build check
   - WordPress coding standards
   - Lighthouse score threshold (>70)
   - Accessibility checks

### Tailwind + shadcn/ui for WordPress

While shadcn/ui is React-focused, the design principles apply:
- Use Tailwind utility classes
- Component-based architecture
- Design tokens via CSS variables
- Copy components into project (full ownership)

For WordPress PHP templates:
- Use Tailwind classes in template files
- Create reusable Tailwind components
- Generate CSS with npm run build
- Use Alpine.js for interactivity (similar to React patterns)

---

## Next Steps for Research

### Areas Requiring Deeper Investigation

1. **WordPress-Specific Workflows**
   - Custom skills for WordPress plugin/theme development
   - WP-CLI integration patterns
   - Database migration workflows

2. **Performance Monitoring**
   - Lighthouse CI integration with Claude Code
   - Automated Core Web Vitals tracking
   - Performance regression detection

3. **Multi-language Support**
   - i18n workflows with Claude Code
   - Translation management
   - RTL layout handling

4. **Accessibility Testing**
   - axe-core integration
   - WCAG 2.1 compliance checks
   - Screen reader testing

---

## References & Sources

### Official Anthropic Documentation
- [Improving Frontend Design Through Skills](https://claude.com/blog/improving-frontend-design-through-skills)
- [Using CLAUDE.md Files](https://www.claude.com/blog/using-claude-md-files)
- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [How to Create Skills](https://www.claude.com/blog/how-to-create-skills-key-steps-limitations-and-examples)
- [Claude Code Documentation](https://code.claude.com/docs/en/)
- [Subagents Documentation](https://code.claude.com/docs/en/sub-agents)

### GitHub Resources
- [anthropics/claude-code - Frontend Design Plugin](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design)
- [anthropics/skills - Official Skills Repository](https://github.com/anthropics/skills)
- [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)
- [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
- [jeremylongshore/claude-code-plugins-plus](https://github.com/jeremylongshore/claude-code-plugins-plus)
- [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)

### Community Articles (dev.to)
- [Supercharging Front-End Development with Claude Skills](https://dev.to/rio14/supercharging-front-end-development-with-claude-skills-22bj)
- [Best Practices for Claude Code Reviews](https://dev.to/s1infeb/best-practices-for-claude-code-reviews-50jd)
- [A Week with Claude Code: Lessons and Workflows](https://dev.to/ujjavala/a-week-with-claude-code-lessons-surprises-and-smarter-workflows-23ip)

### Professional Blogs
- [Builder.io - How I Use Claude Code](https://www.builder.io/blog/claude-code)
- [Builder.io - Cursor vs Claude Code](https://www.builder.io/blog/cursor-vs-claude-code)
- [Arize.com - CLAUDE.md Best Practices](https://arize.com/blog/claude-md-best-practices-learned-from-optimizing-claude-code-with-prompt-learning/)
- [HumanLayer - Writing a Good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [PubNub - Subagent Best Practices](https://www.pubnub.com/blog/best-practices-for-claude-code-sub-agents/)

### Comparison Articles
- [Qodo - Claude Code vs Cursor Deep Comparison](https://www.qodo.ai/blog/claude-code-vs-cursor/)
- [Northflank - Claude Code vs Cursor Guide](https://northflank.com/blog/claude-code-vs-cursor-comparison)
- [Stark Insider - Dual AI Workflow](https://www.starkinsider.com/2025/10/claude-vs-cursor-dual-ai-coding-workflow.html)

### Plugin Marketplaces
- [Claude Code Plugins Marketplace](https://claudecodemarketplace.com/)
- [Claude Code Skills Hub](https://claudecodeplugins.io/)
- [shadcn.io - MCP for Claude Code](https://www.shadcn.io/mcp/claude-code)

### Hacker News Discussions
- [Claude Code on the Web](https://news.ycombinator.com/item?id=45647166)
- [I've Been Loving Claude Code](https://news.ycombinator.com/item?id=45735264)
- [Getting Good Results from Claude Code](https://news.ycombinator.com/item?id=44836879)

---

## Research Methodology

**Search Strategy:**
- Used WebSearch tool with targeted queries
- Prioritized official Anthropic sources (highest confidence)
- Cross-referenced community sources for validation
- Excluded sources <6 months old preference
- Focused on specific examples over generic advice

**Credibility Filters Applied:**
1. Official Anthropic documentation: ★★★★★
2. High-engagement GitHub repositories (100+ stars): ★★★★☆
3. Professional developer blogs with examples: ★★★★☆
4. Community articles with upvotes/engagement: ★★★☆☆
5. Hacker News discussions (multiple corroborations): ★★★☆☆

**Date Coverage:** December 2024 - December 2025 (most sources from 2025)

**Gaps Identified:**
- Limited WordPress-specific community resources
- Few production deployment case studies
- Minimal cost/ROI analysis from businesses

---

**Last Updated:** 2025-12-09
**Next Review:** 2025-03-09 (quarterly updates recommended)
