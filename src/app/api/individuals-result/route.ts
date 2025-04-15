import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

interface CountResult {
  count: bigint;
}

interface ResultRow {
  ac_id: string;
  ac_gid: string;
  pe_seq: number;
  pe_name: string;
  pe_cellphone: string;
  pe_sex: string;
  anp_seq: number;
  anp_status: string; 
  start_date: Date | null;
  end_date: Date | null;
  cr_seq: number;
  pd_kind: string;
  pd_num: number;
}

// 개인용 검사결과 목록 조회 API
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') || '';
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');
  const startDate = searchParams.get('start_date') || '';
  const endDate = searchParams.get('end_date') || '';

  try {
    // 기본 조건
    const whereConditions = ["ac.pe_seq = pe.pe_seq", "ac.ac_gid = anp.ac_gid", "anp.cr_seq = cr.cr_seq", "cr.pd_num < 10000"];
    const queryParams: (string | number)[] = [];
    
    // 검색어 조건 추가
    if (search) {
      whereConditions.push("(pe.pe_name LIKE ? OR ac.ac_id LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    
    // 날짜 조건 추가
    if (startDate && endDate) {
      whereConditions.push("anp.anp_start_date BETWEEN ? AND ?");
      queryParams.push(startDate, endDate);
    } else if (startDate) {
      whereConditions.push("anp.anp_start_date >= ?");
      queryParams.push(startDate);
    } else if (endDate) {
      whereConditions.push("anp.anp_start_date <= ?");
      queryParams.push(endDate);
    }
    
    // WHERE 절 구성
    const whereClause = `WHERE ${whereConditions.join(" AND ")}`;

    // 총 개수 조회 쿼리
    const countQuery = `
      SELECT COUNT(*) as count
      FROM mwd_account ac, mwd_person pe, mwd_answer_progress anp, mwd_choice_result cr 
      ${whereClause}
    `;

    // 플레이스홀더를 쿼리에 삽입
    let countQueryWithParams = countQuery;
    queryParams.forEach(param => {
      countQueryWithParams = countQueryWithParams.replace('?', typeof param === 'string' ? `'${param}'` : `${param}`);
    });
    
    const countResult = await db.$queryRawUnsafe(countQueryWithParams) as CountResult[];
    const total = Number(countResult[0].count);
    
    // 개인용 검사결과 목록 조회 쿼리
    const selectQuery = `
      SELECT 
        ac.ac_id, 
        ac.ac_gid, 
        pe.pe_seq,
        pe.pe_name, 
        pe.pe_cellphone,
        pe.pe_sex,
        anp.anp_seq, 
        CASE 
          WHEN anp.anp_end_date IS NOT NULL THEN 'done'
          ELSE 'progress' 
        END as anp_status,
        anp.anp_start_date as start_date, 
        anp.anp_end_date as end_date, 
        cr.cr_seq,
        cr.pd_kind,
        cr.pd_num
      FROM 
        mwd_account ac, 
        mwd_person pe, 
        mwd_answer_progress anp, 
        mwd_choice_result cr 
      ${whereClause}
      ORDER BY 
        anp.anp_start_date DESC, 
        anp.anp_seq DESC
      LIMIT ? OFFSET ?
    `;

    // 쿼리 파라미터에 limit과 offset 추가
    const finalParams = [...queryParams, limit, offset];
    
    // 플레이스홀더를 쿼리에 삽입
    let selectQueryWithParams = selectQuery;
    finalParams.forEach(param => {
      selectQueryWithParams = selectQueryWithParams.replace('?', typeof param === 'string' ? `'${param}'` : `${param}`);
    });
    
    // 쿼리 실행
    const rawResults = await db.$queryRawUnsafe(selectQueryWithParams) as ResultRow[];

    // 결과 가공 (날짜 형식화)
    const results = rawResults.map((result: ResultRow) => {
      // 날짜 형식화
      const startDate = result.start_date ? new Date(result.start_date).toISOString() : null;
      const endDate = result.end_date ? new Date(result.end_date).toISOString() : '';
      
      return {
        ...result,
        start_date: startDate,
        end_date: endDate
      };
    });

    return NextResponse.json({
      success: true,
      results,
      total
    });
  } catch (error) {
    console.error('개인용 검사결과 목록 조회 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '개인용 검사결과 목록을 불러오는 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 