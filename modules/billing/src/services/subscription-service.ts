import { Plan, PlanConfig, PLAN_CONFIGS, UsageStats } from '../types/billing.js';

/**
 * Subscription Service for managing plan limits and usage
 */
export class SubscriptionService {
  /**
   * Get plan limits and configuration
   */
  getPlanLimits(plan: Plan): PlanConfig {
    return PLAN_CONFIGS[plan];
  }

  /**
   * Check if user can create a new project
   */
  canCreateProject(userId: string, currentCount: number, plan: Plan): boolean {
    const planConfig = this.getPlanLimits(plan);

    // Unlimited projects for ENTERPRISE
    if (planConfig.projectLimit === -1) {
      return true;
    }

    // Check if under limit
    return currentCount < planConfig.projectLimit;
  }

  /**
   * Get usage statistics for a user
   */
  async getUsage(
    userId: string,
    plan: Plan,
    projectCount: number
  ): Promise<UsageStats> {
    const planConfig = this.getPlanLimits(plan);

    return {
      userId,
      plan,
      projectCount,
      projectLimit: planConfig.projectLimit,
      canCreateProject: this.canCreateProject(userId, projectCount, plan)
    };
  }

  /**
   * Calculate upgrade recommendation based on usage
   */
  getUpgradeRecommendation(currentPlan: Plan, projectCount: number): Plan | null {
    const currentConfig = this.getPlanLimits(currentPlan);

    // Already at max tier
    if (currentPlan === Plan.ENTERPRISE) {
      return null;
    }

    // Check if approaching limit (80% threshold)
    if (currentConfig.projectLimit !== -1) {
      const usagePercentage = projectCount / currentConfig.projectLimit;

      if (usagePercentage >= 0.8) {
        // Recommend next tier
        if (currentPlan === Plan.FREE) {
          return Plan.PRO;
        }
        if (currentPlan === Plan.PRO) {
          return Plan.ENTERPRISE;
        }
      }
    }

    return null;
  }

  /**
   * Get all available plans for display
   */
  getAllPlans(): Array<{ plan: Plan; config: PlanConfig }> {
    return Object.entries(PLAN_CONFIGS).map(([plan, config]) => ({
      plan: plan as Plan,
      config
    }));
  }

  /**
   * Compare two plans
   */
  isPlanUpgrade(currentPlan: Plan, newPlan: Plan): boolean {
    const planOrder = [Plan.FREE, Plan.PRO, Plan.ENTERPRISE];
    const currentIndex = planOrder.indexOf(currentPlan);
    const newIndex = planOrder.indexOf(newPlan);

    return newIndex > currentIndex;
  }

  /**
   * Validate plan transition
   */
  canTransitionToPlan(
    currentPlan: Plan,
    newPlan: Plan,
    currentProjectCount: number
  ): { allowed: boolean; reason?: string } {
    // Cannot downgrade if it would exceed new plan limit
    if (!this.isPlanUpgrade(currentPlan, newPlan)) {
      const newPlanConfig = this.getPlanLimits(newPlan);

      if (
        newPlanConfig.projectLimit !== -1 &&
        currentProjectCount > newPlanConfig.projectLimit
      ) {
        return {
          allowed: false,
          reason: `Cannot downgrade: You have ${currentProjectCount} projects but ${newPlan} plan allows only ${newPlanConfig.projectLimit}`
        };
      }
    }

    return { allowed: true };
  }
}
