'use client';

import React, { useRef, useState } from 'react';
import { X, Printer, Download, Settings, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { exportToPDF } from '@/utils/pdfExport';

interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  onPrint?: () => void;
  onExportPDF?: () => void;
  showSettings?: boolean;
}

interface PrintSettings {
  paperSize: 'A4' | 'A3' | 'Letter';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  showHeader: boolean;
  showFooter: boolean;
  headerText: string;
  footerText: string;
  showPageNumbers: boolean;
  showDate: boolean;
  scale: number;
}

export default function PrintPreview({
  isOpen,
  onClose,
  title,
  content,
  onPrint,
  onExportPDF,
  showSettings = true
}: PrintPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [settings, setSettings] = useState<PrintSettings>({
    paperSize: 'A4',
    orientation: 'portrait',
    margins: {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
    },
    showHeader: true,
    showFooter: true,
    headerText: '医療法人厚生会 面談記録',
    footerText: '',
    showPageNumbers: true,
    showDate: true,
    scale: 100
  });

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    
    try {
      // 一時的なIDを付与
      const tempId = `print-content-${Date.now()}`;
      printRef.current.id = tempId;
      
      await exportToPDF({
        title,
        facility: settings.headerText,
        reportType: '面談記録',
        dateRange: '',
        elementId: tempId
      });
      
      // IDを削除
      printRef.current.removeAttribute('id');
      
      if (onExportPDF) onExportPDF();
    } catch (error) {
      console.error('PDFエクスポートエラー:', error);
      alert('PDFの生成に失敗しました');
    }
  };
  
  const handlePrint = () => {
    // 印刷用スタイルを適用
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', 'PRINT', 'width=800,height=600');
    if (!printWindow) return;

    const styles = `
      <style>
        @media print {
          @page {
            size: ${settings.paperSize} ${settings.orientation};
            margin: ${settings.margins.top}mm ${settings.margins.right}mm ${settings.margins.bottom}mm ${settings.margins.left}mm;
          }
          body {
            font-family: 'Yu Gothic', 'Meiryo', sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .print-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            padding: 10px 20px;
            border-bottom: 2px solid #333;
            background: white;
            z-index: 1000;
          }
          .print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px 20px;
            border-top: 1px solid #ccc;
            background: white;
            text-align: center;
            font-size: 12px;
            z-index: 1000;
          }
          .print-content {
            padding-top: ${settings.showHeader ? '60px' : '0'};
            padding-bottom: ${settings.showFooter ? '40px' : '0'};
            transform: scale(${settings.scale / 100});
            transform-origin: top left;
          }
          .page-break {
            page-break-before: always;
          }
          h1, h2, h3 {
            page-break-after: avoid;
          }
          table {
            page-break-inside: avoid;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      </style>
    `;

    const headerHtml = settings.showHeader ? `
      <div class="print-header">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>${settings.headerText}</div>
          ${settings.showDate ? `<div>${new Date().toLocaleDateString('ja-JP')}</div>` : ''}
        </div>
      </div>
    ` : '';

    const footerHtml = settings.showFooter ? `
      <div class="print-footer">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>${settings.footerText}</div>
          ${settings.showPageNumbers ? '<div>ページ <span class="page-number"></span></div>' : ''}
        </div>
      </div>
    ` : '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          ${styles}
        </head>
        <body>
          ${headerHtml}
          <div class="print-content">
            ${printContent.innerHTML}
          </div>
          ${footerHtml}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);

    if (onPrint) onPrint();
  };

  const updateSetting = <K extends keyof PrintSettings>(key: K, value: PrintSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateMargin = (side: keyof PrintSettings['margins'], value: number) => {
    setSettings(prev => ({
      ...prev,
      margins: {
        ...prev.margins,
        [side]: value
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        <div className="flex h-full">
          {/* メインプレビューエリア */}
          <div className="flex-1 flex flex-col">
            <DialogHeader className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  印刷プレビュー: {title}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  {showSettings && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      設定
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPDF}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handlePrint}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    印刷
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>

            {/* プレビューコンテンツ */}
            <div className="flex-1 overflow-auto bg-gray-100 p-8">
              <div 
                className="mx-auto bg-white shadow-lg"
                style={{
                  width: settings.paperSize === 'A4' ? '210mm' : settings.paperSize === 'A3' ? '297mm' : '216mm',
                  minHeight: settings.paperSize === 'A4' ? '297mm' : settings.paperSize === 'A3' ? '420mm' : '279mm',
                  padding: `${settings.margins.top}mm ${settings.margins.right}mm ${settings.margins.bottom}mm ${settings.margins.left}mm`,
                  transform: `scale(${settings.scale / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.3s ease'
                }}
              >
                {/* ヘッダー */}
                {settings.showHeader && (
                  <div className="border-b-2 border-gray-800 pb-2 mb-4">
                    <div className="flex justify-between items-center">
                      <div className="font-bold">{settings.headerText}</div>
                      {settings.showDate && (
                        <div className="text-sm text-gray-600">
                          {new Date().toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* コンテンツ */}
                <div ref={printRef} className="print-content">
                  {content}
                </div>

                {/* フッター */}
                {settings.showFooter && (
                  <div className="border-t border-gray-400 pt-2 mt-8">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <div>{settings.footerText}</div>
                      {settings.showPageNumbers && (
                        <div>1 / 1</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 設定パネル */}
          {showSettingsPanel && (
            <div className="w-80 border-l bg-gray-50 p-4 overflow-y-auto">
              <h3 className="font-bold mb-4">印刷設定</h3>
              
              {/* 用紙設定 */}
              <div className="space-y-4">
                <div>
                  <Label>用紙サイズ</Label>
                  <Select
                    value={settings.paperSize}
                    onValueChange={(value) => updateSetting('paperSize', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4</SelectItem>
                      <SelectItem value="A3">A3</SelectItem>
                      <SelectItem value="Letter">レター</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>印刷方向</Label>
                  <Select
                    value={settings.orientation}
                    onValueChange={(value) => updateSetting('orientation', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">縦</SelectItem>
                      <SelectItem value="landscape">横</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>拡大/縮小 ({settings.scale}%)</Label>
                  <Input
                    type="range"
                    min="50"
                    max="150"
                    value={settings.scale}
                    onChange={(e) => updateSetting('scale', parseInt(e.target.value))}
                  />
                </div>

                {/* 余白設定 */}
                <div>
                  <Label>余白 (mm)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <Label className="text-xs">上</Label>
                      <Input
                        type="number"
                        value={settings.margins.top}
                        onChange={(e) => updateMargin('top', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">下</Label>
                      <Input
                        type="number"
                        value={settings.margins.bottom}
                        onChange={(e) => updateMargin('bottom', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">左</Label>
                      <Input
                        type="number"
                        value={settings.margins.left}
                        onChange={(e) => updateMargin('left', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">右</Label>
                      <Input
                        type="number"
                        value={settings.margins.right}
                        onChange={(e) => updateMargin('right', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                {/* ヘッダー/フッター設定 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>ヘッダー表示</Label>
                    <Switch
                      checked={settings.showHeader}
                      onCheckedChange={(checked) => updateSetting('showHeader', checked)}
                    />
                  </div>
                  {settings.showHeader && (
                    <Input
                      placeholder="ヘッダーテキスト"
                      value={settings.headerText}
                      onChange={(e) => updateSetting('headerText', e.target.value)}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>フッター表示</Label>
                    <Switch
                      checked={settings.showFooter}
                      onCheckedChange={(checked) => updateSetting('showFooter', checked)}
                    />
                  </div>
                  {settings.showFooter && (
                    <Input
                      placeholder="フッターテキスト"
                      value={settings.footerText}
                      onChange={(e) => updateSetting('footerText', e.target.value)}
                    />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Label>日付表示</Label>
                  <Switch
                    checked={settings.showDate}
                    onCheckedChange={(checked) => updateSetting('showDate', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>ページ番号</Label>
                  <Switch
                    checked={settings.showPageNumbers}
                    onCheckedChange={(checked) => updateSetting('showPageNumbers', checked)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}