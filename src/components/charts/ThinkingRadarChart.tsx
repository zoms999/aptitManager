import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';
import { ThinkingScore } from '@/types/result-types';
import { getRadarChartData } from '@/utils/result-utils';

interface ThinkingRadarChartProps {
  thinkingScore?: ThinkingScore;
}

export function ThinkingRadarChart({ thinkingScore }: ThinkingRadarChartProps) {
  return (
    <div className="h-80 w-full bg-gray-50 rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getRadarChartData(thinkingScore)}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="사고력 점수" dataKey="score" stroke="#8884d8" 
            fill="#8884d8" fillOpacity={0.6} />
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
} 