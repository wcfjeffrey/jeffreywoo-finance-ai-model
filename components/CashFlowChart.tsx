
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { CashFlowData } from '../types';

export const CashFlowChart: React.FC<{ data: CashFlowData[] }> = ({ data }) => {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 11 }}
            dy={10}
            tickFormatter={(value, index) => {
                const item = data[index];
                if (!item) return value;
                return `${value} '${String(item.year).slice(-2)}`;
            }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                    const item = payload[0].payload;
                    return `${label} ${item.year} ${item.prediction ? '(Forecasted)' : ''}`;
                }
                return label;
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Area 
            type="monotone" 
            dataKey="inflow" 
            name="Cash Inflow" 
            stroke="#2563eb" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorIn)" 
            animationDuration={1500}
            strokeDasharray={(data.some(d => d.prediction)) ? "5 5" : undefined}
          />
          <Area 
            type="monotone" 
            dataKey="outflow" 
            name="Cash Outflow" 
            stroke="#f43f5e" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorOut)" 
            animationDuration={1500}
            strokeDasharray={(data.some(d => d.prediction)) ? "5 5" : undefined}
          />
          <ReferenceLine y={0} stroke="#cbd5e1" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
