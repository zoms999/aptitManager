'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Shadcn UI 컴포넌트 사용 가정
import { DonutChart } from './DonutChart'; // 수정된 DonutChart 컴포넌트

interface StudyMethodProps {
  username: string;
  tendencyName: string;
  explanation: string;
  chartData: {
    sname: string;
    srate: number;
    scolor?: string | null; // DonutChart 변경사항 반영 (scolor가 없을 수 있음)
  }[];
  index: number; // 인덱스는 제목에만 사용
}

export const StudyMethod: React.FC<StudyMethodProps> = ({
  username,
  tendencyName,
  explanation,
  chartData,
  index,
}) => {
  // --- 인덱스 기반 색상 변수 제거 ---
  // const gradientColors = index === 1
  //   ? "from-purple-50 to-purple-600"
  //   : "from-green-50 to-green-600";
  // const textColor = index === 1 ? "text-purple-800" : "text-green-800";
  // const bgColor = index === 1 ? "bg-purple-50" : "bg-green-50";
  // --- --- --- --- ---

  return (
    // Card 스타일: 그림자 줄이고, hover 효과 제거, 테두리 추가
    <Card className="mb-6 overflow-hidden border border-slate-200 shadow-sm transition-all duration-300">
      {/* CardHeader 스타일: 그라데이션 제거, 부드러운 배경색과 하단 테두리 */}
      <CardHeader className="bg-slate-50 border-b border-slate-200 py-3 px-4 sm:px-6">
        {/* CardTitle 스타일: 폰트 크기/굵기 조정, 중성적인 색상 적용 */}
        <CardTitle className="text-md font-semibold text-slate-700">
          {username}님의 적합한 학습법 {index}
        </CardTitle>
      </CardHeader>
      {/* CardContent 스타일: 기본 배경색(흰색), 패딩 조정 */}
      <CardContent className="p-4 sm:p-6 bg-white">
        {/* Grid 레이아웃: gap 조정 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* 학습법 설명 섹션 */}
          <div className="flex flex-col"> {/* 설명과 제목을 그룹화하고 정렬을 위해 flex 사용 */}
            {/* 제목 스타일: 색상 부드럽게 변경, 크기 조정 */}
            <h3 className="text-base font-medium mb-2 text-slate-600">{tendencyName} 학습법</h3>
            {/* 설명 영역 스타일: 배경색 제거, 왼쪽 테두리로 구분, 텍스트 스타일 조정 */}
            <div className="border-l-2 border-slate-200 pl-3 flex-grow"> {/* flex-grow 추가 */}
              <p className="text-sm text-slate-600 whitespace-pre-line">{explanation}</p>
            </div>
          </div>

          {/* 차트 섹션 */}
          {/* items-center 제거하고 mt-auto 등으로 조절하거나, 설명 섹션과 높이 맞추기 위해 상단 정렬 유지 */}
          <div className="flex justify-center items-start lg:items-center"> {/* 반응형 정렬 */}
            {/* 차트 높이 약간 줄임 */}
            <DonutChart data={chartData} height={220} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};