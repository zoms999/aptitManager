'use client';

import { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// 기존 page.tsx의 인터페이스 재사용
interface PersonalInfo {
  id: string;
  pname: string;
  birth: string;
  sex: string;
  cellphone: string;
  contact: string;
  email: string;
  education: string;
  school: string;
  syear: string;
  smajor: string;
  job: string;
  age: number;
  pe_job_name: string;
  pe_job_detail: string;
}

interface Tendency {
  tnd1: string;
  tnd2: string;
}

interface TendencyItem {
  tendency_name: string;
  rank: number;
  code: string;
}

interface TendencyExplain {
  rank: number;
  tendency_name: string;
  explanation: string;
}

interface TendencyQuestionExplain {
  qu_explain: string;
  rank: number;
}

interface ThinkingMain {
  thkm: string;  // 주사고
  thks: string;  // 부사고
  tscore: number; // T점수
}

interface ThinkingScore {
  thk1: number;
  thk2: number;
  thk3: number;
  thk4: number;
  thk5: number;
  thk6: number;
  thk7: number;
  thk8: number;
}

interface ThinkingDetail {
  qua_name: string;
  score: number;
  explain: string;
}

interface SuitableJobsSummary {
  tendency: string;
  tndjob: string;
}

interface SuitableJob {
  jo_name: string;
  jo_outline: string;
  jo_mainbusiness: string;
}

interface SuitableJobMajor {
  jo_name: string;
  major: string;
}

interface ImagePreference {
  tcnt: number;   // 이미지 총 반응 수
  cnt: number;    // 사용자가 선호 반응을 보인 수
  irate: number;  // 선호반응률(%)
}

interface PreferenceData {
  tdname1: string;
  qcnt1: number;
  rrate1: number;
  tdname2: string;
  qcnt2: number;
  rrate2: number;
  tdname3: string;
  qcnt3: number;
  rrate3: number;
  exp1: string;
  exp2: string;
  exp3: string;
}

interface PreferenceJob {
  qua_name: string;
  jo_name: string;
  jo_outline: string;
  jo_mainbusiness: string;
  majors: string;
}

interface ResultData {
  personalInfo: PersonalInfo;
  tendency: Tendency;
  tendency1Explain: { replace: string };
  tendency2Explain: { replace: string };
  topTendencies: TendencyItem[];
  bottomTendencies: TendencyItem[];
  tendencyQuestionExplains: TendencyQuestionExplain[];
  topTendencyExplains: TendencyExplain[];
  bottomTendencyExplains: TendencyExplain[];
  thinkingMain: ThinkingMain;
  thinkingScore: ThinkingScore;
  thinkingDetails: ThinkingDetail[];
  suitableJobsSummary: SuitableJobsSummary;
  suitableJobsDetail: SuitableJob[];
  suitableJobMajors: SuitableJobMajor[];
  imagePreference?: ImagePreference;
  preferenceData?: PreferenceData;
  preferenceJobs1?: PreferenceJob[];
  preferenceJobs2?: PreferenceJob[];
  preferenceJobs3?: PreferenceJob[];
  pd_kind?: string;
}

export default function PrintResultPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 상대 경로 대신 절대 경로 사용
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/api/individuals-result/${id}`);
        
        if (!response.ok) {
          throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          // 선호도 데이터 가져오기
          try {
            const prefResponse = await fetch(`${baseUrl}/api/individuals-result/${id}/preference`);
            
            if (prefResponse.ok) {
              const prefResult = await prefResponse.json();
              
              if (prefResult.success) {
                result.data.preferenceData = prefResult.data.preferenceData;
                result.data.preferenceJobs1 = prefResult.data.preferenceJobs1;
                result.data.preferenceJobs2 = prefResult.data.preferenceJobs2;
                result.data.preferenceJobs3 = prefResult.data.preferenceJobs3;
              }
            } else {
              console.warn('선호도 데이터를 가져오는데 실패했지만 계속 진행합니다.');
            }
          } catch (prefErr) {
            console.error('선호도 데이터 로딩 중 오류:', prefErr);
            // 선호도 데이터 오류는 치명적이지 않음, 진행
          } finally {
            setData(result.data);
            setLoading(false);
          }
        } else {
          setError(result.message || '데이터를 불러오는데 실패했습니다.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching result data:', err);
        setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // 인쇄 자동 실행
  useEffect(() => {
    if (!loading && data) {
      // 약간의 지연 후 인쇄 실행 (렌더링 완료 보장)
      const timer = setTimeout(() => {
        window.print();
      }, 1500); // 1.5초로 증가
      
      return () => clearTimeout(timer);
    }
  }, [loading, data]);

  // 사고력 점수 데이터 배열 생성
  const getThinkingScoreArray = () => {
    if (!data?.thinkingScore) return [];
    
    // 이름과 점수로 사고력 데이터 정렬
    const scores = [
      { name: '사실적사고력', score: data.thinkingScore.thk1 || 0 },
      { name: '추론적사고력', score: data.thinkingScore.thk2 || 0 },
      { name: '고정적사고력', score: data.thinkingScore.thk3 || 0 },
      { name: '창의적사고력', score: data.thinkingScore.thk4 || 0 },
      { name: '분석적사고력', score: data.thinkingScore.thk5 || 0 },
      { name: '융합적사고력', score: data.thinkingScore.thk6 || 0 },
      { name: '수직적사고력', score: data.thinkingScore.thk7 || 0 },
      { name: '수평적사고력', score: data.thinkingScore.thk8 || 0 }
    ];
    
    return scores;
  };
  
  // 레이더 차트 데이터 생성 함수
  const getRadarChartData = () => {
    if (!data?.thinkingScore) return [];
    
    return [
      { subject: '수직적', score: data.thinkingScore.thk7 || 0, fullMark: 100 },
      { subject: '추론적', score: data.thinkingScore.thk2 || 0, fullMark: 100 },
      { subject: '융합적', score: data.thinkingScore.thk6 || 0, fullMark: 100 },
      { subject: '고정적', score: data.thinkingScore.thk3 || 0, fullMark: 100 },
      { subject: '사실적', score: data.thinkingScore.thk1 || 0, fullMark: 100 },
      { subject: '분석적', score: data.thinkingScore.thk5 || 0, fullMark: 100 },
      { subject: '수평적', score: data.thinkingScore.thk8 || 0, fullMark: 100 },
      { subject: '창의적', score: data.thinkingScore.thk4 || 0, fullMark: 100 }
    ];
  };

  // 선호도 차트 데이터 생성 함수
  const getPreferenceBarData = () => {
    if (!data?.preferenceData) return [];
    
    return [
      {
        name: data.preferenceData.tdname1,
        선호도: data.preferenceData.rrate1
      },
      {
        name: data.preferenceData.tdname2,
        선호도: data.preferenceData.rrate2
      },
      {
        name: data.preferenceData.tdname3,
        선호도: data.preferenceData.rrate3
      }
    ];
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-6 max-w-7xl">
        <div className="text-center">
          <h1 className="text-2xl mb-4">데이터를 불러오는 중입니다...</h1>
          <p className="text-gray-500">ID: {id}</p>
          <p className="text-gray-500">URL: {typeof window !== 'undefined' ? window.location.href : ''}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-6 max-w-7xl">
        <div className="bg-red-50 p-6 rounded-lg text-red-800">
          <h2 className="text-xl font-bold mb-4">오류가 발생했습니다</h2>
          <p className="mb-4">{error}</p>
          <div className="bg-white p-4 rounded-lg my-4 text-gray-700 overflow-auto max-h-60">
            <pre className="whitespace-pre-wrap">{JSON.stringify({ id }, null, 2)}</pre>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
          <button 
            onClick={() => window.close()} 
            className="mt-4 ml-4 px-6 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition-colors"
          >
            창 닫기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-6 max-w-7xl print-container">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .print-container {
            width: 100%;
            max-width: 100%;
            padding: 0;
          }
          
          .no-print {
            display: none !important;
          }
          
          section {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 2rem;
          }
          
          h2 {
            break-after: avoid;
            page-break-after: avoid;
          }
          
          .print-avoid-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
      
      <h1 className="text-3xl font-bold text-center mb-8">{data?.personalInfo.pname}님의 검사결과</h1>
      
      {/* 개인정보 섹션 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-200 pb-2">개인정보</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 개인 기본 정보 */}
          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">개인 기본 정보</h3>
            <dl className="space-y-3">
              <div className="flex items-start">
                <dt className="w-28 text-gray-500 font-medium">이름</dt>
                <dd className="font-semibold">{data?.personalInfo.pname}</dd>
              </div>
              
              <div className="flex items-start">
                <dt className="w-28 text-gray-500 font-medium">아이디</dt>
                <dd>{data?.personalInfo.id}</dd>
              </div>
              
              <div className="flex items-start">
                <dt className="w-28 text-gray-500 font-medium">성별</dt>
                <dd>{data?.personalInfo.sex}</dd>
              </div>
              
              <div className="flex items-start">
                <dt className="w-28 text-gray-500 font-medium">생년월일</dt>
                <dd>{data?.personalInfo.birth} ({data?.personalInfo.age}세)</dd>
              </div>
              
              <div className="flex items-start">
                <dt className="w-28 text-gray-500 font-medium">휴대전화</dt>
                <dd>{data?.personalInfo.cellphone || '-'}</dd>
              </div>
              
              <div className="flex items-start">
                <dt className="w-28 text-gray-500 font-medium">이메일</dt>
                <dd>{data?.personalInfo.email || '-'}</dd>
              </div>
            </dl>
          </div>
          
          {/* 학력 및 직업 정보 */}
          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">학력 및 직업 정보</h3>
            <dl className="space-y-3">
              <div className="flex items-start">
                <dt className="w-28 text-gray-500 font-medium">최종학력</dt>
                <dd>{data?.personalInfo.education || '-'}</dd>
              </div>
              
              <div className="flex items-start">
                <dt className="w-28 text-gray-500 font-medium">학교명</dt>
                <dd>{data?.personalInfo.school || '-'}</dd>
              </div>
              
              <div className="flex items-start">
                <dt className="w-28 text-gray-500 font-medium">학년</dt>
                <dd>{data?.personalInfo.syear || '-'}</dd>
              </div>
              
              <div className="flex items-start">
                <dt className="w-28 text-gray-500 font-medium">전공</dt>
                <dd>{data?.personalInfo.smajor || '-'}</dd>
              </div>
              
              <div className="flex items-start">
                <dt className="w-28 text-gray-500 font-medium">직업</dt>
                <dd>{data?.personalInfo.job || '-'}</dd>
              </div>
              
              <div className="flex items-start">
                <dt className="w-28 text-gray-500 font-medium">직장명</dt>
                <dd>{data?.personalInfo.pe_job_name || '-'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      
      {/* 성향진단 섹션 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-200 pb-2">성향진단</h2>
        
        <div className="mb-6">
          <p className="text-lg text-center mb-4">
            옥타그노시스 검사 결과에 따른 {data?.personalInfo.pname}님의 성향진단 결과입니다.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 나의 성향 (상위 3개) */}
          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">나의 성향</h3>
            <div className="space-y-6">
              {data?.topTendencies?.map((item, index) => {
                const explain = data?.topTendencyExplains?.find(e => e.rank === item.rank);
                
                return (
                  <div key={`top-${index}`} className="print-avoid-break">
                    <div className="bg-gray-100 p-3 mb-2">
                      <span className="font-bold mr-2">상위 {item.rank}성향:</span>
                      <span className="font-semibold">{item.tendency_name}</span>
                    </div>
                    {explain && (
                      <div className="p-3 border border-gray-100">
                        <p className="text-gray-700">{explain.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* 나와 잘 안 맞는 성향 (하위 3개) */}
          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">나와 잘 안 맞는 성향</h3>
            <div className="space-y-6">
              {data?.bottomTendencies?.map((item, index) => {
                const explain = data?.bottomTendencyExplains?.find(e => e.rank === item.rank);
                
                return (
                  <div key={`bottom-${index}`} className="print-avoid-break">
                    <div className="bg-gray-100 p-3 mb-2">
                      <span className="font-bold mr-2">하위 {index + 1}성향:</span>
                      <span className="font-semibold">{item.tendency_name}</span>
                    </div>
                    {explain && (
                      <div className="p-3 border border-gray-100">
                        <p className="text-gray-700">{explain.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
          <p className="text-gray-700">
            나를 이루는 기운이 되는 성향 3개를 진단해드렸습니다. 하위성향은 나와는 잘 안 맞는 성향입니다.
          </p>
        </div>
      </section>

      {/* 성향분석 섹션 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-200 pb-2">성향분석</h2>
        
        <div className="mb-6">
          <p className="text-lg text-center mb-4">
            옥타그노시스 검사 결과에 따른 {data?.personalInfo.pname}님의 세부성향분석입니다.
          </p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg mb-6">
          <p className="text-gray-700 text-center">
            옥타그노시스 검사 결과에 따라 {data?.personalInfo.pname}님은 아래와 같은 결과로 분석되었습니다.
          </p>
        </div>
        
        {/* 성향 질문 설명 */}
        {data?.tendencyQuestionExplains && data.tendencyQuestionExplains.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">{data?.personalInfo.pname}님의 성향 특성</h3>
            <div className="space-y-4">
              {data?.tendencyQuestionExplains.map((item, index) => (
                <div key={`explain-${index}`} className="pb-3 border-b border-gray-200 last:border-0 print-avoid-break">
                  <p className="text-gray-700">{item.qu_explain}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 사고력 섹션 - pd_kind가 'basic'이 아닐 때만 표시 */}
      {data?.pd_kind !== 'basic' && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-200 pb-2">사고력</h2>
          
          <div className="mb-6">
            <p className="text-lg text-center mb-4">
              옥타그노시스 검사 결과에 따른 {data?.personalInfo.pname}님의 사고력 진단입니다.
            </p>
          </div>

          {/* 주사고 및 부사고 정보 */}
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="text-xl font-semibold mb-4">사고력 유형 결과</h3>
            <p className="mb-4">
              {data?.personalInfo.pname}님의 주 사고력 유형은 <span className="font-bold">{data?.thinkingMain?.thkm}</span>, 
              부 사고력 유형은 <span className="font-bold">{data?.thinkingMain?.thks}</span>입니다.
              T점수는 <span className="font-bold">{data?.thinkingMain?.tscore}점</span>입니다.
            </p>

            <div className="p-4 bg-gray-100 rounded-lg mb-4">
              <p className="text-gray-700 text-center">
                옥타그노시스 검사 결과, {data?.personalInfo.pname}님의 8가지 사고력을 진단한 결과입니다.
              </p>
            </div>
            
            {/* 사고력 차트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* 바 차트 */}
              <div className="print-avoid-break">
                <h4 className="text-lg font-medium mb-4 text-center">사고력 수직 막대 그래프</h4>
                <div className="h-80 w-full bg-gray-50 rounded-lg">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getThinkingScoreArray()}
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
              </div>
              
              {/* 레이더 차트 */}
              <div className="print-avoid-break">
                <h4 className="text-lg font-medium mb-4 text-center">사고력 분포 그래프</h4>
                <div className="h-80 w-full bg-gray-50 rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getRadarChartData()}>
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
              </div>
            </div>
          </div>
          
          {/* 사고력 영역별 설명 */}
          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">사고력 상세 분석</h3>
            <div className="space-y-6">
              {data?.thinkingDetails?.map((item, index) => {
                const scoreColor = 
                  item.score >= 80 ? 'bg-gray-200' : 
                  item.score >= 51 ? 'bg-gray-100' : 
                  'bg-gray-50';
                
                return (
                  <div key={`thinking-${index}`} className={`border rounded-lg overflow-hidden print-avoid-break ${scoreColor}`}>
                    <div className="p-4 flex justify-between items-center">
                      <h4 className="font-semibold">{item.qua_name}</h4>
                      <span className="px-3 py-1 rounded border">{item.score}점</span>
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-gray-700">{item.explain}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 성향적합직업학과 섹션 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-200 pb-2">성향적합직업학과</h2>
        
        <div className="mb-6">
          <p className="text-lg text-center mb-4">
            옥타그노시스 검사 결과에 따른 {data?.personalInfo.pname}님의 성향에 적합한 직업과 학과입니다.
          </p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg mb-6">
          <p className="text-gray-700 text-center">
            성향과 적성을 분석하여 {data?.personalInfo.pname}님에게 가장 적합한 전공과 직업을 도출한 결과입니다.
          </p>
        </div>
        
        {/* 성향적합직업군 */}
        <div className="border rounded-lg p-4 mb-6">
          <h3 className="text-xl font-semibold mb-4">{data?.suitableJobsSummary?.tendency} 적합직업군</h3>
          
          <div className="space-y-8">
            {data?.suitableJobsDetail && data.suitableJobsDetail.map((job, index) => (
              <div key={`job-${index}`} className="print-avoid-break">
                <div className="bg-gray-100 p-3 mb-3 rounded-t-lg">
                  <h4 className="font-bold">추천{index + 1} {job.jo_name}</h4>
                </div>
                
                <div className="border p-4 rounded-b-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold mb-2">직업개요</h5>
                      <p className="text-gray-700">{job.jo_outline}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold mb-2">주요업무</h5>
                      <p className="text-gray-700 whitespace-pre-line">{job.jo_mainbusiness || '정보가 제공되지 않았습니다.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 성향적합학과군 */}
        <div className="border rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4">{data?.suitableJobsSummary?.tendency} 적합학과군</h3>
          
          <div className="space-y-6">
            {data?.suitableJobMajors?.map((major, index) => (
              <div key={`major-${index}`} className="print-avoid-break">
                <div className="bg-gray-100 p-3 mb-2 rounded-t-lg">
                  <h4 className="font-bold">추천{index + 1}</h4>
                </div>
                
                <div className="border p-4 rounded-b-lg">
                  <p className="text-gray-800 mb-3">{major.major}</p>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="font-medium">관련직업: {major.jo_name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 선호도 섹션 */}
      {data?.preferenceData && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-200 pb-2">선호도</h2>
          
          <div className="mb-6">
            <p className="text-lg text-center mb-4">
              옥타그노시스 검사 결과에 따른 {data?.personalInfo.pname}님의 선호도 분석입니다.
            </p>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg mb-6">
            <p className="text-gray-700 text-center">
              이미지를 통해 선호하는 직업과 학과를 분석한 결과입니다.
            </p>
          </div>
          
          {/* 선호반응 비율 */}
          {data?.imagePreference && (
            <div className="border rounded-lg p-4 mb-6 print-avoid-break">
              <h3 className="text-xl font-semibold mb-4">선호반응 비율</h3>
              
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[{ name: '선호반응율', value: Math.round(data.imagePreference.irate) }]}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="선호반응율(%)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 text-center">
                <div className="inline-block bg-gray-50 px-4 py-2 rounded">
                  <p className="text-gray-700">
                    전체 이미지 중 <span className="font-bold">{data.imagePreference.cnt}개</span>의 이미지에 선호 반응을 보였습니다.
                    (전체: {data.imagePreference.tcnt}개, 선호비율: {Math.round(data.imagePreference.irate)}%)
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* 선호도 차트 */}
          <div className="border rounded-lg p-4 mb-6 print-avoid-break">
            <h3 className="text-xl font-semibold mb-4">이미지 선호도 분석 차트</h3>
            
            <div className="h-[250px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={getPreferenceBarData()}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 40,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="선호도" fill="#8884d8" name="선호도(%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* 선호 이미지 상위 3개 */}
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="text-xl font-semibold mb-4">선호 이미지 상위 3개</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 첫 번째 선호 이미지 */}
              <div className="border rounded p-3 print-avoid-break">
                <div className="bg-gray-100 p-2 mb-2">
                  <h4 className="font-semibold">1순위: {data.preferenceData.tdname1}</h4>
                </div>
                <div>
                  <div className="mb-1">
                    <span className="text-sm text-gray-500">응답수:</span>
                    <span className="ml-2 font-medium">{data.preferenceData.qcnt1}개</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm text-gray-500">선호도:</span>
                    <span className="ml-2 font-medium">{data.preferenceData.rrate1}%</span>
                  </div>
                  <p className="text-gray-700 text-sm">{data.preferenceData.exp1}</p>
                </div>
              </div>
              
              {/* 두 번째 선호 이미지 */}
              <div className="border rounded p-3 print-avoid-break">
                <div className="bg-gray-100 p-2 mb-2">
                  <h4 className="font-semibold">2순위: {data.preferenceData.tdname2}</h4>
                </div>
                <div>
                  <div className="mb-1">
                    <span className="text-sm text-gray-500">응답수:</span>
                    <span className="ml-2 font-medium">{data.preferenceData.qcnt2}개</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm text-gray-500">선호도:</span>
                    <span className="ml-2 font-medium">{data.preferenceData.rrate2}%</span>
                  </div>
                  <p className="text-gray-700 text-sm">{data.preferenceData.exp2}</p>
                </div>
              </div>
              
              {/* 세 번째 선호 이미지 */}
              <div className="border rounded p-3 print-avoid-break">
                <div className="bg-gray-100 p-2 mb-2">
                  <h4 className="font-semibold">3순위: {data.preferenceData.tdname3}</h4>
                </div>
                <div>
                  <div className="mb-1">
                    <span className="text-sm text-gray-500">응답수:</span>
                    <span className="ml-2 font-medium">{data.preferenceData.qcnt3}개</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm text-gray-500">선호도:</span>
                    <span className="ml-2 font-medium">{data.preferenceData.rrate3}%</span>
                  </div>
                  <p className="text-gray-700 text-sm">{data.preferenceData.exp3}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 선호도에 따른 직업/학과 리스트 */}
          <div className="space-y-8">
            {/* 1순위 이미지 선호도에 따른 직업/학과 */}
            {data?.preferenceJobs1 && data.preferenceJobs1.length > 0 && (
              <div className="border rounded-lg p-4 print-avoid-break">
                <h3 className="text-xl font-semibold mb-4">1순위 이미지 선호도에 따른 추천직업/학과</h3>
                
                <div className="space-y-6">
                  {data.preferenceJobs1.map((job, index) => (
                    <div key={`job1-${index}`} className="print-avoid-break">
                      <div className="bg-gray-100 p-3 mb-2 rounded-t-lg">
                        <h4 className="font-bold">추천{index + 1} {job.jo_name}</h4>
                      </div>
                      
                      <div className="border p-4 rounded-b-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <h5 className="font-semibold mb-1">직업개요</h5>
                            <p className="text-gray-700 text-sm">{job.jo_outline}</p>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold mb-1">주요업무</h5>
                            <p className="text-gray-700 text-sm whitespace-pre-line">{job.jo_mainbusiness || '정보가 제공되지 않았습니다.'}</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded">
                          <h5 className="font-semibold mb-1">관련학과</h5>
                          <p className="text-gray-700">{job.majors}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 2순위 이미지 선호도에 따른 직업/학과 - 생략 가능 */}
            {/* 3순위 이미지 선호도에 따른 직업/학과 - 생략 가능 */}
          </div>
        </section>
      )}
      
      {/* 인쇄 버튼 (화면에서만 표시, 인쇄 시 제외) */}
      <div className="mt-8 flex justify-center no-print">
        <button 
          onClick={() => window.print()} 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          인쇄하기
        </button>
      </div>
    </div>
  );
} 