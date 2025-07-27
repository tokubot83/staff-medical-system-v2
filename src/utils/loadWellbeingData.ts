import { WellbeingData, WellbeingAggregateData, InterventionProgram } from '@/types/wellbeing';
import { StaffDetail } from '@/types/staff';
import { generateAllCohortDemoData } from '@/utils/generateCohortDemoData';

// デモデータをインポート
import wellbeingDemoData from '@/data/wellbeing/wellbeingDemoData.json';

interface WellbeingDataset {
  individual: WellbeingData[];
  aggregates: {
    byDepartment: WellbeingAggregateData[];
    byPosition: WellbeingAggregateData[];
    byFacility: WellbeingAggregateData[];
  };
  trends: {
    category: string;
    name: string;
    data: {
      period: string;
      wellbeingIndex: number;
      stressLevel: number;
      engagement: number;
      workLifeBalance: number;
    }[];
  }[];
  interventionPrograms: InterventionProgram[];
}

// データを読み込む関数
export function loadWellbeingData(): WellbeingDataset {
  return wellbeingDemoData as WellbeingDataset;
}

// 施設でフィルタリングする関数
export function filterByFacility(data: WellbeingData[], facility: string): WellbeingData[] {
  if (!facility || facility === '全施設') {
    return data;
  }
  return data.filter(item => item.facility === facility);
}

// 集計データを取得する関数
export function getAggregateData(
  type: 'department' | 'position' | 'facility',
  name?: string
): WellbeingAggregateData[] {
  const dataset = loadWellbeingData();
  const aggregates = {
    department: dataset.aggregates.byDepartment,
    position: dataset.aggregates.byPosition,
    facility: dataset.aggregates.byFacility
  };
  
  const data = aggregates[type];
  
  if (name) {
    return data.filter(item => item.name === name);
  }
  
  return data;
}

// トレンドデータを取得する関数
export function getTrendData(category: string, name: string) {
  const dataset = loadWellbeingData();
  return dataset.trends.find(
    trend => trend.category === category && trend.name === name
  );
}

// 介入プログラムを取得する関数
export function getInterventionPrograms(): InterventionProgram[] {
  const dataset = loadWellbeingData();
  return dataset.interventionPrograms;
}

// スコアの分布を計算する関数
export function calculateDistribution(data: WellbeingData[]) {
  const distribution = {
    excellent: 0,
    good: 0,
    fair: 0,
    poor: 0
  };
  
  data.forEach(item => {
    const score = item.wellbeingIndex.overall;
    if (score >= 80) distribution.excellent++;
    else if (score >= 60) distribution.good++;
    else if (score >= 40) distribution.fair++;
    else distribution.poor++;
  });
  
  return distribution;
}

// ウェルビーイングデータとスタッフ情報を結合する関数
export function getWellbeingWithStaffInfo(wellbeingData: WellbeingData[]): (WellbeingData & { age?: number })[] {
  const staffData = generateAllCohortDemoData();
  
  return wellbeingData.map(wb => {
    const staff = staffData.find(s => s.id === wb.staffId);
    return {
      ...wb,
      age: staff?.age
    };
  });
}

// 平均スコアを計算する関数
export function calculateAverageScores(data: WellbeingData[]) {
  if (data.length === 0) {
    return {
      wellbeingIndex: 0,
      stressLevel: 0,
      engagement: 0,
      workLifeBalance: 0
    };
  }
  
  const sum = data.reduce((acc, item) => {
    const stressAvg = Object.values(item.stressFactors).reduce((a, b) => a + b, 0) / 6;
    
    return {
      wellbeingIndex: acc.wellbeingIndex + item.wellbeingIndex.overall,
      stressLevel: acc.stressLevel + stressAvg,
      engagement: acc.engagement + item.engagementScore.overall,
      workLifeBalance: acc.workLifeBalance + item.workLifeBalance.overall
    };
  }, { wellbeingIndex: 0, stressLevel: 0, engagement: 0, workLifeBalance: 0 });
  
  return {
    wellbeingIndex: sum.wellbeingIndex / data.length,
    stressLevel: sum.stressLevel / data.length,
    engagement: sum.engagement / data.length,
    workLifeBalance: sum.workLifeBalance / data.length
  };
}