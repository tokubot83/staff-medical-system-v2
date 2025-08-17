// 特別面談テンプレートサービス
// 復職面談、インシデント後面談、退職面談のテンプレート管理

import { InterviewDuration } from '@/types/staff-common';

// 面談マニュアル関連の型定義（暫定）
export interface ManualSection {
  title: string;
  duration: number;
  questions: DetailedQuestion[];
  guidance?: any;
}

export interface DetailedQuestion {
  id: string;
  question: string;
  type: string;
  required: boolean;
  details?: any;
  scale?: any;
  checklistItems?: any[];
  hybridInput?: any;
}

// 特別面談の種類
export type SpecialInterviewType = 
  | 'return_to_work'     // 復職面談
  | 'incident_followup'  // インシデント後面談
  | 'exit_interview';    // 退職面談

// 復職理由のカテゴリ
export type ReturnReason = 
  | 'maternity'      // 産休・育休
  | 'medical'        // 病気療養
  | 'mental'         // メンタルヘルス
  | 'injury'         // 怪我・事故
  | 'family'         // 家族介護
  | 'other';         // その他

// インシデントレベル
export type IncidentLevel = 
  | 'level0'  // ヒヤリハット
  | 'level1'  // 軽微な影響
  | 'level2'  // 中程度の影響
  | 'level3a' // 重大な影響（一時的）
  | 'level3b' // 重大な影響（永続的）
  | 'level4'  // 死亡・重篤
  | 'level5'; // 死亡

