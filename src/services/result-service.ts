import { ResultData } from '@/types/result-types';

/**
 * 개인 검사 결과 기본 데이터를 로드합니다.
 */
export const loadResultData = async (id: string): Promise<ResultData> => {
  try {
    const response = await fetch(`/api/individuals-result/${id}`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || '데이터를 불러오는데 실패했습니다.');
    }
    
    return result.data;
  } catch (error) {
    console.error('기본 데이터 로딩 오류:', error);
    throw new Error('데이터를 불러오는 중 오류가 발생했습니다.');
  }
};

/**
 * 선호도 데이터를 로드하여 결과 데이터에 추가합니다.
 */
export const loadPreferenceData = async (id: string, resultData: ResultData): Promise<void> => {
  try {
    const response = await fetch(`/api/individuals-result/${id}/preference`);
    
    if (response.ok) {
      const result = await response.json();
      
      if (result.success) {
        resultData.preferenceData = result.data.preferenceData;
        resultData.preferenceJobs1 = result.data.preferenceJobs1;
        resultData.preferenceJobs2 = result.data.preferenceJobs2;
        resultData.preferenceJobs3 = result.data.preferenceJobs3;
      }
    } else {
      console.warn('선호도 데이터를 가져오는데 실패했지만 계속 진행합니다.');
    }
  } catch (error) {
    console.error('선호도 데이터 로딩 오류:', error);
    // 선호도 데이터 오류는 치명적이지 않으므로 진행
  }
};

/**
 * 역량진단 데이터를 로드하여 결과 데이터에 추가합니다.
 */
export const loadCompetencyData = async (id: string, resultData: ResultData): Promise<void> => {
  try {
    const response = await fetch(`/api/individuals-result/${id}/competency`);
    
    if (response.ok) {
      const responseText = await response.text();
      
      try {
        const data = JSON.parse(responseText);
        
        if (data.success) {
          resultData.talentList = data.data.talentList;
          resultData.talentDetails = data.data.talentDetails;
        } else {
          console.error('역량진단 API 성공 플래그 false:', data.message);
        }
      } catch (jsonError) {
        console.error('역량진단 API 응답 JSON 파싱 오류:', jsonError);
      }
    } else {
      console.error(`역량진단 API 호출 실패: ${response.status}`);
    }
  } catch (error) {
    console.error('역량진단 데이터 로드 중 오류 발생:', error);
  }
};

/**
 * 역량적합직업학과 데이터를 로드하여 결과 데이터에 추가합니다.
 */
export const loadCompetencyJobData = async (id: string, resultData: ResultData): Promise<void> => {
  try {
    const response = await fetch(`/api/individuals-result/${id}/competency-job`);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.success) {
        resultData.competencyJobs = data.data;
      } else {
        console.error('역량적합직업학과 API 성공 플래그 false:', data.message);
      }
    } else {
      console.error(`역량적합직업학과 API 호출 실패: ${response.status}`);
    }
  } catch (error) {
    console.error('역량적합직업학과 데이터 로드 중 오류 발생:', error);
  }
};

/**
 * 학습 데이터를 로드합니다.
 */
export const loadLearningData = async (id: string) => {
  try {
    const response = await fetch(`/api/individuals-result/${id}/learning`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      console.error('학습 데이터 로드 실패:', result.error);
      return null;
    }
  } catch (error) {
    console.error('학습 데이터 로드 중 오류 발생:', error);
    return null;
  }
};

/**
 * PDF 보고서를 생성하고 다운로드합니다.
 */
export const generatePdfReport = async (id: string, data: ResultData) => {
  try {
    // pd_kind가 basic인 경우 사고력 섹션을 제외
    const sections = data.pd_kind === 'basic' 
      ? ['personal', 'tendency', 'analysis', 'suitable-job', 'preference']
      : ['personal', 'tendency', 'analysis', 'thinking', 'suitable-job', 'preference'];
    
    // API 호출하여 PDF 보고서 생성 요청
    const response = await fetch(`/api/individuals-result/${id}/pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sections,
        options: {
          layout: 'premium',
          includeCharts: true,
          headerLogo: true,
          pageNumbers: true,
          coverPage: true
        },
        data: {
          personalInfo: data.personalInfo,
          tendency: data.tendency,
          topTendencies: data.topTendencies,
          bottomTendencies: data.bottomTendencies,
          topTendencyExplains: data.topTendencyExplains,
          bottomTendencyExplains: data.bottomTendencyExplains,
          tendencyQuestionExplains: data.tendencyQuestionExplains,
          suitableJobsSummary: data.suitableJobsSummary,
          suitableJobsDetail: data.suitableJobsDetail,
          suitableJobMajors: data.suitableJobMajors,
          imagePreference: data.imagePreference,
          preferenceData: data.preferenceData,
          thinkingMain: data.thinkingMain,
          thinkingScore: data.thinkingScore,
          thinkingDetails: data.thinkingDetails,
          pd_kind: data.pd_kind
        }
      }),
    });
    
    if (!response.ok) {
      // 서버 에러 응답 처리
      try {
        const errorData = await response.json();
        throw new Error(errorData?.error || errorData?.message || '보고서 생성 중 오류가 발생했습니다.');
      } catch {
        // JSON이 아닌 경우 상태 코드와 함께 에러 표시
        throw new Error(`보고서 생성 중 오류가 발생했습니다. (${response.status})`);
      }
    }
    
    // 바이너리 PDF 데이터를 Blob으로 변환
    const blob = await response.blob();
    
    // Blob URL 생성
    const url = window.URL.createObjectURL(blob);
    
    // 다운로드 링크 생성 및 클릭
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.personalInfo.pname}_검사결과.pdf`;
    document.body.appendChild(a);
    a.click();
    
    // 메모리 해제
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // 성공 메시지 표시
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50';
    successMessage.innerHTML = `
      <div class="flex items-center">
        <svg class="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <p>${data.personalInfo.pname}님의 결과보고서가 성공적으로 다운로드되었습니다.</p>
      </div>
    `;
    document.body.appendChild(successMessage);
    
    // 3초 후 메시지 제거
    setTimeout(() => {
      if (document.body.contains(successMessage)) {
        document.body.removeChild(successMessage);
      }
    }, 3000);
    
    return true;
  } catch (error) {
    console.error('보고서 다운로드 중 오류:', error);
    throw error;
  }
}; 