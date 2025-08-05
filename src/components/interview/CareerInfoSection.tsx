'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Edit2, Save, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CareerInfo {
  joinDate: string
  previousExperience: string
  totalExperience: string
  education: string
  qualifications: string[]
  deploymentHistory: string[]
  lastUpdated?: string
  updatedBy?: string
}

interface CareerInfoSectionProps {
  data: CareerInfo | null
  editable: boolean
  isFirstTime: boolean
  onSave?: (data: CareerInfo) => void
}

export function CareerInfoSection({ data, editable, isFirstTime, onSave }: CareerInfoSectionProps) {
  const [isEditing, setIsEditing] = React.useState(isFirstTime)
  const [formData, setFormData] = React.useState<CareerInfo>(data || {
    joinDate: '',
    previousExperience: '',
    totalExperience: '',
    education: '',
    qualifications: [],
    deploymentHistory: [],
  })

  const handleSave = () => {
    const updatedData = {
      ...formData,
      lastUpdated: new Date().toLocaleDateString('ja-JP'),
      updatedBy: '人事部' // 実際の実装では認証情報から取得
    }
    onSave?.(updatedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (data) {
      setFormData(data)
    }
    setIsEditing(false)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">職歴情報</CardTitle>
          {editable && !isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              編集
            </Button>
          )}
          {isEditing && (
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-1" />
                保存
              </Button>
              {!isFirstTime && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4 mr-1" />
                  キャンセル
                </Button>
              )}
            </div>
          )}
        </div>
        {data?.lastUpdated && (
          <p className="text-sm text-gray-600 mt-2">
            最終更新: {data.lastUpdated} by {data.updatedBy}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {isFirstTime && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              初回面談のため、職歴情報を入力してください。この情報は今後の面談や人事評価で自動的に参照されます。
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="joinDate">入職年月日</Label>
            <Input
              id="joinDate"
              type="date"
              value={formData.joinDate}
              onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="totalExperience">通算経験年数</Label>
            <Input
              id="totalExperience"
              type="text"
              placeholder="例: 5年3ヶ月"
              value={formData.totalExperience}
              onChange={(e) => setFormData({ ...formData, totalExperience: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="previousExperience">前職経験</Label>
          <Textarea
            id="previousExperience"
            placeholder="例: ○○病院 内科病棟 3年（2019-2022）"
            value={formData.previousExperience}
            onChange={(e) => setFormData({ ...formData, previousExperience: e.target.value })}
            disabled={!isEditing}
            className="min-h-[80px]"
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="education">最終学歴</Label>
          <Input
            id="education"
            type="text"
            placeholder="例: ○○大学 看護学部 2019年卒"
            value={formData.education}
            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            disabled={!isEditing}
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="qualifications">保有資格・認定</Label>
          <Textarea
            id="qualifications"
            placeholder="看護師免許、認定看護師、専門看護師など（改行で区切って入力）"
            value={formData.qualifications.join('\n')}
            onChange={(e) => setFormData({ ...formData, qualifications: e.target.value.split('\n').filter(q => q.trim()) })}
            disabled={!isEditing}
            className="min-h-[100px]"
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="deploymentHistory">配属履歴</Label>
          <Textarea
            id="deploymentHistory"
            placeholder="例: 2022.4 内科病棟配属&#10;2023.10 ICU配属"
            value={formData.deploymentHistory.join('\n')}
            onChange={(e) => setFormData({ ...formData, deploymentHistory: e.target.value.split('\n').filter(d => d.trim()) })}
            disabled={!isEditing}
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  )
}