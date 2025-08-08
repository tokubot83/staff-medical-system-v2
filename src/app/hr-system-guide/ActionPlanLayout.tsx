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

      {/* 部門別行動計画 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-blue-500">
          <Briefcase className="mr-2 text-blue-600" size={22} />
          部門別行動計画
        </h2>
        
        <div className="space-y-6">
          {/* 戦略企画・統括管理部門 */}
          <div className="border border-blue-200 rounded-lg overflow-hidden shadow-md">
            <div className="bg-blue-600 text-white p-3">
              <h3 className="text-lg font-bold flex items-center">
                <Briefcase className="mr-2" size={18} />
                戦略企画・統括管理部門
              </h3>
              <p className="text-sm text-white text-opacity-90">リーダー：廻 茂樹（総師長）　サポート：徳留 拓哉</p>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-bold text-blue-800 mb-2 text-sm">7月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-blue-700 mb-1">第1週</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>準備室キックオフ会議</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>各部門リーダー個別面談</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>法人幹部会での協力要請</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-blue-700 mb-1">第2-3週</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>各施設管理職説明会（3回）</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>管理職初期課題ヒアリング</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-blue-700 mb-1">第4週</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>週次進捗会議ルール確立</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>第1回準備室全体会議</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                  <h4 className="font-bold text-blue-800 mb-2 text-sm">8-9月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-blue-700 mb-1">毎週実施</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>準備室全体会議（火曜16:00）</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>各部門進捗報告受領</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>管理職追加ヒアリング</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-blue-700 mb-1">月次実施</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>法人連絡会議活動報告</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>幹部層への中間報告</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-200 border border-blue-400 rounded-lg p-3">
                  <h4 className="font-bold text-blue-800 mb-2 text-sm">10月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>情報収集結果統合・分析</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>制度設計フェーズ課題整理</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>次フェーズ稼働率調整</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-300 border border-blue-500 rounded-lg p-3">
                  <h4 className="font-bold text-blue-800 mb-2 text-sm">成功指標</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      <Target className="mr-1 text-blue-600" size={12} />
                      <span>管理職説明会参加率: 100%</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="mr-1 text-blue-600" size={12} />
                      <span>週次会議開催率: 100%</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="mr-1 text-blue-600" size={12} />
                      <span>課題項目収集: 50項目以上</span>
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
                人財採用戦略部門
              </h3>
              <p className="text-sm text-white text-opacity-90">リーダー：平岡 明彦（理学療法士）　メンバー：別府 稜平（必要時配置）</p>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-bold text-green-800 mb-2 text-sm">7月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-green-700 mb-1">第1-2週</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>養成校関係性整理・リスト作成</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>養成校担当者挨拶・現状確認</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>過去3年採用実績データ収集</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-green-700 mb-1">第3-4週</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>養成校訪問スケジュール作成</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>現採用プロセス課題棚卸し</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                  <h4 className="font-bold text-green-800 mb-2 text-sm">8月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-green-700 mb-1">毎週実施</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>養成校訪問（週1-2校）</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>養成校意見・要望ヒアリング</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>学生ニーズ情報収集</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-green-700 mb-1">月内目標</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>現採用担当者ヒアリング完了</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-green-200 border border-green-400 rounded-lg p-3">
                  <h4 className="font-bold text-green-800 mb-2 text-sm">9月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>企業説明会参加状況調査</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>他法人採用戦略事例研究</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>養成校連携強化案素案作成</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-green-300 border border-green-500 rounded-lg p-3">
                  <h4 className="font-bold text-green-800 mb-2 text-sm">成功指標</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      <Target className="mr-1 text-green-600" size={12} />
                      <span>養成校訪問: 8校以上</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="mr-1 text-green-600" size={12} />
                      <span>採用課題項目: 15項目以上</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="mr-1 text-green-600" size={12} />
                      <span>他法人事例: 3事例以上</span>
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
                教育体制構築部門
              </h3>
              <p className="text-sm text-white text-opacity-90">リーダー：永江 由貴乃　アドバイザー：山下 千波　メンバー：橋口 大毅、安里 なるみ</p>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                  <h4 className="font-bold text-indigo-800 mb-2 text-sm">7月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-indigo-700 mb-1">永江氏・山下氏</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>引継ぎ計画策定</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>現行教育制度全体像把握</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>新人教育プログラム現状分析</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-indigo-700 mb-1">橋口氏・安里氏</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>部門役割分担確認</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>アンケート設計開始</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-3">
                  <h4 className="font-bold text-indigo-800 mb-2 text-sm">8月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-indigo-700 mb-1">橋口大毅氏</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>面談制度・評価制度現状調査</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>多職種教育制度事例研究</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-indigo-700 mb-1">安里なるみ氏</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>外来スタッフヒアリング（週2-3名）</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>夜勤者参加研修形態検討</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-200 border border-indigo-400 rounded-lg p-3">
                  <h4 className="font-bold text-indigo-800 mb-2 text-sm">9月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>全看護スタッフアンケート実施</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>各病棟詳細ヒアリング開始</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>eラーニング導入可能性調査</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-300 border border-indigo-500 rounded-lg p-3">
                  <h4 className="font-bold text-indigo-800 mb-2 text-sm">成功指標</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      <Target className="mr-1 text-indigo-600" size={12} />
                      <span>アンケート回収率: 70%以上</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="mr-1 text-indigo-600" size={12} />
                      <span>ヒアリング実施: 看護師80%以上</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="mr-1 text-indigo-600" size={12} />
                      <span>教育課題項目: 20項目以上</span>
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
                キャリア支援部門
              </h3>
              <p className="text-sm text-white text-opacity-90">リーダー：橋口 由香　メンバー：別府 稜平、通村 利菜、橋元 沙央里</p>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h4 className="font-bold text-purple-800 mb-2 text-sm">7月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-purple-700 mb-1">部門全体</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>役割分担・スケジュール調整</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>現評価制度・面談制度実態把握</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>各病棟ヒアリング計画策定</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>看護補助者アプローチ検討</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-100 border border-purple-300 rounded-lg p-3">
                  <h4 className="font-bold text-purple-800 mb-2 text-sm">8月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-purple-700 mb-1">通村利菜氏</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>地域包括病棟ヒアリング（週3-4名）</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>夜勤者意見収集方法工夫</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-purple-700 mb-1">橋元沙央里氏</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>回復期病棟ヒアリング（週3-4名）</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>リハ連携課題調査</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-purple-700 mb-1">別府稜平氏</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>評価制度データ分析準備</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>他職種評価制度比較研究</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-200 border border-purple-400 rounded-lg p-3">
                  <h4 className="font-bold text-purple-800 mb-2 text-sm">9月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>全病棟ヒアリング結果まとめ</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>看護補助者グループインタビュー</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>キャリアパス現状可視化</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>面談制度効果分析</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-300 border border-purple-500 rounded-lg p-3">
                  <h4 className="font-bold text-purple-800 mb-2 text-sm">成功指標</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      <Target className="mr-1 text-purple-600" size={12} />
                      <span>病棟ヒアリング: 各病棟80%以上</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="mr-1 text-purple-600" size={12} />
                      <span>看護補助者: 50%以上</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="mr-1 text-purple-600" size={12} />
                      <span>キャリア課題: 15項目以上</span>
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
                業務革新部門
              </h3>
              <p className="text-sm text-white text-opacity-90">リーダー：前田 幸明（理学療法士）　メンバー：内西 賢一郎</p>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <h4 className="font-bold text-amber-800 mb-2 text-sm">7月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-amber-700 mb-1">前田幸明氏</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>職員カルテシステム要件検討</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>現職員データ管理状況調査</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>システム業者初期相談</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="font-medium text-amber-700 mb-1">内西賢一郎氏</div>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>準備室運営事務体制確立</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>カルテ情報項目整理</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-100 border border-amber-300 rounded-lg p-3">
                  <h4 className="font-bold text-amber-800 mb-2 text-sm">8月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>試作版カルテ作成開始</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>外部システム連携可能性調査</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>データ分析基盤設計</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-200 border border-amber-400 rounded-lg p-3">
                  <h4 className="font-bold text-amber-800 mb-2 text-sm">9月の活動</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-2 rounded border">
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>職員カルテ試作版レビュー</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>運用フロー設計</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>プライバシー・セキュリティ検討</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-300 border border-amber-500 rounded-lg p-3">
                  <h4 className="font-bold text-amber-800 mb-2 text-sm">成功指標</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      <Target className="mr-1 text-amber-600" size={12} />
                      <span>職員カルテ試作版: 完成</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="mr-1 text-amber-600" size={12} />
                      <span>データ項目定義: 100項目以上</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="mr-1 text-amber-600" size={12} />
                      <span>システム要件定義書: 完成</span>
                    </div>
                  </div>
                </div>
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
                <div className="text-gray-600">準備室全体会議参加</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-700 mb-1">毎週金曜日</div>
                <div className="text-gray-600">各部門内進捗確認・翌週計画調整</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-700 mb-1">月末</div>
                <div className="text-gray-600">月次活動報告書提出</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
            <h3 className="font-bold text-yellow-800 mb-3 flex items-center">
              <AlertCircle className="mr-2" size={18} />
              注意事項
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                <span><strong>守秘義務の徹底</strong>：ヒアリング内容の適切な管理</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                <span><strong>中立的な姿勢</strong>：現状批判ではなく改善提案の収集</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                <span><strong>記録の標準化</strong>：ヒアリング記録フォーマット統一使用</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                <span><strong>フィードバック</strong>：協力者への感謝と進捗状況共有</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 shadow-sm">
            <h3 className="font-bold text-red-800 mb-3 flex items-center">
              <Phone className="mr-2" size={18} />
              困った時の対応
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-red-700 mb-1">部門内で解決困難</div>
                <div className="text-red-600">リーダーから徳留氏へ相談</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-red-700 mb-1">現場から強い抵抗</div>
                <div className="text-red-600">廻氏（総師長）へ報告・対応依頼</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-red-700 mb-1">スケジュール遅延</div>
                <div className="text-red-600">早期報告・全体調整で対応</div>
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