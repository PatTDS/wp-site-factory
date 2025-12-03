# Infrastructure Module Rules

## Docker Standards

### Dockerfile Best Practices
```dockerfile
# Use specific version tags
FROM node:20-alpine

# Multi-stage builds for smaller images
FROM node:20-alpine AS builder
RUN npm ci && npm run build

FROM node:20-alpine AS runner
COPY --from=builder /app/.next .next

# Run as non-root user
USER node

# Explicit expose
EXPOSE 3000
```

### Docker Compose
- Use version 3.8+
- Define all services explicitly
- Use named volumes
- Include healthchecks
- Environment via .env files

## CI/CD Standards

### GitHub Actions
```yaml
name: CI/CD
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    # ... deployment steps
```

### Required Checks
- Linting passes
- Tests pass
- Build succeeds
- Security scan clean
- Coverage threshold met

## Terraform Standards

### File Structure
```
terraform/
├── main.tf           # Main configuration
├── variables.tf      # Input variables
├── outputs.tf        # Output values
├── providers.tf      # Provider configuration
├── backend.tf        # State backend
└── modules/          # Reusable modules
```

### Naming Conventions
- Resources: `<provider>_<type>_<name>`
- Variables: `snake_case`
- Outputs: `snake_case`
- Tags: Include environment, project, managed_by

### State Management
- Remote state (S3, GCS)
- State locking enabled
- Separate state per environment
- Never commit state files

## Kubernetes Standards

### Resource Naming
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wpf-web
  namespace: wpf-production
  labels:
    app: wpf
    component: web
    environment: production
```

### Required Resources
- Deployment (not bare pods)
- Service for networking
- Ingress for external access
- ConfigMap for configuration
- Secret for credentials
- HPA for scaling

### Security
- Network policies
- Pod security standards
- RBAC for service accounts
- Secrets from external manager

## Monitoring Standards

### Required Metrics
| Metric | Purpose |
|--------|---------|
| CPU usage | Resource planning |
| Memory usage | OOM prevention |
| Request latency | Performance |
| Error rate | Reliability |
| Active users | Capacity planning |

### Alerting Thresholds
| Condition | Severity |
|-----------|----------|
| Error rate > 1% | Warning |
| Error rate > 5% | Critical |
| Latency p99 > 2s | Warning |
| CPU > 80% | Warning |
| Memory > 90% | Critical |

### Logging
- Structured JSON logs
- Include trace IDs
- Log levels: debug, info, warn, error
- Centralized log aggregation
- 30-day retention minimum

## Security

### Secrets Management
- Never commit secrets
- Use environment variables
- External secrets manager (Vault, AWS Secrets)
- Rotate regularly
- Audit access

### Network Security
- VPC isolation
- Private subnets for databases
- WAF for web applications
- DDoS protection
- TLS everywhere

## Disaster Recovery

### Backup Requirements
- Database: Daily, 30-day retention
- Files: Weekly, 90-day retention
- Configuration: Stored in git
- Test restores quarterly

### RTO/RPO Targets
| Tier | RTO | RPO |
|------|-----|-----|
| Critical | 1 hour | 0 (sync replication) |
| Standard | 4 hours | 1 hour |
| Low | 24 hours | 24 hours |
