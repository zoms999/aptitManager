// 클라이언트 사이드 import와 서버 사이드 import 분리
// 클라이언트에서는 db를 import하지 않음
// import { db } from "../db/prisma";

export interface LoginResponse {
  success: boolean;
  message: string;
  manager?: {
    mg_seq: number;
    mg_name: string;
    mg_grant_manager: number;
    mg_grant_account: number;
    mg_grant_institute: number;
    mg_grant_result: number;
    mg_grant_statistic: number;
    mg_grant_inquiry: number;
    mg_grant_log: number;
  };
}

// 클라이언트 사이드에서 호출되는 로그인 함수
export async function loginManager(email: string, password: string): Promise<LoginResponse> {
  try {
    console.log('로그인 시도:', email);
    
    // 하드코딩된 개발용 계정 (API 호출 전에 체크)
    if (email === 'hongsamcool@gmail.com' && password === 'winker') {
      console.log('클라이언트에서 개발용 계정 인식');
      return {
        success: true,
        message: '로그인 성공 (개발용 계정)',
        manager: {
          mg_seq: 2,
          mg_name: '홍길동',
          mg_grant_manager: 1,
          mg_grant_account: 1,
          mg_grant_institute: 1,
          mg_grant_result: 1,
          mg_grant_statistic: 1,
          mg_grant_inquiry: 1,
          mg_grant_log: 1
        }
      };
    }
    
    // 서버에 로그인 요청
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('API 응답 상태:', response.status);
    
    // 서버 응답 처리
    const data = await response.json();
    console.log('API 응답 데이터:', data.success, data.message);
    
    return data;
  } catch (error) {
    console.error('로그인 에러:', error);
    
    // 네트워크 오류 등의 경우 백업 로그인 (개발용)
    if (email === 'hongsamcool@gmail.com' && password === 'winker') {
      return {
        success: true,
        message: '로그인 성공 (개발용 계정, 오류 복구)',
        manager: {
          mg_seq: 2,
          mg_name: '홍길동',
          mg_grant_manager: 1,
          mg_grant_account: 1,
          mg_grant_institute: 1,
          mg_grant_result: 1,
          mg_grant_statistic: 1,
          mg_grant_inquiry: 1,
          mg_grant_log: 1
        }
      };
    }
    
    return {
      success: false,
      message: '로그인 처리 중 오류가 발생했습니다. 시스템 관리자에게 문의하세요.'
    };
  }
} 