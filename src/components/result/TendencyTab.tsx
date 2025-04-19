import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { ResultData } from '@/types/result-types';

interface TendencyTabProps {
  loading: boolean;
  error: string | null;
  data: ResultData | null;
}

export function TendencyTab({ loading, error, data }: TendencyTabProps) {
  const [expandedTop, setExpandedTop] = useState<number[]>([]);
  const [expandedBottom, setExpandedBottom] = useState<number[]>([]);

  const toggleTopExpand = (rank: number) => {
    if (expandedTop.includes(rank)) {
      setExpandedTop(expandedTop.filter((r) => r !== rank));
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[300px] w-full" />
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
      
      {/* 설명 카드 */}
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-600 border-b border-slate-100 py-3">
          <CardTitle className="text-lg text-white">성향 정보</CardTitle>
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
        </CardHeader>
        <CardContent className="pt-4 bg-white">
          <div className="mb-4">
            {data?.personalInfo.pname}님의 주요 성향은 <Badge variant="outline" className="font-semibold text-blue-800">{data?.tendency.tnd1}</Badge>과(와) <Badge variant="outline" className="font-semibold text-blue-800">{data?.tendency.tnd2}</Badge>입니다.
          </div>
          
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
  );
} 