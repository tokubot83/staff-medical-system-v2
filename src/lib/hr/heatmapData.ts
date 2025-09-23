// generatePhaseData関数 - フェーズとフィルタに基づいてデータを生成
export function generatePhaseData(phase: number, filters?: any) {
  // phaseDataから対応するフェーズのデータを返す
  const selectedPhase = phaseData[phase] || phaseData[1];
  return selectedPhase;
}

// 評価制度の定義
export const evaluationSystem = {
  grades: {
    'S+': { label: '最優秀', color: '#d32f2f', percentage: 5 },
    'S': { label: '優秀', color: '#f57c00', percentage: 7 },
    'A+': { label: '良好上位', color: '#fbc02d', percentage: 8 },
    'A': { label: '良好', color: '#689f38', percentage: 15 },
    'B': { label: '標準', color: '#1976d2', percentage: 45 },
    'C': { label: '要改善', color: '#757575', percentage: 15 },
    'D': { label: '要指導', color: '#b71c1c', percentage: 5 }
  },
  distribution: {
    top: ['S+', 'S', 'A+'],      // 上位20%
    middle: ['A', 'B'],          // 中間60%
    low: ['C', 'D']              // 要支援20%
  }
};

// フェーズごとのデータ定義
export const phaseData = {
  1: {
    title: "第1段階（2026年4月〜）：キャリアコース制度導入",
    description: "自己選択による働き方の多様化開始。評価・等級未導入のため、選択と実態のギャップが大きい時期。上位層のAコース選択70%、中間層でも30%がAコースを選択する「期待過多」状態。【職員数：500名】",
    data: {
      top: {
        A: {
          percent: "70%",
          count: "70名",
          status: "ideal",
          intensity: "cell-intensity-5",
          priority: "low",
          action: "早期育成開始",
          gradeRange: "想定25-45級"
        },
        B: {
          percent: "25%",
          count: "25名",
          status: "acceptable",
          intensity: "cell-intensity-3",
          priority: "low",
          action: "施設リーダー育成",
          gradeRange: "想定20-35級"
        },
        C: {
          percent: "5%",
          count: "5名",
          status: "acceptable",
          intensity: "cell-intensity-2",
          priority: "low",
          action: "専門性強化",
          gradeRange: "想定15-28級"
        },
        D: {
          percent: "0%",
          count: "0名",
          status: "ideal",
          intensity: "cell-intensity-1",
          priority: "low",
          action: "該当なし",
          gradeRange: "-"
        }
      },
      middle: {
        A: {
          percent: "30%",
          count: "90名",
          status: "caution",
          intensity: "cell-warning-2",
          priority: "high",
          action: "期待値調整必要",
          gradeRange: "想定15-35級"
        },
        B: {
          percent: "40%",
          count: "120名",
          status: "ideal",
          intensity: "cell-intensity-5",
          priority: "low",
          action: "継続支援",
          gradeRange: "想定10-25級"
        },
        C: {
          percent: "20%",
          count: "60名",
          status: "acceptable",
          intensity: "cell-intensity-3",
          priority: "medium",
          action: "専門研修",
          gradeRange: "想定8-20級"
        },
        D: {
          percent: "10%",
          count: "30名",
          status: "acceptable",
          intensity: "cell-intensity-2",
          priority: "low",
          action: "WLB支援",
          gradeRange: "想定5-15級"
        }
      },
      low: {
        A: {
          percent: "10%",
          count: "10名",
          status: "alert",
          intensity: "cell-alert-3",
          priority: "high",
          action: "早期転換勧奨",
          gradeRange: "想定10-20級"
        },
        B: {
          percent: "30%",
          count: "30名",
          status: "caution",
          intensity: "cell-warning-1",
          priority: "medium",
          action: "基礎力強化",
          gradeRange: "想定5-15級"
        },
        C: {
          percent: "35%",
          count: "35名",
          status: "ideal",
          intensity: "cell-intensity-4",
          priority: "low",
          action: "適正配置",
          gradeRange: "想定3-12級"
        },
        D: {
          percent: "25%",
          count: "25名",
          status: "ideal",
          intensity: "cell-intensity-5",
          priority: "low",
          action: "継続就労支援",
          gradeRange: "想定1-10級"
        }
      }
    }
  },
  2: {
    title: "第2段階（2026年10月〜）：等級制度導入",
    description: "共通50等級制度により各コースの上限が明確化（A:50級、B:40級、C:30級、D:20級）。能力と選択の適正化が進む調整期。処遇差により現実的な選択へシフト。【職員数：500名】",
    courseStructure: {
      A: { ceiling: 50, coefficient: 1.2, label: "全範囲（1-50級）" },
      B: { ceiling: 40, coefficient: 1.1, label: "上限40級" },
      C: { ceiling: 30, coefficient: 1.0, label: "上限30級" },
      D: { ceiling: 20, coefficient: 0.9, label: "上限20級" }
    },
    data: {
      top: {
        A: {
          percent: "60%",
          count: "60名",
          status: "ideal",
          intensity: "cell-intensity-5",
          priority: "low",
          action: "幹部候補育成",
          gradeRange: "25-45級",
          gradeCeiling: "50級まで可"
        },
        B: {
          percent: "35%",
          count: "35名",
          status: "ideal",
          intensity: "cell-intensity-4",
          priority: "low",
          action: "施設運営参画",
          gradeRange: "20-35級",
          gradeCeiling: "上限40級"
        },
        C: {
          percent: "5%",
          count: "5名",
          status: "acceptable",
          intensity: "cell-intensity-3",
          priority: "medium",
          action: "専門職認定",
          gradeRange: "15-28級",
          gradeCeiling: "上限30級"
        },
        D: {
          percent: "0%",
          count: "0名",
          status: "ideal",
          intensity: "cell-intensity-1",
          priority: "low",
          action: "該当なし",
          gradeRange: "-",
          gradeCeiling: "-"
        }
      },
      middle: {
        A: {
          percent: "15%",
          count: "45名",
          status: "acceptable",
          intensity: "cell-intensity-3",
          priority: "medium",
          action: "昇格支援",
          gradeRange: "15-35級",
          gradeCeiling: "50級まで可"
        },
        B: {
          percent: "50%",
          count: "150名",
          status: "ideal",
          intensity: "cell-intensity-5",
          priority: "low",
          action: "中核人材育成",
          gradeRange: "10-25級",
          gradeCeiling: "上限40級"
        },
        C: {
          percent: "25%",
          count: "75名",
          status: "ideal",
          intensity: "cell-intensity-4",
          priority: "low",
          action: "技術向上",
          gradeRange: "8-20級",
          gradeCeiling: "上限30級"
        },
        D: {
          percent: "10%",
          count: "30名",
          status: "acceptable",
          intensity: "cell-intensity-2",
          priority: "low",
          action: "復帰支援",
          gradeRange: "5-15級",
          gradeCeiling: "上限20級"
        }
      },
      low: {
        A: {
          percent: "2%",
          count: "2名",
          status: "alert",
          intensity: "cell-alert-2",
          priority: "high",
          action: "即時転換",
          gradeRange: "10-20級",
          gradeCeiling: "要コース変更"
        },
        B: {
          percent: "38%",
          count: "38名",
          status: "acceptable",
          intensity: "cell-intensity-3",
          priority: "medium",
          action: "段階的育成",
          gradeRange: "5-15級",
          gradeCeiling: "上限40級"
        },
        C: {
          percent: "40%",
          count: "40名",
          status: "ideal",
          intensity: "cell-intensity-5",
          priority: "low",
          action: "定型業務最適化",
          gradeRange: "3-12級",
          gradeCeiling: "上限30級"
        },
        D: {
          percent: "20%",
          count: "20名",
          status: "ideal",
          intensity: "cell-intensity-4",
          priority: "low",
          action: "健康管理",
          gradeRange: "1-10級",
          gradeCeiling: "上限20級"
        }
      }
    }
  },
  3: {
    title: "第3段階（2027年4月〜）：評価制度導入（完成形）",
    description: "3軸統合により精密な人材マネジメントが実現。共通50等級制度×7段階評価×4コースの組み合わせで個別最適配置を実現。【職員数：500名】",
    courseStructure: {
      A: { ceiling: 50, coefficient: 1.2, label: "全範囲（1-50級）" },
      B: { ceiling: 40, coefficient: 1.1, label: "上限40級" },
      C: { ceiling: 30, coefficient: 1.0, label: "上限30級" },
      D: { ceiling: 20, coefficient: 0.9, label: "上限20級" }
    },
    data: {
      top: {
        A: {
          percent: "50%",
          count: "50名",
          status: "ideal",
          intensity: "cell-intensity-5",
          priority: "low",
          action: "経営層育成",
          gradeRange: "30-48級",
          gradeCeiling: "50級到達可",
          evaluation: { 'S+': 40, 'S': 35, 'A+': 20, 'A': 5 }
        },
        B: {
          percent: "40%",
          count: "40名",
          status: "ideal",
          intensity: "cell-intensity-5",
          priority: "low",
          action: "施設幹部化",
          gradeRange: "25-38級",
          gradeCeiling: "上限40級",
          evaluation: { 'S+': 10, 'S': 30, 'A+': 35, 'A': 25 }
        },
        C: {
          percent: "10%",
          count: "10名",
          status: "ideal",
          intensity: "cell-intensity-4",
          priority: "low",
          action: "エキスパート認定",
          gradeRange: "20-29級",
          gradeCeiling: "上限30級",
          evaluation: { 'S': 15, 'A+': 40, 'A': 45 }
        },
        D: {
          percent: "0%",
          count: "0名",
          status: "ideal",
          intensity: "cell-intensity-1",
          priority: "low",
          action: "該当なし",
          gradeRange: "-",
          gradeCeiling: "-",
          evaluation: {}
        }
      },
      middle: {
        A: {
          percent: "10%",
          count: "30名",
          status: "ideal",
          intensity: "cell-intensity-4",
          priority: "low",
          action: "選抜育成",
          gradeRange: "20-40級",
          gradeCeiling: "50級到達可",
          evaluation: { 'A+': 15, 'A': 45, 'B': 40 }
        },
        B: {
          percent: "45%",
          count: "135名",
          status: "ideal",
          intensity: "cell-intensity-5",
          priority: "low",
          action: "実務リーダー化",
          gradeRange: "15-30級",
          gradeCeiling: "上限40級",
          evaluation: { 'A': 25, 'B': 65, 'C': 10 }
        },
        C: {
          percent: "35%",
          count: "105名",
          status: "ideal",
          intensity: "cell-intensity-5",
          priority: "low",
          action: "専門性深化",
          gradeRange: "10-22級",
          gradeCeiling: "上限30級",
          evaluation: { 'A': 10, 'B': 70, 'C': 20 }
        },
        D: {
          percent: "10%",
          count: "30名",
          status: "acceptable",
          intensity: "cell-intensity-3",
          priority: "low",
          action: "柔軟勤務継続",
          gradeRange: "8-18級",
          gradeCeiling: "上限20級",
          evaluation: { 'B': 50, 'C': 40, 'D': 10 }
        }
      },
      low: {
        A: {
          percent: "1%",
          count: "1名",
          status: "alert",
          intensity: "cell-alert-1",
          priority: "high",
          action: "個別対応",
          gradeRange: "15-25級",
          gradeCeiling: "要転換検討",
          evaluation: { 'C': 75, 'D': 25 }
        },
        B: {
          percent: "34%",
          count: "34名",
          status: "acceptable",
          intensity: "cell-intensity-3",
          priority: "medium",
          action: "補助役割明確化",
          gradeRange: "8-20級",
          gradeCeiling: "上限40級",
          evaluation: { 'C': 60, 'D': 40 }
        },
        C: {
          percent: "45%",
          count: "45名",
          status: "ideal",
          intensity: "cell-intensity-5",
          priority: "low",
          action: "業務標準化",
          gradeRange: "5-15級",
          gradeCeiling: "上限30級",
          evaluation: { 'C': 70, 'D': 30 }
        },
        D: {
          percent: "20%",
          count: "20名",
          status: "ideal",
          intensity: "cell-intensity-5",
          priority: "low",
          action: "定年後準備",
          gradeRange: "3-12級",
          gradeCeiling: "上限20級",
          evaluation: { 'C': 50, 'D': 50 }
        }
      }
    },
    hiddenTalents: [
      { name: "施設内D×法人内B", count: 5, type: "環境不適合", action: "施設異動検討" },
      { name: "施設内B×法人内S", count: 3, type: "専門性突出", action: "法人プロジェクト参画" },
      { name: "施設内S×法人内C", count: 7, type: "ローカル特化", action: "施設内権限強化" }
    ]
  }
};

