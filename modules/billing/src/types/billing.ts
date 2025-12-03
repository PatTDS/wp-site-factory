/**
 * Subscription Plan Types
 */
export enum Plan {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

/**
 * Plan Configuration
 */
export interface PlanConfig {
  name: string;
  price: number;
  projectLimit: number;
  features: string[];
}

/**
 * Plan Configurations
 */
export const PLAN_CONFIGS: Record<Plan, PlanConfig> = {
  [Plan.FREE]: {
    name: 'Free',
    price: 0,
    projectLimit: 1,
    features: [
      '1 WordPress project',
      'Basic templates',
      'Community support',
      'Docker development environment'
    ]
  },
  [Plan.PRO]: {
    name: 'Pro',
    price: 29, // $29/month
    projectLimit: 10,
    features: [
      'Up to 10 WordPress projects',
      'Premium templates',
      'Priority support',
      'Advanced deployment tools',
      'Performance monitoring',
      'Automated backups'
    ]
  },
  [Plan.ENTERPRISE]: {
    name: 'Enterprise',
    price: 99, // $99/month
    projectLimit: -1, // Unlimited
    features: [
      'Unlimited WordPress projects',
      'All premium templates',
      '24/7 dedicated support',
      'Custom templates',
      'White-label options',
      'Advanced analytics',
      'Multi-server deployment',
      'Team collaboration'
    ]
  }
};

/**
 * Customer Record
 */
export interface Customer {
  id: string;
  clerkId: string;
  email: string;
  stripeCustomerId: string | null;
  plan: Plan;
  subscriptionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Subscription Event
 */
export interface SubscriptionEvent {
  type: 'created' | 'updated' | 'cancelled';
  customerId: string;
  plan: Plan;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Usage Statistics
 */
export interface UsageStats {
  userId: string;
  plan: Plan;
  projectCount: number;
  projectLimit: number;
  canCreateProject: boolean;
}
