'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, User, AlertTriangle } from 'lucide-react';
import { UnifiedInterviewReservation } from './UnifiedInterviewDashboard';

interface ManualReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reservation: Partial<UnifiedInterviewReservation>) => void;
}

export default function ManualReservationModal({
  isOpen,
  onClose,
  onSubmit
}: ManualReservationModalProps) {
  const [formData, setFormData] = useState({
    staffId: '',
    staffName: '',
    department: '',
    position: '',
    experienceYears: 0,
    type: 'regular' as 'regular' | 'special' | 'support',
    regularType: 'annual',
    specialType: '',
    supportCategory: '',
    supportTopic: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '10:00',
    duration: 30,
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reservation: Partial<UnifiedInterviewReservation> = {
      id: `MANUAL-${Date.now()}`,
      type: formData.type,
      staffId: formData.staffId,
      staffName: formData.staffName,
      department: formData.department,
      position: formData.position,
      experienceYears: formData.experienceYears,
      scheduledDate: new Date(formData.scheduledDate),
      scheduledTime: formData.scheduledTime,
      duration: formData.duration,
      status: 'confirmed',
      urgency: formData.urgency,
      regularType: formData.type === 'regular' ? formData.regularType as any : undefined,
      specialType: formData.type === 'special' ? formData.specialType as any : undefined,
      supportCategory: formData.type === 'support' ? formData.supportCategory : undefined,
      supportTopic: formData.type === 'support' ? formData.supportTopic : undefined,
      notes: formData.notes,
      createdAt: new Date(),
      source: 'manual' as any, // 手動入力を識別
      createdBy: '管理者' // 実際には認証情報から取得
    };

    onSubmit(reservation);
    handleClose();
  };

  const handleClose = () => {
    // フォームをリセット
    setFormData({
      staffId: '',
      staffName: '',
      department: '',
      position: '',
      experienceYears: 0,
      type: 'regular',
      regularType: 'annual',
      specialType: '',
      supportCategory: '',
      supportTopic: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '10:00',
      duration: 30,
      urgency: 'medium',
      notes: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>面談予約を追加</DialogTitle>
          <DialogDescription>
            電話や対面での予約申込を手動で登録します
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* 職員情報 */}
          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              職員情報
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="staffId">職員ID *</Label>
                <Input
                  id="staffId"
                  value={formData.staffId}
                  onChange={(e) => setFormData({...formData, staffId: e.target.value})}
                  required
                  placeholder="例: STAFF001"
                />
              </div>
              
              <div>
                <Label htmlFor="staffName">職員名 *</Label>
                <Input
                  id="staffName"
                  value={formData.staffName}
                  onChange={(e) => setFormData({...formData, staffName: e.target.value})}
                  required
                  placeholder="例: 山田太郎"
                />
              </div>
              
              <div>
                <Label htmlFor="department">部署 *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({...formData, department: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="部署を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="看護部">看護部</SelectItem>
                    <SelectItem value="リハビリテーション科">リハビリテーション科</SelectItem>
                    <SelectItem value="医事課">医事課</SelectItem>
                    <SelectItem value="総務部">総務部</SelectItem>
                    <SelectItem value="栄養科">栄養科</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="position">職位 *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  required
                  placeholder="例: 看護師"
                />
              </div>
              
              <div>
                <Label htmlFor="experienceYears">経験年数</Label>
                <Input
                  id="experienceYears"
                  type="number"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* 面談情報 */}
          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              面談情報
            </h3>
            
            <div>
              <Label htmlFor="type">面談種別 *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData({...formData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">定期面談</SelectItem>
                  <SelectItem value="special">特別面談</SelectItem>
                  <SelectItem value="support">サポート面談</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 定期面談の詳細 */}
            {formData.type === 'regular' && (
              <div>
                <Label htmlFor="regularType">定期面談種別</Label>
                <Select
                  value={formData.regularType}
                  onValueChange={(value) => setFormData({...formData, regularType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_employee">新入職員月次面談</SelectItem>
                    <SelectItem value="annual">一般職員年次面談</SelectItem>
                    <SelectItem value="management">管理職半年面談</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* 特別面談の詳細 */}
            {formData.type === 'special' && (
              <div>
                <Label htmlFor="specialType">特別面談種別</Label>
                <Select
                  value={formData.specialType}
                  onValueChange={(value) => setFormData({...formData, specialType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="種別を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exit">退職面談</SelectItem>
                    <SelectItem value="transfer">異動面談</SelectItem>
                    <SelectItem value="return">復職面談</SelectItem>
                    <SelectItem value="promotion">昇進面談</SelectItem>
                    <SelectItem value="disciplinary">懲戒面談</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* サポート面談の詳細 */}
            {formData.type === 'support' && (
              <>
                <div>
                  <Label htmlFor="supportCategory">相談カテゴリ</Label>
                  <Select
                    value={formData.supportCategory}
                    onValueChange={(value) => setFormData({...formData, supportCategory: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="career">キャリア相談</SelectItem>
                      <SelectItem value="workplace">職場環境</SelectItem>
                      <SelectItem value="personal">個人的相談</SelectItem>
                      <SelectItem value="skill">スキル開発</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="supportTopic">相談内容</Label>
                  <Input
                    id="supportTopic"
                    value={formData.supportTopic}
                    onChange={(e) => setFormData({...formData, supportTopic: e.target.value})}
                    placeholder="具体的な相談内容"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scheduledDate">予約日 *</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="scheduledTime">予約時刻 *</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="duration">所要時間（分）</Label>
                <Select
                  value={formData.duration.toString()}
                  onValueChange={(value) => setFormData({...formData, duration: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15分</SelectItem>
                    <SelectItem value="30">30分</SelectItem>
                    <SelectItem value="45">45分</SelectItem>
                    <SelectItem value="60">60分</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="urgency">緊急度</Label>
                <Select
                  value={formData.urgency}
                  onValueChange={(value: any) => setFormData({...formData, urgency: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">低</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="urgent">緊急</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 備考 */}
          <div className="space-y-2">
            <Label htmlFor="notes">備考</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="電話予約、緊急対応など、予約の経緯や特記事項を記入"
              rows={3}
            />
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              キャンセル
            </Button>
            <Button type="submit">
              予約を追加
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}