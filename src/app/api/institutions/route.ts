import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');
  const search = searchParams.get('search') || '';

  try {
    // 검색어가 있는 경우와 없는 경우의 쿼리를 구분
    const whereClause = search
      ? `AND (LOWER(ins.ins_name) LIKE LOWER('%${search}%') OR LOWER(ins.ins_manager1_name) LIKE LOWER('%${search}%'))`
      : '';

    // 총 개수 조회 쿼리
    const countQuery = `
      SELECT COUNT(*) 
      FROM mwd_account ac, mwd_institute ins, mwd_institute_turn tur, 
      (SELECT MAX(tur_seq) tur_seq FROM mwd_institute_turn GROUP BY ins_seq) tmax 
      WHERE ac.pe_seq = -1 
      AND ac.ins_seq = ins.ins_seq 
      AND ins.ins_seq = tur.ins_seq 
      AND tur.tur_seq = tmax.tur_seq
      ${whereClause}
    `;

    type CountResult = { count: bigint };
    const countResult = await db.$queryRaw<CountResult[]>(Prisma.sql([countQuery]));
    const total = Number(countResult[0].count);

    // 기관 목록 조회 쿼리
    const selectQuery = `
      SELECT 
        ac.ac_gid, 
        ac.ac_id, 
        ac.ac_use, 
        ac.ins_seq, 
        CASE WHEN ac.ac_expire_date >= current_date THEN 1 ELSE 0 END AS isexpire, 
        to_char(ac.ac_expire_date, 'YYYY-MM-DD') as ac_expire_date, 
        to_char(ac.ac_insert_date,'YYYY-MM-DD HH24:MI') as ac_insert_date, 
        ins.ins_name, 
        ins.ins_ceo, 
        ins.ins_tel1, 
        ins.ins_manager1_team, 
        ins.ins_manager1_name, 
        ins.ins_manager1_position, 
        tur.tur_seq, 
        tur.tur_count, 
        tur.tur_req_sum, 
        tur.tur_use_sum 
      FROM mwd_account ac, mwd_institute ins, mwd_institute_turn tur, 
      (SELECT MAX(tur_seq) tur_seq FROM mwd_institute_turn GROUP BY ins_seq) tmax 
      WHERE ac.pe_seq = -1 
      AND ac.ins_seq = ins.ins_seq 
      AND ins.ins_seq = tur.ins_seq 
      AND tur.tur_seq = tmax.tur_seq
      ${whereClause}
      ORDER BY ac.ac_insert_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const institutions = await db.$queryRaw(Prisma.sql([selectQuery]));

    return NextResponse.json({
      success: true,
      institutions,
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