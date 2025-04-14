import Link from "next/link";
import { UserRound, Building, FileCheck, Users, Clock, Calendar } from "lucide-react";
import { db } from "@/lib/db/prisma";

// 사용자 정의 타입
interface User {
  id: string;
  name: string;
  timestamp: string;
  org?: string;
}

// 쿼리 결과 타입
interface QueryResult {
  count: number;
}

export default async function DashboardPage() {
  // 총 사용자 수 조회
  const totalAccounts = await db.$queryRaw<QueryResult[]>`SELECT COUNT(*) FROM mwd_account WHERE ac_use = 'Y'`;
  const userCount = totalAccounts[0].count;
  
  // 기관 수 조회
  const totalInstitutes = await db.$queryRaw<QueryResult[]>`SELECT COUNT(*) FROM mwd_institute`;
  const instituteCount = totalInstitutes[0].count;
  
  // 검사 완료 수 조회
  const totalCompleted = await db.$queryRaw<QueryResult[]>`SELECT COUNT(*) FROM mwd_answer_progress WHERE anp_done = 'E'`;
  const completedCount = totalCompleted[0].count;
  
  // 매니저 수 조회
  const totalManagers = await db.$queryRaw<QueryResult[]>`SELECT COUNT(*) FROM mwd_manager WHERE mg_use = 'Y'`;
  const managerCount = totalManagers[0].count;
  
  // 최근 등록 (개인) 조회
  const recentPersonalAccounts = await db.$queryRaw<User[]>`
    SELECT ac.ac_id as id, pe.pe_name as name, TO_CHAR(ac.ac_insert_date, 'YYYY-MM-DD HH24:MI:SS') as timestamp 
    FROM mwd_account ac, mwd_person pe 
    WHERE ac.pe_seq = pe.pe_seq 
    ORDER BY ac.ac_insert_date DESC 
    LIMIT 4
  `;
  
  // 최근 등록 (기관) 조회
  const recentInstituteAccounts = await db.$queryRaw<User[]>`
    SELECT ac.ac_id as id, ins.ins_name as name, TO_CHAR(ac.ac_insert_date, 'YYYY-MM-DD HH24:MI:SS') as timestamp 
    FROM mwd_account ac, mwd_institute ins 
    WHERE ac.ins_seq = ins.ins_seq 
    ORDER BY ac.ac_insert_date DESC 
    LIMIT 4
  `;
  
  // 검사 완료 (개인) 조회
  const completedPersonalTests = await db.$queryRaw<User[]>`
    SELECT ac.ac_id as id, pe.pe_name as name, to_char(anp.anp_end_date, 'YYYY-MM-DD HH24:MI:SS') as timestamp
    FROM mwd_account ac, mwd_person pe, mwd_answer_progress anp, mwd_choice_result cr 
    WHERE ac.pe_seq = pe.pe_seq 
    AND ac.ac_gid = anp.ac_gid 
    AND anp.anp_done = 'E' 
    AND anp.cr_seq = cr.cr_seq 
    AND cr.pd_num < 10000 
    ORDER BY anp.anp_end_date DESC 
    LIMIT 4
  `;
  
  // 검사 완료 (팀별) 조회
  const completedTeamTests = await db.$queryRaw<User[]>`
    SELECT ac.ac_id as id, pe.pe_name as name, ins.ins_name as org, to_char(anp.anp_end_date, 'YYYY-MM-DD HH24:MI:SS') as timestamp
    FROM mwd_account ac, mwd_person pe, mwd_answer_progress anp, mwd_choice_result cr, mwd_institute ins 
    WHERE ac.pe_seq = pe.pe_seq 
    AND ac.ac_gid = anp.ac_gid 
    AND ac.ins_seq = ins.ins_seq
    AND anp.anp_done = 'E' 
    AND anp.cr_seq = cr.cr_seq 
    AND cr.pd_num > 10000 
    ORDER BY anp.anp_end_date DESC 
    LIMIT 4
  `;

  return (
    <div className="container mx-auto py-8 px-6 max-w-full space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-800 p-3 rounded-lg">
          <Clock className="h-6 w-6 text-blue-100" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">대시보드</h1>
          <p className="text-gray-500 mt-1">서비스 현황 및 통계 요약</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="총 사용자"
          value={userCount.toLocaleString()}
          icon={<UserRound className="h-6 w-6" />}
          href="/individuals"
          color="bg-blue-800"
          textColor="text-blue-50"
        />
        <DashboardCard 
          title="기관 수"
          value={instituteCount.toLocaleString()}
          icon={<Building className="h-6 w-6" />}
          href="/institutions"
          color="bg-blue-800"
          textColor="text-blue-50"
        />
        <DashboardCard 
          title="검사 완료"
          value={completedCount.toLocaleString()}
          icon={<FileCheck className="h-6 w-6" />}
          href="/results"
          color="bg-blue-800"
          textColor="text-blue-50"
        />
        <DashboardCard 
          title="매니저"
          value={managerCount.toLocaleString()}
          icon={<Users className="h-6 w-6" />}
          href="/managers"
          color="bg-blue-800"
          textColor="text-blue-50"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ListCard title="최근 등록 (개인)" icon={<UserRound className="h-5 w-5" />} items={recentPersonalAccounts} />
        <ListCard title="최근 등록 (기관)" icon={<Building className="h-5 w-5" />} items={recentInstituteAccounts} />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ListCard title="검사 완료 (개인)" icon={<FileCheck className="h-5 w-5" />} items={completedPersonalTests} />
        <ListCard title="검사 완료 (팀별)" icon={<Users className="h-5 w-5" />} items={completedTeamTests} />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
  href,
  color,
  textColor,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  textColor: string;
}) {
  return (
    <Link 
      href={href}
      className="rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className={`${color} rounded-full w-12 h-12 flex items-center justify-center ${textColor}`}>
          {icon}
        </div>
        <div className="flex flex-col items-end text-right">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
      </div>
    </Link>
  );
}

function ListCard({ title, icon, items }: { title: string; icon: React.ReactNode; items: User[] }) {
  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4 text-blue-50">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium">{title}</h3>
        </div>
      </div>
      <div className="divide-y">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-blue-50 transition-colors">
            <div>
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-500">{item.id}</p>
              {item.org && <p className="text-xs text-gray-500 mt-1">{item.org}</p>}
            </div>
            <div className="flex items-center text-gray-500 gap-2">
              <Calendar className="h-4 w-4" />
              <p className="text-xs whitespace-nowrap">{item.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 