# Billing Module Rules

## Stripe Integration

### Environment Variables
```bash
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_...
```

### API Usage
- Use Stripe SDK, not direct API calls
- Always use idempotency keys
- Handle rate limits gracefully
- Log all transactions

## Subscription Management

### Lifecycle
```
trial → active → past_due → canceled
                     ↓
              → grace_period → canceled
```

### Trial Period
- 14 days free trial
- No credit card required
- Full access to Pro features
- Email reminder at day 7, 12, 14

### Grace Period
- 7 days after payment failure
- Retry payment 3 times
- Notify user each failure
- Downgrade after grace period

## Webhook Handling

### Security
- Verify webhook signatures
- Use HTTPS endpoint only
- Process asynchronously
- Implement idempotency

### Required Handlers
```typescript
// Subscription created
'customer.subscription.created'

// Payment succeeded
'invoice.paid'

// Payment failed
'invoice.payment_failed'

// Subscription canceled
'customer.subscription.deleted'

// Checkout completed
'checkout.session.completed'
```

## Usage Tracking

### Metered Resources
| Resource | Unit | Free Limit |
|----------|------|------------|
| Projects | count | 3 |
| Storage | GB | 0.5 |
| Bandwidth | GB/mo | 10 |
| Builds | count/mo | 50 |

### Tracking Implementation
```typescript
// Record usage
await trackUsage(userId, 'bandwidth', megabytes);

// Check limits
const allowed = await checkLimit(userId, 'projects');
```

## Pricing Rules

### Changes
- Upgrades: Immediate, prorated
- Downgrades: End of billing period
- Cancellations: End of billing period
- Refunds: Pro-rated, within 14 days

### Discounts
- Annual: 20% discount
- Education: 50% discount
- Non-profit: 50% discount
- Referral: $10 credit

## Security

### PCI Compliance
- Never store card numbers
- Use Stripe Elements for card input
- All payments through Stripe
- No card data in logs

### Data Protection
- Encrypt customer IDs
- Secure webhook endpoints
- Audit logging for transactions
- Retain records for 7 years

## Testing

### Test Mode
- Use `sk_test_` keys in development
- Test cards: 4242424242424242
- Test webhook with Stripe CLI
- Never use production keys in tests

### Required Tests
- Successful payment
- Failed payment (decline)
- Webhook delivery
- Subscription upgrade/downgrade
- Usage limit enforcement
