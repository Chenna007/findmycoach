// ─── Trainer Subscription Plans ───────────────────────────────────────────────
// Single source of truth for all plan limits and feature gates.
// Used by TrainerPricingPage, TrainerDashboard, server.js, and access control.

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    color: '#22c55e',
    colorBg: 'rgba(34,197,94,0.08)',
    colorBorder: 'rgba(34,197,94,0.2)',
    tagline: 'Explore the platform',
    badge: null,
    emoji: '🟢',
    features: [
      { text: 'Create basic profile', included: true },
      { text: 'Limited visibility (low ranking)', included: true },
      { text: 'Max 5 bookings / month', included: true },
      { text: 'Basic info only', included: true },
      { text: 'Analytics', included: false },
      { text: 'Profile customization', included: false },
      { text: 'Reviews & ratings', included: false },
    ],
    limits: {
      bookingsPerMonth: 5,
      hasCustomization: false,
      hasAnalytics: false,
      hasAdvancedAnalytics: false,
      hasFeatured: false,
      hasWhatsApp: false,
      hasReviews: false,
      hasVerifiedBadge: false,
      hasPriorityListing: false,
      hasHomepageSpotlight: false,
      hasSellPackages: false,
      rankBoost: 0,
    },
  },

  starter: {
    id: 'starter',
    name: 'Starter',
    price: 99,
    color: '#3b82f6',
    colorBg: 'rgba(59,130,246,0.08)',
    colorBorder: 'rgba(59,130,246,0.3)',
    tagline: 'Start getting clients',
    badge: 'MOST POPULAR',
    emoji: '🔵',
    features: [
      { text: 'Increased visibility in search', included: true },
      { text: 'Up to 30 bookings / month', included: true },
      { text: 'Profile customization (photos, bio, pricing)', included: true },
      { text: '"Active Trainer" badge', included: true },
      { text: 'Basic analytics (views & clicks)', included: true },
      { text: 'Reviews & ratings', included: false },
      { text: 'WhatsApp lead alerts', included: false },
    ],
    limits: {
      bookingsPerMonth: 30,
      hasCustomization: true,
      hasAnalytics: true,
      hasAdvancedAnalytics: false,
      hasFeatured: false,
      hasWhatsApp: false,
      hasReviews: false,
      hasVerifiedBadge: false,
      hasPriorityListing: false,
      hasHomepageSpotlight: false,
      hasSellPackages: false,
      rankBoost: 1,
    },
  },

  growth: {
    id: 'growth',
    name: 'Growth',
    price: 199,
    color: '#a855f7',
    colorBg: 'rgba(168,85,247,0.08)',
    colorBorder: 'rgba(168,85,247,0.3)',
    tagline: 'Grow your fitness business',
    badge: null,
    emoji: '🟣',
    features: [
      { text: 'High ranking in search', included: true },
      { text: 'Unlimited bookings', included: true },
      { text: 'Featured in category pages', included: true },
      { text: 'WhatsApp lead alerts', included: true },
      { text: 'Reviews & ratings enabled', included: true },
      { text: 'Advanced analytics dashboard', included: true },
      { text: 'Homepage spotlight', included: false },
    ],
    limits: {
      bookingsPerMonth: Infinity,
      hasCustomization: true,
      hasAnalytics: true,
      hasAdvancedAnalytics: true,
      hasFeatured: true,
      hasWhatsApp: true,
      hasReviews: true,
      hasVerifiedBadge: false,
      hasPriorityListing: false,
      hasHomepageSpotlight: false,
      hasSellPackages: false,
      rankBoost: 2,
    },
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    price: 299,
    color: '#ef4444',
    colorBg: 'rgba(239,68,68,0.08)',
    colorBorder: 'rgba(239,68,68,0.3)',
    tagline: 'Dominate your market',
    badge: null,
    emoji: '🔴',
    features: [
      { text: 'Top placement — priority listing', included: true },
      { text: '"Verified Trainer" badge', included: true },
      { text: 'Priority leads (shown first to users)', included: true },
      { text: 'Homepage spotlight (limited slots 🔥)', included: true },
      { text: 'AI-powered recommendations', included: true },
      { text: 'Sell monthly packages to clients', included: true },
      { text: 'Everything in Growth', included: true },
    ],
    limits: {
      bookingsPerMonth: Infinity,
      hasCustomization: true,
      hasAnalytics: true,
      hasAdvancedAnalytics: true,
      hasFeatured: true,
      hasWhatsApp: true,
      hasReviews: true,
      hasVerifiedBadge: true,
      hasPriorityListing: true,
      hasHomepageSpotlight: true,
      hasSellPackages: true,
      rankBoost: 3,
    },
  },
};

export const PLAN_ORDER = ['free', 'starter', 'growth', 'pro'];

export function getPlan(planId) {
  return PLANS[planId] || PLANS.free;
}

export function canAcceptBooking(subscription) {
  if (!subscription) return false;
  const plan = getPlan(subscription.plan);
  if (plan.limits.bookingsPerMonth === Infinity) return true;
  return (subscription.bookings_this_month || 0) < plan.limits.bookingsPerMonth;
}

export function getBookingLimitDisplay(plan) {
  const p = getPlan(plan);
  return p.limits.bookingsPerMonth === Infinity ? 'Unlimited' : p.limits.bookingsPerMonth;
}
