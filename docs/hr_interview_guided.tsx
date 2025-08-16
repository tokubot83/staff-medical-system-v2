import React, { useState } from 'react';
import {
  User, Target, Heart, TrendingUp, Brain, Lightbulb, 
  ArrowRight, FileText, Calendar, Printer, Save,
  CheckCircle, AlertTriangle, Star, MessageSquare, HelpCircle
} from 'lucide-react';

const HRInterviewGuided = () => {
  const [formData, setFormData] = useState({});

  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const ScaleSelector = ({ label, field, question, guide }) => (
    <div className="mb-4 p-3 border-l-4 border-blue-300 bg-blue-50 rounded">
      <div className="mb-2">
        <h4 className="text-sm font-bold text-blue-800 mb-1">{label}</h4>
        <p className="text-xs text-blue-700 italic mb-2">💬 "{question}"</p>
        {guide && <p className="text-xs text-gray-600 mb-2">📋 {guide}</p>}
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-red-600 font-medium">低い・悪い</span>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map(num => (
            <button
              key={num}
              onClick={() => updateData(field, num)}
              className={`w-8 h-8 text-xs rounded border-2 font-bold transition-all ${
                formData[field] === num
                  ? 'bg-blue-600 text-white border-blue-600 transform scale-110'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        <span className="text-xs text-green-600 font-medium">高い・良い</span>
      </div>
      <textarea
        placeholder="📝 具体例や詳細を記入してください（例：どんな時にそう感じるか、改善案など）"
        className="w-full text-xs p-2 border rounded resize-none"
        rows="2"
        onChange={(e) => updateData(field + '_detail', e.target.value)}
      />
    </div>
  );

  const OpenQuestion = ({ label, question, field, placeholder, rows = 3 }) => (
    <div className="mb-4 p-3 border-l-4 border-green-300 bg-green-50 rounded">
      <h4 className="text-sm font-bold text-green-800 mb-1">{label}</h4>
      <p className="text-xs text-green-700 italic mb-2">💬 "{question}"</p>
      <textarea
        rows={rows}
        className="w-full text-xs p-2 border rounded resize-none"
        placeholder={placeholder}
        onChange={(e) => updateData(field, e.target.value)}
      />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white" style={{ fontSize: '12px' }}>
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-blue-600">
        <div>
          <h1 className="text-xl font-bold text-blue-800 flex items-center">
            <FileText className="mr-2" size={24} />
            人事部定期面談シート（質問ガイド付き）
          </h1>
          <p className="text-sm text-gray-600">立神リハビリテーション温泉病院 | 構造化面談による深い対話</p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded text-sm">
            <Save className="mr-1" size={14} />保存
          </button>
          <button className="flex items-center px-3 py-2 bg-gray-600 text-white rounded text-sm">
            <Printer className="mr-1" size={14} />印刷
          </button>
        </div>
      </div>

      {/* 面談開始ガイド */}
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="text-sm font-bold text-yellow-800 mb-2 flex items-center">
          <MessageSquare className="mr-2" size={16} />
          面談開始時の説明（必ず読み上げる）
        </h3>
        <div className="text-xs text-yellow-700 space-y-1">
          <p>「今日は貴重なお時間をいただき、ありがとうございます。この面談は約60分を予定しており、</p>
          <p>あなたの現在の状況や今後の希望を伺い、より良い職場環境づくりに活かすことが目的です。」</p>
          <p>「お話しいただいた内容は守秘義務を守り、適切に管理いたします。リラックスしてお聞かせください。」</p>
        </div>
      </div>

      {/* 基本情報 */}
      <div className="grid grid-cols-4 gap-3 mb-6 p-3 bg-gray-50 rounded border">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">職員名</label>
          <input type="text" className="w-full text-sm p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">部署・職種</label>
          <input type="text" className="w-full text-sm p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">面談日</label>
          <input type="date" className="w-full text-sm p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">面談者</label>
          <input type="text" className="w-full text-sm p-2 border rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左カラム */}
        <div>
          {/* 業務・成果評価 */}
          <div className="mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-25">
            <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
              <Target className="mr-2" size={18} />
              1. 業務・成果評価
            </h3>
            
            <ScaleSelector 
              label="業務の質・正確性" 
              field="quality"
              question="現在の業務について、質や正確性はどの程度だと思いますか？"
              guide="ミスの頻度、仕事の丁寧さ、完成度などを総合的に評価"
            />
            
            <ScaleSelector 
              label="業務効率・生産性" 
              field="productivity"
              question="決められた時間内で、どの程度効率よく業務を進められていますか？"
              guide="時間管理、優先順位の付け方、作業スピードなど"
            />
            
            <ScaleSelector 
              label="チームワーク・協調性" 
              field="teamwork"
              question="同僚や他部署との連携・協力はうまくいっていますか？"
              guide="コミュニケーション能力、協力的態度、チームへの貢献度"
            />
            
            <OpenQuestion
              label="主な成果・貢献"
              question="この半年間で、特に誇れる成果や職場への貢献があれば教えてください"
              field="achievements"
              placeholder="具体的なエピソードや数値があれば記入してください..."
            />
            
            <OpenQuestion
              label="課題・改善点"
              question="業務上で困っていることや、改善したいと思っていることはありますか？"
              field="challenges"
              placeholder="現在抱えている課題や、解決したい問題について..."
            />
          </div>

          {/* 満足度・環境 */}
          <div className="mb-6 p-4 border-2 border-green-200 rounded-lg">
            <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
              <Heart className="mr-2" size={18} />
              2. 満足度・職場環境
            </h3>
            
            <ScaleSelector 
              label="仕事への満足度" 
              field="job_satisfaction"
              question="現在の仕事に対して、どの程度満足していますか？"
              guide="やりがい、充実感、仕事への愛着度など"
            />
            
            <ScaleSelector 
              label="職場環境" 
              field="environment"
              question="職場の人間関係や設備、制度などの環境はいかがですか？"
              guide="上司・同僚との関係、設備の使いやすさ、制度の充実度"
            />
            
            <ScaleSelector 
              label="ワークライフバランス" 
              field="worklife"
              question="仕事とプライベートのバランスは取れていますか？"
              guide="休暇の取りやすさ、残業の状況、家庭との両立"
            />
            
            <ScaleSelector 
              label="コミュニケーション" 
              field="communication"
              question="上司や同僚とのコミュニケーションは良好ですか？"
              guide="相談のしやすさ、情報共有、意見交換の頻度"
            />
            
            <OpenQuestion
              label="改善要望"
              question="職場環境で改善してほしい点があれば、具体的に教えてください"
              field="improvements"
              placeholder="設備、制度、人間関係など、どんなことでも..."
            />
          </div>
        </div>

        {/* 右カラム */}
        <div>
          {/* 成長・キャリア */}
          <div className="mb-6 p-4 border-2 border-purple-200 rounded-lg">
            <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center">
              <TrendingUp className="mr-2" size={18} />
              3. 成長・キャリア開発
            </h3>
            
            <ScaleSelector 
              label="スキル向上・成長実感" 
              field="skill_growth"
              question="この半年間で、自分のスキルや能力の向上を実感できていますか？"
              guide="新しい技術の習得、知識の増加、経験の蓄積など"
            />
            
            <ScaleSelector 
              label="学習・研修機会" 
              field="learning"
              question="学習や研修の機会は十分に提供されていると思いますか？"
              guide="院内研修、外部研修、資格取得支援など"
            />
            
            <ScaleSelector 
              label="キャリアパスの明確さ" 
              field="career_path"
              question="将来のキャリアパスや昇進の道筋は明確で魅力的ですか？"
              guide="昇進の基準、将来の可能性、目標設定のしやすさ"
            />
            
            <OpenQuestion
              label="キャリア目標"
              question="3-5年後、どのような自分になっていたいですか？どんな仕事をしたいですか？"
              field="career_goals"
              placeholder="具体的な目標や理想像があれば..."
            />
            
            <OpenQuestion
              label="希望するスキル・研修"
              question="今後身につけたいスキルや、受けたい研修があれば教えてください"
              field="skill_needs"
              placeholder="資格、技術、知識など..."
            />
          </div>

          {/* 健康・ストレス */}
          <div className="mb-6 p-4 border-2 border-red-200 rounded-lg">
            <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center">
              <Brain className="mr-2" size={18} />
              4. 健康・ストレス管理
            </h3>
            
            <ScaleSelector 
              label="身体的健康状態" 
              field="physical_health"
              question="最近の身体的な健康状態はいかがですか？"
              guide="疲労感、体調不良の頻度、体力面での不安など"
            />
            
            <ScaleSelector 
              label="精神的健康状態" 
              field="mental_health"
              question="精神的な健康状態はいかがですか？気持ちの面での調子は？"
              guide="気分の状態、やる気、ストレスの感じ方など"
            />
            
            <ScaleSelector 
              label="ストレスレベル" 
              field="stress"
              question="現在感じているストレスのレベルはどの程度ですか？"
              guide="1=ほとんどない、5=非常に強い"
            />
            
            <ScaleSelector 
              label="業務量の適切さ" 
              field="workload"
              question="現在の業務量は適切だと感じますか？"
              guide="忙しすぎる、適量、物足りないなど"
            />

            <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded">
              <p className="text-sm font-bold text-red-800 mb-2 flex items-center">
                <AlertTriangle className="mr-1" size={14} />
                要注意サイン（面談者チェック用）
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1" />表情が暗い・元気がない
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1" />疲労感を強く訴える
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1" />睡眠不足の様子
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1" />イライラ・不安の兆候
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1" />集中力低下の訴え
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1" />退職を考えている発言
                </label>
              </div>
            </div>

            <OpenQuestion
              label="ストレス要因・健康面の心配"
              question="ストレスの原因や、健康面で心配なことがあれば教えてください"
              field="health_concerns"
              placeholder="気軽にお話しください。必要に応じてサポートを検討します..."
            />
          </div>
        </div>
      </div>

      {/* 今後の展望・要望 */}
      <div className="mb-6 p-4 border-2 border-yellow-200 rounded-lg bg-yellow-25">
        <h3 className="text-lg font-bold text-yellow-800 mb-3 flex items-center">
          <Lightbulb className="mr-2" size={18} />
          5. 今後の展望・要望
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OpenQuestion
            label="6ヶ月の短期目標"
            question="今後6ヶ月間で達成したい目標や、取り組みたいことはありますか？"
            field="short_goals"
            placeholder="具体的な目標があれば..."
            rows="3"
          />
          
          <OpenQuestion
            label="組織への提案・要望"
            question="病院や組織に対して、提案や要望があれば遠慮なく教えてください"
            field="suggestions"
            placeholder="どんな小さなことでも歓迎します..."
            rows="3"
          />
          
          <OpenQuestion
            label="継続したいこと"
            question="現在の良い習慣や、これからも続けていきたいことはありますか？"
            field="continue"
            placeholder="仕事でもプライベートでも..."
            rows="3"
          />
          
          <OpenQuestion
            label="改善・変更したいこと"
            question="変えたい習慣や、改善したい状況があれば教えてください"
            field="improve"
            placeholder="具体的な改善案があれば一緒に..."
            rows="3"
          />
        </div>
      </div>

      {/* アクションプラン */}
      <div className="mb-6 p-4 border-2 border-amber-200 rounded-lg bg-amber-25">
        <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center">
          <ArrowRight className="mr-2" size={18} />
          6. アクションプラン（面談者記入）
        </h3>
        
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <h4 className="text-sm font-bold text-green-800 mb-2">面談サマリー</h4>
          <textarea
            className="w-full text-sm p-2 border rounded resize-none"
            rows="3"
            placeholder="面談全体の印象、主要なポイント、気づいたことを記入..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center">
              <Target className="mr-1" size={14} />
              本人のアクション項目
            </h4>
            <div className="space-y-2">
              <input type="text" placeholder="1. 具体的なアクション項目" className="w-full text-sm p-2 border rounded" />
              <input type="date" className="w-full text-sm p-2 border rounded" />
              <input type="text" placeholder="2. 具体的なアクション項目" className="w-full text-sm p-2 border rounded" />
              <input type="date" className="w-full text-sm p-2 border rounded" />
              <input type="text" placeholder="3. 具体的なアクション項目" className="w-full text-sm p-2 border rounded" />
              <input type="date" className="w-full text-sm p-2 border rounded" />
            </div>
          </div>

          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <h4 className="text-sm font-bold text-green-800 mb-2 flex items-center">
              <CheckCircle className="mr-1" size={14} />
              組織のサポート項目
            </h4>
            <div className="space-y-2">
              <input type="text" placeholder="1. 組織が提供するサポート" className="w-full text-sm p-2 border rounded" />
              <input type="text" placeholder="担当者・期限" className="w-full text-sm p-2 border rounded" />
              <input type="text" placeholder="2. 組織が提供するサポート" className="w-full text-sm p-2 border rounded" />
              <input type="text" placeholder="担当者・期限" className="w-full text-sm p-2 border rounded" />
              <input type="text" placeholder="3. 組織が提供するサポート" className="w-full text-sm p-2 border rounded" />
              <input type="text" placeholder="担当者・期限" className="w-full text-sm p-2 border rounded" />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">次回面談予定日</label>
            <input type="date" className="w-full text-sm p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">面談種類</label>
            <select className="w-full text-sm p-2 border rounded">
              <option>定期面談（6ヶ月後）</option>
              <option>フォローアップ面談（3ヶ月後）</option>
              <option>緊急相談面談（随時）</option>
            </select>
          </div>
        </div>
      </div>

      {/* 面談者所感 */}
      <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <h3 className="text-lg font-bold text-blue-800 mb-2">面談者所感・留意事項（機密情報）</h3>
        <textarea
          rows="4"
          className="w-full text-sm p-3 border rounded resize-none"
          placeholder="◆ 人事として注意すべき点
◆ 継続観察が必要な事項  
◆ 上司への報告・相談事項
◆ 人事施策への反映点
◆ その他の気づき"
        />
      </div>

      {/* フッター */}
      <div className="mt-6 pt-3 border-t-2 border-gray-300">
        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
          <div>
            <p className="font-medium">立神リハビリテーション温泉病院 人事部</p>
            <p>定期面談シート（質問ガイド付き版）v2.1</p>
          </div>
          <div className="text-right">
            <p>標準所要時間: 60分</p>
            <p>次回面談: 6ヶ月後（フォローアップは3ヶ月後）</p>
          </div>
        </div>
        
        <div className="p-3 bg-gray-100 rounded text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-800 mb-1">評価基準</p>
              <p className="text-xs text-gray-600">1=大いに改善が必要 2=やや改善が必要 3=普通・標準的 4=良好・満足 5=非常に良好・大満足</p>
            </div>
            <div>
              <p className="font-medium text-gray-800 mb-1">面談のコツ</p>
              <p className="text-xs text-gray-600">傾聴姿勢を保ち、具体例を聞き、一緒に改善案を考える。数値評価だけでなく背景や感情も大切に。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 印刷用スタイル */}
      <style jsx>{`
        @media print {
          body { margin: 0; font-size: 11px; }
          .max-w-5xl { max-width: none; margin: 0; padding: 8mm; }
          @page { 
            size: A4; 
            margin: 8mm;
          }
          button { display: none; }
          * { -webkit-print-color-adjust: exact; }
          .grid-cols-1.lg\\:grid-cols-2 { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
};

export default HRInterviewGuided;