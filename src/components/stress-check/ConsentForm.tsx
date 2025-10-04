/**
 * ストレスチェック結果 人事部共有同意フォーム
 *
 * 労働安全衛生法第66条の10第2項に基づく本人同意取得UI
 * 職員が自分のストレスチェック結果を人事部門と共有することへの同意を取得
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, ShieldCheckIcon, AlertTriangleIcon } from 'lucide-react';

export interface ConsentFormProps {
  staffId: string;
  staffName: string;
  currentConsentStatus: boolean | null;
  onConsentChange: (consent: boolean) => Promise<void>;
}

export function ConsentForm({
  staffId,
  staffName,
  currentConsentStatus,
  onConsentChange,
}: ConsentFormProps) {
  const [consent, setConsent] = useState<boolean>(currentConsentStatus ?? false);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!confirmed) {
      setError('内容を確認の上、チェックボックスにチェックを入れてください');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onConsentChange(consent);
      // 成功メッセージは親コンポーネントで表示
    } catch (err) {
      setError(err instanceof Error ? err.message : '同意状況の更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5" />
          ストレスチェック結果の人事部門共有について
        </CardTitle>
        <CardDescription>
          労働安全衛生法第66条の10第2項に基づく本人同意の確認
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 現在の同意状況 */}
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>現在の同意状況</AlertTitle>
          <AlertDescription>
            {currentConsentStatus === null && '未設定（まだ同意・不同意を選択していません）'}
            {currentConsentStatus === true && '同意済み（人事部門との共有に同意しています）'}
            {currentConsentStatus === false && '不同意（人事部門との共有に同意していません）'}
          </AlertDescription>
        </Alert>

        {/* 説明文 */}
        <div className="space-y-4 text-sm">
          <h3 className="font-semibold text-base">ストレスチェック結果の取扱いについて</h3>

          <div className="space-y-2">
            <h4 className="font-medium">【同意しない場合】</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>あなたのストレスチェック結果は人事部門には共有されません</li>
              <li>産業医のみが結果を閲覧し、必要に応じて面談を実施します</li>
              <li>集計データ（個人が特定できない統計）には含まれます</li>
              <li>不利益な取扱いを受けることは一切ありません</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">【同意する場合】</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>人事部門があなたの結果の一部（ストレスレベル、高ストレス判定等）を閲覧できます</li>
              <li>就業上の配慮措置（業務量調整、配置転換の検討等）に活用される場合があります</li>
              <li>詳細な回答内容は共有されず、必要最小限の情報のみが対象です</li>
              <li>産業医による面談結果も必要に応じて共有されます</li>
            </ul>
          </div>

          <Alert variant="destructive">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>重要な注意事項</AlertTitle>
            <AlertDescription>
              同意の有無によって不利益な取扱いを受けることは法律で禁止されています。
              ご自身の判断で、自由に選択してください。また、同意状況はいつでも変更できます。
            </AlertDescription>
          </Alert>
        </div>

        {/* 同意選択 */}
        <div className="space-y-4">
          <h3 className="font-semibold">同意の選択</h3>

          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="consent"
                checked={consent === true}
                onChange={() => setConsent(true)}
                className="mt-1"
              />
              <div>
                <div className="font-medium">人事部門との共有に同意します</div>
                <div className="text-sm text-muted-foreground">
                  就業上の配慮措置の検討に活用されることを理解した上で同意します
                </div>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="consent"
                checked={consent === false}
                onChange={() => setConsent(false)}
                className="mt-1"
              />
              <div>
                <div className="font-medium">人事部門との共有に同意しません</div>
                <div className="text-sm text-muted-foreground">
                  産業医のみが結果を閲覧し、人事部門には共有されません
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* 確認チェックボックス */}
        <div className="flex items-start space-x-3">
          <Checkbox
            id="confirm"
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked === true)}
          />
          <label htmlFor="confirm" className="text-sm cursor-pointer">
            上記の内容を理解し、自分の意思で選択したことを確認しました
          </label>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 送信ボタン */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !confirmed}
            className="min-w-[120px]"
          >
            {isSubmitting ? '送信中...' : '同意状況を更新'}
          </Button>
        </div>

        {/* 補足情報 */}
        <div className="text-xs text-muted-foreground border-t pt-4 space-y-1">
          <p>【法的根拠】労働安全衛生法第66条の10第2項</p>
          <p>
            「事業者は、前項の規定による医師による面接指導を実施するため、厚生労働省令で定めるところにより、
            労働者に対し、同項の心理的な負担の程度を把握するための検査の結果を当該事業者に提出するよう求めることができる。
            ただし、当該労働者の同意を得ずに当該検査の結果を取得してはならない。」
          </p>
          <p className="mt-2">
            同意状況の変更履歴は監査ログに記録され、適切な運用が確保されます。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
