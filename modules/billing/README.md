# WPF Billing Module

**Branch:** `module/billing`
**Knowledge Base:** (new - billing-specific)
**Status:** Planned

## Overview

The billing module handles Stripe integration, subscription management, usage tracking, and invoicing.

## Features

- **Stripe Integration** - Payment processing
- **Subscription Plans** - Tiered pricing
- **Usage Tracking** - Metered billing
- **Invoicing** - Automatic invoices
- **Customer Portal** - Self-service billing

## Directory Structure

```
modules/billing/
├── src/
│   ├── stripe/         # Stripe API integration
│   ├── subscriptions/  # Subscription logic
│   ├── usage/          # Usage tracking
│   └── webhooks/       # Stripe webhooks
├── lib/
│   ├── stripe.ts       # Stripe client
│   └── pricing.ts      # Pricing logic
├── tests/
│   └── billing/        # Billing tests
├── README.md
├── RULES.md
└── CLAUDE.md
```

## Pricing Tiers

| Plan | Price | Projects | Features |
|------|-------|----------|----------|
| Free | $0/mo | 3 | Basic components |
| Pro | $29/mo | 10 | All components, priority support |
| Team | $79/mo | Unlimited | Team collaboration, custom domains |
| Enterprise | Custom | Unlimited | SLA, dedicated support |

## Webhooks

| Event | Action |
|-------|--------|
| checkout.session.completed | Activate subscription |
| invoice.paid | Update billing date |
| invoice.payment_failed | Notify user, grace period |
| customer.subscription.deleted | Downgrade to free |

## Dependencies

- Stripe API
- PostgreSQL (billing records)
- Redis (usage caching)

## Related Modules

- **platform** - User management
- **infrastructure** - Resource provisioning
