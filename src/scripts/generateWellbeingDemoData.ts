import { generateAllCohortDemoData } from '@/utils/generateCohortDemoData';
import { WellbeingData, WellbeingAggregateData, InterventionProgram } from '@/types/wellbeing';
import { StaffDetail } from '@/types/staff';

// 介入プログラムの定義
const interventionPrograms: InterventionProgram[] = [
  {
    id: 'prog-001',
    name: 'マインドフルネス研修',
    type: 'mental',
    description: 'ストレス軽減とメンタルヘルス向上のためのマインドフルネス実践プログラム',
    targetGroup: ['全職種'],
    duration: '8週間',
    frequency: '週1回60分',
    expectedOutcome: 'ストレス指数の20%改善'
  },
  {
    id: 'prog-002',
    name: 'チームビルディングワークショップ',
    type: 'team',
    description: '部署内のコミュニケーション活性化とチームワーク向上プログラム',
    targetGroup: ['看護部', 'リハビリテーション部門'],
    duration: '3ヶ月',
    frequency: '月2回90分',
    expectedOutcome: 'エンゲージメントスコアの15%向上'
  },
  {
    id: 'prog-003',
    name: '腰痛予防エクササイズ',
    type: 'physical',
    description: '介護・看護職員向けの腰痛予防と身体機能向上プログラム',
    targetGroup: ['看護師', '看護補助者', '介護士', '介護福祉士'],
    duration: '6ヶ月',
    frequency: '週2回30分',
    expectedOutcome: '腰痛による欠勤日数の50%削減'
  },
  {
    id: 'prog-004',
    name: 'キャリア開発プログラム',
    type: 'skill',
    description: '専門スキル向上とキャリアパス明確化のための個別支援プログラム',
    targetGroup: ['全職種'],
    duration: '1年',
    frequency: '月1回面談',
    expectedOutcome: '成長実感度の30%向上'
  }
];

