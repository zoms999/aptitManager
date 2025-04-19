import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ResultData } from '@/types/result-types';
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
import { getThinkingScoreArray, getRadarChartData } from '@/utils/result-utils';

interface ThinkingTabProps {
  loading: boolean;
  error: string | null;
  data: ResultData | null;
}

export function ThinkingTab({ loading, error, data }: ThinkingTabProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-800">
        <p>{error}</p>
      </div>
    );
  }

  return (
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
                    data={getThinkingScoreArray(data?.thinkingScore)}
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
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getRadarChartData(data?.thinkingScore)}>
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
      
      {/* 설명 카드 */}
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
  );
} 