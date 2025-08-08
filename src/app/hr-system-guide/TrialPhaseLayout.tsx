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
  Brain, TestTube, Shield,
  PlayCircle, Settings2, 
  TrendingDown, RotateCcw,
  Eye, ThumbsUp, ThumbsDown,
  Zap, Activity, GitBranch
} from 'lucide-react';

const TrialPhaseLayout = () => {
  return (
    <div className="bg-white p-4 w-full" style={{ minWidth: '1200px' }}>
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
        <div>
          <div className="text-sm text-gray-500 mb-1">内部検討資料</div>
          <h1 className="text-3xl font-bold text-gray-800">人財統括本部準備室 試行・調整フェーズ行動計画書</h1>
          <p className="text-gray-600 mt-2">パイロット運用による制度検証・本格運用に向けた最終調整と準備</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end mb-2">
            <Calendar className="mr-2 text-purple-600" size={16} />
            <span className="text-purple-800 font-medium">実施期間: 2026年2月～3月</span>
          </div>
          <div className="flex items-center justify-end mb-2">
            <Target className="mr-2 text-purple-600" size={16} />
            <span className="text-purple-800 font-medium">重点方針: パイロット運用と最終調整</span>
          </div>
          <div className="text-sm text-gray-600">
            作成者：徳留
          </div>
        </div>
      </div>

      {/* 全体スケジュール */}
      <div className="mb-8">
        <h2 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-purple-500">
          <Clock className="mr-2 text-purple-600" size={22} />
          試行・調整フェーズ 全体スケジュール
        </h2>
        
        <div className="border border-purple-200 rounded-lg overflow-hidden shadow-md">
          <div className="bg-purple-600 text-white p-3">
            <h3 className="text-lg font-bold">2ヶ月間の集中的パイロット運用</h3>
            <p className="text-sm text-white text-opacity-90">実践による制度検証から本格運用準備まで</p>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <h4 className="font-bold text-purple-800 mb-2 flex items-center">
                  <TestTube className="mr-1" size={14} />
                  2月：パイロット運用
                </h4>
                <ul className="text-xs space-y-1">
                  <li>• 各制度のパイロット実施</li>
                  <li>• システム試行運用開始</li>
                  <li>• フィードバック収集</li>
                  <li>• 週次改善サイクル</li>
                </ul>
              </div>
              <div className="bg-purple-100 border border-purple-300 rounded-lg p-3">
                <h4 className="font-bold text-purple-800 mb-2 flex items-center">
                  <Settings2 className="mr-1" size={14} />
                  3月：最終調整・準備
                </h4>
                <ul className="text-xs space-y-1">
                  <li>• 制度最終調整</li>
                  <li>• 全職員研修実施</li>
                  <li>• 運用体制確立</li>
                  <li>• 本格運用準備完了</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 部門別パイロット運用計画 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-blue-500">
          <Briefcase className="mr-2 text-blue-600" size={22} />
          部門別パイロット運用計画
        </h2>
        
        <div className="space-y-6">
          {/* 戦略企画・統括管理部門 */}
          <div className="border border-blue-200 rounded-lg overflow-hidden shadow-md">
            <div className="bg-blue-600 text-white p-3">
              <h3 className="text-lg font-bold flex items-center">
                <Briefcase className="mr-2" size={18} />
                戦略企画・統括管理部門（稼働率: 80%→90%）
              </h3>
              <p className="text-sm text-white text-opacity-90">リーダー：廻 茂樹（総師長）　サポート：徳留 拓哉</p>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-bold text-blue-800 mb-2 text-sm">2月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-blue-700 mb-1">運用監視・調整</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>パイロット運用進捗監視</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>部門間課題調整・解決</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-blue-700 mb-1">統合管理</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>週次パイロット運用会議</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>法人幹部への進捗報告</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>現場抵抗・課題への対応</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                  <h4 className="font-bold text-blue-800 mb-2 text-sm">3月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-blue-700 mb-1">最終調整・承認</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>パイロット結果統合分析</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>制度最終版の経営承認</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>本格運用開始準備完了</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-blue-700 mb-1">人財統括本部移行</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>準備室から本部への移行計画</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>正式組織での運用体制確立</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 人財採用戦略部門 */}
          <div className="border border-green-200 rounded-lg overflow-hidden shadow-md">
            <div className="bg-green-600 text-white p-3">
              <h3 className="text-lg font-bold flex items-center">
                <Users className="mr-2" size={18} />
                人財採用戦略部門（稼働率: 60%→70%）
              </h3>
              <p className="text-sm text-white text-opacity-90">リーダー：平岡 明彦（理学療法士）　メンバー：別府 稜平</p>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-bold text-green-800 mb-2 text-sm">2月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-green-700 mb-1">採用戦略試行</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>新採用プロセスでの模擬面接実施</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>評価基準の実践検証</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>採用担当者への実地研修</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-green-700 mb-1">養成校連携実践</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>特別講義・セミナー実施</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>実習受入れ新体制の試行</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>企業説明会での新アプローチ実践</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                  <h4 className="font-bold text-green-800 mb-2 text-sm">3月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-green-700 mb-1">制度改善・最終化</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>試行結果に基づく採用制度調整</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>面接評価基準の精度向上</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>採用マニュアルの最終版作成</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-green-700 mb-1">2026年度採用準備</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>4月からの本格採用活動準備</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>養成校との連携体制本格稼働</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>採用管理システム本格運用</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 教育体制構築部門 */}
          <div className="border border-indigo-200 rounded-lg overflow-hidden shadow-md">
            <div className="bg-indigo-600 text-white p-3">
              <h3 className="text-lg font-bold flex items-center">
                <GraduationCap className="mr-2" size={18} />
                教育体制構築部門（稼働率: 50-60%→70%）
              </h3>
              <p className="text-sm text-white text-opacity-90">リーダー：永江 由貴乃（新教育師長）　メンバー：橋口 大毅、安里 なるみ</p>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                  <h4 className="font-bold text-indigo-800 mb-2 text-sm">2月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-indigo-700 mb-1">新教育制度試行</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>新研修プログラムのパイロット実施</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>eラーニングシステム試行運用</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>指導者研修の効果検証</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-indigo-700 mb-1">面談制度パイロット</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>新面談制度での実際の面談実施</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>面談シート・記録方法の検証</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>面談者・被面談者からフィードバック収集</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-3">
                  <h4 className="font-bold text-indigo-800 mb-2 text-sm">3月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-indigo-700 mb-1">制度改善・完成</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>パイロット結果による教育制度調整</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>研修プログラムの最終改良</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>面談制度の運用手順確定</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-indigo-700 mb-1">本格運用準備</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>全スタッフ向け教育制度説明会</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>2026年度教育計画策定</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>永江教育師長体制の本格稼働</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* キャリア支援部門 */}
          <div className="border border-purple-200 rounded-lg overflow-hidden shadow-md">
            <div className="bg-purple-600 text-white p-3">
              <h3 className="text-lg font-bold flex items-center">
                <TrendingUp className="mr-2" size={18} />
                キャリア支援部門（稼働率: 40%→50-60%）
              </h3>
              <p className="text-sm text-white text-opacity-90">リーダー：橋口 由香　メンバー：別府 稜平、通村 利菜、橋元 沙央里</p>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h4 className="font-bold text-purple-800 mb-2 text-sm">2月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-purple-700 mb-1">評価制度パイロット</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>新評価制度での実際の評価実施</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>看護師・看護補助者別評価検証</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>評価者・被評価者フィードバック</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-purple-700 mb-1">キャリア支援試行</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>キャリア相談窓口の試行運用</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>目標設定・達成支援の実践</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>キャリアパス可視化ツール検証</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-100 border border-purple-300 rounded-lg p-3">
                  <h4 className="font-bold text-purple-800 mb-2 text-sm">3月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-purple-700 mb-1">制度精緻化</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>評価制度の基準見直し・調整</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>キャリア支援プロセス改善</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>面談・評価マニュアル最終版</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-purple-700 mb-1">本格実施準備</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>全職員向け制度説明・研修</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>評価者・面談者の最終研修</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>2026年度評価・キャリア支援計画</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 業務革新部門 */}
          <div className="border border-amber-200 rounded-lg overflow-hidden shadow-md">
            <div className="bg-amber-600 text-white p-3">
              <h3 className="text-lg font-bold flex items-center">
                <LineChart className="mr-2" size={18} />
                業務革新部門（稼働率: 50%→70%）
              </h3>
              <p className="text-sm text-white text-opacity-90">リーダー：前田 幸明（理学療法士）　メンバー：内西 賢一郎</p>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <h4 className="font-bold text-amber-800 mb-2 text-sm">2月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-amber-700 mb-1">システム試行運用</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>職員カルテシステム稼働開始</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>データ入力・更新業務の実践</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>ユーザー研修・サポート実施</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-amber-700 mb-1">システム検証</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>機能動作・性能テスト</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>データ分析・レポート機能検証</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>他制度との連携動作確認</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-100 border border-amber-300 rounded-lg p-3">
                  <h4 className="font-bold text-amber-800 mb-2 text-sm">3月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-amber-700 mb-1">システム最終調整</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>試行結果に基づく機能改修</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>UI/UX改善・操作性向上</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>システム安定性確保</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-amber-700 mb-1">本格運用準備</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>全ユーザー向け本格研修</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>運用マニュアル最終版作成</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>サポート体制・ヘルプデスク準備</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* パイロット運用管理 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-orange-500">
          <Eye className="mr-2 text-orange-600" size={22} />
          パイロット運用管理・効果測定
        </h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 shadow-sm">
            <h3 className="font-bold text-orange-800 mb-3 flex items-center">
              <Activity className="mr-2" size={18} />
              パイロット運用対象・範囲
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-orange-700 mb-1">対象部署・職員</div>
                <ul className="text-orange-600 text-xs space-y-1 mt-1">
                  <li>• 小原病院看護部：各病棟から5-10名選出</li>
                  <li>• 外来部門：外来看護師・看護補助者</li>
                  <li>• 新規採用予定者：2026年4月入職者</li>
                  <li>• 管理職・指導者：各部署リーダー層</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-orange-700 mb-1">試行制度範囲</div>
                <ul className="text-orange-600 text-xs space-y-1 mt-1">
                  <li>• 新採用プロセス：模擬面接・評価</li>
                  <li>• 教育・研修制度：一部プログラム実施</li>
                  <li>• 面談制度：月1回の定期面談</li>
                  <li>• 評価制度：中間評価の実施</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm">
            <h3 className="font-bold text-green-800 mb-3 flex items-center">
              <BarChart3 className="mr-2" size={18} />
              効果測定・評価指標
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-green-700 mb-1">量的指標</div>
                <ul className="text-green-600 text-xs space-y-1 mt-1">
                  <li>• 参加率・完了率：各制度90%以上</li>
                  <li>• 満足度：アンケート平均4.0以上（5点満点）</li>
                  <li>• システム稼働率：99%以上</li>
                  <li>• 業務効率：従来比20%向上目標</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-green-700 mb-1">質的指標</div>
                <ul className="text-green-600 text-xs space-y-1 mt-1">
                  <li>• 現場スタッフからの改善提案数</li>
                  <li>• 制度運用上の課題・困りごと</li>
                  <li>• 管理職からの運用評価</li>
                  <li>• システム操作性・使いやすさ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* フィードバック収集・改善サイクル */}
      <div className="mb-8">
        <h2 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-cyan-500">
          <GitBranch className="mr-2 text-cyan-600" size={22} />
          フィードバック収集・改善サイクル
        </h2>
        
        <div className="border border-cyan-200 rounded-lg overflow-hidden shadow-md">
          <div className="bg-cyan-600 text-white p-3">
            <h3 className="text-lg font-bold">継続的改善（PDCA）サイクル</h3>
            <p className="text-sm text-white text-opacity-90">週次・月次での効果測定と制度改善</p>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
                <h4 className="font-bold text-cyan-800 mb-2 flex items-center text-sm">
                  <PlayCircle className="mr-1" size={14} />
                  Plan（計画）
                </h4>
                <ul className="text-xs space-y-1">
                  <li>• 週次パイロット運用計画</li>
                  <li>• フィードバック収集計画</li>
                  <li>• 効果測定スケジュール</li>
                  <li>• 改善優先順位設定</li>
                </ul>
              </div>
              <div className="bg-cyan-100 border border-cyan-300 rounded-lg p-3">
                <h4 className="font-bold text-cyan-800 mb-2 flex items-center text-sm">
                  <Zap className="mr-1" size={14} />
                  Do（実行）
                </h4>
                <ul className="text-xs space-y-1">
                  <li>• パイロット制度実施</li>
                  <li>• システム運用</li>
                  <li>• 研修・説明会開催</li>
                  <li>• データ収集・記録</li>
                </ul>
              </div>
              <div className="bg-cyan-200 border border-cyan-400 rounded-lg p-3">
                <h4 className="font-bold text-cyan-800 mb-2 flex items-center text-sm">
                  <Eye className="mr-1" size={14} />
                  Check（評価）
                </h4>
                <ul className="text-xs space-y-1">
                  <li>• 週次効果測定</li>
                  <li>• アンケート分析</li>
                  <li>• 課題・問題点抽出</li>
                  <li>• 成功・失敗要因分析</li>
                </ul>
              </div>
              <div className="bg-cyan-300 border border-cyan-500 rounded-lg p-3">
                <h4 className="font-bold text-cyan-800 mb-2 flex items-center text-sm">
                  <RotateCcw className="mr-1" size={14} />
                  Action（改善）
                </h4>
                <ul className="text-xs space-y-1">
                  <li>• 制度・システム調整</li>
                  <li>• マニュアル改訂</li>
                  <li>• 追加研修実施</li>
                  <li>• 次週計画への反映</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 共通事項・サポート体制 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-gray-500">
          <Settings className="mr-2 text-gray-700" size={22} />
          共通事項・サポート体制
        </h2>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
              <Clock className="mr-2" size={18} />
              定期活動
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-700 mb-1">毎週火曜日 16:00-17:00</div>
                <div className="text-gray-600">パイロット運用進捗会議</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-700 mb-1">毎週金曜日</div>
                <div className="text-gray-600">フィードバック分析・翌週改善計画</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-700 mb-1">月2回</div>
                <div className="text-gray-600">効果測定・制度調整会議</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
            <h3 className="font-bold text-yellow-800 mb-3 flex items-center">
              <AlertCircle className="mr-2" size={18} />
              試行運用時の注意事項
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                <span><strong>現場負荷最小化</strong>：通常業務への影響を最小限に</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                <span><strong>積極的フォロー</strong>：困りごとへの迅速対応</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                <span><strong>フィードバック重視</strong>：率直な意見収集</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                <span><strong>柔軟な調整</strong>：必要に応じた制度変更</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 shadow-sm">
            <h3 className="font-bold text-red-800 mb-3 flex items-center">
              <Phone className="mr-2" size={18} />
              課題発生時の対応
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-red-700 mb-1">システム障害</div>
                <div className="text-red-600">前田氏→内西氏→業者連絡</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-red-700 mb-1">制度運用困難</div>
                <div className="text-red-600">部門リーダー→統括管理部門</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-red-700 mb-1">現場強い抵抗</div>
                <div className="text-red-600">廻氏直接対応・管理職連携</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 最終成功指標 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-purple-500">
          <Award className="mr-2 text-purple-600" size={22} />
          試行・調整フェーズ 最終成功指標（3月末時点）
        </h2>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-700 mb-2">95%</div>
              <div className="text-sm text-purple-600">パイロット完了率</div>
              <div className="text-xs text-gray-600 mt-1">全対象制度・システム</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-700 mb-2">4.2</div>
              <div className="text-sm text-purple-600">満足度平均</div>
              <div className="text-xs text-gray-600 mt-1">5点満点中（目標4.0以上）</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-700 mb-2">100%</div>
              <div className="text-sm text-purple-600">制度改善完了</div>
              <div className="text-xs text-gray-600 mt-1">パイロット結果反映</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-700 mb-2">100%</div>
              <div className="text-sm text-purple-600">本格運用準備</div>
              <div className="text-xs text-gray-600 mt-1">2026年4月開始準備</div>
            </div>
          </div>
        </div>
      </div>

      {/* 本格運用移行準備 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-green-500">
          <ArrowRight className="mr-2 text-green-600" size={22} />
          本格運用移行準備（2026年4月開始）
        </h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm">
            <h3 className="font-bold text-green-800 mb-3 flex items-center">
              <CheckCircle className="mr-2" size={18} />
              移行準備完了事項
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-green-600 flex-shrink-0" size={14} />
                <span>4制度の完全運用可能状態</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-green-600 flex-shrink-0" size={14} />
                <span>職員カルテシステム本格稼働</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-green-600 flex-shrink-0" size={14} />
                <span>全職員への制度説明・研修完了</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-green-600 flex-shrink-0" size={14} />
                <span>運用マニュアル・手順書整備</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-green-600 flex-shrink-0" size={14} />
                <span>サポート体制・ヘルプデスク準備</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
            <h3 className="font-bold text-blue-800 mb-3 flex items-center">
              <Building className="mr-2" size={18} />
              人財統括本部正式発足
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Star className="mr-2 mt-0.5 text-blue-600 flex-shrink-0" size={14} />
                <span>準備室から正式組織への移行</span>
              </li>
              <li className="flex items-start">
                <Star className="mr-2 mt-0.5 text-blue-600 flex-shrink-0" size={14} />
                <span>各部門の正式配置・役割確定</span>
              </li>
              <li className="flex items-start">
                <Star className="mr-2 mt-0.5 text-blue-600 flex-shrink-0" size={14} />
                <span>継続的改善・発展体制構築</span>
              </li>
              <li className="flex items-start">
                <Star className="mr-2 mt-0.5 text-blue-600 flex-shrink-0" size={14} />
                <span>他施設展開計画策定</span>
              </li>
              <li className="flex items-start">
                <Star className="mr-2 mt-0.5 text-blue-600 flex-shrink-0" size={14} />
                <span>法人全体人財マネジメント統括開始</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TrialPhaseLayout;