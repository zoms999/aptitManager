'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DonutChart } from './DonutChart';

interface LearningStyleProps {
  username: string;
  tendency1: {
    name: string;
    study: string;
  };
  tendency2: {
    name: string;
    study: string;
  };
  style1Data: {
    sname: string;
    srate: number;
    scolor: string;
  }[];
  style2Data: {
    sname: string;
    srate: number;
    scolor: string;
  }[];
}

export const LearningStyle: React.FC<LearningStyleProps> = ({
  username,
  tendency1,
  tendency2,
  style1Data,
  style2Data,
}) => {
  return (
    <Card className="mb-6 overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-600 border-b border-blue-100 py-3">
        <CardTitle className="text-lg text-blue-800">{username}님의 학습스타일</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
          {/* 성향 1 */}
          <div>
            <h3 className="text-md font-medium mb-2 text-blue-700">1. {tendency1.name} 스타일</h3>
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <p className="text-gray-700 whitespace-pre-line">{tendency1.study}</p>
            </div>
            <div className="flex justify-center">
              <DonutChart data={style1Data} height={250} />
            </div>
          </div>

          {/* 성향 2 */}
          <div>
            <h3 className="text-md font-medium mb-2 text-blue-700">2. {tendency2.name} 스타일</h3>
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <p className="text-gray-700 whitespace-pre-line">{tendency2.study}</p>
            </div>
            <div className="flex justify-center">
              <DonutChart data={style2Data} height={250} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 