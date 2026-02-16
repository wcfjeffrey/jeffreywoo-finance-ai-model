
import React from 'react';
import { FinancialMetric } from '../types';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const MetricCard: React.FC<{ metric: FinancialMetric }> = ({ metric }) => {
  const isUp = metric.trend === 'up';
  const isDown = metric.trend === 'down';

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-slate-500">{metric.label}</p>
        <span className={`p-1.5 rounded-full ${
          isUp ? 'bg-emerald-50 text-emerald-600' : 
          isDown ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
        }`}>
          {isUp && <ArrowUpRight size={16} />}
          {isDown && <ArrowDownRight size={16} />}
          {!isUp && !isDown && <Minus size={16} />}
        </span>
      </div>
      <div className="flex items-end gap-3">
        <h3 className="text-3xl font-bold text-slate-900 mono tracking-tight">{metric.value}</h3>
        {metric.change !== 0 && (
          <span className={`text-sm font-semibold mb-1 ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isUp ? '+' : ''}{metric.change}%
          </span>
        )}
      </div>
    </div>
  );
};
