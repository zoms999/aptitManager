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
import { Search, Plus, ChevronLeft, ChevronRight, Users, User, Mail, Phone, Shield, FileText, Settings } from 'lucide-react';

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
  
  return (
    <div className="container mx-auto py-12 px-6 max-w-full">
      <div className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">관리자 관리</h1>
              <p className="text-gray-500 mt-1">관리자 계정 목록 및 권한 관리</p>
            </div>
          </div>
          <Link href="/managers/new">
            <Button className="rounded-lg bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all px-5 py-2.5 h-11">
              <Plus className="h-5 w-5 mr-2" />
              관리자 추가
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="이름 또는 이메일로 검색"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 h-11"
            />
          </div>
          <Button type="submit" className="rounded-lg bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all px-5 py-2.5 h-11">
            검색
          </Button>
        </form>
        <div className="flex items-center justify-between mt-5 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="h-4 w-4 text-indigo-600" />
            <span>전체: <b>{totalCount}</b>명의 관리자</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-hidden rounded-xl shadow-md border border-gray-100 bg-white">
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse">
            <TableHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <TableRow className="border-b border-indigo-100">
                <TableHead className="py-4 px-4 text-sm font-bold text-indigo-700 text-center w-[5%]">번호</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-indigo-700 text-center w-[10%]">
                  <div className="flex items-center justify-center gap-2">
                    <User className="h-4 w-4" />
                    이름
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-indigo-700 text-center w-[15%]">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    이메일
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-indigo-700 text-center w-[10%]">
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    연락처
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-indigo-700 text-center w-[7%]">상태</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-indigo-700 text-center w-[7%]">
                  <div className="flex flex-col items-center justify-center">
                    <Shield className="h-4 w-4 mb-1" />
                    <span className="text-xs">관리자관리</span>
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-indigo-700 text-center w-[7%]">
                  <div className="flex flex-col items-center justify-center">
                    <User className="h-4 w-4 mb-1" />
                    <span className="text-xs">회원관리</span>
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-indigo-700 text-center w-[7%]">
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="h-4 w-4 mb-1" />
                    <span className="text-xs">결과지조회</span>
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-indigo-700 text-center w-[7%]">
                  <div className="flex flex-col items-center justify-center">
                    <Settings className="h-4 w-4 mb-1" />
                    <span className="text-xs">기관관리</span>
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-indigo-700 text-center w-[7%]">
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="h-4 w-4 mb-1" />
                    <span className="text-xs">통계조회</span>
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-indigo-700 text-center w-[7%]">
                  <div className="flex flex-col items-center justify-center">
                    <Mail className="h-4 w-4 mb-1" />
                    <span className="text-xs">문의관리</span>
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-indigo-700 text-center w-[7%]">
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="h-4 w-4 mb-1" />
                    <span className="text-xs">로그조회</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                      <div className="mt-4 text-base text-gray-600">관리자 정보를 불러오는 중입니다...</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : managers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-100 p-4 rounded-full">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="mt-4 text-lg font-medium text-gray-500">등록된 관리자가 없습니다</div>
                      <div className="mt-2 text-sm text-gray-400">새 관리자를 추가하려면 &apos;관리자 추가&apos; 버튼을 클릭하세요</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                managers.map((manager, index) => (
                  <TableRow 
                    key={manager.mg_seq} 
                    className={`group cursor-pointer transition-colors hover:bg-indigo-50 border-b ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                    onClick={() => router.push(`/managers/${manager.mg_seq}`)}
                  >
                    <TableCell className="py-4 px-4 text-base text-center font-medium text-gray-800">{manager.mg_seq}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center font-semibold">
                      <div className="group-hover:text-indigo-700 text-indigo-600 transition-colors">{manager.mg_name}</div>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-base">{manager.mg_email || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">{manager.mg_cellphone || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      {manager.mg_use === 'Y' ? 
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 font-medium">활성</Badge> : 
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 font-medium">비활성</Badge>
                      }
                    </TableCell>
                    <TableCell className="py-4 px-2 text-center border-l border-gray-100">
                      {manager.mg_grant_manager === 1 ? 
                        <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 px-3 py-1 font-medium">허용</Badge> : 
                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 font-medium border-0">미허용</Badge>
                      }
                    </TableCell>
                    <TableCell className="py-4 px-2 text-center border-l border-gray-100">
                      {manager.mg_grant_account === 1 ? 
                        <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 px-3 py-1 font-medium">허용</Badge> : 
                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 font-medium border-0">미허용</Badge>
                      }
                    </TableCell>
                    <TableCell className="py-4 px-2 text-center border-l border-gray-100">
                      {manager.mg_grant_result === 1 ? 
                        <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 px-3 py-1 font-medium">허용</Badge> : 
                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 font-medium border-0">미허용</Badge>
                      }
                    </TableCell>
                    <TableCell className="py-4 px-2 text-center border-l border-gray-100">
                      {manager.mg_grant_institute === 1 ? 
                        <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 px-3 py-1 font-medium">허용</Badge> : 
                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 font-medium border-0">미허용</Badge>
                      }
                    </TableCell>
                    <TableCell className="py-4 px-2 text-center border-l border-gray-100">
                      {manager.mg_grant_statistic === 1 ? 
                        <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 px-3 py-1 font-medium">허용</Badge> : 
                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 font-medium border-0">미허용</Badge>
                      }
                    </TableCell>
                    <TableCell className="py-4 px-2 text-center border-l border-gray-100">
                      {manager.mg_grant_inquiry === 1 ? 
                        <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 px-3 py-1 font-medium">허용</Badge> : 
                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 font-medium border-0">미허용</Badge>
                      }
                    </TableCell>
                    <TableCell className="py-4 px-2 text-center border-l border-gray-100">
                      {manager.mg_grant_log === 1 ? 
                        <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 px-3 py-1 font-medium">허용</Badge> : 
                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 font-medium border-0">미허용</Badge>
                      }
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {!loading && totalCount > 0 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <Button 
            variant="outline" 
            size="icon"
            className="h-10 w-10 rounded-lg cursor-pointer border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
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
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'border-gray-200 hover:bg-indigo-50 hover:text-indigo-600'
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
            className="h-10 w-10 rounded-lg cursor-pointer border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
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