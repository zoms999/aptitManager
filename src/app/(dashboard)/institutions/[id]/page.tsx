'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, Clock, Calendar, User, Building, Phone, Mail, MapPin, FileText, Search, ExternalLink } from 'lucide-react';
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
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <div className="mt-6 text-xl font-medium text-gray-600">기관 정보를 불러오는 중입니다...</div>
        </div>
      </div>
    );
  }
  
  if (error && !institution) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
              <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-red-800 mb-1">오류가 발생했습니다</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Link href="/institutions">
            <Button variant="outline" className="flex items-center gap-2 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              <ArrowLeft size={18} />
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
    <div className="container mx-auto py-12 px-6 max-w-7xl">
      {/* 상단 헤더 및 버튼 영역 */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
        <div className="flex items-center gap-3">
          <Link href="/institutions">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full shadow-sm hover:bg-blue-50 transition-colors">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{institution.ins_name || '기관 상세 정보'}</h1>
            <p className="text-gray-500 mt-1">ID: {institution.ins_seq}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button 
            onClick={handleDelete} 
            variant="outline" 
            className="flex items-center gap-2 px-5 py-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors shadow-sm"
            disabled={deleting}
          >
            <Trash2 size={16} />
            {deleting ? '삭제 중...' : '기관 삭제'}
          </Button>
          <Link href={`/institutions/${id}/edit`}>
            <Button className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
              <Edit size={16} />
              기관 정보 수정
            </Button>
          </Link>
        </div>
      </div>
      
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0 bg-red-100 rounded-full p-1">
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
      
      {/* 상태 뱃지 */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Badge className={`text-sm font-medium px-4 py-1.5 ${institution.ac_use === 'Y' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {institution.ac_use === 'Y' ? '활성 계정' : '비활성 계정'}
        </Badge>
        <Badge className={`text-sm font-medium px-4 py-1.5 ${institution.isexpire === 1 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
          {institution.isexpire === 1 ? '유효 기간 내' : '만료됨'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽 컬럼: 기관 계정 + 기관 정보 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 기관 계정 정보 */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
            <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white p-6">
              <div className="flex items-center gap-3">
                <Building className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-800">기관 계정</h2>
              </div>
            </div>
            <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-base font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-blue-600" />
                  기관 인증코드
                </p>
                <div className="flex items-center">
                  <p className="text-lg font-medium text-gray-800">{institution.ac_id}</p>
                  <Button variant="outline" size="sm" className="ml-2 text-sm h-8 py-0 px-3 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700">
                    변경
                  </Button>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-base font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  사용기한
                </p>
                <div className="flex items-center">
                  <p className="text-lg font-medium text-gray-800">{institution.ac_expire_date}</p>
                  <Button variant="outline" size="sm" className="ml-2 text-sm h-8 py-0 px-3 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700">
                    변경
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-base font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-blue-600" />
                  비밀번호
                </p>
                <div className="flex items-center">
                  <Button variant="outline" size="sm" className="text-sm h-9 py-0 px-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    비밀번호 변경
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-base font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                  <Search className="h-4 w-4 text-blue-600" />
                  로그확인
                </p>
                <div className="flex items-center">
                  <Button variant="outline" size="sm" className="text-sm h-9 py-0 px-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    검색로그
                  </Button>
                  <Button variant="outline" size="sm" className="ml-2 text-sm h-9 py-0 px-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    방문로그
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 기관 정보 */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
            <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white p-6">
              <div className="flex items-center gap-3">
                <Building className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-semibold text-gray-800">기관 정보</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoItem icon={<Building />} label="기관명" value={institution.ins_name} />
                <InfoItem icon={<FileText />} label="사업자번호" value={institution.ins_license_num} />
                <InfoItem icon={<FileText />} label="법인번호" value={institution.ins_identity_num} />
                <InfoItem icon={<User />} label="대표이름" value={institution.ins_ceo} />
                <InfoItem icon={<Building />} label="업태" value={institution.ins_business} />
                <InfoItem icon={<Building />} label="종목" value={institution.ins_business_detail} />
                <InfoItem icon={<Phone />} label="연락처1" value={institution.ins_tel1} />
                <InfoItem icon={<Phone />} label="연락처2" value={institution.ins_tel2} />
              </div>
            </div>
          </div>
          
          {/* 주소 정보 */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
            <div className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-white p-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-semibold text-gray-800">주소 정보</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100 w-full md:w-auto">
                    <p className="text-base font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-green-600" />
                      우편번호
                    </p>
                    <p className="text-lg font-medium text-gray-800">{institution.ins_postcode || '-'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-500 mb-2">도로명 주소</p>
                  <p className="text-lg font-medium text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{institution.ins_road_addr || '-'}</p>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-500 mb-2">지번 주소</p>
                  <p className="text-lg font-medium text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{institution.ins_jibun_addr || '-'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-base font-medium text-gray-500 mb-2">상세 주소</p>
                    <p className="text-lg font-medium text-gray-800">{institution.ins_detail_addr || '-'}</p>
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-500 mb-2">추가 주소</p>
                    <p className="text-lg font-medium text-gray-800">{institution.ins_extra_addr || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 오른쪽 컬럼: 담당자 + 계정 상태 */}
        <div className="space-y-6">
          {/* 담당자 정보 */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
            <div className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white p-6">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl font-semibold text-gray-800">담당자 정보</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                  <h3 className="text-xl font-semibold text-gray-800">(정) 담당자</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4 border-l-2 border-purple-100">
                  <InfoItem icon={<User />} label="이름" value={institution.ins_manager1_name} />
                  <InfoItem icon={<Building />} label="부서" value={institution.ins_manager1_team} />
                  <InfoItem icon={<User />} label="직급" value={institution.ins_manager1_position} />
                  <InfoItem icon={<Phone />} label="연락처" value={institution.ins_manager1_cellphone} />
                  <div className="sm:col-span-2">
                    <InfoItem icon={<Mail />} label="이메일" value={institution.ins_manager1_email} />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <div className="h-2 w-2 rounded-full bg-gray-400 mr-2"></div>
                  <h3 className="text-xl font-semibold text-gray-800">(부) 담당자</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4 border-l-2 border-gray-200">
                  <InfoItem icon={<User />} label="이름" value={institution.ins_manager2_name} />
                  <InfoItem icon={<Building />} label="부서" value={institution.ins_manager2_team} />
                  <InfoItem icon={<User />} label="직급" value={institution.ins_manager2_position} />
                  <InfoItem icon={<Phone />} label="연락처" value={institution.ins_manager2_cellphone} />
                  <div className="sm:col-span-2">
                    <InfoItem icon={<Mail />} label="이메일" value={institution.ins_manager2_email} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 계정 상태 정보 */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
            <div className="border-b border-gray-100 bg-gradient-to-r from-amber-50 to-white p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-amber-600" />
                <h2 className="text-2xl font-semibold text-gray-800">계정 상태</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-5">
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-amber-600" />
                    <p className="text-base font-medium text-gray-700">가입일</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">{institution.ac_insert_date || '-'}</p>
                </div>
                
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-amber-600" />
                    <p className="text-base font-medium text-gray-700">만료일</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">{institution.ac_expire_date || '-'}</p>
                </div>
                
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <p className="text-base font-medium text-gray-700">만료 여부</p>
                  </div>
                  <div className="text-lg">{getExpireStatus(institution.isexpire)}</div>
                </div>
                
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-amber-600" />
                    <p className="text-base font-medium text-gray-700">계정 상태</p>
                  </div>
                  <div className="text-lg">{getAccountStatus(institution.ac_use)}</div>
                </div>
                
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <p className="text-base font-medium text-gray-700">마지막 접속일</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">{institution.ac_leave_date || '-'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="h-5 w-5 text-amber-600" />
                    <p className="text-base font-medium text-gray-700">유효 URL</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-lg font-medium text-gray-800">{institution.ins_url_code || '-'}</p>
                    {institution.ins_url_code && (
                      <Button variant="outline" size="sm" className="ml-2 text-sm h-8 py-0 px-3 bg-white text-amber-600 hover:text-amber-700 hover:bg-amber-50"
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
      </div>
    </div>
  );
}

// 정보 아이템 컴포넌트
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined }) => (
  <div>
    <p className="text-base font-medium text-gray-500 mb-2 flex items-center gap-1.5">
      <span className="text-indigo-600">{icon}</span>
      {label}
    </p>
    <p className="text-lg font-medium text-gray-800">{value || '-'}</p>
  </div>
);

// Lock 아이콘 추가
const Lock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
); 