// アクションサマリーデータ
export const actionSummaryData = {
  1: {
    top: [
      "Aコース選択者の早期育成プログラム開始",
      "法人横断プロジェクトへの参画機会提供",
      "次世代リーダー候補としての意識付け"
    ],
    middle: [
      "Aコース選択者への現実的な期待値調整",
      "B・Cコースの魅力と可能性の説明強化",
      "個別キャリアカウンセリングの実施"
    ],
    low: [
      "Aコース選択者への早期コース変更勧奨",
      "C・Dコースでの安定就労支援",
      "基礎スキル向上研修の優先実施"
    ]
  },
  2: {
    top: [
      "等級上位者の幹部候補プログラム本格化",
      "施設運営への段階的参画",
      "外部研修・MBA派遣の検討"
    ],
    middle: [
      "等級に応じた役割の明確化",
      "昇格要件の個別目標設定",
      "専門資格取得支援の強化"
    ],
    low: [
      "適正等級への配置調整",
      "基礎業務の標準化推進",
      "メンター制度による個別支援"
    ]
  },
  3: {
    top: [
      "サクセッションプラン策定",
      "戦略立案への直接参画",
      "法人全体の変革リーダー育成"
    ],
    middle: [
      "評価に基づく個別育成計画",
      "部門横断プロジェクトリード",
      "後進指導役としての役割付与"
    ],
    low: [
      "強みを活かした配置最適化",
      "チーム補助役としての明確化",
      "継続就労のための環境整備"
    ]
  }
};

// 施設データ（フィルタリング用）
export const facilityData = {
  all: { name: '法人全体', count: 500 },
  hospital_a: { name: '厚生病院', count: 180 },
  hospital_b: { name: '関連病院', count: 120 },
  clinic_a: { name: 'クリニックA', count: 80 },
  clinic_b: { name: 'クリニックB', count: 60 },
  nursing_home: { name: '老健施設', count: 60 }
};

// 職種データ（フィルタリング用）
export const positionData = {
  all: { name: '全職種', count: 500 },
  nurse: { name: '看護師', count: 200 },
  doctor: { name: '医師', count: 30 },
  pharmacist: { name: '薬剤師', count: 25 },
  therapist: { name: '療法士', count: 45 },
  technician: { name: '技師', count: 40 },
  clerk: { name: '事務', count: 80 },
  care_worker: { name: '介護士', count: 50 },
  other: { name: 'その他', count: 30 }
};