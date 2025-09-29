'use client';

/**
 * 健康データマスター管理コンポーネント
 * Created: 2025-09-29
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Activity,
  FileText,
  Building,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Save,
  Download,
  Upload,
  Heart,
  Brain,
  Stethoscope,
  ClipboardList,
} from 'lucide-react';
import { toast } from 'sonner';

// 検査項目カテゴリ
const examCategories = [
  { code: 'PHYSICAL', name: '身体測定', icon: Activity },
  { code: 'BLOOD', name: '血液検査', icon: Heart },
  { code: 'URINE', name: '尿検査', icon: Stethoscope },
  { code: 'LIVER', name: '肝機能', icon: Activity },
  { code: 'LIPID', name: '脂質', icon: Heart },
  { code: 'KIDNEY', name: '腎機能', icon: Activity },
  { code: 'VISION', name: '視力', icon: Activity },
  { code: 'HEARING', name: '聴力', icon: Activity },
  { code: 'CHEST_XRAY', name: '胸部X線', icon: FileText },
  { code: 'ECG', name: '心電図', icon: Heart },
  { code: 'STRESS', name: 'ストレスチェック', icon: Brain },
];

// サンプルデータ
const sampleExamItems = [
  { id: 1, categoryCode: 'PHYSICAL', itemCode: 'HEIGHT', itemName: '身長', unit: 'cm', referenceMin: null, referenceMax: null, enabled: true },
  { id: 2, categoryCode: 'PHYSICAL', itemCode: 'WEIGHT', itemName: '体重', unit: 'kg', referenceMin: null, referenceMax: null, enabled: true },
  { id: 3, categoryCode: 'PHYSICAL', itemCode: 'BMI', itemName: 'BMI', unit: 'kg/m²', referenceMin: 18.5, referenceMax: 25.0, enabled: true },
  { id: 4, categoryCode: 'BLOOD', itemCode: 'WBC', itemName: '白血球数', unit: '/μL', referenceMin: 3500, referenceMax: 9100, enabled: true },
  { id: 5, categoryCode: 'BLOOD', itemCode: 'RBC', itemName: '赤血球数', unit: '万/μL', referenceMin: 400, referenceMax: 550, enabled: true },
  { id: 6, categoryCode: 'LIVER', itemCode: 'AST', itemName: 'AST(GOT)', unit: 'U/L', referenceMin: null, referenceMax: 30, enabled: true },
  { id: 7, categoryCode: 'LIVER', itemCode: 'ALT', itemName: 'ALT(GPT)', unit: 'U/L', referenceMin: null, referenceMax: 30, enabled: true },
  { id: 8, categoryCode: 'LIPID', itemCode: 'T-CHO', itemName: '総コレステロール', unit: 'mg/dL', referenceMin: 140, referenceMax: 220, enabled: true },
  { id: 9, categoryCode: 'LIPID', itemCode: 'HDL-C', itemName: 'HDLコレステロール', unit: 'mg/dL', referenceMin: 40, referenceMax: null, enabled: true },
  { id: 10, categoryCode: 'LIPID', itemCode: 'LDL-C', itemName: 'LDLコレステロール', unit: 'mg/dL', referenceMin: null, referenceMax: 120, enabled: true },
];

const sampleInstitutions = [
  { id: 1, code: 'HC001', name: '医療法人 健康診断センター', contactPerson: '山田太郎', phone: '03-1234-5678', email: 'health@example.com', address: '東京都千代田区...', contractStatus: 'active' },
  { id: 2, code: 'HC002', name: '総合健診クリニック', contactPerson: '佐藤花子', phone: '045-9876-5432', email: 'clinic@example.com', address: '神奈川県横浜市...', contractStatus: 'active' },
  { id: 3, code: 'HC003', name: 'ストレスチェック専門機関', contactPerson: '鈴木一郎', phone: '06-1111-2222', email: 'stress@example.com', address: '大阪府大阪市...', contractStatus: 'active' },
];

const sampleStressQuestions = [
  { id: 1, category: '仕事のストレス要因', questionNo: 1, question: '非常にたくさんの仕事をしなければならない', required: true },
  { id: 2, category: '仕事のストレス要因', questionNo: 2, question: '時間内に仕事が処理しきれない', required: true },
  { id: 3, category: '仕事のストレス要因', questionNo: 3, question: '一生懸命働かなければならない', required: true },
  { id: 4, category: '心身のストレス反応', questionNo: 29, question: 'いらいらしている', required: true },
  { id: 5, category: '心身のストレス反応', questionNo: 30, question: '内心腹立たしい', required: true },
  { id: 6, category: '周囲のサポート', questionNo: 50, question: '上司は頼りになる', required: true },
  { id: 7, category: '周囲のサポート', questionNo: 51, question: '同僚は頼りになる', required: true },
];

export default function HealthDataMasterManager() {
  const [activeTab, setActiveTab] = useState('examItems');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 検査項目の編集ダイアログ
  const ExamItemDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingItem?.id ? '検査項目編集' : '検査項目追加'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="category">カテゴリ</Label>
            <Select defaultValue={editingItem?.categoryCode || ''}>
              <SelectTrigger>
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                {examCategories.map(cat => (
                  <SelectItem key={cat.code} value={cat.code}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="itemCode">項目コード</Label>
              <Input
                id="itemCode"
                defaultValue={editingItem?.itemCode}
                placeholder="例: BMI"
              />
            </div>
            <div>
              <Label htmlFor="itemName">項目名</Label>
              <Input
                id="itemName"
                defaultValue={editingItem?.itemName}
                placeholder="例: BMI"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="unit">単位</Label>
              <Input
                id="unit"
                defaultValue={editingItem?.unit}
                placeholder="例: kg/m²"
              />
            </div>
            <div>
              <Label htmlFor="referenceMin">基準値（下限）</Label>
              <Input
                id="referenceMin"
                type="number"
                defaultValue={editingItem?.referenceMin}
                placeholder="数値"
              />
            </div>
            <div>
              <Label htmlFor="referenceMax">基準値（上限）</Label>
              <Input
                id="referenceMax"
                type="number"
                defaultValue={editingItem?.referenceMax}
                placeholder="数値"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={() => {
            toast.success('検査項目を保存しました');
            setIsDialogOpen(false);
          }}>
            <Save className="w-4 h-4 mr-2" />
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="examItems">
            <ClipboardList className="w-4 h-4 mr-2" />
            検査項目
          </TabsTrigger>
          <TabsTrigger value="institutions">
            <Building className="w-4 h-4 mr-2" />
            健診機関
          </TabsTrigger>
          <TabsTrigger value="stressCheck">
            <Brain className="w-4 h-4 mr-2" />
            ストレスチェック
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="w-4 h-4 mr-2" />
            通知テンプレート
          </TabsTrigger>
        </TabsList>

        {/* 検査項目マスター */}
        <TabsContent value="examItems" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">検査項目マスター</CardTitle>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全カテゴリ</SelectItem>
                      {examCategories.map(cat => (
                        <SelectItem key={cat.code} value={cat.code}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={() => {
                    setEditingItem(null);
                    setIsDialogOpen(true);
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    項目追加
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>カテゴリ</TableHead>
                    <TableHead>項目コード</TableHead>
                    <TableHead>項目名</TableHead>
                    <TableHead>単位</TableHead>
                    <TableHead>基準値範囲</TableHead>
                    <TableHead>状態</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleExamItems
                    .filter(item => selectedCategory === 'all' || item.categoryCode === selectedCategory)
                    .map(item => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant="outline">
                            {examCategories.find(c => c.code === item.categoryCode)?.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">{item.itemCode}</TableCell>
                        <TableCell className="font-medium">{item.itemName}</TableCell>
                        <TableCell>{item.unit || '-'}</TableCell>
                        <TableCell>
                          {item.referenceMin !== null || item.referenceMax !== null ? (
                            <span className="text-sm">
                              {item.referenceMin !== null ? `${item.referenceMin}` : ''}
                              {item.referenceMin !== null && item.referenceMax !== null ? ' - ' : ''}
                              {item.referenceMax !== null ? `${item.referenceMax}` : ''}
                            </span>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={item.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {item.enabled ? '有効' : '無効'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingItem(item);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.info('項目を削除しました')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 健診機関マスター */}
        <TabsContent value="institutions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">健診機関マスター</CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  機関追加
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>機関コード</TableHead>
                    <TableHead>機関名</TableHead>
                    <TableHead>担当者</TableHead>
                    <TableHead>電話番号</TableHead>
                    <TableHead>メール</TableHead>
                    <TableHead>契約状況</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleInstitutions.map(inst => (
                    <TableRow key={inst.id}>
                      <TableCell className="font-mono">{inst.code}</TableCell>
                      <TableCell className="font-medium">{inst.name}</TableCell>
                      <TableCell>{inst.contactPerson}</TableCell>
                      <TableCell>{inst.phone}</TableCell>
                      <TableCell>{inst.email}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          契約中
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ストレスチェック設問 */}
        <TabsContent value="stressCheck" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">ストレスチェック設問管理</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    職業性ストレス簡易調査票（57項目版）の設問管理
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    インポート
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    エクスポート
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>カテゴリ</TableHead>
                    <TableHead>設問内容</TableHead>
                    <TableHead>必須</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleStressQuestions.map(q => (
                    <TableRow key={q.id}>
                      <TableCell className="font-mono">{q.questionNo}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{q.category}</Badge>
                      </TableCell>
                      <TableCell>{q.question}</TableCell>
                      <TableCell>
                        {q.required ? (
                          <Badge className="bg-blue-100 text-blue-800">必須</Badge>
                        ) : (
                          <Badge variant="secondary">任意</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 通知テンプレート */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">通知テンプレート管理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">健診結果通知</h3>
                      <Button size="sm" variant="ghost">
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      健康診断結果を職員に通知する際のメールテンプレート
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">再検査通知</h3>
                      <Button size="sm" variant="ghost">
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      要再検査者への通知テンプレート
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">ストレスチェック案内</h3>
                      <Button size="sm" variant="ghost">
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      ストレスチェック実施案内のテンプレート
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">高ストレス者面談案内</h3>
                      <Button size="sm" variant="ghost">
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      高ストレス判定者への産業医面談案内
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-900">通知設定の注意事項</h4>
                <p className="text-sm text-amber-700 mt-1">
                  通知テンプレートにはプライバシーに配慮し、具体的な検査値は含めないでください。
                  詳細は職員が個別にシステムにログインして確認する形式を推奨します。
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <ExamItemDialog />
    </div>
  );
}