import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { User, GraduationCap } from 'lucide-react';
import { PersonalInfo } from '@/types/result-types';

interface PersonalInfoTabProps {
  loading: boolean;
  error: string | null;
  personalInfo?: PersonalInfo;
}

export function PersonalInfoTab({ loading, error, personalInfo }: PersonalInfoTabProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-800">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 개인 기본 정보 카드 */}
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 py-3">
          <CardTitle className="flex items-center text-lg gap-2 text-indigo-800">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            개인 기본 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 bg-white">
          <dl className="space-y-4">
            <div className="flex items-start">
              <dt className="w-28 text-gray-500 font-medium">이름</dt>
              <dd className="font-semibold">{personalInfo?.pname}</dd>
            </div>
            
            <div className="flex items-start">
              <dt className="w-28 text-gray-500 font-medium">아이디</dt>
              <dd>{personalInfo?.id}</dd>
            </div>
            
            <div className="flex items-start">
              <dt className="w-28 text-gray-500 font-medium">성별</dt>
              <dd>{personalInfo?.sex}</dd>
            </div>
            
            <div className="flex items-start">
              <dt className="w-28 text-gray-500 font-medium">생년월일</dt>
              <dd>{personalInfo?.birth} ({personalInfo?.age}세)</dd>
            </div>
            
            <div className="flex items-start">
              <dt className="w-28 text-gray-500 font-medium">휴대전화</dt>
              <dd>{personalInfo?.cellphone || '-'}</dd>
            </div>
            
            <div className="flex items-start">
              <dt className="w-28 text-gray-500 font-medium">추가연락처</dt>
              <dd>{personalInfo?.contact || '-'}</dd>
            </div>
            
            <div className="flex items-start">
              <dt className="w-28 text-gray-500 font-medium">이메일</dt>
              <dd>{personalInfo?.email || '-'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      
      {/* 학력 및 직업 정보 카드 */}
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 py-3">
          <CardTitle className="flex items-center text-lg gap-2 text-indigo-800">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <GraduationCap className="h-5 w-5 text-indigo-600" />
            </div>
            학력 및 직업 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 bg-white">
          <dl className="space-y-4">
            <div className="flex items-start">
              <dt className="w-28 text-gray-500 font-medium">최종학력</dt>
              <dd>{personalInfo?.education || '-'}</dd>
            </div>
            
            <div className="flex items-start">
              <dt className="w-28 text-gray-500 font-medium">학교명</dt>
              <dd>{personalInfo?.school || '-'}</dd>
            </div>
            
            <div className="flex items-start">
              <dt className="w-28 text-gray-500 font-medium">학년</dt>
              <dd>{personalInfo?.syear || '-'}</dd>
            </div>
            
            <div className="flex items-start">
              <dt className="w-28 text-gray-500 font-medium">전공</dt>
              <dd>{personalInfo?.smajor || '-'}</dd>
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex items-start">
              <dt className="w-28 text-gray-500 font-medium">직업</dt>
              <dd>{personalInfo?.job || '-'}</dd>
            </div>
            
            <div className="flex items-start">
              <dt className="w-28 text-gray-500 font-medium">직장명</dt>
              <dd>{personalInfo?.pe_job_name || '-'}</dd>
            </div>
            
            <div className="flex items-start">
              <dt className="w-28 text-gray-500 font-medium">직무</dt>
              <dd>{personalInfo?.pe_job_detail || '-'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
} 