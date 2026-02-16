
import React from 'react';
import { CashFlowData } from '../types';

interface ExtendedCashFlowData extends CashFlowData {
  displayLabel?: string;
}

interface HistoryTableProps {
  data: ExtendedCashFlowData[];
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/80 border-b border-slate-200 backdrop-blur-sm sticky top-0">
          <tr>
            <th className="px-6 py-5 text-[10px] font-bold uppercase text-slate-500 tracking-widest">Period / Year</th>
            <th className="px-6 py-5 text-[10px] font-bold uppercase text-slate-500 tracking-widest text-right">Revenue</th>
            <th className="px-6 py-5 text-[10px] font-bold uppercase text-slate-500 tracking-widest text-right">EBITDA</th>
            <th className="px-6 py-5 text-[10px] font-bold uppercase text-slate-500 tracking-widest text-right">Gross Margin %</th>
            <th className="px-6 py-5 text-[10px] font-bold uppercase text-slate-500 tracking-widest text-right">Net Margin %</th>
            <th className="px-6 py-5 text-[10px] font-bold uppercase text-slate-500 tracking-widest text-right">Cash Balance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {[...data].reverse().map((row, idx) => (
            <tr key={`${row.month}-${row.year}-${idx}`} className={`transition-all ${row.prediction ? 'bg-blue-50/40 hover:bg-blue-100/40 italic' : 'hover:bg-slate-50/80'}`}>
              <td className="px-6 py-5 text-sm font-bold text-slate-900 mono whitespace-nowrap flex items-center gap-2">
                <span className="opacity-70">{row.displayLabel || `${row.month} ${row.year}`}</span>
                {row.prediction && (
                  <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-md uppercase font-bold not-italic shadow-sm">
                    FORECAST
                  </span>
                )}
              </td>
              <td className={`px-6 py-5 text-sm text-right mono font-semibold ${row.prediction ? 'text-blue-600' : 'text-slate-600'}`}>
                ${(row.revenue || 0).toLocaleString()}
              </td>
              <td className={`px-6 py-5 text-sm font-bold text-right mono ${row.prediction ? 'text-blue-700' : 'text-blue-600'}`}>
                ${(row.ebitda || 0).toLocaleString()}
              </td>
              <td className={`px-6 py-5 text-sm text-right mono font-medium ${row.prediction ? 'text-blue-500' : 'text-slate-500'}`}>
                {row.grossMargin ? `${row.grossMargin}%` : '--'}
              </td>
              <td className={`px-6 py-5 text-sm text-right mono font-medium ${row.prediction ? 'text-blue-500' : 'text-slate-500'}`}>
                {row.netMargin ? `${row.netMargin}%` : '--'}
              </td>
              <td className={`px-6 py-5 text-sm font-bold text-right mono ${row.balance >= 0 ? (row.prediction ? 'text-emerald-500' : 'text-emerald-700') : 'text-rose-600'}`}>
                ${row.balance.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
