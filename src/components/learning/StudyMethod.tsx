'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DonutChart } from './DonutChart';

interface StudyMethodProps {
  username: string;
  tendencyName: string;
  explanation: string;
  chartData: {
    sname: string;
    srate: number;
    scolor: string;
  }[];
  index: number;
}

export const StudyMethod: React.FC<StudyMethodProps> = ({
  username,
  tendencyName,
  explanation,
  chartData,
  index,
}) => {
  // 인덱스에 따라 다른 색상 그라데이션 적용
  const gradientColors = index === 1 
    ? "from-purple-50 to-purple-600"
    : "from-green-50 to-green-600";
  
  const textColor = index === 1 ? "text-purple-800" : "text-green-800";
  const bgColor = index === 1 ? "bg-purple-50" : "bg-green-50";

  return (
    <Card className="mb-6 overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className={`bg-gradient-to-r ${gradientColors} border-b py-3`}>
        <CardTitle className={`text-lg ${textColor}`}>{username}님의 적합한 학습법{index}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
          {/* 학습법 설명 */}
          <div>
            <h3 className="text-md font-medium mb-2 text-gray-800">{tendencyName} 학습법</h3>
            <div className={`${bgColor} p-4 rounded-md mb-4`}>
              <p className="text-gray-700 whitespace-pre-line">{explanation}</p>
            </div>
          </div>

          {/* 차트 */}
          <div className="flex justify-center items-center">
            <DonutChart data={chartData} height={250} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 