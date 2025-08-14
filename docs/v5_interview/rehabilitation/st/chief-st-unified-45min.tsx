'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MotivationTypeSection, getMotivationTypeQuestions } from '../../components/MotivationType';

export default function ChiefSTUnified45MinInterviewSheetV5() {
  const [selectedMotivationType, setSelectedMotivationType] = useState<string>('');
  const typeSpecificQuestions = getMotivationTypeQuestions(selectedMotivationType);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-2xl">主任言語聴覚士定期面談シート V5（45分版）</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            <p>面談日時：{new Date().toLocaleDateString('ja-JP')} ＿＿:＿＿</p>
            <p>面談者：＿＿＿＿＿＿＿＿　対象者：＿＿＿＿＿＿＿＿</p>
            <p>経験年数：＿＿年　配属部署：リハビリテーション科</p>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              45分の詳細面談です。<strong>動機タイプ判定</strong>を活用し、主任言語聴覚士の包括的なマネジメント評価と戦略的リーダーシップ開発を行います。
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* 動機タイプ判定セクション */}
          <MotivationTypeSection 
            selectedType={selectedMotivationType}
            onTypeSelect={setSelectedMotivationType}
          />

          {/* 1. 主任ST総合マネジメント・リーダーシップ詳細評価（15分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. 主任ST総合マネジメント・リーダーシップ詳細評価（15分）</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <Label className="text-base font-semibold">主任STとしての包括的マネジメント能力評価</Label>
              <div className="grid grid-cols-6 gap-2 text-xs text-center font-medium text-gray-600 mb-2">
                <div></div>
                <div className="bg-green-100 px-2 py-1 rounded">5</div>
                <div className="bg-blue-100 px-2 py-1 rounded">4</div>
                <div className="bg-yellow-100 px-2 py-1 rounded">3</div>
                <div className="bg-orange-100 px-2 py-1 rounded">2</div>
                <div className="bg-red-100 px-2 py-1 rounded">1</div>
              </div>
              
              {[
                "ST部門の戦略立案・方針決定・統括管理",
                "部下・スタッフの人事管理・育成・評価・キャリア支援",
                "業務計画・目標設定・KPI管理・成果評価",
                "多職種・他部門・外部機関との調整・統合・交渉",
                "品質管理・安全管理・リスク管理・法令遵守",
                "業務効率化・プロセス改善・デジタル化推進",
                "予算管理・コスト管理・収益最大化・経営参画",
                "組織変革・文化変革・イノベーション創出・変革管理",
                "危機管理・問題解決・意思決定・緊急時対応",
                "内外コミュニケーション・情報共有・透明性確保",
                "人材採用・配置・定着率向上・職場環境整備",
                "専門性維持・技術水準向上・エビデンス活用",
                "地域連携・社会貢献・ブランド構築・PR活動",
                "次世代リーダー育成・組織継続性確保"
              ].map((item) => (
                <RadioGroup key={item}>
                  <div className="grid grid-cols-6 gap-2 items-center">
                    <span className="text-sm font-medium">{item}</span>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-5`} id={`${item}-5`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-4`} id={`${item}-4`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-3`} id={`${item}-3`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-2`} id={`${item}-2`} className="w-4 h-4" />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroupItem value={`${item}-1`} id={`${item}-1`} className="w-4 h-4" />
                    </div>
                  </div>
                </RadioGroup>
              ))}
            </div>

            <div className="space-y-2">
              <Label>ST部門運営の主要成果・業績</Label>
              <Textarea 
                placeholder="部門KPI達成状況、収益・効率性改善、品質・満足度向上、スタッフ定着率・成長実績、他部門連携成果、地域貢献等詳細に記入"
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label>リーダーシップ・変革推進の具体的成果</Label>
              <Textarea 
                placeholder="組織改革プロジェクト成功事例、新サービス・制度導入、危機管理対応、文化変革推進、イノベーション創出等の実績"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>部下・スタッフ育成・マネジメント成果</Label>
              <Textarea 
                placeholder="人材育成実績、昇進・昇格者輩出、スキル向上支援、モチベーション管理、離職率改善、チーム結束力向上等"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>主任としての独自の強み・リーダーシップスタイル</Label>
              <Textarea 
                placeholder="他の管理職とは異なる独自のマネジメント手法、リーダーシップの特徴、組織への特別な貢献・価値創出等"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 2. 動機タイプ別戦略分析・経営参画ビジョン（12分） */}
          <div className="space-y-4 bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg border-b pb-2">2. 動機タイプ別戦略分析・経営参画ビジョン（12分）</h3>
            
            {selectedMotivationType && typeSpecificQuestions.length > 0 && (
              <div className="bg-purple-50 p-3 rounded-lg space-y-2 mb-4">
                <Label className="text-base font-semibold text-purple-700">
                  動機タイプに基づく戦略的質問（主任ST経営参画版）
                </Label>
                <div className="space-y-3">
                  {typeSpecificQuestions.slice(0, 3).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm font-medium">{`質問${index + 1}：${question}`}</Label>
                      <Textarea 
                        placeholder="主任言語聴覚士として組織経営・戦略の視点でお答えください"
                        className="min-h-[80px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>組織経営・戦略への参画意欲・ビジョン</Label>
              <Textarea 
                placeholder="組織全体の経営戦略・意思決定への関与希望、病院・施設の将来ビジョン、経営改善・成長戦略への貢献意欲等"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>マネジメント哲学・価値観・信念</Label>
              <Textarea 
                placeholder="リーダーとしての価値観、組織運営・人材育成に対する哲学、理想的な組織文化・チーム像、大切にしている信念等"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">現在のマネジメント課題・成長希望領域（詳細）</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "戦略立案・長期ビジョン策定能力",
                  "財務管理・予算統制・コスト分析",
                  "人事管理・労務管理・評価制度運用",
                  "マーケティング・ブランディング・PR",
                  "デジタル変革・IT活用・システム導入",
                  "品質管理・プロセス改善・標準化",
                  "リスク管理・危機管理・BCPマネジメント",
                  "変革管理・組織開発・文化変革",
                  "ステークホルダー・マネジメント",
                  "グローバル・国際的視野・多様性管理",
                  "サステナビリティ・ESG経営",
                  "イノベーション・新事業開発",
                  "法務・コンプライアンス・ガバナンス",
                  "コーチング・メンタリング・人材開発",
                  "ネゴシエーション・交渉力・調整力",
                  "その他"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={item} />
                    <Label htmlFor={item} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>理想的な組織・チーム像と実現戦略</Label>
              <Textarea 
                placeholder="目指すべき組織文化・チーム形態、スタッフの理想的な働き方、患者・家族サービスの目標水準、実現のための具体的戦略"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 3. ST部門・組織戦略立案・実行計画（10分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. ST部門・組織戦略立案・実行計画（10分）</h3>
            
            <div className="space-y-2">
              <Label>短期戦略（6ヶ月以内）</Label>
              <Input 
                placeholder="例：部門KPI改善、新人材獲得・定着、業務デジタル化、他部門連携強化"
              />
            </div>

            <div className="space-y-2">
              <Label>中期戦略（1-2年以内）</Label>
              <Input 
                placeholder="例：専門サービス拡充、地域シェア拡大、収益性向上、組織再編完了"
              />
            </div>

            <div className="space-y-2">
              <Label>長期ビジョン（3-5年）</Label>
              <Input 
                placeholder="例：地域医療のリーディングカンパニー、新事業展開、後継者育成完了"
              />
            </div>

            <div className="space-y-2">
              <Label>競合優位性・差別化戦略</Label>
              <Textarea 
                placeholder="他施設・競合他社との差別化戦略、独自の強み・付加価値、市場ポジショニング、ブランド戦略等"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>戦略実行に必要なリソース・投資・体制整備</Label>
              <Textarea 
                placeholder="人材・設備・システム・予算等の必要投資、組織体制・権限変更、外部パートナー・提携、規制・制度対応等"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">戦略実行のための重点施策（複数選択可）</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "人材採用・育成プログラム強化",
                  "デジタル・IT投資・システム高度化",
                  "サービス品質・患者満足度向上",
                  "他部門・外部機関連携拡大",
                  "専門資格・認定取得推進",
                  "研究・エビデンス構築・論文発表",
                  "地域ネットワーク・紹介拡大",
                  "新サービス・プログラム開発",
                  "コスト削減・効率化推進",
                  "ブランディング・マーケティング強化",
                  "国際連携・海外展開検討",
                  "M&A・事業提携・資本参加",
                  "規制対応・認可取得・制度活用",
                  "ESG・持続可能性・社会貢献",
                  "リスク管理・危機対応体制強化",
                  "その他"
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox id={item} />
                    <Label htmlFor={item} className="text-sm">{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. 自己成長・キャリア発展・後継者育成（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 自己成長・キャリア発展・後継者育成（5分）</h3>
            
            <div className="space-y-2">
              <Label>今後のキャリア目標・昇進・転身ビジョン</Label>
              <Textarea 
                placeholder="部長・役員昇進、転職・転身、独立・起業、コンサルタント、学術・教育界進出等の将来構想"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>後継者育成・組織継続性確保計画</Label>
              <Textarea 
                placeholder="後継者候補の特定・育成計画、知識・経験・ネットワークの継承方法、組織運営の継続性確保策等"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>自己成長・スキル向上のための学習・研修計画</Label>
              <Textarea 
                placeholder="MBA・ビジネススクール、経営・マネジメント研修、資格取得、海外研修、メンタリング・コーチング等"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 5. 組織・経営陣への戦略提言（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">5. 組織・経営陣への戦略提言（3分）</h3>
            
            <div className="space-y-2">
              <Label>組織・経営戦略への提言・改善提案</Label>
              <Textarea 
                placeholder="主任STとして見た組織課題、経営戦略・意思決定への提言、制度・仕組み改革案、投資・リソース配分提案等"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>ST部門・リハビリ業界の将来展望・戦略提案</Label>
              <Textarea 
                placeholder="業界トレンド・将来予測、新技術・サービス導入提案、政策・制度変化対応、競争戦略・ポジショニング提案等"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>その他（自由記述）</Label>
              <Textarea 
                placeholder="上記以外で経営陣・組織に伝えたいこと、相談・提案・要望等があれば自由にお書きください"
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* 面談者所見 */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">面談者所見</h3>
            <Textarea 
              placeholder="マネジメント能力・成熟度、戦略的思考力、リーダーシップ、経営参画度、組織貢献度、今後の期待役割、昇進・昇格可能性、特別支援計画等詳細に記入"
              className="min-h-[150px]"
            />
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">次回面談予定日</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">昇進・昇格可能性</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="promotion-high" />
                      <Label htmlFor="promotion-high" className="text-sm">高</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="promotion-medium" />
                      <Label htmlFor="promotion-medium" className="text-sm">中</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="promotion-low" />
                      <Label htmlFor="promotion-low" className="text-sm">低</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">経営参画適性</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excellent" id="mgmt-excellent" />
                      <Label htmlFor="mgmt-excellent" className="text-sm">優秀</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="mgmt-good" />
                      <Label htmlFor="mgmt-good" className="text-sm">良好</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="developing" id="mgmt-developing" />
                      <Label htmlFor="mgmt-developing" className="text-sm">発展途上</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* 提出ボタン */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline">
              一時保存
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              提出
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}