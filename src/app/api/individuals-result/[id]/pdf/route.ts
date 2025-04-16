import { NextRequest, NextResponse } from 'next/server';

// PDF 생성 API에 사용할 타입 정의
interface PdfRequestData {
  sections: string[];
  data: {
    personalInfo: {
      id: string;
      pname: string;
      birth: string;
      sex: string;
      age: number;
      education?: string;
      school?: string;
      job?: string;
    };
    tendency: {
      tnd1: string;
      tnd2: string;
    };
    topTendencies: Array<{
      tendency_name: string;
      tendency_nm?: string;
      rank: number;
      code: string;
    }>;
    bottomTendencies: Array<{
      tendency_name: string;
      tendency_nm?: string;
      rank: number;
      code: string;
    }>;
    topTendencyExplains: Array<{
      rank: number;
      tendency_name: string;
      explanation: string;
      sdescription?: string;
    }>;
    bottomTendencyExplains: Array<{
      rank: number;
      tendency_name: string;
      explanation: string;
      sdescription?: string;
    }>;
    tendencyQuestionExplains: Array<{
      qu_explain: string;
      rank: number;
    }>;
    suitableJobsSummary?: {
      tendency: string;
      tndjob: string;
    };
    suitableJobsDetail?: Array<{
      jo_name: string;
      jo_outline: string;
      jo_mainbusiness: string;
    }>;
    suitableJobMajors?: Array<{
      jo_name: string;
      major: string;
    }>;
    imagePreference?: {
      tcnt: number;
      cnt: number;
      irate: number;
    };
    preferenceData?: {
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
    };
  };
}

