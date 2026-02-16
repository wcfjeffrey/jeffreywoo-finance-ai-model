
import { DashboardState } from './types';

export const INITIAL_DATA: DashboardState = {
  metrics: [
    { label: 'Total Revenue (Q1)', value: '$12.4M', change: 8.2, trend: 'up', category: 'growth' },
    { label: 'EBITDA Margin', value: '24.5%', change: -1.2, trend: 'down', category: 'profitability' },
    { label: 'Net Profit Margin', value: '18.2%', change: 2.1, trend: 'up', category: 'profitability' },
    { label: 'Cash on Hand', value: '$4.2M', change: 15.0, trend: 'up', category: 'liquidity' },
  ],
  cashFlowHistory: [
    { month: 'Oct', year: 2024, inflow: 1200000, outflow: 950000, balance: 250000, revenue: 1400000, expenses: 1100000, ebitda: 300000, grossMargin: 42, netMargin: 18 },
    { month: 'Nov', year: 2024, inflow: 1150000, outflow: 1000000, balance: 150000, revenue: 1350000, expenses: 1200000, ebitda: 150000, grossMargin: 38, netMargin: 15 },
    { month: 'Dec', year: 2024, inflow: 1400000, outflow: 1100000, balance: 300000, revenue: 1600000, expenses: 1250000, ebitda: 350000, grossMargin: 45, netMargin: 20 },
    { month: 'Jan', year: 2025, inflow: 1050000, outflow: 980000, balance: 70000, revenue: 1200000, expenses: 1120000, ebitda: 80000, grossMargin: 35, netMargin: 12 },
    { month: 'Feb', year: 2025, inflow: 1100000, outflow: 1050000, balance: 50000, revenue: 1250000, expenses: 1180000, ebitda: 70000, grossMargin: 34, netMargin: 11 },
    { month: 'Mar', year: 2025, inflow: 1300000, outflow: 1000000, balance: 300000, revenue: 1450000, expenses: 1120000, ebitda: 330000, grossMargin: 40, netMargin: 19 },
    { month: 'Apr', year: 2025, inflow: 1350000, outflow: 1050000, balance: 300000, revenue: 1500000, ebitda: 350000, grossMargin: 41, netMargin: 19, prediction: true },
    { month: 'May', year: 2025, inflow: 1400000, outflow: 1100000, balance: 300000, revenue: 1550000, ebitda: 370000, grossMargin: 42, netMargin: 20, prediction: true },
    { month: 'Jun', year: 2025, inflow: 1500000, outflow: 1150000, balance: 350000, revenue: 1650000, ebitda: 400000, grossMargin: 43, netMargin: 21, prediction: true },
  ],
  predictionAssumptions: [
    "Revenue growth based on 8% historical Q2 CAGR.",
    "Fixed operational expenses projected to rise by 3% due to CPI adjustments.",
    "Accounts receivable collection cycle expected to stabilize at 42 days."
  ],
  goals: [
    { id: 'g1', title: 'Pay Down Series A Debt', targetAmount: 1200000, currentAmount: 450000, deadline: '2025-12-31', category: 'Debt' },
    { id: 'g2', title: 'Asset Purchase: Warehouse', targetAmount: 2500000, currentAmount: 800000, deadline: '2026-06-30', category: 'Asset' },
  ],
  budgets: [
    { id: 'b1', name: 'Operational R&D', allocated: 500000, spent: 410000, forecastedNextQ: 550000 },
    { id: 'b2', name: 'Marketing & Growth', allocated: 250000, spent: 265000, forecastedNextQ: 300000 },
    { id: 'b3', name: 'IT Infrastructure', allocated: 150000, spent: 85000, forecastedNextQ: 120000 },
    { id: 'b4', name: 'Talent Acquisition', allocated: 300000, spent: 120000, forecastedNextQ: 400000 },
  ],
  investments: [
    { id: 'i1', name: 'Cash Equivalents (T-Bills)', allocation: 40, returnYTD: 5.2, riskProfile: 'Conservative', value: 1680000 },
    { id: 'i2', name: 'Strategic Growth Equity', allocation: 30, returnYTD: 12.8, riskProfile: 'Aggressive', value: 1260000 },
  ],
  risks: [
    {
      id: 'r1',
      severity: 'high',
      title: 'Interest Rate Sensitivity',
      description: 'Variable rate debt exposure of $5M is vulnerable to the projected 50bps Fed hike.',
      probability: 85,
      impact: 'Critical reduction in Net Income by ~$250k/year.',
      mitigation: 'Execute an interest rate swap for 60% of variable exposure to fix costs at current levels.'
    },
    {
      id: 'r2',
      severity: 'medium',
      title: 'Supply Chain Consolidation',
      description: 'Single-source dependency for micro-components in the R&D division.',
      probability: 45,
      impact: 'Product launch delays of up to 4 months.',
      mitigation: 'Diversify vendor base to at least two secondary suppliers by end of Q3.'
    },
    {
      id: 'r3',
      severity: 'low',
      title: 'Regulatory Compliance (GDPR/CCPA)',
      description: 'New state-level privacy laws requiring minor updates to data processing logs.',
      probability: 20,
      impact: 'Potential legal fees and administrative overhead.',
      mitigation: 'Allocate $25k to legal audit and automation of privacy request fulfillment.'
    }
  ],
  recommendations: [
    {
      id: 'rec-inv-1',
      category: 'Investment',
      title: 'Yield Curve Optimization',
      content: 'Reallocate $1.5M from low-interest accounts to Treasury ladders to lock in current 5.1% APY before projected Q3 FOMC rate cuts.',
      priority: 'high',
      horizon: 'short',
      impactScore: 82
    },
    {
      id: 'rec-inv-2',
      category: 'Investment',
      title: 'Growth Equity Rebalancing',
      content: 'Trim 10% of the "Strategic Growth Equity" position to realize Q1 gains and establish a collar option strategy for downside protection.',
      priority: 'medium',
      horizon: 'mid',
      impactScore: 68
    },
    {
      id: 'rec-scen-1',
      category: 'Capital Allocation',
      title: 'Execute APAC Strategy (Singapore)',
      content: 'The Aggressive Market Expansion scenario yields a $4.2M NPV. Immediate $300k allocation recommended for localized hiring in Singapore.',
      priority: 'high',
      horizon: 'mid',
      impactScore: 94
    },
    {
      id: 'rec-scen-2',
      category: 'Capital Allocation',
      title: 'Recession-Proofing Reserve',
      content: 'Establish a $1.2M liquidity buffer as identified in the Downsizing scenario to ensure 14 months of runway if APAC revenue lags targets.',
      priority: 'high',
      horizon: 'long',
      impactScore: 78
    }
  ],
  scenarios: [
    {
      scenarioName: 'Aggressive Market Expansion (APAC)',
      roi: 28.4,
      paybackPeriod: 14,
      npv: '$4.2M',
      irr: '32%',
      revenueImpact: '+22% Year-over-Year',
      costImpact: '+12% increase in Sales & Marketing',
      description: 'Assumes successful penetration of Singapore and Tokyo markets with localized support teams.'
    },
    {
      scenarioName: 'Operational Downsizing (Recession Proofing)',
      roi: 12.5,
      paybackPeriod: 6,
      npv: '$1.1M',
      irr: '15%',
      revenueImpact: '-5% due to reduced capacity',
      costImpact: '-18% reduction in total OpEx',
      description: 'Focuses on maintaining cash reserves and lean operations during macro-economic volatility.'
    }
  ],
  loading: false,
  lastUpdated: new Date().toLocaleTimeString()
};
