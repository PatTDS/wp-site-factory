import Stripe from 'stripe';
import { Plan, PLAN_CONFIGS } from '../types/billing.js';

/**
 * Stripe Service for handling payment and subscription operations
 */
export class StripeService {
  private stripe: Stripe;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Stripe API key is required');
    }
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2025-02-24.acacia'
    });
  }

  /**
   * Create a Stripe customer
   */
  async createCustomer(email: string, clerkId: string): Promise<string> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        metadata: {
          clerkId
        }
      });

      return customer.id;
    } catch (error) {
      throw new Error(`Failed to create Stripe customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a checkout session for subscription
   */
  async createCheckoutSession(
    customerId: string,
    plan: Plan,
    successUrl: string,
    cancelUrl: string
  ): Promise<string> {
    if (plan === Plan.FREE) {
      throw new Error('Cannot create checkout session for FREE plan');
    }

    try {
      const planConfig = PLAN_CONFIGS[plan];

      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `WPF ${planConfig.name} Plan`,
                description: `${planConfig.projectLimit === -1 ? 'Unlimited' : planConfig.projectLimit} WordPress projects`
              },
              unit_amount: planConfig.price * 100, // Convert to cents
              recurring: {
                interval: 'month'
              }
            },
            quantity: 1
          }
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          plan
        }
      });

      return session.url || '';
    } catch (error) {
      throw new Error(`Failed to create checkout session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a billing portal session
   */
  async createPortalSession(customerId: string, returnUrl: string): Promise<string> {
    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl
      });

      return session.url;
    } catch (error) {
      throw new Error(`Failed to create portal session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
      return subscription.status === 'canceled';
    } catch (error) {
      throw new Error(`Failed to cancel subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      throw new Error(`Failed to retrieve subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
    webhookSecret: string
  ): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
