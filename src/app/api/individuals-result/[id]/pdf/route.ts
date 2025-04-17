import { NextRequest } from 'next/server';
import puppeteer from 'puppeteer';

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
      pd_kind?: string;
      pd_num?: number;
    };
    tendency: {
      tnd1: string;
      tnd2: string;
    };
    topTendencies: Array<{
      tendency_name: string;
      rank: number;
      code: string;
    }>;
    bottomTendencies: Array<{
      tendency_name: string;
      rank: number;
      code: string;
    }>;
    topTendencyExplains: Array<{
      rank: number;
      tendency_name: string;
      explanation: string;
    }>;
    bottomTendencyExplains: Array<{
      rank: number;
      tendency_name: string;
      explanation: string;
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
    thinkingMain?: {
      thkm: string;
      thks: string;
      tscore: number;
    };
    thinkingScore?: {
      thk1: number;
      thk2: number;
      thk3: number;
      thk4: number;
      thk5: number;
      thk6: number;
      thk7: number;
      thk8: number;
    };
    thinkingDetails?: Array<{
      qua_name: string;
      score: number;
      explain: string;
    }>;
  };
}

// PDF 생성 API
export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json() as PdfRequestData;
    const { sections = ['tendency', 'analysis', 'suitable-job', 'preference'], data } = body;
    
    // Premium 검사인지 확인하는 함수
    function checkIfPremium(data: PdfRequestData['data']): boolean {
      // pd_kind로 확인
      if (data.personalInfo.pd_kind) {
        const pdKind = data.personalInfo.pd_kind.toLowerCase();
        return pdKind.includes('premium') || pdKind.includes('프리미엄');
      }
      
      // pd_num으로 확인 (fallback)
      if (data.personalInfo.pd_num) {
        return data.personalInfo.pd_num >= 1000;
      }
      
      return false;
    }
    
    // Premium 검사인 경우 thinking 섹션 추가
    const requestedSections = [...sections];
    if (checkIfPremium(data) && data.thinkingMain && !requestedSections.includes('thinking')) {
      requestedSections.push('thinking');
    }
    
    // HTML 보고서 생성
    const html = generateHTMLReport(data, requestedSections);
    
    // 문서 생성
    const browser = await puppeteer.launch({
      headless: true,
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
    });
    
    await browser.close();
    
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(data.personalInfo.pname)}_report.pdf"; filename*=UTF-8''${encodeURIComponent(`${data.personalInfo.pname}_검사결과.pdf`)}`,
      },
    });
  } catch (error) {
    console.error('PDF 생성 에러:', error);
    return new Response(JSON.stringify({ error: 'PDF 생성 중 오류가 발생했습니다.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// HTML 리포트 생성 함수
function generateHTMLReport(data: PdfRequestData['data'], sections: string[]): string {
  // 기본 HTML 구조 생성
  let html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.personalInfo.pname}님의 검사결과</title>
      <style>
        body {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        * {
          box-sizing: border-box;
        }
        h1, h2, h3, h4 {
          color: #1e40af;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        h2 {
          font-size: 1.5rem;
          font-weight: 600;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        h3 {
          font-size: 1.25rem;
          font-weight: 600;
        }
        h4 {
          font-size: 1.1rem;
          font-weight: 600;
        }
        .container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          padding: 2rem;
          margin-bottom: 2rem;
        }
        .header {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
        }
        .header-icon {
          width: 48px;
          height: 48px;
          background-color: #1e40af;
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
        }
        .header-title {
          margin: 0;
        }
        .header-subtitle {
          color: #6b7280;
          margin: 0;
        }
        .print-btn {
          display: block;
          margin: 20px auto;
          padding: 10px 20px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        @media print {
          .print-btn {
            display: none;
          }
          body {
            background-color: white;
            padding: 0;
          }
          .container {
            box-shadow: none;
            padding: 0;
            break-inside: avoid;
          }
          .page-break {
            page-break-before: always;
          }
        }
        .info-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .info-table th {
          text-align: left;
          padding: 10px;
          background-color: #f3f4f6;
          width: 30%;
          border: 1px solid #e5e7eb;
        }
        .info-table td {
          padding: 10px;
          border: 1px solid #e5e7eb;
        }
        .tab-container {
          margin-top: 1.5rem;
        }
        .card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          margin-bottom: 1.5rem;
          overflow: hidden;
        }
        .card-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .card-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1e3a8a;
          margin: 0;
        }
        .card-description {
          color: #6b7280;
          margin: 0.25rem 0 0;
          font-size: 0.875rem;
        }
        .card-content {
          padding: 1.5rem;
        }
        .tendency-item {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background-color: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .tendency-name {
          font-weight: 600;
          color: #1e40af;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }
        .tendency-explanation {
          color: #4b5563;
        }
        .badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 9999px;
          margin-right: 0.5rem;
        }
        .badge-blue {
          background-color: #dbeafe;
          color: #1e40af;
        }
        .badge-red {
          background-color: #fee2e2;
          color: #b91c1c;
        }
        .badge-green {
          background-color: #d1fae5;
          color: #065f46;
        }
        .badge-yellow {
          background-color: #fef3c7;
          color: #92400e;
        }
        .badge-purple {
          background-color: #ede9fe;
          color: #5b21b6;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .job-item {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        }
        .job-title {
          font-weight: 600;
          font-size: 1.1rem;
          color: #1e40af;
          margin-bottom: 0.5rem;
        }
        .job-section {
          margin-top: 0.5rem;
        }
        .job-section-title {
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 0.25rem;
        }
        .chart-container {
          margin-top: 1rem;
          margin-bottom: 2rem;
        }
        .bar-chart {
          width: 100%;
          background-color: #f3f4f6;
          border-radius: 4px;
          margin-bottom: 0.5rem;
          position: relative;
        }
        .bar {
          background-color: #3b82f6;
          color: white;
          padding: 0.5rem;
          border-radius: 4px;
          text-align: right;
          font-weight: 500;
          position: relative;
        }
        .bar-label {
          margin-top: 0.25rem;
          font-size: 0.875rem;
          color: #4b5563;
          display: flex;
          justify-content: space-between;
        }
        .preference-stats {
          display: flex;
          justify-content: space-between;
          background-color: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
        .preference-stat {
          text-align: center;
        }
        .preference-stat-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e40af;
        }
        .preference-stat-label {
          font-size: 0.875rem;
          color: #6b7280;
        }
        .footer {
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 3rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <button class="print-btn" onclick="window.print()">인쇄하기</button>
      
      <div class="container">
        <div class="header">
          <div class="header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
          </div>
          <div>
            <h1 class="header-title">${data.personalInfo.pname}님의 검사결과</h1>
            <p class="header-subtitle">개인 검사결과 상세 보고서</p>
          </div>
        </div>
      
        <h2>개인 정보</h2>
        <table class="info-table">
          <tr>
            <th>이름</th>
            <td>${data.personalInfo.pname}</td>
          </tr>
          <tr>
            <th>아이디</th>
            <td>${data.personalInfo.id}</td>
          </tr>
          <tr>
            <th>생년월일</th>
            <td>${data.personalInfo.birth} (${data.personalInfo.age}세)</td>
          </tr>
          <tr>
            <th>성별</th>
            <td>${data.personalInfo.sex}</td>
          </tr>
          <tr>
            <th>최종학력</th>
            <td>${data.personalInfo.education || '-'}</td>
          </tr>
          <tr>
            <th>학교</th>
            <td>${data.personalInfo.school || '-'}</td>
          </tr>
          <tr>
            <th>직업</th>
            <td>${data.personalInfo.job || '-'}</td>
          </tr>
        </table>
      </div>
  `;
  
  // 성향진단 섹션
  if (sections.includes('tendency')) {
    html += `<div class="container page-break">${addTendencySection(data)}</div>`;
  }
  
  // 성향분석 섹션
  if (sections.includes('analysis')) {
    html += `<div class="container page-break">${addAnalysisSection(data)}</div>`;
  }
  
  // 사고력 섹션
  if (sections.includes('thinking') && data.thinkingMain) {
    html += `<div class="container page-break">${addThinkingSection(data)}</div>`;
  }
  
  // 성향적합직업학과 섹션
  if (sections.includes('suitable-job')) {
    html += `<div class="container page-break">${addSuitableJobSection(data)}</div>`;
  }
  
  // 선호도 섹션
  if (sections.includes('preference')) {
    html += `<div class="container page-break">${addPreferenceSection(data)}</div>`;
  }
  
  // 푸터 및 HTML 닫기
  html += `
      <div class="footer">
        <p>본 보고서는 옥타그노시스 시스템에 의해 자동 생성되었습니다.</p>
        <p>&copy; 옥타그노시스</p>
      </div>
    </body>
    </html>
  `;
  
  return html;
}

// 성향진단 섹션 추가
function addTendencySection(data: PdfRequestData['data']): string {
  let html = `
    <div class="tab-container">
      <h2>성향진단</h2>
      
      <div class="grid">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">나의 성향</h3>
            <p class="card-description">나를 이루는 기운이 되는 성향 3개</p>
          </div>
          <div class="card-content">
  `;
  
  if (data.topTendencies && data.topTendencies.length > 0) {
    data.topTendencies.forEach((item) => {
      const explain = data.topTendencyExplains?.find((e) => e.rank === item.rank);
      
      html += `
        <div class="tendency-item">
          <div class="tendency-name">
            <span class="badge badge-blue">${item.rank}위</span>
            ${item.tendency_name}
          </div>
          ${explain ? `<div class="tendency-explanation">${explain.explanation}</div>` : ''}
        </div>
      `;
    });
  } else {
    html += `<p>성향 정보를 불러올 수 없습니다.</p>`;
  }
  
  html += `
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">나와 잘 안 맞는 성향</h3>
            <p class="card-description">나의 기질과 맞지 않는 성향 3개</p>
          </div>
          <div class="card-content">
  `;
  
  if (data.bottomTendencies && data.bottomTendencies.length > 0) {
    data.bottomTendencies.forEach((item, i) => {
      const explain = data.bottomTendencyExplains?.find((e) => e.rank === item.rank);
      
      html += `
        <div class="tendency-item">
          <div class="tendency-name">
            <span class="badge badge-red">하위 ${i + 1}</span>
            ${item.tendency_name}
          </div>
          ${explain ? `<div class="tendency-explanation">${explain.explanation}</div>` : ''}
        </div>
      `;
    });
  } else {
    html += `<p>성향 정보를 불러올 수 없습니다.</p>`;
  }
  
  html += `
          </div>
        </div>
      </div>
    </div>
  `;
  
  return html;
}

// 성향분석 섹션 추가
function addAnalysisSection(data: PdfRequestData['data']): string {
  let html = `
    <div class="tab-container">
      <h2>성향분석</h2>
      
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${data.personalInfo.pname}님의 성향 특성</h3>
          <p class="card-description">옥타그노시스 검사 결과에 따른 성향 분석</p>
        </div>
        <div class="card-content">
  `;
  
  if (data.tendencyQuestionExplains && data.tendencyQuestionExplains.length > 0) {
    data.tendencyQuestionExplains.forEach((item, index) => {
      html += `
        <div class="tendency-item">
          <div class="tendency-explanation">
            <strong>${index + 1}.</strong> ${item.qu_explain}
          </div>
        </div>
      `;
    });
  } else {
    html += `<p>성향 특성 데이터가 없습니다.</p>`;
  }
  
  html += `
        </div>
      </div>
    </div>
  `;
  
  return html;
}

// 사고력 섹션 추가
function addThinkingSection(data: PdfRequestData['data']): string {
  let html = `
    <div class="tab-container">
      <h2>사고력 진단</h2>
      
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">사고력 유형 결과</h3>
          <p class="card-description">
            ${data.personalInfo.pname}님의 주 사고력 유형은 <strong>${data.thinkingMain?.thkm || '-'}</strong>, 
            부 사고력 유형은 <strong>${data.thinkingMain?.thks || '-'}</strong>입니다.
            T점수는 <strong>${data.thinkingMain?.tscore || '0'}점</strong>입니다.
          </p>
        </div>
        <div class="card-content">
          <div class="info-box">
            <p>옥타그노시스 검사 결과, ${data.personalInfo.pname}님은 8가지 사고력을 진단한 결과입니다.</p>
          </div>
          
          <div class="thinking-scores">
            <h4>사고력 점수 분포</h4>
            <table class="score-table">
              <tr>
                <th>사고력 영역</th>
                <th>점수</th>
              </tr>
  `;
  
  // 사고력 점수 표시
  if (data.thinkingScore) {
    const scores = [
      { name: '사실형사고력', score: data.thinkingScore.thk1 },
      { name: '추론형사고력', score: data.thinkingScore.thk2 },
      { name: '공감형사고력', score: data.thinkingScore.thk3 },
      { name: '직관형사고력', score: data.thinkingScore.thk4 },
      { name: '창의형사고력', score: data.thinkingScore.thk5 },
      { name: '융합형사고력', score: data.thinkingScore.thk6 },
      { name: '응용형사고력', score: data.thinkingScore.thk7 },
      { name: '종합형사고력', score: data.thinkingScore.thk8 }
    ];
    
    scores.forEach(item => {
      html += `
              <tr>
                <td>${item.name}</td>
                <td>${item.score}%</td>
              </tr>
      `;
    });
  }
  
  html += `
            </table>
          </div>
  `;
  
  // 사고력 상세 분석
  if (data.thinkingDetails && data.thinkingDetails.length > 0) {
    html += `
          <div class="thinking-details">
            <h4>사고력 상세 분석</h4>
    `;
    
    data.thinkingDetails.forEach(item => {
      const scoreClass = 
        item.score >= 80 ? 'score-high' : 
        item.score >= 51 ? 'score-medium' : 
        'score-low';
      
      html += `
            <div class="thinking-detail-item">
              <div class="thinking-detail-header ${scoreClass}">
                <h5>${item.qua_name}</h5>
                <span class="score">${item.score}점</span>
              </div>
              <div class="thinking-detail-content">
                <p>${item.explain}</p>
              </div>
            </div>
      `;
    });
    
    html += `
          </div>
    `;
  }
  
  html += `
        </div>
      </div>
      
      <div class="summary-box">
        <p>${data.personalInfo.pname}님의 8가지 사고력을 진단한 결과입니다.</p>
      </div>
    </div>
  `;
  
  return html;
}

// 성향적합직업학과 섹션 추가
function addSuitableJobSection(data: PdfRequestData['data']): string {
  let html = `
    <div class="tab-container">
      <h2>성향적합직업학과</h2>
  `;
  
  // 적합직업군 정보
  if (data.suitableJobsSummary) {
    html += `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${data.suitableJobsSummary.tendency || ""} 적합직업군</h3>
          <p class="card-description">성향과 적성을 분석하여 도출한 적합 직업</p>
        </div>
        <div class="card-content">
    `;
    
    if (data.suitableJobsDetail && data.suitableJobsDetail.length > 0) {
      data.suitableJobsDetail.forEach((job, index) => {
        html += `
          <div class="job-item">
            <div class="job-title">
              <span class="badge badge-blue">추천 ${index + 1}</span>
              ${job.jo_name}
            </div>
            
            <div class="job-section">
              <div class="job-section-title">직업개요</div>
              <p>${job.jo_outline || '정보가 제공되지 않았습니다.'}</p>
            </div>
            
            <div class="job-section">
              <div class="job-section-title">주요업무</div>
              <p>${job.jo_mainbusiness || '정보가 제공되지 않았습니다.'}</p>
            </div>
          </div>
        `;
      });
    } else {
      html += `<p>적합직업 데이터가 없습니다.</p>`;
    }
    
    html += `
        </div>
      </div>
    `;
  }
  
  // 적합학과군 정보
  if (data.suitableJobsSummary) {
    html += `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${data.suitableJobsSummary.tendency || ""} 적합학과군</h3>
          <p class="card-description">성향과 적성을 분석하여 도출한 적합 학과</p>
        </div>
        <div class="card-content">
    `;
    
    if (data.suitableJobMajors && data.suitableJobMajors.length > 0) {
      data.suitableJobMajors.forEach((item, index) => {
        html += `
          <div class="job-item">
            <div class="job-title">
              <span class="badge badge-green">추천 ${index + 1}</span>
              ${item.jo_name}
            </div>
            <div class="job-section">
              <div class="job-section-title">관련학과</div>
              <p>${item.major || '정보가 제공되지 않았습니다.'}</p>
            </div>
          </div>
        `;
      });
    } else {
      html += `<p>적합학과 데이터가 없습니다.</p>`;
    }
    
    html += `
        </div>
      </div>
    `;
  }
  
  html += `</div>`;
  
  return html;
}

// 선호도 섹션 추가
function addPreferenceSection(data: PdfRequestData['data']): string {
  let html = `
    <div class="tab-container">
      <h2>선호도 분석</h2>
  `;
  
  // 선호반응 비율 차트
  if (data.imagePreference) {
    const preferencePercent = Math.round(data.imagePreference.irate);
    
    html += `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">선호반응 차트</h3>
          <p class="card-description">이미지에 대한 선호 반응 분석</p>
        </div>
        <div class="card-content">
          <div class="chart-container">
            <div class="bar-chart">
              <div class="bar" style="width: ${preferencePercent}%;">${preferencePercent}%</div>
            </div>
          </div>
          
          <div class="preference-stats">
            <div class="preference-stat">
              <div class="preference-stat-value">${data.imagePreference.tcnt}</div>
              <div class="preference-stat-label">전체 이미지 수</div>
            </div>
            <div class="preference-stat">
              <div class="preference-stat-value">${data.imagePreference.cnt}</div>
              <div class="preference-stat-label">선호 반응 이미지 수</div>
            </div>
            <div class="preference-stat">
              <div class="preference-stat-value">${preferencePercent}%</div>
              <div class="preference-stat-label">선호 반응 비율</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // 이미지 선호도 분석 차트
  if (data.preferenceData) {
    html += `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">이미지 선호도 분석 차트</h3>
          <p class="card-description">선호하는 이미지 유형 분석</p>
        </div>
        <div class="card-content">
          <div class="chart-container">
            <!-- 수평 막대 그래프 (선호도 비율) -->
            <div class="bar-chart">
              <div class="bar" style="width: ${data.preferenceData.rrate1}%;">${data.preferenceData.rrate1}%</div>
            </div>
            <div class="bar-label">
              <span>${data.preferenceData.tdname1}</span>
              <span>${data.preferenceData.qcnt1}개</span>
            </div>
            
            <div class="bar-chart">
              <div class="bar" style="width: ${data.preferenceData.rrate2}%;">${data.preferenceData.rrate2}%</div>
            </div>
            <div class="bar-label">
              <span>${data.preferenceData.tdname2}</span>
              <span>${data.preferenceData.qcnt2}개</span>
            </div>
            
            <div class="bar-chart">
              <div class="bar" style="width: ${data.preferenceData.rrate3}%;">${data.preferenceData.rrate3}%</div>
            </div>
            <div class="bar-label">
              <span>${data.preferenceData.tdname3}</span>
              <span>${data.preferenceData.qcnt3}개</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">선호 이미지 상세 분석</h3>
          <p class="card-description">상위 3개 선호 이미지 분석</p>
        </div>
        <div class="card-content">
          <!-- 1순위 -->
          <div class="tendency-item">
            <div class="tendency-name">
              <span class="badge badge-blue">1순위</span>
              ${data.preferenceData.tdname1}
            </div>
            <div class="job-section">
              <div class="job-section-title">응답수: ${data.preferenceData.qcnt1}개 / 선호도: ${data.preferenceData.rrate1}%</div>
              <p>${data.preferenceData.exp1 || '설명이 제공되지 않았습니다.'}</p>
            </div>
          </div>
          
          <!-- 2순위 -->
          <div class="tendency-item">
            <div class="tendency-name">
              <span class="badge badge-blue">2순위</span>
              ${data.preferenceData.tdname2}
            </div>
            <div class="job-section">
              <div class="job-section-title">응답수: ${data.preferenceData.qcnt2}개 / 선호도: ${data.preferenceData.rrate2}%</div>
              <p>${data.preferenceData.exp2 || '설명이 제공되지 않았습니다.'}</p>
            </div>
          </div>
          
          <!-- 3순위 -->
          <div class="tendency-item">
            <div class="tendency-name">
              <span class="badge badge-blue">3순위</span>
              ${data.preferenceData.tdname3}
            </div>
            <div class="job-section">
              <div class="job-section-title">응답수: ${data.preferenceData.qcnt3}개 / 선호도: ${data.preferenceData.rrate3}%</div>
              <p>${data.preferenceData.exp3 || '설명이 제공되지 않았습니다.'}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    html += `
      <div class="card">
        <div class="card-content">
          <p>선호도 데이터가 없습니다.</p>
        </div>
      </div>
    `;
  }
  
  html += `</div>`;
  
  return html;
} 