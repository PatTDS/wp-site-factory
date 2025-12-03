# WPF Orchestrator Module

**Branch:** `module/orchestrator`
**Knowledge Base:** `@wordpress-knowledge-base/orchestrator/`
**Status:** Planned

## Overview

The orchestrator module manages AI workflows, multi-project coordination, context management, and automation pipelines.

## Features

- **AI Context Management** - Maintain context across sessions
- **Workflow Automation** - Multi-step task orchestration
- **Multi-Project** - Coordinate across projects
- **Agent Coordination** - Parallel agent management
- **Learning System** - Capture and merge learnings

## Directory Structure

```
modules/orchestrator/
├── src/
│   ├── context/        # AI context management
│   ├── workflow/       # Workflow definitions
│   ├── agents/         # Agent coordination
│   └── learning/       # Learning capture
├── lib/
│   ├── context.sh      # Context helpers
│   ├── workflow.sh     # Workflow helpers
│   └── learning.sh     # Learning helpers
├── tests/
│   └── workflows/      # Workflow tests
├── README.md
├── RULES.md
└── CLAUDE.md
```

## Commands

```bash
wpf learn                    # Capture learning
wpf knowledge review         # Review learnings
wpf knowledge merge          # Merge to KB
wpf workflow run <workflow>  # Run workflow
wpf context save             # Save context
```

## Workflow Types

| Type | Description |
|------|-------------|
| project-creation | New project workflow |
| design-approval | Design review workflow |
| deployment | Deployment workflow |
| maintenance | Regular maintenance |

## Dependencies

- jq (JSON processing)
- Git (version control)
- tmux (parallel agents)

## Related Modules

- **tools** - CLI integration
- **platform** - SaaS orchestration
- All modules - Workflow coordination
