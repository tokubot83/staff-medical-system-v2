'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertCircle, 
  Building, 
  FileText, 
  Users,
  Heart,
  Home,
  Calendar,
  Shield,
  Activity,
  Pill
} from 'lucide-react';

interface LegalTraining {
  name: string;
  frequency: string;
  duration?: string;
  targetStaff: string;
  requiredBy: string;
  description?: string;
}

interface FacilityTrainings {
  facilityType: string;
  icon: React.ReactNode;
  description: string;
  trainings: LegalTraining[];
}

const legalTrainingsData: FacilityTrainings[] = [
  {
    facilityType: '病院（地域包括医療病棟・地域包括ケア病棟・回復期リハビリテーション病棟・医療療養病棟）',
    icon: <Building className="h-5 w-5" />,
    description: '医療法及び診療報酬に基づく必須研修',
    trainings: [
      {
        name: '医療安全管理研修',
        frequency: '年2回以上',
        duration: '各回1時間以上',
        targetStaff: '全職員',
        requiredBy: '医療法施行規則',
        description: '医療事故防止、インシデント・アクシデント対応、医療安全文化の醸成'
      },
      {
        name: '院内感染対策研修',
        frequency: '年2回以上',
        duration: '各回1時間以上',
        targetStaff: '全職員',
        requiredBy: '医療法施行規則',
        description: '感染予防策、標準予防策、感染症発生時の対応'
      },
      {
        name: '医薬品安全管理研修',
        frequency: '年2回以上',
        targetStaff: '医薬品業務従事者',
        requiredBy: '医療法施行規則',
        description: '医薬品の適正使用、副作用対応、薬剤管理'
      },
      {
        name: '医療機器安全管理研修',
        frequency: '年2回以上',
        targetStaff: '医療機器使用者',
        requiredBy: '医療法施行規則',
        description: '医療機器の適正使用、保守点検、トラブル対応'
      },
      {
        name: '褥瘡対策研修',
        frequency: '年1回以上',
        targetStaff: '看護職員等',
        requiredBy: '診療報酬要件',
        description: '褥瘡予防、評価、処置方法'
      },
      {
        name: '身体拘束適正化研修',
        frequency: '年2回以上',
        targetStaff: '全職員',
        requiredBy: '診療報酬要件（療養病棟）',
        description: '身体拘束の適応、最小化、記録方法'
      },
      {
        name: '認知症ケア研修',
        frequency: '年1回以上',
        targetStaff: '看護職員・介護職員',
        requiredBy: '診療報酬要件（認知症ケア加算）',
        description: 'BPSDへの対応、コミュニケーション技法'
      },
      {
        name: '個人情報保護研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '個人情報保護法',
        description: '個人情報の取扱い、守秘義務、情報セキュリティ'
      },
      {
        name: '倫理研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '医療法',
        description: '医療倫理、患者の権利、インフォームドコンセント'
      },
      {
        name: '虐待防止研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '高齢者虐待防止法',
        description: '虐待の早期発見、対応、通報義務'
      }
    ]
  },
  {
    facilityType: '介護医療院',
    icon: <Heart className="h-5 w-5" />,
    description: '介護保険法及び介護報酬に基づく必須研修',
    trainings: [
      {
        name: '感染症対策研修',
        frequency: '年2回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準',
        description: '感染症及び食中毒の予防・まん延防止'
      },
      {
        name: '事故発生防止研修',
        frequency: '年2回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準',
        description: '事故防止、リスクマネジメント、事故発生時の対応'
      },
      {
        name: '身体拘束適正化研修',
        frequency: '年2回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準',
        description: '身体拘束廃止、緊急やむを得ない場合の対応'
      },
      {
        name: '虐待防止研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準（2024年度義務化）',
        description: '高齢者虐待防止、不適切ケアの防止'
      },
      {
        name: '認知症介護基礎研修',
        frequency: '採用時',
        targetStaff: '無資格の介護職員',
        requiredBy: '介護報酬基準（2024年度義務化）',
        description: '認知症の基本的理解と対応'
      },
      {
        name: '褥瘡対策研修',
        frequency: '年1回以上',
        targetStaff: '看護・介護職員',
        requiredBy: '介護報酬基準',
        description: '褥瘡予防、早期発見、ケア方法'
      },
      {
        name: '看取り介護研修',
        frequency: '年1回以上',
        targetStaff: '看護・介護職員',
        requiredBy: '介護報酬基準（看取り加算）',
        description: '終末期ケア、家族支援、グリーフケア'
      },
      {
        name: 'プライバシー保護研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準',
        description: '個人情報保護、プライバシーへの配慮'
      },
      {
        name: 'BCP（業務継続計画）研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準（2024年度義務化）',
        description: '災害・感染症発生時の業務継続'
      }
    ]
  },
  {
    facilityType: '介護老人保健施設（超強化型）',
    icon: <Activity className="h-5 w-5" />,
    description: '介護保険法及び超強化型老健の基準に基づく必須研修',
    trainings: [
      {
        name: '感染症対策研修',
        frequency: '年2回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準',
        description: '感染症及び食中毒の予防・まん延防止'
      },
      {
        name: '事故発生防止研修',
        frequency: '年2回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準',
        description: '転倒・転落防止、誤嚥防止、事故対応'
      },
      {
        name: '身体拘束適正化研修',
        frequency: '年2回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準',
        description: '身体拘束廃止の取り組み、代替ケアの検討'
      },
      {
        name: '虐待防止研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準（2024年度義務化）',
        description: '高齢者虐待防止、権利擁護'
      },
      {
        name: '認知症介護基礎研修',
        frequency: '採用時',
        targetStaff: '無資格の介護職員',
        requiredBy: '介護報酬基準（2024年度義務化）',
        description: '認知症ケアの基本'
      },
      {
        name: 'リハビリテーション研修',
        frequency: '年2回以上',
        targetStaff: 'リハビリ従事者',
        requiredBy: '超強化型基準',
        description: '在宅復帰・在宅療養支援、リハビリテーション計画'
      },
      {
        name: '在宅復帰支援研修',
        frequency: '年1回以上',
        targetStaff: '相談員・ケアマネ・看護・介護職',
        requiredBy: '超強化型基準',
        description: '在宅復帰率50%以上達成のための支援方法'
      },
      {
        name: '褥瘡対策研修',
        frequency: '年1回以上',
        targetStaff: '看護・介護職員',
        requiredBy: '介護報酬基準',
        description: '褥瘡マネジメント、予防的スキンケア'
      },
      {
        name: '口腔ケア研修',
        frequency: '年1回以上',
        targetStaff: '看護・介護職員',
        requiredBy: '介護報酬基準（口腔衛生管理加算）',
        description: '口腔機能維持、誤嚥性肺炎予防'
      },
      {
        name: 'BCP（業務継続計画）研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準（2024年度義務化）',
        description: '災害・感染症BCP、訓練実施'
      }
    ]
  },
  {
    facilityType: '認知症対応型共同生活介護（グループホーム）',
    icon: <Home className="h-5 w-5" />,
    description: '地域密着型サービスの基準に基づく必須研修',
    trainings: [
      {
        name: '認知症介護基礎研修',
        frequency: '採用時',
        targetStaff: '無資格の介護職員',
        requiredBy: '介護報酬基準（2024年度義務化）',
        description: '認知症の理解、コミュニケーション技法'
      },
      {
        name: '認知症介護実践者研修',
        frequency: '計画的に受講',
        targetStaff: '介護職員',
        requiredBy: '人員基準',
        description: '認知症ケアの実践的知識・技術'
      },
      {
        name: '感染症対策研修',
        frequency: '年2回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準',
        description: '感染予防、発生時の対応'
      },
      {
        name: '事故発生防止研修',
        frequency: '年2回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準',
        description: '転倒防止、服薬事故防止、行方不明防止'
      },
      {
        name: '身体拘束適正化研修',
        frequency: '年2回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準',
        description: '身体拘束をしないケアの工夫'
      },
      {
        name: '虐待防止研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準（2024年度義務化）',
        description: '不適切ケアの防止、尊厳の保持'
      },
      {
        name: '非常災害対策研修',
        frequency: '年2回以上',
        targetStaff: '全職員',
        requiredBy: '運営基準',
        description: '避難訓練、火災・地震対応'
      },
      {
        name: '地域との連携研修',
        frequency: '年1回以上',
        targetStaff: '管理者・計画作成担当者',
        requiredBy: '運営基準',
        description: '運営推進会議、地域交流'
      },
      {
        name: 'BCP（業務継続計画）研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準（2024年度義務化）',
        description: '小規模事業所のBCP策定・運用'
      }
    ]
  },
  {
    facilityType: '訪問介護事業所',
    icon: <Users className="h-5 w-5" />,
    description: '訪問介護の基準に基づく必須研修',
    trainings: [
      {
        name: '感染症対策研修',
        frequency: '年2回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準',
        description: '訪問時の感染予防、感染症利用者への対応'
      },
      {
        name: '事故発生防止研修',
        frequency: '年2回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準',
        description: '移動・移乗介助の事故防止、交通安全'
      },
      {
        name: '虐待防止研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準（2024年度義務化）',
        description: '高齢者虐待の早期発見、通報義務'
      },
      {
        name: '認知症介護基礎研修',
        frequency: '採用時',
        targetStaff: '無資格の訪問介護員',
        requiredBy: '介護報酬基準（2024年度義務化）',
        description: '認知症の基本理解、訪問介護での対応'
      },
      {
        name: 'プライバシー保護研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '運営基準',
        description: '利用者宅でのプライバシー配慮、情報管理'
      },
      {
        name: '接遇・倫理研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '運営基準',
        description: '訪問マナー、職業倫理、守秘義務'
      },
      {
        name: '緊急時対応研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '運営基準',
        description: '急変時対応、災害時対応、連絡体制'
      },
      {
        name: '介護技術研修',
        frequency: '年2回以上',
        targetStaff: '訪問介護員',
        requiredBy: '質の向上',
        description: '身体介護技術、生活援助技術の向上'
      },
      {
        name: 'BCP（業務継続計画）研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準（2024年度義務化）',
        description: '訪問サービスの業務継続、安否確認'
      }
    ]
  },
  {
    facilityType: '居宅介護支援事業所',
    icon: <FileText className="h-5 w-5" />,
    description: 'ケアマネジメントに関する必須研修',
    trainings: [
      {
        name: '感染症対策研修',
        frequency: '年2回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準',
        description: '事業所内感染予防、利用者宅訪問時の対策'
      },
      {
        name: '虐待防止研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準（2024年度義務化）',
        description: '虐待の早期発見、対応、関係機関との連携'
      },
      {
        name: '法定研修（更新研修）',
        frequency: '5年ごと',
        targetStaff: '介護支援専門員',
        requiredBy: '介護保険法',
        description: '介護支援専門員証の更新に必要な研修'
      },
      {
        name: '主任介護支援専門員研修',
        frequency: '5年ごと（更新）',
        targetStaff: '主任介護支援専門員',
        requiredBy: '介護保険法',
        description: '主任介護支援専門員の資格更新'
      },
      {
        name: '個人情報保護研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '運営基準',
        description: '要介護認定情報等の適切な取扱い'
      },
      {
        name: '公正中立研修',
        frequency: '年1回以上',
        targetStaff: '介護支援専門員',
        requiredBy: '運営基準',
        description: '公正中立なケアマネジメント、特定事業所集中減算'
      },
      {
        name: '質の向上研修',
        frequency: '定期的',
        targetStaff: '介護支援専門員',
        requiredBy: '特定事業所加算要件',
        description: 'アセスメント力向上、多職種連携'
      },
      {
        name: '医療連携研修',
        frequency: '年1回以上',
        targetStaff: '介護支援専門員',
        requiredBy: '運営基準',
        description: '入退院時連携、医療ニーズへの対応'
      },
      {
        name: 'BCP（業務継続計画）研修',
        frequency: '年1回以上',
        targetStaff: '全職員',
        requiredBy: '介護報酬基準（2024年度義務化）',
        description: 'ケアマネジメント業務の継続、利用者支援'
      }
    ]
  }
];

