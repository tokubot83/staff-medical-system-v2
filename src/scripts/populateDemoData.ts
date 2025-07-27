import { generateAllCohortDemoData } from '@/utils/generateCohortDemoData';
import fs from 'fs';
import path from 'path';

// デモデータを生成してファイルに保存
function populateDemoData() {
  console.log('コホート分析用デモデータを生成中...');
  
  // デモデータを生成
  const demoStaff = generateAllCohortDemoData();
  
  console.log(`生成されたスタッフ数: ${demoStaff.length}`);
  console.log('\n施設別内訳:');
  
  const facilityCount = demoStaff.reduce((acc, staff) => {
    acc[staff.facility] = (acc[staff.facility] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  Object.entries(facilityCount).forEach(([facility, count]) => {
    console.log(`  ${facility}: ${count}名`);
  });
  
  console.log('\n職種別内訳:');
  
  const positionCount = demoStaff.reduce((acc, staff) => {
    const basePosition = staff.position.replace(/主任|師長|部長|科長/, '').trim();
    acc[basePosition] = (acc[basePosition] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  Object.entries(positionCount).forEach(([position, count]) => {
    console.log(`  ${position}: ${count}名`);
  });
  
  console.log('\n世代別内訳:');
  
  const generationCount = demoStaff.reduce((acc, staff) => {
    const age = staff.age;
    let generation: string;
    if (age < 27) generation = 'Z世代';
    else if (age < 43) generation = 'ミレニアル世代';
    else if (age < 59) generation = 'X世代';
    else generation = 'ベビーブーマー世代';
    
    acc[generation] = (acc[generation] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  Object.entries(generationCount).forEach(([generation, count]) => {
    console.log(`  ${generation}: ${count}名`);
  });
  
  // JSONファイルとして保存
  const outputDir = path.join(process.cwd(), 'src', 'app', 'data', 'generated');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, 'cohortDemoData.json');
  fs.writeFileSync(outputPath, JSON.stringify(demoStaff, null, 2), 'utf-8');
  
  console.log(`\nデモデータを ${outputPath} に保存しました。`);
  
  // TypeScriptファイルとしても保存（インポート用）
  const tsContent = `// 自動生成されたコホート分析用デモデータ
// 生成日時: ${new Date().toISOString()}

import { StaffDetail } from '@/types/staff';

export const cohortDemoData: StaffDetail[] = ${JSON.stringify(demoStaff, null, 2)};

// データベース形式に変換
export const cohortDemoDatabase: Record<string, StaffDetail> = cohortDemoData.reduce(
  (acc, staff) => {
    acc[staff.id] = staff;
    return acc;
  },
  {} as Record<string, StaffDetail>
);

// 統計情報
export const cohortDemoStats = {
  totalStaff: ${demoStaff.length},
  byFacility: ${JSON.stringify(facilityCount, null, 2)},
  byPosition: ${JSON.stringify(positionCount, null, 2)},
  byGeneration: ${JSON.stringify(generationCount, null, 2)},
  generatedAt: '${new Date().toISOString()}'
};
`;
  
  const tsPath = path.join(outputDir, 'cohortDemoData.ts');
  fs.writeFileSync(tsPath, tsContent, 'utf-8');
  
  console.log(`TypeScriptファイルを ${tsPath} に保存しました。`);
}

// スクリプトを実行
if (require.main === module) {
  populateDemoData();
}