import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';

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