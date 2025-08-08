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
  Monitor, Settings,
  Edit3, Cog, BarChart3,
  Presentation, UserCheck,
  Workflow, Calculator,
  Brain, TestTube, Shield
} from 'lucide-react';

const DesignPhaseLayout = () => {
  return (
    <div className="bg-white p-4 w-full" style={{ minWidth: '1200px' }}>
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
        <div>
          <div className="text-sm text-gray-500 mb-1">内部検討資料</div>
          <h1 className="text-3xl font-bold text-gray-800">人財統括本部準備室 制度設計フェーズ行動計画書</h1>
          <p className="text-gray-600 mt-2">現場の声を反映した実践的制度設計・効果的な人材育成プログラムの構築</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end mb-2">
            <Calendar className="mr-2 text-blue-600" size={16} />
            <span className="text-blue-800 font-medium">実施期間: 2025年11月～2026年1月</span>
          </div>
          <div className="flex items-center justify-end mb-2">
            <Target className="mr-2 text-blue-600" size={16} />
            <span className="text-blue-800 font-medium">重点方針: 現場ニーズ反映の制度設計</span>
          </div>
          <div className="text-sm text-gray-600">
            作成者：徳留
          </div>
        </div>
      </div>

      {/* 全体スケジュール */}
      <div className="mb-8">
        <h2 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-blue-500">
          <Edit3 className="mr-2 text-blue-600" size={22} />
          制度設計フェーズ 全体スケジュール
        </h2>
        
        <div className="border border-blue-200 rounded-lg overflow-hidden shadow-md">
          <div className="bg-blue-600 text-white p-3">
            <h3 className="text-lg font-bold">3ヶ月間の集中的制度構築</h3>
            <p className="text-sm text-white text-opacity-90">情報収集結果を基にした実践的制度設計から試行準備まで</p>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                  <Calendar className="mr-1" size={14} />
                  11月：基本設計
                </h4>
                <ul className="text-xs space-y-1">
                  <li>• 情報収集結果分析・整理</li>
                  <li>• 制度設計方針決定</li>
                  <li>• 評価制度素案作成開始</li>
                  <li>• 研修体系基本構造設計</li>
                </ul>
              </div>
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                  <Cog className="mr-1" size={14} />
                  12月：詳細設計
                </h4>
                <ul className="text-xs space-y-1">
                  <li>• 各制度の詳細設計</li>
                  <li>• 面談制度運用方法確定</li>
                  <li>• 採用戦略具体化</li>
                  <li>• システム仕様詳細化</li>
                </ul>
              </div>
              <div className="bg-blue-200 border border-blue-400 rounded-lg p-3">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                  <TestTube className="mr-1" size={14} />
                  1月：試行準備
                </h4>
                <ul className="text-xs space-y-1">
                  <li>• 制度統合・最終調整</li>
                  <li>• パイロット運用準備</li>
                  <li>• 運用マニュアル作成</li>
                  <li>• 現場説明・研修準備</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 制度統合・品質管理 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-orange-500">
          <Workflow className="mr-2 text-orange-600" size={22} />
          制度統合・品質管理
        </h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 shadow-sm">
            <h3 className="font-bold text-orange-800 mb-3 flex items-center">
              <Brain className="mr-2" size={18} />
              制度間連携ポイント
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-orange-700 mb-1">採用 ⇔ 教育</div>
                <div className="text-orange-600">新人受入れ体制と初期教育プログラムの連携</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-orange-700 mb-1">教育 ⇔ 評価</div>
                <div className="text-orange-600">研修成果と人事評価の一体的運用</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-orange-700 mb-1">評価 ⇔ キャリア</div>
                <div className="text-orange-600">評価結果に基づくキャリア支援・目標設定</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-orange-700 mb-1">全制度 ⇔ システム</div>
                <div className="text-orange-600">職員カルテによる一元的データ管理</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 shadow-sm">
            <h3 className="font-bold text-red-800 mb-3 flex items-center">
              <Shield className="mr-2" size={18} />
              品質保証・リスク管理
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-red-700 mb-1">制度品質確認</div>
                <ul className="text-red-600 text-xs space-y-1 mt-1">
                  <li>• 現場負荷・実行可能性の検証</li>
                  <li>• 制度間の矛盾・重複の解消</li>
                  <li>• 法的コンプライアンス確認</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-red-700 mb-1">運用リスク対策</div>
                <ul className="text-red-600 text-xs space-y-1 mt-1">
                  <li>• 現場抵抗への対応策準備</li>
                  <li>• システム障害時バックアップ</li>
                  <li>• スケジュール遅延対応計画</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-red-700 mb-1">継続改善体制</div>
                <ul className="text-red-600 text-xs space-y-1 mt-1">
                  <li>• 制度効果測定指標設定</li>
                  <li>• 定期見直し・改善ルール</li>
                  <li>• フィードバック収集体制</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 最終成功指標 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-blue-500">
          <Award className="mr-2 text-blue-600" size={22} />
          制度設計フェーズ 最終成功指標（1月末時点）
        </h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-700 mb-2">100%</div>
              <div className="text-sm text-blue-600">制度設計完成率</div>
              <div className="text-xs text-gray-600 mt-1">4制度すべて完成</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-700 mb-2">90%</div>
              <div className="text-sm text-blue-600">管理職理解・承認</div>
              <div className="text-xs text-gray-600 mt-1">各施設管理職の90%以上</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-700 mb-2">80%</div>
              <div className="text-sm text-blue-600">システム開発進捗</div>
              <div className="text-xs text-gray-600 mt-1">基本機能開発80%完了</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-700 mb-2">100%</div>
              <div className="text-sm text-blue-600">運用準備完了</div>
              <div className="text-xs text-gray-600 mt-1">マニュアル・研修準備</div>
            </div>
          </div>
        </div>
      </div>

      {/* 次フェーズへの引継ぎ */}
      <div className="mb-8">
        <h2 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-purple-500">
          <ArrowRight className="mr-2 text-purple-600" size={22} />
          試行・調整フェーズへの引継ぎ事項
        </h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 shadow-sm">
            <h3 className="font-bold text-purple-800 mb-3 flex items-center">
              <FileText className="mr-2" size={18} />
              引継ぎ成果物
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-purple-600 flex-shrink-0" size={14} />
                <span>完成した4制度（採用・教育・評価・キャリア支援）</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-purple-600 flex-shrink-0" size={14} />
                <span>運用マニュアル・研修資料一式</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-purple-600 flex-shrink-0" size={14} />
                <span>職員カルテシステム（基本機能）</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-purple-600 flex-shrink-0" size={14} />
                <span>パイロット運用計画・対象者リスト</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-purple-600 flex-shrink-0" size={14} />
                <span>効果測定指標・評価方法</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm">
            <h3 className="font-bold text-green-800 mb-3 flex items-center">
              <TrendingUp className="mr-2" size={18} />
              試行フェーズの準備状況
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-green-600 flex-shrink-0" size={14} />
                <span>パイロット運用対象部署・職員の選定完了</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-green-600 flex-shrink-0" size={14} />
                <span>現場説明会・研修スケジュール確定</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-green-600 flex-shrink-0" size={14} />
                <span>システム運用環境・テストデータ準備</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-green-600 flex-shrink-0" size={14} />
                <span>フィードバック収集・改善体制構築</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-green-600 flex-shrink-0" size={14} />
                <span>本格運用（2026年4月）に向けた準備体制確立</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DesignPhaseLayout;