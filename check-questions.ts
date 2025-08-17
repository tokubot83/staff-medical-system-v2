import { questionBank } from './src/lib/interview-bank/database/question-bank';

// スキル評価セクションの質問を確認
const skillQuestions = questionBank.filter(q => 
  q.sectionId === 'skill_evaluation' || 
  q.section === 'skill_evaluation' ||
  q.category === 'skill_assessment'
);

console.log('スキル評価関連の質問数:', skillQuestions.length);
console.log('\n看護師向けスキル質問:');
skillQuestions
  .filter(q => !q.conditions || q.conditions.length === 0 || 
    q.conditions.some(c => c.type === 'profession' && c.values.includes('nurse')))
  .slice(0, 10)
  .forEach(q => console.log(' -', q.content));

console.log('\n具体的スキル質問（バイタル等）:');
questionBank
  .filter(q => q.content.includes('バイタル') || q.content.includes('点滴'))
  .forEach(q => console.log(' -', q.content, '(section:', q.section, ', sectionId:', q.sectionId, ')'));