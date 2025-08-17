// 追加の面談予約デモデータ - 多様な職種・経験レベル・施設タイプ
import { Interview, InterviewType, InterviewStatus } from '@/types/interview';

export const additionalMockInterviews: Interview[] = [
  // ===========================
  // 事務職員の面談
  // ===========================
  {
    id: 'INT-DEMO-ADM-001',
    employeeId: 'OH-AD-2018-005',
    employeeName: '木村 健太',
    employeeEmail: 'kimura.kenta@ohara-hospital.jp',
    facility: '小原病院',
    department: '医事課',
    position: '医事課職員',
    bookingDate: new Date().toISOString().split('T')[0], // 本日
    startTime: '09:00',
    endTime: '09:30',
    interviewType: 'regular_annual' as InterviewType,
    interviewCategory: 'career_path' as any,
    requestedTopics: ['業務効率化', 'レセプト業務', 'システム改善提案'],
    description: '医事課職員年次面談（6年目）',
    urgencyLevel: 'low' as any,
    status: 'scheduled' as InterviewStatus,
    interviewerId: 'M009',
    interviewerName: '事務長',
    interviewerLevel: 8,
    duration: 30,
    employeeNotes: 'DX推進について相談したい',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system'
  },
  {
    id: 'INT-DEMO-ADM-002',
    employeeId: 'TT-AD-2023-003',
    employeeName: '山田 由美子',
    employeeEmail: 'yamada.yumiko@tatekawa-rehab.jp',
    facility: '立神リハビリテーション温泉病院',
    department: '総務課',
    position: '事務職員',
    bookingDate: new Date().toISOString().split('T')[0], // 本日
    startTime: '10:30',
    endTime: '11:00',
    interviewType: 'new_employee_monthly' as InterviewType,
    interviewCategory: 'other' as any,
    requestedTopics: ['業務習得状況', '職場環境', '今後の目標'],
    description: '新入職員月次面談（12ヶ月目・最終）',
    urgencyLevel: 'medium' as any,
    status: 'scheduled' as InterviewStatus,
    interviewerId: 'M010',
    interviewerName: '総務課長',
    interviewerLevel: 7,
    duration: 30,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system'
  },

  // ===========================
  // 慢性期病院のベテラン看護師
  // ===========================
  {
    id: 'INT-DEMO-CHR-001',
    employeeId: 'CH-NS-2008-002',
    employeeName: '斎藤 康子',
    employeeEmail: 'saito.yasuko@chronic-care.jp',
    facility: '慢性期ケア病院',
    department: '療養病棟',
    position: '看護師',
    bookingDate: new Date().toISOString().split('T')[0], // 本日
    startTime: '13:00',
    endTime: '13:45',
    interviewType: 'regular_annual' as InterviewType,
    interviewCategory: 'mentoring' as any,
    requestedTopics: ['後輩指導', '知識継承', 'ワークライフバランス'],
    description: 'ベテラン看護師年次面談（16年目）',
    urgencyLevel: 'low' as any,
    status: 'scheduled' as InterviewStatus,
    interviewerId: 'M011',
    interviewerName: '看護部長',
    interviewerLevel: 9,
    duration: 45,
    employeeNotes: '定年後の再雇用について相談したい',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system'
  },
  {
    id: 'INT-DEMO-CHR-002',
    employeeId: 'CH-NS-2012-007',
    employeeName: '中村 明美',
    employeeEmail: 'nakamura.akemi@chronic-care.jp',
    facility: '慢性期ケア病院',
    department: '認知症病棟',
    position: '看護師主任',
    bookingDate: new Date().toISOString().split('T')[0], // 本日
    startTime: '14:00',
    endTime: '14:45',
    interviewType: 'management_assessment' as InterviewType,
    interviewCategory: 'performance' as any,
    requestedTopics: ['部下育成', 'チーム運営', '業務改善'],
    description: '管理職評価面談（主任3年目）',
    urgencyLevel: 'medium' as any,
    status: 'scheduled' as InterviewStatus,
    interviewerId: 'M012',
    interviewerName: '看護副部長',
    interviewerLevel: 8,
    duration: 45,
    employeeNotes: '師長昇進への準備について',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system'
  },

  // ===========================
  // 介護職・介護福祉士
  // ===========================
  {
    id: 'INT-DEMO-CW-001',
    employeeId: 'RK-CW-2019-004',
    employeeName: '田中 太郎',
    employeeEmail: 'tanaka.taro@roken-facility.jp',
    facility: '老健さくら園',
    department: '入所サービス',
    position: '介護福祉士',
    bookingDate: new Date().toISOString().split('T')[0], // 本日
    startTime: '11:00',
    endTime: '11:30',
    interviewType: 'regular_annual' as InterviewType,
    interviewCategory: 'skill_development' as any,
    requestedTopics: ['認知症ケア', 'リーダー業務', '資格取得'],
    description: '介護福祉士年次面談（5年目）',
    urgencyLevel: 'low' as any,
    status: 'scheduled' as InterviewStatus,
    interviewerId: 'M013',
    interviewerName: '介護主任',
    interviewerLevel: 6,
    duration: 30,
    employeeNotes: '介護支援専門員資格取得を検討中',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system'
  },
  {
    id: 'INT-DEMO-CW-002',
    employeeId: 'RK-CW-2022-011',
    employeeName: '鈴木 花子',
    employeeEmail: 'suzuki.hanako@roken-facility.jp',
    facility: '老健さくら園',
    department: '通所リハビリ',
    position: '介護職員',
    bookingDate: new Date().toISOString().split('T')[0], // 本日
    startTime: '15:30',
    endTime: '16:00',
    interviewType: 'new_employee_monthly' as InterviewType,
    interviewCategory: 'other' as any,
    requestedTopics: ['入浴介助', 'レクリエーション', 'チーム連携'],
    description: '介護職員月次面談（2年目）',
    urgencyLevel: 'medium' as any,
    status: 'scheduled' as InterviewStatus,
    interviewerId: 'M014',
    interviewerName: 'デイケア責任者',
    interviewerLevel: 6,
    duration: 30,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system'
  },

  // ===========================
  // リハビリ職（PT/OT/ST）
  // ===========================
  {
    id: 'INT-DEMO-PT-001',
    employeeId: 'TT-PT-2020-006',
    employeeName: '岡田 健司',
    employeeEmail: 'okada.kenji@tatekawa-rehab.jp',
    facility: '立神リハビリテーション温泉病院',
    department: 'リハビリテーション科',
    position: '理学療法士',
    bookingDate: new Date().toISOString().split('T')[0], // 本日
    startTime: '09:30',
    endTime: '10:15',
    interviewType: 'regular_annual' as InterviewType,
    interviewCategory: 'skill_development' as any,
    requestedTopics: ['専門技術向上', '学会発表', '部内教育'],
    description: '理学療法士年次面談（4年目）',
    urgencyLevel: 'low' as any,
    status: 'scheduled' as InterviewStatus,
    interviewerId: 'M015',
    interviewerName: 'リハビリ科長',
    interviewerLevel: 7,
    duration: 45,
    employeeNotes: '呼吸リハビリ認定を目指したい',
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system'
  },
  {
    id: 'INT-DEMO-OT-001',
    employeeId: 'OH-OT-2021-003',
    employeeName: '森 美香',
    employeeEmail: 'mori.mika@ohara-hospital.jp',
    facility: '小原病院',
    department: 'リハビリテーション室',
    position: '作業療法士',
    bookingDate: new Date().toISOString().split('T')[0], // 本日
    startTime: '16:00',
    endTime: '16:45',
    interviewType: 'regular_annual' as InterviewType,
    interviewCategory: 'career_path' as any,
    requestedTopics: ['高次脳機能評価', '家族指導', 'キャリアプラン'],
    description: '作業療法士年次面談（3年目）',
    urgencyLevel: 'medium' as any,
    status: 'scheduled' as InterviewStatus,
    interviewerId: 'M016',
    interviewerName: 'リハビリ主任',
    interviewerLevel: 6,
    duration: 45,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system'
  },
  {
    id: 'INT-DEMO-ST-001',
    employeeId: 'CH-ST-2023-001',
    employeeName: '小林 優',
    employeeEmail: 'kobayashi.yu@chronic-care.jp',
    facility: '慢性期ケア病院',
    department: 'リハビリテーション科',
    position: '言語聴覚士',
    bookingDate: new Date().toISOString().split('T')[0], // 本日
    startTime: '13:30',
    endTime: '14:00',
    interviewType: 'new_employee_monthly' as InterviewType,
    interviewCategory: 'other' as any,
    requestedTopics: ['嚥下評価', '言語訓練', '他職種連携'],
    description: '新人言語聴覚士月次面談（6ヶ月目）',
    urgencyLevel: 'high' as any,
    status: 'scheduled' as InterviewStatus,
    interviewerId: 'M017',
    interviewerName: 'ST主任',
    interviewerLevel: 6,
    duration: 30,
    employeeNotes: '嚥下造影検査の実施について学びたい',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system'
  },

  // ===========================
  // 看護補助者・ヘルパー
  // ===========================
  {
    id: 'INT-DEMO-NA-001',
    employeeId: 'OH-NA-2015-008',
    employeeName: '伊藤 和子',
    employeeEmail: 'ito.kazuko@ohara-hospital.jp',
    facility: '小原病院',
    department: '内科病棟',
    position: '看護補助者',
    bookingDate: new Date().toISOString().split('T')[0], // 本日
    startTime: '10:00',
    endTime: '10:30',
    interviewType: 'regular_annual' as InterviewType,
    interviewCategory: 'performance' as any,
    requestedTopics: ['業務効率', '患者対応', '今後の目標'],
    description: 'ベテラン看護補助者年次面談（9年目）',
    urgencyLevel: 'low' as any,
    status: 'scheduled' as InterviewStatus,
    interviewerId: 'M018',
    interviewerName: '病棟師長',
    interviewerLevel: 7,
    duration: 30,
    employeeNotes: '介護福祉士資格取得を検討',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system'
  },

  // ===========================
  // 管理職・主任クラス
  // ===========================
  {
    id: 'INT-DEMO-MGR-001',
    employeeId: 'OH-NS-2010-001',
    employeeName: '高橋 真理子',
    employeeEmail: 'takahashi.mariko@ohara-hospital.jp',
    facility: '小原病院',
    department: '外科病棟',
    position: '看護師長',
    bookingDate: new Date().toISOString().split('T')[0], // 本日
    startTime: '15:00',
    endTime: '16:00',
    interviewType: 'management_assessment' as InterviewType,
    interviewCategory: 'leadership' as any,
    requestedTopics: ['部門運営', '人材育成', '経営参画'],
    description: '管理職評価面談（師長5年目）',
    urgencyLevel: 'high' as any,
    status: 'scheduled' as InterviewStatus,
    interviewerId: 'M019',
    interviewerName: '看護部長',
    interviewerLevel: 9,
    duration: 60,
    employeeNotes: '副部長への昇進について',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system'
  },
  {
    id: 'INT-DEMO-MGR-002',
    employeeId: 'RK-CW-2014-001',
    employeeName: '渡部 正志',
    employeeEmail: 'watanabe.masashi@roken-facility.jp',
    facility: '老健さくら園',
    department: '入所サービス',
    position: '介護主任',
    bookingDate: new Date().toISOString().split('T')[0], // 本日
    startTime: '14:30',
    endTime: '15:15',
    interviewType: 'management_assessment' as InterviewType,
    interviewCategory: 'performance' as any,
    requestedTopics: ['スタッフ指導', '業務改善', '離職防止'],
    description: '介護主任評価面談（主任2年目）',
    urgencyLevel: 'medium' as any,
    status: 'scheduled' as InterviewStatus,
    interviewerId: 'M020',
    interviewerName: '施設長',
    interviewerLevel: 10,
    duration: 45,
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system'
  }
];

// 施設タイプの追加情報
export const facilityTypes = {
  '小原病院': 'acute', // 急性期
  '立神リハビリテーション温泉病院': 'rehabilitation', // 回復期リハ
  '慢性期ケア病院': 'chronic', // 慢性期
  '老健さくら園': 'roken' // 介護老人保健施設
};

// 職種と経験レベルのマッピング
export const professionMapping = {
  '看護師': 'nurse',
  '准看護師': 'assistant-nurse',
  '看護補助者': 'nursing-aide',
  '介護福祉士': 'care-worker',
  '介護職員': 'care-worker',
  '理学療法士': 'pt',
  '作業療法士': 'ot',
  '言語聴覚士': 'st',
  '医事課職員': 'admin',
  '事務職員': 'admin',
  '看護師長': 'nurse',
  '看護師主任': 'nurse',
  '介護主任': 'care-worker'
};

// 経験年数から経験レベルを判定
export function getExperienceLevel(years: number): string {
  if (years <= 1) return 'new';
  if (years <= 3) return 'junior';
  if (years <= 10) return 'midlevel';
  return 'veteran';
}