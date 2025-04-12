import Link from "next/link";
import { UserRound, Building, FileCheck, Users } from "lucide-react";

// 사용자 정의 타입
interface User {
  id: string;
  name: string;
  timestamp: string;
  org?: string;
}

// 임시 데이터
const recentUsers: User[] = [
  { id: "kimmingi09", name: "김민기", timestamp: "2025-04-12 03:19:37" },
  { id: "parkjoon15", name: "박준서", timestamp: "2025-04-10 14:22:15" },
  { id: "leesora81", name: "이소라", timestamp: "2025-04-09 09:45:32" },
  { id: "jeongwoo72", name: "정우진", timestamp: "2025-04-08 17:11:03" },
];

const recentOrgs: User[] = [
  { id: "gwsu20250411", name: "장철도대학교 교수", timestamp: "2025-04-11 10:15:22" },
  { id: "kimco20250409", name: "김포기업 인사팀", timestamp: "2025-04-09 16:30:44" },
  { id: "techcorp0407", name: "테크놀로지 기업", timestamp: "2025-04-07 11:23:51" },
  { id: "eduinst0403", name: "교육기관 연합", timestamp: "2025-04-03 09:05:17" },
];

const completedPersonal: User[] = [
  { id: "hong1234", name: "홍길동", timestamp: "2025-04-10 14:22:15" },
  { id: "kimyuna88", name: "김유나", timestamp: "2025-04-09 09:45:32" },
  { id: "parksh77", name: "박상현", timestamp: "2025-04-08 17:11:03" },
  { id: "leejh92", name: "이지혜", timestamp: "2025-04-06 10:33:27" },
];

const completedTeam: User[] = [
  { id: "teamA2025", name: "A팀", org: "테크놀로지 기업", timestamp: "2025-04-09 16:30:44" },
  { id: "teamB2025", name: "B팀", org: "교육기관 연합", timestamp: "2025-04-07 11:23:51" },
  { id: "devteam25", name: "개발팀", org: "김포기업 인사팀", timestamp: "2025-04-05 15:42:19" },
  { id: "hrteam25", name: "인사팀", org: "장철도대학교", timestamp: "2025-04-03 09:05:17" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">대시보드</h1>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="총 사용자"
          value="3,154"
          icon={<UserRound className="h-7 w-7" />}
          href="/accounts"
          color="bg-blue-50 dark:bg-blue-950"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <DashboardCard 
          title="기관 수"
          value="215"
          icon={<Building className="h-7 w-7" />}
          href="/companies"
          color="bg-green-50 dark:bg-green-950"
          iconColor="text-green-600 dark:text-green-400"
        />
        <DashboardCard 
          title="검사 완료"
          value="12,872"
          icon={<FileCheck className="h-7 w-7" />}
          href="/results"
          color="bg-purple-50 dark:bg-purple-950"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <DashboardCard 
          title="매니저"
          value="42"
          icon={<Users className="h-7 w-7" />}
          href="/managers"
          color="bg-orange-50 dark:bg-orange-950"
          iconColor="text-orange-600 dark:text-orange-400"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ListCard title="최근 등록 (개인)" items={recentUsers} />
        <ListCard title="최근 등록 (기관)" items={recentOrgs} />
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ListCard title="검사 완료 (개인)" items={completedPersonal} />
        <ListCard title="검사 완료 (팀별)" items={completedTeam} />
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