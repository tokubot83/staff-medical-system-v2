// 職種別質問のデバッグ
import { questionBank } from './src/lib/interview-bank/database/question-bank';
import { facilitySpecificQuestions } from './src/lib/interview-bank/database/facility-specific-questions';
import { comprehensiveSkillQuestions } from './src/lib/interview-bank/database/comprehensive-skill-questions';

const allQuestions = [...questionBank, ...facilitySpecificQuestions, ...comprehensiveSkillQuestions];

// 介護職向けの質問を確認
console.log('=== 介護職向けスキル評価質問 ===');
const careWorkerQuestions = allQuestions.filter(q => {
  if (!q.tags) return false;
  const hasSkillSection = q.sectionId === 'skill_evaluation' || q.section === 'skill_evaluation';
  const hasCareWorkerTag = q.tags.some(tag => 
    tag === 'care-worker' || 
    tag === '介護職' || 
    tag === '介護' ||
    tag === 'care_worker'
  );
  return hasSkillSection && hasCareWorkerTag;
});

console.log(`介護職向けスキル質問数: ${careWorkerQuestions.length}`);
careWorkerQuestions.forEach(q => {
  console.log(`- ${q.id}: ${q.content.substring(0, 50)}...`);
  console.log(`  tags: ${q.tags.join(', ')}`);
});

// 医事課向けの質問を確認
console.log('\n=== 医事課向けスキル評価質問 ===');
const medicalClerkQuestions = allQuestions.filter(q => {
  if (!q.tags) return false;
  const hasSkillSection = q.sectionId === 'skill_evaluation' || q.section === 'skill_evaluation';
  const hasMedicalClerkTag = q.tags.some(tag => 
    tag === 'medical-clerk' || 
    tag === '医事課' || 
    tag === '事務' ||
    tag === 'medical_clerk'
  );
  return hasSkillSection && hasMedicalClerkTag;
});

console.log(`医事課向けスキル質問数: ${medicalClerkQuestions.length}`);
medicalClerkQuestions.forEach(q => {
  console.log(`- ${q.id}: ${q.content.substring(0, 50)}...`);
  console.log(`  tags: ${q.tags.join(', ')}`);
});

// タグの分布を確認
console.log('\n=== タグ分布（職種関連） ===');
const tagCount = new Map<string, number>();
allQuestions.forEach(q => {
  if (q.tags) {
    q.tags.forEach(tag => {
      if (tag.includes('介護') || tag.includes('care') || 
          tag.includes('医事') || tag.includes('clerk') ||
          tag.includes('看護') || tag.includes('nurse')) {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      }
    });
  }
});

Array.from(tagCount.entries())
  .sort((a, b) => b[1] - a[1])
  .forEach(([tag, count]) => {
    console.log(`${tag}: ${count}件`);
  });