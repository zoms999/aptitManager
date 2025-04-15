"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Loader2, Search } from "lucide-react";

interface Member {
  pe_seq: number;
  pe_name: string;
  pe_sex: string;
  pe_age: number;
  im_depart: string;
  im_position: string;
  start_date: string;
  end_date: string;
  anp_status: string;
}

interface TurnDetail {
  tur_seq: number;
  tur_name: string;
  tur_code: string;
  tur_use: string;
  created_at: string;
  ins_name: string;
}

export default function TurnDetailPage({ 
  params 
}: { 
  params: { ins_seq: string; tur_seq: string } 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [turnDetail, setTurnDetail] = useState<TurnDetail | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (params.ins_seq && params.tur_seq) {
      loadTurnDetails();
      loadMembers();
    }
  }, [params.ins_seq, params.tur_seq]);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(
        member => member.pe_name.toLowerCase().includes(search.toLowerCase()) ||
        member.im_depart.toLowerCase().includes(search.toLowerCase()) ||
        member.im_position.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [search, members]);

  const loadTurnDetails = async () => {
    try {
      // 실제 API 연동 시 아래 주석을 해제하고 API 호출 코드로 대체
      // const response = await fetch(`/api/institute-result/turns/${params.tur_seq}`);
      // const data = await response.json();
      
      // 테스트용 데이터
      setTimeout(() => {
        setTurnDetail({
          tur_seq: parseInt(params.tur_seq),
          tur_name: "2023년 1분기 검사",
          tur_code: "Q1-2023",
          tur_use: "Y",
          created_at: "2023-03-15",
          ins_name: "테스트 기관"
        });
      }, 500);
    } catch (error) {
      console.error("회차 상세 정보 조회 오류:", error);
    }
  };

  const loadMembers = async () => {
    try {
      // 실제 API 연동 시 아래 주석을 해제하고 API 호출 코드로 대체
      // const response = await fetch(`/api/institute-result/members?ins_seq=${params.ins_seq}&tur_seq=${params.tur_seq}`);
      // const data = await response.json();
      
      // 테스트용 데이터
      setTimeout(() => {
        const testMembers = Array.from({ length: 15 }, (_, i) => ({
          pe_seq: 1000 + i,
          pe_name: `테스트 ${i + 1}`,
          pe_sex: i % 2 === 0 ? "M" : "F",
          pe_age: 25 + i,
          im_depart: `${i % 3 === 0 ? "인사팀" : i % 3 === 1 ? "개발팀" : "마케팅팀"}`,
          im_position: `${i % 4 === 0 ? "사원" : i % 4 === 1 ? "대리" : i % 4 === 2 ? "과장" : "팀장"}`,
          start_date: `2023-03-${15 + i < 31 ? 15 + i : 30} 09:00:00`,
          end_date: i < 12 ? `2023-03-${15 + i < 31 ? 15 + i : 30} 10:30:00` : null,
          anp_status: i < 12 ? "done" : "in_progress"
        }));
        setMembers(testMembers);
        setFilteredMembers(testMembers);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("응답자 목록 조회 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleMemberClick = (peSeq: number) => {
    router.push(`/institute-result/${params.ins_seq}/turn/${params.tur_seq}/member/${peSeq}`);
  };

  const getCompletionRate = () => {
    if (!members.length) return 0;
    const completed = members.filter(m => m.anp_status === "done").length;
    return Math.round((completed / members.length) * 100);
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
        <h1 className="text-2xl font-bold">회차 상세 결과</h1>
      </div>

      {/* 회차 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>회차 정보</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              turnDetail?.tur_use === 'Y'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {turnDetail?.tur_use === 'Y' ? '활성' : '비활성'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {turnDetail ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">기관명</p>
                <p className="font-medium">{turnDetail.ins_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">회차명</p>
                <p className="font-medium">{turnDetail.tur_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">회차 코드</p>
                <p className="font-medium">{turnDetail.tur_code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">생성일</p>
                <p className="font-medium">{turnDetail.created_at}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">응답자 수</p>
                <p className="font-medium">{members.length}명</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">완료율</p>
                <p className="font-medium">{getCompletionRate()}%</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              회차 정보를 불러올 수 없습니다.
            </div>
          )}
        </CardContent>
      </Card>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-none">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">총 응답자</p>
              <p className="text-3xl font-bold">{members.length}명</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/20 border-none">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">완료</p>
              <p className="text-3xl font-bold">{members.filter(m => m.anp_status === "done").length}명</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-none">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">진행중</p>
              <p className="text-3xl font-bold">{members.filter(m => m.anp_status === "in_progress").length}명</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-none">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">완료율</p>
              <p className="text-3xl font-bold">{getCompletionRate()}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 응답자 목록 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>응답자 목록</CardTitle>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="이름, 부서, 직위 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead className="hidden md:table-cell">성별</TableHead>
                  <TableHead className="hidden md:table-cell">나이</TableHead>
                  <TableHead>부서</TableHead>
                  <TableHead>직위</TableHead>
                  <TableHead className="hidden lg:table-cell">응답 시작</TableHead>
                  <TableHead className="hidden lg:table-cell">응답 종료</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">상세보기</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <TableRow 
                      key={member.pe_seq}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleMemberClick(member.pe_seq)}
                    >
                      <TableCell className="font-medium">{member.pe_name}</TableCell>
                      <TableCell className="hidden md:table-cell">{member.pe_sex === "M" ? "남" : "여"}</TableCell>
                      <TableCell className="hidden md:table-cell">{member.pe_age}</TableCell>
                      <TableCell>{member.im_depart}</TableCell>
                      <TableCell>{member.im_position}</TableCell>
                      <TableCell className="hidden lg:table-cell">{member.start_date}</TableCell>
                      <TableCell className="hidden lg:table-cell">{member.end_date || "-"}</TableCell>
                      <TableCell>
                        <span 
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            member.anp_status === 'done'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                          }`}
                        >
                          {member.anp_status === 'done' ? '완료' : '진행중'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMemberClick(member.pe_seq);
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      응답자 정보가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}