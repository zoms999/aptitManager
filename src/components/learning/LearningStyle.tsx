'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Shadcn UI 컴포넌트 사용 가정
import { DonutChart } from './DonutChart'; // 이전 단계에서 수정한 DonutChart 컴포넌트

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
    scolor?: string | null; // DonutChart 변경사항 반영
  }[];
  style2Data: {
    sname: string;
    srate: number;
    scolor?: string | null; // DonutChart 변경사항 반영
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
    // Card 스타일 조정: 그림자 약간 줄이고, hover 효과 제거, border 추가하여 구분감 부여
    <Card className="mb-6 overflow-hidden border border-slate-200 shadow-sm transition-all duration-300">
      {/* CardHeader 스타일 조정: 그라데이션 제거, 부드러운 배경색과 하단 테두리 사용 */}
      <CardHeader className="bg-slate-50 border-b border-slate-200 py-3 px-4 sm:px-6">
        {/* CardTitle 스타일 조정: 폰트 크기 유지, 색상 부드럽게 변경 */}
        <CardTitle className="text-md font-semibold text-slate-700">{username}님의 학습스타일</CardTitle>
      </CardHeader>
      {/* CardContent 스타일 조정: 배경색 기본(흰색), 패딩 조정 */}
      <CardContent className="p-4 sm:p-6 bg-white">
        {/* Grid 레이아웃 조정: gap 약간 줄임 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* 성향 1 섹션 */}
          <div className="flex flex-col"> {/* Flex 컬럼으로 변경하여 차트가 하단에 고정되도록 */}
            {/* 제목 스타일 조정: 색상 부드럽게 변경 */}
            <h3 className="text-base font-medium mb-2 text-slate-600">1. {tendency1.name} 스타일</h3>
            {/* 설명 영역 스타일 조정: 배경색 제거, 왼쪽 테두리로 구분, 텍스트 색상 조정 */}
            <div className="border-l-2 border-slate-200 pl-3 mb-4 flex-grow">
              <p className="text-sm text-slate-600 whitespace-pre-line">{tendency1.study}</p>
            </div>
            {/* 차트 컨테이너: 상단 마진 추가 */}
            <div className="flex justify-center mt-4">
              <DonutChart data={style1Data} height={220} /> {/* 높이 약간 줄임 */}
            </div>
          </div>

          {/* 성향 2 섹션 */}
          <div className="flex flex-col"> {/* Flex 컬럼으로 변경 */}
            {/* 제목 스타일 조정 */}
            <h3 className="text-base font-medium mb-2 text-slate-600">2. {tendency2.name} 스타일</h3>
            {/* 설명 영역 스타일 조정 */}
            <div className="border-l-2 border-slate-200 pl-3 mb-4 flex-grow">
              <p className="text-sm text-slate-600 whitespace-pre-line">{tendency2.study}</p>
            </div>
            {/* 차트 컨테이너 */}
            <div className="flex justify-center mt-4">
              <DonutChart data={style2Data} height={220} /> {/* 높이 약간 줄임 */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};