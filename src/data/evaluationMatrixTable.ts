/**
 * 評価マトリックス対応表
 *
 * 施設内評価と法人内評価の組み合わせから最終評価（7段階）を決定する
 * 詳細な対応表として人事部が参照しやすい形式で定義
 */

export interface MatrixTableEntry {
  facilityGrade: string;      // 施設内評価（S/A/B/C/D）
  corporateGrade: string;      // 法人内評価（S/A/B/C/D）
  finalGrade: string;          // 最終評価（1-7）
  finalGradeLabel: string;     // 最終評価ラベル（D/C/B/B+/A/S/S+）
  priority: number;            // 優先度（システム処理用）
  description: string;         // 説明文
  employeeType: string;        // 該当する職員タイプ
  actionRequired?: string;     // 必要なアクション
  salaryImpact?: string;       // 給与への影響
  promotionPotential?: string; // 昇進可能性
}

// マトリックス対応表（全25パターン）
export const evaluationMatrixTable: MatrixTableEntry[] = [
  // ===== 最終評価 7 (S+) : トップパフォーマー =====
  {
    facilityGrade: 'S',
    corporateGrade: 'S',
    finalGrade: '7',
    finalGradeLabel: 'S+',
    priority: 1,
    description: '施設内・法人内両方でトップ評価を獲得した最優秀職員',
    employeeType: 'エース人材・次世代リーダー候補',
    actionRequired: '重点的な育成投資、経営幹部候補としての特別研修',
    salaryImpact: '最高水準の昇給率（基準の150%以上）',
    promotionPotential: '最優先での昇進・抜擢対象'
  },

  // ===== 最終評価 6 (S) : 極めて優秀層 =====
  {
    facilityGrade: 'S',
    corporateGrade: 'A',
    finalGrade: '6',
    finalGradeLabel: 'S',
    priority: 2,
    description: '施設内でトップ、法人内でも上位20%に入る優秀職員',
    employeeType: '施設のエース、法人でも高評価',
    actionRequired: '法人レベルでの活躍機会の提供、他施設への好事例展開',
    salaryImpact: '高水準の昇給率（基準の130-140%）',
    promotionPotential: '昇進候補、法人プロジェクトリーダー候補'
  },
  {
    facilityGrade: 'A',
    corporateGrade: 'S',
    finalGrade: '6',
    finalGradeLabel: 'S',
    priority: 2,
    description: '法人内でトップ評価、施設内でも上位30%の優秀職員',
    employeeType: '法人視点で見た優秀人材',
    actionRequired: '施設を超えた法人貢献の機会拡大、ベストプラクティス共有',
    salaryImpact: '高水準の昇給率（基準の130-140%）',
    promotionPotential: '法人本部や基幹施設への異動候補'
  },

  // ===== 最終評価 5 (A) : 優秀層 =====
  {
    facilityGrade: 'S',
    corporateGrade: 'B',
    finalGrade: '5',
    finalGradeLabel: 'A',
    priority: 3,
    description: '施設内ではトップだが、法人全体では標準的な評価',
    employeeType: '施設特化型の優秀職員',
    actionRequired: '法人レベルでの視野拡大研修、他施設交流の促進',
    salaryImpact: '標準以上の昇給率（基準の115-125%）',
    promotionPotential: '施設内での昇進優先、法人研修への参加推奨'
  },
  {
    facilityGrade: 'A',
    corporateGrade: 'A',
    finalGrade: '5',
    finalGradeLabel: 'A',
    priority: 3,
    description: '施設・法人ともに上位評価の安定した優秀職員',
    employeeType: 'バランス型優秀職員',
    actionRequired: '継続的な成長支援、専門性の深化',
    salaryImpact: '標準以上の昇給率（基準の115-125%）',
    promotionPotential: '計画的な昇進対象、後進指導役'
  },
  {
    facilityGrade: 'B',
    corporateGrade: 'S',
    finalGrade: '5',
    finalGradeLabel: 'A',
    priority: 3,
    description: '法人内ではトップだが、施設内では標準的な評価',
    employeeType: '法人貢献特化型',
    actionRequired: '施設内での存在感向上支援、施設業務とのバランス調整',
    salaryImpact: '標準以上の昇給率（基準の115-125%）',
    promotionPotential: '法人プロジェクトでの活躍を重視した配置'
  },

  // ===== 最終評価 4 (B+) : 良好層 =====
  {
    facilityGrade: 'S',
    corporateGrade: 'C',
    finalGrade: '4',
    finalGradeLabel: 'B+',
    priority: 4,
    description: '施設内トップだが法人内では改善が必要',
    employeeType: '施設限定のスペシャリスト',
    actionRequired: '法人標準への適応支援、視野拡大の機会提供',
    salaryImpact: '標準昇給率（基準の105-110%）',
    promotionPotential: '施設内での活躍を重視、法人研修への参加必須'
  },
  {
    facilityGrade: 'A',
    corporateGrade: 'B',
    finalGrade: '4',
    finalGradeLabel: 'B+',
    priority: 4,
    description: '施設内で上位、法人内では標準的',
    employeeType: '施設の中核人材',
    actionRequired: '専門性の向上、法人貢献機会の模索',
    salaryImpact: '標準昇給率（基準の105-110%）',
    promotionPotential: '施設内での段階的昇進'
  },
  {
    facilityGrade: 'B',
    corporateGrade: 'A',
    finalGrade: '4',
    finalGradeLabel: 'B+',
    priority: 4,
    description: '法人内で上位、施設内では標準的',
    employeeType: '法人視点の貢献者',
    actionRequired: '施設業務の強化、バランスの改善',
    salaryImpact: '標準昇給率（基準の105-110%）',
    promotionPotential: '法人プロジェクトでの活躍を評価'
  },
  {
    facilityGrade: 'C',
    corporateGrade: 'S',
    finalGrade: '4',
    finalGradeLabel: 'B+',
    priority: 4,
    description: '法人内トップだが施設内では要改善',
    employeeType: '法人貢献に偏重した職員',
    actionRequired: '施設業務への注力、基本業務の見直し',
    salaryImpact: '標準昇給率（基準の105-110%）',
    promotionPotential: '施設業務改善後に検討'
  },

  // ===== 最終評価 3 (B) : 標準層 =====
  {
    facilityGrade: 'B',
    corporateGrade: 'B',
    finalGrade: '3',
    finalGradeLabel: 'B',
    priority: 5,
    description: '施設・法人ともに標準的な評価',
    employeeType: '安定した標準的職員',
    actionRequired: '基礎力の向上、得意分野の発見と育成',
    salaryImpact: '標準昇給率（基準の100%）',
    promotionPotential: '通常の昇進ペース'
  },
  {
    facilityGrade: 'A',
    corporateGrade: 'C',
    finalGrade: '3',
    finalGradeLabel: 'B',
    priority: 5,
    description: '施設内では上位だが法人内では要改善',
    employeeType: '施設内評価と法人評価にギャップ',
    actionRequired: '法人基準の理解促進、スキルの標準化',
    salaryImpact: '標準昇給率（基準の100%）',
    promotionPotential: '法人基準達成後に検討'
  },
  {
    facilityGrade: 'C',
    corporateGrade: 'A',
    finalGrade: '3',
    finalGradeLabel: 'B',
    priority: 5,
    description: '法人内では上位だが施設内では要改善',
    employeeType: '法人評価と施設評価にギャップ',
    actionRequired: '施設業務の改善、日常業務の品質向上',
    salaryImpact: '標準昇給率（基準の100%）',
    promotionPotential: '施設評価改善後に検討'
  },
  {
    facilityGrade: 'B',
    corporateGrade: 'C',
    finalGrade: '3',
    finalGradeLabel: 'B',
    priority: 5,
    description: '施設内は標準だが法人内では要改善',
    employeeType: '法人基準への適応が必要',
    actionRequired: '法人研修への参加、他施設交流',
    salaryImpact: '標準昇給率（基準の100%）',
    promotionPotential: '改善状況を見て判断'
  },
  {
    facilityGrade: 'C',
    corporateGrade: 'B',
    finalGrade: '3',
    finalGradeLabel: 'B',
    priority: 5,
    description: '法人内は標準だが施設内では要改善',
    employeeType: '施設適応に課題',
    actionRequired: '施設特有業務の習熟、チーム連携強化',
    salaryImpact: '標準昇給率（基準の100%）',
    promotionPotential: '改善状況を見て判断'
  },
  {
    facilityGrade: 'S',
    corporateGrade: 'D',
    finalGrade: '3',
    finalGradeLabel: 'B',
    priority: 5,
    description: '施設内トップだが法人内では最下位（特別調整）',
    employeeType: '極端な評価格差・要因分析必要',
    actionRequired: '評価の妥当性確認、法人基準の理解促進、特別支援',
    salaryImpact: '標準昇給率（基準の100%）※特別配慮',
    promotionPotential: '慎重に検討、法人基準の達成が前提'
  },
  {
    facilityGrade: 'D',
    corporateGrade: 'S',
    finalGrade: '3',
    finalGradeLabel: 'B',
    priority: 5,
    description: '法人内トップだが施設内では最下位（特別調整）',
    employeeType: '極端な評価格差・要因分析必要',
    actionRequired: '評価の妥当性確認、施設適応支援、配置転換検討',
    salaryImpact: '標準昇給率（基準の100%）※特別配慮',
    promotionPotential: '配置の見直しを含めて検討'
  },

  // ===== 最終評価 2 (C) : 要改善層 =====
  {
    facilityGrade: 'C',
    corporateGrade: 'C',
    finalGrade: '2',
    finalGradeLabel: 'C',
    priority: 6,
    description: '施設・法人ともに改善が必要',
    employeeType: '全般的な改善が必要な職員',
    actionRequired: '集中的な改善支援、基礎研修の再受講、メンター配置',
    salaryImpact: '昇給見送りまたは最小限（基準の0-50%）',
    promotionPotential: '改善が確認されるまで昇進対象外'
  },
  {
    facilityGrade: 'B',
    corporateGrade: 'D',
    finalGrade: '2',
    finalGradeLabel: 'C',
    priority: 6,
    description: '施設内標準だが法人内では大幅改善必要',
    employeeType: '法人基準を大きく下回る',
    actionRequired: '法人基準の理解、基礎スキルの見直し、他施設研修',
    salaryImpact: '昇給見送りまたは最小限（基準の0-50%）',
    promotionPotential: '大幅な改善が必要'
  },
  {
    facilityGrade: 'D',
    corporateGrade: 'B',
    finalGrade: '2',
    finalGradeLabel: 'C',
    priority: 6,
    description: '法人内標準だが施設内では大幅改善必要',
    employeeType: '施設業務に大きな課題',
    actionRequired: '施設業務の基本から見直し、OJT強化、配置転換検討',
    salaryImpact: '昇給見送りまたは最小限（基準の0-50%）',
    promotionPotential: '施設適応が前提'
  },
  {
    facilityGrade: 'A',
    corporateGrade: 'D',
    finalGrade: '2',
    finalGradeLabel: 'C',
    priority: 6,
    description: '施設内上位だが法人内では大幅改善必要',
    employeeType: '法人基準との大きなギャップ',
    actionRequired: '法人全体での立ち位置確認、スキルの標準化',
    salaryImpact: '昇給見送りまたは最小限（基準の0-50%）',
    promotionPotential: '法人基準達成が必須'
  },
  {
    facilityGrade: 'D',
    corporateGrade: 'A',
    finalGrade: '2',
    finalGradeLabel: 'C',
    priority: 6,
    description: '法人内上位だが施設内では大幅改善必要',
    employeeType: '施設適応に重大な課題',
    actionRequired: '施設との適合性確認、配置転換の検討、基本業務の徹底',
    salaryImpact: '昇給見送りまたは最小限（基準の0-50%）',
    promotionPotential: '配置の見直しが優先'
  },
  {
    facilityGrade: 'C',
    corporateGrade: 'D',
    finalGrade: '2',
    finalGradeLabel: 'C',
    priority: 6,
    description: '施設内要改善、法人内大幅改善必要',
    employeeType: '全般的に低評価',
    actionRequired: '包括的な改善プログラム、密なフォローアップ',
    salaryImpact: '昇給見送りまたは最小限（基準の0-50%）',
    promotionPotential: '大幅な改善が確認されるまで対象外'
  },
  {
    facilityGrade: 'D',
    corporateGrade: 'C',
    finalGrade: '2',
    finalGradeLabel: 'C',
    priority: 6,
    description: '法人内要改善、施設内大幅改善必要',
    employeeType: '特に施設での課題が大きい',
    actionRequired: '施設業務の抜本的見直し、基礎からの再教育',
    salaryImpact: '昇給見送りまたは最小限（基準の0-50%）',
    promotionPotential: '改善プログラム完了後に再評価'
  },

  // ===== 最終評価 1 (D) : 大幅改善必要層 =====
  {
    facilityGrade: 'D',
    corporateGrade: 'D',
    finalGrade: '1',
    finalGradeLabel: 'D',
    priority: 7,
    description: '施設・法人両方で最下位評価、抜本的な改善が必要',
    employeeType: '緊急改善対象者',
    actionRequired: '改善計画書の作成、集中改善プログラム、定期面談、配置転換または退職勧奨の検討',
    salaryImpact: '昇給なし、場合により減給検討',
    promotionPotential: '昇進対象外、現職位の見直しも検討'
  }
];

