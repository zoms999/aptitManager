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
      <div className="flex justify-center gap-2 mt-4">
        <Button 
          variant="outline" 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          이전
        </Button>
        <span className="py-2 px-4">
          {currentPage} / {totalPages}
        </span>
        <Button 
          variant="outline" 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          다음
        </Button>
      </div>
    );
  };
  
  const getGrantStatus = (grant: number) => {
    return grant === 1 ? 
      <Badge className="bg-green-500">허용</Badge> : 
      <Badge variant="outline" className="text-gray-500">미허용</Badge>;
  };
  
  const getActiveStatus = (use: string) => {
    return use === 'Y' ? 
      <Badge className="bg-green-500">활성</Badge> : 
      <Badge variant="destructive">비활성</Badge>;
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">관리자 목록</h1>
        <Link href="/managers/new">
          <Button>관리자 추가</Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="이름 또는 이메일로 검색"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit">검색</Button>
        </form>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>번호</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>관리자관리</TableHead>
              <TableHead>회원관리</TableHead>
              <TableHead>결과지조회</TableHead>
              <TableHead>기관관리</TableHead>
              <TableHead>통계조회</TableHead>
              <TableHead>문의관리</TableHead>
              <TableHead>로그조회</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : managers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8">
                  등록된 관리자가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              managers.map((manager) => (
                <TableRow 
                  key={manager.mg_seq} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/managers/${manager.mg_seq}`)}
                >
                  <TableCell>{manager.mg_seq}</TableCell>
                  <TableCell className="font-medium">{manager.mg_name}</TableCell>
                  <TableCell>{manager.mg_email}</TableCell>
                  <TableCell>{manager.mg_cellphone}</TableCell>
                  <TableCell>{getActiveStatus(manager.mg_use)}</TableCell>
                  <TableCell>{getGrantStatus(manager.mg_grant_manager)}</TableCell>
                  <TableCell>{getGrantStatus(manager.mg_grant_account)}</TableCell>
                  <TableCell>{getGrantStatus(manager.mg_grant_result)}</TableCell>
                  <TableCell>{getGrantStatus(manager.mg_grant_institute)}</TableCell>
                  <TableCell>{getGrantStatus(manager.mg_grant_statistic)}</TableCell>
                  <TableCell>{getGrantStatus(manager.mg_grant_inquiry)}</TableCell>
                  <TableCell>{getGrantStatus(manager.mg_grant_log)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {!loading && renderPagination()}
    </div>
  );
} 