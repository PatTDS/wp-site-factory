# Platform Module Rules (SaaS)

## Authentication

### Requirements
- Email + password authentication
- Social login (Google, GitHub)
- Email verification required
- Password requirements: 8+ chars, mixed case, number
- Rate limiting on login attempts
- Session timeout: 7 days (remember me: 30 days)

### Authorization
| Role | Permissions |
|------|-------------|
| owner | Full access, billing, delete |
| admin | Project settings, team management |
| editor | Edit content, design |
| viewer | Read-only access |

## Database Schema

### Core Tables
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  projects  Project[]
  createdAt DateTime @default(now())
}

model Project {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  owner     User     @relation(fields: [ownerId])
  ownerId   String
  design    Json?
  status    ProjectStatus
  createdAt DateTime @default(now())
}

enum ProjectStatus {
  DRAFT
  ACTIVE
  DEPLOYED
  ARCHIVED
}
```

## API Standards

### REST Endpoints
```
GET    /api/projects          # List projects
POST   /api/projects          # Create project
GET    /api/projects/:id      # Get project
PATCH  /api/projects/:id      # Update project
DELETE /api/projects/:id      # Delete project
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

### Error Format
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "Project not found"
  }
}
```

## Frontend Standards

### Component Structure
```
components/
├── ui/           # shadcn/ui components
├── features/     # Feature-specific components
├── layout/       # Layout components
└── shared/       # Shared utilities
```

### State Management
- Server state: React Query / tRPC
- Client state: Zustand
- Form state: React Hook Form

### Styling
- Tailwind CSS utility classes
- shadcn/ui components
- CSS variables for theming
- Dark mode support

## Multi-Tenancy

### Isolation
- Each user sees only their projects
- Database queries always filter by userId
- File storage isolated per project
- Separate subdomains per project (optional)

### Resource Limits (Free Tier)
| Resource | Limit |
|----------|-------|
| Projects | 3 |
| Storage | 500MB |
| Bandwidth | 10GB/month |
| Team members | 1 |

## Security

### Required Measures
- HTTPS only
- CSRF protection
- XSS prevention (React handles)
- SQL injection prevention (Prisma)
- Rate limiting
- Input validation (Zod)

### Sensitive Data
- Hash passwords (bcrypt)
- Encrypt API keys
- Never log credentials
- PII handling compliance

## Performance

### Targets
- Time to First Byte: < 200ms
- Largest Contentful Paint: < 2.5s
- First Input Delay: < 100ms
- Build time: < 2 minutes

### Optimization
- Server components by default
- Client components only when needed
- Image optimization (next/image)
- Code splitting per route

## Testing

### Requirements
- Unit tests for utilities
- Integration tests for API
- E2E tests for critical flows
- Coverage: > 70%

### Critical Flows to Test
- User registration
- Login/logout
- Project creation
- Design save/load
- Deployment trigger
