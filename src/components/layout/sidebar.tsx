"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  UserCog, 
  MessageSquare, 
  FileText,
  LogOut
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "../ui/button";

const navItems = [
  {
    title: "대시보드",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "기업정보",
    href: "/companies",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    title: "매니저관리",
    href: "/managers",
    icon: <UserCog className="h-4 w-4" />,
  },
  {
    title: "계정목록",
    href: "/accounts",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "문의글 관리",
    href: "/inquiries",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    title: "검사결과",
    href: "/results",
    icon: <FileText className="h-4 w-4" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-col justify-between bg-card p-3 shadow-lg">
      <div className="space-y-4">
        <div className="flex h-12 items-center px-2">
          <Link href="/dashboard" className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold">관리자</h1>
          </Link>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors hover:bg-accent",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-1.5">
        <ThemeToggle />
        <Button variant="outline" className="w-full justify-start gap-1.5 text-xs">
          <LogOut className="h-4 w-4" />
          로그아웃
        </Button>
      </div>
    </div>
  );
} 