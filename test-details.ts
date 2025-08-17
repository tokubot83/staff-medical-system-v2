import { generateInterviewSheet } from './src/lib/interview-bank/services/generator';
import { ExtendedInterviewParams } from './src/lib/interview-bank/types-extended';
import { questionBank } from './src/lib/interview-bank/database/question-bank';

// スキル評価セクションの看護師向け質問を確認
console.log('=== スキル評価セクションの看護師向け質問 ===');
const nurseSkillQuestions = questionBank.filter(q => {
  // スキル評価セクション
  const isSkillSection = q.sectionId === 'skill_evaluation' || 
                        q.section === 'skill_evaluation' ||
                        q.category === 'skill_assessment';
  
  // 看護師向け
  const forNurse = !q.conditions || 
                   q.conditions.length === 0 ||
                   q.conditions.some(c => 
                     c.type === 'profession' && 
                     c.values.includes('nurse')
                   );
  
  return isSkillSection && forNurse;
});

console.log(`該当質問数: ${nurseSkillQuestions.length}`);
console.log('\n優先度別:');
console.log(`優先度1（必須）: ${nurseSkillQuestions.filter(q => q.priority === 1).length}問`);
console.log(`優先度2（推奨）: ${nurseSkillQuestions.filter(q => q.priority === 2).length}問`);
console.log(`優先度3（オプション）: ${nurseSkillQuestions.filter(q => q.priority === 3).length}問`);

console.log('\n必須質問の内容:');
nurseSkillQuestions
  .filter(q => q.priority === 1)
  .slice(0, 10)
  .forEach((q, i) => {
    console.log(`${i+1}. ${q.content}`);
    console.log(`   - scoreWeight: ${q.scoreWeight || 1.0}`);
  });