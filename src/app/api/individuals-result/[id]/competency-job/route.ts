import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

// 역량적합직업학과 데이터 조회 API
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log(`[서버] 역량적합직업학과 API 호출 - ID: ${id}`);

  try {
    // 역량진단 추천 직업 리스트 쿼리
    const jobsQuery = `
      SELECT
        jo.jo_name,
        jo.jo_outline,
        jo.jo_mainbusiness
      FROM
        mwd_resjob rj
        JOIN mwd_job jo ON jo.jo_code = rj.rej_code
      WHERE
        rj.anp_seq = ${id}
        AND rj.rej_kind = 'rtal'
        AND rj.rej_rank <= 7
      ORDER BY
        rj.rej_rank
    `;

    // 추천 직업별 적합 학과 리스트 쿼리
    const jobMajorsQuery = `
      SELECT
        jo.jo_name,
        string_agg(ma.ma_name, ', ' ORDER BY ma.ma_name) AS major
      FROM
        mwd_resjob rj
        JOIN mwd_job jo ON jo.jo_code = rj.rej_code
        JOIN mwd_job_major_map jmm ON jmm.jo_code = rj.rej_code
        JOIN mwd_major ma ON ma.ma_code = jmm.ma_code
      WHERE
        rj.anp_seq = ${id}
        AND rj.rej_kind = 'rtal'
        AND rj.rej_rank <= 7
      GROUP BY
        jo.jo_code,
        rj.rej_rank
      ORDER BY
        rj.rej_rank
    `;

    console.log(`[서버] 역량적합직업학과 쿼리 실행 시작...`);
    
    // 쿼리 실행
    const jobs = await db.$queryRawUnsafe(jobsQuery) as Array<{
      jo_name: string;
      jo_outline: string;
      jo_mainbusiness: string;
    }>;

    const jobMajors = await db.$queryRawUnsafe(jobMajorsQuery) as Array<{
      jo_name: string;
      major: string;
    }>;

    console.log(`[서버] 역량적합직업학과 쿼리 결과:`, { 
      jobsLength: jobs.length,
      jobMajorsLength: jobMajors.length
    });

    // 직업과 학과 정보를 합쳐서 반환
    const combinedData = jobs.map(job => {
      const jobMajor = jobMajors.find(jm => jm.jo_name === job.jo_name);
      return {
        ...job,
        majors: jobMajor?.major || ''
      };
    });

    return NextResponse.json({
      success: true,
      data: combinedData
    });
  } catch (error) {
    console.error('[서버] 역량적합직업학과 API 조회 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '역량적합직업학과 데이터를 불러오는 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 