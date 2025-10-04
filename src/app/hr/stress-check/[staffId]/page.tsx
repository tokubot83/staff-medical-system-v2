/**
 * 人事部門向けストレスチェック結果閲覧ページ
 *
 * 本人の同意がある場合のみ閲覧可能
 * 労働安全衛生法第66条の10第2項準拠
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShieldCheckIcon,
  AlertCircleIcon,
  InfoIcon,
  LockIcon,
  CheckCircleIcon,
} from 'lucide-react';

interface HRStressCheckData {
  canView: boolean;
  consentRequired: boolean;
  consentStatus: boolean | null;
  staffInfo?: {
    staffId: string;
    name: string;
    department: string;
    position: string;
  };
  displayData?: {
    implementationDate: Date;
    stressLevel: 'low' | 'medium' | 'high';
    highStressFlag: boolean;
    needsInterview: boolean;
    hrRecommendations?: string[];
    consentDate?: Date;
  };
  accessDeniedMessage?: string;
}

export default function HRStressCheckViewPage() {
  const params = useParams();
  const staffId = params.staffId as string;

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<HRStressCheckData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // TODO: セッションから人事部権限を確認
  const userLevel = 15; // 仮のユーザーレベル（副院長）

  useEffect(() => {
    if (staffId) {
      fetchHRStressCheckData();
    }
  }, [staffId]);

  const fetchHRStressCheckData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/hr/stress-check/${staffId}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'データの取得に失敗しました');
      }

      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-64 w-full" />
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

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>データなし</AlertTitle>
          <AlertDescription>ストレスチェックデータが見つかりませんでした</AlertDescription>
        </Alert>
      </div>
    );
  }

  // 権限不足の場合
  if (userLevel < 14 || userLevel > 17) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <LockIcon className="h-4 w-4" />
          <AlertTitle>アクセス権限がありません</AlertTitle>
          <AlertDescription>
            ストレスチェック結果の閲覧には人事部門権限（レベル14-17）が必要です
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 同意がない場合
  if (!data.canView) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">ストレスチェック結果</h1>
          {data.staffInfo && (
            <p className="text-muted-foreground mt-2">
              職員: {data.staffInfo.name} ({data.staffInfo.staffId}) - {data.staffInfo.department} / {data.staffInfo.position}
            </p>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LockIcon className="h-5 w-5" />
              閲覧制限
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <ShieldCheckIcon className="h-4 w-4" />
              <AlertTitle>本人の同意が必要です</AlertTitle>
              <AlertDescription>
                {data.accessDeniedMessage ||
                  'この職員のストレスチェック結果は、本人の同意が得られていないため閲覧できません。'}
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
              <h4 className="font-semibold">【法的根拠】労働安全衛生法第66条の10第2項</h4>
              <p className="text-muted-foreground">
                ストレスチェック結果の閲覧には本人の同意が必要です。
                就業上の配慮措置が必要と判断される場合は、産業医にご相談ください。
              </p>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm mb-2">産業医への相談方法</h4>
              <p className="text-sm text-muted-foreground">
                産業医は職務上の必要により、同意の有無に関わらず全職員のストレスチェック結果を閲覧できます。
                配置転換や業務調整の必要性について、産業医に相談することが推奨されます。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 同意あり: 制限付きデータを表示
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ストレスチェック結果（人事部閲覧）</h1>
        {data.staffInfo && (
          <p className="text-muted-foreground mt-2">
            職員: {data.staffInfo.name} ({data.staffInfo.staffId}) - {data.staffInfo.department} / {data.staffInfo.position}
          </p>
        )}
      </div>

      {/* 同意状況の表示 */}
      <Alert className="bg-green-50 border-green-200">
        <CheckCircleIcon className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">本人の同意あり</AlertTitle>
        <AlertDescription className="text-green-700">
          この職員は人事部門へのストレスチェック結果共有に同意しています
          {data.displayData?.consentDate && (
            <span className="ml-2">
              （同意日: {new Date(data.displayData.consentDate).toLocaleDateString('ja-JP')}）
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* ストレスチェック結果 */}
      {data.displayData && (
        <Card>
          <CardHeader>
            <CardTitle>ストレスチェック結果概要</CardTitle>
            <CardDescription>
              実施日: {new Date(data.displayData.implementationDate).toLocaleDateString('ja-JP')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 結果サマリー */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">ストレスレベル</div>
                <div className="text-2xl font-bold mt-2">
                  {data.displayData.stressLevel === 'low' && (
                    <span className="text-green-600">低</span>
                  )}
                  {data.displayData.stressLevel === 'medium' && (
                    <span className="text-yellow-600">中</span>
                  )}
                  {data.displayData.stressLevel === 'high' && (
                    <span className="text-red-600">高</span>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">高ストレス判定</div>
                <div className="text-2xl font-bold mt-2">
                  {data.displayData.highStressFlag ? (
                    <Badge variant="destructive" className="text-lg">該当</Badge>
                  ) : (
                    <Badge variant="outline" className="text-lg">非該当</Badge>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">産業医面談</div>
                <div className="text-2xl font-bold mt-2">
                  {data.displayData.needsInterview ? (
                    <Badge variant="default" className="text-lg">推奨</Badge>
                  ) : (
                    <Badge variant="outline" className="text-lg">不要</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* 高ストレス時の警告 */}
            {data.displayData.highStressFlag && (
              <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>高ストレス状態</AlertTitle>
                <AlertDescription>
                  産業医面談の推奨、業務量の調整、配置転換の検討などの配慮措置を検討してください。
                  詳細は産業医にご相談ください。
                </AlertDescription>
              </Alert>
            )}

            {/* 人事部向け推奨措置 */}
            {data.displayData.hrRecommendations && data.displayData.hrRecommendations.length > 0 && (
              <div className="border rounded-lg p-4 bg-blue-50">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <InfoIcon className="h-4 w-4" />
                  推奨される配慮措置
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {data.displayData.hrRecommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 注意事項 */}
      <Card>
        <CardHeader>
          <CardTitle>人事部閲覧時の注意事項</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <ShieldCheckIcon className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <h4 className="font-semibold">閲覧可能な情報の制限</h4>
              <p className="text-muted-foreground">
                人事部門が閲覧できるのは、ストレスレベル・高ストレス判定・産業医面談の推奨有無など、
                就業上の配慮措置に必要な最小限の情報のみです。質問票の詳細な回答内容は閲覧できません。
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <LockIcon className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <h4 className="font-semibold">守秘義務</h4>
              <p className="text-muted-foreground">
                閲覧した情報は厳重に管理し、本人のプライバシー保護に配慮してください。
                不要な第三者への開示は厳禁です。
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <AlertCircleIcon className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <h4 className="font-semibold">不利益取扱いの禁止</h4>
              <p className="text-muted-foreground">
                ストレスチェック結果を理由とした不利益な取扱い（解雇、降格、配置転換の強要等）は
                法律で禁止されています。配慮措置の実施のみに活用してください。
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <InfoIcon className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <h4 className="font-semibold">監査ログの記録</h4>
              <p className="text-muted-foreground">
                このページへのアクセスは全て監査ログに記録されます。不適切なアクセスは検出されます。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
