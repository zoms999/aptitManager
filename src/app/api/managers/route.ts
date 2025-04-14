import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    // URL 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || '';

    // 검색 조건 SQL 생성
    let whereCondition = '';
    if (search) {
      whereCondition = `WHERE mg_name LIKE '%${search}%' OR mg_email LIKE '%${search}%'`;
    }

    // 전체 개수 조회
    const totalCountQuery = `SELECT COUNT(*) as count FROM mwd_manager ${whereCondition}`;
    const totalCount = await db.$queryRaw<[{ count: bigint }]>(
      Prisma.sql([totalCountQuery])
    );

    // 매니저 목록 조회
    const managersQuery = `
      SELECT 
        mg_seq, mg_email, mg_name, mg_cellphone, mg_use, 
        mg_grant_manager, mg_grant_account, mg_grant_institute, 
        mg_grant_result, mg_grant_statistic, mg_grant_inquiry, mg_grant_log 
      FROM mwd_manager 
      ${whereCondition}
      ORDER BY mg_name asc 
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const managers = await db.$queryRaw(
      Prisma.sql([managersQuery])
    );

    return NextResponse.json({
      success: true,
      managers,
      total: Number(totalCount[0].count)
    });
  } catch (error) {
    console.error('매니저 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, message: '매니저 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 