// マトリックス早見表（5×5のグリッド形式）
export const matrixQuickReference = {
  headers: {
    facility: ['D', 'C', 'B', 'A', 'S'],
    corporate: ['D', 'C', 'B', 'A', 'S']
  },
  grid: [
    // 法人S行
    ['3(B)', '4(B+)', '5(A)', '6(S)', '7(S+)'],
    // 法人A行
    ['2(C)', '3(B)', '4(B+)', '5(A)', '6(S)'],
    // 法人B行
    ['2(C)', '3(B)', '3(B)', '4(B+)', '5(A)'],
    // 法人C行
    ['2(C)', '2(C)', '3(B)', '3(B)', '4(B+)'],
    // 法人D行
    ['1(D)', '2(C)', '2(C)', '2(C)', '3(B)']
  ]
};

// 給与影響の詳細定義
export const salaryImpactDetails = {
  '7': {
    label: 'S+',
    baseRate: 1.5,
    description: '基準の150%以上の昇給率',
    bonus: '年間賞与の特別加算（20%）'
  },
  '6': {
    label: 'S',
    baseRate: 1.35,
    description: '基準の130-140%の昇給率',
    bonus: '年間賞与の加算（15%）'
  },
  '5': {
    label: 'A',
    baseRate: 1.2,
    description: '基準の115-125%の昇給率',
    bonus: '年間賞与の加算（10%）'
  },
  '4': {
    label: 'B+',
    baseRate: 1.075,
    description: '基準の105-110%の昇給率',
    bonus: '年間賞与の加算（5%）'
  },
  '3': {
    label: 'B',
    baseRate: 1.0,
    description: '標準昇給率（基準の100%）',
    bonus: '標準賞与'
  },
  '2': {
    label: 'C',
    baseRate: 0.25,
    description: '昇給見送りまたは最小限（基準の0-50%）',
    bonus: '賞与減額（-10%）'
  },
  '1': {
    label: 'D',
    baseRate: 0,
    description: '昇給なし、場合により減給検討',
    bonus: '賞与大幅減額（-20%以上）'
  }
};

// ヘルパー関数：評価の組み合わせから最終評価を取得
export function getFinalGrade(facilityGrade: string, corporateGrade: string): MatrixTableEntry | undefined {
  return evaluationMatrixTable.find(
    entry => entry.facilityGrade === facilityGrade && entry.corporateGrade === corporateGrade
  );
}

// ヘルパー関数：最終評価から給与影響を取得
export function getSalaryImpact(finalGrade: string) {
  return salaryImpactDetails[finalGrade as keyof typeof salaryImpactDetails];
}