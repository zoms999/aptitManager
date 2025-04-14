'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Manager {
  mg_seq: number;
  mg_email: string;
  mg_name: string;
  mg_cellphone: string;
  mg_contact: string;
  mg_use: string;
  mg_pw: string;
  mg_postcode: string;
  mg_jibun_addr: string;
  mg_road_addr: string;
  mg_detail_addr: string;
  mg_extra_addr: string;
  mg_grant_manager: number;
  mg_grant_account: number;
  mg_grant_institute: number;
  mg_grant_result: number;
  mg_grant_statistic: number;
  mg_grant_inquiry: number;
  mg_grant_log: number;
}

interface ManagerDetailPageProps {
  params: {
    id: string;
  };
}

export default function ManagerDetailPage({ params }: ManagerDetailPageProps) {
  const id = params.id;
  const [manager, setManager] = useState<Manager | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    fetchManagerDetail();
  }, [id]);
  
  const fetchManagerDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/managers/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setManager(data.manager);
      } else {
        setError(data.message || '매니저 정보를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('매니저 상세 정보 로딩 중 오류:', error);
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
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
  
  if (loading) {
    return <div className="container mx-auto py-8 text-center">로딩 중...</div>;
  }
  
  if (error || !manager) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-red-500 mb-4">{error || '매니저 정보를 찾을 수 없습니다.'}</p>
        <Button onClick={() => router.push('/managers')}>목록으로 돌아가기</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">관리자 상세정보</h1>
        <div className="flex gap-2">
          <Link href={`/managers/${id}/edit`}>
            <Button variant="outline">수정</Button>
          </Link>
          <Button variant="outline" className="text-red-500" onClick={() => {}}>
            삭제
          </Button>
          <Link href="/managers">
            <Button variant="outline">목록</Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-sm border">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">기본 정보</h2>
          
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="font-medium">관리자 번호</div>
            <div className="col-span-2">{manager.mg_seq}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="font-medium">이름</div>
            <div className="col-span-2">{manager.mg_name}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="font-medium">이메일</div>
            <div className="col-span-2">{manager.mg_email}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="font-medium">휴대전화</div>
            <div className="col-span-2">{manager.mg_cellphone}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="font-medium">추가연락처</div>
            <div className="col-span-2">{manager.mg_contact}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="font-medium">계정상태</div>
            <div className="col-span-2">{getActiveStatus(manager.mg_use)}</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">주소 정보</h2>
          
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="font-medium">우편번호</div>
            <div className="col-span-2">{manager.mg_postcode}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="font-medium">지번주소</div>
            <div className="col-span-2">{manager.mg_jibun_addr}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="font-medium">도로명주소</div>
            <div className="col-span-2">{manager.mg_road_addr}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="font-medium">상세주소</div>
            <div className="col-span-2">{manager.mg_detail_addr}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="font-medium">추가주소</div>
            <div className="col-span-2">{manager.mg_extra_addr}</div>
          </div>
        </div>
        
        <div className="space-y-4 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold border-b pb-2">권한 정보</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="font-medium mb-2">관리자관리</div>
              {getGrantStatus(manager.mg_grant_manager)}
            </div>
            
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="font-medium mb-2">개인회원관리</div>
              {getGrantStatus(manager.mg_grant_account)}
            </div>
            
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="font-medium mb-2">기관관리</div>
              {getGrantStatus(manager.mg_grant_institute)}
            </div>
            
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="font-medium mb-2">결과지조회</div>
              {getGrantStatus(manager.mg_grant_result)}
            </div>
            
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="font-medium mb-2">통계조회</div>
              {getGrantStatus(manager.mg_grant_statistic)}
            </div>
            
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="font-medium mb-2">문의관리</div>
              {getGrantStatus(manager.mg_grant_inquiry)}
            </div>
            
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <div className="font-medium mb-2">로그조회</div>
              {getGrantStatus(manager.mg_grant_log)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 