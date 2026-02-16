
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
  PlusCircle
} from 'lucide-react';
import { INITIAL_DATA } from './constants';
import { DashboardState, ScenarioResult, StrategicRecommendation, FinancialGoal, BudgetCategory, InvestmentItem } from './types';
import { MetricCard } from './components/MetricCard';
import { CashFlowChart } from './components/CashFlowChart';
import { HistoryTable } from './components/HistoryTable';
import { analyzeFinancialData, simulateScenario } from './services/geminiService';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from 'recharts';

const App: React.FC = () => {
  const [state, setState] = useState<DashboardState>(INITIAL_DATA);
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'scenarios' | 'risks' | 'history' | 'budgets' | 'investments' | 'resources'>('overview');
  const [scenarioInput, setScenarioInput] = useState('');
  const [fileData, setFileData] = useState<{data: string, mimeType: string} | null>(null);
  const [chartViewMonths, setChartViewMonths] = useState<number>(6);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal States
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  // Form States
  const [newGoal, setNewGoal] = useState<Partial<FinancialGoal>>({ category: 'Asset', targetAmount: 0, currentAmount: 0 });
  const [newBudget, setNewBudget] = useState<Partial<BudgetCategory>>({ allocated: 0, spent: 0 });

  const filteredCashFlowData = useMemo(() => {
    return state.cashFlowHistory.slice(-chartViewMonths);
  }, [state.cashFlowHistory, chartViewMonths]);

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

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
      const update = await analyzeFinancialData(query || "Analyze current financials and historical trends.", state, fileData || undefined);
      setState(prev => ({ ...prev, ...update }));
      setQuery('');
      setFileData(null);
    } catch (err) {
      alert("Analysis failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) return;
    const goal: FinancialGoal = {
      id: `g-${Date.now()}`,
      title: newGoal.title!,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: Number(newGoal.currentAmount || 0),
      deadline: newGoal.deadline!,
      category: newGoal.category as any
    };
    setState(prev => ({ ...prev, goals: [...prev.goals, goal] }));
    setShowGoalModal(false);
    setNewGoal({ category: 'Asset', targetAmount: 0, currentAmount: 0 });
  };

  const handleAddBudget = () => {
    if (!newBudget.name || !newBudget.allocated) return;
    const budget: BudgetCategory = {
      id: `b-${Date.now()}`,
      name: newBudget.name!,
      allocated: Number(newBudget.allocated),
      spent: Number(newBudget.spent || 0)
    };
    setState(prev => ({ ...prev, budgets: [...prev.budgets, budget] }));
    setShowBudgetModal(false);
    setNewBudget({ allocated: 0, spent: 0 });
  };

  const handleSimulate = async () => {
    if (!scenarioInput) return;
    setIsProcessing(true);
    try {
      const result = await simulateScenario(scenarioInput, state);
      setState(prev => ({
        ...prev,
        scenarios: [result, ...prev.scenarios].slice(0, 5)
      }));
      setScenarioInput('');
      setActiveTab('scenarios');
    } catch (err) {
      alert("Simulation failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Month', 'Year', 'Revenue', 'Expenses', 'EBITDA', 'Inflow', 'Outflow', 'Net Balance', 'Type'];
    const rows = state.cashFlowHistory.map(d => [
      d.month,
      d.year,
      d.revenue || 0,
      d.expenses || 0,
      d.ebitda || 0,
      d.inflow,
      d.outflow,
      d.balance,
      d.prediction ? 'Forecast' : 'Actual'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `JeffreyWooFinance_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen shadow-2xl z-30">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight text-white">JeffreyWooFinance</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Strategic Finance</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Analysis</p>
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <BarChart3 size={18} />
            <span className="font-medium text-sm">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <History size={18} />
            <span className="font-medium text-sm">Trends & Ledger</span>
          </button>

          <p className="px-4 py-2 mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Management</p>
          <button 
            onClick={() => setActiveTab('budgets')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'budgets' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Wallet size={18} />
            <span className="font-medium text-sm">Budget & Goals</span>
          </button>
          <button 
            onClick={() => setActiveTab('investments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'investments' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Briefcase size={18} />
            <span className="font-medium text-sm">Portfolio</span>
          </button>
          
          <p className="px-4 py-2 mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Strategy</p>
          <button 
            onClick={() => setActiveTab('risks')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'risks' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <ShieldAlert size={18} />
            <span className="font-medium text-sm">Risk Matrix</span>
          </button>
          <button 
            onClick={() => setActiveTab('scenarios')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'scenarios' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Zap size={18} />
            <span className="font-medium text-sm">Scenario Lab</span>
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'resources' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <BookOpen size={18} />
            <span className="font-medium text-sm">Resources</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">CFO Engine</p>
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Gemini Pro 3.0</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-8 py-4 flex items-center justify-between backdrop-blur-md bg-white/90">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Executive Strategic Overview</h2>
            <p className="text-xs text-slate-500">Intelligent Asset Management System • {state.lastUpdated}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Settings size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-200">
              JW
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Quick Action Bar (Global) */}
          <section className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                    <MessageSquare size={18} className="text-blue-400" />
                    JeffreyWooFinance AI Core
                  </h3>
                  <p className="text-slate-400 text-xs mb-4">Ingest financial statements or query complex simulations across all modules.</p>
                  <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                    <input 
                      type="text" 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask AI: 'Compare my budget spend to Q1' or 'Evaluate asset risk'..."
                      className="bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 text-sm flex-1 px-4"
                      onKeyDown={(e) => e.key === 'Enter' && runAnalysis()}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-2 rounded-lg transition-colors ${fileData ? 'bg-emerald-500 text-white' : 'hover:bg-white/10 text-slate-400'}`}
                      title="Upload Financial Document"
                    >
                      <Upload size={18} />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileUpload} 
                      accept=".pdf,.doc,.docx,.xlsx,.txt,image/*"
                    />
                    <button 
                      onClick={runAnalysis}
                      disabled={isProcessing || (!query && !fileData)}
                      className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                    >
                      {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
                      Analyze
                    </button>
                  </div>
                </div>
             </div>
          </section>

          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {state.metrics.map((m, i) => (
                  <MetricCard key={i} metric={m} />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <Calendar size={18} className="text-blue-600" />
                        Cash Flow Performance & Forecast
                      </h4>
                      <p className="text-xs text-slate-500">Historical trends vs AI-driven projections</p>
                    </div>
                  </div>
                  <CashFlowChart data={filteredCashFlowData} />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <h4 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                    <Target size={20} className="text-blue-600" />
                    Executive Advisory
                  </h4>
                  <div className="space-y-4 flex-1">
                    {state.recommendations.map(rec => (
                      <div key={rec.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 group hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${rec.priority === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                            {rec.category}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-sm mb-1">{rec.title}</h5>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{rec.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'budgets' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Budgeting & Strategic Goals</h3>
                  <p className="text-sm text-slate-500 mt-1">Configure allocation and track enterprise-wide milestones.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowGoalModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                  >
                    <PlusCircle size={16} /> Add Goal
                  </button>
                  <button 
                    onClick={() => setShowBudgetModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                  >
                    <PlusCircle size={16} /> Add Budget
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Budget vs Actual */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <PieChart size={20} className="text-blue-600" />
                    Budget Utilization
                  </h3>
                  <div className="space-y-6">
                    {state.budgets.length === 0 && <p className="text-sm text-slate-400 italic">No budget categories defined.</p>}
                    {state.budgets.map(cat => (
                      <div key={cat.id} className="space-y-2 group">
                        <div className="flex justify-between items-end">
                          <span className="text-sm font-semibold text-slate-700">{cat.name}</span>
                          <span className="text-xs font-bold text-slate-400 mono">
                            ${(cat.spent / 1000).toFixed(0)}k / ${(cat.allocated / 1000).toFixed(0)}k
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${cat.spent > cat.allocated ? 'bg-rose-500' : 'bg-blue-600'}`}
                            style={{ width: `${Math.min((cat.spent / (cat.allocated || 1)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Goals */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Target size={20} className="text-emerald-600" />
                    Strategic Goals
                  </h3>
                  <div className="space-y-6">
                    {state.goals.length === 0 && <p className="text-sm text-slate-400 italic">No strategic goals set.</p>}
                    {state.goals.map(goal => (
                      <div key={goal.id} className="p-4 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-emerald-200 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[9px] font-bold uppercase text-emerald-600 tracking-widest">{goal.category}</span>
                            <h4 className="font-bold text-slate-900 text-sm">{goal.title}</h4>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-900 mono">
                              {((goal.currentAmount / (goal.targetAmount || 1)) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full mb-3 overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 transition-all duration-1000"
                            style={{ width: `${(goal.currentAmount / (goal.targetAmount || 1)) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          <span>Target: ${(goal.targetAmount / 1000000).toFixed(1)}M</span>
                          <span>Deadline: {goal.deadline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modals */}
              {showGoalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                  <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h4 className="text-lg font-bold text-slate-900">Add Strategic Goal</h4>
                      <button onClick={() => setShowGoalModal(false)} className="p-1 text-slate-400 hover:text-slate-600"><X size={20}/></button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Goal Title</label>
                        <input 
                          type="text" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          placeholder="e.g. Asset Acquisition"
                          value={newGoal.title || ''}
                          onChange={e => setNewGoal(p => ({ ...p, title: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Target Amount ($)</label>
                          <input 
                            type="number" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            placeholder="1000000"
                            value={newGoal.targetAmount || ''}
                            onChange={e => setNewGoal(p => ({ ...p, targetAmount: Number(e.target.value) }))}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Deadline</label>
                          <input 
                            type="date" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            value={newGoal.deadline || ''}
                            onChange={e => setNewGoal(p => ({ ...p, deadline: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Category</label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          value={newGoal.category}
                          onChange={e => setNewGoal(p => ({ ...p, category: e.target.value as any }))}
                        >
                          <option value="Asset">Fixed Asset Purchase</option>
                          <option value="Debt">Debt Repayment</option>
                          <option value="Development">Business Development</option>
                        </select>
                      </div>
                      <button 
                        onClick={handleAddGoal}
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all mt-4"
                      >
                        Create Goal
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showBudgetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                  <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h4 className="text-lg font-bold text-slate-900">Define Budget Category</h4>
                      <button onClick={() => setShowBudgetModal(false)} className="p-1 text-slate-400 hover:text-slate-600"><X size={20}/></button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Category Name</label>
                        <input 
                          type="text" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          placeholder="e.g. Sales & Marketing"
                          value={newBudget.name || ''}
                          onChange={e => setNewBudget(p => ({ ...p, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Allocated Budget ($)</label>
                        <input 
                          type="number" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          placeholder="50000"
                          value={newBudget.allocated || ''}
                          onChange={e => setNewBudget(p => ({ ...p, allocated: Number(e.target.value) }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Initial Spend ($)</label>
                        <input 
                          type="number" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          placeholder="0"
                          value={newBudget.spent || ''}
                          onChange={e => setNewBudget(p => ({ ...p, spent: Number(e.target.value) }))}
                        />
                      </div>
                      <button 
                        onClick={handleAddBudget}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all mt-4"
                      >
                        Set Budget
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'investments' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 self-start flex items-center gap-2">
                      <PieChart size={20} className="text-blue-600" />
                      Asset Allocation
                    </h3>
                    <div className="w-full h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={state.investments}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="allocation"
                            nameKey="name"
                          >
                            {state.investments.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ReTooltip />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Briefcase size={20} className="text-blue-600" />
                      Current Portfolio Performance
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="border-b border-slate-100">
                          <tr>
                            <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset Name</th>
                            <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Value</th>
                            <th className="py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">YTD Return</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {state.investments.map(inv => (
                            <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-4 text-sm font-bold text-slate-900">{inv.name}</td>
                              <td className="py-4 text-sm font-bold text-slate-900 text-right mono">
                                ${(inv.value / 1000).toLocaleString()}k
                              </td>
                              <td className={`py-4 text-sm font-bold text-right mono ${inv.returnYTD >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {inv.returnYTD >= 0 ? '+' : ''}{inv.returnYTD}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
               {[
                 { title: 'Tax Optimization Strategies', desc: 'Enterprise-grade guides for global operations.', icon: <FileText size={24} />, color: 'bg-blue-500' },
                 { title: 'Liquidity Management Tools', desc: 'Calculators and templates for CFOs.', icon: <Wallet size={24} />, color: 'bg-emerald-500' },
                 { title: 'JeffreyWooFinance AI Financial Library', desc: 'Exclusive insights powered by LLM research.', icon: <BookOpen size={24} />, color: 'bg-indigo-600' },
               ].map((res, i) => (
                 <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all group cursor-pointer">
                    <div className={`w-12 h-12 ${res.color} text-white rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                      {res.icon}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{res.title}</h4>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">{res.desc}</p>
                    <div className="flex items-center text-xs font-bold text-blue-600 uppercase tracking-widest group-hover:gap-2 transition-all">
                      Access Resource <ArrowRight size={14} />
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Historical Financial Ledger</h3>
                  <p className="text-sm text-slate-500 mt-1">Audit-ready monthly performance data with EBITDA tracking</p>
                </div>
                <button 
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all"
                >
                  <Download size={16} /> Export CSV
                </button>
              </div>
              <HistoryTable data={state.cashFlowHistory} />
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h3 className="text-2xl font-bold text-slate-900">Active Risk Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {state.risks.map(risk => (
                  <div key={risk.id} className={`p-6 rounded-2xl border shadow-sm transition-all hover:scale-[1.01] ${risk.severity === 'high' ? 'bg-white border-rose-200 shadow-rose-100' : 'bg-white border-amber-200 shadow-amber-100'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${risk.severity === 'high' ? 'bg-rose-500 text-white shadow-lg' : 'bg-amber-500 text-white shadow-lg'}`}>
                        <ShieldAlert size={20} />
                      </div>
                      <div className="text-right font-bold text-xl mono text-slate-700">{risk.probability}%</div>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-2">{risk.title}</h4>
                    <p className="text-slate-500 text-xs mb-4 leading-relaxed">{risk.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'scenarios' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Scenario Simulation Lab</h3>
                  <p className="text-slate-500 text-sm mb-8">Deploy capital strategies to virtual environments and assess long-term viability.</p>
                  <div className="flex flex-col md:flex-row gap-4">
                    <input 
                      type="text" 
                      value={scenarioInput}
                      onChange={(e) => setScenarioInput(e.target.value)}
                      placeholder="e.g. 'Invest $2M in warehouse automation'..."
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm"
                    />
                    <button 
                      onClick={handleSimulate}
                      disabled={isProcessing || !scenarioInput}
                      className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-3 transition-all shadow-xl"
                    >
                      {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                      Simulate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
