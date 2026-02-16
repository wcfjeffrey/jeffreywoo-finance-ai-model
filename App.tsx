import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  TrendingUp, 
  ShieldAlert, 
  Zap, 
  Settings, 
  FileText, 
  ChevronRight, 
  Upload, 
  Loader2, 
  MessageSquare,
  BarChart3,
  RefreshCw,
  Search,
  Plus,
  Calendar,
  History,
  Target,
  Award,
  Download,
  Info,
  Wallet,
  PieChart,
  Briefcase,
  BookOpen,
  ArrowRight,
  X,
  PlusCircle,
  Activity,
  BarChart,
  Layers,
  TrendingDown
} from 'lucide-react';
import { INITIAL_DATA } from './constants';
import { DashboardState, ScenarioResult, StrategicRecommendation, FinancialGoal, BudgetCategory, InvestmentItem, CashFlowData, FinancialMetric } from './types';
import { MetricCard } from './components/MetricCard';
import { CashFlowChart } from './components/CashFlowChart';
import { HistoryTable } from './components/HistoryTable';
import { analyzeFinancialData, simulateScenario } from './services/geminiService';
import { ResponsiveContainer, Tooltip as ReTooltip, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from 'recharts';

type Granularity = 'month' | 'quarter' | 'year';

const App: React.FC = () => {
  const [state, setState] = useState<DashboardState>(INITIAL_DATA);
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'scenarios' | 'risks' | 'history' | 'budgets' | 'investments'>('overview');
  const [scenarioInput, setScenarioInput] = useState('');
  const [fileData, setFileData] = useState<{data: string, mimeType: string} | null>(null);
  const [granularity, setGranularity] = useState<Granularity>('month');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal States
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  // Form States
  const [newGoal, setNewGoal] = useState<Partial<FinancialGoal>>({ category: 'Asset', targetAmount: 0, currentAmount: 0 });
  const [newBudget, setNewBudget] = useState<Partial<BudgetCategory>>({ allocated: 0, spent: 0 });

  const getQuarter = (month: string) => {
    const quarters: Record<string, string> = {
      'Jan': 'Q1', 'Feb': 'Q1', 'Mar': 'Q1',
      'Apr': 'Q2', 'May': 'Q2', 'Jun': 'Q2',
      'Jul': 'Q3', 'Aug': 'Q3', 'Sep': 'Q3',
      'Oct': 'Q4', 'Nov': 'Q4', 'Dec': 'Q4'
    };
    return quarters[month] || 'Q1';
  };

  const aggregatedData = useMemo(() => {
    const sourceData = state.cashFlowHistory;
    if (granularity === 'month') {
      return sourceData.map(d => ({
        ...d,
        displayLabel: `${d.month} ${d.year}`
      }));
    }

    const groups: Record<string, CashFlowData[]> = {};
    sourceData.forEach(d => {
      const key = granularity === 'quarter' 
        ? `${d.year}-${getQuarter(d.month)}` 
        : `${d.year}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(d);
    });

    return Object.entries(groups).map(([key, items]) => {
      const isPrediction = items.some(i => i.prediction);
      const parts = key.split('-');
      const yearStr = parts[0];
      const qStr = parts[1];
      
      const totalRevenue = items.reduce((acc, i) => acc + (i.revenue || 0), 0);
      const totalEbitda = items.reduce((acc, i) => acc + (i.ebitda || 0), 0);
      
      return {
        month: granularity === 'quarter' ? qStr : 'FY',
        displayLabel: granularity === 'quarter' ? `${qStr} ${yearStr}` : yearStr,
        year: parseInt(yearStr),
        inflow: items.reduce((acc, i) => acc + i.inflow, 0),
        outflow: items.reduce((acc, i) => acc + i.outflow, 0),
        balance: items[items.length - 1].balance,
        revenue: totalRevenue,
        ebitda: totalEbitda,
        grossMargin: Math.round(items.reduce((acc, i) => acc + (i.grossMargin || 0), 0) / items.length),
        netMargin: Math.round(items.reduce((acc, i) => acc + (i.netMargin || 0), 0) / items.length),
        prediction: isPrediction
      } as CashFlowData & { displayLabel: string };
    });
  }, [state.cashFlowHistory, granularity]);

  // Dynamic Metrics based on Granularity
  const displayMetrics = useMemo(() => {
    const lastPeriod = aggregatedData[aggregatedData.length - 1];
    if (!lastPeriod) return state.metrics;

    const formatCurrency = (val: number) => {
      const absVal = Math.abs(val);
      if (absVal >= 1000000) return `${val < 0 ? '-' : ''}$${(absVal / 1000000).toFixed(1)}M`;
      if (absVal >= 1000) return `${val < 0 ? '-' : ''}$${(absVal / 1000).toFixed(0)}k`;
      return `${val < 0 ? '-' : ''}$${absVal.toLocaleString()}`;
    };

    const periodLabel = lastPeriod.displayLabel;
    const ebitdaMargin = lastPeriod.revenue ? Math.round((lastPeriod.ebitda || 0) / lastPeriod.revenue * 100) : 0;
    
    const prevPeriod = aggregatedData.length > 1 ? aggregatedData[aggregatedData.length - 2] : null;
    const calculateChange = (curr: number, prev: number) => {
      if (!prev || prev === 0) return 0;
      return Math.round(((curr - prev) / Math.abs(prev)) * 100);
    };

    const revenueChange = prevPeriod ? calculateChange(lastPeriod.revenue || 0, prevPeriod.revenue || 0) : 0;
    const cashFlowValue = lastPeriod.inflow - lastPeriod.outflow;
    const prevCashFlowValue = prevPeriod ? (prevPeriod.inflow - prevPeriod.outflow) : 0;
    const cashFlowChange = calculateChange(cashFlowValue, prevCashFlowValue);

    const dynamicMetrics: FinancialMetric[] = [
      { 
        label: `Total Revenue (${periodLabel})`, 
        value: formatCurrency(lastPeriod.revenue || 0), 
        change: revenueChange, 
        trend: revenueChange >= 0 ? 'up' : 'down', 
        category: 'growth' 
      },
      { 
        label: `EBITDA Margin (${periodLabel})`, 
        value: `${ebitdaMargin}%`, 
        change: prevPeriod && prevPeriod.revenue ? ebitdaMargin - Math.round((prevPeriod.ebitda || 0) / prevPeriod.revenue * 100) : 0, 
        trend: ebitdaMargin >= (prevPeriod && prevPeriod.revenue ? (prevPeriod.ebitda || 0) / prevPeriod.revenue * 100 : 0) ? 'up' : 'down', 
        category: 'profitability' 
      },
      { 
        label: `Net Profit Margin (${periodLabel})`, 
        value: `${lastPeriod.netMargin}%`, 
        change: prevPeriod ? (lastPeriod.netMargin || 0) - (prevPeriod.netMargin || 0) : 0, 
        trend: (lastPeriod.netMargin || 0) >= (prevPeriod?.netMargin || 0) ? 'up' : 'down', 
        category: 'profitability' 
      },
      { 
        label: `Cash on Hand (${periodLabel})`, 
        value: formatCurrency(lastPeriod.balance), 
        change: cashFlowChange, 
        trend: cashFlowValue >= 0 ? 'up' : 'down', 
        category: 'liquidity' 
      },
    ];

    return dynamicMetrics;
  }, [aggregatedData, state.metrics]);

  const scaledBudgets = useMemo(() => {
    const scale = granularity === 'month' ? 1 : granularity === 'quarter' ? 3 : 12;
    return state.budgets.map(b => ({
      ...b,
      allocated: b.allocated * scale,
      spent: b.spent * scale,
      forecastedNextQ: b.forecastedNextQ ? b.forecastedNextQ * scale : undefined
    }));
  }, [state.budgets, granularity]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        setFileData({ data: base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!query && !fileData) return;
    setIsProcessing(true);
    try {
      const update = await analyzeFinancialData(query || "Analyze current financials.", state, fileData || undefined);
      setState(prev => ({ ...prev, ...update }));
      setQuery('');
      setFileData(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const runScenario = async () => {
    if (!scenarioInput) return;
    setIsProcessing(true);
    try {
      const result = await simulateScenario(scenarioInput, state);
      setState(prev => ({
        ...prev,
        scenarios: [result, ...prev.scenarios]
      }));
      setScenarioInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">J</div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">JeffreyWoo<span className="text-blue-600">Finance</span></h1>
            <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-200">AI CFO</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <Activity size={14} className="text-emerald-500 mr-2" />
              <span className="text-xs font-medium text-slate-600">Last updated: {state.lastUpdated}</span>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Ask your AI CFO about cash flow, budgets, or risk analysis..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runAnalysis()}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".pdf,.csv,.txt" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${fileData ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Upload size={18} />
              {fileData ? 'Document Loaded' : 'Upload Data'}
            </button>
            <button 
              disabled={isProcessing || (!query && !fileData)}
              onClick={runAnalysis}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
              {isProcessing ? 'Analyzing...' : 'Generate Insights'}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <nav className="flex items-center p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto">
            {[
              { id: 'overview', icon: <BarChart3 size={16} />, label: 'Overview' },
              { id: 'history', icon: <History size={16} />, label: 'Cash History' },
              { id: 'risks', icon: <ShieldAlert size={16} />, label: 'Risk Center' },
              { id: 'budgets', icon: <Wallet size={16} />, label: 'Budgets' },
              { id: 'investments', icon: <Briefcase size={16} />, label: 'Investments' },
              { id: 'scenarios', icon: <Layers size={16} />, label: 'Scenarios' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-xl self-start">
            {(['month', 'quarter', 'year'] as Granularity[]).map((g) => (
              <button
                key={g}
                onClick={() => setGranularity(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  granularity === g 
                    ? 'bg-slate-100 text-slate-800' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayMetrics.map((metric, i) => (
                <MetricCard key={i} metric={metric} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Cash Flow Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Cash Flow Narrative</h2>
                      <p className="text-sm text-slate-500">Aggregated inflow vs outflow analysis</p>
                    </div>
                  </div>
                  <CashFlowChart data={aggregatedData} />
                </div>

                {/* Revenue & EBITDA Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900">Revenue & EBITDA Growth</h2>
                    <p className="text-sm text-slate-500">Aggregated {granularity} operational performance</p>
                  </div>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart data={aggregatedData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="displayLabel" 
                          tick={{fontSize: 11, fontWeight: 500, fill: '#64748b'}} 
                          axisLine={false} 
                          tickLine={false} 
                          dy={10} 
                          interval={0}
                        />
                        <YAxis tick={{fontSize: 11, fill: '#94a3b8'}} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                        <ReTooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                          formatter={(v: number) => [`$${v.toLocaleString()}`, '']}
                        />
                        <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{fontSize: 12, paddingBottom: 20}} />
                        <Bar dataKey="revenue" name="Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={30} />
                        <Bar dataKey="ebitda" name="EBITDA" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Margins Analysis Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900">Efficiency & Margin Analysis (%)</h2>
                    <p className="text-sm text-slate-500">Profitability trajectories across selected periods</p>
                  </div>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={aggregatedData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="displayLabel" 
                          tick={{fontSize: 11, fontWeight: 500, fill: '#64748b'}} 
                          axisLine={false} 
                          tickLine={false} 
                          dy={10} 
                          interval={0}
                        />
                        <YAxis tick={{fontSize: 11, fill: '#94a3b8'}} unit="%" axisLine={false} tickLine={false} />
                        <ReTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{fontSize: 12, paddingBottom: 20}} />
                        <Line type="monotone" dataKey="grossMargin" name="Gross Margin" stroke="#2563eb" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                        <Line type="monotone" dataKey="netMargin" name="Net Margin" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl shadow-slate-200">
                  <h3 className="flex items-center gap-2 text-md font-bold mb-4">
                    <Zap size={18} className="text-blue-400" />
                    Strategic Recommendations
                  </h3>
                  <div className="space-y-4">
                    {state.recommendations.map((rec, i) => (
                      <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                            rec.priority === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {rec.priority} PRIORITY
                          </span>
                          <span className="text-xs text-slate-400 font-mono">Impact: {rec.impactScore}/100</span>
                        </div>
                        <h4 className="text-sm font-bold mb-1 group-hover:text-blue-400 transition-colors">{rec.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{rec.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="flex items-center gap-2 text-md font-bold mb-4 text-slate-900">
                    <History size={18} className="text-slate-400" />
                    Prediction Assumptions
                  </h3>
                  <ul className="space-y-3">
                    {state.predictionAssumptions.map((assumption, i) => (
                      <li key={i} className="flex gap-3 text-xs text-slate-600 leading-relaxed">
                        <span className="shrink-0 w-5 h-5 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center font-bold text-[10px] border border-slate-100">{i+1}</span>
                        {assumption}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Financial Ledger</h2>
                <p className="text-slate-500">Detailed breakdown of performance scaled to {granularity}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Download size={16} />
                Export CSV
              </button>
            </div>
            <HistoryTable data={aggregatedData} />
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {state.risks.map((risk, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col group hover:border-rose-200 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${risk.severity === 'high' ? 'bg-rose-50 text-rose-600' : risk.severity === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                    <ShieldAlert size={20} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Probability</p>
                    <p className="text-lg font-bold text-slate-900">{risk.probability}%</p>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{risk.title}</h3>
                <p className="text-sm text-slate-500 mb-6 flex-1">{risk.description}</p>
                <div className="mt-auto space-y-4 pt-6 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Impact</p>
                    <p className="text-xs font-semibold text-rose-600">{risk.impact}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Mitigation Strategy</p>
                    <p className="text-xs text-slate-600 italic leading-relaxed">"{risk.mitigation}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'budgets' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Budget Allocation</h2>
                <p className="text-slate-500">Departmental spend analysis scaled for {granularity}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold mb-6 text-slate-900">Current Utilization</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={scaledBudgets} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600 }} />
                      <ReTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: 12, paddingBottom: 10 }} />
                      <Bar dataKey="spent" name="Spent" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={20} />
                      <Bar dataKey="allocated" name="Allocated" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={20} />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-4">
                {scaledBudgets.map((budget) => {
                  const percent = Math.round((budget.spent / budget.allocated) * 100);
                  const isOver = percent > 100;
                  return (
                    <div key={budget.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-slate-800">{budget.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isOver ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {percent}% UTILIZED
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                        <div className={`h-full transition-all duration-1000 ${isOver ? 'bg-rose-500' : 'bg-blue-600'}`} style={{ width: `${Math.min(percent, 100)}%` }} />
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-xs text-slate-400">
                          <p>Spent: <span className="font-mono font-bold text-slate-900">${budget.spent.toLocaleString()}</span></p>
                          <p>Budget: <span className="font-mono text-slate-600">${budget.allocated.toLocaleString()}</span></p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Portfolio Performance</h2>
                <p className="text-slate-500">Strategic asset allocation and yield optimization</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                {state.investments.map((inv) => (
                  <div key={inv.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${inv.riskProfile === 'Aggressive' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {inv.riskProfile === 'Aggressive' ? <TrendingUp size={24} /> : <ShieldAlert size={24} />}
                      </div>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-lg ${inv.riskProfile === 'Aggressive' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>{inv.riskProfile} Profile</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{inv.name}</h3>
                    <div className="grid grid-cols-2 gap-4 mt-4 py-4 border-t border-slate-50">
                      <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Allocation</p><p className="text-2xl font-bold text-slate-900">{inv.allocation}%</p></div>
                      <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Return YTD</p><p className="text-2xl font-bold text-emerald-600">+{inv.returnYTD}%</p></div>
                    </div>
                    <div className="mt-auto pt-4 flex justify-between items-center text-sm">
                      <span className="text-slate-500">Net Value</span>
                      <span className="font-bold text-slate-900 font-mono">${inv.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl shadow-slate-200 h-fit">
                <h3 className="flex items-center gap-2 text-md font-bold mb-6">
                  <Target size={18} className="text-blue-400" />
                  Investment Advisory
                </h3>
                <div className="space-y-4">
                  {state.recommendations.filter(r => r.category === 'Investment').map((rec, i) => (
                    <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${rec.priority === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {rec.priority}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{rec.impactScore}</span>
                      </div>
                      <h4 className="text-sm font-bold mb-1 group-hover:text-blue-400 transition-colors">{rec.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{rec.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Scenario Simulation Lab</h2>
              <p className="text-slate-500 mb-8">Model complex capital decisions to evaluate ROI and Payback thresholds</p>
              
              <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="flex-1 relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Describe a capital strategy... e.g., 'Expand R&D by $2M to accelerate AI chips'"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                    value={scenarioInput}
                    onChange={(e) => setScenarioInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && runScenario()}
                  />
                </div>
                <button 
                  disabled={!scenarioInput || isProcessing}
                  onClick={runScenario}
                  className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                  Run Analysis
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {state.scenarios.map((scenario, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-white hover:shadow-lg transition-all">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">{scenario.scenarioName}</h3>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-white rounded-xl border border-slate-100"><p className="text-[10px] text-slate-400 uppercase tracking-widest">ROI</p><p className="text-2xl font-bold text-blue-600">{scenario.roi}%</p></div>
                        <div className="p-4 bg-white rounded-xl border border-slate-100"><p className="text-[10px] text-slate-400 uppercase tracking-widest">Payback</p><p className="text-2xl font-bold text-slate-900">{scenario.paybackPeriod}mo</p></div>
                      </div>
                      <div className="pt-4 border-t border-slate-200 space-y-2">
                        <div className="flex justify-between text-xs"><span className="text-slate-500">NPV</span><span className="font-bold text-slate-900">{scenario.npv}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-slate-500">IRR</span><span className="font-bold text-slate-900">{scenario.irr}</span></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl shadow-slate-200 h-fit">
                  <h3 className="flex items-center gap-2 text-md font-bold mb-6">
                    <ShieldAlert size={18} className="text-emerald-400" />
                    Capital Advisory
                  </h3>
                  <div className="space-y-4">
                    {state.recommendations.filter(r => r.category === 'Capital Allocation').map((rec, i) => (
                      <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${rec.priority === 'high' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {rec.priority}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold mb-1 group-hover:text-emerald-400 transition-colors">{rec.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{rec.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
