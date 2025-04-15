"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, FileText, Building, ExternalLink, Users, Calendar } from "lucide-react";

interface Institute {
  ins_seq: number;
  ins_name: string;
  ins_license_num: string;
  ins_ceo: string;
  ins_manager1_name: string;
  ins_manager1_team: string;
  ins_manager1_cellphone: string;
  tur_seq: number;
}

export default function InstituteResultPage() {
  const router = useRouter();
  
  // 상태 관리
  const [loading, setLoading] = useState(false);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [totalInstitutes, setTotalInstitutes] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // 초기 데이터 로드
  useEffect(() => {
    loadInstitutes();
  }, [page]);

  // 기관 목록 조회
  const loadInstitutes = async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const response = await fetch(`/api/institute-result/institutes?search=${search}&limit=${limit}&offset=${offset}`);
      const data = await response.json();
      
      if (data.success) {
        setInstitutes(data.institutes);
        setTotalInstitutes(data.total);
      } else {
        console.error("기관 목록 조회 실패:", data.message);
      }
    } catch (error) {
      console.error("기관 목록 조회 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 기관 검색 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // 검색 시 첫 페이지로 이동
    loadInstitutes();
  };

  // 페이지 변경 처리
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 기관 상세 페이지로 이동
  const handleInstituteClick = (insSeq: number) => {
    router.push(`/institute-result/${insSeq}`);
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalInstitutes / limit);

  return (
    <div className="container mx-auto py-12 px-6 max-w-full">
      {/* 헤더 영역 */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-800 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-100" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">기관 검사결과 조회</h1>
              <p className="text-gray-500 mt-1">기관별 검사 결과 조회 및 관리</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 검색 및 필터 영역 */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="기관명 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-800 focus:ring-blue-800 h-11"
            />
          </div>
          <Button 
            type="submit" 
            className="rounded-lg bg-blue-800 hover:bg-blue-900 shadow-sm transition-all px-5 py-2.5 h-11 text-blue-50"
          >
            검색
          </Button>
        </form>
        <div className="flex items-center justify-between mt-5 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="h-4 w-4 text-blue-800" />
            <span>전체: <b>{totalInstitutes}</b>개 기관</span>
          </div>
        </div>
      </div>

      {/* 기관 목록 테이블 */}
      <div className="overflow-hidden rounded-xl shadow-md border border-gray-100 bg-white">
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse">
            <TableHeader className="bg-gradient-to-r from-blue-900 to-blue-800">
              <TableRow className="border-b border-blue-700">
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[5%]">번호</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 w-[15%]">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    기관명
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[10%]">사업자번호</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[10%]">대표자</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[10%]">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4" />
                    담당자
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[10%]">담당팀</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[15%]">담당연락처</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[10%]">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    최신 회차
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[15%]">상세보기</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
                      <div className="mt-4 text-base text-gray-600">기관 정보를 불러오는 중입니다...</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : institutes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-100 p-4 rounded-full">
                        <Building className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="mt-4 text-lg font-medium text-gray-500">검색 결과가 없습니다</div>
                      <div className="mt-2 text-sm text-gray-400">다른 검색어를 입력하거나 필터를 조정해 보세요</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                institutes.map((institute, index) => (
                  <TableRow 
                    key={institute.ins_seq}
                    className={`group cursor-pointer transition-colors hover:bg-blue-50 border-b ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                    onClick={() => handleInstituteClick(institute.ins_seq)}
                  >
                    <TableCell className="py-4 px-4 text-base text-center font-medium text-gray-800">{institute.ins_seq}</TableCell>
                    <TableCell className="py-4 px-4 text-base font-semibold">
                      <div className="flex items-center">
                        <div className="group-hover:text-blue-800 text-blue-700 transition-colors">{institute.ins_name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">{institute.ins_license_num || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">{institute.ins_ceo || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center font-medium text-gray-800">{institute.ins_manager1_name || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">{institute.ins_manager1_team || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">{institute.ins_manager1_cellphone || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center">
                      <Badge className="bg-blue-800 text-white hover:bg-blue-900 px-3 py-1 font-medium">
                        {institute.tur_seq}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      <Button 
                        variant="outline" 
                        className="border-blue-200 text-blue-800 hover:bg-blue-50 transition-colors font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInstituteClick(institute.ins_seq);
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        상세보기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 페이지네이션 영역 */}
      {!loading && totalInstitutes > 0 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <Button 
            variant="outline" 
            size="icon"
            className="h-10 w-10 rounded-lg cursor-pointer border-gray-200 hover:bg-blue-100 hover:text-blue-800 transition-colors"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // 페이지 숫자 계산 로직 (현재 페이지 중심)
            let pageNum = page;
            if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }
            
            // 범위를 벗어나면 렌더링하지 않음
            if (pageNum < 1 || pageNum > totalPages) return null;
            
            return (
              <Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                className={`h-10 w-10 rounded-lg cursor-pointer font-medium ${
                  page === pageNum 
                    ? 'bg-blue-800 hover:bg-blue-900 text-white' 
                    : 'border-gray-200 hover:bg-blue-100 hover:text-blue-800'
                }`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          
          <Button 
            variant="outline" 
            size="icon"
            className="h-10 w-10 rounded-lg cursor-pointer border-gray-200 hover:bg-blue-100 hover:text-blue-800 transition-colors"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}