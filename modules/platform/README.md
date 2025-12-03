# WPF Platform Module (SaaS)

**Branch:** `module/platform`
**Knowledge Base:** (new - SaaS-specific)
**Status:** Planned

## Overview

The platform module provides the SaaS web interface, user authentication, project management dashboard, and visual design builder.

## Features

- **User Authentication** - Sign up, login, SSO
- **Project Dashboard** - Manage multiple projects
- **Visual Designer** - Drag-and-drop design builder
- **Preview System** - Real-time design preview
- **Team Collaboration** - Multi-user projects

## Directory Structure

```
modules/platform/
├── src/
│   ├── app/            # Next.js application
│   ├── components/     # React components
│   ├── api/            # API routes
│   └── lib/            # Shared utilities
├── prisma/
│   └── schema.prisma   # Database schema
├── tests/
│   └── integration/    # Platform tests
├── README.md
├── RULES.md
└── CLAUDE.md
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| UI | shadcn/ui, Tailwind CSS |
| Auth | Clerk / Auth0 |
| Database | PostgreSQL |
| ORM | Prisma |
| State | Zustand |
| API | tRPC |

## Routes

```
/                    # Landing page
/login              # Authentication
/dashboard          # Project list
/project/[id]       # Project detail
/project/[id]/design # Visual designer
/project/[id]/settings # Project settings
/account            # User settings
/billing            # Subscription management
```

## Dependencies

- Node.js 20+
- PostgreSQL 14+
- Redis (sessions)
- Vercel / Railway (hosting)

## Related Modules

- **webdesign** - Component library
- **orchestrator** - Workflow management
- **billing** - Payment processing
- **infrastructure** - Deployment
