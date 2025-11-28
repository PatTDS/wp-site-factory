# 🎯 COMPLETE GUIDE: ShadCN/UI + Claude Integration

> **Comprehensive guide to mastering shadcn/ui component development with Claude AI, featuring MCP server integration, advanced workflows, and production-ready examples.**

---

## 📋 Table of Contents

1. [Quick Setup Guide](#quick-setup-guide)
2. [MCP Server Deep Dive](#mcp-server-deep-dive)
3. [Advanced Workflows](#advanced-workflows)
4. [Expert Prompting Techniques](#expert-prompting-techniques)
5. [Best Practices & Patterns](#best-practices--patterns)
6. [Common Issues & Solutions](#common-issues--solutions)
7. [Production Examples](#production-examples)
8. [Pro Tips & Tricks](#pro-tips--tricks)
9. [Resources](#resources)

---

## ⚡ Quick Setup Guide

### Method 1: Claude Code (Fastest - 10 seconds)

```bash
# Install via CLI
pnpm dlx shadcn@latest mcp init --client claude

# Alternative: Direct command
claude mcp add --transport http shadcn https://www.shadcn.io/api/mcp
```

### Method 2: Manual Configuration

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

**Post-Setup:**
1. Restart Claude Code completely
2. Run `/mcp` command to verify installation
3. Look for "Connected" status next to shadcn server

---

## 🔧 MCP Server Deep Dive

### What MCP Solves

**The Problem:** AI tools hallucinate component props, use outdated patterns, and mix patterns from different UI libraries.

**The Solution:** MCP provides Claude with **real-time access** to:
- ✅ Current component specifications
- ✅ Accurate TypeScript props
- ✅ Latest usage patterns
- ✅ Component demos and examples
- ✅ Installation instructions

### Token Efficiency Comparison

| Method | Token Usage | Quality |
|--------|-------------|---------|
| AI from scratch | 100k-500k | Variable |
| With MCP | <10k | Consistent |

**Savings:** 90-95% reduction in tokens + guaranteed accuracy

### Available MCP Server Implementations

#### 1. Official shadcn MCP Server (Recommended)

```bash
# Setup
pnpm dlx shadcn@latest mcp init --client claude
```

**Features:**
- Direct registry access
- Multi-registry support
- Authentication for private registries
- Automatic updates

#### 2. @jpisnice/shadcn-ui-mcp-server (Community - Extended Support)

```bash
# Install
npx @jpisnice/shadcn-ui-mcp-server --github-api-key YOUR_TOKEN
```

**Features:**
- React, Svelte 5, and Vue support
- SSE transport for Claude Code
- Component demos included
- Blocks support (dashboards, forms, calendars)

**GitHub Token Benefits:**
- Without token: 60 requests/hour
- With token: 5,000 requests/hour

#### 3. @heilgar/shadcn-ui-mcp-server

```bash
# Add to Claude Code
claude mcp add-json "shadcn-ui-server" '{"command":"npx","args":["@heilgar/shadcn-ui-mcp-server"]}'
```

**Features:**
- `list-blocks` - Browse pre-built sections
- `get-block-docs` - View block documentation
- `install-blocks` - Add complete dashboard/form blocks

### MCP Server Commands

Once installed, use natural language:

```bash
# List components
"use shadcn to give me a list of all components available"

# Get component info
"use shadcn and give me information about color picker component"

# Install component
"use shadcn and implement the color picker component in my app"

# Install multiple
"Add the button, dialog and card components"

# Search across registries
"Find me a login form from the shadcn registry"

# Work with blocks
"Show me available dashboard blocks"
"Install the sidebar navigation block"
```

---

## 🚀 Advanced Workflows

### Workflow 1: The Three-Part System (Production-Ready)

This workflow comes from a developer who **"stopped writing UI code"** entirely.

#### Part 1: MCP Server for Context

Install shadcn MCP server as shown above.

#### Part 2: Structured Planning Files

**Create `rule.mdc`** (Behavioral guidelines):

```markdown
# shadcn/ui Development Rules

## Component Selection
- ALWAYS use existing shadcn/ui components
- NEVER create custom components unless absolutely necessary
- ALWAYS check MCP server for available components first

## Styling
- Use Tailwind utility classes
- Follow shadcn design tokens (hsl(var(--primary)))
- Support dark mode via CSS variables
- NEVER write custom CSS files

## Composition
- Build compound components from shadcn primitives
- Use cn() utility for className management
- Implement forwardRef for interactive components

## Accessibility
- Follow ARIA guidelines
- Ensure keyboard navigation
- Include screen reader support
- WCAG 2.1 AA compliance required

## Implementation
- Use TypeScript with strict typing
- Export components with display names
- Include usage examples in comments
- No todos, no placeholders - complete code only
```

**Create `task.md`** (Implementation plan):

```markdown
# Dashboard Implementation Plan

## Components Needed
1. Sidebar Navigation
   - Use Sheet component for mobile
   - NavigationMenu for desktop
   - Include collapsible sections

2. Data Table
   - Table component from shadcn
   - Sorting functionality
   - Pagination
   - Search/filter

3. Stats Cards
   - Card component
   - Badge for status indicators
   - Trend indicators with icons

## Layout Structure
- Use Grid for responsive layout
- 3 columns on desktop, 1 on mobile
- Sticky header with scroll

## Theming
- Dark mode support
- Custom color scheme: Blue primary, Gray secondary
- Glassmorphism effects on cards
```

#### Part 3: Prompt to Claude

```
@rule.mdc Please implement the UI plan outlined in @task.md
```

**Result:** Claude follows the planning logic tree systematically, producing production-ready code.

#### Part 4: Visual Customization with TweakCN

**Setup:**
1. Visit https://tweakcn.com/editor/theme
2. Customize colors, spacing, borders, typography
3. Preview changes live
4. Export theme code
5. Copy to your project

**Benefits:**
- No-code theming
- Real-time preview
- Tailwind v3 & v4 support
- Professional themes without CSS knowledge

---

### Workflow 2: Official Prompt System

shadcn provides an official system prompt that transforms Claude into a **Senior UI/UX Engineer**.

**Access:** https://www.shadcn.io/prompts/react-shadcn

**Key Instructions from Official Prompt:**

```markdown
You are a Senior UI/UX Engineer specializing in:
- shadcn/ui component patterns
- Radix UI primitives
- TypeScript strict typing
- Tailwind CSS with design tokens
- CVA (Class Variance Authority)
- React modern hooks and composition

## Your Responsibilities:
1. Follow requirements EXACTLY
2. Think step-by-step with pseudocode first
3. Write COMPLETE code (no todos, no placeholders)
4. Ensure WCAG 2.1 AA accessibility
5. Apply production-quality standards
6. Minimal explanation - focus on code

## Technology Rules:
- Use forwardRef for interactive components
- Implement TypeScript interfaces for all props
- Apply CVA for variant management
- Use Tailwind with shadcn design tokens
- Support dark mode through CSS variables
- Follow proper ARIA patterns

## What to Do When Uncertain:
- Admit when unsure about specific Radix primitives
- Search latest documentation
- Ask for clarification rather than guessing
```

**How to Use:**
1. Copy the complete prompt from shadcn.io
2. Paste as system instruction in Claude
3. Reference it with subsequent requests

---

### Workflow 3: Next.js + TypeScript Stack (Enterprise)

Based on the CLAUDE.md guide used by production teams.

**Project Structure:**

```
app/               # Next.js App Router + API routes
components/
  ├── ui/         # shadcn components
  └── custom/     # Compound components
hooks/            # Custom React hooks
lib/
  ├── api/        # API wrappers
  └── utils.ts    # Helper functions
styles/           # Tailwind customizations
tests/            # Jest + RTL
```

**Example Claude Prompts:**

```bash
# Component scaffolding
"Claude, scaffold a new ProfileCard.tsx using shadcn Card, Avatar, and Badge components. Include TypeScript props interface and handle loading/error states."

# Refactoring
"Refactor useUser.ts to use React Query with proper caching and error handling"

# Testing
"Create a test for ProfileCard.tsx using RTL, mocking the user data fetch"

# Hook generation
"Generate a custom hook useDebounce with TypeScript that works with shadcn Input component"
```

**Custom Slash Commands for Claude Code:**

Add to `.claude/commands/`:

```bash
# /generate-hook
Creates a custom React hook with TypeScript

# /wrap-client-component
Converts server component to client component with 'use client'

# /update-tailwind-theme
Updates tailwind.config.js with shadcn design tokens

# /mock-react-query
Generates React Query mocks for testing
```

---

## 💡 Expert Prompting Techniques

### ❌ Generic Prompts (Don't)

```
"Create a dashboard"
"Build a login form"
"Make a data table"
```

**Problem:** Vague requirements lead to generic, unusable code.

### ✅ Specific Prompts (Do)

```
"Create a dark-themed analytics dashboard using shadcn/ui with:
- Sidebar navigation (Sheet for mobile, NavigationMenu for desktop)
- 4 stat cards showing metrics with trend indicators (Card + Badge)
- Data table with sorting, pagination, search (Table component)
- Chart section using Recharts library
- Responsive: 3 columns desktop, 1 column mobile
- Glassmorphism effects on cards
- Use Next.js 14 App Router
- TypeScript with strict typing
- Tailwind CSS with shadcn design tokens"
```

### Prompting Framework: The 5W+H Method

**What:** Specific component/feature
**Why:** Purpose and context
**Where:** Placement in app structure
**When:** User interaction flow
**Who:** Target users (affects UX decisions)
**How:** Technical implementation details

**Example:**

```
WHAT: Authentication form
WHY: User login for dashboard access
WHERE: /login route, standalone page
WHEN: Before accessing protected routes
WHO: Business users, expect professional design
HOW:
- shadcn Form + Input + Button components
- React Hook Form for state management
- Zod for validation
- Email + password fields
- "Remember me" checkbox
- "Forgot password" link
- Error messaging with toast notifications
- Loading states on submission
- Redirect to /dashboard on success
```

### Component-Specific Prompting Patterns

#### For Forms:

```
"Build a multi-step registration form using shadcn/ui:

Step 1: Personal info (Name, Email inputs with Zod validation)
Step 2: Company details (Select dropdown for industry, Input for company name)
Step 3: Preferences (Checkbox group for interests)

Requirements:
- React Hook Form for state
- Zod schema validation
- Progress indicator using Steps component
- Previous/Next buttons (Button component)
- Form data persists between steps
- Submit on final step with loading state
- Error handling with toast notifications"
```

#### For Data Tables:

```
"Create a sortable, filterable data table for user management:

Data Structure:
- User ID, Name, Email, Role, Status, Created Date

Features:
- shadcn Table component
- Column sorting (click header to sort)
- Global search filter (Input with search icon)
- Status badge (Badge component: green=active, red=inactive)
- Actions column (DropdownMenu: Edit, Delete)
- Pagination (10 items per page)
- Row selection with checkbox
- Bulk actions (Button: Delete selected)
- Responsive: horizontal scroll on mobile
- Loading skeleton while fetching data"
```

#### For Dashboards:

```
"Build an admin dashboard homepage with:

Layout:
- Sidebar (fixed, collapsible on mobile using Sheet)
- Top navbar (breadcrumbs, user avatar with DropdownMenu)
- Main content area (responsive grid)

Sections:
1. KPI Cards (4x Card components)
   - Total Users, Revenue, Orders, Growth
   - Include trend indicator (up/down arrow)
   - Number animation on mount

2. Recent Activity (Card with Table)
   - 5 latest transactions
   - Avatar, name, amount, status badge
   - "View all" link

3. Quick Actions (Card with Button grid)
   - 6 common actions as icon buttons
   - Tooltip on hover

Theming:
- Dark mode support
- Blue primary color
- Subtle shadow on cards
- Smooth transitions"
```

---

## 🎯 Best Practices & Patterns

### Component Architecture

#### 1. Composition Over Custom

**❌ Don't:**

```tsx
// Creating custom button from scratch
export function MyButton({ children }) {
  return (
    <button className="px-4 py-2 bg-blue-500 rounded">
      {children}
    </button>
  )
}
```

**✅ Do:**

```tsx
// Compose from shadcn primitives
import { Button } from "@/components/ui/button"

export function MyButton({ children, ...props }) {
  return (
    <Button variant="default" size="lg" {...props}>
      {children}
    </Button>
  )
}
```

#### 2. Proper TypeScript Integration

```tsx
import { Button } from "@/components/ui/button"
import { type VariantProps } from "class-variance-authority"

// Extract shadcn variant types
type ButtonVariants = VariantProps<typeof Button>

interface CustomButtonProps extends ButtonVariants {
  label: string
  onClick: () => void
  isLoading?: boolean
}

export function CustomButton({
  label,
  onClick,
  isLoading = false,
  variant = "default",
  ...props
}: CustomButtonProps) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : label}
    </Button>
  )
}
```

#### 3. CVA for Variant Management

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        destructive: "border-destructive bg-destructive/10",
        success: "border-green-500 bg-green-500/10",
      },
      size: {
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

interface CustomCardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode
  className?: string
}

export function CustomCard({
  children,
  variant,
  size,
  className
}: CustomCardProps) {
  return (
    <div className={cn(cardVariants({ variant, size }), className)}>
      {children}
    </div>
  )
}
```

### Form Handling

#### shadcn + React Hook Form + Zod Pattern

```tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// 1. Define Zod schema
const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

export function ProfileForm() {
  // 2. Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  })

  // 3. Submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### Styling Best Practices

#### 1. Use Design Tokens

```tsx
// ❌ Don't: Hardcoded colors
className="bg-blue-500 text-white"

// ✅ Do: Design tokens
className="bg-primary text-primary-foreground"

// ❌ Don't: Direct HSL values
style={{ background: "hsl(222, 47%, 11%)" }}

// ✅ Do: CSS variables
className="bg-background"
```

#### 2. Dark Mode Support

```tsx
// Tailwind automatically handles dark mode via CSS variables
<div className="bg-card text-card-foreground">
  {/* Works in both light and dark mode */}
</div>

// For custom styling:
<div className="bg-white dark:bg-slate-900">
  {/* Explicit dark mode override */}
</div>
```

#### 3. cn() Utility Usage

```tsx
import { cn } from "@/lib/utils"

// Combine classes safely
<div className={cn(
  "base-class",
  isActive && "active-class",
  props.className
)}>
```

### Components vs Blocks

| Aspect | Components | Blocks |
|--------|-----------|--------|
| **What** | Individual UI elements (Button, Input, Card) | Pre-composed sections (Dashboard, Login Form) |
| **Complexity** | Simple, single-purpose | Complex, multi-component |
| **Customization** | High - build from scratch | Medium - modify existing |
| **Use When** | Need flexibility | Need speed |
| **Examples** | Dialog, Select, Checkbox | Sidebar Navigation, Stats Dashboard |

**When to Use Components:**
- Building unique layouts
- Maximum control needed
- Learning shadcn patterns

**When to Use Blocks:**
- Rapid prototyping
- Common UI patterns (dashboard, auth)
- Production deadline pressure

---

## 🐛 Common Issues & Solutions

### Issue 1: MCP Server Not Responding

**Symptoms:**
- `/mcp` shows no servers
- "No tools" message
- Commands not recognized

**Solutions:**

```bash
# 1. Verify configuration
cat .mcp.json  # Check syntax

# 2. Clear npx cache
npx clear-npx-cache

# 3. Restart Claude Code completely
# Close terminal, reopen, restart session

# 4. Re-initialize
pnpm dlx shadcn@latest mcp init --client claude

# 5. Check logs
# Look for errors in Claude Code output
```

**Debugging with MCP Inspector:**

```bash
# Launch inspector
npx @modelcontextprotocol/inspector

# Access debugging tools in browser
# Provides detailed connection info
```

### Issue 2: Component Installation Fails

**Error:** `"Failed to install component"`

**Causes & Fixes:**

```bash
# Cause 1: Missing components.json
# Fix: Initialize project
npx shadcn@latest init

# Cause 2: Wrong directory
# Fix: Ensure you're in project root
cd /path/to/project
npx shadcn@latest add button

# Cause 3: Invalid components.json
# Fix: Validate JSON syntax
cat components.json | jq .  # Pretty-print and validate

# Cause 4: Permission issues
# Fix: Check write permissions
ls -la components/ui/
```

### Issue 3: Registry Access Denied

**For Private Registries:**

```json
// components.json
{
  "registries": {
    "@internal": {
      "url": "https://internal.company.com/{name}.json",
      "headers": {
        "Authorization": "Bearer ${COMPANY_TOKEN}"
      }
    }
  }
}
```

```bash
# .env.local
COMPANY_TOKEN=your_secret_token_here
```

**Verify Access:**

```bash
curl -H "Authorization: Bearer $COMPANY_TOKEN" \
  https://internal.company.com/button.json
```

### Issue 4: Components Look Different

**Problem:** Installed components don't match documentation

**Causes:**

1. **Wrong Style:** Default style deprecated - use `new-york`

```bash
# Check current style
cat components.json | grep style

# Reinitialize with correct style
npx shadcn@latest init --style new-york
```

2. **Missing Tailwind Config:**

```js
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // shadcn CSS variables
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ... rest of colors
      },
    },
  },
}
```

3. **Missing CSS Variables:**

```css
/* globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... all shadcn variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode values */
  }
}
```

### Issue 5: Claude Generates Wrong Props

**Problem:** AI suggests props that don't exist

**Cause:** Not using MCP server

**Fix:**

```bash
# Ensure MCP is connected
claude mcp add --transport http shadcn https://www.shadcn.io/api/mcp

# Verify connection
/mcp

# Explicitly reference in prompts
"Using the shadcn MCP server, implement a Button component with..."
```

### Issue 6: TypeScript Errors

**Error:** `Cannot find module '@/components/ui/button'`

**Fix:** Configure path aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

```json
// components.json
{
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

## 🏆 Production Examples

### Example 1: E-commerce Product Card

**Prompt to Claude:**

```
Using shadcn/ui MCP server, create a ProductCard component for an e-commerce site:

Features:
- Product image with hover zoom effect
- Product title and description
- Price display (original + sale price if on sale)
- Rating stars (5-star system with half-stars)
- "Add to Cart" button with loading state
- "Quick View" icon button on hover
- Badge for "New" or "Sale" tags
- Responsive: stacks on mobile

Tech:
- TypeScript with strict typing
- shadcn Card, Badge, Button components
- Tailwind for animations
- Props: product object with id, title, description, price, salePrice, image, rating, isNew, onSale
```

**Claude Output:**

```tsx
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: {
    id: string
    title: string
    description: string
    price: number
    salePrice?: number
    image: string
    rating: number
    isNew: boolean
    onSale: boolean
  }
  onAddToCart: (id: string) => Promise<void>
  onQuickView: (id: string) => void
}

export function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = async () => {
    setIsLoading(true)
    await onAddToCart(product.id)
    setIsLoading(false)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => {
      const filled = i < Math.floor(rating)
      const half = i === Math.floor(rating) && rating % 1 !== 0
      return (
        <span key={i} className="text-yellow-400">
          {filled ? "★" : half ? "⯨" : "☆"}
        </span>
      )
    })
  }

  return (
    <Card
      className="relative overflow-hidden transition-shadow hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          className={cn(
            "h-full w-full object-cover transition-transform duration-300",
            isHovered && "scale-110"
          )}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {product.isNew && (
            <Badge variant="default">New</Badge>
          )}
          {product.onSale && (
            <Badge variant="destructive">Sale</Badge>
          )}
        </div>

        {/* Quick View Button */}
        <Button
          size="icon"
          variant="secondary"
          className={cn(
            "absolute top-2 right-2 transition-opacity",
            isHovered ? "opacity-100" : "opacity-0"
          )}
          onClick={() => onQuickView(product.id)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-1">{product.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {product.description}
        </p>

        <div className="flex items-center gap-1 mt-2">
          {renderStars(product.rating)}
          <span className="text-sm text-muted-foreground ml-1">
            ({product.rating})
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          {product.onSale && product.salePrice ? (
            <>
              <span className="text-lg font-bold text-primary">
                ${product.salePrice.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <Button
          className="w-full mt-4"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  )
}
```

### Example 2: Kanban Board

From the LogRocket article demonstrating MCP effectiveness.

**Prompt:**

```
Build a drag-and-drop Kanban board for article workflow:

Columns (6):
1. Topic Research
2. Outline
3. First Draft
4. Review
5. Revision
6. Publication & Launch

Card Requirements:
- Title (editable inline)
- Description (expandable)
- Priority badge (High/Medium/Low with colors)
- Due date (with overdue indicator)
- Move between columns via drag-drop

Tech Stack:
- shadcn Card, Badge, Button components
- @dnd-kit/core for drag-drop
- TypeScript interfaces for Article type
- Responsive: horizontal scroll on mobile
```

**Result with MCP:** Clean, functional code using proper shadcn components

**Result without MCP:** Broken code with imaginary props, outdated patterns

---

## 🎓 Pro Tips & Tricks

### 1. Multi-Registry Setup for Teams

```json
// components.json
{
  "registries": {
    "@company": "https://registry.company.com/{name}.json",
    "@design-system": "https://ds.company.com/{name}.json",
    "shadcn": "https://ui.shadcn.com/r/{name}.json"
  }
}
```

```bash
# Install from specific registry
npx shadcn@latest add @company/custom-button
npx shadcn@latest add @design-system/header
npx shadcn@latest add button  # Default registry
```

### 2. GitHub Token for Rate Limits

```bash
# Generate token: github.com/settings/tokens
# Scope: public_repo

# Use with MCP server
npx @jpisnice/shadcn-ui-mcp-server --github-api-key ghp_YOUR_TOKEN

# Increases limit: 60/hour → 5,000/hour
```

### 3. Custom Component Registry

Host your own components:

```bash
# Clone template
git clone https://github.com/shadcn-ui/registry-template

# Structure:
registry/
  └── new-york/
      └── custom-button/
          ├── index.tsx
          └── package.json

# Build registry
npm run build

# Deploy to public URL
# Configure in components.json
```

### 4. Keyboard Shortcuts in Claude Code

```bash
# Clear chat for fresh context
/clear

# View MCP servers
/mcp

# Reference files
Hold Shift + drag file

# Paste images
Ctrl+V (not Cmd+V)

# Stop execution
Escape (not Ctrl+C)

# Previous messages
Escape twice
```

### 5. Optimizing Prompts for Speed

**Bad:** Long conversation back-and-forth

**Good:** Complete spec upfront

```
Build a user settings page with 3 tabs using shadcn Tabs component:

Tab 1 - Profile:
- Avatar upload (Button + Input type="file")
- Name, email, bio (Input + Textarea)
- Save button

Tab 2 - Preferences:
- Theme selector (Select: light/dark/system)
- Language (Select: EN/ES/FR)
- Notifications toggle (Switch)

Tab 3 - Security:
- Change password form (2x Input type="password")
- 2FA toggle (Switch)
- Sessions table (Table component)

Form validation with Zod, React Hook Form
Toast notifications on save
Loading states on all actions
TypeScript strict mode
```

### 6. Component Testing Pattern

```tsx
// ProductCard.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard } from './ProductCard'

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    title: 'Test Product',
    description: 'Test description',
    price: 99.99,
    image: '/test.jpg',
    rating: 4.5,
    isNew: true,
    onSale: false,
  }

  it('renders product information', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={jest.fn()}
        onQuickView={jest.fn()}
      />
    )

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })

  it('calls onAddToCart when button clicked', async () => {
    const mockAddToCart = jest.fn().mockResolvedValue(undefined)

    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={mockAddToCart}
        onQuickView={jest.fn()}
      />
    )

    const addButton = screen.getByText('Add to Cart')
    await userEvent.click(addButton)

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith('1')
    })
  })
})
```

**Prompt for Claude:**

```
Generate Jest + RTL tests for the ProductCard component covering:
- Renders all product data
- Shows "New" badge when isNew=true
- Shows sale price when onSale=true
- Calls onAddToCart on button click
- Shows loading state during add to cart
- Quick view button appears on hover
- Accessibility: proper ARIA labels
```

### 7. Performance Optimization Checklist

```tsx
// ✅ Memoize expensive components
import { memo } from 'react'

