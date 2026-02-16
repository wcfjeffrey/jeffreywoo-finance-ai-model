
import { DashboardState } from './types';

export const INITIAL_DATA: DashboardState = {
  metrics: [
    { label: 'Total Revenue (Q1)', value: '$12.4M', change: 8.2, trend: 'up' },
    { label: 'EBITDA Margin', value: '24.5%', change: -1.2, trend: 'down' },
    { label: 'Cash on Hand', value: '$4.2M', change: 15.0, trend: 'up' },
    { label: 'Debt-to-Equity', value: '0.45', change: 0, trend: 'neutral' },
  ],
  cashFlowHistory: [
    { month: 'Apr', year: 2024, inflow: 900000, outflow: 850000, balance: 50000, revenue: 1050000, expenses: 950000, ebitda: 100000 },
    { month: 'May', year: 2024, inflow: 950000, outflow: 880000, balance: 70000, revenue: 1100000, expenses: 980000, ebitda: 120000 },
    { month: 'Jun', year: 2024, inflow: 1000000, outflow: 920000, balance: 80000, revenue: 1150000, expenses: 1020000, ebitda: 130000 },
    { month: 'Jul', year: 2024, inflow: 1100000, outflow: 950000, balance: 150000, revenue: 1250000, expenses: 1050000, ebitda: 200000 },
    { month: 'Aug', year: 2024, inflow: 1050000, outflow: 980000, balance: 70000, revenue: 1200000, expenses: 1100000, ebitda: 100000 },
    { month: 'Sep', year: 2024, inflow: 1150000, outflow: 1000000, balance: 150000, revenue: 1300000, expenses: 1150000, ebitda: 150000 },
    { month: 'Oct', year: 2024, inflow: 1200000, outflow: 950000, balance: 250000, revenue: 1400000, expenses: 1100000, ebitda: 300000 },
    { month: 'Nov', year: 2024, inflow: 1150000, outflow: 1000000, balance: 150000, revenue: 1350000, expenses: 1200000, ebitda: 150000 },
    { month: 'Dec', year: 2024, inflow: 1400000, outflow: 1100000, balance: 300000, revenue: 1600000, expenses: 1250000, ebitda: 350000 },
    { month: 'Jan', year: 2025, inflow: 1050000, outflow: 980000, balance: 70000, revenue: 1200000, expenses: 1120000, ebitda: 80000 },
    { month: 'Feb', year: 2025, inflow: 1100000, outflow: 1050000, balance: 50000, revenue: 1250000, expenses: 1180000, ebitda: 70000 },
    { month: 'Mar', year: 2025, inflow: 1300000, outflow: 1000000, balance: 300000, revenue: 1450000, expenses: 1120000, ebitda: 330000 },
    { month: 'Apr', year: 2025, inflow: 1350000, outflow: 1050000, balance: 300000, prediction: true },
    { month: 'May', year: 2025, inflow: 1400000, outflow: 1100000, balance: 300000, prediction: true },
    { month: 'Jun', year: 2025, inflow: 1500000, outflow: 1150000, balance: 350000, prediction: true },
  ],
  predictionAssumptions: [
    "Revenue growth based on 8% historical Q2 CAGR.",
    "Fixed operational expenses projected to rise by 3% due to CPI adjustments.",
    "Planned R&D headcount expansion starting in May 2025.",
    "Accounts receivable collection cycle expected to stabilize at 42 days."
  ],
  goals: [
    { id: 'g1', title: 'Pay Down Series A Debt', targetAmount: 1200000, currentAmount: 450000, deadline: '2025-12-31', category: 'Debt' },
    { id: 'g2', title: 'Asset Purchase: Warehouse', targetAmount: 2500000, currentAmount: 800000, deadline: '2026-06-30', category: 'Asset' },
    { id: 'g3', title: 'Product Development Fund', targetAmount: 1500000, currentAmount: 1200000, deadline: '2025-09-15', category: 'Development' },
  ],
  budgets: [
    { id: 'b1', name: 'Operational R&D', allocated: 500000, spent: 410000 },
    { id: 'b2', name: 'Marketing & Growth', allocated: 250000, spent: 265000 },
    { id: 'b3', name: 'IT Infrastructure', allocated: 150000, spent: 85000 },
    { id: 'b4', name: 'HR & Administrative', allocated: 100000, spent: 92000 },
  ],
  investments: [
    { id: 'i1', name: 'Cash Equivalents (T-Bills)', allocation: 40, returnYTD: 5.2, riskProfile: 'Conservative', value: 1680000 },
    { id: 'i2', name: 'Strategic Growth Equity', allocation: 30, returnYTD: 12.8, riskProfile: 'Aggressive', value: 1260000 },
    { id: 'i3', name: 'Hedge Fund Diversifier', allocation: 20, returnYTD: 8.4, riskProfile: 'Moderate', value: 840000 },
    { id: 'i4', name: 'Commodity Futures', allocation: 10, returnYTD: -2.1, riskProfile: 'Aggressive', value: 420000 },
  ],
  risks: [
    {
      id: '1',
      severity: 'medium',
      title: 'Accounts Receivable Latency',
      description: 'DSO (Days Sales Outstanding) increased by 12% in Q1, potentially squeezing Q2 working capital.',
      probability: 65,
      impact: 'Medium-term Liquidity'
    },
    {
      id: '2',
      severity: 'high',
      title: 'Interest Rate Volatility',
      description: 'Projected 50bps rate hike by central bank may increase variable debt service costs by $150k annually.',
      probability: 85,
      impact: 'Net Profit Margin'
    }
  ],
  recommendations: [
    {
      id: 'r1',
      category: 'Liquidity',
      title: 'Optimize Working Capital',
      content: 'Implement stricter net-30 terms for new enterprise clients and offer 2% early payment discounts to accelerate cash inflows.',
      priority: 'high',
      horizon: 'short',
      impactScore: 85
    },
    {
      id: 'r2',
      category: 'Capital Allocation',
      title: 'Infrastructure Modernization',
      content: 'Defer planned office expansion to Q4; prioritize R&D for AI-automated supply chain modules which shows a projected IRR of 32%.',
      priority: 'medium',
      horizon: 'mid',
      impactScore: 72
    }
  ],
  scenarios: [
    {
      scenarioName: 'Base Case (Current Trend)',
      roi: 18.5,
      paybackPeriod: 24,
      npv: '$2.1M',
      irr: '21%'
    }
  ],
  loading: false,
  lastUpdated: new Date().toLocaleTimeString()
};
