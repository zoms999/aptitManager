import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';

// 기관 목록 조회 API
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') || '';
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    // 검색어가 있는 경우와 없는 경우의 쿼리를 구분
    const whereClause = search
      ? `WHERE ins.ins_name LIKE '%${search}%'`
      : '';

    // 기관 총 개수 조회 쿼리
    const countQuery = `
      SELECT COUNT(*) 
      FROM mwd_institute ins
      ${whereClause}
    `;

    type CountResult = { count: bigint };
    const countResult = await db.$queryRaw<CountResult[]>(Prisma.sql([countQuery]));
    const total = Number(countResult[0].count);

    // 기관 목록 조회 쿼리 (최근 검사 회차 정보 포함)
    const selectQuery = `
      SELECT 
        ins.ins_seq, 
        ins.ins_name, 
        ins.ins_license_num,
        ins.ins_ceo, 
        ins.ins_manager1_name, 
        ins.ins_manager1_team,
        ins.ins_manager1_cellphone,
        COALESCE(max_turn.tur_seq, 0) as tur_seq
      FROM 
        mwd_institute ins
      LEFT JOIN (
        SELECT 
          it.ins_seq, 
          MAX(it.tur_seq) as tur_seq
        FROM 
          mwd_institute_turn it
        GROUP BY 
          it.ins_seq
      ) max_turn ON ins.ins_seq = max_turn.ins_seq
      ${whereClause}
      ORDER BY ins.ins_name ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const institutes = await db.$queryRaw(Prisma.sql([selectQuery]));

    return NextResponse.json({
      success: true,
      institutes,
      total
    });
  } catch (error) {
    console.error('기관 목록 조회 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '기관 목록을 불러오는 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}