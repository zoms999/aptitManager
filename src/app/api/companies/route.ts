import { NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

// 회사 정보 인터페이스 정의
interface CompanyData {
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

export async function GET() {
  try {
    // 기업 정보 조회 쿼리 실행
    const companyData = await db.$queryRaw<CompanyData[]>`
      select 
        co_name, 
        co_tel1, 
        co_tel2, 
        co_fax1, 
        co_bill_email, 
        co_to_email, 
        co_postcode, 
        co_road_addr, 
        co_jibun_addr, 
        co_detail_addr, 
        co_extra_addr, 
        co_license_num, 
        co_identity_num, 
        co_online_num, 
        co_ceo 
      from mwd_company
    `;

    // 결과가 배열이지만 하나의 회사 정보만 필요하므로 첫 번째 항목 사용
    const company = companyData[0] || null;

    return NextResponse.json(
      { success: true, company },
      { status: 200 }
    );
  } catch (error) {
    console.error('기업 정보 조회 중 오류 발생:', error);
    
    return NextResponse.json(
      { success: false, message: '기업 정보를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // 요청 본문에서 기업 정보 가져오기
    const companyData: CompanyData = await request.json();

    // 기업 정보 유효성 검사 (간단한 예시)
    if (!companyData.co_name || !companyData.co_ceo) {
      return NextResponse.json(
        { success: false, message: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 기업 정보 업데이트 쿼리 실행
    // 여기서는 mwd_company 테이블이 항상 한 행만 가지고 있다고 가정합니다.
    await db.$executeRaw`
      UPDATE mwd_company SET
        co_name = ${companyData.co_name},
        co_tel1 = ${companyData.co_tel1},
        co_tel2 = ${companyData.co_tel2},
        co_fax1 = ${companyData.co_fax1},
        co_bill_email = ${companyData.co_bill_email},
        co_to_email = ${companyData.co_to_email},
        co_postcode = ${companyData.co_postcode},
        co_road_addr = ${companyData.co_road_addr},
        co_jibun_addr = ${companyData.co_jibun_addr},
        co_detail_addr = ${companyData.co_detail_addr},
        co_extra_addr = ${companyData.co_extra_addr},
        co_license_num = ${companyData.co_license_num},
        co_identity_num = ${companyData.co_identity_num},
        co_online_num = ${companyData.co_online_num},
        co_ceo = ${companyData.co_ceo}
    `;

    return NextResponse.json(
      { success: true, message: '기업 정보가 수정되었습니다.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('기업 정보 수정 중 오류 발생:', error);
    
    return NextResponse.json(
      { success: false, message: '기업 정보를 수정하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 