'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, FileText } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EvaluationInputPage() {
  const params = useParams();
  const router = useRouter();
  const staffId = params.id as string;
  const [scores, setScores] = useState({
    technical: '',
    contribution: '',
    comments: ''
  });

  const handleSave = () => {
    // 保存処理
    router.push('/evaluation-execution');
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/evaluation-execution">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              評価管理に戻る
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* 職員情報 */}
          <Card>
            <CardHeader>
              <CardTitle>職員情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-600">職員ID</Label>
                  <p className="font-medium">EMP{staffId.padStart(3, '0')}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">氏名</Label>
                  <p className="font-medium">評価対象者</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">部署</Label>
                  <p className="font-medium">看護部</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">経験年数</Label>
                  <p className="font-medium">3年目</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 評価入力フォーム */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>評価入力</CardTitle>
              <CardDescription>
                技術評価と貢献度評価を入力してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 技術評価 */}
                <div>
                  <Label>技術評価（50点満点）</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label className="text-sm text-gray-600">法人統一項目（30点）</Label>
                      <Input 
                        type="number" 
                        placeholder="0-30"
                        max={30}
                        min={0}
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">施設特化項目（20点）</Label>
                      <Input 
                        type="number" 
                        placeholder="0-20"
                        max={20}
                        min={0}
                      />
                    </div>
                  </div>
                </div>

                {/* 貢献度評価 */}
                <div>
                  <Label>貢献度評価（50点満点）</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label className="text-sm text-gray-600">施設貢献度（25点）</Label>
                      <Input 
                        type="number" 
                        placeholder="0-25"
                        max={25}
                        min={0}
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">法人貢献度（25点）</Label>
                      <Input 
                        type="number" 
                        placeholder="0-25"
                        max={25}
                        min={0}
                      />
                    </div>
                  </div>
                </div>

                {/* コメント */}
                <div>
                  <Label>評価コメント</Label>
                  <Textarea 
                    className="mt-2"
                    rows={4}
                    placeholder="評価の根拠や改善点などを記入してください"
                    value={scores.comments}
                    onChange={(e) => setScores({...scores, comments: e.target.value})}
                  />
                </div>

                {/* 総合評価 */}
                <Alert>
                  <AlertDescription>
                    <div className="flex justify-between items-center">
                      <span>総合評価点</span>
                      <span className="text-2xl font-bold">0 / 100点</span>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* アクションボタン */}
                <div className="flex gap-3">
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    保存
                  </Button>
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    下書き保存
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}