interface PersonalInfo {
  id: string;
  pname: string;
  birth: string;
  sex: string;
  cellphone: string;
  contact: string;
  email: string;
  education: string;
  school: string;
  syear: string;
  smajor: string;
  job: string;
  age: number;
  pe_job_name: string;
  pe_job_detail: string;
}

interface Tendency {
  tnd1: string;
  tnd2: string;
}

interface TendencyItem {
  tendency_name: string;
  rank: number;
  code: string;
}

interface TendencyExplain {
  rank: number;
  tendency_name: string;
  explanation: string;
}

interface TendencyQuestionExplain {
  qu_explain: string;
  rank: number;
}

interface ThinkingMain {
  thkm: string;  // 주사고
  thks: string;  // 부사고
  tscore: number; // T점수
}

interface ThinkingScore {
  thk1: number;
  thk2: number;
  thk3: number;
  thk4: number;
  thk5: number;
  thk6: number;
  thk7: number;
  thk8: number;
}

interface ThinkingDetail {
  qua_name: string;
  score: number;
  explain: string;
}

interface SuitableJobsSummary {
  tendency: string;
  tndjob: string;
}

interface SuitableJob {
  jo_name: string;
  jo_outline: string;
  jo_mainbusiness: string;
}

interface SuitableJobMajor {
  jo_name: string;
  major: string;
}

interface ImagePreference {
  tcnt: number;   // 이미지 총 반응 수
  cnt: number;    // 사용자가 선호 반응을 보인 수
  irate: number;  // 선호반응률(%)
}

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

interface CompetencyJob {
  jo_name: string;
  jo_outline: string;
  jo_mainbusiness: string;
  majors: string;
}

interface TalentDetail {
  qua_name: string;
  tscore: number;
  explain: string;
}

// 학습 데이터 타입 정의
interface LearningStyleData {
  tnd1: string;
  tnd1_study: string;
  tnd1_way: string;
  tnd2: string;
  tnd2_study: string;
  tnd2_way: string;
  tndrow: number;
  tndcol: number;
}

interface ChartData {
  sname: string;
  srate: number;
  scolor: string;
}

interface LearningData {
  style: LearningStyleData;
  style1Chart: ChartData[];
  style2Chart: ChartData[];
  method1Chart: ChartData[];
  method2Chart: ChartData[];
}

interface ResultData {
  personalInfo: PersonalInfo;
  tendency: Tendency;
  tendency1Explain: { replace: string };
  tendency2Explain: { replace: string };
  topTendencies: TendencyItem[];
  bottomTendencies: TendencyItem[];
  tendencyQuestionExplains: TendencyQuestionExplain[];
  topTendencyExplains: TendencyExplain[];
  bottomTendencyExplains: TendencyExplain[];
  thinkingMain: ThinkingMain;
  thinkingScore: ThinkingScore;
  thinkingDetails: ThinkingDetail[];
  suitableJobsSummary: SuitableJobsSummary;
  suitableJobsDetail: SuitableJob[];
  suitableJobMajors: SuitableJobMajor[];
  imagePreference?: ImagePreference;
  preferenceData?: PreferenceData;
  preferenceJobs1?: PreferenceJob[];
  preferenceJobs2?: PreferenceJob[];
  preferenceJobs3?: PreferenceJob[];
  pd_kind?: string;
  talentList?: string;
  talentDetails?: TalentDetail[];
  competencyJobs?: CompetencyJob[];
}

export type {
  PersonalInfo,
  Tendency,
  TendencyItem,
  TendencyExplain,
  TendencyQuestionExplain,
  ThinkingMain,
  ThinkingScore,
  ThinkingDetail,
  SuitableJobsSummary,
  SuitableJob,
  SuitableJobMajor,
  ImagePreference,
  PreferenceData,
  PreferenceJob,
  CompetencyJob,
  TalentDetail,
  LearningStyleData,
  ChartData,
  LearningData,
  ResultData
}; 