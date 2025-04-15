"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";

interface Turn {
  tur_seq: number;
  tur_name: string;
  tur_code: string;
  tur_use: string;
  tur_count: number;
  created_at: string;
}

interface InstituteDetail {
  ins_seq: number;
  ins_name: string;
  ins_license_num: string;
  ins_ceo: string;
  ins_manager1_name: string;
  ins_manager1_team: string;
  ins_manager1_cellphone: string;
}

export default function InstituteDetailPage({ params }: { params: { ins_seq: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [institute, setInstitute] = useState<InstituteDetail | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);

  useEffect(() => {
    if (params.ins_seq) {
      loadInstituteDetails();
      loadInstituteTurns();
    }
  }, [params.ins_seq]);

  const loadInstituteDetails = async () => {
    try {
      // 실제 API 연동 시 아래 주석을 해제하고 API 호출 코드로 대체
      // const response = await fetch(`/api/institute-result/institutes/${params.ins_seq}`);
      // const data = await response.json();
      
      // 테스트용 데이터
      setTimeout(() => {
        setInstitute({
          ins_seq: parseInt(params.ins_seq),
          ins_name: "테스트 기관",
          ins_license_num: "123-45-67890",
          ins_ceo: "홍길동",
          ins_manager1_name: "김담당",
          ins_manager1_team: "인사팀",
          ins_manager1_cellphone: "010-1234-5678"
        });
      }, 500);
    } catch (error) {
      console.error("기관 상세 정보 조회 오류:", error);
    }
  };

  const loadInstituteTurns = async () => {
    try {
      // 실제 API 연동 시 아래 주석을 해제하고 API 호출 코드로 대체
      // const response = await fetch(`/api/institute-result/turns?ins_seq=${params.ins_seq}`);
      // const data = await response.json();
      
      // 테스트용 데이터
      setTimeout(() => {
        setTurns([
          {
            tur_seq: 4010,
            tur_name: "2023년 1분기 검사",
            tur_code: "Q1-2023",
            tur_use: "Y",
            tur_count: 42,
            created_at: "2023-03-15"
          },
          {
            tur_seq: 3870,
            tur_name: "2022년 4분기 검사",
            tur_code: "Q4-2022",
            tur_use: "Y",
            tur_count: 38,
            created_at: "2022-12-10"
          },
          {
            tur_seq: 3650,
            tur_name: "2022년 3분기 검사",
            tur_code: "Q3-2022",
            tur_use: "N",
            tur_count: 35,
            created_at: "2022-09-05"
          }
        ]);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("기관 회차 목록 조회 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleTurnClick = (turSeq: number) => {
    router.push(`/institute-result/${params.ins_seq}/turn/${turSeq}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 min-h-[60vh] flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">기관 검사 결과</h1>
      </div>

      {/* 기관 정보 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>기관 정보</CardTitle>
        </CardHeader>
        <CardContent>
          {institute ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">기관명</p>
                <p className="font-medium">{institute.ins_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">사업자 번호</p>
                <p className="font-medium">{institute.ins_license_num}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">대표자</p>
                <p className="font-medium">{institute.ins_ceo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">담당자</p>
                <p className="font-medium">{institute.ins_manager1_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">담당팀</p>
                <p className="font-medium">{institute.ins_manager1_team}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">담당자 연락처</p>
                <p className="font-medium">{institute.ins_manager1_cellphone}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              기관 정보를 불러올 수 없습니다.
            </div>
          )}
        </CardContent>
      </Card>

      {/* 회차 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>검사 회차 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>회차 번호</TableHead>
                <TableHead>회차명</TableHead>
                <TableHead>회차 코드</TableHead>
                <TableHead className="hidden md:table-cell">참여자 수</TableHead>
                <TableHead className="hidden md:table-cell">생성일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {turns.length > 0 ? (
                turns.map((turn) => (
                  <TableRow 
                    key={turn.tur_seq}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleTurnClick(turn.tur_seq)}
                  >
                    <TableCell>{turn.tur_seq}</TableCell>
                    <TableCell className="font-medium">{turn.tur_name}</TableCell>
                    <TableCell>{turn.tur_code}</TableCell>
                    <TableCell className="hidden md:table-cell">{turn.tur_count}명</TableCell>
                    <TableCell className="hidden md:table-cell">{turn.created_at}</TableCell>
                    <TableCell>
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          turn.tur_use === 'Y'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {turn.tur_use === 'Y' ? '활성' : '비활성'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className="hidden sm:inline">상세보기</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    검사 회차 정보가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 통계 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>검사 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">총 회차 수</p>
              <p className="text-2xl font-bold">{turns.length}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">활성 회차</p>
              <p className="text-2xl font-bold">{turns.filter(t => t.tur_use === 'Y').length}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">총 참여자</p>
              <p className="text-2xl font-bold">{turns.reduce((acc, turn) => acc + turn.tur_count, 0)}</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">최근 검사</p>
              <p className="text-2xl font-bold">{turns.length > 0 ? turns[0].created_at : '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}