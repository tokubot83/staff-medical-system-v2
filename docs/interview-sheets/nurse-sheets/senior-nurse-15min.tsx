'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function SeniorNurse15MinInterview() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            中堅看護師面談シート（15分版）
          </CardTitle>
          <p className="text-center text-gray-600 mt-2">
            リーダーシップと専門性向上に焦点を当てた効率的な面談
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 基本情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">面談日</Label>
              <Input type="date" id="date" />
            </div>
            <div>
              <Label htmlFor="interviewer">面談者</Label>
              <Input type="text" id="interviewer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">氏名</Label>
              <Input type="text" id="name" />
            </div>
            <div>
              <Label htmlFor="years">勤続年数</Label>
              <Input type="text" id="years" placeholder="例：7年3ヶ月" />
            </div>
          </div>

          {/* 1. リーダーシップ発揮状況（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">1. リーダーシップ発揮状況（5分）</h3>
            
            <div>
              <Label>現在のリーダー業務</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center">
                  <Checkbox id="leader-team" />
                  <Label htmlFor="leader-team" className="ml-2">チームリーダー</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="leader-preceptor" />
                  <Label htmlFor="leader-preceptor" className="ml-2">プリセプター</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="leader-committee" />
                  <Label htmlFor="leader-committee" className="ml-2">委員会リーダー</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="leader-project" />
                  <Label htmlFor="leader-project" className="ml-2">プロジェクトリーダー</Label>
                </div>
              </div>
            </div>

            <div>
              <Label>リーダーシップの自己評価</Label>
              <RadioGroup className="grid grid-cols-5 gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex items-center">
                    <RadioGroupItem value={value.toString()} id={`leadership-${value}`} />
                    <Label htmlFor={`leadership-${value}`} className="ml-1">{value}</Label>
                  </div>
                ))}
              </RadioGroup>
              <p className="text-sm text-gray-500 mt-1">1:課題多い ← → 5:非常に良い</p>
            </div>

            <div>
              <Label htmlFor="leadership-challenges">リーダーシップ上の課題</Label>
              <Textarea 
                id="leadership-challenges" 
                placeholder="チーム運営、後輩指導、調整業務などでの困難"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 2. 専門性・スキル向上（5分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">2. 専門性・スキル向上（5分）</h3>
            
            <div>
              <Label>専門分野への取り組み</Label>
              <RadioGroup className="space-y-2 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="active" id="specialty-a" />
                  <Label htmlFor="specialty-a" className="ml-2">積極的に深めている</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="interested" id="specialty-i" />
                  <Label htmlFor="specialty-i" className="ml-2">興味はあるが行動未着手</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="searching" id="specialty-s" />
                  <Label htmlFor="specialty-s" className="ml-2">専門分野を模索中</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="not-interested" id="specialty-n" />
                  <Label htmlFor="specialty-n" className="ml-2">現状維持希望</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="specialty-goals">専門性向上の目標</Label>
              <Textarea 
                id="specialty-goals" 
                placeholder="認定資格、専門研修、学会発表など具体的な目標"
                className="min-h-[60px]"
              />
            </div>

            <div>
              <Label>後輩指導力</Label>
              <RadioGroup className="flex space-x-4 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="excellent" id="teaching-e" />
                  <Label htmlFor="teaching-e" className="ml-2">優秀</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="good" id="teaching-g" />
                  <Label htmlFor="teaching-g" className="ml-2">良好</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="developing" id="teaching-d" />
                  <Label htmlFor="teaching-d" className="ml-2">成長中</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="needs-support" id="teaching-n" />
                  <Label htmlFor="teaching-n" className="ml-2">要支援</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* 3. キャリアビジョン（3分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">3. キャリアビジョン（3分）</h3>
            
            <div>
              <Label>今後のキャリア志向</Label>
              <RadioGroup className="space-y-2 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="management" id="career-m" />
                  <Label htmlFor="career-m" className="ml-2">管理職を目指す</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="specialist" id="career-s" />
                  <Label htmlFor="career-s" className="ml-2">スペシャリストを目指す</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="educator" id="career-e" />
                  <Label htmlFor="career-e" className="ml-2">教育者を目指す</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="current" id="career-c" />
                  <Label htmlFor="career-c" className="ml-2">現場での実践を深める</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="development-needs">必要な支援・機会</Label>
              <Textarea 
                id="development-needs" 
                placeholder="研修、メンタリング、プロジェクト参加など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 4. 組織への貢献（2分） */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">4. 組織への貢献（2分）</h3>
            
            <div>
              <Label htmlFor="contribution">組織改善への提案</Label>
              <Textarea 
                id="contribution" 
                placeholder="業務改善、新人育成、チーム力向上などのアイデア"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 面談者記入欄 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-lg">面談者記入欄</h3>
            
            <div>
              <Label>ポテンシャル評価</Label>
              <RadioGroup className="flex space-x-3 mt-2">
                <div className="flex items-center">
                  <RadioGroupItem value="high" id="potential-h" />
                  <Label htmlFor="potential-h" className="ml-2">高い</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="medium" id="potential-m" />
                  <Label htmlFor="potential-m" className="ml-2">標準</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="developing" id="potential-d" />
                  <Label htmlFor="potential-d" className="ml-2">要育成</Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="concern" id="potential-c" />
                  <Label htmlFor="potential-c" className="ml-2">懸念あり</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="development-plan">育成・活用計画</Label>
              <Textarea 
                id="development-plan" 
                placeholder="昇進候補、プロジェクトアサイン、研修推薦など"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="notes">特記事項</Label>
              <Textarea 
                id="notes" 
                placeholder="強み、課題、フォローアップ事項など"
                className="min-h-[60px]"
              />
            </div>
          </div>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button variant="outline">一時保存</Button>
            <Button>面談記録を保存</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}