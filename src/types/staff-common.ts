// 職員共通型定義

// 職員レベル定義
export type StaffLevel = 
  | 'new'           // 新人（1年未満）
  | 'junior'        // 初級（1-2年）
  | 'general'       // 一般（2-3年）
  | 'midlevel'      // 中堅（3-5年）
  | 'senior'        // 上級（5-7年）
  | 'veteran'       // ベテラン（7-10年）
  | 'leader'        // リーダー（10年以上）
  | 'chief'         // 主任
  | 'manager';      // 管理職

// 経験レベル定義（面談シート用）
export type ExperienceLevel = 
  | 'new'           // 新人
  | 'junior'        // 若手
  | 'midlevel'      // 中堅
  | 'senior'        // 上級
  | 'veteran'       // ベテラン
  | 'supervisor'    // 主任
  | 'manager';      // 管理職

// 職種定義
export type JobRole = 
  | 'nurse'               // 看護師
  | 'assistant-nurse'     // 准看護師
  | 'nursing-aide'        // 看護補助者
  | 'care-worker'         // 介護職員
  | 'care-assistant'      // 介護補助者
  | 'pt'                  // 理学療法士
  | 'ot'                  // 作業療法士
  | 'st';                 // 言語聴覚士

// 施設タイプ
export type FacilityType = 
  | 'acute'       // 急性期病院
  | 'chronic'     // 慢性期病院
  | 'roken'       // 介護老人保健施設
  | 'grouphome'   // グループホーム
  | 'outpatient'; // 外来

// 面談時間
export type InterviewDuration = 15 | 30 | 45 | 60;

// 経験年数を計算するユーティリティ
export const calculateExperienceYears = (level: StaffLevel): number => {
  const experienceMap: Record<StaffLevel, number> = {
    'new': 0,
    'junior': 1,
    'general': 2,
    'midlevel': 4,
    'senior': 6,
    'veteran': 8,
    'leader': 10,
    'chief': 12,
    'manager': 15
  };
  return experienceMap[level] || 2;
};

// 職種を日本語に変換
export const getJobRoleLabel = (role: JobRole): string => {
  const roleMap: Record<JobRole, string> = {
    'nurse': '看護師',
    'assistant-nurse': '准看護師',
    'nursing-aide': '看護補助者',
    'care-worker': '介護職員',
    'care-assistant': '介護補助者',
    'pt': '理学療法士',
    'ot': '作業療法士',
    'st': '言語聴覚士'
  };
  return roleMap[role] || '看護師';
};

// 施設タイプを日本語に変換
export const getFacilityTypeLabel = (facility: FacilityType): string => {
  const facilityMap: Record<FacilityType, string> = {
    'acute': '急性期病院',
    'chronic': '慢性期病院',
    'roken': '介護老人保健施設',
    'grouphome': 'グループホーム',
    'outpatient': '外来'
  };
  return facilityMap[facility] || '急性期病院';
};

// スタッフレベルを日本語に変換
export const getStaffLevelLabel = (level: StaffLevel): string => {
  const levelMap: Record<StaffLevel, string> = {
    'new': '新人（1年未満）',
    'junior': '初級（1-2年）',
    'general': '一般（2-3年）',
    'midlevel': '中堅（3-5年）',
    'senior': '上級（5-7年）',
    'veteran': 'ベテラン（7-10年）',
    'leader': 'リーダー（10年以上）',
    'chief': '主任',
    'manager': '管理職'
  };
  return levelMap[level] || '一般';
};