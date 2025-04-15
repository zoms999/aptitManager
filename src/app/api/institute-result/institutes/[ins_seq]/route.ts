import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';

// 특정 기관 정보 조회 API
export async function GET(
  request: NextRequest,
  { params }: { params: { ins_seq: string } }
) {
  const insSeq = params.ins_seq;

  if (!insSeq) {
    return NextResponse.json(
      { success: false, message: '기관 번호가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    // 기관 정보 조회 쿼리
    const selectQuery = `
      SELECT 
        ins_seq,
        ins_name,
        ins_license_num,
        ins_ceo,
        ins_manager1_name,
        ins_manager1_team,
        ins_manager1_cellphone
      FROM 
        mwd_institute
      WHERE 
        ins_seq = ${insSeq}
    `;

    const [institute] = await db.$queryRaw(Prisma.sql([selectQuery]));

    if (!institute) {
      return NextResponse.json(
        { success: false, message: '해당 기관 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      institute
    });
  } catch (error) {
    console.error('기관 정보 조회 오류:', error);
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