import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

// 역량진단 데이터 조회 API
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log(`[서버] 역량진단 API 호출 - ID: ${id}`);

  try {
    // 진단 결과 상위 5개 역량명을 ,로 연결해서 출력
    const talentListQuery = `
      SELECT
        string_agg(qa.qua_name, ', ' ORDER BY sc1.sc1_rank) AS tal
      FROM
        mwd_question_attr qa
        JOIN mwd_score1 sc1 ON sc1.qua_code = qa.qua_code
      WHERE
        sc1.anp_seq = ${id}
        AND sc1.sc1_step = 'tal'
        AND sc1.sc1_rank <= 5
    `;
    console.log(`[서버] 역량진단 ListQuery:`, talentListQuery);

    // 진단 결과 상위 5개 역량별 점수와 설명 출력
    const talentDetailsQuery = `
      SELECT
        qa.qua_name,
        ROUND(sc1.sc1_rate * 100) AS tscore,
        REPLACE(qe.que_explain, '당신', '님') AS explain
      FROM
        mwd_score1 sc1
        JOIN mwd_question_attr qa ON qa.qua_code = sc1.qua_code
        JOIN mwd_question_explain qe ON qe.qua_code = qa.qua_code
      WHERE
        sc1.anp_seq = ${id}
        AND sc1.sc1_step = 'tal'
        AND sc1.sc1_rank <= 5
      ORDER BY
        sc1.sc1_rank
    `;

    console.log(`[서버] 역량진단 쿼리 실행 시작...`);
    // 쿼리 실행
    const talentList = await db.$queryRawUnsafe(talentListQuery) as { tal: string }[];
    const talentDetails = await db.$queryRawUnsafe(talentDetailsQuery) as Array<{
      qua_name: string;
      tscore: number;
      explain: string;
    }>;

    console.log(`[서버] 역량진단 쿼리 결과:`, { 
      talentListLength: talentList.length,
      talentDetailsLength: talentDetails.length
    });

    return NextResponse.json({
      success: true,
      data: {
        talentList: talentList[0]?.tal || '',
        talentDetails
      }
    });
  } catch (error) {
    console.error('[서버] 역량진단 API 조회 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '역량진단 데이터를 불러오는 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 