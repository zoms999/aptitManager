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
      ? `AND (LOWER(pe.pe_name) LIKE LOWER('%${search}%') OR LOWER(ac.ac_id) LIKE LOWER('%${search}%'))`
      : '';

    // 총 개수 조회 쿼리
    const countQuery = `
      SELECT COUNT(*) 
      FROM mwd_person pe, mwd_account ac 
      WHERE ac.pe_seq = pe.pe_seq 
      ${whereClause}
    `;

    type CountResult = { count: bigint };
    const countResult = await db.$queryRaw<CountResult[]>(Prisma.sql([countQuery]));
    const total = Number(countResult[0].count);

    // 개인 목록 조회 쿼리
    const selectQuery = `
      SELECT 
        ac.ac_gid, 
        ac.ac_id, 
        ac.ac_use,
        CASE WHEN ac.ac_expire_date <= NOW() THEN 0 ELSE 1 END AS isexpire, 
        TO_CHAR(ac.ac_expire_date,'YYYY-MM-DD') as ac_expire_date, 
        TO_CHAR(ac.ac_insert_date,'YYYY-MM-DD HH24:MI') as ac_insert_date, 
        pe.pe_seq, 
        pe.pe_name, 
        pe.pe_sex, 
        pe.pe_cellphone,
        pe.pe_email,
        pe.pe_ur_education,
        pe.pe_ur_job
      FROM mwd_person pe, mwd_account ac
      LEFT OUTER JOIN (
        SELECT ac_gid, anp_done 
        FROM (
          SELECT ac_gid, anp_seq, anp_done, ROW_NUMBER() OVER(PARTITION BY ac_gid ORDER BY anp_seq desc) AS prank 
          FROM mwd_answer_progress
        ) pro 
        WHERE prank = 1
      ) pro ON ac.ac_gid = pro.ac_gid 
      WHERE ac.pe_seq = pe.pe_seq
      ${whereClause}
      ORDER BY ac_insert_date desc 
      LIMIT ${limit} OFFSET ${offset}
    `;

    const individuals = await db.$queryRaw(Prisma.sql([selectQuery]));

    return NextResponse.json({
      success: true,
      individuals,
      total
    });
  } catch (error) {
    console.error('개인 목록 조회 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '개인 목록을 불러오는 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 