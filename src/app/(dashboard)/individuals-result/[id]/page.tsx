'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, User, Brain, PieChart, Lightbulb, Briefcase, GraduationCap, BookOpen, School, CheckSquare, Heart, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
  talentList?: string;
  talentDetails?: TalentDetail[];
}

interface TalentDetail {
  qua_name: string;
  tscore: number;
  explain: string;
}

export default function IndividualResultPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedTop, setExpandedTop] = useState<number[]>([]);
  const [expandedBottom, setExpandedBottom] = useState<number[]>([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 기본 데이터 로드
        const response = await fetch(`/api/individuals-result/${id}`);
        const result = await response.json();
        
        if (result.success) {
          // 선호도 데이터 로드
          try {
            const prefResponse = await fetch(`/api/individuals-result/${id}/preference`);
            const prefResult = await prefResponse.json();
            
            if (prefResult.success) {
              result.data.preferenceData = prefResult.data.preferenceData;
              result.data.preferenceJobs1 = prefResult.data.preferenceJobs1;
              result.data.preferenceJobs2 = prefResult.data.preferenceJobs2;
              result.data.preferenceJobs3 = prefResult.data.preferenceJobs3;
            }
          } catch (error) {
            console.error('선호도 데이터 로딩 오류:', error);
          }
          
          // 역량진단 데이터 로드 함수 호출
          await loadCompetencyData(result.data);
          
          // 최종 데이터 설정
          setData(result.data);
        } else {
          setError(result.message || '데이터를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.error('데이터 로딩 오류:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // 역량진단 데이터를 로드하는 별도 함수
    const loadCompetencyData = async (resultData: ResultData) => {
      console.log(`===== 역량진단 데이터 로드 시작 =====`);
      console.log(`ID: ${id}`);
      
      try {
        const url = `/api/individuals-result/${id}/competency`;
        console.log(`역량진단 API URL: ${url}`);
        
        // API 요청 수행
        const response = await fetch(url);
        console.log(`역량진단 API 응답 상태: ${response.status} ${response.statusText}`);
        
        // 응답 처리
        if (response.ok) {
          // 응답 텍스트 확인
          const responseText = await response.text();
          console.log(`역량진단 API 응답 텍스트:`, responseText);
          
          try {
            // JSON 파싱
            const data = JSON.parse(responseText);
            console.log(`역량진단 API 응답 파싱 성공:`, data);
            
            if (data.success) {
              resultData.talentList = data.data.talentList;
              resultData.talentDetails = data.data.talentDetails;
              console.log(`역량진단 데이터 설정 완료:`, {
                talentList: resultData.talentList,
                talentDetailsCount: resultData.talentDetails?.length || 0
              });
            } else {
              console.error(`역량진단 API 성공 플래그 false:`, data.message);
            }
          } catch (jsonError) {
            console.error(`역량진단 API 응답 JSON 파싱 오류:`, jsonError);
          }
        } else {
          console.error(`역량진단 API 호출 실패: ${response.status}`);
        }
      } catch (error) {
        console.error(`역량진단 데이터 로드 중 오류 발생:`, error);
      }
      
      console.log(`===== 역량진단 데이터 로드 종료 =====`);
    };
    
    fetchData();
  }, [id]);
  
  // 뒤로 가기
  const handleGoBack = () => {
    router.back();
  };
  
  // 인쇄 페이지 열기
  const handlePrint = () => {
    const baseUrl = window.location.origin;
    // 화면 크기 계산
    const width = 1024;
    const height = 800;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    // 팝업창을 위한 창 설정
    const windowFeatures = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
    
    // 큰 팝업창으로 열기
    window.open(`${baseUrl}/print/${id}`, '_blank', windowFeatures);
  };
  
  // 성향 설명 토글
  const toggleTopExpand = (rank: number) => {
    if (expandedTop.includes(rank)) {
      setExpandedTop(expandedTop.filter(r => r !== rank));
    } else {
      setExpandedTop([...expandedTop, rank]);
    }
  };
  
  const toggleBottomExpand = (rank: number) => {
    if (expandedBottom.includes(rank)) {
      setExpandedBottom(expandedBottom.filter(r => r !== rank));
    } else {
      setExpandedBottom([...expandedBottom, rank]);
    }
  };
  
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
  
  // 레이더 차트 데이터 생성 함수 추가
  const getRadarChartData = () => {
    if (!data?.thinkingScore) return [];
    
    return [
      { 
        subject: '수직적', 
        score: data.thinkingScore.thk7 || 0,
        fullMark: 100 
      },
      { 
        subject: '추론적', 
        score: data.thinkingScore.thk2 || 0,
        fullMark: 100 
      },
      { 
        subject: '융합적', 
        score: data.thinkingScore.thk6 || 0, 
        fullMark: 100 
      },
      { 
        subject: '고정적', 
        score: data.thinkingScore.thk3 || 0, 
        fullMark: 100 
      },
      { 
        subject: '사실적', 
        score: data.thinkingScore.thk1 || 0, 
        fullMark: 100 
      },
      { 
        subject: '분석적', 
        score: data.thinkingScore.thk5 || 0, 
        fullMark: 100 
      },
      { 
        subject: '수평적', 
        score: data.thinkingScore.thk8 || 0, 
        fullMark: 100 
      },
      { 
        subject: '창의적', 
        score: data.thinkingScore.thk4 || 0, 
        fullMark: 100 
      }
    ];
  };

  // 선호도 차트 데이터 생성 함수 추가
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
  
  // 보고서 다운로드 함수
  const handlePdfDownload = async () => {
    if (!data) return;
    
    try {
      setPdfLoading(true);
      
      // pd_kind가 basic인 경우 사고력 섹션을 제외
      const sections = data.pd_kind === 'basic' 
        ? ['personal', 'tendency', 'analysis', 'suitable-job', 'preference']
        : ['personal', 'tendency', 'analysis', 'thinking', 'suitable-job', 'preference'];
      
      // API 호출하여 PDF 보고서 생성 요청
      const response = await fetch(`/api/individuals-result/${id}/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // 필요한 데이터 선택
          sections,
          options: {
            layout: 'premium', // 고급 레이아웃 사용
            includeCharts: true, // 차트 포함
            headerLogo: true, // 헤더에 로고 포함
            pageNumbers: true, // 페이지 번호 표시
            coverPage: true // 표지 포함
          },
          data: {
            personalInfo: data.personalInfo,
            tendency: data.tendency,
            topTendencies: data.topTendencies,
            bottomTendencies: data.bottomTendencies,
            topTendencyExplains: data.topTendencyExplains,
            bottomTendencyExplains: data.bottomTendencyExplains,
            tendencyQuestionExplains: data.tendencyQuestionExplains,
            suitableJobsSummary: data.suitableJobsSummary,
            suitableJobsDetail: data.suitableJobsDetail,
            suitableJobMajors: data.suitableJobMajors,
            imagePreference: data.imagePreference,
            preferenceData: data.preferenceData,
            thinkingMain: data.thinkingMain,
            thinkingScore: data.thinkingScore,
            thinkingDetails: data.thinkingDetails,
            pd_kind: data.pd_kind
          }
        }),
      });
      
      if (!response.ok) {
        // 서버 에러 응답 처리
        try {
          const errorData = await response.json();
          throw new Error(errorData?.error || errorData?.message || '보고서 생성 중 오류가 발생했습니다.');
        } catch {
          // JSON이 아닌 경우 상태 코드와 함께 에러 표시
          throw new Error(`보고서 생성 중 오류가 발생했습니다. (${response.status})`);
        }
      }
      
      // 바이너리 PDF 데이터를 Blob으로 변환
      const blob = await response.blob();
      
      // Blob URL 생성
      const url = window.URL.createObjectURL(blob);
      
      // 다운로드 링크 생성 및 클릭
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.personalInfo.pname}_검사결과.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // 메모리 해제
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // 성공 메시지 표시
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50';
      successMessage.innerHTML = `
        <div class="flex items-center">
          <svg class="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <p>${data.personalInfo.pname}님의 결과보고서가 성공적으로 다운로드되었습니다.</p>
        </div>
      `;
      document.body.appendChild(successMessage);
      
      // 3초 후 메시지 제거
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 3000);
      
    } catch (err) {
      console.error('보고서 다운로드 중 오류:', err);
      alert(err instanceof Error ? err.message : '보고서 생성 중 오류가 발생했습니다.');
    } finally {
      setPdfLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            onClick={handleGoBack} 
            className="text-indigo-700 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 hover:text-indigo-800 hover:border-indigo-300 transition-all shadow-sm rounded-xl px-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            검사결과 목록으로 돌아가기
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handlePrint} 
            className="text-blue-700 border-blue-200 bg-blue-50/50 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-300 transition-all shadow-sm rounded-xl px-4"
          >
            <FileText className="h-4 w-4 mr-2" />
            검사 결과 인쇄
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-700 p-3 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
            <PieChart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-blue-600">
              {loading ? (
                <Skeleton className="h-9 w-48" />
              ) : (
                data?.personalInfo.pname + "님의 검사결과"
              )}
            </h1>
            <p className="text-gray-500 mt-1">검사결과 상세 정보</p>
          </div>
        </div>
        
        {/* PDF 다운로드 버튼 추가 */}
        {!loading && data && (
          <div className="flex flex-col items-end">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-5 mb-3 shadow-md border border-blue-100 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-full shadow-md">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-indigo-900">프리미엄 결과보고서</p>
                  <p className="text-xs text-gray-500 mt-1">검사결과를 고품질 PDF로 저장하고 인쇄할 수 있습니다</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handlePdfDownload} 
              className="bg-gradient-to-r from-indigo-600 via-blue-700 to-purple-700 hover:from-indigo-700 hover:via-blue-800 hover:to-purple-800 text-white shadow-xl transition-all duration-300 transform hover:scale-103 px-6 py-2.5 rounded-xl h-auto border border-indigo-800/20"
              disabled={pdfLoading}
            >
              {pdfLoading ? (
                <div className="flex items-center">
                  <div className="mr-3 h-5 w-5 animate-spin rounded-full border-3 border-white border-t-transparent"></div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">보고서 생성 중...</span>
                    <span className="text-xs text-blue-100">잠시만 기다려주세요</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="bg-white/20 p-1.5 rounded-lg mr-3">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">결과보고서 보기</span>
                    <span className="text-xs text-blue-100">고품질 PDF 다운로드</span>
                  </div>
                </div>
              )}
            </Button>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-11 mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 p-1 rounded-xl shadow-sm">
          <TabsTrigger value="personal" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm">
            <User className="h-4 w-4" />
            <span>개인정보</span>
          </TabsTrigger>
          <TabsTrigger value="tendency" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm">
            <Brain className="h-4 w-4" />
            <span>성향진단</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm">
            <PieChart className="h-4 w-4" />
            <span>성향분석</span>
          </TabsTrigger>
          
          {/* basic이 아닌 경우에만 사고력 탭 표시 */}
          {data?.pd_kind !== 'basic' && (
            <TabsTrigger value="thinking" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm">
              <Lightbulb className="h-4 w-4" />
              <span>사고력</span>
            </TabsTrigger>
          )}
          
          <TabsTrigger value="suitable-job" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm">
            <Briefcase className="h-4 w-4" />
            <span>성향적합직업학과</span>
          </TabsTrigger>
          
          {/* basic이 아닌 경우에만 추가 탭 표시 */}
          {data?.pd_kind !== 'basic' && (
            <>
              <TabsTrigger value="competency" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm">
                <CheckSquare className="h-4 w-4" />
                <span>역량진단</span>
              </TabsTrigger>
              <TabsTrigger value="competency-job" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm">
                <GraduationCap className="h-4 w-4" />
                <span>역량적합직업학과</span>
              </TabsTrigger>
              <TabsTrigger value="learning" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm">
                <BookOpen className="h-4 w-4" />
                <span>학습</span>
              </TabsTrigger>
              <TabsTrigger value="subjects" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm">
                <School className="h-4 w-4" />
                <span>교과목</span>
              </TabsTrigger>
              <TabsTrigger value="job" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm">
                <Briefcase className="h-4 w-4" />
                <span>직무</span>
              </TabsTrigger>
            </>
          )}
          
          <TabsTrigger value="preference" className="flex items-center gap-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm">
            <Heart className="h-4 w-4" />
            <span>선호도</span>
          </TabsTrigger>
        </TabsList>
        
        {/* 개인정보 탭 */}
        <TabsContent value="personal">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-800">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 개인 기본 정보 카드 */}
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 py-3">
                  <CardTitle className="flex items-center text-lg gap-2 text-indigo-800">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    개인 기본 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 bg-white">
                  <dl className="space-y-4">
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
                      <dt className="w-28 text-gray-500 font-medium">추가연락처</dt>
                      <dd>{data?.personalInfo.contact || '-'}</dd>
                    </div>
                    
                    <div className="flex items-start">
                      <dt className="w-28 text-gray-500 font-medium">이메일</dt>
                      <dd>{data?.personalInfo.email || '-'}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              {/* 학력 및 직업 정보 카드 */}
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 py-3">
                  <CardTitle className="flex items-center text-lg gap-2 text-indigo-800">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <GraduationCap className="h-5 w-5 text-indigo-600" />
                    </div>
                    학력 및 직업 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 bg-white">
                  <dl className="space-y-4">
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
                    
                    <Separator className="my-2" />
                    
                    <div className="flex items-start">
                      <dt className="w-28 text-gray-500 font-medium">직업</dt>
                      <dd>{data?.personalInfo.job || '-'}</dd>
                    </div>
                    
                    <div className="flex items-start">
                      <dt className="w-28 text-gray-500 font-medium">직장명</dt>
                      <dd>{data?.personalInfo.pe_job_name || '-'}</dd>
                    </div>
                    
                    <div className="flex items-start">
                      <dt className="w-28 text-gray-500 font-medium">직무</dt>
                      <dd>{data?.personalInfo.pe_job_detail || '-'}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        {/* 성향진단 탭 */}
        <TabsContent value="tendency">
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-800">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{data?.personalInfo.pname}님</h2>
                <p className="text-lg font-medium">옥타그노시스 검사 결과에 따른 성향진단 결과</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 나의 성향 (상위 3개) */}
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-500 border-b border-teal-100 py-3">
                    <CardTitle className="text-lg text-white">나의 성향</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 bg-white">
                    {data?.topTendencies?.map((item, index) => {
                      const explain = data?.topTendencyExplains?.find(e => e.rank === item.rank);
                      const isExpanded = expandedTop.includes(item.rank);
                      
                      return (
                        <div key={`top-${index}`} className="mb-4 last:mb-0">
                          <div className="flex items-center mb-2 bg-teal-500 text-white p-3">
                            <span className="font-bold mr-2">상위 {item.rank}성향</span>
                          </div>
                          <div className="border-2 border-gray-200">
                            <div className="p-3 flex justify-between items-center cursor-pointer" onClick={() => toggleTopExpand(item.rank)}>
                              <span className="text-lg font-medium">{item.tendency_name}</span>
                              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                              </Button>
                            </div>
                            
                            {isExpanded && explain && (
                              <div className="p-4 bg-gray-50 border-t-2 border-gray-200">
                                <p className="text-gray-700 whitespace-pre-line">{explain.explanation}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
                
                {/* 나와 잘 안 맞는 성향 (하위 3개) */}
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-500 border-b border-orange-100 py-3">
                    <CardTitle className="text-lg text-white">나와 잘 안 맞는 성향</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 bg-white">
                    {data?.bottomTendencies?.map((item, index) => {
                      const explain = data?.bottomTendencyExplains?.find(e => e.rank === item.rank);
                      const isExpanded = expandedBottom.includes(item.rank);
                      
                      return (
                        <div key={`bottom-${index}`} className="mb-4 last:mb-0">
                          <div className="flex items-center mb-2 bg-orange-500 text-white p-3">
                            <span className="font-bold mr-2">하위 {index + 1}성향</span>
                          </div>
                          <div className="border-2 border-gray-200">
                            <div className="p-3 flex justify-between items-center cursor-pointer" onClick={() => toggleBottomExpand(item.rank)}>
                              <span className="text-lg font-medium">{item.tendency_name}</span>
                              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                              </Button>
                            </div>
                            
                            {isExpanded && explain && (
                              <div className="p-4 bg-gray-50 border-t-2 border-gray-200">
                                <p className="text-gray-700 whitespace-pre-line">{explain.explanation}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            {/* 나를 이루는 기운이 되는 성향 3개를 진단해드렸습니다. 하위성향은 나와는 잘 안 맞는 성향입니다. */}
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-600 border-b border-slate-100 py-3">
                  <CardTitle className="text-lg text-white">나를 이루는 기운이 되는 성향 3개를 진단해드렸습니다. 하위성향은 나와는 잘 안 맞는 성향입니다.</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 bg-white">
                  <p className="text-gray-700">
                    나를 이루는 기운이 되는 성향 3개를 진단해드렸습니다. 하위성향은 나와는 잘 안 맞는 성향입니다.
                  </p>
                </CardContent>
              </Card>
              {/* 성향 정보 카드 */}
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 via-blue-200 to-blue-100 border-b border-blue-100 py-3">
                  <CardTitle className="flex items-center text-lg gap-2 text-blue-800">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <Brain className="h-5 w-5 text-blue-600" />
                    </div>
                    성향 정보
                  </CardTitle>
                  <CardDescription>
                    {data?.personalInfo.pname}님의 주요 성향은 <Badge variant="outline" className="font-semibold text-blue-800">{data?.tendency.tnd1}</Badge>과(와) <Badge variant="outline" className="font-semibold text-blue-800">{data?.tendency.tnd2}</Badge>입니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 bg-white">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4 text-slate-800">주요 성향 설명</h3>
                      
                      {data?.topTendencies && data.topTendencies.length > 0 && data?.topTendencyExplains && data.topTendencyExplains.length > 0 && (
                        <div className="space-y-6">
                          {data.topTendencies[0] && (
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <h4 className="font-semibold text-md mb-2 text-slate-700">
                                <Badge className="mr-2 bg-blue-600">상위 1</Badge>
                                {data.topTendencies[0]?.tendency_name}
                              </h4>
                              <p className="text-gray-700">
                                {data.topTendencyExplains.find(e => e.rank === data.topTendencies[0]?.rank)?.explanation || ''}
                              </p>
                            </div>
                          )}
                          
                          {data.topTendencies[1] && (
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <h4 className="font-semibold text-md mb-2 text-slate-700">
                                <Badge className="mr-2 bg-blue-600">상위 2</Badge>
                                {data.topTendencies[1]?.tendency_name}
                              </h4>
                              <p className="text-gray-700">
                                {data.topTendencyExplains.find(e => e.rank === data.topTendencies[1]?.rank)?.explanation || ''}
                              </p>
                            </div>
                          )}
                          
                          {data.topTendencies[2] && (
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <h4 className="font-semibold text-md mb-2 text-slate-700">
                                <Badge className="mr-2 bg-blue-600">상위 3</Badge>
                                {data.topTendencies[2]?.tendency_name}
                              </h4>
                              <p className="text-gray-700">
                                {data.topTendencyExplains.find(e => e.rank === data.topTendencies[2]?.rank)?.explanation || ''}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {data?.bottomTendencies && data.bottomTendencies.length > 0 && data?.bottomTendencyExplains && data.bottomTendencyExplains.length > 0 && (
                        <div className="space-y-6 mt-6">
                          <h3 className="font-semibold text-lg mb-4 text-slate-800">나와 잘 안 맞는 성향 설명</h3>
                          
                          {data.bottomTendencies[0] && (
                            <div className="p-4 bg-orange-50 rounded-lg">
                              <h4 className="font-semibold text-md mb-2 text-slate-700">
                                <Badge className="mr-2 bg-orange-600">하위 1</Badge>
                                {data.bottomTendencies[0]?.tendency_name}
                              </h4>
                              <p className="text-gray-700">
                                {data.bottomTendencyExplains.find(e => e.rank === data.bottomTendencies[0]?.rank)?.explanation || ''}
                              </p>
                            </div>
                          )}
                          
                          {data.bottomTendencies[1] && (
                            <div className="p-4 bg-orange-50 rounded-lg">
                              <h4 className="font-semibold text-md mb-2 text-slate-700">
                                <Badge className="mr-2 bg-orange-600">하위 2</Badge>
                                {data.bottomTendencies[1]?.tendency_name}
                              </h4>
                              <p className="text-gray-700">
                                {data.bottomTendencyExplains.find(e => e.rank === data.bottomTendencies[1]?.rank)?.explanation || ''}
                              </p>
                            </div>
                          )}
                          
                          {data.bottomTendencies[2] && (
                            <div className="p-4 bg-orange-50 rounded-lg">
                              <h4 className="font-semibold text-md mb-2 text-slate-700">
                                <Badge className="mr-2 bg-orange-600">하위 3</Badge>
                                {data.bottomTendencies[2]?.tendency_name}
                              </h4>
                              <p className="text-gray-700">
                                {data.bottomTendencyExplains.find(e => e.rank === data.bottomTendencies[2]?.rank)?.explanation || ''}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        {/* 성향분석 탭 */}
        <TabsContent value="analysis">
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-800">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{data?.personalInfo.pname}님</h2>
                <p className="text-lg font-medium mb-4">옥타그노시스 검사 결과에 따른 세부성향분석입니다.</p>
              </div>
              
              <Card className="mb-6">
                <CardContent className="p-6 bg-blue-50">
                  <p className="text-gray-700 text-center">옥타그노시스 검사 결과에 따라 {data?.personalInfo.pname}님은 아래와 같은 결과로 분석되었습니다.</p>
                </CardContent>
              </Card>
              
              {/* 성향 질문 설명 */}
              {data?.tendencyQuestionExplains && data.tendencyQuestionExplains.length > 0 && (
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-blue-50 via-blue-200 to-blue-100 border-b border-blue-100 py-3">
                    <CardTitle className="flex items-center text-lg gap-2 text-blue-800">
                      <div className="bg-white p-2 rounded-full shadow-sm">
                        <Brain className="h-5 w-5 text-blue-600" />
                      </div>
                      {data?.personalInfo.pname}님의 성향 특성
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 bg-white">
                    <div className="space-y-6">
                      {data?.tendencyQuestionExplains.map((item, index) => (
                        <div key={`explain-${index}`} className="pb-4 border-b border-gray-200 last:border-0">
                          <p className="text-gray-700">{item.qu_explain}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
        
        {/* 사고력 탭 */}
        <TabsContent value="thinking">
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-800">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{data?.personalInfo.pname}님</h2>
                <p className="text-lg font-medium mb-4">옥타그노시스 검사 결과에 따른 사고력 진단</p>
              </div>
              
              {/* 주사고 및 부사고 정보 */}
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-amber-50 via-amber-200 to-amber-100 border-b border-amber-100 py-3">
                  <CardTitle className="text-lg text-amber-800">사고력 유형 결과</CardTitle>
                  <CardDescription>
                    {data?.personalInfo.pname}님의 주 사고력 유형은 <Badge variant="outline" className="font-semibold text-amber-800">{data?.thinkingMain?.thkm}</Badge>, 
                    부 사고력 유형은 <Badge variant="outline" className="font-semibold text-amber-800">{data?.thinkingMain?.thks}</Badge>입니다.
                    T점수는 <Badge variant="outline" className="font-semibold text-amber-800">{data?.thinkingMain?.tscore}점</Badge>입니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 bg-white">
                  <div className="p-4 bg-amber-50 rounded-lg text-center mb-4">
                    <p className="text-gray-700">
                      옥타그노시스 검사 결과, {data?.personalInfo.pname}님은 8가지 사고력을 진단한 결과입니다.
                    </p>
                  </div>
                  
                  {/* 사고력 차트 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* 바 차트 */}
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-center">사고력 수직 막대 그래프</h3>
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
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-center">사고력 분포 그래프</h3>
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
                </CardContent>
              </Card>
              
              {/* 사고력 영역별 설명 */}
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-amber-50 via-amber-200 to-amber-100 border-b border-amber-100 py-3">
                  <CardTitle className="text-lg text-amber-800">사고력 상세 분석</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 bg-white">
                  <div className="space-y-6">
                    {data?.thinkingDetails?.map((item, index) => {
                      const scoreColor = 
                        item.score >= 80 ? 'bg-green-100 text-green-800 border-green-300' : 
                        item.score >= 51 ? 'bg-blue-100 text-blue-800 border-blue-300' : 
                        'bg-gray-100 text-gray-800 border-gray-300';
                      
                      return (
                        <div key={`thinking-${index}`} className={`border rounded-lg overflow-hidden ${scoreColor}`}>
                          <div className="p-4 flex justify-between items-center">
                            <h4 className="font-semibold">{item.qua_name}</h4>
                            <Badge variant="outline" className={`text-base px-3 py-1 ${scoreColor}`}>
                              {item.score}점
                            </Badge>
                          </div>
                          <div className="p-4 bg-white">
                            <p className="text-gray-700 whitespace-pre-line">{item.explain}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              {/* kk님의 8가지 사고력을 진단한 결과입니다. */}
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-teal-700 to-teal-600 border-b border-teal-100 py-3">
                  <CardTitle className="text-lg text-white">{data?.personalInfo.pname || ''}님의 8가지 사고력을 진단한 결과입니다.</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 bg-white">
                  <p className="text-gray-700">
                    {data?.personalInfo.pname || ''}님의 8가지 사고력을 진단한 결과입니다.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="suitable-job">
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[400px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-800">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{data?.personalInfo.pname}님!</h2>
                <p className="text-lg font-medium mb-4">옥타그노시스 검사 결과에 따른 성향에 적합한 직업과 학과입니다.</p>
              </div>
              
              <Card className="mb-2">
                <CardContent className="p-6 bg-gradient-to-r from-indigo-100 to-blue-100">
                  <p className="text-gray-700 text-center">{data?.personalInfo.pname}님의 검사 결과에 따른 성향과 적성을 분석하여 가장 적합한 전공과 직업을 도출한 결과입니다.</p>
                </CardContent>
              </Card>
              
              {/* 성향적합직업군 요약 */}
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 border-b border-indigo-100 py-3">
                  <CardTitle className="text-lg text-white">{data?.suitableJobsSummary?.tendency} 적합직업군</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 bg-white">
                  {data?.suitableJobsDetail && data.suitableJobsDetail.map((job, index) => (
                    <div key={`job-${index}`} className="mb-8 last:mb-0 group">
                      <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-t-lg p-2 flex items-center">
                        <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 shadow-md">
                          <span className="font-bold">{index + 1}</span>
                        </div>
                        <h3 className="text-sm font-medium text-indigo-900">추천{index + 1} {job.jo_name}</h3>
                      </div>
                      
                      <div className="bg-white border-2 border-t-0 border-indigo-100 rounded-b-lg p-5 transition-all shadow-sm group-hover:shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-3">
                            <h4 className="font-bold text-indigo-800 flex items-center text-sm">
                              <div className="bg-indigo-100 p-1.5 rounded-full mr-2">
                                <Briefcase className="h-4 w-4 text-indigo-600" />
                              </div>
                              직업개요
                            </h4>
                            <p className="text-gray-700 pl-8 text-sm">{job.jo_outline}</p>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-bold text-indigo-800 flex items-center text-sm">
                              <div className="bg-indigo-100 p-1.5 rounded-full mr-2">
                                <CheckSquare className="h-4 w-4 text-indigo-600" />
                              </div>
                              주요업무
                            </h4>
                            <p className="text-gray-700 pl-8 whitespace-pre-line text-sm">{job.jo_mainbusiness || '정보가 제공되지 않았습니다.'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* 성향적합학과군 */}
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 border-b border-blue-100 py-3">
                  <CardTitle className="text-lg text-white">{data?.suitableJobsSummary?.tendency} 적합학과군</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 bg-white">
                  {data?.suitableJobMajors?.map((major, index) => (
                    <div key={`major-${index}`} className="mb-6 last:mb-0 group">
                      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-2 rounded-t-lg flex items-center">
                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 shadow-md">
                          <span className="font-bold">{index + 1}</span>
                        </div>
                        <h3 className="font-medium text-blue-900 text-sm">추천{index + 1} {major.major}</h3>
                      </div>
                      
                      <div className="bg-white border-2 border-t-0 border-blue-100 rounded-b-lg p-5 transition-all shadow-sm group-hover:shadow-md">
                        <div className="flex items-center bg-blue-50 p-2 rounded-lg">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="text-blue-800 font-medium text-sm">관련직업: {major.jo_name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="competency">
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-800">
              <p>{error}</p>
            </div>
          ) : !data?.talentDetails || data.talentDetails.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg flex flex-col gap-4">
              <p className="text-center text-gray-500">역량진단 데이터를 불러올 수 없습니다.</p>
              
              {/* 디버깅 정보 */}
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-300 text-sm">
                <p className="font-semibold text-yellow-800">디버깅 정보:</p>
                <p>데이터 상태: {data ? '데이터 있음' : '데이터 없음'}</p>
                <p>talentList: {data?.talentList ? '있음' : '없음'}</p>
                <p>talentDetails: {data?.talentDetails ? `있음 (${data.talentDetails.length}개)` : '없음'}</p>
                {data && (
                  <div className="mt-2">
                    <p className="font-semibold">데이터 구조:</p>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
              
              {/* API 직접 테스트 버튼 */}
              <div className="flex flex-col gap-2 mt-4">
                <Button 
                  onClick={async () => {
                    try {
                      console.log(`테스트 버튼: 역량진단 API 직접 호출 시작...`);
                      const response = await fetch(`/api/individuals-result/${id}/competency`);
                      console.log(`테스트 버튼: API 응답 상태 - ${response.status} ${response.statusText}`);
                      
                      const text = await response.text();
                      console.log(`테스트 버튼: API 응답 텍스트 - ${text}`);
                      
                      try {
                        const json = JSON.parse(text);
                        console.log(`테스트 버튼: API 응답 JSON - `, json);
                        
                        if (json.success && json.data) {
                          alert(`API 호출 성공! 데이터: ${json.data.talentDetails?.length || 0}개 항목 조회됨`);
                        } else {
                          alert(`API 호출 실패: ${json.message || '알 수 없는 오류'}`);
                        }
                      } catch (e: unknown) {
                        const error = e as Error;
                        console.error(`테스트 버튼: JSON 파싱 오류`, error);
                        alert(`API 응답을 JSON으로 파싱할 수 없습니다: ${error.message}`);
                      }
                    } catch (e: unknown) {
                      const error = e as Error;
                      console.error(`테스트 버튼: API 호출 중 오류`, error);
                      alert(`API 호출 중 오류 발생: ${error.message}`);
                    }
                  }}
                  variant="outline"
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800"
                >
                  역량진단 API 직접 테스트
                </Button>
                <p className="text-xs text-gray-500 text-center">이 버튼을 클릭하면 역량진단 API를 직접 호출합니다. 개발자 도구 콘솔에서 결과를 확인하세요.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{data?.personalInfo.pname}님</h2>
                <p className="text-lg font-medium mb-4">옥타그노시스 검사 결과에 따른 역량진단</p>
              </div>
              
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-600 border-b border-blue-100 py-3">
                  <CardTitle className="text-lg text-blue-800">상위 5개 역량</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 bg-white">
                  <div className="p-4 bg-blue-50 rounded-lg mb-4">
                    <p className="text-gray-700 text-center font-medium">
                      {data.talentList}
                    </p>
                  </div>
                  
                  {data.talentDetails?.map((talent, index) => (
                    <div key={index} className="mb-4 border rounded-lg overflow-hidden">
                      <div className="bg-blue-100 p-3 flex justify-between items-center">
                        <h3 className="font-semibold">{talent.qua_name}</h3>
                        <Badge variant="outline" className="bg-blue-50">{talent.tscore}점</Badge>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-700 text-sm whitespace-pre-line">{talent.explain}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="competency-job">
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-center text-gray-500">역량적합직업학과 탭은 추후 개발 예정입니다.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="learning">
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-center text-gray-500">학습 탭은 추후 개발 예정입니다.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="subjects">
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-center text-gray-500">교과목 탭은 추후 개발 예정입니다.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="job">
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-center text-gray-500">직무 탭은 추후 개발 예정입니다.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="preference">
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[400px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-800">
              <p>{error}</p>
            </div>
          ) : !data?.preferenceData ? (
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-center text-gray-500">현재 선호도 데이터가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{data?.personalInfo.pname}님</h2>
                <p className="text-lg font-medium mb-4">옥타그노시스 검사 결과에 따른 선호도 분석</p>
              </div>
              
              <Card className="mb-2">
                <CardContent className="p-6 bg-purple-50">
                  <p className="text-gray-700 text-center">이미지를 통해 선호하는 직업과 학과를 분석한 결과입니다.</p>
                </CardContent>
              </Card>
              
              {/* 선호반응 차트 추가 */}
              {data?.imagePreference && (
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-rose-50 to-rose-600 border-b border-rose-100 py-3">
                    <CardTitle className="text-lg text-rose-800">선호반응 비율</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 bg-white">
                    <div className="h-[100px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={[{ name: '선호반응율', value: Math.round(data.imagePreference.irate) }]}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" width={100} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" name="선호반응율(%)" fill="#e11d48" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* 차트 레전드 및 데이터 표시 */}
                    <div className="mt-3 text-center">
                      <div className="inline-flex items-center justify-center bg-gray-50 px-4 py-2 rounded-lg">
                        <div className="text-sm">
                          <p className="text-gray-500">전체 이미지 중 <span className="font-bold text-rose-600">{data.imagePreference.cnt}개</span>의 이미지에 선호 반응을 보였습니다.</p>
                          <p className="text-gray-500 mt-1">
                            (전체: {data.imagePreference.tcnt}개, 선호비율: {Math.round(data.imagePreference.irate)}%)
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* 선호도 차트 추가 */}
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-600 border-b border-purple-100 py-3">
                  <CardTitle className="text-lg text-purple-800">이미지 선호도 분석 차트</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 bg-white">
                  <div className="grid grid-cols-1 gap-6">
                    {/* 수평 바 차트 */}
                    <div className="h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={getPreferenceBarData()}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 40,
                            bottom: 10,
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
                    
                    {/* 응답 문항수 비교 */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-medium mb-4 text-center">응답 문항 비교</h3>
                      <div className="flex justify-center items-end h-[150px] gap-10">
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-16 bg-purple-600 rounded-t-md" 
                            style={{ height: `${(data.preferenceData.qcnt1/10) * 100}px` }}>
                          </div>
                          <div className="mt-2 text-sm font-medium">{data.preferenceData.qcnt1}개</div>
                          <div className="mt-1 text-xs text-gray-500">{data.preferenceData.tdname1}</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-16 bg-purple-500 rounded-t-md" 
                            style={{ height: `${(data.preferenceData.qcnt2/10) * 100}px` }}>
                          </div>
                          <div className="mt-2 text-sm font-medium">{data.preferenceData.qcnt2}개</div>
                          <div className="mt-1 text-xs text-gray-500">{data.preferenceData.tdname2}</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-16 bg-purple-400 rounded-t-md" 
                            style={{ height: `${(data.preferenceData.qcnt3/10) * 100}px` }}>
                          </div>
                          <div className="mt-2 text-sm font-medium">{data.preferenceData.qcnt3}개</div>
                          <div className="mt-1 text-xs text-gray-500">{data.preferenceData.tdname3}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* 선호 이미지 상위 3개 */}
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50 via-purple-200 to-purple-100 border-b border-purple-100 py-3">
                  <CardTitle className="text-lg text-purple-800">선호 이미지 상위 3개</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 첫 번째 선호 이미지 */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-purple-100 p-2">
                        <h3 className="font-semibold text-sm text-purple-800">1순위: {data.preferenceData.tdname1}</h3>
                      </div>
                      <div className="p-4">
                        <div className="mb-2">
                          <span className="text-sm text-gray-500">응답수:</span>
                          <span className="ml-2 font-medium">{data.preferenceData.qcnt1}개</span>
                        </div>
                        <div className="mb-4">
                          <span className="text-sm text-gray-500">선호도:</span>
                          <span className="ml-2 font-medium">{data.preferenceData.rrate1}%</span>
                        </div>
                        <p className="text-gray-700 text-sm">{data.preferenceData.exp1}</p>
                      </div>
                    </div>
                    
                    {/* 두 번째 선호 이미지 */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-purple-100 p-2">
                        <h3 className="font-semibold text-sm text-purple-800">2순위: {data.preferenceData.tdname2}</h3>
                      </div>
                      <div className="p-4">
                        <div className="mb-2">
                          <span className="text-sm text-gray-500">응답수:</span>
                          <span className="ml-2 font-medium">{data.preferenceData.qcnt2}개</span>
                        </div>
                        <div className="mb-4">
                          <span className="text-sm text-gray-500">선호도:</span>
                          <span className="ml-2 font-medium">{data.preferenceData.rrate2}%</span>
                        </div>
                        <p className="text-gray-700 text-sm">{data.preferenceData.exp2}</p>
                      </div>
                    </div>
                    
                    {/* 세 번째 선호 이미지 */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-purple-100 p-2">
                        <h3 className="font-semibold text-sm text-purple-800">3순위: {data.preferenceData.tdname3}</h3>
                      </div>
                      <div className="p-4">
                        <div className="mb-2">
                          <span className="text-sm text-gray-500">응답수:</span>
                          <span className="ml-2 font-medium">{data.preferenceData.qcnt3}개</span>
                        </div>
                        <div className="mb-4">
                          <span className="text-sm text-gray-500">선호도:</span>
                          <span className="ml-2 font-medium">{data.preferenceData.rrate3}%</span>
                        </div>
                        <p className="text-gray-700 text-sm">{data.preferenceData.exp3}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* 1순위 이미지 선호도에 따른 직업/학과 */}
              {data?.preferenceJobs1 && data.preferenceJobs1.length > 0 && (
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-purple-50 via-purple-200 to-purple-100 border-b border-purple-100 py-3">
                    <CardTitle className="text-lg text-purple-800">선호 이미지 선호도에 따른 추천직업/학과</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 bg-white">
                    {data.preferenceJobs1.map((job, index) => (
                      <div key={`job1-${index}`} className="mb-6 last:mb-0">
                        <div className="bg-purple-100 p-2 mb-3 rounded-t-lg">
                          <h3 className="font-medium text-sm text-purple-800">추천{index + 1} {job.jo_name}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-purple-100 rounded-b-lg">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm">직업개요</h4>
                            <p className="text-gray-600 text-sm">{job.jo_outline}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm">주요업무</h4>
                            <p className="text-gray-600 text-sm whitespace-pre-line">{job.jo_mainbusiness || '정보가 제공되지 않았습니다.'}</p>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold text-gray-700 mb-2 text-sm">관련학과</h4>
                          <p className="text-gray-600 text-sm">{job.majors}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
              
              {/* 2순위 이미지 선호도에 따른 직업/학과 */}
              {data?.preferenceJobs2 && data.preferenceJobs2.length > 0 && (
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-purple-50 via-purple-200 to-purple-100 border-b border-purple-100 py-3">
                    <CardTitle className="text-lg text-purple-800">선호 이미지 선호도에 따른 추천직업/학과</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 bg-white">
                    {data.preferenceJobs2.map((job, index) => (
                      <div key={`job2-${index}`} className="mb-6 last:mb-0">
                        <div className="bg-purple-100 p-2 mb-3 rounded-t-lg">
                          <h3 className="font-medium text-sm text-purple-800">추천{index + 1} {job.jo_name}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-purple-100 rounded-b-lg">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm">직업개요</h4>
                            <p className="text-gray-600 text-sm">{job.jo_outline}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm">주요업무</h4>
                            <p className="text-gray-600 text-sm whitespace-pre-line">{job.jo_mainbusiness || '정보가 제공되지 않았습니다.'}</p>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold text-gray-700 mb-2 text-sm">관련학과</h4>
                          <p className="text-gray-600 text-sm">{job.majors}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
              
              {/* 3순위 이미지 선호도에 따른 직업/학과 */}
              {data?.preferenceJobs3 && data.preferenceJobs3.length > 0 && (
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-purple-50 via-purple-200 to-purple-100 border-b border-purple-100 py-3">
                    <CardTitle className="text-lg text-purple-800">선호 이미지 선호도에 따른 추천직업/학과</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 bg-white">
                    {data.preferenceJobs3.map((job, index) => (
                      <div key={`job3-${index}`} className="mb-6 last:mb-0">
                        <div className="bg-purple-100 p-2 mb-3 rounded-t-lg">
                          <h3 className="font-medium text-sm text-purple-800">추천{index + 1} {job.jo_name}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-purple-100 rounded-b-lg">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm">직업개요</h4>
                            <p className="text-gray-600 text-sm">{job.jo_outline}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm">주요업무</h4>
                            <p className="text-gray-600 text-sm whitespace-pre-line">{job.jo_mainbusiness || '정보가 제공되지 않았습니다.'}</p>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold text-gray-700 mb-2 text-sm">관련학과</h4>
                          <p className="text-gray-600 text-sm">{job.majors}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}