import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ThinkingScore } from '@/types/result-types';
import { getThinkingScoreArray } from '@/utils/result-utils';

interface ThinkingBarChartProps {
  thinkingScore?: ThinkingScore;
}

export function ThinkingBarChart({ thinkingScore }: ThinkingBarChartProps) {
  return (
    <div className="h-80 w-full bg-gray-50 rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={getThinkingScoreArray(thinkingScore)}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} tickFormatter={(value: string) => value.replace('사고력', '')} />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value: number) => [`${value}%`, '점수']} />
          <Legend />
          <Bar 
            dataKey="score" 
            name="사고력 점수" 
            fill="#8884d8" 
            label={{ position: 'top', formatter: (value: number) => `${value}%` }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 