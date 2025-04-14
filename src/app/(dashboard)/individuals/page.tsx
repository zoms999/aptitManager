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
import { Search, Plus, ChevronLeft, ChevronRight, User, Mail, Phone, Calendar, FileText } from 'lucide-react';

interface Individual {
  ac_gid: string;
  ac_id: string;
  ac_use: string;
  pe_seq: number;
  isexpire: number;
  ac_expire_date: string;
  ac_insert_date: string;
  pe_name: string;
  pe_sex: string;
  pe_cellphone: string;
  pe_email: string;
  pe_ur_education: string;
  pe_ur_job: string;
}

export default function IndividualsPage() {
  const [individuals, setIndividuals] = useState<Individual[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  const router = useRouter();
  
  useEffect(() => {
    fetchIndividuals();
  }, [currentPage, searchTerm]);
  
  const fetchIndividuals = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * itemsPerPage;
      let url = `/api/individuals?limit=${itemsPerPage}&offset=${offset}`;
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setIndividuals(data.individuals);
        setTotalCount(data.total);
      } else {
        console.error('개인 데이터 로딩 실패:', data.message);
      }
    } catch (error) {
      console.error('개인 데이터 로딩 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };
  
  const getSexDisplay = (sex: string) => {
    return sex === 'M' ? '남' : '여';
  };
  
  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString();
    return formattedDate.split(', ').join(' ');
  };
  
  return (
    <div className="container mx-auto py-12 px-6 max-w-full">
      {/* 헤더 영역 */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-800 p-3 rounded-lg">
              <User className="h-6 w-6 text-blue-100" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">개인 관리</h1>
              <p className="text-gray-500 mt-1">등록된 개인 사용자 목록 및 관리</p>
            </div>
          </div>
          <Link href="/individuals/new">
            <Button className="rounded-lg bg-blue-800 hover:bg-blue-900 shadow-sm transition-all px-5 py-2.5 h-11 text-blue-50">
              <Plus className="h-5 w-5 mr-2" />
              개인 추가
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
              placeholder="이름 또는 이메일로 검색"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-800 focus:ring-blue-800 h-11"
            />
          </div>
          <Button type="submit" className="rounded-lg bg-blue-800 hover:bg-blue-900 shadow-sm transition-all px-5 py-2.5 h-11 text-blue-50">
            검색
          </Button>
        </form>
        <div className="flex items-center justify-between mt-5 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="h-4 w-4 text-blue-800" />
            <span>전체: <b>{totalCount}</b>명의 사용자</span>
          </div>
        </div>
      </div>
      
      {/* 테이블 영역 */}
      <div className="overflow-hidden rounded-xl shadow-md border border-gray-100 bg-white">
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse">
            <TableHeader className="bg-gradient-to-r from-blue-900 to-blue-800">
              <TableRow className="border-b border-blue-700">
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[5%]">번호</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[8%]">
                  <div className="flex items-center justify-center gap-2">
                    <User className="h-4 w-4" />
                    이름
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[5%]">성별</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[15%]">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    아이디
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[12%]">
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    연락처
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[7%]">학력</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[7%]">직업</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[12%]">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    등록일시
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[9%]">
                  <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                    <Calendar className="h-4 w-4" />
                    만료일
                  </div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[7%]">상태</TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[8%]">
                  <div className="whitespace-nowrap">만료여부</div>
                </TableHead>
                <TableHead className="py-4 px-4 text-sm font-bold text-blue-50 text-center w-[10%]">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
                      <div className="mt-4 text-base text-gray-600">개인 정보를 불러오는 중입니다...</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : individuals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-100 p-4 rounded-full">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="mt-4 text-lg font-medium text-gray-500">등록된 개인 사용자가 없습니다</div>
                      <div className="mt-2 text-sm text-gray-400">새 사용자를 추가하려면 &apos;개인 추가&apos; 버튼을 클릭하세요</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                individuals.map((individual, index) => (
                  <TableRow 
                    key={individual.ac_gid} 
                    className={`group cursor-pointer transition-colors hover:bg-blue-50 border-b ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                    onClick={() => router.push(`/individuals/${individual.pe_seq}`)}
                  >
                    <TableCell className="py-4 px-4 text-base text-center font-medium text-gray-800">{individual.pe_seq}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center font-semibold">
                      <div className="group-hover:text-blue-800 text-blue-700 transition-colors">{individual.pe_name}</div>
                    </TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">{getSexDisplay(individual.pe_sex)}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-gray-700">{individual.ac_id}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">{individual.pe_cellphone || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">{individual.pe_ur_education || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">{individual.pe_ur_job || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700">{formatDate(individual.ac_insert_date) || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-base text-center text-gray-700 whitespace-nowrap">{formatDate(individual.ac_expire_date) || '-'}</TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      {individual.ac_use === 'Y' ? 
                        <Badge className="bg-blue-800 text-white hover:bg-blue-900 px-3 py-1 font-medium">활성</Badge> : 
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 font-medium">비활성</Badge>
                      }
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center whitespace-nowrap">
                      {individual.isexpire === 1 ? 
                        <Badge className="bg-blue-800 text-white hover:bg-blue-900 px-3 py-1 font-medium">유효</Badge> : 
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 px-3 py-1 font-medium">만료</Badge>
                      }
                    </TableCell>
                    <TableCell className="py-4 px-4 text-center">
                      <Button
                        className="rounded-lg bg-blue-800 hover:bg-blue-900 shadow-sm h-9 px-3 text-sm text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/individuals/${individual.pe_seq}`);
                        }}
                      >
                        보기
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
      {!loading && totalCount > 0 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <Button 
            variant="outline" 
            size="icon"
            className="h-10 w-10 rounded-lg cursor-pointer border-gray-200 hover:bg-blue-100 hover:text-blue-800 transition-colors"
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
                    ? 'bg-blue-800 hover:bg-blue-900 text-white' 
                    : 'border-gray-200 hover:bg-blue-100 hover:text-blue-800'
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
            className="h-10 w-10 rounded-lg cursor-pointer border-gray-200 hover:bg-blue-100 hover:text-blue-800 transition-colors"
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