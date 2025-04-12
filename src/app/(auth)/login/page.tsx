"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginManager } from "@/lib/actions/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await loginManager(email, password);
      
      if (response.success) {
        // 관리자 정보를 세션 스토리지에 저장
        sessionStorage.setItem('manager', JSON.stringify(response.manager));
        
        // 대시보드로 이동
        router.push("/dashboard");
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">관리자 로그인</h1>
            <p className="text-muted-foreground">
              관리자 계정으로 로그인하세요
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                이메일
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  비밀번호
                </label>
                <Link 
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  비밀번호 찾기
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground">
                로그인 상태 유지
              </label>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </div>
      </div>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} 관리자 대시보드. 모든 권리 보유.
      </footer>
    </div>
  );
} 