export const ProductCard = memo(({ product, ...props }) => {
  // Component code
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.product.id === nextProps.product.id
})

// ✅ Lazy load heavy components
import { lazy, Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<Skeleton className="h-[400px]" />}>
      <HeavyChart />
    </Suspense>
  )
}

// ✅ Debounce search inputs
import { useDebouncedValue } from '@/hooks/use-debounced-value'

export function SearchBar() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 500)

  // Use debouncedSearch for API calls
}
```

---

## 📊 Decision Matrix

### When to Use shadcn + Claude vs Alternatives

| Scenario | Best Choice | Why |
|----------|-------------|-----|
| Rapid prototyping | v0.dev | Fastest, chat-based |
| Production app | shadcn + Claude | Quality + control |
| Design system | shadcn registry | Consistency |
| Simple landing page | Bolt.new | All-in-one |
| Complex dashboard | shadcn blocks + Claude | Pre-built + customizable |
| Learning React | shadcn components | See source code |

### Claude Model Selection

| Task | Model | Reason |
|------|-------|--------|
| Simple component | Claude 3 Haiku | Fast, cheap |
| Complex dashboard | Claude 3.7 Sonnet | Best quality |
| Refactoring | Claude 3.7 Sonnet | Context understanding |
| Bug fixes | Claude 3 Haiku | Quick fixes |

---

## 🎯 Action Plan for Getting Started

### Day 1: Setup (30 minutes)
1. ✅ Install shadcn MCP server
2. ✅ Initialize project with `components.json`
3. ✅ Add first component (Button) to test
4. ✅ Verify MCP connection with `/mcp`
5. ✅ Read official shadcn prompt

### Day 2: Learn Patterns (2 hours)
1. ✅ Build a form with React Hook Form + Zod
2. ✅ Create a data table with sorting
3. ✅ Implement dark mode toggle
4. ✅ Build compound component (Card with header/footer)

### Day 3: Advanced (3 hours)
1. ✅ Create `rule.mdc` and `task.md` files
2. ✅ Build complete dashboard using structured workflow
3. ✅ Customize theme with TweakCN
4. ✅ Add tests for key components

### Week 2: Production
1. ✅ Set up private registry for team components
2. ✅ Create custom slash commands
3. ✅ Build design system documentation
4. ✅ Optimize bundle size and performance

---

## 📚 Resources

### Official Documentation
- **shadcn MCP Docs:** https://ui.shadcn.com/docs/mcp
- **Official Prompt:** https://www.shadcn.io/prompts/react-shadcn
- **Components:** https://ui.shadcn.com/docs/components
- **Blocks:** https://ui.shadcn.com/docs/blocks

### MCP Servers
- **@jpisnice/shadcn-ui-mcp-server:** https://github.com/Jpisnice/shadcn-ui-mcp-server
- **@heilgar/shadcn-ui-mcp-server:** https://github.com/heilgar/shadcn-ui-mcp-server
- **MCP Inspector:** `npx @modelcontextprotocol/inspector`

### Tools
- **TweakCN:** https://tweakcn.com
- **Cursor Rules:** https://cursor.directory/rules/shadcn-ui
- **Claude Code Docs:** https://code.claude.com/docs

### Learning Resources
- **Real Examples:** https://blog.bajonczak.com/mcp-server-shadcn-ui-automation/
- **Form Handling:** https://wasp.sh/blog/2024/11/20/building-react-forms-with-ease-using-react-hook-form-and-zod
- **LogRocket Guide:** https://blog.logrocket.com/ai-shadcn-components/
- **Design+Code Course:** https://designcode.io/cursor-v0-chat-and-shadcn-ui/

### Community Resources
- **Awesome shadcn/ui:** https://github.com/birobirobiro/awesome-shadcn-ui
- **Awesome Claude Skills:** https://github.com/travisvn/awesome-claude-skills
- **ShadCN Blocks:** https://www.shadcnblocks.com/
- **ShadCN Studio:** https://shadcnstudio.com/

---

## 🎓 Final Summary

This comprehensive guide covers **everything** you need to master ShadCN/UI + Claude integration:

### Key Takeaways:

1. **MCP Server is Essential** - Reduces token usage by 90%+ and ensures accurate component generation
2. **Structured Workflows Win** - Use `rule.mdc` + `task.md` pattern for production-quality results
3. **Specificity Matters** - Detailed prompts (5W+H method) produce better code
4. **Composition > Custom** - Always build from shadcn primitives, never from scratch
5. **Test & Optimize** - Use the patterns provided for performance and reliability

### Quick Wins:

- ⚡ **Setup in 10 seconds:** `pnpm dlx shadcn@latest mcp init --client claude`
- 🎨 **Theme in minutes:** Use TweakCN visual editor
- 📦 **Pre-built sections:** Leverage blocks for dashboards, forms
- 🧪 **Production patterns:** Copy-paste examples from this guide

### Next Steps:

1. Set up MCP server now (takes 10 seconds)
2. Try the ProductCard example to see it in action
3. Build your first dashboard using the structured workflow
4. Share your results and iterate

You now have **expert-level knowledge** of shadcn/ui + Claude integration. Go build something amazing! 🚀

---

**Document Version:** 1.0
**Last Updated:** November 2024
**Author:** Based on comprehensive research of official documentation, community tutorials, and production examples

**License:** MIT - Feel free to use, share, and adapt this guide

**Contributing:** Found an error or have a suggestion? Please contribute improvements to help the community!
