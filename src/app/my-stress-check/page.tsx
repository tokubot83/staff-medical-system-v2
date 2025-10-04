/**
 * 自分のストレスチェック結果閲覧・同意管理ページ
 *
 * 職員が自分のストレスチェック結果を閲覧し、
 * 人事部門との共有同意を管理するページ
 */

'use client';

import { useState, useEffect } from 'react';
import { ConsentForm } from '@/components/stress-check/ConsentForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircleIcon, AlertCircleIcon, InfoIcon } from 'lucide-react';

interface StressCheckData {
  id: string;
  staffId: string;
  implementationDate: Date;
  stressLevel: 'low' | 'medium' | 'high';
  highStressFlag: boolean;
  needsInterview: boolean;
  consentToShare: boolean | null;
  consentDate: Date | null;
}

export default function MyStressCheckPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [stressCheckData, setStressCheckData] = useState<StressCheckData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // TODO: セッションから職員IDを取得
  const staffId = 'STAFF_001'; // 仮の職員ID
  const staffName = '山田 太郎'; // 仮の職員名

  useEffect(() => {
    fetchStressCheckData();
  }, []);

  const fetchStressCheckData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/stress-check/my-result?staffId=${staffId}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'データの取得に失敗しました');
      }

      setStressCheckData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleConsentChange = async (consent: boolean) => {
    try {
      const response = await fetch('/api/stress-check/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, consent }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || '同意状況の更新に失敗しました');
      }

      // 成功メッセージを表示
      setSuccessMessage(data.message);

      // データを再取得
      await fetchStressCheckData();

      // 3秒後にメッセージを消す
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      throw err; // ConsentFormで処理
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stressCheckData) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>ストレスチェック未実施</AlertTitle>
          <AlertDescription>
            まだストレスチェックを受検していません。
            受検期間になりましたら、人事部門からの案内に従って受検してください。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ストレスチェック結果</h1>
        <p className="text-muted-foreground mt-2">
          あなたのストレスチェック結果と人事部門への共有設定を確認・変更できます
        </p>
      </div>

      {/* 成功メッセージ */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircleIcon className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">更新完了</AlertTitle>
          <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* ストレスチェック結果概要 */}
      <Card>
        <CardHeader>
          <CardTitle>最新のストレスチェック結果</CardTitle>
          <CardDescription>
            実施日: {new Date(stressCheckData.implementationDate).toLocaleDateString('ja-JP')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">ストレスレベル</div>
              <div className="text-2xl font-bold mt-2">
                {stressCheckData.stressLevel === 'low' && (
                  <span className="text-green-600">低</span>
                )}
                {stressCheckData.stressLevel === 'medium' && (
                  <span className="text-yellow-600">中</span>
                )}
                {stressCheckData.stressLevel === 'high' && (
                  <span className="text-red-600">高</span>
                )}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">高ストレス判定</div>
              <div className="text-2xl font-bold mt-2">
                {stressCheckData.highStressFlag ? (
                  <span className="text-red-600">該当</span>
                ) : (
                  <span className="text-green-600">非該当</span>
                )}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">産業医面談</div>
              <div className="text-2xl font-bold mt-2">
                {stressCheckData.needsInterview ? (
                  <span className="text-orange-600">推奨</span>
                ) : (
                  <span className="text-green-600">不要</span>
                )}
              </div>
            </div>
          </div>

          {stressCheckData.highStressFlag && (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>高ストレス状態です</AlertTitle>
              <AlertDescription>
                産業医による面談を推奨します。希望される場合は、人事部門または健康管理室にご連絡ください。
                面談の申し出により不利益な取扱いを受けることはありません。
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* 同意フォーム */}
      <ConsentForm
        staffId={staffId}
        staffName={staffName}
        currentConsentStatus={stressCheckData.consentToShare}
        onConsentChange={handleConsentChange}
      />

      {/* 補足情報 */}
      <Card>
        <CardHeader>
          <CardTitle>よくある質問</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold">Q. 同意しないと不利益がありますか？</h4>
            <p className="text-muted-foreground mt-1">
              A. いいえ、ありません。労働安全衛生法により、同意の有無による不利益な取扱いは禁止されています。
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Q. 同意した場合、どのような情報が共有されますか？</h4>
            <p className="text-muted-foreground mt-1">
              A. ストレスレベル、高ストレス判定、産業医面談の推奨有無など、必要最小限の情報のみが共有されます。
              質問票の詳細な回答内容は共有されません。
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Q. 一度同意した後で取り消すことはできますか？</h4>
            <p className="text-muted-foreground mt-1">
              A. はい、いつでも変更できます。このページで同意状況を更新してください。
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Q. 産業医は常に結果を見ることができますか？</h4>
            <p className="text-muted-foreground mt-1">
              A. はい、産業医は職務上必要なため、同意の有無に関わらず結果を閲覧できます。
              これは法律で認められた正当な権限です。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
