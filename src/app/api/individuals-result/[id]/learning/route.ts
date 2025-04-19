import { NextResponse } from 'next/server';
import pg from 'pg';

// PostgreSQL 클라이언트 설정
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // 학습 스타일 정보 가져오기
    const styleQuery = `
      SELECT 
          -- rv_tnd1 성향 이름
          (SELECT REPLACE(qa.qua_name, '형', '')
          FROM mwd_question_attr qa
          WHERE qa.qua_code = rv.rv_tnd1) AS tnd1,

          -- rv_tnd1 성향 설명
          REPLACE(ts1.tes_study_tendency, '당신', '님') AS tnd1_study,
          REPLACE(ts1.tes_study_way, '당신', '님') AS tnd1_way,

          -- rv_tnd2 성향 이름
          (SELECT REPLACE(qa.qua_name, '형', '')
          FROM mwd_question_attr qa
          WHERE qa.qua_code = rv.rv_tnd2) AS tnd2,

          -- rv_tnd2 성향 설명
          REPLACE(ts2.tes_study_tendency, '당신', '님') AS tnd2_study,
          REPLACE(ts2.tes_study_way, '당신', '님') AS tnd2_way,

          -- 성향별 row, col 좌표 값
          CAST(SUBSTRING(rv.rv_tnd1, 4, 2) AS INT) - 10 AS tndrow,
          CAST(SUBSTRING(rv.rv_tnd2, 4, 2) AS INT) - 10 AS tndcol

      FROM mwd_resval rv
      JOIN mwd_tendency_study ts1 ON ts1.qua_code = rv.rv_tnd1
      JOIN mwd_tendency_study ts2 ON ts2.qua_code = rv.rv_tnd2
      WHERE rv.anp_seq = $1
    `;
    
    // 성향1 학습 스타일 차트 데이터
    const style1ChartQuery = `
      SELECT 
          sr.sw_kindname AS sname,
          CAST(sr.sw_rate * 100 AS INT) AS srate,
          CASE
            WHEN sr.sw_color LIKE '#%' THEN sr.sw_color
            ELSE REPLACE(REPLACE(sr.sw_color, 'rgb(', 'rgba('), ')', ', 0.8)')
          END AS scolor
      FROM mwd_resval rv
      JOIN mwd_studyway_rate sr ON sr.qua_code = rv.rv_tnd1
      WHERE rv.anp_seq = $1
      AND sr.sw_type = 'S'
      ORDER BY sr.sw_kind
    `;
    
    // 성향2 학습 스타일 차트 데이터
    const style2ChartQuery = `
      SELECT 
          sr.sw_kindname AS sname,
          CAST(sr.sw_rate * 100 AS INT) AS srate,
          CASE
            WHEN sr.sw_color LIKE '#%' THEN sr.sw_color
            ELSE REPLACE(REPLACE(sr.sw_color, 'rgb(', 'rgba('), ')', ', 0.8)')
          END AS scolor
      FROM mwd_resval rv
      JOIN mwd_studyway_rate sr ON sr.qua_code = rv.rv_tnd2
      WHERE rv.anp_seq = $1
      AND sr.sw_type = 'S'
      ORDER BY sr.sw_kind
    `;
    
    // 성향1 학습법 차트 데이터
    const method1ChartQuery = `
      SELECT 
          sr.sw_kindname AS sname,
          CAST(sr.sw_rate * 100 AS INT) AS srate,
          CASE
            WHEN sr.sw_color LIKE '#%' THEN sr.sw_color
            ELSE REPLACE(REPLACE(sr.sw_color, 'rgb(', 'rgba('), ')', ', 0.8)')
          END AS scolor
      FROM mwd_resval rv
      JOIN mwd_studyway_rate sr ON sr.qua_code = rv.rv_tnd1
      WHERE rv.anp_seq = $1
      AND sr.sw_type = 'W'
      ORDER BY sr.sw_kind
    `;
    
    // 성향2 학습법 차트 데이터
    const method2ChartQuery = `
      SELECT 
          sr.sw_kindname AS sname,
          CAST(sr.sw_rate * 100 AS INT) AS srate,
          CASE
            WHEN sr.sw_color LIKE '#%' THEN sr.sw_color
            ELSE REPLACE(REPLACE(sr.sw_color, 'rgb(', 'rgba('), ')', ', 0.8)')
          END AS scolor
      FROM mwd_resval rv
      JOIN mwd_studyway_rate sr ON sr.qua_code = rv.rv_tnd2
      WHERE rv.anp_seq = $1
      AND sr.sw_type = 'W'
      ORDER BY sr.sw_kind
    `;
    
    // 병렬로 쿼리 실행
    const [styleResult, style1ChartResult, style2ChartResult, method1ChartResult, method2ChartResult] = await Promise.all([
      pool.query(styleQuery, [id]),
      pool.query(style1ChartQuery, [id]),
      pool.query(style2ChartQuery, [id]),
      pool.query(method1ChartQuery, [id]),
      pool.query(method2ChartQuery, [id])
    ]);
    
    // 결과 객체 생성
    const learningData = {
      style: styleResult.rows[0],
      style1Chart: style1ChartResult.rows,
      style2Chart: style2ChartResult.rows,
      method1Chart: method1ChartResult.rows,
      method2Chart: method2ChartResult.rows
    };
    
    return NextResponse.json({ 
      success: true, 
      data: learningData 
    });
  } catch (error) {
    console.error('학습 데이터 조회 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, error: '학습 데이터를 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
} 