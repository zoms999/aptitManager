'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Institution {
  ins_seq: number;
  ins_name: string;
  ins_license_num: string;
  ins_identity_num: string;
  ins_business: string;
  ins_business_detail: string;
  ins_bill_email: string;
  ins_ceo: string;
  ins_postcode: string;
  ins_road_addr: string;
  ins_jibun_addr: string;
  ins_detail_addr: string;
  ins_extra_addr: string;
  ins_tel1: string;
  ins_tel2: string;
  ins_fax1: string;
  ins_manager1_name: string;
  ins_manager1_cellphone: string;
  ins_manager1_email: string;
  ins_manager1_team: string;
  ins_manager1_position: string;
  ins_manager2_name: string;
  ins_manager2_cellphone: string;
  ins_manager2_email: string;
  ins_manager2_team: string;
  ins_manager2_position: string;
  ins_url_code: string;
  ac_gid: string;
  ac_id: string;
  isexpire: number;
  ac_expire_date: string;
  ac_insert_date: string;
  ac_leave_date: string;
  ac_use: string;
}

interface InstitutionDetailPageProps {
  params: {
    id: string;
  };
}

export default function InstitutionDetailPage({ params }: InstitutionDetailPageProps) {
  const id = params.id;
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    fetchInstitutionDetail();
  }, [id]);
  
  const fetchInstitutionDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/institutions/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setInstitution(data.institution);
      } else {
        setError(data.message || '기관 정보를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('기관 상세 정보 로딩 중 오류:', error);
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm('정말로 이 기관을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }
    
    try {
      setDeleting(true);
      setError(null);
      
      const response = await fetch(`/api/institutions/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('기관이 성공적으로 삭제되었습니다.');
        router.push('/institutions'); // 목록 페이지로 이동
      } else {
        setError(data.message || '기관 삭제에 실패했습니다.');
        setDeleting(false);
      }
    } catch (error) {
      console.error('기관 삭제 중 오류:', error);
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setDeleting(false);
    }
  };
  
  const getAccountStatus = (use: string) => {
    return use === 'Y' ? 
      <Badge className="bg-green-500 hover:bg-green-600 text-white px-3 py-1">활성</Badge> : 
      <Badge variant="destructive" className="px-3 py-1">비활성</Badge>;
  };
  
  const getExpireStatus = (isexpire: number) => {
    return isexpire === 1 ? 
      <Badge className="bg-green-500 hover:bg-green-600 text-white">유효</Badge> : 
      <Badge variant="destructive">만료</Badge>;
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <div className="ml-4 text-lg text-gray-600">로딩 중...</div>
        </div>
      </div>
    );
  }
  
  if (error && !institution) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Link href="/institutions">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              목록으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  if (!institution) {
    return null;
  }
  
  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Link href="/institutions">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full cursor-pointer">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">기관 상세 정보</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleDelete} 
            variant="outline" 
            className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer"
            disabled={deleting}
          >
            <Trash2 size={16} />
            {deleting ? '삭제 중...' : '기관 삭제'}
          </Button>
          <Link href={`/institutions/${id}/edit`}>
            <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 cursor-pointer">
              <Edit size={16} />
              기관 정보 수정
            </Button>
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* 기관 계정 정보 */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold mb-6">기관 계정</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">기관 인증코드</p>
              <div className="flex items-center">
                <p className="text-lg font-medium text-gray-700">{institution.ac_id}</p>
                <Button variant="outline" size="sm" className="ml-2 text-sm h-8 py-0 px-3">
                  변경
                </Button>
              </div>
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">사용기한</p>
              <div className="flex items-center">
                <p className="text-lg font-medium text-gray-700">{institution.ac_expire_date}</p>
                <Button variant="outline" size="sm" className="ml-2 text-sm h-8 py-0 px-3">
                  변경
                </Button>
              </div>
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">비밀번호</p>
              <div className="flex items-center">
                <Button variant="outline" size="sm" className="text-sm h-8 py-0 px-3">
                  변경하기
                </Button>
              </div>
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">로그확인</p>
              <div className="flex items-center">
                <Button variant="outline" size="sm" className="text-sm h-8 py-0 px-3">
                  검색로그
                </Button>
                <Button variant="outline" size="sm" className="ml-2 text-sm h-8 py-0 px-3">
                  방문로그
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 기관 정보 */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold mb-6">기관 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">기관명</p>
              <p className="text-lg font-medium text-gray-700">{institution.ins_name || '-'}</p>
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">사업자번호</p>
              <p className="text-lg font-medium text-gray-700">{institution.ins_license_num || '-'}</p>
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">법인번호</p>
              <p className="text-lg font-medium text-gray-700">{institution.ins_identity_num || '-'}</p>
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">대표이름</p>
              <p className="text-lg font-medium text-gray-700">{institution.ins_ceo || '-'}</p>
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">업태</p>
              <p className="text-lg font-medium text-gray-700">{institution.ins_business || '-'}</p>
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">종목</p>
              <p className="text-lg font-medium text-gray-700">{institution.ins_business_detail || '-'}</p>
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">연락처1</p>
              <p className="text-lg font-medium text-gray-700">{institution.ins_tel1 || '-'}</p>
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">연락처2</p>
              <p className="text-lg font-medium text-gray-700">{institution.ins_tel2 || '-'}</p>
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">특수1</p>
              <p className="text-lg font-medium text-gray-700">-</p>
            </div>
          </div>
        </div>
        
        {/* 우편번호 */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold mb-6">주소 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">우편번호</p>
              <p className="text-lg font-medium text-gray-700">{institution.ins_postcode || '-'}</p>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-base font-medium text-gray-500 mb-2">도로명 주소</p>
              <p className="text-lg font-medium text-gray-700">{institution.ins_road_addr || '-'}</p>
            </div>
            
            <div className="md:col-span-3">
              <p className="text-base font-medium text-gray-500 mb-2">지번 주소</p>
              <p className="text-lg font-medium text-gray-700">{institution.ins_jibun_addr || '-'}</p>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-base font-medium text-gray-500 mb-2">상세 주소</p>
              <p className="text-lg font-medium text-gray-700">{institution.ins_detail_addr || '-'}</p>
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">추가 주소</p>
              <p className="text-lg font-medium text-gray-700">{institution.ins_extra_addr || '-'}</p>
            </div>
          </div>
        </div>
        
        {/* 담당자 정보 */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold mb-6">담당자 정보</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">(정) 이름</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-base font-medium text-gray-500 mb-2">부서</p>
                <p className="text-lg font-medium text-gray-700">{institution.ins_manager1_team || '-'}</p>
              </div>
              
              <div>
                <p className="text-base font-medium text-gray-500 mb-2">직급</p>
                <p className="text-lg font-medium text-gray-700">{institution.ins_manager1_position || '-'}</p>
              </div>
              
              <div>
                <p className="text-base font-medium text-gray-500 mb-2">이름</p>
                <p className="text-lg font-medium text-gray-700">{institution.ins_manager1_name || '-'}</p>
              </div>
              
              <div>
                <p className="text-base font-medium text-gray-500 mb-2">연락처</p>
                <p className="text-lg font-medium text-gray-700">{institution.ins_manager1_cellphone || '-'}</p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-base font-medium text-gray-500 mb-2">이메일</p>
                <p className="text-lg font-medium text-gray-700">{institution.ins_manager1_email || '-'}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">(부) 이름</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-base font-medium text-gray-500 mb-2">부서</p>
                <p className="text-lg font-medium text-gray-700">{institution.ins_manager2_team || '-'}</p>
              </div>
              
              <div>
                <p className="text-base font-medium text-gray-500 mb-2">직급</p>
                <p className="text-lg font-medium text-gray-700">{institution.ins_manager2_position || '-'}</p>
              </div>
              
              <div>
                <p className="text-base font-medium text-gray-500 mb-2">이름</p>
                <p className="text-lg font-medium text-gray-700">{institution.ins_manager2_name || '-'}</p>
              </div>
              
              <div>
                <p className="text-base font-medium text-gray-500 mb-2">연락처</p>
                <p className="text-lg font-medium text-gray-700">{institution.ins_manager2_cellphone || '-'}</p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-base font-medium text-gray-500 mb-2">이메일</p>
                <p className="text-lg font-medium text-gray-700">{institution.ins_manager2_email || '-'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 계정 상태 정보 */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">계정 상태</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">가입일</p>
              <p className="text-lg font-medium text-gray-700">{institution.ac_insert_date || '-'}</p>
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">만료일</p>
              <p className="text-lg font-medium text-gray-700">{institution.ac_expire_date || '-'}</p>
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">만료 여부</p>
              <div className="text-lg">{getExpireStatus(institution.isexpire)}</div>
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">계정 상태</p>
              <div className="text-lg">{getAccountStatus(institution.ac_use)}</div>
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">마지막 접속일</p>
              <p className="text-lg font-medium text-gray-700">{institution.ac_leave_date || '-'}</p>
            </div>
            
            <div>
              <p className="text-base font-medium text-gray-500 mb-2">유효 URL</p>
              <div className="flex items-center">
                <p className="text-lg font-medium text-gray-700">{institution.ins_url_code || '-'}</p>
                {institution.ins_url_code && (
                  <Button variant="outline" size="sm" className="ml-2 text-sm h-8 py-0 px-3"
                    onClick={() => {
                      navigator.clipboard.writeText(institution.ins_url_code || '');
                      alert('URL이 클립보드에 복사되었습니다.');
                    }}
                  >
                    복사
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 