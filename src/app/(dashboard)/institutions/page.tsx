'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Plus, ChevronLeft, ChevronRight, Building, Users, Calendar, FileText, Briefcase } from 'lucide-react';

interface Institution {
  ac_gid: string;
  ac_id: string;
  ac_use: string;
  ins_seq: number;
  isexpire: number;
  ac_expire_date: string;
  ac_insert_date: string;
  ins_name: string;
  ins_ceo: string;
  ins_tel1: string;
  ins_manager1_team: string;
  ins_manager1_name: string;
  ins_manager1_position: string;
  tur_seq: number;
  tur_count: number;
  tur_req_sum: number;
  tur_use_sum: number;
}

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  const router = useRouter();
  
  useEffect(() => {
    fetchInstitutions();
  }, [currentPage, searchTerm]);
  
  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * itemsPerPage;
      let url = `/api/institutions?limit=${itemsPerPage}&offset=${offset}`;
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setInstitutions(data.institutions);
        setTotalCount(data.total);
      } else {
        console.error('기관 데이터 로딩 실패:', data.message);
      }
    } catch (error) {
      console.error('기관 데이터 로딩 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };
  
  return (
    <div className="container mx-auto py-12 px-6 max-w-full">
      {/* 헤더 영역 */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">기관 관리</h1>
              <p className="text-gray-500 mt-1">등록된 기관 목록 및 관리</p>
            </div>
          </div>
          <Link href="/institutions/new">
            <Button className="rounded-lg bg-blue-600 hover:bg-blue-700 shadow-sm transition-all px-5 py-2.5 h-11">
              <Plus className="h-5 w-5 mr-2" />
              기관 추가
            </Button>
          </Link>
        </div>
      </div>
      
      {/* 검색 및 필터 영역 */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="기관명 또는 담당자명으로 검색"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 h-11"
            />
          </div>
          <Button type="submit" className="rounded-lg bg-blue-600 hover:bg-blue-700 shadow-sm transition-all px-5 py-2.5 h-11">
            검색
          </Button>
        </form>
        <div className="flex items-center justify-between mt-5 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="h-4 w-4 text-blue-600" />
            <span>전체: <b>{totalCount}</b>개 기관</span>
          </div>
        </div>
      </div>
      
      {/* 테이블 영역 */}
      <div className="overflow-hidden rounded-xl shadow-md border border-gray-100 bg-white">
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse">
            <TableHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <TableRow className="border-b border-blue-100">
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-700 text-center w-[5%]">번호</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-700 w-[15%]">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    기관명
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-700 text-center w-[10%]">
                  <div className="flex items-center justify-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    대표자
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-700 text-center w-[10%]">담당 팀</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-700 text-center w-[10%]">담당 직급</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-700 text-center w-[10%]">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4" />
                    담당자
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-700 text-center w-[10%]">연락처</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-700 text-center w-[7%]">회차</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-700 text-center w-[7%]">요청수</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-700 text-center w-[7%]">사용수</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-700 text-center w-[7%]">상태</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-700 text-center w-[7%]">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    만료일
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-700 text-center w-[7%]">만료여부</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                      <div className="mt-4 text-base text-gray-600">기관 정보를 불러오는 중입니다...</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : institutions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-100 p-4 rounded-full">
                        <Building className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="mt-4 text-lg font-medium text-gray-500">등록된 기관이 없습니다</div>
                      <div className="mt-2 text-sm text-gray-400">새 기관을 추가하려면 &apos;기관 추가&apos; 버튼을 클릭하세요</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                institutions.map((institution, index) => (
                  <TableRow 
                    key={institution.ac_gid} 
                    className={`group cursor-pointer transition-colors hover:bg-blue-50 border-b ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                    onClick={() => router.push(`/institutions/${institution.ins_seq}`)}
                  >
                    <TableCell className="py-4 px-4 text-base text-center font-medium text-gray-800">{institution.ins_seq}</TableCell>
                    <TableCell className="py-4 px-4 text-base font-semibold">
                      <div className="flex items-center">
                        <div className="group-hover:text-blue-700 text-blue-600 transition-colors">{institution.ins_name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">{institution.ins_ceo || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">{institution.ins_manager1_team || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">{institution.ins_manager1_position || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center font-medium text-gray-800">{institution.ins_manager1_name || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">{institution.ins_tel1 || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">
                      <span className="font-semibold">{institution.tur_count}</span>회차
                    </TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">
                      <span className="font-semibold">{institution.tur_req_sum}</span>개
                    </TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">
                      <span className="font-semibold">{institution.tur_use_sum}</span>개
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      {institution.ac_use === 'Y' ? 
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 font-medium">활성</Badge> : 
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 font-medium">비활성</Badge>
                      }
                    </TableCell>
                    <TableCell className="py-4 px-4 text-base text-center font-medium text-gray-800">{institution.ac_expire_date}</TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      {institution.isexpire === 1 ? 
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 font-medium">유효</Badge> : 
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 px-3 py-1 font-medium">만료</Badge>
                      }
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* 페이지네이션 영역 */}
      {!loading && totalCount > 0 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <Button 
            variant="outline" 
            size="icon"
            className="h-10 w-10 rounded-lg cursor-pointer border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          {Array.from({ length: Math.min(5, Math.ceil(totalCount / itemsPerPage)) }, (_, i) => {
            // 페이지 숫자 계산 로직 (현재 페이지 중심)
            let pageNum = currentPage;
            if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= Math.ceil(totalCount / itemsPerPage) - 2) {
              pageNum = Math.ceil(totalCount / itemsPerPage) - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            // 범위를 벗어나면 렌더링하지 않음
            if (pageNum < 1 || pageNum > Math.ceil(totalCount / itemsPerPage)) return null;
            
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                className={`h-10 w-10 rounded-lg cursor-pointer font-medium ${
                  currentPage === pageNum 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'border-gray-200 hover:bg-blue-50 hover:text-blue-600'
                }`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          
          <Button 
            variant="outline" 
            size="icon"
            className="h-10 w-10 rounded-lg cursor-pointer border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalCount / itemsPerPage)))}
            disabled={currentPage === Math.ceil(totalCount / itemsPerPage)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
} 