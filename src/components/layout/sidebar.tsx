"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  UserCog, 
  MessageSquare, 
  FileText,
  LogOut,
  ChevronDown,
  Building,
  User
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "../ui/button";

interface SubMenuItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface NavItem {
  title: string;
  href?: string;
  icon: React.ReactNode;
  submenu?: boolean;
  submenuItems?: SubMenuItem[];
}

// 서브메뉴 포함하는 새로운 네비게이션 항목 정의
const navItems: NavItem[] = [
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
    icon: <Users className="h-4 w-4" />,
    submenu: true,
    submenuItems: [
      { 
        title: "기관관리", 
        href: "/institutions",
        icon: <Building className="h-3.5 w-3.5" />,
      },
      { 
        title: "개인관리", 
        href: "/individuals",
        icon: <User className="h-3.5 w-3.5" />,
      }
    ]
  },
  {
    title: "문의글 관리",
    href: "/inquiries",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    title: "검사결과",
    icon: <FileText className="h-4 w-4" />,
    submenu: true,
    submenuItems: [
      { 
        title: "기관용", 
        href: "/institute-result",
        icon: <Building className="h-3.5 w-3.5" />,
      },
      { 
        title: "개인용", 
        href: "/results/individuals-result",
        icon: <User className="h-3.5 w-3.5" />,
      }
    ]
  },
];

export function Sidebar() {
  const pathname = usePathname();
  // 각 서브메뉴의 열림/닫힘 상태를 관리하는 상태
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  // 서브메뉴 토글 함수
  const toggleSubmenu = (title: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // 현재 경로가 해당 메뉴 또는 서브메뉴에 속하는지 확인
  const isActiveMenu = (item: NavItem) => {
    if (item.href && (pathname === item.href || pathname.startsWith(`${item.href}/`))) {
      return true;
    }
    
    if (item.submenu && item.submenuItems) {
      return item.submenuItems.some((subItem) => 
        pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
      );
    }
    
    return false;
  };

  return (
    <div className="flex h-screen flex-col justify-between bg-gradient-to-b from-blue-50 to-gray-50 dark:from-gray-900 dark:to-gray-950 p-3 shadow-lg">
      <div className="space-y-4">
        <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-800 px-2 mb-2">
          <Link href="/dashboard" className="flex items-center gap-1.5">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">관리자</h1>
          </Link>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <div key={item.title} className="flex flex-col">
              {/* 메인 메뉴 항목 */}
              {item.submenu ? (
                <button
                  onClick={() => toggleSubmenu(item.title)}
                  className={cn(
                    "flex items-center justify-between gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActiveMenu(item)
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    {item.title}
                  </span>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform", 
                      openSubmenus[item.title] ? "rotate-180" : ""
                    )} 
                  />
                </button>
              ) : (
                <Link
                  href={item.href || "#"}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActiveMenu(item)
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              )}
              
              {/* 서브메뉴 항목들 */}
              {item.submenu && item.submenuItems && (
                <div className={cn(
                  "flex flex-col space-y-1 overflow-hidden transition-all duration-300 ease-in-out pl-6 mt-1",
                  openSubmenus[item.title] ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                )}>
                  {item.submenuItems.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                        pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/30"
                      )}
                    >
                      {subItem.icon}
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
        <ThemeToggle />
        <Button variant="outline" className="w-full justify-start gap-2 text-sm border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
          <LogOut className="h-4 w-4" />
          로그아웃
        </Button>
      </div>
    </div>
  );
} 