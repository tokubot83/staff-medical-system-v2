import React from 'react';
import {
  Users, Briefcase, GraduationCap, LineChart, 
  CheckCircle, ChevronRight, 
  Calendar, Target, Lightbulb,
  Building, FileText,
  Star, Link,
  CreditCard, RefreshCw, 
  ArrowRight, ArrowDown,
  PlusCircle, Layers,
  Clock, Award,
  MessageCircle, Database,
  Search, TrendingUp,
  User, Phone, Mail,
  ClipboardList, Users2,
  AlertCircle, BookOpen,
  Monitor, Settings
} from 'lucide-react';

const ActionPlanLayout = () => {
  return (
    <div className="bg-white p-4 w-full" style={{ minWidth: '1200px' }}>
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
        <div>
          <div className="text-sm text-gray-500 mb-1">内部検討資料</div>
          <h1 className="text-3xl font-bold text-gray-800">人財統括本部準備室 情報収集フェーズ行動計画書</h1>
          <p className="text-gray-600 mt-2">現場の声を丁寧に収集し、実態に即した制度設計のための基盤づくり</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end mb-2">
            <Calendar className="mr-2 text-green-600" size={16} />
            <span className="text-green-800 font-medium">実施期間: 2025年7月～10月</span>
          </div>
          <div className="flex items-center justify-end mb-2">
            <Target className="mr-2 text-green-600" size={16} />
            <span className="text-green-800 font-medium">重点方針: 現場の声収集と課題抽出</span>
          </div>
          <div className="text-sm text-gray-600">
            作成者：徳留
          </div>
        </div>
      </div>

      {/* 全体スケジュール */}
      <div className="mb-8">
        <h2 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-green-500">
          <Clock className="mr-2 text-green-600" size={22} />
          情報収集フェーズ 全体スケジュール
        </h2>
        
        <div className="border border-green-200 rounded-lg overflow-hidden shadow-md">
          <div className="bg-green-600 text-white p-3">
            <h3 className="text-lg font-bold">4ヶ月間の段階的アプローチ</h3>
            <p className="text-sm text-white text-opacity-90">現場との信頼関係構築から本格的な課題抽出まで</p>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-bold text-green-800 mb-2 flex items-center">
                  <Calendar className="mr-1" size={14} />
                  7月：基盤づくり
                </h4>
                <ul className="text-xs space-y-1">
                  <li>• キックオフ会議</li>
                  <li>• 管理職説明会</li>
                  <li>• 運営ルール確立</li>
                  <li>• 現状把握開始</li>
                </ul>
              </div>
              <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                <h4 className="font-bold text-green-800 mb-2 flex items-center">
                  <Search className="mr-1" size={14} />
                  8月：本格収集
                </h4>
                <ul className="text-xs space-y-1">
                  <li>• 現場ヒアリング開始</li>
                  <li>• アンケート実施</li>
                  <li>• 養成校訪問</li>
                  <li>• データ収集本格化</li>
                </ul>
              </div>
              <div className="bg-green-200 border border-green-400 rounded-lg p-3">
                <h4 className="font-bold text-green-800 mb-2 flex items-center">
                  <ClipboardList className="mr-1" size={14} />
                  9月：深掘り分析
                </h4>
                <ul className="text-xs space-y-1">
                  <li>• 課題の詳細分析</li>
                  <li>• 他法人事例研究</li>
                  <li>• 制度比較検討</li>
                  <li>• 優先順位検討</li>
                </ul>
              </div>
              <div className="bg-green-300 border border-green-500 rounded-lg p-3">
                <h4 className="font-bold text-green-800 mb-2 flex items-center">
                  <FileText className="mr-1" size={14} />
                  10月：まとめ
                </h4>
                <ul className="text-xs space-y-1">
                  <li>• 課題整理・統合</li>
                  <li>• 制度設計準備</li>
                  <li>• 次フェーズ計画</li>
                  <li>• 中間報告</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 最終成功指標 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-green-500">
          <Award className="mr-2 text-green-600" size={22} />
          情報収集フェーズ 最終成功指標（10月末時点）
        </h2>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-700 mb-2">80%</div>
              <div className="text-sm text-green-600">ヒアリング実施率</div>
              <div className="text-xs text-gray-600 mt-1">看護スタッフの80%以上</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-700 mb-2">10+</div>
              <div className="text-sm text-green-600">課題抽出件数</div>
              <div className="text-xs text-gray-600 mt-1">部門別に最低10項目以上</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-700 mb-2">70%</div>
              <div className="text-sm text-green-600">アンケート回収率</div>
              <div className="text-xs text-gray-600 mt-1">全対象者の70%以上</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-700 mb-2">3+</div>
              <div className="text-sm text-green-600">他法人事例研究</div>
              <div className="text-xs text-gray-600 mt-1">各部門最低3事例以上</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPlanLayout;