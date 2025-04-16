import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/prisma';

interface PreferenceData {
  tdname1: string;
  qcnt1: number;
  rrate1: number;
  tdname2: string;
  qcnt2: number;
  rrate2: number;
  tdname3: string;
  qcnt3: number;
  rrate3: number;
  exp1: string;
  exp2: string;
  exp3: string;
}

interface PreferenceJob {
  qua_name: string;
  jo_name: string;
  jo_outline: string;
  jo_mainbusiness: string;
  majors: string;
}

// 개인용 검사결과 선호도 데이터 조회 API
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    // 선호도 이미지 상위 3개 정보 조회
    const preferenceDataQuery = `
      SELECT 
        max(CASE WHEN rk2 = 1 THEN qua_name END) AS tdname1,
        max(CASE WHEN rk2 = 1 THEN sc1_qcnt END) AS qcnt1,
        max(CASE WHEN rk2 = 1 THEN rrate END) AS rrate1,
        max(CASE WHEN rk2 = 2 THEN qua_name END) AS tdname2,
        max(CASE WHEN rk2 = 2 THEN sc1_qcnt END) AS qcnt2,
        max(CASE WHEN rk2 = 2 THEN rrate END) AS rrate2,
        max(CASE WHEN rk2 = 3 THEN qua_name END) AS tdname3,
        max(CASE WHEN rk2 = 3 THEN sc1_qcnt END) AS qcnt3,
        max(CASE WHEN rk2 = 3 THEN rrate END) AS rrate3,
        max(CASE WHEN rk2 = 1 THEN que_explain END) AS exp1,
        max(CASE WHEN rk2 = 2 THEN que_explain END) AS exp2,
        max(CASE WHEN rk2 = 3 THEN que_explain END) AS exp3
      FROM (
        SELECT 
          qa.qua_name,
          sc1.sc1_qcnt,
          round(sc1.sc1_resrate * 100) AS rrate,
          row_number() OVER(PARTITION BY sc1.sc1_rank) AS rk,
          sc1.sc1_rank AS rk2,
          qe.que_explain
        FROM 
          mwd_score1 sc1,
          mwd_question_attr qa,
          mwd_question_explain qe
        WHERE 
          sc1.anp_seq = ${id}
          AND sc1.sc1_step = 'img'
          AND qa.qua_code = sc1.qua_code
          AND sc1.sc1_rank <= 3
          AND qe.qua_code = qa.qua_code
          AND qe.que_switch = 1
        ORDER BY 
          sc1.sc1_rank
      ) t
      WHERE rk = 1
    `;
    
    // 1순위 이미지 선호도에 따른 직업/학과 조회
    const preferenceJobs1Query = `
      SELECT 
        qa.qua_name,
        jo.jo_name,
        jo.jo_outline,
        jo.jo_mainbusiness,
        string_agg(ma.ma_name, ', ' ORDER BY ma.ma_name) AS majors
      FROM 
        mwd_job jo,
        mwd_job_major_map jmm,
        mwd_major ma,
        mwd_resjob rj
      LEFT OUTER JOIN 
        mwd_question_attr qa ON qa.qua_code = rj.rej_quacode
      WHERE 
        rj.anp_seq = ${id}
        AND rj.rej_kind = 'rimg1'
        AND rj.rej_rank <= 5
        AND jo.jo_code = rj.rej_code
        AND jmm.jo_code = jo.jo_code
        AND ma.ma_code = jmm.ma_code
      GROUP BY 
        rj.rej_kind,
        qa.qua_code,
        jo.jo_code,
        rj.rej_rank
      ORDER BY 
        rj.rej_rank
    `;
    
    // 2순위 이미지 선호도에 따른 직업/학과 조회
    const preferenceJobs2Query = `
      SELECT 
        qa.qua_name,
        jo.jo_name,
        jo.jo_outline,
        jo.jo_mainbusiness,
        string_agg(ma.ma_name, ', ' ORDER BY ma.ma_name) AS majors
      FROM 
        mwd_job jo,
        mwd_job_major_map jmm,
        mwd_major ma,
        mwd_resjob rj
      LEFT OUTER JOIN 
        mwd_question_attr qa ON qa.qua_code = rj.rej_quacode
      WHERE 
        rj.anp_seq = ${id}
        AND rj.rej_kind = 'rimg2'
        AND rj.rej_rank <= 5
        AND jo.jo_code = rj.rej_code
        AND jmm.jo_code = jo.jo_code
        AND ma.ma_code = jmm.ma_code
      GROUP BY 
        rj.rej_kind,
        qa.qua_code,
        jo.jo_code,
        rj.rej_rank
      ORDER BY 
        rj.rej_rank
    `;
    
    // 3순위 이미지 선호도에 따른 직업/학과 조회
    const preferenceJobs3Query = `
      SELECT 
        qa.qua_name,
        jo.jo_name,
        jo.jo_outline,
        jo.jo_mainbusiness,
        string_agg(ma.ma_name, ', ' ORDER BY ma.ma_name) AS majors
      FROM 
        mwd_job jo,
        mwd_job_major_map jmm,
        mwd_major ma,
        mwd_resjob rj
      LEFT OUTER JOIN 
        mwd_question_attr qa ON qa.qua_code = rj.rej_quacode
      WHERE 
        rj.anp_seq = ${id}
        AND rj.rej_kind = 'rimg3'
        AND rj.rej_rank <= 5
        AND jo.jo_code = rj.rej_code
        AND jmm.jo_code = jo.jo_code
        AND ma.ma_code = jmm.ma_code
      GROUP BY 
        rj.rej_kind,
        qa.qua_code,
        jo.jo_code,
        rj.rej_rank
      ORDER BY 
        rj.rej_rank
    `;
    
    // 쿼리 실행
    const preferenceData = await db.$queryRawUnsafe(preferenceDataQuery) as PreferenceData[];
    const preferenceJobs1 = await db.$queryRawUnsafe(preferenceJobs1Query) as PreferenceJob[];
    const preferenceJobs2 = await db.$queryRawUnsafe(preferenceJobs2Query) as PreferenceJob[];
    const preferenceJobs3 = await db.$queryRawUnsafe(preferenceJobs3Query) as PreferenceJob[];
    
    return NextResponse.json({
      success: true,
      data: {
        preferenceData: preferenceData[0] || null,
        preferenceJobs1,
        preferenceJobs2,
        preferenceJobs3
      }
    });
  } catch (error) {
    console.error('선호도 데이터 조회 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '선호도 데이터를 불러오는 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 