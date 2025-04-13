import Link from "next/link";
import { UserRound, Building, FileCheck, Users, MessageSquare, Clock } from "lucide-react";

// 사용자 정의 타입
interface User {
  id: string;
  name: string;
  timestamp: string;
  org?: string;
}

interface Inquiry {
  date: string;
  title: string;
  insName: string;
  managerName: string;
  managerPosition: string;
}

interface LoginLog {
  login_date: string;
  email: string;
  name?: string;
}

// 임시 데이터 - 실제로는 DB에서 가져옴
// 1. 최근 등록 개인회원 (ac.ac_id, ac.ac_insert_date, pe.pe_name)
const recentUsers: User[] = [
  { id: "kimmingi@gmail.com", name: "김민기", timestamp: "2025-04-12" },
  { id: "parkjoon@naver.com", name: "박준서", timestamp: "2025-04-10" },
  { id: "leesora@daum.net", name: "이소라", timestamp: "2025-04-09" },
  { id: "jeongwoo@gmail.com", name: "정우진", timestamp: "2025-04-08" },
];

// 2. 최근 등록 기관 (ac.ac_id, ac.ac_insert_date, ins.ins_name)
const recentOrgs: User[] = [
  { id: "jangchul@edu.kr", name: "장철도대학교 교수", timestamp: "2025-04-11" },
  { id: "kimpo@corp.co.kr", name: "김포기업 인사팀", timestamp: "2025-04-09" },
  { id: "tech@corp.com", name: "테크놀로지 기업", timestamp: "2025-04-07" },
  { id: "edu@inst.org", name: "교육기관 연합", timestamp: "2025-04-03" },
];

// 3. 개인 검사 완료 (ac.ac_id, pe.pe_name, anp.anp_end_date)
const completedPersonal: User[] = [
  { id: "hong@gmail.com", name: "홍길동", timestamp: "2025-04-10 14:22:15" },
  { id: "kimyuna@naver.com", name: "김유나", timestamp: "2025-04-09 09:45:32" },
  { id: "parksh@daum.net", name: "박상현", timestamp: "2025-04-08 17:11:03" },
  { id: "leejh@gmail.com", name: "이지혜", timestamp: "2025-04-06 10:33:27" },
];

// 4. 팀별 검사 완료 (ac.ac_id, pe.pe_name, anp.anp_end_date)
const completedTeam: User[] = [
  { id: "teamA@tech.com", name: "A팀", org: "테크놀로지 기업", timestamp: "2025-04-09 16:30:44" },
  { id: "teamB@edu.org", name: "B팀", org: "교육기관 연합", timestamp: "2025-04-07 11:23:51" },
  { id: "dev@kimpo.co.kr", name: "개발팀", org: "김포기업 인사팀", timestamp: "2025-04-05 15:42:19" },
  { id: "hr@jangchul.edu.kr", name: "인사팀", org: "장철도대학교", timestamp: "2025-04-03 09:05:17" },
];

// 5. 미응답 문의글 (aci.ai_date, aci.ai_title, ins.ins_name, ins.ins_manager1_name, ins.ins_manager1_position)
const inquiries: Inquiry[] = [
  { 
    date: "2025-04-10 17:30:22", 
    title: "결제 오류 문의드립니다",
    insName: "테크놀로지 기업",
    managerName: "박철수",
    managerPosition: "인사팀장" 
  },
  { 
    date: "2025-04-09 09:15:37", 
    title: "계정 사용기한 연장 요청",
    insName: "장철도대학교",
    managerName: "김교수",
    managerPosition: "교수" 
  },
  { 
    date: "2025-04-07 14:28:11", 
    title: "검사 결과 해석 관련 문의",
    insName: "김포기업 인사팀",
    managerName: "이인사",
    managerPosition: "인사담당자" 
  },
  { 
    date: "2025-04-05 11:42:53", 
    title: "단체 검사 신청 방법",
    insName: "교육기관 연합",
    managerName: "최교육",
    managerPosition: "기관장" 
  },
];

// 6. 계정 로그인 로그 (lla.login_date, ac.ac_id)
const accountLoginLogs: LoginLog[] = [
  { login_date: "2025-04-10 18:45:12", email: "kimyuna@naver.com" },
  { login_date: "2025-04-10 16:32:05", email: "parksh@daum.net" },
  { login_date: "2025-04-10 14:19:37", email: "hong@gmail.com" },
  { login_date: "2025-04-10 11:05:48", email: "teamA@tech.com" },
  { login_date: "2025-04-10 09:27:19", email: "leejh@gmail.com" },
];

// 7. 관리자 로그인 로그 (llm.login_date, mg.mg_name, mg.mg_email)
const managerLoginLogs: LoginLog[] = [
  { login_date: "2025-04-10 19:15:33", name: "관리자1", email: "admin1@system.com" },
  { login_date: "2025-04-10 17:42:21", name: "관리자2", email: "admin2@system.com" },
  { login_date: "2025-04-10 15:19:08", name: "관리자3", email: "admin3@system.com" },
  { login_date: "2025-04-10 12:04:51", name: "관리자4", email: "admin4@system.com" },
  { login_date: "2025-04-10 09:30:17", name: "관리자5", email: "admin5@system.com" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">대시보드</h1>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard 
          title="계정 수"
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InquiryCard title="미응답 문의" items={inquiries} />
        <div className="grid grid-cols-1 gap-4">
          <LoginCard title="계정 로그인 기록" items={accountLoginLogs} />
          <LoginCard title="관리자 로그인 기록" items={managerLoginLogs} showName={true} />
        </div>
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
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between px-4 py-2.5">
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

function InquiryCard({ title, items }: { title: string; items: Inquiry[] }) {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 text-xs rounded-full px-2 py-1 flex items-center">
          <MessageSquare className="h-3 w-3 mr-1" />
          <span>{items.length} 건</span>
        </div>
      </div>
      <div className="divide-y">
        {items.map((item, index) => (
          <div key={index} className="px-4 py-2.5">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium truncate max-w-[200px]">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.date}</p>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="truncate max-w-[130px]">{item.insName}</span>
              <span className="mx-1">·</span>
              <span>{item.managerName} {item.managerPosition}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoginCard({ title, items, showName = false }: { title: string; items: LoginLog[], showName?: boolean }) {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded-full px-2 py-1 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>최근 5건</span>
        </div>
      </div>
      <div className="divide-y">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between px-4 py-2">
            <div>
              {showName && item.name && (
                <p className="text-xs font-medium">{item.name}</p>
              )}
              <p className="text-xs text-muted-foreground">{item.email}</p>
            </div>
            <p className="text-xs text-muted-foreground">{item.login_date}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 