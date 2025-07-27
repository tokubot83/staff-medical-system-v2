import { generateAllCohortDemoData } from '../utils/generateCohortDemoData';
import { StaffDetail } from '../types/staff';
import * as fs from 'fs';
import * as path from 'path';

// デモデータを生成してファイルに保存
function saveDemoDataToFile() {
  console.log('デモデータの生成を開始します...');
  
  // デモデータを生成
  const demoData = generateAllCohortDemoData();
  console.log(`生成されたスタッフ数: ${demoData.length}名`);
  
  // スタッフをオブジェクト形式に変換
  const cohortDemoDatabase: Record<string, StaffDetail> = {};
  demoData.forEach(staff => {
    cohortDemoDatabase[staff.id] = staff;
  });
  
  // TypeScriptファイルとして出力
  const outputContent = `import { StaffDetail } from '@/types/staff';

// コホート分析用デモデータ（自動生成）
// 生成日時: ${new Date().toLocaleString('ja-JP')}
// 総スタッフ数: ${demoData.length}名

export const cohortDemoDatabase: Record<string, StaffDetail> = ${JSON.stringify(cohortDemoDatabase, null, 2)};
`;
  
  // 出力ディレクトリの作成
  const outputDir = path.join(__dirname, '../app/data/generated');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // ファイルに保存
  const outputPath = path.join(outputDir, 'cohortDemoData.ts');
  fs.writeFileSync(outputPath, outputContent, 'utf-8');
  
  console.log(`デモデータを保存しました: ${outputPath}`);
  
  // 職種別の統計を表示
  const positionStats: Record<string, number> = {};
  const facilityStats: Record<string, number> = {};
  
  demoData.forEach(staff => {
    const basePosition = staff.position.replace(/主任|師長|部長|科長/, '').trim();
    positionStats[basePosition] = (positionStats[basePosition] || 0) + 1;
    facilityStats[staff.facility] = (facilityStats[staff.facility] || 0) + 1;
  });
  
  console.log('\n=== 職種別統計 ===');
  Object.entries(positionStats).forEach(([position, count]) => {
    console.log(`${position}: ${count}名`);
  });
  
  console.log('\n=== 施設別統計 ===');
  Object.entries(facilityStats).forEach(([facility, count]) => {
    console.log(`${facility}: ${count}名`);
  });
}

// 実行
saveDemoDataToFile();