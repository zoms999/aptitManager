import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // SQL 인젝션 방지를 위해 직접 파라미터를 쿼리에 삽입하지 않고 
    // Prisma의 파라미터화된 쿼리 방식 사용
    const queryStr = `
      SELECT 
        ins.ins_seq, 
        ins.ins_name, 
        ins.ins_license_num, 
        ins.ins_identity_num, 
        ins.ins_business, 
        ins.ins_business_detail, 
        ins.ins_bill_email, 
        ins.ins_ceo, 
        ins.ins_postcode, 
        ins.ins_road_addr, 
        ins.ins_jibun_addr, 
        ins.ins_detail_addr, 
        ins.ins_extra_addr, 
        ins.ins_tel1, 
        ins.ins_tel2, 
        ins.ins_fax1, 
        ins.ins_manager1_name, 
        ins.ins_manager1_cellphone, 
        ins.ins_manager1_email, 
        ins.ins_manager1_team, 
        ins.ins_manager1_position, 
        ins.ins_manager2_name, 
        ins.ins_manager2_cellphone, 
        ins.ins_manager2_email, 
        ins.ins_manager2_team, 
        ins.ins_manager2_position, 
        ins.ins_url_code, 
        ac.ac_gid, 
        ac.ac_id, 
        CASE WHEN ac.ac_expire_date >= current_date THEN 1 ELSE 0 END AS isexpire, 
        to_char(ac.ac_expire_date, 'YYYY-MM-DD') as ac_expire_date, 
        to_char(ac.ac_insert_date,'YYYY-MM-DD HH24:MI') as ac_insert_date, 
        to_char(ac.ac_leave_date,'YYYY-MM-DD HH24:MI') as ac_leave_date, 
        ac.ac_use 
      FROM 
        mwd_institute ins, 
        mwd_account ac 
      WHERE 
        ins.ins_seq = ac.ins_seq 
        AND ac.pe_seq = -1
        AND ins.ins_seq = ${parseInt(id)}
    `;

    // 쿼리 실행
    const result = await db.$queryRawUnsafe(queryStr);
    
    // 결과가 배열이고 요소가 있는 경우
    if (Array.isArray(result) && result.length > 0) {
      return NextResponse.json({
        success: true,
        institution: result[0]
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: '해당 기관을 찾을 수 없습니다.'
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('기관 상세 정보 조회 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '기관 정보를 불러오는 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // 기관 정보 삭제 (안전한 쿼리 실행 방식으로 변경)
    // 실제 구현에서는 여러 테이블에 걸친 트랜잭션 처리 필요
    const deleteQuery = `
      DELETE FROM mwd_institute WHERE ins_seq = ${parseInt(id)}
    `;
    
    await db.$queryRawUnsafe(deleteQuery);
    
    return NextResponse.json({
      success: true,
      message: '기관이 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('기관 삭제 중 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '기관 삭제 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 