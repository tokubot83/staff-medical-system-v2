'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  User,
  UserCheck,
  QrCode,
  FileText,
  Send,
  Check,
  Clock,
  AlertCircle,
  Printer,
  Smartphone,
  Mail
} from 'lucide-react';

interface TechnicalEvaluationFlowProps {
  staffId: string;
  staffName: string;
  evaluationPeriod: string;
  onSubmit?: (data: any) => void;
}

export default function TechnicalEvaluationFlow({
  staffId,
  staffName,
  evaluationPeriod,
  onSubmit
}: TechnicalEvaluationFlowProps) {
  const [activeRole, setActiveRole] = useState<'self' | 'supervisor'>('self');
  const [evaluationMethod, setEvaluationMethod] = useState<'online' | 'paper' | 'qr'>('online');
  const [selfEvaluation, setSelfEvaluation] = useState({
    C01: { score: 0, completed: false },
    C02: { score: 0, completed: false },
    C03: { score: 0, completed: false }
  });
  const [supervisorEvaluation, setSupervisorEvaluation] = useState({
    C01: { score: 0, completed: false },
    C02: { score: 0, completed: false },
    C03: { score: 0, completed: false }
  });

  // 評価項目の定義（パターン2: 上司と本人の配点が異なる）
  const evaluationItems = {
    C01: {
      name: '専門技術・スキル',
      description: '職務遂行に必要な専門知識と技術の習得度',
      supervisorMax: 7,
      selfMax: 3,
      totalMax: 10
    },
    C02: {
      name: '対人関係・ケア',
      description: '患者・利用者への対応、チーム連携',
      supervisorMax: 5,
      selfMax: 5,
      totalMax: 10
    },
    C03: {
      name: '安全・品質管理',
      description: '医療安全、感染対策、記録管理の実践',
      supervisorMax: 8,
      selfMax: 2,
      totalMax: 10
    }
  };

  // QRコード生成
  const generateQRCode = (role: 'self' | 'supervisor') => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      staffId,
      period: evaluationPeriod,
      role,
      token: 'mock-secure-token' // 実際はセキュアなトークンを生成
    });
    return `${baseUrl}/evaluation/technical/input?${params.toString()}`;
  };

  // 評価の進捗計算
  const calculateProgress = (role: 'self' | 'supervisor') => {
    const evaluation = role === 'self' ? selfEvaluation : supervisorEvaluation;
    const completed = Object.values(evaluation).filter(item => item.completed).length;
    return (completed / 3) * 100;
  };

  // 評価入力の処理
  const handleScoreInput = (role: 'self' | 'supervisor', itemKey: string, score: number) => {
    if (role === 'self') {
      setSelfEvaluation(prev => ({
        ...prev,
        [itemKey]: { score, completed: score > 0 }
      }));
    } else {
      setSupervisorEvaluation(prev => ({
        ...prev,
        [itemKey]: { score, completed: score > 0 }
      }));
    }
  };

  // 印刷用フォーマット生成
  const generatePrintFormat = () => {
    window.print();
  };

  // メール送信（リマインダー）
  const sendReminder = (role: 'self' | 'supervisor') => {
    console.log(`Sending reminder email for ${role} evaluation`);
    // 実際はAPIを呼び出してメール送信
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            技術評価入力フロー
          </CardTitle>
          <CardDescription>
            {staffName} - {evaluationPeriod}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <User className="h-5 w-5 text-blue-600" />
                <span className="font-medium">本人評価</span>
              </div>
              <Progress value={calculateProgress('self')} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">
                進捗: {calculateProgress('self').toFixed(0)}%
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                <span className="font-medium">上司評価</span>
              </div>
              <Progress value={calculateProgress('supervisor')} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">
                進捗: {calculateProgress('supervisor').toFixed(0)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 評価方法選択 */}
      <Card>
        <CardHeader>
          <CardTitle>評価入力方法の選択</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={evaluationMethod} onValueChange={(v: any) => setEvaluationMethod(v)}>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="online" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span className="font-medium">オンライン入力</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    このフォームで直接入力
                  </p>
                </div>
              </label>
              
              <label className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="paper" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Printer className="h-4 w-4" />
                    <span className="font-medium">紙での評価</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    評価シートを印刷して記入
                  </p>
                </div>
              </label>
              
              <label className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="qr" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    <span className="font-medium">QRコード入力</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    モバイル端末で入力
                  </p>
                </div>
              </label>
            </div>
          </RadioGroup>

          {/* 方法別の詳細 */}
          {evaluationMethod === 'paper' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <Button onClick={generatePrintFormat} className="w-full">
                <Printer className="h-4 w-4 mr-2" />
                評価シートを印刷
              </Button>
              <p className="text-xs text-gray-600 mt-2">
                印刷した評価シートに記入後、管理部門へ提出してください
              </p>
            </div>
          )}

          {evaluationMethod === 'qr' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <Tabs defaultValue="self">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="self">本人評価用</TabsTrigger>
                  <TabsTrigger value="supervisor">上司評価用</TabsTrigger>
                </TabsList>
                <TabsContent value="self">
                  <div className="text-center">
                    <div className="inline-block p-4 bg-white rounded-lg">
                      <QrCode className="h-32 w-32" />
                    </div>
                    <p className="text-sm mt-2">
                      URL: {generateQRCode('self')}
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Mail className="h-4 w-4 mr-2" />
                      URLをメール送信
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="supervisor">
                  <div className="text-center">
                    <div className="inline-block p-4 bg-white rounded-lg">
                      <QrCode className="h-32 w-32" />
                    </div>
                    <p className="text-sm mt-2">
                      URL: {generateQRCode('supervisor')}
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Mail className="h-4 w-4 mr-2" />
                      URLをメール送信
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>

      {/* オンライン評価入力フォーム */}
      {evaluationMethod === 'online' && (
        <Card>
          <CardHeader>
            <CardTitle>評価入力</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeRole} onValueChange={(v: any) => setActiveRole(v)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="self">
                  <User className="h-4 w-4 mr-2" />
                  本人評価
                </TabsTrigger>
                <TabsTrigger value="supervisor">
                  <UserCheck className="h-4 w-4 mr-2" />
                  上司評価
                </TabsTrigger>
              </TabsList>

              {/* 本人評価タブ */}
              <TabsContent value="self" className="space-y-4">
                {Object.entries(evaluationItems).map(([key, item]) => (
                  <Card key={key}>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>{key}: {item.name}</span>
                        <Badge variant="outline">
                          最大 {item.selfMax} 点
                        </Badge>
                      </CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Label>評価点：</Label>
                        <div className="flex gap-1">
                          {[...Array(item.selfMax)].map((_, i) => (
                            <Button
                              key={i}
                              size="sm"
                              variant={selfEvaluation[key as keyof typeof selfEvaluation].score === i + 1 ? "default" : "outline"}
                              onClick={() => handleScoreInput('self', key, i + 1)}
                            >
                              {i + 1}
                            </Button>
                          ))}
                        </div>
                        {selfEvaluation[key as keyof typeof selfEvaluation].completed && (
                          <Check className="h-5 w-5 text-green-600 ml-2" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    本人評価は自己の振り返りとして重要です。客観的に評価してください。
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {/* 上司評価タブ */}
              <TabsContent value="supervisor" className="space-y-4">
                {Object.entries(evaluationItems).map(([key, item]) => (
                  <Card key={key}>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>{key}: {item.name}</span>
                        <Badge variant="outline">
                          最大 {item.supervisorMax} 点
                        </Badge>
                      </CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Label>評価点：</Label>
                        <div className="flex gap-1 flex-wrap">
                          {[...Array(item.supervisorMax)].map((_, i) => (
                            <Button
                              key={i}
                              size="sm"
                              variant={supervisorEvaluation[key as keyof typeof supervisorEvaluation].score === i + 1 ? "default" : "outline"}
                              onClick={() => handleScoreInput('supervisor', key, i + 1)}
                            >
                              {i + 1}
                            </Button>
                          ))}
                        </div>
                        {supervisorEvaluation[key as keyof typeof supervisorEvaluation].completed && (
                          <Check className="h-5 w-5 text-green-600 ml-2" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    上司評価は部下の成長と適正な評価のために重要です。公平に評価してください。
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>

            {/* 保存ボタン */}
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline">
                一時保存
              </Button>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                評価を提出
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ステータス確認 */}
      <Card>
        <CardHeader>
          <CardTitle>評価ステータス</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">本人評価</p>
                  <p className="text-sm text-gray-600">最終更新: 2025-01-10</p>
                </div>
              </div>
              <Badge variant={calculateProgress('self') === 100 ? "default" : "secondary"}>
                {calculateProgress('self') === 100 ? '完了' : '入力中'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <UserCheck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">上司評価</p>
                  <p className="text-sm text-gray-600">最終更新: 2025-01-09</p>
                </div>
              </div>
              <Badge variant={calculateProgress('supervisor') === 100 ? "default" : "secondary"}>
                {calculateProgress('supervisor') === 100 ? '完了' : '入力中'}
              </Badge>
            </div>

            {calculateProgress('self') < 100 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => sendReminder('self')}
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                本人にリマインダーを送信
              </Button>
            )}

            {calculateProgress('supervisor') < 100 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => sendReminder('supervisor')}
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                上司にリマインダーを送信
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}