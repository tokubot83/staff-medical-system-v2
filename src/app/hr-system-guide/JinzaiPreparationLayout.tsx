import React from 'react';
import {
  Users, Briefcase, GraduationCap, LineChart, 
  CheckCircle, Calendar, Target, Star, TrendingUp
} from 'lucide-react';

const JinzaiPreparationLayout = () => {
  return (
    <div className="bg-white p-4 w-full" style={{ minWidth: '1200px' }}>
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
        <div>
          <div className="text-sm text-gray-500 mb-1">内部検討資料</div>
          <h1 className="text-3xl font-bold text-gray-800">厚生会人事部準備室 組織図 （情報収集フェーズ）</h1>
          <p className="text-gray-600 mt-2">現場の声を丁寧に収集し、実態に即した制度設計を行う・リスクを最小化して着実に基盤を構築</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end mb-2">
            <Calendar className="mr-2 text-blue-600" size={16} />
            <span className="text-blue-800 font-medium">実施期間: 2025年7月～2026年3月</span>
          </div>
          <div className="flex items-center justify-end mb-2">
            <Target className="mr-2 text-green-600" size={16} />
            <span className="text-green-800 font-medium">配置方針: 現場情報収集と課題抽出に重点</span>
          </div>
          <div className="text-sm text-gray-600">
            作成者：徳留
          </div>
        </div>
      </div>

      {/* 準備室体制案 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold flex items-center mb-4 pb-2 border-b-2 border-blue-500">
          <Briefcase className="mr-2 text-blue-600" size={22} />
          準備室組織体制案（焦点集中型体制ベース）
        </h2>
        
        <div className="border border-blue-200 rounded-lg overflow-hidden shadow-md">
          <div className="bg-blue-600 text-white p-3">
            <h3 className="text-lg font-bold">組織図</h3>
            <p className="text-sm text-white text-opacity-90">現場の声を丁寧に収集し、実態に即した制度設計を行う体制</p>
          </div>
          
          <div className="p-4">
            <div className="mb-4">
              <div className="bg-white p-3 border border-blue-100 rounded-lg">
                <div className="flex flex-col items-center">
                  {/* トップ部門 */}
                  <div className="w-80 mb-3 border-2 border-blue-400 rounded-lg p-3 bg-blue-50 shadow-md">
                    <h5 className="font-bold text-blue-800 text-sm flex items-center">
                      <Briefcase size={14} className="mr-1" />
                      戦略企画・統括管理部門（準備室）
                    </h5>
                    <div className="mt-2 border-t border-blue-100 pt-2">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-start">
                          <Star className="mr-1 mt-0.5 text-blue-600 flex-shrink-0" size={8} />
                          <span><strong>リーダー：廻 茂樹（総師長）</strong> - 全体統括・法人との連携調整</span>
                        </div>
                        <div className="flex items-start">
                          <CheckCircle className="mr-1 mt-0.5 text-blue-600 flex-shrink-0" size={8} />
                          <span><strong>サポート：徳留 拓哉</strong> - 準備室運営・進捗管理・法人連携連絡会議での活動報告と提言</span>
                        </div>
                      </div>
                      
                      <div className="bg-blue-100 p-2 rounded text-xs mt-2">
                        <div className="font-medium text-blue-800 mb-1">主要活動</div>
                        <ul className="space-y-1">
                          <li className="flex items-start">
                            <div className="mr-1 text-blue-500 flex-shrink-0">•</div>
                            <span>準備室全体会議開催（月１回・第２火曜16:00）</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-1 text-blue-500 flex-shrink-0">•</div>
                            <span>部門長会議開催（週１回・毎週金曜16:00）</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-1 text-blue-500 flex-shrink-0">•</div>
                            <span>本格運用に向けた各施設管理職等へヒアリング</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-1 text-blue-500 flex-shrink-0">•</div>
                            <span>人事異動・昇格人事案策定と経営部門への提言体制構築</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* 中央接続線 */}
                  <div className="w-1 h-6 bg-blue-400"></div>
                  
                  {/* 水平接続ライン */}
                  <div className="w-full flex flex-col items-center mb-4">
                    <div className="w-4/5 border-t-2 border-blue-400"></div>
                  </div>
                  
                  {/* 4つの垂直接続ライン */}
                  <div className="w-4/5 grid grid-cols-4 mb-3">
                    <div className="flex justify-center">
                      <div className="w-1 h-6 bg-blue-400"></div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-1 h-6 bg-blue-400"></div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-1 h-6 bg-blue-400"></div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-1 h-6 bg-blue-400"></div>
                    </div>
                  </div>
                  
                  {/* 4つの部門（水平配置） */}
                  <div className="w-full grid grid-cols-4 gap-2" style={{ minHeight: '280px' }}>
                    {/* 部門1: 人財採用戦略部門 */}
                    <div className="h-full flex flex-col">
                      <div className="border-2 border-green-300 rounded-lg p-2 bg-green-50 flex-grow shadow-sm">
                        <h5 className="font-bold text-green-800 text-xs flex items-center mb-2">
                          <Users size={12} className="mr-1" />
                          人財採用戦略部門
                        </h5>
                        <div className="mt-1 border-t border-green-100 pt-1">
                          <div className="space-y-1 text-xs">
                            <div className="flex items-start">
                              <Star className="mr-1 mt-0.5 text-green-600 flex-shrink-0" size={8} />
                              <span><strong>リーダー：平岡 明彦（理学療法士）</strong></span>
                            </div>
                            <div className="text-xs text-gray-600 ml-3 mb-1">養成校との関係継続・採用体制構築準備</div>
                            
                            <div className="flex items-start">
                              <CheckCircle className="mr-1 mt-0.5 text-green-600 flex-shrink-0" size={8} />
                              <span><strong>メンバー（必要時配置）：別府 稜平（理学療法士）</strong></span>
                            </div>
                            <div className="text-xs text-gray-600 ml-3 mb-2">人財相談室活動計画策定と実行体制構築</div>
                            
                            <div className="bg-green-100 p-2 rounded text-xs">
                              <div className="font-medium text-green-800 mb-1">主要活動</div>
                              <ul className="space-y-1">
                                <li className="flex items-start">
                                  <div className="mr-1 text-green-500 flex-shrink-0">•</div>
                                  <span>養成校との関係継続・強化</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-1 text-green-500 flex-shrink-0">•</div>
                                  <span>段階的一元採用方式への転換計画策定</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-1 text-green-500 flex-shrink-0">•</div>
                                  <span>薬剤師確保プロジェクトアプローチ継続</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-1 text-green-500 flex-shrink-0">•</div>
                                  <span>企業説明会参加体制構築</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-1 text-green-500 flex-shrink-0">•</div>
                                  <span>現行分散採用方式から一元採用への移行ロードマップ作成</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-1 text-green-500 flex-shrink-0">•</div>
                                  <span>部門内会議（必要時開催・情報共有はSlack活用）</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 部門2: 教育体制構築部門 */}
                    <div className="h-full flex flex-col">
                      <div className="border-2 border-indigo-300 rounded-lg p-2 bg-indigo-50 flex-grow shadow-sm">
                        <h5 className="font-bold text-indigo-800 text-xs flex items-center mb-2">
                          <GraduationCap size={12} className="mr-1" />
                          教育体制構築部門
                        </h5>
                        <div className="mt-1 border-t border-indigo-100 pt-1">
                          <div className="space-y-1 text-xs">
                            <div className="flex items-start">
                              <Star className="mr-1 mt-0.5 text-indigo-600 flex-shrink-0" size={8} />
                              <span><strong>リーダー：永江 由貴乃（副総師長・特定看護師）</strong></span>
                            </div>
                            <div className="text-xs text-gray-600 ml-3 mb-1">現場課題収集に基づく教育・研修体制構築と制度設計</div>
                            
                            <div className="flex items-start">
                              <CheckCircle className="mr-1 mt-0.5 text-indigo-600 flex-shrink-0" size={8} />
                              <span><strong>アドバイザー：山下 千波（教育師長）</strong></span>
                            </div>
                            <div className="text-xs text-gray-600 ml-3 mb-1">現行教育業務継続・新制度設計指導</div>
                            
                            <div className="flex items-start">
                              <CheckCircle className="mr-1 mt-0.5 text-indigo-600 flex-shrink-0" size={8} />
                              <span><strong>メンバー：橋口 大毅（作業療法士）</strong></span>
                            </div>
                            <div className="text-xs text-gray-600 ml-3 mb-1">教育・研修・評価・面談制度の一体的運用の実現にむけたファシリテーター</div>
                            
                            <div className="flex items-start">
                              <CheckCircle className="mr-1 mt-0.5 text-indigo-600 flex-shrink-0" size={8} />
                              <span><strong>メンバー：安里 なるみ（看護師・外来）</strong></span>
                            </div>
                            <div className="text-xs text-gray-600 ml-3 mb-2">外来現場の声・課題収集</div>
                            
                            <div className="bg-indigo-100 p-2 rounded text-xs">
                              <div className="font-medium text-indigo-800 mb-1">主要活動</div>
                              <ul className="space-y-1">
                                <li className="flex items-start">
                                  <div className="mr-1 text-indigo-500 flex-shrink-0">•</div>
                                  <span>研修制度の設計と運営</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-1 text-indigo-500 flex-shrink-0">•</div>
                                  <span>教育体系の再構築</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-1 text-indigo-500 flex-shrink-0">•</div>
                                  <span>新教育師長への移行準備</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-1 text-indigo-500 flex-shrink-0">•</div>
                                  <span>現場の声を反映した教育制度設計</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-1 text-indigo-500 flex-shrink-0">•</div>
                                  <span>部門内会議（必要時開催・情報共有はSlack活用）</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 部門3: キャリア支援部門 */}
                    <div className="h-full flex flex-col">
                      <div className="border-2 border-purple-300 rounded-lg p-2 bg-purple-50 flex-grow shadow-sm">
                        <h5 className="font-bold text-purple-800 text-xs flex items-center mb-2">
                          <TrendingUp size={12} className="mr-1" />
                          キャリア支援部門
                        </h5>
                        <div className="mt-1 border-t border-purple-100 pt-1">
                          <div className="space-y-1 text-xs">
                            <div className="flex items-start">
                              <Star className="mr-1 mt-0.5 text-purple-600 flex-shrink-0" size={8} />
                              <span><strong>リーダー：橋口 由佳（看護師・地域包括ケア病棟）</strong></span>
                            </div>
                            <div className="text-xs text-gray-600 ml-3 mb-1">現場課題収集に基づく評価・面談制度設計</div>
                            
                            <div className="flex items-start">
                              <CheckCircle className="mr-1 mt-0.5 text-purple-600 flex-shrink-0" size={8} />
                              <span><strong>アドバイザー：山下 千波（教育師長）</strong></span>
                            </div>
                            <div className="text-xs text-gray-600 ml-3 mb-1">評価・面談制度設計指導・キャリア支援体制構築</div>
                            
                            <div className="flex items-start">
                              <CheckCircle className="mr-1 mt-0.5 text-purple-600 flex-shrink-0" size={8} />
                              <span><strong>メンバー：別府 稜平（理学療法士）</strong></span>
                            </div>
                            <div className="text-xs text-gray-600 ml-3 mb-1">教育・研修・評価・面談制度の一体的運用の実現にむけたファシリテーター</div>
                            
                            <div className="flex items-start">
                              <CheckCircle className="mr-1 mt-0.5 text-purple-600 flex-shrink-0" size={8} />
                              <span><strong>メンバー：通村 利菜（看護師・地域包括医療病棟）</strong></span>
                            </div>
                            <div className="text-xs text-gray-600 ml-3 mb-1">病棟現場の声・課題収集</div>
                            
                            <div className="flex items-start">
                              <CheckCircle className="mr-1 mt-0.5 text-purple-600 flex-shrink-0" size={8} />
                              <span><strong>メンバー：橋元 沙央里（看護師・回復期病棟）</strong></span>
                            </div>
                            <div className="text-xs text-gray-600 ml-3 mb-2">病棟現場の声・課題収集</div>
                            
                            <div className="bg-purple-100 p-2 rounded text-xs">
                              <div className="font-medium text-purple-800 mb-1">主要活動</div>
                              <ul className="space-y-1">
                                <li className="flex items-start">
                                  <div className="mr-1 text-purple-500 flex-shrink-0">•</div>
                                  <span>現場の声・課題収集</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-1 text-purple-500 flex-shrink-0">•</div>
                                  <span>評価制度・面談制度設計</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-1 text-purple-500 flex-shrink-0">•</div>
                                  <span>キャリア支援制度構築</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-1 text-purple-500 flex-shrink-0">•</div>
                                  <span>部門内会議（必要時開催・情報共有はSlack活用）</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 部門4: 業務革新部門 */}
                    <div className="h-full flex flex-col">
                      <div className="border-2 border-amber-300 rounded-lg p-2 bg-amber-50 flex-grow shadow-sm">
                        <h5 className="font-bold text-amber-800 text-xs flex items-center mb-2">
                          <LineChart size={12} className="mr-1" />
                          業務革新部門
                        </h5>
                        <div className="mt-1 border-t border-amber-100 pt-1">
                          <div className="space-y-1 text-xs">
                            <div className="flex items-start">
                              <Star className="mr-1 mt-0.5 text-amber-600 flex-shrink-0" size={8} />
                              <span><strong>リーダー：前田 幸明（理学療法士）</strong></span>
                            </div>
                            <div className="text-xs text-gray-600 ml-3 mb-1">職員カルテ管理システム基盤構築</div>
                            
                            <div className="flex items-start">
                              <CheckCircle className="mr-1 mt-0.5 text-amber-600 flex-shrink-0" size={8} />
                              <span><strong>メンバー：内西 賢一郎</strong></span>
                            </div>
                            <div className="text-xs text-gray-600 ml-3 mb-2">本格運用後の常勤事務員との連携、準備室総務調整</div>
                            
                            <div className="bg-amber-100 p-2 rounded text-xs">
                              <div className="font-medium text-amber-800 mb-1">主要活動</div>
                              <ul className="space-y-1">
                                <li className="flex items-start">
                                  <div className="mr-1 text-amber-500 flex-shrink-0">•</div>
                                  <span>職員カルテの作成・管理</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-1 text-amber-500 flex-shrink-0">•</div>
                                  <span>データ分析・可視化基盤</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-1 text-amber-500 flex-shrink-0">•</div>
                                  <span>準備室運営事務支援</span>
                                </li>
                                <li className="flex items-start">
                                  <div className="mr-1 text-amber-500 flex-shrink-0">•</div>
                                  <span>部門内会議（必要時開催・情報共有はSlack活用）</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JinzaiPreparationLayout;