// ランダム値生成のヘルパー関数
function randomFloat(min: number, max: number, decimals: number = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round((Math.random() * (max - min) + min) * factor) / factor;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 職種別の特性を定義
function getPositionCharacteristics(position: string) {
  const characteristics: Record<string, any> = {
    '看護師': {
      stressFactors: { workload: [65, 85], relationships: [40, 60], workControl: [50, 70] },
      wellbeingBase: { physical: [60, 75], mental: [65, 80], social: [70, 85] },
      workLifeBalance: { workTime: [50, 65], privateTime: [40, 60] }
    },
    '看護補助者': {
      stressFactors: { workload: [60, 80], relationships: [35, 55], workControl: [40, 60] },
      wellbeingBase: { physical: [55, 70], mental: [60, 75], social: [65, 80] },
      workLifeBalance: { workTime: [55, 70], privateTime: [45, 65] }
    },
    '介護士': {
      stressFactors: { workload: [70, 85], relationships: [45, 65], workControl: [45, 65] },
      wellbeingBase: { physical: [50, 65], mental: [60, 75], social: [70, 85] },
      workLifeBalance: { workTime: [45, 60], privateTime: [40, 55] }
    },
    '介護福祉士': {
      stressFactors: { workload: [65, 80], relationships: [40, 60], workControl: [55, 75] },
      wellbeingBase: { physical: [55, 70], mental: [65, 80], social: [75, 90] },
      workLifeBalance: { workTime: [50, 65], privateTime: [45, 60] }
    },
    '理学療法士': {
      stressFactors: { workload: [55, 75], relationships: [30, 50], workControl: [60, 80] },
      wellbeingBase: { physical: [70, 85], mental: [70, 85], social: [65, 80] },
      workLifeBalance: { workTime: [60, 75], privateTime: [55, 70] }
    },
    '作業療法士': {
      stressFactors: { workload: [50, 70], relationships: [30, 50], workControl: [65, 85] },
      wellbeingBase: { physical: [65, 80], mental: [70, 85], social: [70, 85] },
      workLifeBalance: { workTime: [65, 80], privateTime: [60, 75] }
    }
  };

  // デフォルト値（その他の職種用）
  const defaultCharacteristics = {
    stressFactors: { workload: [55, 75], relationships: [35, 55], workControl: [50, 70] },
    wellbeingBase: { physical: [60, 75], mental: [65, 80], social: [70, 85] },
    workLifeBalance: { workTime: [55, 70], privateTime: [50, 65] }
  };

  // 職種名から基本職種を抽出（主任、師長などの役職を除外）
  const basePosition = Object.keys(characteristics).find(key => position.includes(key));
  return basePosition ? characteristics[basePosition] : defaultCharacteristics;
}

// 個人のウェルビーイングデータを生成
function generateIndividualWellbeingData(
  staff: StaffDetail,
  period: string
): WellbeingData {
  const characteristics = getPositionCharacteristics(staff.position);
  
  // 年齢による調整
  const ageAdjustment = staff.age < 30 ? 0.9 : staff.age > 50 ? 1.1 : 1.0;
  
  // ストレス要因の生成
  const stressFactors = {
    workload: randomFloat(characteristics.stressFactors.workload[0], characteristics.stressFactors.workload[1]) * ageAdjustment,
    relationships: randomFloat(characteristics.stressFactors.relationships[0], characteristics.stressFactors.relationships[1]),
    workControl: randomFloat(characteristics.stressFactors.workControl[0], characteristics.stressFactors.workControl[1]),
    reward: randomFloat(50, 80),
    workEnvironment: randomFloat(60, 85),
    change: randomFloat(40, 70)
  };
  
  // ストレスレベルの平均値を計算
  const avgStress = Object.values(stressFactors).reduce((a, b) => a + b, 0) / Object.values(stressFactors).length;
  
  // ウェルビーイング指標の生成（ストレスと逆相関）
  const stressImpact = (100 - avgStress) / 100;
  const wellbeingIndex = {
    physical: randomFloat(characteristics.wellbeingBase.physical[0], characteristics.wellbeingBase.physical[1]) * stressImpact,
    mental: randomFloat(characteristics.wellbeingBase.mental[0], characteristics.wellbeingBase.mental[1]) * stressImpact,
    social: randomFloat(characteristics.wellbeingBase.social[0], characteristics.wellbeingBase.social[1]),
    purpose: randomFloat(65, 90),
    growth: randomFloat(60, 85),
    overall: 0 // 後で計算
  };
  
  // 総合指標の計算
  wellbeingIndex.overall = (
    wellbeingIndex.physical * 0.2 +
    wellbeingIndex.mental * 0.25 +
    wellbeingIndex.social * 0.2 +
    wellbeingIndex.purpose * 0.2 +
    wellbeingIndex.growth * 0.15
  );
  
  // ワークライフバランスの生成
  const workLifeBalance = {
    workTime: randomFloat(characteristics.workLifeBalance.workTime[0], characteristics.workLifeBalance.workTime[1]),
    privateTime: randomFloat(characteristics.workLifeBalance.privateTime[0], characteristics.workLifeBalance.privateTime[1]),
    flexibility: randomFloat(50, 75),
    familySupport: randomFloat(55, 80),
    selfCare: randomFloat(45, 70),
    overall: 0
  };
  
  // 総合バランスの計算
  workLifeBalance.overall = Object.values(workLifeBalance)
    .slice(0, -1)
    .reduce((a, b) => a + b, 0) / 5;
  
  // エンゲージメントスコアの生成
  const baseEngagement = staff.engagement || 75;
  const engagementScore = {
    vigor: randomFloat(baseEngagement - 10, baseEngagement + 10),
    dedication: randomFloat(baseEngagement - 5, baseEngagement + 15),
    absorption: randomFloat(baseEngagement - 15, baseEngagement + 5),
    overall: baseEngagement,
    trend: Math.random() > 0.7 ? 'up' : Math.random() > 0.4 ? 'stable' : 'down'
  };
  
  // 介入プログラムの効果（30%の確率で参加）
  const interventionEffects = Math.random() > 0.7 ? [] : [
    {
      programId: interventionPrograms[randomInt(0, 3)].id,
      programName: interventionPrograms[randomInt(0, 3)].name,
      startDate: '2024年6月',
      preScore: randomFloat(50, 70),
      postScore: randomFloat(65, 85),
      improvement: randomFloat(10, 30),
      feedback: '効果を実感している'
    }
  ];
  
  return {
    staffId: staff.id,
    period,
    facility: staff.facility,
    department: staff.department,
    position: staff.position,
    wellbeingIndex,
    stressFactors,
    workLifeBalance,
    engagementScore,
    interventionEffects
  };
}

// 集計データの生成
function generateAggregateData(
  wellbeingDataList: WellbeingData[],
  category: 'department' | 'position' | 'facility',
  name: string,
  period: string
): WellbeingAggregateData {
  const filteredData = wellbeingDataList.filter(data => {
    if (category === 'department') return data.department === name;
    if (category === 'position') return data.position === name;
    if (category === 'facility') return data.facility === name;
    return false;
  });
  
  const staffCount = filteredData.length;
  if (staffCount === 0) {
    return {
      category,
      name,
      period,
      staffCount: 0,
      averageScores: {
        wellbeingIndex: 0,
        stressLevel: 0,
        workLifeBalance: 0,
        engagement: 0
      },
      distribution: {
        excellent: 0,
        good: 0,
        fair: 0,
        poor: 0
      }
    };
  }
  
  // 平均スコアの計算
  const averageScores = {
    wellbeingIndex: filteredData.reduce((sum, d) => sum + d.wellbeingIndex.overall, 0) / staffCount,
    stressLevel: filteredData.reduce((sum, d) => {
      const avgStress = Object.values(d.stressFactors).reduce((a, b) => a + b, 0) / 6;
      return sum + avgStress;
    }, 0) / staffCount,
    workLifeBalance: filteredData.reduce((sum, d) => sum + d.workLifeBalance.overall, 0) / staffCount,
    engagement: filteredData.reduce((sum, d) => sum + d.engagementScore.overall, 0) / staffCount
  };
  
  // 分布の計算
  const distribution = {
    excellent: 0,
    good: 0,
    fair: 0,
    poor: 0
  };
  
  filteredData.forEach(data => {
    const score = data.wellbeingIndex.overall;
    if (score >= 80) distribution.excellent++;
    else if (score >= 60) distribution.good++;
    else if (score >= 40) distribution.fair++;
    else distribution.poor++;
  });
  
  return {
    category,
    name,
    period,
    staffCount,
    averageScores,
    distribution
  };
}

// メイン関数：全データを生成
export function generateWellbeingDemoData() {
  // スタッフデータを生成
  const allStaff = generateAllCohortDemoData();
  
  // 現在の期間
  const currentPeriod = '2024-12';
  
  // 個人のウェルビーイングデータを生成
  const wellbeingDataList: WellbeingData[] = allStaff.map(staff => 
    generateIndividualWellbeingData(staff, currentPeriod)
  );
  
  // 部署別集計データ
  const departments = [...new Set(allStaff.map(s => s.department))];
  const departmentAggregates = departments.map(dept => 
    generateAggregateData(wellbeingDataList, 'department', dept, currentPeriod)
  );
  
  // 職種別集計データ
  const positions = [...new Set(allStaff.map(s => s.position))];
  const positionAggregates = positions.map(pos => 
    generateAggregateData(wellbeingDataList, 'position', pos, currentPeriod)
  );
  
  // 施設別集計データ
  const facilities = [...new Set(allStaff.map(s => s.facility))];
  const facilityAggregates = facilities.map(fac => 
    generateAggregateData(wellbeingDataList, 'facility', fac, currentPeriod)
  );
  
  // 過去12ヶ月分のトレンドデータを生成
  const trendData = generateTrendData(allStaff);
  
  return {
    individual: wellbeingDataList,
    aggregates: {
      byDepartment: departmentAggregates,
      byPosition: positionAggregates,
      byFacility: facilityAggregates
    },
    trends: trendData,
    interventionPrograms
  };
}

// トレンドデータの生成
function generateTrendData(staffList: StaffDetail[]) {
  const months = 12;
  const trends: any[] = [];
  
  // 施設別トレンド
  const facilities = [...new Set(staffList.map(s => s.facility))];
  facilities.forEach(facility => {
    const data = [];
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      // トレンドを持たせるため、徐々に改善
      const improvement = (months - i) * 0.5;
      
      data.push({
        period,
        wellbeingIndex: randomFloat(65 + improvement, 75 + improvement),
        stressLevel: randomFloat(60 - improvement * 0.5, 70 - improvement * 0.5),
        engagement: randomFloat(70 + improvement * 0.3, 80 + improvement * 0.3),
        workLifeBalance: randomFloat(60 + improvement * 0.4, 70 + improvement * 0.4)
      });
    }
    
    trends.push({
      category: 'facility',
      name: facility,
      data
    });
  });
  
  return trends;
}

// データをファイルに保存
export async function saveWellbeingDemoData() {
  const data = generateWellbeingDemoData();
  
  // Node.js環境でのファイル保存
  if (typeof window === 'undefined') {
    const fs = await import('fs');
    const path = await import('path');
    
    const outputDir = path.join(process.cwd(), 'src', 'data', 'wellbeing');
    
    // ディレクトリが存在しない場合は作成
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // データを保存
    fs.writeFileSync(
      path.join(outputDir, 'wellbeingDemoData.json'),
      JSON.stringify(data, null, 2)
    );
    
    console.log('✅ ウェルビーイングデモデータを生成しました:', outputDir);
    console.log(`  - 個人データ: ${data.individual.length}件`);
    console.log(`  - 部署別集計: ${data.aggregates.byDepartment.length}件`);
    console.log(`  - 職種別集計: ${data.aggregates.byPosition.length}件`);
    console.log(`  - 施設別集計: ${data.aggregates.byFacility.length}件`);
    console.log(`  - 介入プログラム: ${data.interventionPrograms.length}件`);
  }
  
  return data;
}

// スクリプトとして実行された場合
if (require.main === module) {
  saveWellbeingDemoData();
}