export default function LegalTrainingGuide() {
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>2025年7月時点の法定研修一覧</strong><br />
          以下は厚生労働省が定める各施設種別の法定研修要件です。2024年度から義務化された項目（虐待防止、BCP、認知症介護基礎研修）も含まれています。
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            法定研修要件一覧
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hospital" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="hospital">病院</TabsTrigger>
              <TabsTrigger value="kaigoryouyouin">介護医療院</TabsTrigger>
              <TabsTrigger value="rouken">老健</TabsTrigger>
              <TabsTrigger value="grouphome">GH</TabsTrigger>
              <TabsTrigger value="houmon">訪問介護</TabsTrigger>
              <TabsTrigger value="kyotaku">居宅介護</TabsTrigger>
            </TabsList>

            {legalTrainingsData.map((facility, index) => (
              <TabsContent 
                key={index}
                value={
                  index === 0 ? 'hospital' :
                  index === 1 ? 'kaigoryouyouin' :
                  index === 2 ? 'rouken' :
                  index === 3 ? 'grouphome' :
                  index === 4 ? 'houmon' :
                  'kyotaku'
                }
                className="space-y-4 mt-6"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {facility.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{facility.facilityType}</h3>
                    <p className="text-sm text-gray-600">{facility.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {facility.trainings.map((training, tIndex) => (
                    <Card key={tIndex} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-base">{training.name}</h4>
                          <Badge variant="outline" className="ml-2">
                            {training.frequency}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">対象職員:</span> {training.targetStaff}
                          </div>
                          <div>
                            <span className="font-medium">根拠:</span> {training.requiredBy}
                          </div>
                          {training.duration && (
                            <div className="md:col-span-2">
                              <span className="font-medium">実施時間:</span> {training.duration}
                            </div>
                          )}
                        </div>
                        
                        {training.description && (
                          <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {training.description}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>重要:</strong> 上記の研修は法令・通知に基づく最低基準です。
                    各施設の状況に応じて、追加の研修が必要な場合があります。
                    また、加算取得に必要な研修要件は別途確認が必要です。
                  </AlertDescription>
                </Alert>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-800 mb-1">年間研修計画策定のポイント</p>
                <ul className="space-y-1 text-yellow-700">
                  <li>• 法定研修は優先的にスケジュールに組み込む</li>
                  <li>• 新入職員には採用時研修として認知症介護基礎研修を実施</li>
                  <li>• 年2回実施が必要な研修は上期・下期に分けて計画</li>
                  <li>• BCP研修は訓練と併せて実施すると効果的</li>
                  <li>• 加算要件となる研修は受講管理を徹底</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}