// 復職面談テンプレート
export const RETURN_TO_WORK_TEMPLATES = {
  // 産休・育休復帰
  maternity: {
    15: {
      sections: [
        {
          id: 'greeting',
          title: '復職のご挨拶・体調確認',
          duration: 3,
          purpose: '温かく迎え入れ、現在の状況を確認',
          questions: [
            {
              id: 'rtw_mat_1',
              question: 'お帰りなさい。体調はいかがですか？お子様の状況も含めて教えてください。',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '身体的・精神的な準備状況の確認',
                askingTips: [
                  '温かい雰囲気で迎える',
                  '育児と仕事の両立への不安を受け止める',
                  '無理のない範囲で話してもらう'
                ],
                expectedAnswers: ['体調回復状況', '育児サポート体制', '復職への意欲'],
                followUpQuestions: [
                  '保育園の送迎は問題ありませんか？',
                  'ご家族のサポート体制はいかがですか？'
                ],
                redFlags: ['体調不良の継続', '育児サポート不足', '強い不安']
              }
            }
          ],
          guidance: {
            introduction: 'お久しぶりです。復職おめでとうございます。',
            keyPoints: ['歓迎の気持ちを伝える', 'プレッシャーを与えない'],
            transitionPhrase: '次に勤務体制について相談させてください。'
          }
        },
        {
          id: 'work_arrangement',
          title: '勤務体制の確認',
          duration: 7,
          purpose: '無理のない勤務体制を設定',
          questions: [
            {
              id: 'rtw_mat_2',
              question: '希望する勤務形態について教えてください（時短勤務、夜勤免除など）',
              type: 'checklist' as const,
              required: true,
              details: {
                purpose: '育児と両立可能な勤務体制の設定',
                askingTips: [
                  '制度を丁寧に説明',
                  '本人の希望を最優先',
                  '段階的な復帰も提案'
                ],
                expectedAnswers: [],
                followUpQuestions: ['いつから通常勤務に戻せそうですか？'],
                redFlags: []
              },
              checklistItems: [
                { item: '時短勤務希望', description: '1日6時間勤務など' },
                { item: '夜勤免除希望', description: '日勤のみ' },
                { item: '土日勤務免除', description: '平日のみ' },
                { item: '残業免除', description: '定時退社' },
                { item: '急な休みへの配慮', description: '子供の体調不良時など' }
              ]
            },
            {
              id: 'rtw_mat_3',
              question: '業務内容について、当面避けたい業務はありますか？',
              type: 'open' as const,
              required: false,
              details: {
                purpose: '無理のない業務配分',
                askingTips: ['体力的な負担を考慮', '精神的な負担も確認'],
                expectedAnswers: ['重労働の回避', '複雑な業務の段階的再開'],
                followUpQuestions: [],
                redFlags: []
              }
            }
          ],
          guidance: {
            introduction: '勤務体制について、ご希望を伺います。',
            keyPoints: ['柔軟な対応を約束', '制度の活用を促す'],
            transitionPhrase: 'それでは今後のサポートについて。'
          }
        },
        {
          id: 'support_plan',
          title: 'サポート体制・今後の計画',
          duration: 5,
          purpose: '継続的な支援体制の確立',
          questions: [
            {
              id: 'rtw_mat_4',
              question: '職場復帰にあたって、必要なサポートは何ですか？',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '必要な支援の明確化',
                askingTips: [
                  '遠慮なく要望を言ってもらう',
                  '具体的な支援策を提示',
                  'メンター制度の活用も提案'
                ],
                expectedAnswers: ['業務引き継ぎ', '研修希望', 'メンタルサポート'],
                followUpQuestions: ['誰にサポートしてもらいたいですか？'],
                redFlags: []
              }
            },
            {
              id: 'rtw_mat_5',
              question: '1ヶ月後、3ヶ月後の目標を一緒に設定しましょう',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '段階的な復帰計画',
                askingTips: ['無理のない目標設定', 'スモールステップ'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            }
          ],
          guidance: {
            introduction: '復職後のサポート体制を確認します。',
            keyPoints: ['継続的なフォロー', '定期面談の設定'],
            transitionPhrase: '本日はお疲れ様でした。'
          }
        }
      ]
    },
    30: {
      sections: [
        // 30分版はより詳細な内容
        {
          id: 'greeting_detailed',
          title: '復職のご挨拶・詳細な状況確認',
          duration: 5,
          purpose: '復職者の全体的な状況を詳しく把握',
          questions: [
            {
              id: 'rtw_mat_30_1',
              question: 'お帰りなさい。育休中はいかがでしたか？体調面、精神面の状況を教えてください。',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '心身の準備状況の詳細確認',
                askingTips: [
                  'ゆっくり時間をかけて聞く',
                  '育休中の経験も肯定的に受け止める',
                  '復職への期待と不安を両方聞く'
                ],
                expectedAnswers: [],
                followUpQuestions: [
                  '育休中に感じたことはありますか？',
                  '仕事復帰への準備はできていますか？'
                ],
                redFlags: ['産後うつの兆候', '強い復職不安', '家族関係の問題']
              }
            },
            {
              id: 'rtw_mat_30_2',
              question: 'お子様の保育環境について教えてください',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '育児環境の安定性確認',
                askingTips: ['プライバシーに配慮', '支援の必要性を探る'],
                expectedAnswers: [],
                followUpQuestions: ['病児保育の準備はありますか？'],
                redFlags: ['保育環境の不安定']
              }
            }
          ],
          guidance: {
            introduction: '本日は復職面談です。リラックスしてお話しください。',
            keyPoints: ['歓迎と共感', '無理のないペースで'],
            transitionPhrase: '次に職場の変化についてお伝えします。'
          }
        },
        {
          id: 'workplace_update',
          title: '職場環境の変化・業務説明',
          duration: 8,
          purpose: '育休中の変化を共有し、スムーズな適応を支援',
          questions: [
            {
              id: 'rtw_mat_30_3',
              question: '育休中の職場の変化について説明します。質問はありますか？',
              type: 'open' as const,
              required: false,
              details: {
                purpose: '情報共有と不安解消',
                askingTips: [
                  '重要な変更点を整理して説明',
                  '新しいシステムや手順の説明',
                  '新しいメンバーの紹介'
                ],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            },
            {
              id: 'rtw_mat_30_4',
              question: '担当業務の希望はありますか？以前の業務か、新しい業務か。',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '適切な業務配置',
                askingTips: ['キャリア継続性を考慮', '新しいチャレンジも提案'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            }
          ],
          guidance: {
            introduction: '育休中の職場の変化を共有します。',
            keyPoints: ['丁寧な説明', '質問を促す'],
            transitionPhrase: '勤務条件について相談しましょう。'
          }
        },
        {
          id: 'detailed_work_arrangement',
          title: '詳細な勤務体制の設定',
          duration: 10,
          purpose: '具体的な勤務条件の調整',
          questions: [
            {
              id: 'rtw_mat_30_5',
              question: '希望する勤務時間を教えてください（開始・終了時刻）',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '具体的な勤務時間設定',
                askingTips: ['保育園の時間を考慮', '通勤時間も確認'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            },
            {
              id: 'rtw_mat_30_6',
              question: '時短勤務の期間はどのくらいを予定していますか？',
              type: 'open' as const,
              required: false,
              details: {
                purpose: '長期的な勤務計画',
                askingTips: ['法定期間の説明', '延長可能性も伝える'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            },
            {
              id: 'rtw_mat_30_7',
              question: '緊急時（子供の急病など）の対応方法を確認させてください',
              type: 'checklist' as const,
              required: true,
              details: {
                purpose: '緊急時対応の事前準備',
                askingTips: ['理解と協力を示す', '代替要員の確保'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              },
              checklistItems: [
                { item: '配偶者との分担', description: '交代で対応' },
                { item: '実家のサポート', description: '祖父母の協力' },
                { item: '病児保育登録', description: '事前登録済み' },
                { item: 'ベビーシッター', description: '緊急時利用' },
                { item: 'その他', description: '具体的に記載' }
              ]
            }
          ],
          guidance: {
            introduction: '具体的な勤務条件を決めていきましょう。',
            keyPoints: ['柔軟性を持つ', 'Win-Winを目指す'],
            transitionPhrase: 'サポート体制について話しましょう。'
          }
        },
        {
          id: 'comprehensive_support',
          title: '包括的サポート計画',
          duration: 7,
          purpose: '全面的な支援体制の構築',
          questions: [
            {
              id: 'rtw_mat_30_8',
              question: 'メンター（相談相手）を配置しますが、希望はありますか？',
              type: 'open' as const,
              required: false,
              details: {
                purpose: 'メンタリング体制',
                askingTips: ['同じ境遇の先輩を提案', '相性を考慮'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            },
            {
              id: 'rtw_mat_30_9',
              question: '復職後の目標設定（1ヶ月、3ヶ月、6ヶ月）',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '段階的な成長計画',
                askingTips: [
                  '無理のない目標',
                  '達成可能な小目標から',
                  '定期的な見直しを約束'
                ],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            },
            {
              id: 'rtw_mat_30_10',
              question: '今後のキャリアプランについて、考えはありますか？',
              type: 'open' as const,
              required: false,
              details: {
                purpose: '長期的なキャリア支援',
                askingTips: ['ライフイベントを考慮', 'キャリアの継続性'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            }
          ],
          guidance: {
            introduction: '復職後のサポート体制を整えます。',
            keyPoints: ['継続的支援', '定期フォロー'],
            transitionPhrase: '最後に何か質問はありますか？'
          }
        }
      ]
    }
  },
  
  // 病気療養復帰
  medical: {
    30: {
      sections: [
        {
          id: 'medical_status',
          title: '健康状態の確認',
          duration: 8,
          purpose: '医学的な復職可能性の確認',
          questions: [
            {
              id: 'rtw_med_1',
              question: '主治医からの復職許可の内容を教えてください',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '医学的制限の確認',
                askingTips: [
                  '診断書の内容確認',
                  '就業制限の有無',
                  '通院の必要性'
                ],
                expectedAnswers: [],
                followUpQuestions: ['定期通院の頻度は？'],
                redFlags: ['条件付き許可', '要観察状態']
              }
            },
            {
              id: 'rtw_med_2',
              question: '現在の体調と、できること・避けたいことを教えてください',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '業務遂行能力の評価',
                askingTips: ['無理をしないよう促す', '正直に話してもらう'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: ['症状の残存', '体力低下']
              }
            }
          ],
          guidance: {
            introduction: 'まずは健康状態を確認させてください。',
            keyPoints: ['医療情報の取り扱い注意', 'プライバシー配慮'],
            transitionPhrase: '次に勤務条件を相談しましょう。'
          }
        },
        {
          id: 'gradual_return',
          title: '段階的復職計画',
          duration: 12,
          purpose: '無理のない復職プログラムの設計',
          questions: [
            {
              id: 'rtw_med_3',
              question: '復職プログラムの希望（勤務時間、日数の段階的増加）',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '段階的復職の計画',
                askingTips: [
                  '最初は短時間から',
                  '体調を見ながら調整',
                  '1-3ヶ月の計画'
                ],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            },
            {
              id: 'rtw_med_4',
              question: '業務内容の調整希望（軽作業から開始など）',
              type: 'checklist' as const,
              required: true,
              details: {
                purpose: '適切な業務配分',
                askingTips: ['医師の指示を確認', '段階的に通常業務へ'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              },
              checklistItems: [
                { item: 'デスクワーク中心', description: '身体的負担を軽減' },
                { item: '軽作業から開始', description: '徐々に負荷を上げる' },
                { item: '夜勤免除', description: '当面は日勤のみ' },
                { item: '残業制限', description: '定時退社' },
                { item: 'ストレス軽減', description: '責任の軽い業務' }
              ]
            }
          ],
          guidance: {
            introduction: '無理のない復職計画を立てましょう。',
            keyPoints: ['段階的復帰', '柔軟な調整'],
            transitionPhrase: 'フォロー体制について。'
          }
        },
        {
          id: 'follow_up',
          title: 'フォローアップ体制',
          duration: 10,
          purpose: '継続的な健康管理とサポート',
          questions: [
            {
              id: 'rtw_med_5',
              question: '産業医面談の設定と、定期的な健康チェックについて',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '医学的フォロー体制',
                askingTips: ['産業医との連携', '定期面談の設定'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            },
            {
              id: 'rtw_med_6',
              question: '職場でのサポート体制（相談窓口、メンター等）',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '心理的サポート',
                askingTips: ['相談しやすい環境作り', '定期的な声かけ'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            }
          ],
          guidance: {
            introduction: 'サポート体制を整えます。',
            keyPoints: ['継続的フォロー', '早期発見・対応'],
            transitionPhrase: '無理せず徐々に慣れていきましょう。'
          }
        }
      ]
    }
  },
  
  // メンタルヘルス復帰
  mental: {
    45: {
      sections: [
        {
          id: 'mental_preparation',
          title: '心理的準備状況の確認',
          duration: 10,
          purpose: '精神的な復職準備の評価',
          questions: [
            {
              id: 'rtw_men_1',
              question: '復職に向けての気持ちを率直に教えてください',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '心理状態の把握',
                askingTips: [
                  '傾聴の姿勢',
                  '判断しない',
                  '感情を受け止める',
                  'ゆっくりペースで'
                ],
                expectedAnswers: [],
                followUpQuestions: ['不安な点は？', '期待することは？'],
                redFlags: ['強い不安', '自信喪失', '復職への抵抗']
              }
            },
            {
              id: 'rtw_men_2',
              question: '睡眠、食欲、日常生活のリズムはいかがですか？',
              type: 'scale' as const,
              required: true,
              details: {
                purpose: '生活リズムの確認',
                askingTips: ['具体的に聞く', '改善傾向を確認'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: ['睡眠障害', '食欲不振', '生活リズムの乱れ']
              },
              scale: {
                min: 1,
                max: 5,
                labels: ['とても悪い', '悪い', '普通', '良い', 'とても良い'],
                description: '全体的な生活リズム'
              }
            }
          ],
          guidance: {
            introduction: '今日はゆっくりお話を伺います。',
            keyPoints: ['受容的態度', '心理的安全性', 'ペース配慮'],
            transitionPhrase: '次に治療状況を確認させてください。'
          }
        },
        {
          id: 'treatment_status',
          title: '治療・回復状況',
          duration: 10,
          purpose: '医学的・心理的治療の確認',
          questions: [
            {
              id: 'rtw_men_3',
              question: '現在の治療状況（通院、服薬、カウンセリング等）',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '治療継続の確認',
                askingTips: [
                  'プライバシー配慮',
                  '必要な範囲で',
                  '通院時間の確保'
                ],
                expectedAnswers: [],
                followUpQuestions: ['通院頻度は？'],
                redFlags: ['治療中断', '服薬不規則']
              }
            },
            {
              id: 'rtw_men_4',
              question: '主治医・産業医からの就業上の配慮事項',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '医学的配慮の確認',
                askingTips: ['書面確認', '具体的な制限'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            }
          ],
          guidance: {
            introduction: '治療の状況を教えてください。',
            keyPoints: ['医療連携', '守秘義務'],
            transitionPhrase: '職場環境の調整について。'
          }
        },
        {
          id: 'environment_adjustment',
          title: '職場環境の調整',
          duration: 15,
          purpose: 'ストレス要因の除去と環境整備',
          questions: [
            {
              id: 'rtw_men_5',
              question: '休職に至った要因で、配慮が必要なものはありますか？',
              type: 'open' as const,
              required: true,
              details: {
                purpose: 'ストレス要因の特定',
                askingTips: [
                  '具体的に聞く',
                  '解決策を一緒に考える',
                  '実現可能な対策'
                ],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: ['未解決の問題', '対人関係']
              }
            },
            {
              id: 'rtw_men_6',
              question: '職場で必要な配慮（業務量、対人関係、環境等）',
              type: 'checklist' as const,
              required: true,
              details: {
                purpose: '具体的配慮事項',
                askingTips: ['実現可能性を確認', '期間も設定'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              },
              checklistItems: [
                { item: '業務量の調整', description: '当面は7割程度' },
                { item: '責任の軽減', description: '判断業務を減らす' },
                { item: '対人業務の制限', description: 'クレーム対応免除' },
                { item: '静かな環境', description: '刺激の少ない場所' },
                { item: '定期的な休憩', description: '疲労蓄積防止' },
                { item: '残業・夜勤免除', description: '生活リズム維持' }
              ]
            },
            {
              id: 'rtw_men_7',
              question: '職場の同僚への情報開示の範囲',
              type: 'open' as const,
              required: true,
              details: {
                purpose: 'プライバシーと支援のバランス',
                askingTips: ['本人の意向を尊重', '必要最小限'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            }
          ],
          guidance: {
            introduction: '働きやすい環境を整えましょう。',
            keyPoints: ['環境調整', 'ストレス軽減'],
            transitionPhrase: '復職プログラムを決めましょう。'
          }
        },
        {
          id: 'return_program',
          title: '段階的復職プログラム',
          duration: 10,
          purpose: '具体的な復職計画の策定',
          questions: [
            {
              id: 'rtw_men_8',
              question: '復職初期の勤務パターン（時短、出勤日数等）',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '無理のないスタート',
                askingTips: [
                  '週2-3日から開始',
                  '午前のみから',
                  '徐々に増やす'
                ],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            },
            {
              id: 'rtw_men_9',
              question: '3ヶ月間の段階的復帰計画',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '計画的な復職',
                askingTips: ['月単位で設定', '柔軟に見直し'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            }
          ],
          guidance: {
            introduction: '無理のない復職計画を立てます。',
            keyPoints: ['段階的', '個別性重視'],
            transitionPhrase: '最後にサポート体制を。'
          }
        }
      ]
    }
  },

  // 怪我・事故復帰
  injury: {
    30: {
      sections: [
        {
          id: 'physical_recovery',
          title: '身体回復状況の確認',
          duration: 10,
          purpose: '怪我や事故からの回復状況の評価',
          questions: [
            {
              id: 'rtw_inj_1',
              question: '怪我の回復状況はいかがですか？医師からの診断書や制限事項があれば教えてください。',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '身体的回復状況の確認',
                askingTips: ['医療情報の正確な把握', '制限事項の詳細確認'],
                expectedAnswers: ['回復程度', '医師の指示', '制限事項'],
                followUpQuestions: ['痛みはありますか？', 'リハビリは続けていますか？'],
                redFlags: ['完全回復していない', '医師の制限事項がある', '痛みが残っている']
              }
            }
          ],
          guidance: {
            introduction: '怪我からの回復を慎重に確認します。',
            keyPoints: ['安全第一', '段階的復帰'],
            transitionPhrase: '業務への影響を確認しましょう。'
          }
        }
      ]
    }
  },

  // 家族介護復帰
  family: {
    30: {
      sections: [
        {
          id: 'care_situation',
          title: '介護状況と復職準備',
          duration: 10,
          purpose: '家族介護の状況と仕事の両立可能性の確認',
          questions: [
            {
              id: 'rtw_fam_1',
              question: 'ご家族の介護状況と、復職に向けてのサポート体制を教えてください。',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '介護状況と両立体制の確認',
                askingTips: ['プライバシーに配慮', '具体的なサポート体制確認'],
                expectedAnswers: ['介護度', 'サポート体制', '時間制約'],
                followUpQuestions: ['勤務時間の調整は必要ですか？', '緊急時の対応はどうしますか？'],
                redFlags: ['サポート体制不十分', '時間的制約が大きい', '精神的負担が重い']
              }
            }
          ],
          guidance: {
            introduction: '介護と仕事の両立について相談しましょう。',
            keyPoints: ['柔軟な働き方', 'サポート体制'],
            transitionPhrase: '勤務条件の調整を検討します。'
          }
        }
      ]
    }
  },

  // その他の理由
  other: {
    30: {
      sections: [
        {
          id: 'general_return',
          title: '復職状況の確認',
          duration: 10,
          purpose: '一般的な復職準備状況の確認',
          questions: [
            {
              id: 'rtw_oth_1',
              question: '復職に向けての準備状況と、何かご相談したいことがあれば教えてください。',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '復職準備状況の総合的確認',
                askingTips: ['オープンな質問', '個別事情に配慮'],
                expectedAnswers: ['準備状況', '不安や心配事', 'サポート要望'],
                followUpQuestions: ['何かサポートできることはありますか？'],
                redFlags: ['準備不足', '大きな不安', 'サポート要望']
              }
            }
          ],
          guidance: {
            introduction: '復職について何でもお聞かせください。',
            keyPoints: ['個別対応', '柔軟なサポート'],
            transitionPhrase: '必要なサポートを提供します。'
          }
        }
      ]
    }
  }
};

// インシデント後面談テンプレート
export const INCIDENT_FOLLOWUP_TEMPLATES = {
  level0_1: { // ヒヤリハット・軽微
    15: {
      sections: [
        {
          id: 'incident_facts',
          title: 'インシデントの事実確認',
          duration: 5,
          purpose: '客観的事実の把握',
          questions: [
            {
              id: 'inc_lv0_1',
              question: '発生したインシデントについて、時系列で教えてください',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '事実関係の整理',
                askingTips: [
                  '責めない姿勢',
                  '事実を正確に',
                  '5W1Hで確認'
                ],
                expectedAnswers: [],
                followUpQuestions: ['その時の状況は？'],
                redFlags: ['事実の隠蔽', '記憶の混乱']
              }
            }
          ],
          guidance: {
            introduction: '今回の件について確認させてください。',
            keyPoints: ['非懲罰的対応', '学習機会'],
            transitionPhrase: '原因を一緒に考えましょう。'
          }
        },
        {
          id: 'cause_analysis',
          title: '原因分析と対策',
          duration: 7,
          purpose: '再発防止策の検討',
          questions: [
            {
              id: 'inc_lv0_2',
              question: 'なぜ起きたと思いますか？考えられる原因は？',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '原因の深掘り',
                askingTips: [
                  '個人だけでなくシステムも',
                  '複数要因を探る',
                  'なぜなぜ分析'
                ],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            },
            {
              id: 'inc_lv0_3',
              question: '今後の防止策として何ができますか？',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '具体的対策',
                askingTips: ['実行可能な対策', '本人の意見重視'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            }
          ],
          guidance: {
            introduction: '再発防止を考えましょう。',
            keyPoints: ['建設的議論', '改善志向'],
            transitionPhrase: '今後気をつけていきましょう。'
          }
        },
        {
          id: 'mental_care',
          title: '心理的フォロー',
          duration: 3,
          purpose: '精神的ケア',
          questions: [
            {
              id: 'inc_lv0_4',
              question: '今の気持ちを聞かせてください',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '心理状態確認',
                askingTips: ['共感的に聞く', '自責の念を和らげる'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: ['過度の自責', '無関心']
              }
            }
          ],
          guidance: {
            introduction: '気持ちを聞かせてください。',
            keyPoints: ['心理的サポート', '前向きな締めくくり'],
            transitionPhrase: '一緒に改善していきましょう。'
          }
        }
      ]
    }
  },
  
  level2_3: { // 中程度・重大
    45: {
      sections: [
        {
          id: 'immediate_response',
          title: '初期対応の確認',
          duration: 10,
          purpose: '事故直後の対応評価',
          questions: [
            {
              id: 'inc_lv2_1',
              question: '事故発生時の初期対応について詳しく教えてください',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '初期対応の適切性評価',
                askingTips: [
                  '時系列で確認',
                  '判断の根拠',
                  '連絡体制'
                ],
                expectedAnswers: [],
                followUpQuestions: ['誰に報告しましたか？'],
                redFlags: ['対応の遅れ', '隠蔽行為']
              }
            },
            {
              id: 'inc_lv2_2',
              question: '患者・家族への対応はどのように行いましたか？',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '対外対応の確認',
                askingTips: ['誠実な対応か', '記録の有無'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            }
          ],
          guidance: {
            introduction: '重大な事案のため、詳しく確認します。',
            keyPoints: ['冷静に', '事実確認'],
            transitionPhrase: '発生原因を分析しましょう。'
          }
        },
        {
          id: 'detailed_analysis',
          title: '詳細な原因分析',
          duration: 15,
          purpose: 'RCA（根本原因分析）',
          questions: [
            {
              id: 'inc_lv2_3',
              question: '直接的な原因は何でしたか？',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '直接原因の特定',
                askingTips: ['具体的に', '証拠に基づいて'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            },
            {
              id: 'inc_lv2_4',
              question: '背景要因・システム要因を分析しましょう',
              type: 'checklist' as const,
              required: true,
              details: {
                purpose: 'システム要因の分析',
                askingTips: ['多角的視点', 'Swiss Cheeseモデル'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              },
              checklistItems: [
                { item: '人的要因', description: '知識・技術・経験不足' },
                { item: '環境要因', description: '設備・機器・配置' },
                { item: 'システム要因', description: '手順・ルール・体制' },
                { item: 'コミュニケーション', description: '情報伝達・連携' },
                { item: '組織要因', description: '人員配置・教育体制' }
              ]
            }
          ],
          guidance: {
            introduction: '根本原因を探ります。',
            keyPoints: ['システム思考', '多要因分析'],
            transitionPhrase: '改善策を検討しましょう。'
          }
        },
        {
          id: 'improvement_plan',
          title: '改善計画の策定',
          duration: 12,
          purpose: '実効性のある対策立案',
          questions: [
            {
              id: 'inc_lv2_5',
              question: '個人として実施する改善策',
              type: 'open' as const,
              required: true,
              details: {
                purpose: '個人レベルの対策',
                askingTips: ['具体的行動', '期限設定'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            },
            {
              id: 'inc_lv2_6',
              question: 'チーム・組織として必要な改善策',
              type: 'open' as const,
              required: true,
              details: {
                purpose: 'システム改善',
                askingTips: ['実現可能性', '効果測定'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            },
            {
              id: 'inc_lv2_7',
              question: '再発防止のための教育・研修ニーズ',
              type: 'open' as const,
              required: false,
              details: {
                purpose: '教育計画',
                askingTips: ['必要なスキル', '研修内容'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            }
          ],
          guidance: {
            introduction: '具体的な改善策を決めます。',
            keyPoints: ['SMART目標', '実効性'],
            transitionPhrase: '心理面のケアも重要です。'
          }
        },
        {
          id: 'psychological_support',
          title: '心理的サポート',
          duration: 8,
          purpose: '第二の被害者支援',
          questions: [
            {
              id: 'inc_lv2_8',
              question: '事故後の心理状態はいかがですか？',
              type: 'scale' as const,
              required: true,
              details: {
                purpose: '心理的影響評価',
                askingTips: ['正直に', 'サポート提供'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: ['PTSD症状', '離職意向']
              },
              scale: {
                min: 1,
                max: 5,
                labels: ['非常に悪い', '悪い', '普通', '良い', '非常に良い']
              }
            },
            {
              id: 'inc_lv2_9',
              question: '必要なサポートはありますか？',
              type: 'open' as const,
              required: true,
              details: {
                purpose: 'サポートニーズ',
                askingTips: ['カウンセリング', 'ピアサポート'],
                expectedAnswers: [],
                followUpQuestions: [],
                redFlags: []
              }
            }
          ],
          guidance: {
            introduction: '心理面のサポートをします。',
            keyPoints: ['第二の被害者ケア', '継続支援'],
            transitionPhrase: 'フォローアップを継続します。'
          }
        }
      ]
    }
  }
};

// テンプレート取得関数
export class SpecialInterviewTemplateService {
  
  /**
   * 復職面談テンプレートの取得
   */
  static getReturnToWorkTemplate(
    reason: ReturnReason,
    duration: InterviewDuration
  ): { sections: ManualSection[] } | null {
    const templates = RETURN_TO_WORK_TEMPLATES[reason];
    if (!templates) return null;
    
    // 指定時間のテンプレートを探す
    if ((templates as any)[duration]) {
      return (templates as any)[duration];
    }
    
    // なければ近い時間のテンプレートを返す
    const availableDurations = Object.keys(templates).map(Number).sort((a, b) => a - b);
    const closestDuration = availableDurations.reduce((prev, curr) => 
      Math.abs(curr - duration) < Math.abs(prev - duration) ? curr : prev
    );
    
    return (templates as any)[closestDuration];
  }
  
  /**
   * インシデント後面談テンプレートの取得
   */
  static getIncidentFollowupTemplate(
    level: IncidentLevel,
    duration: InterviewDuration
  ): { sections: ManualSection[] } | null {
    // レベルに応じたテンプレートグループを選択
    let templateGroup;
    if (level === 'level0' || level === 'level1') {
      templateGroup = INCIDENT_FOLLOWUP_TEMPLATES.level0_1;
    } else if (level === 'level2' || level === 'level3a' || level === 'level3b') {
      templateGroup = INCIDENT_FOLLOWUP_TEMPLATES.level2_3;
    } else {
      // レベル4-5は個別対応が必要
      templateGroup = INCIDENT_FOLLOWUP_TEMPLATES.level2_3; // 暫定的に重大事故用を使用
    }
    
    if (!templateGroup) return null;
    
    if ((templateGroup as any)[duration]) {
      return (templateGroup as any)[duration];
    }
    
    // 近い時間のテンプレートを返す
    const availableDurations = Object.keys(templateGroup).map(Number).sort((a, b) => a - b);
    const closestDuration = availableDurations.reduce((prev, curr) => 
      Math.abs(curr - duration) < Math.abs(prev - duration) ? curr : prev
    );
    
    return (templateGroup as any)[closestDuration];
  }
  
  /**
   * 復職理由の判定
   */
  static determineReturnReason(context: {
    leaveType?: string;
    leaveDuration?: number;
    diagnosis?: string;
  }): ReturnReason {
    if (context.leaveType === 'maternity' || context.leaveType === 'paternity') {
      return 'maternity';
    }
    if (context.leaveType === 'medical' || context.diagnosis?.includes('physical')) {
      return 'medical';
    }
    if (context.leaveType === 'mental' || context.diagnosis?.includes('mental')) {
      return 'mental';
    }
    if (context.leaveType === 'injury') {
      return 'injury';
    }
    if (context.leaveType === 'family') {
      return 'family';
    }
    return 'other';
  }
  
  /**
   * インシデントレベルの判定
   */
  static determineIncidentLevel(context: {
    severity?: string;
    patientImpact?: string;
    reportLevel?: number;
  }): IncidentLevel {
    if (context.reportLevel !== undefined) {
      const levelMap: { [key: number]: IncidentLevel } = {
        0: 'level0',
        1: 'level1',
        2: 'level2',
        3: 'level3a',
        4: 'level4',
        5: 'level5'
      };
      return levelMap[context.reportLevel] || 'level1';
    }
    
    // 患者影響から判定
    if (context.patientImpact === 'none') return 'level0';
    if (context.patientImpact === 'minimal') return 'level1';
    if (context.patientImpact === 'moderate') return 'level2';
    if (context.patientImpact === 'severe') return 'level3a';
    if (context.patientImpact === 'death') return 'level5';
    
    return 'level1'; // デフォルト
  }
}