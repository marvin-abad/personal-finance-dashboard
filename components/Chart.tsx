

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/helpers';

interface ChartProps {
  data: { name: string; value: number }[];
}

export const Chart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="name" tick={{ fill: '#e2e8f0' }} />
          <YAxis tickFormatter={(value) => formatCurrency(Number(value))} tick={{ fill: '#e2e8f0' }}/>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}
            formatter={(value) => [formatCurrency(Number(value)), 'Amount']} 
          />
          <Legend wrapperStyle={{ color: '#e2e8f0' }} />
          <Bar dataKey="value" fill="#22c55e" name="Spending"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};