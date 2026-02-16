
export interface FinancialMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  category?: 'efficiency' | 'growth' | 'profitability' | 'liquidity';
}

export interface CashFlowData {
  month: string;
  year: number;
  inflow: number;
  outflow: number;
  balance: number;
  revenue?: number;
  expenses?: number;
  ebitda?: number;
  grossMargin?: number;
  netMargin?: number;
  prediction?: boolean;
}

export interface RiskAlert {
  id: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  probability: number;
  impact: string;
  mitigation: string;
}

export interface StrategicRecommendation {
  id: string;
  category: 'Liquidity' | 'Capital Allocation' | 'Investment' | 'Operations';
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  horizon: 'short' | 'mid' | 'long';
  impactScore: number;
}

export interface ScenarioResult {
  scenarioName: string;
  roi: number;
  paybackPeriod: number;
  npv: string;
  irr: string;
  revenueImpact: string;
  costImpact: string;
  description?: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'Debt' | 'Asset' | 'Development';
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  forecastedNextQ?: number;
}

export interface InvestmentItem {
  id: string;
  name: string;
  allocation: number;
  returnYTD: number;
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive';
  value: number;
}

export interface DashboardState {
  metrics: FinancialMetric[];
  cashFlowHistory: CashFlowData[];
  risks: RiskAlert[];
  recommendations: StrategicRecommendation[];
  scenarios: ScenarioResult[];
  predictionAssumptions: string[];
  goals: FinancialGoal[];
  budgets: BudgetCategory[];
  investments: InvestmentItem[];
  loading: boolean;
  lastUpdated: string;
}
