"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

// 기업 정보 타입 정의
interface CompanyInfo {
  co_name: string;
  co_tel1: string;
  co_tel2: string;
  co_fax1: string;
  co_bill_email: string;
  co_to_email: string;
  co_postcode: string;
  co_road_addr: string;
  co_jibun_addr: string;
  co_detail_addr: string;
  co_extra_addr: string | null;
  co_license_num: string;
  co_identity_num: string;
  co_online_num: string;
  co_ceo: string;
}

// 카카오 주소 API 타입 정의
declare global {
  interface Window {
    daum: {
      Postcode: {
        new(options: {
          oncomplete: (data: {
            zonecode: string;
            roadAddress: string;
            jibunAddress: string;
            buildingName?: string;
            apartment?: string;
          }) => void;
        }): {
          open: () => void;
        };
      };
    };
  }
}

export default function CompaniesPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CompanyInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await fetch("/api/companies");
        const data = await response.json();
        
        if (data.success && data.company) {
          setCompanyInfo(data.company);
          setFormData(data.company);
        }
      } catch (error) {
        console.error("기업 정보를 불러오는 중 오류가 발생했습니다.", error);
        setError("기업 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  // 폼 데이터 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // 카카오 주소 API를 이용한 주소 검색
  const handlePostcodeSearch = () => {
    if (!window.daum) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드
        const roadAddr = data.roadAddress; // 도로명 주소 변수
        let extraRoadAddr = ''; // 참고 항목 변수

        // 건물명이 있고, 공동주택일 경우 추가한다.
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
        }

        if (formData) {
          setFormData({
            ...formData,
            co_postcode: data.zonecode,
            co_road_addr: roadAddr,
            co_jibun_addr: data.jibunAddress,
            co_extra_addr: extraRoadAddr
          });
        }
      }
    }).open();
  };

  // 기업 정보 저장
  const handleSave = async () => {
    if (!formData) return;
    
    setSuccess(null);
    setError(null);
    setSaving(true);
    
    try {
      const response = await fetch('/api/companies', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess('기업 정보가 성공적으로 저장되었습니다.');
        // 원본 데이터도 업데이트
        setCompanyInfo({...formData});
      } else {
        setError(result.message || '기업 정보 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('기업 정보 저장 중 오류가 발생했습니다:', error);
      setError('기업 정보 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 폼 초기화
  const handleReset = () => {
    if (companyInfo) {
      setFormData({...companyInfo});
      setSuccess(null);
      setError(null);
    }
  };

  if (loading) {
    return <div className="p-6">로딩 중...</div>;
  }

  if (!companyInfo || !formData) {
    return (
      <div className="p-6">
        <div className="bg-red-50 p-4 rounded-md">
          <h2 className="text-red-800">기업 정보를 불러올 수 없습니다.</h2>
          <p className="mt-2 text-red-700">서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 카카오 주소 API 스크립트 */}
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">기업 정보</h1>
        
        {success && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md">
            {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md">
            {error}
          </div>
        )}
      </div>
      
      {/* 기업 기본 정보 */}
      <div className="bg-white rounded-md shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="inline-block bg-gray-800 w-6 h-6 rounded-full mr-2"></span>
            기업 기본 정보
          </h2>
        </div>
        
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <span className="font-semibold w-24">기업명</span>
            <div className="flex-1">
              <input
                type="text"
                name="co_name"
                value={formData.co_name}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="font-semibold w-24">대표</span>
            <div className="flex-1">
              <input
                type="text"
                name="co_ceo"
                value={formData.co_ceo}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* 기업 연락 정보 */}
      <div className="bg-white rounded-md shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="inline-block bg-gray-800 w-6 h-6 rounded-full mr-2"></span>
            기업 연락 정보
          </h2>
        </div>
        
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <span className="font-semibold w-24">연락처1</span>
            <div className="flex-1">
              <input
                type="text"
                name="co_tel1"
                value={formData.co_tel1}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="예) 02-556-7007"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="font-semibold w-24">연락처2</span>
            <div className="flex-1">
              <input
                type="text"
                name="co_tel2"
                value={formData.co_tel2}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="예) 02-556-795"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="font-semibold w-24">팩스</span>
            <div className="flex-1">
              <input
                type="text"
                name="co_fax1"
                value={formData.co_fax1}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="예) 02-525-9996"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="font-semibold w-24">전자세금계산서</span>
            <div className="flex-1">
              <input
                type="email"
                name="co_bill_email"
                value={formData.co_bill_email}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="예) kimjinedu@naver.com"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="font-semibold w-24">이메일</span>
            <div className="flex-1">
              <input
                type="email"
                name="co_to_email"
                value={formData.co_to_email}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="예) eretzgo@gmail.com"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Company Address */}
      <div className="bg-white rounded-md shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="inline-block bg-gray-800 w-6 h-6 rounded-full mr-2"></span>
            주소 정보
          </h2>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex items-center">
            <span className="font-semibold w-24">우편번호</span>
            <div className="flex-1 flex items-center space-x-2">
              <input 
                type="text" 
                name="co_postcode"
                value={formData.co_postcode} 
                readOnly
                className="border border-gray-300 rounded-md p-2 w-24"
              />
              <button 
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm"
                onClick={handlePostcodeSearch}
              >
                주소찾기
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="font-semibold w-24">도로명 주소</span>
            <input 
              type="text" 
              name="co_road_addr"
              value={formData.co_road_addr} 
              readOnly
              className="border border-gray-300 rounded-md p-2 flex-1"
            />
          </div>
          
          <div className="flex items-center">
            <span className="font-semibold w-24">지번 주소</span>
            <input 
              type="text" 
              name="co_jibun_addr"
              value={formData.co_jibun_addr} 
              readOnly
              className="border border-gray-300 rounded-md p-2 flex-1"
            />
          </div>
          
          <div className="flex items-center">
            <span className="font-semibold w-24">상세주소</span>
            <input 
              type="text" 
              name="co_detail_addr"
              value={formData.co_detail_addr}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 flex-1"
              placeholder="상세주소를 입력하세요"
            />
          </div>
          
          <div className="flex items-center">
            <span className="font-semibold w-24">참고항목</span>
            <input 
              type="text" 
              name="co_extra_addr"
              value={formData.co_extra_addr || ""} 
              readOnly
              className="border border-gray-300 rounded-md p-2 flex-1"
            />
          </div>
        </div>
      </div>
      
      {/* 사업자번호 */}
      <div className="bg-white rounded-md shadow">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="inline-block bg-gray-800 w-6 h-6 rounded-full mr-2"></span>
            사업자번호
          </h2>
        </div>
        
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <span className="font-semibold w-24">사업자번호</span>
            <div className="flex-1">
              <input
                type="text"
                name="co_license_num"
                value={formData.co_license_num}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="사업자번호 입력"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="font-semibold w-24">법인번호</span>
            <div className="flex-1">
              <input
                type="text"
                name="co_identity_num"
                value={formData.co_identity_num}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="법인번호 입력"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="font-semibold w-32">통신판매업번호</span>
            <div className="flex-1">
              <input
                type="text"
                name="co_online_num"
                value={formData.co_online_num}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="통신판매업번호 입력"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          onClick={handleReset}
          disabled={saving}
        >
          초기화
        </button>
        
        <button
          type="button"
          className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={handleSave}
          disabled={saving}
        >
          {saving && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          저장
        </button>
      </div>
    </div>
  );
}
