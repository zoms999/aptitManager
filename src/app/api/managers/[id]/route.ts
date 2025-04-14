import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';

// 관리자 정보 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 ID입니다.' },
        { status: 400 }
      );
    }
    
    // 매니저 상세정보 조회
    const query = `SELECT * FROM mwd_manager WHERE mg_seq = ${id}`;
    const result = await db.$queryRaw(Prisma.sql([query]));
    
    // 결과가 없는 경우 404 반환
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return NextResponse.json(
        { success: false, message: '존재하지 않는 관리자입니다.' },
        { status: 404 }
      );
    }
    
    // 배열인 경우 첫 번째 항목 반환
    const manager = Array.isArray(result) ? result[0] : result;
    
    return NextResponse.json({
      success: true,
      manager
    });
  } catch (error) {
    console.error('매니저 상세 조회 오류:', error);
    return NextResponse.json(
      { success: false, message: '매니저 정보를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 관리자 정보 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 ID입니다.' },
        { status: 400 }
      );
    }
    
    // 요청 본문 파싱
    const data = await request.json();
    
    // 필수 필드 검증
    const requiredFields = [
      'mg_name', 'mg_email', 'mg_cellphone', 'mg_use', 
      'mg_postcode', 'mg_jibun_addr', 'mg_road_addr', 'mg_detail_addr', 'mg_extra_addr',
      'mg_grant_manager', 'mg_grant_account', 'mg_grant_institute', 
      'mg_grant_result', 'mg_grant_statistic', 'mg_grant_inquiry', 'mg_grant_log'
    ];
    
    for (const field of requiredFields) {
      if (data[field] === undefined) {
        return NextResponse.json(
          { success: false, message: `${field} 필드는 필수입니다.` },
          { status: 400 }
        );
      }
    }
    
    // 비밀번호 변경이 있는 경우에만 비밀번호 업데이트 포함
    const updateFields = requiredFields.filter(field => field !== 'mg_pw')
      .map(field => `${field} = '${data[field]}'`);
    
    if (data.mg_pw) {
      updateFields.push(`mg_pw = '${data.mg_pw}'`);
    }
    
    // 업데이트 쿼리 실행
    const updateQuery = `
      UPDATE mwd_manager 
      SET ${updateFields.join(', ')} 
      WHERE mg_seq = ${id}
      RETURNING *
    `;
    
    const result = await db.$queryRaw(Prisma.sql([updateQuery]));
    
    // 결과가 없는 경우 404 반환
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return NextResponse.json(
        { success: false, message: '존재하지 않는 관리자입니다.' },
        { status: 404 }
      );
    }
    
    // 배열인 경우 첫 번째 항목 반환
    const updatedManager = Array.isArray(result) ? result[0] : result;
    
    return NextResponse.json({
      success: true,
      message: '관리자 정보가 성공적으로 수정되었습니다.',
      manager: updatedManager
    });
  } catch (error) {
    console.error('매니저 정보 수정 오류:', error);
    return NextResponse.json(
      { success: false, message: '매니저 정보를 수정하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 관리자 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 ID입니다.' },
        { status: 400 }
      );
    }
    
    // 삭제 전 존재 여부 확인
    const checkQuery = `SELECT mg_seq FROM mwd_manager WHERE mg_seq = ${id}`;
    const checkResult = await db.$queryRaw(Prisma.sql([checkQuery]));
    
    if (!checkResult || (Array.isArray(checkResult) && checkResult.length === 0)) {
      return NextResponse.json(
        { success: false, message: '존재하지 않는 관리자입니다.' },
        { status: 404 }
      );
    }
    
    // 삭제 쿼리 실행
    const deleteQuery = `DELETE FROM mwd_manager WHERE mg_seq = ${id}`;
    await db.$executeRaw(Prisma.sql([deleteQuery]));
    
    return NextResponse.json({
      success: true,
      message: '관리자가 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('매니저 삭제 오류:', error);
    return NextResponse.json(
      { success: false, message: '매니저를 삭제하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 