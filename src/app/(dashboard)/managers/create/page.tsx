'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

interface CreateManagerFormData {
  mg_email: string;
  mg_pw: string;
  mg_name: string;
  mg_cellphone: string;
  mg_contact: string;
  mg_use: string;
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

export default function CreateManagerPage() {
  const initialFormData: CreateManagerFormData = {
    mg_email: '',
    mg_pw: '',
    mg_name: '',
    mg_cellphone: '',
    mg_contact: '',
    mg_use: 'Y',
    mg_postcode: '',
    mg_jibun_addr: '',
    mg_road_addr: '',
    mg_detail_addr: '',
    mg_extra_addr: '',
    mg_grant_manager: 0,
    mg_grant_account: 0,
    mg_grant_institute: 0,
    mg_grant_result: 0,
    mg_grant_statistic: 0,
    mg_grant_inquiry: 0,
    mg_grant_log: 0
  };

  const [formData, setFormData] = useState<CreateManagerFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // 체크박스인 경우 숫자로 변환하여 저장
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked ? 1 : 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 필드 검증
    const requiredFields = [
      'mg_name', 'mg_email', 'mg_pw', 'mg_cellphone', 'mg_use', 
      'mg_postcode', 'mg_jibun_addr', 'mg_road_addr'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`${field} 필드는 필수입니다.`);
        return;
      }
    }
    
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      
      const response = await fetch('/api/managers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('관리자가 성공적으로 생성되었습니다.');
        
        // 폼 초기화
        setFormData(initialFormData);
        
        // 3초 후 상세 페이지로 이동
        setTimeout(() => {
          router.push(`/managers/${data.manager.mg_seq}`);
        }, 3000);
      } else {
        setError(data.message || '관리자 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('관리자 생성 중 오류:', error);
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Link href="/managers">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">새 관리자 등록</h1>
        </div>
        <Button 
          onClick={handleSubmit} 
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
          disabled={saving}
        >
          <Save size={16} />
          {saving ? '저장 중...' : '관리자 등록'}
        </Button>
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
      
      {message && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-green-700">{message}</p>
            </div>
          </div>
        </div>
      )}
      
      <form className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* 기본 정보 */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                계정 상태 <span className="text-red-500">*</span>
              </label>
              <select
                name="mg_use"
                value={formData.mg_use}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Y">활성</option>
                <option value="N">비활성</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 <span className="text-red-500">*</span>
              </label>
              <Input 
                type="text" 
                name="mg_name" 
                value={formData.mg_name} 
                onChange={handleChange} 
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일 <span className="text-red-500">*</span>
              </label>
              <Input 
                type="email" 
                name="mg_email" 
                value={formData.mg_email} 
                onChange={handleChange} 
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <Input 
                type="password" 
                name="mg_pw" 
                value={formData.mg_pw} 
                onChange={handleChange} 
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                휴대전화 <span className="text-red-500">*</span>
              </label>
              <Input 
                type="text" 
                name="mg_cellphone" 
                value={formData.mg_cellphone} 
                onChange={handleChange} 
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                추가연락처
              </label>
              <Input 
                type="text" 
                name="mg_contact" 
                value={formData.mg_contact} 
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        {/* 주소 정보 */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">주소 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                우편번호 <span className="text-red-500">*</span>
              </label>
              <Input 
                type="text" 
                name="mg_postcode" 
                value={formData.mg_postcode} 
                onChange={handleChange} 
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지번주소 <span className="text-red-500">*</span>
              </label>
              <Input 
                type="text" 
                name="mg_jibun_addr" 
                value={formData.mg_jibun_addr} 
                onChange={handleChange} 
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                도로명주소 <span className="text-red-500">*</span>
              </label>
              <Input 
                type="text" 
                name="mg_road_addr" 
                value={formData.mg_road_addr} 
                onChange={handleChange} 
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상세주소
              </label>
              <Input 
                type="text" 
                name="mg_detail_addr" 
                value={formData.mg_detail_addr} 
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                추가주소
              </label>
              <Input 
                type="text" 
                name="mg_extra_addr" 
                value={formData.mg_extra_addr} 
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        {/* 권한 정보 */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">권한 설정</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mg_grant_manager"
                name="mg_grant_manager"
                checked={formData.mg_grant_manager === 1}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="mg_grant_manager" className="ml-2 block text-sm text-gray-700">
                관리자 관리 권한
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mg_grant_account"
                name="mg_grant_account"
                checked={formData.mg_grant_account === 1}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="mg_grant_account" className="ml-2 block text-sm text-gray-700">
                개인회원 관리 권한
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mg_grant_institute"
                name="mg_grant_institute"
                checked={formData.mg_grant_institute === 1}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="mg_grant_institute" className="ml-2 block text-sm text-gray-700">
                기관 관리 권한
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mg_grant_result"
                name="mg_grant_result"
                checked={formData.mg_grant_result === 1}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="mg_grant_result" className="ml-2 block text-sm text-gray-700">
                결과지 조회 권한
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mg_grant_statistic"
                name="mg_grant_statistic"
                checked={formData.mg_grant_statistic === 1}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="mg_grant_statistic" className="ml-2 block text-sm text-gray-700">
                통계 조회 권한
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mg_grant_inquiry"
                name="mg_grant_inquiry"
                checked={formData.mg_grant_inquiry === 1}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="mg_grant_inquiry" className="ml-2 block text-sm text-gray-700">
                문의글 관리 권한
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mg_grant_log"
                name="mg_grant_log"
                checked={formData.mg_grant_log === 1}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="mg_grant_log" className="ml-2 block text-sm text-gray-700">
                로그 조회 권한
              </label>
            </div>
          </div>
        </div>
        
        {/* 하단 버튼 */}
        <div className="p-6 bg-gray-50 flex justify-end gap-4">
          <Link href="/managers">
            <Button variant="outline">취소</Button>
          </Link>
          <Button 
            onClick={handleSubmit} 
            className="bg-blue-500 hover:bg-blue-600"
            disabled={saving}
          >
            {saving ? '저장 중...' : '관리자 등록'}
          </Button>
        </div>
      </form>
    </div>
  );
} 