// PDF 생성 API
export async function POST(
  request: NextRequest
) {
  try {
    // 요청 본문에서 데이터 추출
    const requestData: PdfRequestData = await request.json();
    const { sections, data } = requestData;
    
    // 대신 HTML을 생성하고 클라이언트 측에서 jsPDF로 변환하도록 합니다
    const html = generateHTML(data, sections);
    
    // HTML을 반환
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      }
    });
    
  } catch (error) {
    console.error('보고서 생성 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '보고서 생성 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

// HTML 생성 함수
function generateHTML(data: PdfRequestData['data'], sections: string[]): string {
  // HTML 기본 구조 생성
  let html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.personalInfo.pname}님의 검사결과</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          text-align: center;
          color: #333;
        }
        h2 {
          color: #0066cc;
          border-bottom: 1px solid #ccc;
          padding-bottom: 8px;
          margin-top: 30px;
        }
        h3 {
          color: #333;
          margin-top: 20px;
        }
        .section {
          margin-bottom: 40px;
        }
        .info-row {
          display: flex;
          margin-bottom: 10px;
        }
        .info-label {
          width: 120px;
          font-weight: bold;
          color: #666;
        }
        .info-value {
          flex: 1;
        }
        .item {
          margin-bottom: 20px;
        }
        .sub-info {
          margin-left: 20px;
          color: #666;
        }
        .explanation {
          background-color: #f9f9f9;
          padding: 15px;
          border-left: 3px solid #0066cc;
          margin: 10px 0 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 50px;
          color: #666;
          font-size: 0.9em;
        }
        @media print {
          body {
            font-size: 12px;
          }
          h1 {
            font-size: 24px;
          }
          h2 {
            font-size: 20px;
          }
          h3 {
            font-size: 16px;
          }
          .page-break {
            page-break-before: always;
          }
        }
      </style>
    </head>
    <body>
      <h1>${data.personalInfo.pname}님의 검사결과</h1>
      
      <div class="section">
        <h2>개인 정보</h2>
        <div class="info-row">
          <div class="info-label">이름</div>
          <div class="info-value">${data.personalInfo.pname}</div>
        </div>
        <div class="info-row">
          <div class="info-label">아이디</div>
          <div class="info-value">${data.personalInfo.id}</div>
        </div>
        <div class="info-row">
          <div class="info-label">생년월일</div>
          <div class="info-value">${data.personalInfo.birth} (${data.personalInfo.age}세)</div>
        </div>
        <div class="info-row">
          <div class="info-label">성별</div>
          <div class="info-value">${data.personalInfo.sex}</div>
        </div>
        <div class="info-row">
          <div class="info-label">최종학력</div>
          <div class="info-value">${data.personalInfo.education || '-'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">학교</div>
          <div class="info-value">${data.personalInfo.school || '-'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">직업</div>
          <div class="info-value">${data.personalInfo.job || '-'}</div>
        </div>
      </div>
  `;
  
  // 성향진단 섹션
  if (sections.includes('tendency')) {
    html += `
      <div class="page-break"></div>
      <div class="section">
        <h2>성향 진단</h2>
        
        <h3>나의 성향</h3>
        <p>가장 높은 3개의 성향 정보</p>
    `;
    
    if (data.topTendencies && data.topTendencies.length > 0) {
      data.topTendencies.forEach((tendency, index) => {
        const tendencyName = tendency.tendency_nm || tendency.tendency_name;
        const explanation = data.topTendencyExplains.find(e => e.rank === tendency.rank);
        
        html += `
          <div class="item">
            <h4>${index + 1}순위: ${tendencyName}</h4>
            ${explanation ? `<div class="explanation">${explanation.explanation || explanation.sdescription || '설명이 제공되지 않았습니다.'}</div>` : ''}
          </div>
        `;
      });
    } else {
      html += '<p>성향 데이터가 없습니다.</p>';
    }
    
    html += `
        <h3>잘 맞지 않는 성향</h3>
        <p>가장 낮은 3개의 성향 정보</p>
    `;
    
    if (data.bottomTendencies && data.bottomTendencies.length > 0) {
      data.bottomTendencies.forEach((tendency, index) => {
        const tendencyName = tendency.tendency_nm || tendency.tendency_name;
        const explanation = data.bottomTendencyExplains.find(e => e.rank === tendency.rank);
        
        html += `
          <div class="item">
            <h4>${index + 1}순위: ${tendencyName}</h4>
            ${explanation ? `<div class="explanation">${explanation.explanation || explanation.sdescription || '설명이 제공되지 않았습니다.'}</div>` : ''}
          </div>
        `;
      });
    } else {
      html += '<p>맞지 않는 성향 데이터가 없습니다.</p>';
    }
    
    html += '</div>';
  }
  
  // 성향분석 섹션
  if (sections.includes('analysis')) {
    html += `
      <div class="page-break"></div>
      <div class="section">
        <h2>성향분석</h2>
        <h3>${data.personalInfo.pname}님의 성향 특성</h3>
        <p>옥타그노시스 검사 결과에 따른 성향 분석</p>
    `;
    
    if (data.tendencyQuestionExplains && data.tendencyQuestionExplains.length > 0) {
      data.tendencyQuestionExplains.forEach((item, index) => {
        html += `<div class="item">${index + 1}. ${item.qu_explain}</div>`;
      });
    } else {
      html += '<p>성향 특성 데이터가 없습니다.</p>';
    }
    
    html += '</div>';
  }
  
  // 성향적합직업학과 섹션
  if (sections.includes('suitable-job')) {
    html += `
      <div class="page-break"></div>
      <div class="section">
        <h2>성향적합직업학과</h2>
    `;
    
    if (data.suitableJobsSummary) {
      html += `
        <h3>${data.suitableJobsSummary.tendency || ""} 적합직업군</h3>
        <p>성향과 적성을 분석하여 도출한 적합 직업</p>
      `;
      
      if (data.suitableJobsDetail && data.suitableJobsDetail.length > 0) {
        data.suitableJobsDetail.forEach((job, index) => {
          html += `
            <div class="item">
              <h4>추천 ${index + 1}: ${job.jo_name}</h4>
              <div class="sub-info">
                <p><strong>직업개요:</strong> ${job.jo_outline || '정보가 제공되지 않았습니다.'}</p>
                <p><strong>주요업무:</strong> ${job.jo_mainbusiness || '정보가 제공되지 않았습니다.'}</p>
              </div>
            </div>
          `;
        });
      } else {
        html += '<p>적합직업 데이터가 없습니다.</p>';
      }
      
      html += `
        <h3>${data.suitableJobsSummary.tendency || ""} 적합학과군</h3>
        <p>성향과 적성을 분석하여 도출한 적합 학과</p>
      `;
      
      if (data.suitableJobMajors && data.suitableJobMajors.length > 0) {
        data.suitableJobMajors.forEach((item, index) => {
          html += `
            <div class="item">
              <h4>추천 ${index + 1}: ${item.jo_name}</h4>
              <div class="sub-info">
                <p><strong>관련학과:</strong> ${item.major || '정보가 제공되지 않았습니다.'}</p>
              </div>
            </div>
          `;
        });
      } else {
        html += '<p>적합학과 데이터가 없습니다.</p>';
      }
    }
    
    html += '</div>';
  }
  
  // 선호도 섹션
  if (sections.includes('preference')) {
    html += `
      <div class="page-break"></div>
      <div class="section">
        <h2>선호도 분석</h2>
    `;
    
    // 선호반응 비율 정보
    if (data.imagePreference) {
      const preferencePercent = Math.round(data.imagePreference.irate);
      
      html += `
        <h3>선호반응 차트</h3>
        <p>이미지에 대한 선호 반응 분석</p>
        <div class="item">
          <h4>선호 반응 비율: ${preferencePercent}%</h4>
          <div class="sub-info">
            <p>전체 이미지 수: ${data.imagePreference.tcnt}개</p>
            <p>선호 반응 이미지 수: ${data.imagePreference.cnt}개</p>
          </div>
        </div>
      `;
    }
    
    // 이미지 선호도 분석
    if (data.preferenceData) {
      html += `
        <h3>이미지 선호도 분석 차트</h3>
        <p>선호하는 이미지 유형 분석</p>
        <div class="item">
          <div>1. ${data.preferenceData.tdname1} (${data.preferenceData.rrate1}%, ${data.preferenceData.qcnt1}개)</div>
          <div>2. ${data.preferenceData.tdname2} (${data.preferenceData.rrate2}%, ${data.preferenceData.qcnt2}개)</div>
          <div>3. ${data.preferenceData.tdname3} (${data.preferenceData.rrate3}%, ${data.preferenceData.qcnt3}개)</div>
        </div>
        
        <h3>선호 이미지 상세 분석</h3>
        <p>상위 3개 선호 이미지 분석</p>
        
        <div class="item">
          <h4>1순위: ${data.preferenceData.tdname1}</h4>
          <div class="sub-info">
            <p>응답수: ${data.preferenceData.qcnt1}개 / 선호도: ${data.preferenceData.rrate1}%</p>
            <div class="explanation">${data.preferenceData.exp1 || '설명이 제공되지 않았습니다.'}</div>
          </div>
        </div>
        
        <div class="item">
          <h4>2순위: ${data.preferenceData.tdname2}</h4>
          <div class="sub-info">
            <p>응답수: ${data.preferenceData.qcnt2}개 / 선호도: ${data.preferenceData.rrate2}%</p>
            <div class="explanation">${data.preferenceData.exp2 || '설명이 제공되지 않았습니다.'}</div>
          </div>
        </div>
        
        <div class="item">
          <h4>3순위: ${data.preferenceData.tdname3}</h4>
          <div class="sub-info">
            <p>응답수: ${data.preferenceData.qcnt3}개 / 선호도: ${data.preferenceData.rrate3}%</p>
            <div class="explanation">${data.preferenceData.exp3 || '설명이 제공되지 않았습니다.'}</div>
          </div>
        </div>
      `;
    } else {
      html += '<p>선호도 데이터가 없습니다.</p>';
    }
    
    html += '</div>';
  }
  
  // 푸터 추가
  html += `
      <div class="footer">
        <p>본 보고서는 옥타그노시스 시스템에 의해 자동 생성되었습니다.</p>
        <p>© 옥타그노시스</p>
      </div>
      
      <script>
        // 페이지 로드 후 자동으로 인쇄 창 열기
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 1000);
        }
      </script>
    </body>
    </html>
  `;
  
  return html;
} 