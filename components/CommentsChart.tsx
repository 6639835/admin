'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartDataPoint } from '@/types/comment';
import { TrendingUp } from 'lucide-react';

interface CommentsChartProps {
  data: ChartDataPoint[];
}

export default function CommentsChart({ data }: CommentsChartProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[var(--c-brand)]/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-[var(--c-brand)]" />
        </div>
        <h2 className="text-xl font-bold text-primary">
          Comments Trend (Last 30 Days)
        </h2>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-slate-700" opacity={0.5} />
            <XAxis
              dataKey="date"
              stroke="currentColor"
              className="text-tertiary"
              tick={{ fill: 'currentColor' }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis stroke="currentColor" className="text-tertiary" tick={{ fill: 'currentColor' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(var(--tw-color-slate-800) / 0.95)',
                border: '1px solid rgb(var(--tw-color-slate-700))',
                borderRadius: '0.5rem',
                color: '#F9FAFB',
                backdropFilter: 'blur(8px)',
              }}
              labelStyle={{ color: '#9CA3AF' }}
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString();
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="var(--c-brand)"
              strokeWidth={3}
              dot={{ fill: 'var(--c-brand)', r: 4, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

