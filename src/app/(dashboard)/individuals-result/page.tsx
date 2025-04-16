'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Calendar, 
  User,
  Phone,
  ClipboardList,
  Eye
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface IndividualResult {
  ac_id: string;
  ac_gid: string;
  pe_seq: number;
  pe_name: string;
  pe_cellphone: string;
  pe_sex: string;
  anp_seq: number;
  anp_status: string;
  start_date: string;
  end_date: string;
  cr_seq: number;
  pd_kind: string;
  pd_num: number;
}

export default function IndividualsResultPage() {
  const router = useRouter();
  
  // 상태 관리
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IndividualResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const limit = 10;

  // 초기 데이터 로드
  useEffect(() => {
    loadResults();
  }, [page]);

  // 검사결과 목록 조회
  const loadResults = async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      let url = `/api/individuals-result?limit=${limit}&offset=${offset}`;
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      if (startDate) {
        url += `&start_date=${encodeURIComponent(startDate)}`;
      }
      
      if (endDate) {
        url += `&end_date=${encodeURIComponent(endDate)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.results);
        setTotalResults(data.total);
      } else {
        console.error("검사결과 목록 조회 실패:", data.message);
      }
    } catch (error) {
      console.error("검사결과 목록 조회 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 검색 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // 검색 시 첫 페이지로 이동
    loadResults();
  };

  // 페이지 변경 처리
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 결과 상세 페이지로 이동
  const handleResultClick = (anpSeq: number) => {
    router.push(`/individuals-result/${anpSeq}`);
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalResults / limit);

  // 성별 표시
  const getSexDisplay = (sex: string) => {
    return sex === 'M' ? '남' : '여';
  };

  // 상태 표시
  const getStatusDisplay = (status: string) => {
    return status === 'done' ? '완료' : '진행중';
  };

  // 날짜 형식화
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\. /g, '-').replace('.', '');
  };

  // 시간 경과 표시
  const timeAgo = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return formatDistanceToNow(date, { addSuffix: true, locale: ko });
  };

  return (
    <div className="container mx-auto py-12 px-6 max-w-full">
      {/* 헤더 영역 */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-800 p-3 rounded-lg">
              <ClipboardList className="h-6 w-6 text-purple-100" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">개인용 검사결과</h1>
              <p className="text-gray-500 mt-1">개인 사용자 검사결과 조회 및 관리</p>
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
              placeholder="이름 또는 ID로 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-800 focus:ring-purple-800 h-11"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Input
              type="date"
              placeholder="시작일"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="py-2.5 rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-800 focus:ring-purple-800 h-11"
            />
            <span className="hidden md:flex items-center text-gray-500">~</span>
            <Input
              type="date"
              placeholder="종료일"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="py-2.5 rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-800 focus:ring-purple-800 h-11"
            />
          </div>
          <Button 
            type="submit" 
            className="rounded-lg bg-purple-800 hover:bg-purple-900 shadow-sm transition-all px-5 py-2.5 h-11 text-purple-50"
          >
            검색
          </Button>
        </form>
        <div className="flex items-center justify-between mt-5 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="h-4 w-4 text-purple-800" />
            <span>전체: <b>{totalResults}</b>개 검사결과</span>
          </div>
        </div>
      </div>

      {/* 검사결과 목록 테이블 */}
      <div className="overflow-hidden rounded-xl shadow-md border border-gray-100 bg-white">
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse">
            <TableHeader className="bg-gradient-to-r from-purple-900 to-purple-800">
              <TableRow className="border-b border-purple-700">
                <TableHead className="py-4 px-4 text-sm font-bold text-purple-50 text-center w-[7%]">번호</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-purple-50 w-[15%]">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    이름
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-purple-50 text-center w-[5%]">성별</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-purple-50 text-center w-[15%]">아이디</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-purple-50 text-center w-[13%]">
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    연락처
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-purple-50 text-center w-[10%]">검사 종류</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-purple-50 text-center w-[15%]">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    검사일
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-purple-50 text-center w-[10%]">상태</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-purple-50 text-center w-[10%]">상세보기</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-800"></div>
                      <div className="mt-4 text-base text-gray-600">검사결과를 불러오는 중입니다...</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-100 p-4 rounded-full">
                        <ClipboardList className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="mt-4 text-lg font-medium text-gray-500">검색 결과가 없습니다</div>
                      <div className="mt-2 text-sm text-gray-400">다른 검색어를 입력하거나 필터를 조정해 보세요</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                results.map((result, index) => (
                  <TableRow 
                    key={result.anp_seq}
                    className={`group cursor-pointer transition-colors hover:bg-purple-50 border-b ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                    onClick={() => handleResultClick(result.anp_seq)}
                  >
                    <TableCell className="py-4 px-4 text-base text-center font-medium text-gray-800">{result.anp_seq}</TableCell>
                    <TableCell className="py-4 px-4 text-base font-semibold">
                      <div className="flex items-center">
                        <div className="group-hover:text-purple-800 text-purple-700 transition-colors">{result.pe_name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">{getSexDisplay(result.pe_sex)}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">{result.ac_id}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">{result.pe_cellphone || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center">
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-3 py-1 font-medium">
                        {result.pd_kind || '일반검사'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">
                      <div className="flex flex-col">
                        <span>{formatDate(result.start_date)}</span>
                        <span className="text-xs text-gray-500">{timeAgo(result.start_date)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-base text-center">
                      <Badge className={`px-3 py-1 font-medium ${
                        result.anp_status === 'done'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}>
                        {getStatusDisplay(result.anp_status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      <Button 
                        variant="outline" 
                        className="border-purple-200 text-purple-800 hover:bg-purple-50 transition-colors font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResultClick(result.anp_seq);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
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
      {!loading && totalResults > 0 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <Button 
            variant="outline" 
            size="icon"
            className="h-10 w-10 rounded-lg cursor-pointer border-gray-200 hover:bg-purple-100 hover:text-purple-800 transition-colors"
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
                    ? 'bg-purple-800 hover:bg-purple-900 text-white' 
                    : 'border-gray-200 hover:bg-purple-100 hover:text-purple-800'
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
            className="h-10 w-10 rounded-lg cursor-pointer border-gray-200 hover:bg-purple-100 hover:text-purple-800 transition-colors"
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