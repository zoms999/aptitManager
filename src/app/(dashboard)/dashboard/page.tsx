import Link from "next/link";
import { UserRound, Building, FileCheck, Users } from "lucide-react";
import { db } from "@/lib/db/prisma";

// 사용자 정의 타입
interface User {
  id: string;
  name: string;
  timestamp: string;
  org?: string;
}

export default async function DashboardPage() {
  // 총 사용자 수 조회
  const totalAccounts = await db.$queryRaw`SELECT COUNT(*) FROM mwd_account WHERE ac_use = 'Y'`;
  const userCount = totalAccounts[0].count;
  
  // 기관 수 조회
  const totalInstitutes = await db.$queryRaw`SELECT COUNT(*) FROM mwd_institute`;
  const instituteCount = totalInstitutes[0].count;
  
  // 검사 완료 수 조회
  const totalCompleted = await db.$queryRaw`SELECT COUNT(*) FROM mwd_answer_progress WHERE anp_done = 'E'`;
  const completedCount = totalCompleted[0].count;
  
  // 매니저 수 조회
  const totalManagers = await db.$queryRaw`SELECT COUNT(*) FROM mwd_manager WHERE mg_use = 'Y'`;
  const managerCount = totalManagers[0].count;
  
  // 최근 등록 (개인) 조회
  const recentPersonalAccounts = await db.$queryRaw`
    SELECT ac.ac_id as id, pe.pe_name as name, TO_CHAR(ac.ac_insert_date, 'YYYY-MM-DD HH24:MI:SS') as timestamp 
    FROM mwd_account ac, mwd_person pe 
    WHERE ac.pe_seq = pe.pe_seq 
    ORDER BY ac.ac_insert_date DESC 
    LIMIT 4
  `;
  
  // 최근 등록 (기관) 조회
  const recentInstituteAccounts = await db.$queryRaw`
    SELECT ac.ac_id as id, ins.ins_name as name, TO_CHAR(ac.ac_insert_date, 'YYYY-MM-DD HH24:MI:SS') as timestamp 
    FROM mwd_account ac, mwd_institute ins 
    WHERE ac.ins_seq = ins.ins_seq 
    ORDER BY ac.ac_insert_date DESC 
    LIMIT 4
  `;
  
  // 검사 완료 (개인) 조회
  const completedPersonalTests = await db.$queryRaw`
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
  const completedTeamTests = await db.$queryRaw`
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
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">대시보드</h1>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="총 사용자"
          value={userCount.toLocaleString()}
          icon={<UserRound className="h-7 w-7" />}
          href="/accounts"
          color="bg-blue-50 dark:bg-blue-950"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <DashboardCard 
          title="기관 수"
          value={instituteCount.toLocaleString()}
          icon={<Building className="h-7 w-7" />}
          href="/companies"
          color="bg-green-50 dark:bg-green-950"
          iconColor="text-green-600 dark:text-green-400"
        />
        <DashboardCard 
          title="검사 완료"
          value={completedCount.toLocaleString()}
          icon={<FileCheck className="h-7 w-7" />}
          href="/results"
          color="bg-purple-50 dark:bg-purple-950"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <DashboardCard 
          title="매니저"
          value={managerCount.toLocaleString()}
          icon={<Users className="h-7 w-7" />}
          href="/managers"
          color="bg-orange-50 dark:bg-orange-950"
          iconColor="text-orange-600 dark:text-orange-400"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ListCard title="최근 등록 (개인)" items={recentPersonalAccounts} />
        <ListCard title="최근 등록 (기관)" items={recentInstituteAccounts} />
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ListCard title="검사 완료 (개인)" items={completedPersonalTests} />
        <ListCard title="검사 완료 (팀별)" items={completedTeamTests} />
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
  iconColor,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  iconColor: string;
}) {
  return (
    <Link 
      href={href}
      className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="mt-0.5 text-2xl font-bold">{value}</h3>
        </div>
        <div className={`rounded-full p-2.5 ${color}`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </Link>
  );
}

function ListCard({ title, items }: { title: string; items: User[] }) {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="border-b px-4 py-3">
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="divide-y">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between px-4 py-2.5">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.id}</p>
              {item.org && <p className="text-xs text-muted-foreground">{item.org}</p>}
            </div>
            <p className="text-xs text-muted-foreground">{item.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 