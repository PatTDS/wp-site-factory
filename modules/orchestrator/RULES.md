# Orchestrator Module Rules

## Context Management

### Context Window Limits
| Usage | Status | Action |
|-------|--------|--------|
| 0-30% | Optimal | Continue |
| 30-40% | Warning | Plan to clear |
| 40-60% | Degraded | Clear now |
| 60%+ | Critical | Immediate clear |

### Context Preservation
- Save key decisions to project files
- Use `wpf learn` to capture insights
- Document reasoning in CLAUDE.md files
- Store state in JSON files

## Workflow Patterns

### Standard Workflow Structure
```yaml
name: workflow-name
version: 1.0
steps:
  - id: step-1
    action: action-type
    params: {}
    next: step-2
  - id: step-2
    action: action-type
    depends: [step-1]
```

### Workflow States
| State | Description |
|-------|-------------|
| pending | Not yet started |
| running | Currently executing |
| waiting | Waiting for input |
| completed | Successfully finished |
| failed | Error occurred |
| cancelled | User cancelled |

## Learning Capture

### When to Capture
- Bug fixes with non-obvious solutions
- Performance optimizations
- Security discoveries
- Integration patterns
- Tool configurations

### Learning Format
```json
{
  "date": "2025-01-01",
  "category": "wordpress",
  "title": "Short title",
  "problem": "What was the issue",
  "solution": "How it was solved",
  "keywords": ["keyword1", "keyword2"]
}
```

### Categories
- wordpress
- webdesign
- deployment
- performance
- testing
- security

## Agent Coordination

### Parallel Agents
- Use tmux for parallel execution
- Each agent has isolated context
- Coordinate via shared files
- Merge results at completion

### Agent Types
| Type | Purpose |
|------|---------|
| explore | Codebase exploration |
| plan | Implementation planning |
| execute | Code execution |
| review | Code review |

## Multi-Project Management

### Project States
```
draft → active → staging → production → archived
```

### Cross-Project Rules
- Never modify multiple projects simultaneously
- Use project registry for coordination
- Isolate Docker environments
- Separate git branches

## Error Handling

### Workflow Errors
1. Log error details
2. Attempt retry (if applicable)
3. Notify user
4. Save state for recovery
5. Document in learning system

### Recovery
- Save checkpoints during long workflows
- Enable resume from last successful step
- Provide rollback capability

## Automation Rules

### Allowed Automations
- File creation/modification
- Git operations (non-destructive)
- Docker commands
- Test execution
- Build processes

### Require Approval
- Production deployments
- Database modifications
- Security changes
- Billing actions
- User data access

## Knowledge Base Reference

- `@wordpress-knowledge-base/orchestrator/ref-agent-patterns.md`
- `@wordpress-knowledge-base/orchestrator/howto-workflow-design.md`
- `@wordpress-knowledge-base/orchestrator/ref-context-management.md`
