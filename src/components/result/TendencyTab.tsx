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
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-red-800">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{data?.personalInfo.pname}님</h2>
        <p className="text-base text-gray-600">옥타그노시스 검사 결과에 따른 성향진단 결과입니다.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 나의 성향 (상위 3개) */}
        <Card className="border border-gray-200 rounded-lg shadow-sm">
          <CardHeader className="bg-teal-50 border-b border-teal-100 py-3">
            <CardTitle className="text-base font-medium text-teal-800">나의 성향</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 px-4 pb-4">
            {data?.topTendencies?.map((item, index) => {
              const explain = data?.topTendencyExplains?.find(e => e.rank === item.rank);
              const isExpanded = expandedTop.includes(item.rank);
              
              return (
                <div key={`top-${index}`} className="mb-3 last:mb-0">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">상위 {item.rank}성향: {item.tendency_name}</span>
                        <Button variant="ghost" size="sm" className="p-0 h-8 w-8 text-gray-500"
                          onClick={() => toggleTopExpand(item.rank)}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    {isExpanded && explain && (
                      <div className="p-4">
                        <p className="text-gray-700 text-sm leading-relaxed">{explain.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        
        {/* 나와 잘 안 맞는 성향 (하위 3개) */}
        <Card className="border border-gray-200 rounded-lg shadow-sm">
          <CardHeader className="bg-orange-50 border-b border-orange-100 py-3">
            <CardTitle className="text-base font-medium text-orange-800">나와 잘 안 맞는 성향</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 px-4 pb-4">
            {data?.bottomTendencies?.map((item, index) => {
              const explain = data?.bottomTendencyExplains?.find(e => e.rank === item.rank);
              const isExpanded = expandedBottom.includes(item.rank);
              
              return (
                <div key={`bottom-${index}`} className="mb-3 last:mb-0">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">하위 {index + 1}성향: {item.tendency_name}</span>
                        <Button variant="ghost" size="sm" className="p-0 h-8 w-8 text-gray-500"
                          onClick={() => toggleBottomExpand(item.rank)}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    {isExpanded && explain && (
                      <div className="p-4">
                        <p className="text-gray-700 text-sm leading-relaxed">{explain.explanation}</p>
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
      <Card className="border border-gray-200 rounded-lg shadow-sm">
        <CardContent className="p-4">
          <p className="text-gray-600 text-sm">
            나를 이루는 기운이 되는 성향 3개를 진단해드렸습니다. 하위성향은 나와는 잘 안 맞는 성향입니다.
          </p>
        </CardContent>
      </Card>

      {/* 성향 정보 카드 */}
      <Card className="border border-gray-200 rounded-lg shadow-sm">
        <CardHeader className="border-b border-gray-200 py-3 flex items-center bg-blue-50">
          <Brain className="h-4 w-4 text-blue-400 mr-2" />
          <CardTitle className="text-base font-medium text-blue-600">성향 정보</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="mb-4 text-sm text-gray-700">
            {data?.personalInfo.pname}님의 주요 성향은 
            <Badge variant="outline" className="mx-1 font-medium text-gray-700 bg-gray-50">{data?.tendency.tnd1}</Badge>과(와) 
            <Badge variant="outline" className="mx-1 font-medium text-gray-700 bg-gray-50">{data?.tendency.tnd2}</Badge>입니다.
          </p>
          
          {data?.topTendencies && data.topTendencies.length > 0 && data?.topTendencyExplains && data.topTendencyExplains.length > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-medium text-gray-800 pb-2 border-b border-gray-200">주요 성향 설명</h3>
              
              {data.topTendencies.map((item, index) => {
                const explain = data.topTendencyExplains.find(e => e.rank === item.rank);
                
                return (
                  <div key={`top-explain-${index}`} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      <Badge variant="secondary" className="mr-2">상위 {index + 1}</Badge>
                      {item.tendency_name}
                    </h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {explain?.explanation || ''}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          
          {data?.bottomTendencies && data.bottomTendencies.length > 0 && data?.bottomTendencyExplains && data.bottomTendencyExplains.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-800 pb-2 border-b border-gray-200">나와 잘 안 맞는 성향 설명</h3>
              
              {data.bottomTendencies.map((item, index) => {
                const explain = data.bottomTendencyExplains.find(e => e.rank === item.rank);
                
                return (
                  <div key={`bottom-explain-${index}`} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      <Badge variant="outline" className="mr-2">하위 {index + 1}</Badge>
                      {item.tendency_name}
                    </h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {explain?.explanation || ''}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 