// 定期面談バンクに登録済みの質問を確認
import { questionBank } from './src/lib/interview-bank/database/question-bank';

// 職種別の質問数を集計
const professionCount = new Map<string, number>();
const sectionCount = new Map<string, number>();

questionBank.forEach(q => {
  // セクション別集計
  if (q.sectionId) {
    sectionCount.set(q.sectionId, (sectionCount.get(q.sectionId) || 0) + 1);
  }
  
  // 職種別集計
  if (q.tags) {
    q.tags.forEach(tag => {
      if (['看護師', '准看護師', '看護補助者', '介護職', '理学療法士', '作業療法士', '言語聴覚士', '医事課'].includes(tag)) {
        professionCount.set(tag, (professionCount.get(tag) || 0) + 1);
      }
    });
  }
});

console.log('=== 定期面談バンクに登録済みの質問 ===\n');

console.log('【職種別質問数】');
professionCount.forEach((count, profession) => {
  console.log(`${profession}: ${count}問`);
});

console.log('\n【セクション別質問数】');
sectionCount.forEach((count, section) => {
  console.log(`${section}: ${count}問`);
});

console.log(`\n総質問数: ${questionBank.length}問`);

// 具体例を表示
console.log('\n【介護職の質問例】');
questionBank
  .filter(q => q.tags && q.tags.includes('介護職'))
  .slice(0, 3)
  .forEach(q => {
    console.log(`- ${q.content.substring(0, 60)}...`);
  });

console.log('\n【医事課の質問例】');
questionBank
  .filter(q => q.tags && q.tags.includes('医事課'))
  .slice(0, 3)
  .forEach(q => {
    console.log(`- ${q.content.substring(0, 60)}...`);
  });