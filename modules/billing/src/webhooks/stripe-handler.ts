import Stripe from 'stripe';
import { Plan, SubscriptionEvent } from '../types/billing.js';

/**
 * Webhook event handler type
 */
export type WebhookHandler = (event: SubscriptionEvent) => Promise<void>;

/**
 * Stripe Webhook Handler
 */
export class StripeWebhookHandler {
  private handlers: Map<string, WebhookHandler> = new Map();

  /**
   * Register event handler
   */
  on(eventType: SubscriptionEvent['type'], handler: WebhookHandler): void {
    this.handlers.set(eventType, handler);
  }

  /**
   * Handle Stripe webhook event
   */
  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event);
          break;

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook event:', error);
      throw error;
    }
  }

  /**
   * Handle checkout session completed
   */
  private async handleCheckoutCompleted(event: Stripe.Event): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;

    if (!session.customer || !session.subscription) {
      console.warn('Missing customer or subscription in checkout session');
      return;
    }

    const plan = (session.metadata?.plan as Plan) || Plan.FREE;
    const customerId = session.customer as string;

    const subscriptionEvent: SubscriptionEvent = {
      type: 'created',
      customerId,
      plan,
      timestamp: new Date(),
      metadata: {
        subscriptionId: session.subscription,
        sessionId: session.id
      }
    };

    const handler = this.handlers.get('created');
    if (handler) {
      await handler(subscriptionEvent);
    }
  }

  /**
   * Handle subscription updated
   */
  private async handleSubscriptionUpdated(event: Stripe.Event): Promise<void> {
    const subscription = event.data.object as Stripe.Subscription;

    if (!subscription.customer) {
      console.warn('Missing customer in subscription update');
      return;
    }

    // Determine plan from subscription metadata or price
    const plan = this.extractPlanFromSubscription(subscription);
    const customerId = subscription.customer as string;

    const subscriptionEvent: SubscriptionEvent = {
      type: 'updated',
      customerId,
      plan,
      timestamp: new Date(),
      metadata: {
        subscriptionId: subscription.id,
        status: subscription.status
      }
    };

    const handler = this.handlers.get('updated');
    if (handler) {
      await handler(subscriptionEvent);
    }
  }

  /**
   * Handle subscription deleted/cancelled
   */
  private async handleSubscriptionDeleted(event: Stripe.Event): Promise<void> {
    const subscription = event.data.object as Stripe.Subscription;

    if (!subscription.customer) {
      console.warn('Missing customer in subscription deletion');
      return;
    }

    const customerId = subscription.customer as string;

    const subscriptionEvent: SubscriptionEvent = {
      type: 'cancelled',
      customerId,
      plan: Plan.FREE, // Downgrade to FREE on cancellation
      timestamp: new Date(),
      metadata: {
        subscriptionId: subscription.id,
        cancelledAt: subscription.canceled_at
      }
    };

    const handler = this.handlers.get('cancelled');
    if (handler) {
      await handler(subscriptionEvent);
    }
  }

  /**
   * Extract plan from subscription
   */
  private extractPlanFromSubscription(subscription: Stripe.Subscription): Plan {
    // Check metadata first
    if (subscription.metadata?.plan) {
      return subscription.metadata.plan as Plan;
    }

    // Fallback to checking price amount
    const priceAmount = subscription.items.data[0]?.price.unit_amount;

    if (!priceAmount) {
      return Plan.FREE;
    }

    // Match price to plan (amount is in cents)
    const amountInDollars = priceAmount / 100;

    if (amountInDollars === 29) {
      return Plan.PRO;
    } else if (amountInDollars === 99) {
      return Plan.ENTERPRISE;
    }

    return Plan.FREE;
  }
}
