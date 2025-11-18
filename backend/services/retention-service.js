class RetentionService {
  constructor() {
    this.offerTypes = {
      DISCOUNT: 'discount',
      BILL_CREDIT: 'bill_credit',
      UPGRADE: 'upgrade',
      LOYALTY_REWARD: 'loyalty_reward',
      WAIVE_FEE: 'waive_fee'
    };

    this.valueTiers = {
      VIP: { minTenure: 36, minMonthlyBill: 150 },
      HIGH_VALUE: { minTenure: 24, minMonthlyBill: 100 },
      STANDARD: { minTenure: 12, minMonthlyBill: 50 },
      NEW: { minTenure: 0, minMonthlyBill: 0 }
    };
  }

  getCustomerTier(customerProfile) {
    const { tenure, monthlyBill } = customerProfile;

    if (tenure >= this.valueTiers.VIP.minTenure && monthlyBill >= this.valueTiers.VIP.minMonthlyBill) {
      return 'VIP';
    }
    if (tenure >= this.valueTiers.HIGH_VALUE.minTenure && monthlyBill >= this.valueTiers.HIGH_VALUE.minMonthlyBill) {
      return 'HIGH_VALUE';
    }
    if (tenure >= this.valueTiers.STANDARD.minTenure && monthlyBill >= this.valueTiers.STANDARD.minMonthlyBill) {
      return 'STANDARD';
    }
    return 'NEW';
  }

  generateOffers(customerProfile, intent, sentiment, urgency) {
    const tier = this.getCustomerTier(customerProfile);
    const offers = [];

    switch (intent) {
      case 'price_complaint':
        offers.push(...this.getPriceComplaintOffers(customerProfile, tier, urgency));
        break;
      case 'competitor_offer':
        offers.push(...this.getCompetitorOffers(customerProfile, tier, urgency));
        break;
      case 'service_quality':
        offers.push(...this.getServiceQualityOffers(customerProfile, tier, urgency));
        break;
      case 'billing_issue':
        offers.push(...this.getBillingIssueOffers(customerProfile, tier, urgency));
        break;
      default:
        offers.push(...this.getDefaultOffers(customerProfile, tier));
    }

    return this.prioritizeOffers(offers, tier, urgency).slice(0, 3);
  }

  getPriceComplaintOffers(customerProfile, tier, urgency) {
    const offers = [];
    const { monthlyBill } = customerProfile;

    if (tier === 'VIP') {
      offers.push({
        type: this.offerTypes.DISCOUNT,
        value: '25%',
        duration: 12,
        description: `Save 25% on your monthly bill for a full year - that's $${(monthlyBill * 0.25).toFixed(2)} per month!`,
        priority: 10,
        estimatedSavings: (monthlyBill * 0.25 * 12).toFixed(2)
      });
    } else if (tier === 'HIGH_VALUE') {
      offers.push({
        type: this.offerTypes.DISCOUNT,
        value: '20%',
        duration: 6,
        description: `Get 20% off your monthly bill for 6 months - saving you $${(monthlyBill * 0.20).toFixed(2)} every month.`,
        priority: 9,
        estimatedSavings: (monthlyBill * 0.20 * 6).toFixed(2)
      });
    } else {
      offers.push({
        type: this.offerTypes.DISCOUNT,
        value: '15%',
        duration: 6,
        description: `Enjoy 15% off your monthly bill for 6 months - $${(monthlyBill * 0.15).toFixed(2)} in savings each month.`,
        priority: 8,
        estimatedSavings: (monthlyBill * 0.15 * 6).toFixed(2)
      });
    }

    const creditAmount = tier === 'VIP' ? 100 : tier === 'HIGH_VALUE' ? 75 : 50;
    offers.push({
      type: this.offerTypes.BILL_CREDIT,
      value: `$${creditAmount}`,
      duration: 1,
      description: `Immediate $${creditAmount} credit applied to your next bill - no waiting, instant savings.`,
      priority: 7,
      estimatedSavings: creditAmount
    });

    return offers;
  }

  getCompetitorOffers(customerProfile, tier, urgency) {
    const offers = [];
    const { monthlyBill } = customerProfile;

    if (tier === 'VIP' || urgency >= 8) {
      offers.push({
        type: this.offerTypes.DISCOUNT,
        value: '30%',
        duration: 12,
        description: `Match or beat competitor pricing: 30% off for 12 months, plus we'll waive all installation fees.`,
        priority: 10,
        estimatedSavings: (monthlyBill * 0.30 * 12).toFixed(2)
      });
    }

    offers.push({
      type: this.offerTypes.UPGRADE,
      value: 'Premium Plan @ 20% off',
      duration: 6,
      description: `Upgrade to our premium plan with faster speeds and more features at 20% off for 6 months.`,
      priority: 9,
      estimatedSavings: 'Varies'
    });

    const rewardValue = tier === 'VIP' ? 150 : 100;
    offers.push({
      type: this.offerTypes.LOYALTY_REWARD,
      value: `$${rewardValue}`,
      duration: 1,
      description: `Thank you for considering us - here's a $${rewardValue} loyalty reward credit, no strings attached.`,
      priority: 8,
      estimatedSavings: rewardValue
    });

    return offers;
  }

  getServiceQualityOffers(customerProfile, tier, urgency) {
    const offers = [];
    const { monthlyBill } = customerProfile;

    const creditMonths = urgency >= 7 ? 2 : 1;
    const creditAmount = (monthlyBill * 0.5 * creditMonths).toFixed(2);
    offers.push({
      type: this.offerTypes.BILL_CREDIT,
      value: `$${creditAmount}`,
      duration: creditMonths,
      description: `We apologize for the service issues. Here's $${creditAmount} credit for ${creditMonths} month${creditMonths > 1 ? 's' : ''} of inconvenience.`,
      priority: 10,
      estimatedSavings: creditAmount
    });

    offers.push({
      type: this.offerTypes.UPGRADE,
      value: 'Premium Service',
      duration: 6,
      description: `Free upgrade to our premium tier with priority support and enhanced reliability for 6 months.`,
      priority: 9,
      estimatedSavings: 'Service Enhancement'
    });

    return offers;
  }

  getBillingIssueOffers(customerProfile, tier, urgency) {
    const offers = [];
    const { monthlyBill } = customerProfile;

    offers.push({
      type: this.offerTypes.WAIVE_FEE,
      value: 'All late fees',
      duration: 1,
      description: `We'll waive any late fees or disputed charges on your account immediately.`,
      priority: 10,
      estimatedSavings: 'Fee Waiver'
    });

    const creditAmount = tier === 'VIP' ? 75 : 50;
    offers.push({
      type: this.offerTypes.BILL_CREDIT,
      value: `$${creditAmount}`,
      duration: 1,
      description: `$${creditAmount} credit applied to help resolve billing concerns and show we value your business.`,
      priority: 8,
      estimatedSavings: creditAmount
    });

    return offers;
  }

  getDefaultOffers(customerProfile, tier) {
    const offers = [];
    const { monthlyBill } = customerProfile;

    const discountValue = tier === 'VIP' ? 20 : tier === 'HIGH_VALUE' ? 15 : 10;
    offers.push({
      type: this.offerTypes.DISCOUNT,
      value: `${discountValue}%`,
      duration: 6,
      description: `As a valued customer, enjoy ${discountValue}% off your monthly bill for 6 months.`,
      priority: 7,
      estimatedSavings: (monthlyBill * (discountValue / 100) * 6).toFixed(2)
    });

    return offers;
  }

  prioritizeOffers(offers, tier, urgency) {
    return offers.sort((a, b) => {
      const priorityA = a.priority + (urgency >= 8 ? 2 : urgency >= 6 ? 1 : 0);
      const priorityB = b.priority + (urgency >= 8 ? 2 : urgency >= 6 ? 1 : 0);
      
      return priorityB - priorityA;
    });
  }
}

module.exports = new RetentionService();

