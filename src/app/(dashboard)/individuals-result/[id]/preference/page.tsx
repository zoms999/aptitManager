'use client';

import { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

interface PreferenceData {
  tdname1: string;
  qcnt1: number;
  rrate1: number;
  tdname2: string;
  qcnt2: number;
  rrate2: number;
  tdname3: string;
  qcnt3: number;
  rrate3: number;
  exp1: string;
  exp2: string;
  exp3: string;
}

interface PreferenceJob {
  qua_name: string;
  jo_name: string;
  jo_outline: string;
  jo_mainbusiness: string;
  majors: string;
}

interface PreferenceResponse {
  success: boolean;
  data: {
    preferenceData: PreferenceData;
    preferenceJobs1: PreferenceJob[];
    preferenceJobs2: PreferenceJob[];
    preferenceJobs3: PreferenceJob[];
  };
}

export default function PreferencePage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<PreferenceResponse['data'] | null>(null);

  useEffect(() => {
    async function fetchPreferenceData() {
      try {
        const response = await fetch(`/api/individuals-result/${params.id}/preference`);
        
        if (!response.ok) {
          throw new Error('선호도 데이터를 불러오는 데 실패했습니다.');
        }
        
        const data = await response.json() as PreferenceResponse;
        
        if (!data.success) {
          throw new Error(data.data ? JSON.stringify(data.data) : '데이터 로드 실패');
        }
        
        setPreferences(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchPreferenceData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !preferences || !preferences.preferenceData) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900">선호도 데이터를 불러올 수 없습니다</h3>
        <p className="mt-1 text-sm text-gray-500">{error || '데이터가 없습니다.'}</p>
      </div>
    );
  }

  const { preferenceData, preferenceJobs1, preferenceJobs2, preferenceJobs3 } = preferences;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">이미지 선호도 검사 결과</h2>
        <p className="text-gray-700 mb-4">
          이미지 선호도 검사는 직업적 흥미와 관련된 이미지들을 선택하는 과정에서 자신의 선호도를 파악하는 검사입니다.
          상위 3개 선호 영역과 각 영역에 맞는 관련 직업을 확인할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 1순위 선호도 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white p-4">
            <h3 className="text-xl font-semibold">1순위: {preferenceData.tdname1}</h3>
            <div className="flex justify-between mt-2">
              <span>응답 문항수: {preferenceData.qcnt1}개</span>
              <span>선호도: {preferenceData.rrate1}%</span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-gray-700 mb-4">{preferenceData.exp1}</p>
            <div className="mt-4">
              <h4 className="font-medium text-blue-700 mb-2">관련 직업</h4>
              <ul className="space-y-2">
                {preferenceJobs1.map((job, index) => (
                  <JobDisclosure key={index} job={job} index={index} />
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 2순위 선호도 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-500 text-white p-4">
            <h3 className="text-xl font-semibold">2순위: {preferenceData.tdname2}</h3>
            <div className="flex justify-between mt-2">
              <span>응답 문항수: {preferenceData.qcnt2}개</span>
              <span>선호도: {preferenceData.rrate2}%</span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-gray-700 mb-4">{preferenceData.exp2}</p>
            <div className="mt-4">
              <h4 className="font-medium text-blue-700 mb-2">관련 직업</h4>
              <ul className="space-y-2">
                {preferenceJobs2.map((job, index) => (
                  <JobDisclosure key={index} job={job} index={index} />
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 3순위 선호도 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-400 text-white p-4">
            <h3 className="text-xl font-semibold">3순위: {preferenceData.tdname3}</h3>
            <div className="flex justify-between mt-2">
              <span>응답 문항수: {preferenceData.qcnt3}개</span>
              <span>선호도: {preferenceData.rrate3}%</span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-gray-700 mb-4">{preferenceData.exp3}</p>
            <div className="mt-4">
              <h4 className="font-medium text-blue-700 mb-2">관련 직업</h4>
              <ul className="space-y-2">
                {preferenceJobs3.map((job, index) => (
                  <JobDisclosure key={index} job={job} index={index} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 직업 상세 정보 표시 컴포넌트
function JobDisclosure({ job, index }: { job: PreferenceJob, index: number }) {
  return (
    <div className="mt-2">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
              <span>{index + 1}. {job.jo_name}</span>
              <ChevronUpIcon
                className={`${
                  open ? 'transform rotate-180' : ''
                } w-5 h-5 text-blue-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              <div className="space-y-2">
                <div>
                  <h5 className="font-medium text-gray-700">직업 개요</h5>
                  <p className="mt-1">{job.jo_outline || '정보가 없습니다.'}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700">주요 업무</h5>
                  <p className="mt-1">{job.jo_mainbusiness || '정보가 없습니다.'}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700">관련 학과</h5>
                  <p className="mt-1">{job.majors || '정보가 없습니다.'}</p>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
} 