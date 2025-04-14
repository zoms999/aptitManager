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
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface Manager {
  mg_seq: number;
  mg_email: string;
  mg_name: string;
  mg_cellphone: string;
  mg_use: string;
  mg_grant_manager: number;
  mg_grant_account: number;
  mg_grant_institute: number;
  mg_grant_result: number;
  mg_grant_statistic: number;
  mg_grant_inquiry: number;
  mg_grant_log: number;
}

export default function ManagersPage() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  const router = useRouter();
  
  useEffect(() => {
    fetchManagers();
  }, [currentPage, searchTerm]);
  
  const fetchManagers = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * itemsPerPage;
      let url = `/api/managers?limit=${itemsPerPage}&offset=${offset}`;
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setManagers(data.managers);
        setTotalCount(data.total);
      } else {
        console.error('매니저 데이터 로딩 실패:', data.message);
      }
    } catch (error) {
      console.error('매니저 데이터 로딩 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };
  
  const renderPagination = () => {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    return (
      <div className="flex justify-center items-center gap-1 mt-8">
        <Button 
          variant="outline" 
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          // 페이지 숫자 계산 로직 (현재 페이지 중심)
          let pageNum = currentPage;
          if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          
          // 범위를 벗어나면 렌더링하지 않음
          if (pageNum < 1 || pageNum > totalPages) return null;
          
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              className={`h-8 w-8 rounded-full ${currentPage === pageNum ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}
        
        <Button 
          variant="outline" 
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };
  
  const getGrantStatus = (grant: number) => {
    return grant === 1 ? 
      <Badge className="bg-green-500 hover:bg-green-600 text-white">허용</Badge> : 
      <Badge variant="outline" className="text-gray-500 border-gray-300">미허용</Badge>;
  };
  
  const getActiveStatus = (use: string) => {
    return use === 'Y' ? 
      <Badge className="bg-green-500 hover:bg-green-600 text-white px-3 py-1">활성</Badge> : 
      <Badge variant="destructive" className="px-3 py-1">비활성</Badge>;
  };
  
  return (
    <div className="container mx-auto py-10 px-4 max-w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">관리자 목록</h1>
        <Link href="/managers/new">
          <Button className="rounded-full bg-blue-500 hover:bg-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            관리자 추가
          </Button>
        </Link>
      </div>
      
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="이름 또는 이메일로 검색"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Button type="submit" className="rounded-full bg-blue-500 hover:bg-blue-600">
            검색
          </Button>
        </form>
      </div>
      
      <div className="overflow-hidden border rounded-xl shadow-lg bg-white">
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse">
            <TableHeader className="bg-blue-50">
              <TableRow className="border-b-2 border-blue-100">
                <TableHead className="py-4 px-6 text-base uppercase tracking-wider text-blue-700 font-bold text-center w-[5%]">번호</TableHead>
                <TableHead className="py-4 px-6 text-base uppercase tracking-wider text-blue-700 font-bold text-center w-[10%]">이름</TableHead>
                <TableHead className="py-4 px-6 text-base uppercase tracking-wider text-blue-700 font-bold text-center w-[15%]">이메일</TableHead>
                <TableHead className="py-4 px-6 text-base uppercase tracking-wider text-blue-700 font-bold text-center w-[10%]">연락처</TableHead>
                <TableHead className="py-4 px-6 text-base uppercase tracking-wider text-blue-700 font-bold text-center w-[7%]">상태</TableHead>
                <TableHead className="py-4 px-6 text-base uppercase tracking-wider text-blue-700 font-bold text-center w-[7%]">관리자관리</TableHead>
                <TableHead className="py-4 px-6 text-base uppercase tracking-wider text-blue-700 font-bold text-center w-[7%]">회원관리</TableHead>
                <TableHead className="py-4 px-6 text-base uppercase tracking-wider text-blue-700 font-bold text-center w-[7%]">결과지조회</TableHead>
                <TableHead className="py-4 px-6 text-base uppercase tracking-wider text-blue-700 font-bold text-center w-[7%]">기관관리</TableHead>
                <TableHead className="py-4 px-6 text-base uppercase tracking-wider text-blue-700 font-bold text-center w-[7%]">통계조회</TableHead>
                <TableHead className="py-4 px-6 text-base uppercase tracking-wider text-blue-700 font-bold text-center w-[7%]">문의관리</TableHead>
                <TableHead className="py-4 px-6 text-base uppercase tracking-wider text-blue-700 font-bold text-center w-[7%]">로그조회</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-16">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">로딩 중...</div>
                  </TableCell>
                </TableRow>
              ) : managers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-16">
                    <div className="text-gray-500 text-lg">등록된 관리자가 없습니다.</div>
                  </TableCell>
                </TableRow>
              ) : (
                managers.map((manager, index) => (
                  <TableRow 
                    key={manager.mg_seq} 
                    className={`cursor-pointer transition-colors hover:bg-blue-50 border-b ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                    onClick={() => router.push(`/managers/${manager.mg_seq}`)}
                  >
                    <TableCell className="py-4 px-6 text-base text-center font-medium text-gray-800">{manager.mg_seq}</TableCell>
                    <TableCell className="py-4 px-6 text-base text-center font-medium text-blue-600">{manager.mg_name}</TableCell>
                    <TableCell className="py-4 px-6 text-base">{manager.mg_email}</TableCell>
                    <TableCell className="py-4 px-6 text-base text-center">{manager.mg_cellphone}</TableCell>
                    <TableCell className="py-4 px-6 text-center">{getActiveStatus(manager.mg_use)}</TableCell>
                    <TableCell className="py-4 px-2 text-center border-l border-gray-100">{getGrantStatus(manager.mg_grant_manager)}</TableCell>
                    <TableCell className="py-4 px-2 text-center border-l border-gray-100">{getGrantStatus(manager.mg_grant_account)}</TableCell>
                    <TableCell className="py-4 px-2 text-center border-l border-gray-100">{getGrantStatus(manager.mg_grant_result)}</TableCell>
                    <TableCell className="py-4 px-2 text-center border-l border-gray-100">{getGrantStatus(manager.mg_grant_institute)}</TableCell>
                    <TableCell className="py-4 px-2 text-center border-l border-gray-100">{getGrantStatus(manager.mg_grant_statistic)}</TableCell>
                    <TableCell className="py-4 px-2 text-center border-l border-gray-100">{getGrantStatus(manager.mg_grant_inquiry)}</TableCell>
                    <TableCell className="py-4 px-2 text-center border-l border-gray-100">{getGrantStatus(manager.mg_grant_log)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {!loading && totalCount > 0 && renderPagination()}
    </div>
  );
} 