'use client';

import React from 'react';

interface LearningHeaderProps {
  username: string;
}

export const LearningHeader: React.FC<LearningHeaderProps> = ({ username }) => {
  return (
    <div className="mb-8 text-center mx-auto max-w-2xl">
      <h2 className="text-2xl font-bold mb-3">{username} 님</h2>
      <p className="text-gray-700 mb-2">
        옥타그노시스검사 결과에 따른 학습스타일과 성향에 적합한 학습법입니다.
      </p>
      <p className="text-gray-700">
        {username}의 학습성향과 잠재성향에 적합한 학습유형과 구체적인 학습방법을 분석하여 도출한 것입니다.
      </p>
    </div>
  );
}; 