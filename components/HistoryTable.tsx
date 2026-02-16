
import React from 'react';
import { CashFlowData } from '../types';

interface HistoryTableProps {
  data: CashFlowData[];
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500 tracking-wider">Period</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500 tracking-wider text-right">Revenue</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500 tracking-wider text-right">Expenses</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500 tracking-wider text-right">EBITDA</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500 tracking-wider text-right">Cash In</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500 tracking-wider text-right">Cash Out</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-500 tracking-wider text-right">Net Balance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {[...data].reverse().map((row, idx) => (
            <tr key={`${row.month}-${row.year}`} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-semibold text-slate-900 mono whitespace-nowrap">
                {row.month} {row.year}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 text-right mono">
                ${(row.revenue || 0).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 text-right mono">
                ${(row.expenses || 0).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-blue-600 text-right mono">
                ${(row.ebitda || 0).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-emerald-600 text-right mono">
                ${row.inflow.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-rose-500 text-right mono">
                ${row.outflow.toLocaleString()}
              </td>
              <td className={`px-6 py-4 text-sm font-bold text-right mono ${row.balance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                ${row.balance.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
