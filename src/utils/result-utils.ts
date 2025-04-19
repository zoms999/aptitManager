import { ThinkingScore, PreferenceData } from '@/types/result-types';

/**
 * 사고력 점수를 차트 표시용 배열로 변환
 */
export const getThinkingScoreArray = (thinkingScore?: ThinkingScore) => {
  if (!thinkingScore) return [];
  
  // 이름과 점수로 사고력 데이터 정렬
  const scores = [
    { name: '사실적사고력', score: thinkingScore.thk1 || 0 },
    { name: '추론적사고력', score: thinkingScore.thk2 || 0 },
    { name: '고정적사고력', score: thinkingScore.thk3 || 0 },
    { name: '창의적사고력', score: thinkingScore.thk4 || 0 },
    { name: '분석적사고력', score: thinkingScore.thk5 || 0 },
    { name: '융합적사고력', score: thinkingScore.thk6 || 0 },
    { name: '수직적사고력', score: thinkingScore.thk7 || 0 },
    { name: '수평적사고력', score: thinkingScore.thk8 || 0 }
  ];
  
  return scores;
};

/**
 * 사고력 점수를 레이더 차트 표시용 배열로 변환
 */
export const getRadarChartData = (thinkingScore?: ThinkingScore) => {
  if (!thinkingScore) return [];
  
  return [
    { subject: '수직적', score: thinkingScore.thk7 || 0, fullMark: 100 },
    { subject: '추론적', score: thinkingScore.thk2 || 0, fullMark: 100 },
    { subject: '융합적', score: thinkingScore.thk6 || 0, fullMark: 100 },
    { subject: '고정적', score: thinkingScore.thk3 || 0, fullMark: 100 },
    { subject: '사실적', score: thinkingScore.thk1 || 0, fullMark: 100 },
    { subject: '분석적', score: thinkingScore.thk5 || 0, fullMark: 100 },
    { subject: '수평적', score: thinkingScore.thk8 || 0, fullMark: 100 },
    { subject: '창의적', score: thinkingScore.thk4 || 0, fullMark: 100 }
  ];
};

/**
 * 선호도 데이터를 차트 표시용 배열로 변환
 */
export const getPreferenceBarData = (preferenceData?: PreferenceData) => {
  if (!preferenceData) return [];
  
  return [
    {
      name: preferenceData.tdname1,
      선호도: preferenceData.rrate1
    },
    {
      name: preferenceData.tdname2,
      선호도: preferenceData.rrate2
    },
    {
      name: preferenceData.tdname3,
      선호도: preferenceData.rrate3
    }
  ];
}; 