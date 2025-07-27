import { StaffDetail } from '@/types/staff';

// コホート分析用デモデータ（自動生成）
// 生成日時: 2025/7/27 9:31:29
// 総スタッフ数: 165名

export const cohortDemoDatabase: Record<string, StaffDetail> = {
  "OH-NS-2001-001": {
    "id": "OH-NS-2001-001",
    "name": "田中美咲",
    "nameInitial": "田",
    "position": "看護部長",
    "department": "4階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2001-001",
    "joinDate": "2001年4月1日",
    "tenure": "24年3ヶ月",
    "age": 66,
    "birthDate": "1959年5月24日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月27日",
    "healthStatus": "良好",
    "healthScore": 84,
    "stressIndex": 41,
    "engagement": 95,
    "overtime": 14,
    "paidLeaveRate": 44,
    "avatar": "bg-gradient-to-r from-indigo-500 to-green-600",
    "email": "田中.美咲@obara-hp.jp",
    "phone": "080-9578-9251",
    "emergencyContact": "090-7704-9289（親）",
    "address": "東京都○○区△△3-13-14",
    "evaluationData": {
      "rating": 4.3,
      "performance": 94,
      "skill": 72,
      "teamwork": 88,
      "growth": 2.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.9,
        "skills": 4.1,
        "teamwork": 4.3,
        "growth": 2.9,
        "evaluator": "4階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.9,
        "skills": 4.5,
        "teamwork": 4.3,
        "growth": 2.8,
        "evaluator": "4階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 73
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 60
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 85
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 67
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年6月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年4月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年3月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2001年4月",
        "department": "4階病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2006年4月",
        "department": "4階病棟",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2011年4月",
        "department": "4階病棟",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2021-002": {
    "id": "OH-NS-2021-002",
    "name": "中村麻衣",
    "nameInitial": "中",
    "position": "看護師",
    "department": "5階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2021-002",
    "joinDate": "2021年4月1日",
    "tenure": "4年3ヶ月",
    "age": 41,
    "birthDate": "1984年2月6日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月7日",
    "healthStatus": "要注意",
    "healthScore": 77,
    "stressIndex": 36,
    "engagement": 87,
    "overtime": 21,
    "paidLeaveRate": 64,
    "avatar": "bg-gradient-to-r from-pink-500 to-indigo-600",
    "email": "中村.麻衣@obara-hp.jp",
    "phone": "080-8210-7391",
    "emergencyContact": "090-6386-7484（配偶者）",
    "address": "東京都○○区△△7-14-5",
    "evaluationData": {
      "rating": 4.1,
      "performance": 73,
      "skill": 91,
      "teamwork": 87,
      "growth": 4.1
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.4,
        "skills": 3.5,
        "teamwork": 4.5,
        "growth": 3.9,
        "evaluator": "5階病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 3.9,
        "skills": 4.2,
        "teamwork": 3.8,
        "growth": 4.4,
        "evaluator": "5階病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 65
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 87
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 94
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 75
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年8月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年7月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年2月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2021年4月",
        "department": "5階病棟",
        "position": "看護師",
        "reason": "新規配属"
      }
    ]
  },
  "OH-NS-2015-003": {
    "id": "OH-NS-2015-003",
    "name": "高橋明日香",
    "nameInitial": "高",
    "position": "主任看護師",
    "department": "人工透析室",
    "facility": "小原病院",
    "employeeId": "OH-NS-2015-003",
    "joinDate": "2015年4月1日",
    "tenure": "10年3ヶ月",
    "age": 27,
    "birthDate": "1997年9月17日",
    "evaluation": "C",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月21日",
    "healthStatus": "良好",
    "healthScore": 90,
    "stressIndex": 40,
    "engagement": 82,
    "overtime": 23,
    "paidLeaveRate": 72,
    "avatar": "bg-gradient-to-r from-indigo-500 to-green-600",
    "email": "高橋.明日香@obara-hp.jp",
    "phone": "080-8673-3264",
    "emergencyContact": "090-3353-3827（親）",
    "address": "東京都○○区△△8-6-3",
    "evaluationData": {
      "rating": 4.6,
      "performance": 83,
      "skill": 68,
      "teamwork": 90,
      "growth": 3.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "C",
        "performance": 4.3,
        "skills": 4.6,
        "teamwork": 4.8,
        "growth": 4.1,
        "evaluator": "人工透析室 部長"
      },
      {
        "period": "2024年上期",
        "overall": "C",
        "performance": 4.4,
        "skills": 4,
        "teamwork": 4.4,
        "growth": 4.2,
        "evaluator": "人工透析室 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 69
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 64
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 74
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 67
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年3月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年5月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年5月",
        "evaluation": "優秀",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2015年4月",
        "department": "人工透析室",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2020年4月",
        "department": "人工透析室",
        "position": "主任看護師",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2014-004": {
    "id": "OH-NS-2014-004",
    "name": "中村麻衣",
    "nameInitial": "中",
    "position": "師長",
    "department": "5階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2014-004",
    "joinDate": "2014年4月1日",
    "tenure": "11年3ヶ月",
    "age": 33,
    "birthDate": "1992年3月13日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月11日",
    "healthStatus": "良好",
    "healthScore": 78,
    "stressIndex": 31,
    "engagement": 86,
    "overtime": 20,
    "paidLeaveRate": 56,
    "avatar": "bg-gradient-to-r from-purple-500 to-blue-600",
    "email": "中村.麻衣@obara-hp.jp",
    "phone": "080-7148-9873",
    "emergencyContact": "090-2021-9802（兄弟姉妹）",
    "address": "東京都○○区△△2-6-9",
    "evaluationData": {
      "rating": 4.2,
      "performance": 91,
      "skill": 93,
      "teamwork": 75,
      "growth": 3.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.3,
        "skills": 3.7,
        "teamwork": 4.5,
        "growth": 4,
        "evaluator": "5階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.8,
        "skills": 3.7,
        "teamwork": 4.6,
        "growth": 4,
        "evaluator": "5階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 79
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 88
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 87
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 75
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年7月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年11月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年10月",
        "evaluation": "優秀",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2014年4月",
        "department": "5階病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2019年4月",
        "department": "5階病棟",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2024年4月",
        "department": "5階病棟",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2021-005": {
    "id": "OH-NS-2021-005",
    "name": "鈴木美咲",
    "nameInitial": "鈴",
    "position": "看護師",
    "department": "人工透析室",
    "facility": "小原病院",
    "employeeId": "OH-NS-2021-005",
    "joinDate": "2021年4月1日",
    "tenure": "4年3ヶ月",
    "age": 33,
    "birthDate": "1992年3月14日",
    "evaluation": "S",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月9日",
    "healthStatus": "良好",
    "healthScore": 92,
    "stressIndex": 31,
    "engagement": 77,
    "overtime": 11,
    "paidLeaveRate": 60,
    "avatar": "bg-gradient-to-r from-purple-500 to-green-600",
    "email": "鈴木.美咲@obara-hp.jp",
    "phone": "080-5826-2473",
    "emergencyContact": "090-9410-8298（兄弟姉妹）",
    "address": "東京都○○区△△5-7-6",
    "evaluationData": {
      "rating": 4,
      "performance": 81,
      "skill": 83,
      "teamwork": 87,
      "growth": 3.9
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "S",
        "performance": 4.5,
        "skills": 4.7,
        "teamwork": 4.2,
        "growth": 4.4,
        "evaluator": "人工透析室 主任"
      },
      {
        "period": "2024年上期",
        "overall": "S",
        "performance": 4.8,
        "skills": 4.7,
        "teamwork": 4,
        "growth": 4.4,
        "evaluator": "人工透析室 主任"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 76
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 71
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 77
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 78
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年10月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年1月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年4月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2021年4月",
        "department": "人工透析室",
        "position": "看護師",
        "reason": "新規配属"
      }
    ]
  },
  "OH-NS-2005-006": {
    "id": "OH-NS-2005-006",
    "name": "渡辺千尋",
    "nameInitial": "渡",
    "position": "看護部長",
    "department": "4階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2005-006",
    "joinDate": "2005年4月1日",
    "tenure": "20年3ヶ月",
    "age": 66,
    "birthDate": "1959年1月1日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月2日",
    "healthStatus": "要注意",
    "healthScore": 81,
    "stressIndex": 27,
    "engagement": 89,
    "overtime": 20,
    "paidLeaveRate": 40,
    "avatar": "bg-gradient-to-r from-blue-500 to-green-600",
    "email": "渡辺.千尋@obara-hp.jp",
    "phone": "080-9991-8619",
    "emergencyContact": "090-7013-8080（配偶者）",
    "address": "東京都○○区△△1-5-12",
    "evaluationData": {
      "rating": 4.9,
      "performance": 94,
      "skill": 85,
      "teamwork": 96,
      "growth": 2.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.6,
        "skills": 4.5,
        "teamwork": 3.9,
        "growth": 2.8,
        "evaluator": "4階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.6,
        "skills": 3.8,
        "teamwork": 4.6,
        "growth": 2.8,
        "evaluator": "4階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 86
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 95
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 60
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 84
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年1月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年2月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年8月",
        "evaluation": "優秀",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2005年4月",
        "department": "4階病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2010年4月",
        "department": "4階病棟",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2015年4月",
        "department": "4階病棟",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2020-007": {
    "id": "OH-NS-2020-007",
    "name": "鈴木拓海",
    "nameInitial": "鈴",
    "position": "看護師",
    "department": "4階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2020-007",
    "joinDate": "2020年4月1日",
    "tenure": "5年3ヶ月",
    "age": 40,
    "birthDate": "1985年4月6日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月27日",
    "healthStatus": "良好",
    "healthScore": 81,
    "stressIndex": 50,
    "engagement": 83,
    "overtime": 15,
    "paidLeaveRate": 53,
    "avatar": "bg-gradient-to-r from-indigo-500 to-indigo-600",
    "email": "鈴木.拓海@obara-hp.jp",
    "phone": "080-8534-1568",
    "emergencyContact": "090-8176-5452（配偶者）",
    "address": "東京都○○区△△4-17-6",
    "evaluationData": {
      "rating": 3.8,
      "performance": 80,
      "skill": 86,
      "teamwork": 88,
      "growth": 3.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 3.9,
        "skills": 4.6,
        "teamwork": 4.9,
        "growth": 4.3,
        "evaluator": "4階病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.6,
        "skills": 4,
        "teamwork": 3.8,
        "growth": 4.4,
        "evaluator": "4階病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 80
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 83
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 92
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 60
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年1月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年11月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年9月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2020年4月",
        "department": "4階病棟",
        "position": "看護師",
        "reason": "新規配属"
      }
    ]
  },
  "OH-NS-2007-008": {
    "id": "OH-NS-2007-008",
    "name": "伊藤千尋",
    "nameInitial": "伊",
    "position": "看護部長",
    "department": "5階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2007-008",
    "joinDate": "2007年4月1日",
    "tenure": "18年3ヶ月",
    "age": 59,
    "birthDate": "1966年2月21日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月18日",
    "healthStatus": "良好",
    "healthScore": 94,
    "stressIndex": 30,
    "engagement": 90,
    "overtime": 5,
    "paidLeaveRate": 56,
    "avatar": "bg-gradient-to-r from-indigo-500 to-pink-600",
    "email": "伊藤.千尋@obara-hp.jp",
    "phone": "080-2183-8587",
    "emergencyContact": "090-3888-7306（配偶者）",
    "address": "東京都○○区△△7-3-6",
    "evaluationData": {
      "rating": 4.9,
      "performance": 83,
      "skill": 95,
      "teamwork": 83,
      "growth": 2.7
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.6,
        "skills": 4.4,
        "teamwork": 4.8,
        "growth": 2.5,
        "evaluator": "5階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.6,
        "skills": 4.4,
        "teamwork": 3.8,
        "growth": 3.3,
        "evaluator": "5階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 94
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 92
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 73
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 74
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年6月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年11月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年8月",
        "evaluation": "優秀",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2007年4月",
        "department": "5階病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2012年4月",
        "department": "5階病棟",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2017年4月",
        "department": "5階病棟",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2022-009": {
    "id": "OH-NS-2022-009",
    "name": "小林由美",
    "nameInitial": "小",
    "position": "看護師",
    "department": "人工透析室",
    "facility": "小原病院",
    "employeeId": "OH-NS-2022-009",
    "joinDate": "2022年4月1日",
    "tenure": "3年3ヶ月",
    "age": 28,
    "birthDate": "1997年6月19日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月14日",
    "healthStatus": "良好",
    "healthScore": 75,
    "stressIndex": 49,
    "engagement": 79,
    "overtime": 20,
    "paidLeaveRate": 62,
    "avatar": "bg-gradient-to-r from-pink-500 to-purple-600",
    "email": "小林.由美@obara-hp.jp",
    "phone": "080-1136-7115",
    "emergencyContact": "090-5186-8852（親）",
    "address": "東京都○○区△△2-6-14",
    "evaluationData": {
      "rating": 4.2,
      "performance": 91,
      "skill": 69,
      "teamwork": 71,
      "growth": 3.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.4,
        "skills": 4.8,
        "teamwork": 4.6,
        "growth": 3.9,
        "evaluator": "人工透析室 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.7,
        "skills": 3.4,
        "teamwork": 4.4,
        "growth": 4,
        "evaluator": "人工透析室 主任"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 73
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 80
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 92
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 92
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年3月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年10月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年10月",
        "evaluation": "優秀",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2022年4月",
        "department": "人工透析室",
        "position": "看護師",
        "reason": "新規配属"
      }
    ]
  },
  "OH-NS-2006-010": {
    "id": "OH-NS-2006-010",
    "name": "田中奈々",
    "nameInitial": "田",
    "position": "看護部長",
    "department": "3階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2006-010",
    "joinDate": "2006年4月1日",
    "tenure": "19年3ヶ月",
    "age": 61,
    "birthDate": "1963年10月8日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月11日",
    "healthStatus": "良好",
    "healthScore": 95,
    "stressIndex": 40,
    "engagement": 87,
    "overtime": 12,
    "paidLeaveRate": 36,
    "avatar": "bg-gradient-to-r from-green-500 to-green-600",
    "email": "田中.奈々@obara-hp.jp",
    "phone": "080-4319-5751",
    "emergencyContact": "090-6958-3526（親）",
    "address": "東京都○○区△△6-16-7",
    "evaluationData": {
      "rating": 4.6,
      "performance": 92,
      "skill": 95,
      "teamwork": 97,
      "growth": 2.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.3,
        "skills": 3.9,
        "teamwork": 3.9,
        "growth": 3.2,
        "evaluator": "3階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.6,
        "skills": 4.2,
        "teamwork": 3.8,
        "growth": 3.2,
        "evaluator": "3階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 64
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 67
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 94
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 84
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年9月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年4月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年7月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2006年4月",
        "department": "3階病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2011年4月",
        "department": "3階病棟",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2016年4月",
        "department": "3階病棟",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2012-011": {
    "id": "OH-NS-2012-011",
    "name": "加藤健太",
    "nameInitial": "加",
    "position": "師長",
    "department": "3階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2012-011",
    "joinDate": "2012年4月1日",
    "tenure": "13年3ヶ月",
    "age": 43,
    "birthDate": "1981年8月2日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月22日",
    "healthStatus": "良好",
    "healthScore": 80,
    "stressIndex": 45,
    "engagement": 88,
    "overtime": 34,
    "paidLeaveRate": 60,
    "avatar": "bg-gradient-to-r from-purple-500 to-purple-600",
    "email": "加藤.健太@obara-hp.jp",
    "phone": "080-5663-6381",
    "emergencyContact": "090-6243-8774（配偶者）",
    "address": "東京都○○区△△8-19-13",
    "evaluationData": {
      "rating": 4.8,
      "performance": 76,
      "skill": 74,
      "teamwork": 71,
      "growth": 3.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.8,
        "skills": 3.7,
        "teamwork": 4.5,
        "growth": 3.3,
        "evaluator": "3階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.9,
        "skills": 3.6,
        "teamwork": 4.7,
        "growth": 3.6,
        "evaluator": "3階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 81
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 61
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 77
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 79
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年3月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年4月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年4月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2012年4月",
        "department": "3階病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2017年4月",
        "department": "3階病棟",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2022年4月",
        "department": "3階病棟",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2024-012": {
    "id": "OH-NS-2024-012",
    "name": "加藤奈々",
    "nameInitial": "加",
    "position": "看護師",
    "department": "4階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2024-012",
    "joinDate": "2024年4月1日",
    "tenure": "1年3ヶ月",
    "age": 38,
    "birthDate": "1987年3月22日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月13日",
    "healthStatus": "良好",
    "healthScore": 79,
    "stressIndex": 34,
    "engagement": 76,
    "overtime": 27,
    "paidLeaveRate": 69,
    "avatar": "bg-gradient-to-r from-purple-500 to-pink-600",
    "email": "加藤.奈々@obara-hp.jp",
    "phone": "080-7254-5073",
    "emergencyContact": "090-7116-5003（兄弟姉妹）",
    "address": "東京都○○区△△9-1-7",
    "evaluationData": {
      "rating": 4.2,
      "performance": 77,
      "skill": 79,
      "teamwork": 78,
      "growth": 3.5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.1,
        "skills": 3.7,
        "teamwork": 4.8,
        "growth": 3.7,
        "evaluator": "4階病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4,
        "skills": 3.9,
        "teamwork": 4.7,
        "growth": 3.7,
        "evaluator": "4階病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 70
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 86
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 76
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 63
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年9月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年12月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年4月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2024年4月",
        "department": "4階病棟",
        "position": "看護師",
        "reason": "新規配属"
      }
    ]
  },
  "OH-NS-2020-013": {
    "id": "OH-NS-2020-013",
    "name": "伊藤美咲",
    "nameInitial": "伊",
    "position": "看護師",
    "department": "4階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2020-013",
    "joinDate": "2020年4月1日",
    "tenure": "5年3ヶ月",
    "age": 22,
    "birthDate": "2002年11月24日",
    "evaluation": "S",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月1日",
    "healthStatus": "要注意",
    "healthScore": 82,
    "stressIndex": 44,
    "engagement": 74,
    "overtime": 5,
    "paidLeaveRate": 62,
    "avatar": "bg-gradient-to-r from-green-500 to-indigo-600",
    "email": "伊藤.美咲@obara-hp.jp",
    "phone": "080-6727-9485",
    "emergencyContact": "090-9618-9663（兄弟姉妹）",
    "address": "東京都○○区△△4-3-1",
    "evaluationData": {
      "rating": 4.2,
      "performance": 82,
      "skill": 73,
      "teamwork": 88,
      "growth": 4.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "S",
        "performance": 4,
        "skills": 3.9,
        "teamwork": 4.8,
        "growth": 4.2,
        "evaluator": "4階病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "S",
        "performance": 3.6,
        "skills": 4.7,
        "teamwork": 3.8,
        "growth": 4.3,
        "evaluator": "4階病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 84
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 72
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 91
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 64
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年9月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年11月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年7月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2020年4月",
        "department": "4階病棟",
        "position": "看護師",
        "reason": "新規配属"
      }
    ]
  },
  "OH-NS-2009-014": {
    "id": "OH-NS-2009-014",
    "name": "加藤翔太",
    "nameInitial": "加",
    "position": "看護部長",
    "department": "外来",
    "facility": "小原病院",
    "employeeId": "OH-NS-2009-014",
    "joinDate": "2009年4月1日",
    "tenure": "16年3ヶ月",
    "age": 58,
    "birthDate": "1967年7月21日",
    "evaluation": "S",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月8日",
    "healthStatus": "良好",
    "healthScore": 79,
    "stressIndex": 36,
    "engagement": 83,
    "overtime": 26,
    "paidLeaveRate": 56,
    "avatar": "bg-gradient-to-r from-green-500 to-pink-600",
    "email": "加藤.翔太@obara-hp.jp",
    "phone": "080-7920-8124",
    "emergencyContact": "090-5655-7068（兄弟姉妹）",
    "address": "東京都○○区△△8-7-10",
    "evaluationData": {
      "rating": 4.4,
      "performance": 82,
      "skill": 88,
      "teamwork": 98,
      "growth": 3.1
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "S",
        "performance": 4.6,
        "skills": 4.7,
        "teamwork": 4.7,
        "growth": 3.4,
        "evaluator": "外来 部長"
      },
      {
        "period": "2024年上期",
        "overall": "S",
        "performance": 4.7,
        "skills": 4.1,
        "teamwork": 4.5,
        "growth": 3.8,
        "evaluator": "外来 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 64
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 92
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 86
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 94
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年12月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年6月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年10月",
        "evaluation": "優秀",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2009年4月",
        "department": "外来",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2014年4月",
        "department": "外来",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2019年4月",
        "department": "外来",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2024-015": {
    "id": "OH-NS-2024-015",
    "name": "高橋由美",
    "nameInitial": "高",
    "position": "看護師",
    "department": "3階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2024-015",
    "joinDate": "2024年4月1日",
    "tenure": "1年3ヶ月",
    "age": 27,
    "birthDate": "1998年7月23日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月15日",
    "healthStatus": "要注意",
    "healthScore": 81,
    "stressIndex": 45,
    "engagement": 79,
    "overtime": 10,
    "paidLeaveRate": 62,
    "avatar": "bg-gradient-to-r from-blue-500 to-green-600",
    "email": "高橋.由美@obara-hp.jp",
    "phone": "080-7815-3447",
    "emergencyContact": "090-5812-7657（兄弟姉妹）",
    "address": "東京都○○区△△7-9-5",
    "evaluationData": {
      "rating": 3.9,
      "performance": 78,
      "skill": 85,
      "teamwork": 89,
      "growth": 3.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.3,
        "skills": 3.8,
        "teamwork": 4,
        "growth": 3.6,
        "evaluator": "3階病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.4,
        "skills": 3.7,
        "teamwork": 4.7,
        "growth": 4.4,
        "evaluator": "3階病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 60
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 90
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 82
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 76
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年2月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年7月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年12月",
        "evaluation": "優秀",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2024年4月",
        "department": "3階病棟",
        "position": "看護師",
        "reason": "新規配属"
      }
    ]
  },
  "OH-NS-2014-016": {
    "id": "OH-NS-2014-016",
    "name": "山本健太",
    "nameInitial": "山",
    "position": "師長",
    "department": "外来",
    "facility": "小原病院",
    "employeeId": "OH-NS-2014-016",
    "joinDate": "2014年4月1日",
    "tenure": "11年3ヶ月",
    "age": 35,
    "birthDate": "1989年8月17日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月25日",
    "healthStatus": "良好",
    "healthScore": 88,
    "stressIndex": 35,
    "engagement": 84,
    "overtime": 25,
    "paidLeaveRate": 52,
    "avatar": "bg-gradient-to-r from-green-500 to-purple-600",
    "email": "山本.健太@obara-hp.jp",
    "phone": "080-1238-1783",
    "emergencyContact": "090-9867-1246（親）",
    "address": "東京都○○区△△1-20-9",
    "evaluationData": {
      "rating": 4.1,
      "performance": 78,
      "skill": 91,
      "teamwork": 94,
      "growth": 4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.1,
        "skills": 3.9,
        "teamwork": 4.7,
        "growth": 3.8,
        "evaluator": "外来 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.4,
        "skills": 3.7,
        "teamwork": 3.9,
        "growth": 4.4,
        "evaluator": "外来 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 65
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 74
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 89
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 75
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年1月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年6月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年9月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2014年4月",
        "department": "外来",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2019年4月",
        "department": "外来",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2024年4月",
        "department": "外来",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2018-017": {
    "id": "OH-NS-2018-017",
    "name": "加藤太郎",
    "nameInitial": "加",
    "position": "主任看護師",
    "department": "5階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2018-017",
    "joinDate": "2018年4月1日",
    "tenure": "7年3ヶ月",
    "age": 25,
    "birthDate": "2000年7月7日",
    "evaluation": "C",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月9日",
    "healthStatus": "良好",
    "healthScore": 75,
    "stressIndex": 42,
    "engagement": 74,
    "overtime": 17,
    "paidLeaveRate": 62,
    "avatar": "bg-gradient-to-r from-pink-500 to-blue-600",
    "email": "加藤.太郎@obara-hp.jp",
    "phone": "080-3452-4300",
    "emergencyContact": "090-1970-6708（兄弟姉妹）",
    "address": "東京都○○区△△6-15-6",
    "evaluationData": {
      "rating": 4.3,
      "performance": 85,
      "skill": 76,
      "teamwork": 86,
      "growth": 4.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "C",
        "performance": 4.5,
        "skills": 3.6,
        "teamwork": 3.9,
        "growth": 4.7,
        "evaluator": "5階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "C",
        "performance": 4.2,
        "skills": 3.6,
        "teamwork": 4.3,
        "growth": 4.4,
        "evaluator": "5階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 76
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 62
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 64
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 93
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年7月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年2月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年2月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2018年4月",
        "department": "5階病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2023年4月",
        "department": "5階病棟",
        "position": "主任看護師",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2024-018": {
    "id": "OH-NS-2024-018",
    "name": "加藤優子",
    "nameInitial": "加",
    "position": "看護師",
    "department": "5階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2024-018",
    "joinDate": "2024年4月1日",
    "tenure": "1年3ヶ月",
    "age": 35,
    "birthDate": "1989年8月18日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月24日",
    "healthStatus": "良好",
    "healthScore": 70,
    "stressIndex": 43,
    "engagement": 87,
    "overtime": 24,
    "paidLeaveRate": 59,
    "avatar": "bg-gradient-to-r from-indigo-500 to-indigo-600",
    "email": "加藤.優子@obara-hp.jp",
    "phone": "080-9217-9375",
    "emergencyContact": "090-2323-4137（配偶者）",
    "address": "東京都○○区△△6-18-12",
    "evaluationData": {
      "rating": 4.2,
      "performance": 91,
      "skill": 84,
      "teamwork": 97,
      "growth": 4.4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.4,
        "skills": 3.7,
        "teamwork": 4.9,
        "growth": 3.5,
        "evaluator": "5階病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 3.9,
        "skills": 4,
        "teamwork": 4.2,
        "growth": 4,
        "evaluator": "5階病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 77
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 75
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 75
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 74
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年10月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年7月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年9月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2024年4月",
        "department": "5階病棟",
        "position": "看護師",
        "reason": "新規配属"
      }
    ]
  },
  "OH-NS-2020-019": {
    "id": "OH-NS-2020-019",
    "name": "佐藤一郎",
    "nameInitial": "佐",
    "position": "看護師",
    "department": "5階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2020-019",
    "joinDate": "2020年4月1日",
    "tenure": "5年3ヶ月",
    "age": 23,
    "birthDate": "2001年10月8日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月13日",
    "healthStatus": "良好",
    "healthScore": 83,
    "stressIndex": 53,
    "engagement": 73,
    "overtime": 19,
    "paidLeaveRate": 62,
    "avatar": "bg-gradient-to-r from-pink-500 to-pink-600",
    "email": "佐藤.一郎@obara-hp.jp",
    "phone": "080-7771-4810",
    "emergencyContact": "090-3352-8425（兄弟姉妹）",
    "address": "東京都○○区△△2-19-11",
    "evaluationData": {
      "rating": 3.6,
      "performance": 89,
      "skill": 80,
      "teamwork": 80,
      "growth": 4.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.1,
        "skills": 4.3,
        "teamwork": 4.1,
        "growth": 4.5,
        "evaluator": "5階病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 3.6,
        "skills": 4.5,
        "teamwork": 4.3,
        "growth": 4.2,
        "evaluator": "5階病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 94
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 80
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 83
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 74
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年10月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年6月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年5月",
        "evaluation": "優秀",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2020年4月",
        "department": "5階病棟",
        "position": "看護師",
        "reason": "新規配属"
      }
    ]
  },
  "OH-NS-2008-020": {
    "id": "OH-NS-2008-020",
    "name": "渡辺由美",
    "nameInitial": "渡",
    "position": "看護部長",
    "department": "4階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2008-020",
    "joinDate": "2008年4月1日",
    "tenure": "17年3ヶ月",
    "age": 59,
    "birthDate": "1966年4月28日",
    "evaluation": "C",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月13日",
    "healthStatus": "良好",
    "healthScore": 90,
    "stressIndex": 28,
    "engagement": 92,
    "overtime": 7,
    "paidLeaveRate": 54,
    "avatar": "bg-gradient-to-r from-green-500 to-indigo-600",
    "email": "渡辺.由美@obara-hp.jp",
    "phone": "080-5740-6158",
    "emergencyContact": "090-6649-4398（親）",
    "address": "東京都○○区△△5-4-8",
    "evaluationData": {
      "rating": 4.4,
      "performance": 90,
      "skill": 65,
      "teamwork": 93,
      "growth": 2.9
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "C",
        "performance": 4.5,
        "skills": 3.8,
        "teamwork": 4.6,
        "growth": 3,
        "evaluator": "4階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "C",
        "performance": 4.5,
        "skills": 3.8,
        "teamwork": 4.1,
        "growth": 3,
        "evaluator": "4階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 93
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 87
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 68
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 82
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年9月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年6月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年6月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2008年4月",
        "department": "4階病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2013年4月",
        "department": "4階病棟",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2018年4月",
        "department": "4階病棟",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2011-021": {
    "id": "OH-NS-2011-021",
    "name": "山本千尋",
    "nameInitial": "山",
    "position": "師長",
    "department": "外来",
    "facility": "小原病院",
    "employeeId": "OH-NS-2011-021",
    "joinDate": "2011年4月1日",
    "tenure": "14年3ヶ月",
    "age": 37,
    "birthDate": "1988年4月21日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月18日",
    "healthStatus": "良好",
    "healthScore": 86,
    "stressIndex": 47,
    "engagement": 77,
    "overtime": 13,
    "paidLeaveRate": 51,
    "avatar": "bg-gradient-to-r from-purple-500 to-blue-600",
    "email": "山本.千尋@obara-hp.jp",
    "phone": "080-9015-4180",
    "emergencyContact": "090-8261-2760（親）",
    "address": "東京都○○区△△6-20-9",
    "evaluationData": {
      "rating": 4,
      "performance": 84,
      "skill": 79,
      "teamwork": 93,
      "growth": 3.7
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 3.8,
        "skills": 3.7,
        "teamwork": 4.4,
        "growth": 4.4,
        "evaluator": "外来 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.5,
        "skills": 4,
        "teamwork": 4,
        "growth": 4.2,
        "evaluator": "外来 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 87
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 85
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 76
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 87
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年6月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年8月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年7月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2011年4月",
        "department": "外来",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2016年4月",
        "department": "外来",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2021年4月",
        "department": "外来",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2013-022": {
    "id": "OH-NS-2013-022",
    "name": "中村真由",
    "nameInitial": "中",
    "position": "師長",
    "department": "4階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2013-022",
    "joinDate": "2013年4月1日",
    "tenure": "12年3ヶ月",
    "age": 38,
    "birthDate": "1987年7月25日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月20日",
    "healthStatus": "良好",
    "healthScore": 87,
    "stressIndex": 37,
    "engagement": 90,
    "overtime": 12,
    "paidLeaveRate": 75,
    "avatar": "bg-gradient-to-r from-blue-500 to-purple-600",
    "email": "中村.真由@obara-hp.jp",
    "phone": "080-8265-8219",
    "emergencyContact": "090-5873-8898（配偶者）",
    "address": "東京都○○区△△1-5-5",
    "evaluationData": {
      "rating": 4.2,
      "performance": 81,
      "skill": 71,
      "teamwork": 72,
      "growth": 4.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.5,
        "skills": 3.9,
        "teamwork": 4.3,
        "growth": 4.3,
        "evaluator": "4階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.8,
        "skills": 3.7,
        "teamwork": 4.7,
        "growth": 4.1,
        "evaluator": "4階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 94
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 80
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 60
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 83
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年10月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年3月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年11月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2013年4月",
        "department": "4階病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2018年4月",
        "department": "4階病棟",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2023年4月",
        "department": "4階病棟",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2009-023": {
    "id": "OH-NS-2009-023",
    "name": "高橋愛子",
    "nameInitial": "高",
    "position": "看護部長",
    "department": "4階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2009-023",
    "joinDate": "2009年4月1日",
    "tenure": "16年3ヶ月",
    "age": 57,
    "birthDate": "1968年3月2日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月17日",
    "healthStatus": "良好",
    "healthScore": 82,
    "stressIndex": 47,
    "engagement": 85,
    "overtime": 26,
    "paidLeaveRate": 57,
    "avatar": "bg-gradient-to-r from-blue-500 to-green-600",
    "email": "高橋.愛子@obara-hp.jp",
    "phone": "080-7183-1354",
    "emergencyContact": "090-3528-2086（兄弟姉妹）",
    "address": "東京都○○区△△8-20-5",
    "evaluationData": {
      "rating": 4.5,
      "performance": 80,
      "skill": 70,
      "teamwork": 81,
      "growth": 3.1
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.4,
        "skills": 3.6,
        "teamwork": 4.5,
        "growth": 3.2,
        "evaluator": "4階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4,
        "skills": 3.8,
        "teamwork": 4.2,
        "growth": 3.6,
        "evaluator": "4階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 92
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 86
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 70
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 63
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年9月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年5月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年6月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2009年4月",
        "department": "4階病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2014年4月",
        "department": "4階病棟",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2019年4月",
        "department": "4階病棟",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2010-024": {
    "id": "OH-NS-2010-024",
    "name": "田中美咲",
    "nameInitial": "田",
    "position": "師長",
    "department": "3階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2010-024",
    "joinDate": "2010年4月1日",
    "tenure": "15年3ヶ月",
    "age": 41,
    "birthDate": "1984年3月16日",
    "evaluation": "S",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月10日",
    "healthStatus": "良好",
    "healthScore": 80,
    "stressIndex": 48,
    "engagement": 78,
    "overtime": 25,
    "paidLeaveRate": 68,
    "avatar": "bg-gradient-to-r from-blue-500 to-indigo-600",
    "email": "田中.美咲@obara-hp.jp",
    "phone": "080-6709-3426",
    "emergencyContact": "090-6235-8179（配偶者）",
    "address": "東京都○○区△△5-18-4",
    "evaluationData": {
      "rating": 4.5,
      "performance": 87,
      "skill": 80,
      "teamwork": 96,
      "growth": 4.4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "S",
        "performance": 4.1,
        "skills": 4.2,
        "teamwork": 4.6,
        "growth": 4,
        "evaluator": "3階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "S",
        "performance": 3.9,
        "skills": 4.4,
        "teamwork": 4.1,
        "growth": 3.7,
        "evaluator": "3階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 67
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 61
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 86
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 80
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年6月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年12月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年1月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2010年4月",
        "department": "3階病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2015年4月",
        "department": "3階病棟",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2020年4月",
        "department": "3階病棟",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2016-025": {
    "id": "OH-NS-2016-025",
    "name": "佐藤翔太",
    "nameInitial": "佐",
    "position": "主任看護師",
    "department": "5階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2016-025",
    "joinDate": "2016年4月1日",
    "tenure": "9年3ヶ月",
    "age": 40,
    "birthDate": "1985年5月3日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月23日",
    "healthStatus": "要注意",
    "healthScore": 90,
    "stressIndex": 34,
    "engagement": 77,
    "overtime": 23,
    "paidLeaveRate": 63,
    "avatar": "bg-gradient-to-r from-purple-500 to-indigo-600",
    "email": "佐藤.翔太@obara-hp.jp",
    "phone": "080-1353-3710",
    "emergencyContact": "090-6705-2091（配偶者）",
    "address": "東京都○○区△△8-20-6",
    "evaluationData": {
      "rating": 4.6,
      "performance": 83,
      "skill": 93,
      "teamwork": 88,
      "growth": 4.3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.5,
        "skills": 4.6,
        "teamwork": 3.8,
        "growth": 3.7,
        "evaluator": "5階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.6,
        "skills": 4.3,
        "teamwork": 4.4,
        "growth": 4.3,
        "evaluator": "5階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 91
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 94
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 74
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 67
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年11月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年2月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年7月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2016年4月",
        "department": "5階病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2021年4月",
        "department": "5階病棟",
        "position": "主任看護師",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2022-026": {
    "id": "OH-NS-2022-026",
    "name": "山本健司",
    "nameInitial": "山",
    "position": "看護師",
    "department": "4階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2022-026",
    "joinDate": "2022年4月1日",
    "tenure": "3年3ヶ月",
    "age": 31,
    "birthDate": "1993年11月23日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月23日",
    "healthStatus": "良好",
    "healthScore": 81,
    "stressIndex": 49,
    "engagement": 76,
    "overtime": 23,
    "paidLeaveRate": 70,
    "avatar": "bg-gradient-to-r from-green-500 to-green-600",
    "email": "山本.健司@obara-hp.jp",
    "phone": "080-3969-2029",
    "emergencyContact": "090-8116-9039（親）",
    "address": "東京都○○区△△6-10-13",
    "evaluationData": {
      "rating": 4.4,
      "performance": 93,
      "skill": 69,
      "teamwork": 88,
      "growth": 4.1
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.2,
        "skills": 4.7,
        "teamwork": 4.4,
        "growth": 3.9,
        "evaluator": "4階病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.2,
        "skills": 3.8,
        "teamwork": 4.5,
        "growth": 4.1,
        "evaluator": "4階病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 68
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 74
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 62
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 63
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年1月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年5月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年10月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2022年4月",
        "department": "4階病棟",
        "position": "看護師",
        "reason": "新規配属"
      }
    ]
  },
  "OH-NS-2017-027": {
    "id": "OH-NS-2017-027",
    "name": "伊藤由美",
    "nameInitial": "伊",
    "position": "主任看護師",
    "department": "外来",
    "facility": "小原病院",
    "employeeId": "OH-NS-2017-027",
    "joinDate": "2017年4月1日",
    "tenure": "8年3ヶ月",
    "age": 26,
    "birthDate": "1999年4月6日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月15日",
    "healthStatus": "良好",
    "healthScore": 71,
    "stressIndex": 49,
    "engagement": 72,
    "overtime": 19,
    "paidLeaveRate": 66,
    "avatar": "bg-gradient-to-r from-purple-500 to-purple-600",
    "email": "伊藤.由美@obara-hp.jp",
    "phone": "080-8771-7342",
    "emergencyContact": "090-3030-8317（配偶者）",
    "address": "東京都○○区△△4-15-7",
    "evaluationData": {
      "rating": 3.5,
      "performance": 91,
      "skill": 65,
      "teamwork": 73,
      "growth": 4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.3,
        "skills": 4.4,
        "teamwork": 3.9,
        "growth": 4.8,
        "evaluator": "外来 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.2,
        "skills": 4.7,
        "teamwork": 4.7,
        "growth": 4.9,
        "evaluator": "外来 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 76
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 93
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 92
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 64
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年11月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年8月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年2月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2017年4月",
        "department": "外来",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2022年4月",
        "department": "外来",
        "position": "主任看護師",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2016-028": {
    "id": "OH-NS-2016-028",
    "name": "渡辺由美",
    "nameInitial": "渡",
    "position": "主任看護師",
    "department": "人工透析室",
    "facility": "小原病院",
    "employeeId": "OH-NS-2016-028",
    "joinDate": "2016年4月1日",
    "tenure": "9年3ヶ月",
    "age": 46,
    "birthDate": "1979年3月12日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月28日",
    "healthStatus": "良好",
    "healthScore": 87,
    "stressIndex": 35,
    "engagement": 82,
    "overtime": 22,
    "paidLeaveRate": 64,
    "avatar": "bg-gradient-to-r from-blue-500 to-green-600",
    "email": "渡辺.由美@obara-hp.jp",
    "phone": "080-3678-6820",
    "emergencyContact": "090-5390-4305（配偶者）",
    "address": "東京都○○区△△5-7-2",
    "evaluationData": {
      "rating": 4.2,
      "performance": 86,
      "skill": 89,
      "teamwork": 73,
      "growth": 3.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.4,
        "skills": 3.7,
        "teamwork": 4.8,
        "growth": 3.8,
        "evaluator": "人工透析室 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.1,
        "skills": 3.7,
        "teamwork": 4.7,
        "growth": 3,
        "evaluator": "人工透析室 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 86
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 78
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 61
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 78
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年3月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年1月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年1月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2016年4月",
        "department": "人工透析室",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2021年4月",
        "department": "人工透析室",
        "position": "主任看護師",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2009-029": {
    "id": "OH-NS-2009-029",
    "name": "山本悠斗",
    "nameInitial": "山",
    "position": "看護部長",
    "department": "3階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NS-2009-029",
    "joinDate": "2009年4月1日",
    "tenure": "16年3ヶ月",
    "age": 56,
    "birthDate": "1968年9月3日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月23日",
    "healthStatus": "要注意",
    "healthScore": 87,
    "stressIndex": 40,
    "engagement": 92,
    "overtime": 22,
    "paidLeaveRate": 40,
    "avatar": "bg-gradient-to-r from-indigo-500 to-indigo-600",
    "email": "山本.悠斗@obara-hp.jp",
    "phone": "080-5974-6214",
    "emergencyContact": "090-2790-3523（兄弟姉妹）",
    "address": "東京都○○区△△5-15-9",
    "evaluationData": {
      "rating": 4.8,
      "performance": 76,
      "skill": 82,
      "teamwork": 94,
      "growth": 3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.1,
        "skills": 4.4,
        "teamwork": 3.9,
        "growth": 3.7,
        "evaluator": "3階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.6,
        "skills": 3.7,
        "teamwork": 4.1,
        "growth": 3.2,
        "evaluator": "3階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 67
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 73
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 81
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 92
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年4月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年7月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年6月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2009年4月",
        "department": "3階病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2014年4月",
        "department": "3階病棟",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2019年4月",
        "department": "3階病棟",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "OH-NS-2011-030": {
    "id": "OH-NS-2011-030",
    "name": "小林太郎",
    "nameInitial": "小",
    "position": "師長",
    "department": "人工透析室",
    "facility": "小原病院",
    "employeeId": "OH-NS-2011-030",
    "joinDate": "2011年4月1日",
    "tenure": "14年3ヶ月",
    "age": 54,
    "birthDate": "1971年5月12日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月2日",
    "healthStatus": "良好",
    "healthScore": 74,
    "stressIndex": 32,
    "engagement": 83,
    "overtime": 30,
    "paidLeaveRate": 42,
    "avatar": "bg-gradient-to-r from-pink-500 to-purple-600",
    "email": "小林.太郎@obara-hp.jp",
    "phone": "080-5383-1656",
    "emergencyContact": "090-7776-5267（兄弟姉妹）",
    "address": "東京都○○区△△6-12-11",
    "evaluationData": {
      "rating": 4.4,
      "performance": 77,
      "skill": 82,
      "teamwork": 93,
      "growth": 3.9
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.7,
        "skills": 4.1,
        "teamwork": 4.2,
        "growth": 4,
        "evaluator": "人工透析室 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.6,
        "skills": 3.9,
        "teamwork": 4.2,
        "growth": 3.9,
        "evaluator": "人工透析室 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 78
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 72
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 75
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 84
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年10月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年3月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年12月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2011年4月",
        "department": "人工透析室",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2016年4月",
        "department": "人工透析室",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2021年4月",
        "department": "人工透析室",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "OH-NA-2016-001": {
    "id": "OH-NA-2016-001",
    "name": "佐藤優子",
    "nameInitial": "佐",
    "position": "主任看護補助者",
    "department": "人工透析室",
    "facility": "小原病院",
    "employeeId": "OH-NA-2016-001",
    "joinDate": "2016年4月1日",
    "tenure": "9年3ヶ月",
    "age": 48,
    "birthDate": "1976年12月12日",
    "evaluation": "S",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月7日",
    "healthStatus": "要注意",
    "healthScore": 90,
    "stressIndex": 49,
    "engagement": 82,
    "overtime": 21,
    "paidLeaveRate": 59,
    "avatar": "bg-gradient-to-r from-indigo-500 to-indigo-600",
    "email": "佐藤.優子@obara-hp.jp",
    "phone": "080-9567-9442",
    "emergencyContact": "090-6796-8778（兄弟姉妹）",
    "address": "東京都○○区△△7-16-9",
    "evaluationData": {
      "rating": 4.5,
      "performance": 88,
      "skill": 94,
      "teamwork": 86,
      "growth": 3.3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "S",
        "performance": 4.3,
        "skills": 3.6,
        "teamwork": 4.4,
        "growth": 3.1,
        "evaluator": "人工透析室 部長"
      },
      {
        "period": "2024年上期",
        "overall": "S",
        "performance": 4.2,
        "skills": 4.5,
        "teamwork": 4.7,
        "growth": 3.3,
        "evaluator": "人工透析室 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 74
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 64
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 84
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 80
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年9月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年6月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年4月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2016年4月",
        "department": "人工透析室",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2021年4月",
        "department": "人工透析室",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "OH-NA-1999-002": {
    "id": "OH-NA-1999-002",
    "name": "鈴木千尋",
    "nameInitial": "鈴",
    "position": "主任看護補助者",
    "department": "3階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NA-1999-002",
    "joinDate": "1999年4月1日",
    "tenure": "26年3ヶ月",
    "age": 68,
    "birthDate": "1956年8月28日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月17日",
    "healthStatus": "良好",
    "healthScore": 72,
    "stressIndex": 34,
    "engagement": 86,
    "overtime": 13,
    "paidLeaveRate": 49,
    "avatar": "bg-gradient-to-r from-green-500 to-green-600",
    "email": "鈴木.千尋@obara-hp.jp",
    "phone": "080-6742-5811",
    "emergencyContact": "090-7558-6122（兄弟姉妹）",
    "address": "東京都○○区△△2-10-14",
    "evaluationData": {
      "rating": 4.9,
      "performance": 79,
      "skill": 78,
      "teamwork": 70,
      "growth": 2.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.7,
        "skills": 4.7,
        "teamwork": 4.4,
        "growth": 2.9,
        "evaluator": "3階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.3,
        "skills": 4.5,
        "teamwork": 3.7,
        "growth": 2.6,
        "evaluator": "3階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 87
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 76
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 92
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 62
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年1月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年11月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年10月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "1999年4月",
        "department": "3階病棟",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2004年4月",
        "department": "3階病棟",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "OH-NA-2024-003": {
    "id": "OH-NA-2024-003",
    "name": "佐藤花子",
    "nameInitial": "佐",
    "position": "看護補助者",
    "department": "外来",
    "facility": "小原病院",
    "employeeId": "OH-NA-2024-003",
    "joinDate": "2024年4月1日",
    "tenure": "1年3ヶ月",
    "age": 22,
    "birthDate": "2002年8月26日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月1日",
    "healthStatus": "良好",
    "healthScore": 74,
    "stressIndex": 63,
    "engagement": 70,
    "overtime": 12,
    "paidLeaveRate": 78,
    "avatar": "bg-gradient-to-r from-green-500 to-blue-600",
    "email": "佐藤.花子@obara-hp.jp",
    "phone": "080-1756-1555",
    "emergencyContact": "090-3884-6448（親）",
    "address": "東京都○○区△△9-10-14",
    "evaluationData": {
      "rating": 3.9,
      "performance": 85,
      "skill": 86,
      "teamwork": 74,
      "growth": 4.3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 3.9,
        "skills": 3.8,
        "teamwork": 4.6,
        "growth": 4.9,
        "evaluator": "外来 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.2,
        "skills": 4.4,
        "teamwork": 4.4,
        "growth": 4.4,
        "evaluator": "外来 主任"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 83
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 87
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 80
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 94
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年1月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年9月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年8月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2024年4月",
        "department": "外来",
        "position": "看護補助者",
        "reason": "新規配属"
      }
    ]
  },
  "OH-NA-2008-004": {
    "id": "OH-NA-2008-004",
    "name": "伊藤悠斗",
    "nameInitial": "伊",
    "position": "主任看護補助者",
    "department": "4階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NA-2008-004",
    "joinDate": "2008年4月1日",
    "tenure": "17年3ヶ月",
    "age": 68,
    "birthDate": "1957年6月27日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月23日",
    "healthStatus": "良好",
    "healthScore": 75,
    "stressIndex": 25,
    "engagement": 95,
    "overtime": 23,
    "paidLeaveRate": 46,
    "avatar": "bg-gradient-to-r from-purple-500 to-green-600",
    "email": "伊藤.悠斗@obara-hp.jp",
    "phone": "080-2248-1294",
    "emergencyContact": "090-8140-3029（配偶者）",
    "address": "東京都○○区△△2-6-10",
    "evaluationData": {
      "rating": 4.2,
      "performance": 79,
      "skill": 66,
      "teamwork": 92,
      "growth": 2.5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.7,
        "skills": 4.3,
        "teamwork": 4.8,
        "growth": 2.7,
        "evaluator": "4階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.9,
        "skills": 3.9,
        "teamwork": 4.2,
        "growth": 2.8,
        "evaluator": "4階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 95
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 95
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 79
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 71
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年7月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年1月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年7月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2008年4月",
        "department": "4階病棟",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2013年4月",
        "department": "4階病棟",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "OH-NA-2020-005": {
    "id": "OH-NA-2020-005",
    "name": "鈴木由美",
    "nameInitial": "鈴",
    "position": "看護補助者",
    "department": "人工透析室",
    "facility": "小原病院",
    "employeeId": "OH-NA-2020-005",
    "joinDate": "2020年4月1日",
    "tenure": "5年3ヶ月",
    "age": 26,
    "birthDate": "1999年1月12日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月13日",
    "healthStatus": "良好",
    "healthScore": 80,
    "stressIndex": 56,
    "engagement": 83,
    "overtime": 11,
    "paidLeaveRate": 81,
    "avatar": "bg-gradient-to-r from-green-500 to-purple-600",
    "email": "鈴木.由美@obara-hp.jp",
    "phone": "080-2441-3103",
    "emergencyContact": "090-6582-6246（配偶者）",
    "address": "東京都○○区△△5-17-12",
    "evaluationData": {
      "rating": 4.5,
      "performance": 93,
      "skill": 93,
      "teamwork": 90,
      "growth": 4.3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 3.6,
        "skills": 4,
        "teamwork": 4.9,
        "growth": 4.8,
        "evaluator": "人工透析室 主任"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.1,
        "skills": 4,
        "teamwork": 4.3,
        "growth": 4.8,
        "evaluator": "人工透析室 主任"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 78
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 70
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 89
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 83
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年4月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年6月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年12月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2020年4月",
        "department": "人工透析室",
        "position": "看護補助者",
        "reason": "新規配属"
      }
    ]
  },
  "OH-NA-2008-006": {
    "id": "OH-NA-2008-006",
    "name": "小林健太",
    "nameInitial": "小",
    "position": "主任看護補助者",
    "department": "5階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NA-2008-006",
    "joinDate": "2008年4月1日",
    "tenure": "17年3ヶ月",
    "age": 61,
    "birthDate": "1964年2月18日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月2日",
    "healthStatus": "良好",
    "healthScore": 88,
    "stressIndex": 33,
    "engagement": 88,
    "overtime": 21,
    "paidLeaveRate": 53,
    "avatar": "bg-gradient-to-r from-indigo-500 to-indigo-600",
    "email": "小林.健太@obara-hp.jp",
    "phone": "080-2438-8606",
    "emergencyContact": "090-1791-3415（配偶者）",
    "address": "東京都○○区△△4-20-9",
    "evaluationData": {
      "rating": 4.4,
      "performance": 72,
      "skill": 70,
      "teamwork": 95,
      "growth": 3.1
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.3,
        "skills": 3.6,
        "teamwork": 4.1,
        "growth": 3.4,
        "evaluator": "5階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.8,
        "skills": 4.5,
        "teamwork": 4.4,
        "growth": 3.3,
        "evaluator": "5階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 82
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 61
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 95
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 85
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年4月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年9月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年5月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2008年4月",
        "department": "5階病棟",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2013年4月",
        "department": "5階病棟",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "OH-NA-2005-007": {
    "id": "OH-NA-2005-007",
    "name": "加藤優子",
    "nameInitial": "加",
    "position": "主任看護補助者",
    "department": "人工透析室",
    "facility": "小原病院",
    "employeeId": "OH-NA-2005-007",
    "joinDate": "2005年4月1日",
    "tenure": "20年3ヶ月",
    "age": 62,
    "birthDate": "1963年4月8日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月21日",
    "healthStatus": "良好",
    "healthScore": 74,
    "stressIndex": 35,
    "engagement": 85,
    "overtime": 18,
    "paidLeaveRate": 42,
    "avatar": "bg-gradient-to-r from-indigo-500 to-green-600",
    "email": "加藤.優子@obara-hp.jp",
    "phone": "080-3159-5194",
    "emergencyContact": "090-5724-3618（兄弟姉妹）",
    "address": "東京都○○区△△7-15-6",
    "evaluationData": {
      "rating": 5,
      "performance": 85,
      "skill": 90,
      "teamwork": 88,
      "growth": 3.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.5,
        "skills": 4.6,
        "teamwork": 4.8,
        "growth": 3.3,
        "evaluator": "人工透析室 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.5,
        "skills": 3.8,
        "teamwork": 4.5,
        "growth": 3,
        "evaluator": "人工透析室 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 78
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 83
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 76
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 87
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年9月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年1月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年7月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2005年4月",
        "department": "人工透析室",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2010年4月",
        "department": "人工透析室",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "OH-NA-2014-008": {
    "id": "OH-NA-2014-008",
    "name": "佐藤由美",
    "nameInitial": "佐",
    "position": "主任看護補助者",
    "department": "外来",
    "facility": "小原病院",
    "employeeId": "OH-NA-2014-008",
    "joinDate": "2014年4月1日",
    "tenure": "11年3ヶ月",
    "age": 51,
    "birthDate": "1974年4月14日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月8日",
    "healthStatus": "良好",
    "healthScore": 73,
    "stressIndex": 47,
    "engagement": 87,
    "overtime": 18,
    "paidLeaveRate": 53,
    "avatar": "bg-gradient-to-r from-purple-500 to-indigo-600",
    "email": "佐藤.由美@obara-hp.jp",
    "phone": "080-4077-2725",
    "emergencyContact": "090-4576-8632（親）",
    "address": "東京都○○区△△5-5-11",
    "evaluationData": {
      "rating": 4.9,
      "performance": 89,
      "skill": 68,
      "teamwork": 94,
      "growth": 3.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4,
        "skills": 4.4,
        "teamwork": 4.1,
        "growth": 3.3,
        "evaluator": "外来 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4,
        "skills": 3.8,
        "teamwork": 3.9,
        "growth": 3.6,
        "evaluator": "外来 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 91
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 92
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 63
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 70
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年11月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年6月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年3月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2014年4月",
        "department": "外来",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2019年4月",
        "department": "外来",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "OH-NA-2020-009": {
    "id": "OH-NA-2020-009",
    "name": "田中悠斗",
    "nameInitial": "田",
    "position": "看護補助者",
    "department": "3階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NA-2020-009",
    "joinDate": "2020年4月1日",
    "tenure": "5年3ヶ月",
    "age": 26,
    "birthDate": "1998年10月1日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月8日",
    "healthStatus": "良好",
    "healthScore": 85,
    "stressIndex": 65,
    "engagement": 72,
    "overtime": 18,
    "paidLeaveRate": 85,
    "avatar": "bg-gradient-to-r from-indigo-500 to-indigo-600",
    "email": "田中.悠斗@obara-hp.jp",
    "phone": "080-7768-5927",
    "emergencyContact": "090-5300-9163（兄弟姉妹）",
    "address": "東京都○○区△△4-20-6",
    "evaluationData": {
      "rating": 4.4,
      "performance": 71,
      "skill": 66,
      "teamwork": 73,
      "growth": 4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4,
        "skills": 4.3,
        "teamwork": 4.7,
        "growth": 4.1,
        "evaluator": "3階病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.1,
        "skills": 4,
        "teamwork": 4.7,
        "growth": 4.6,
        "evaluator": "3階病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 61
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 92
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 79
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 82
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年2月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年10月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年4月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2020年4月",
        "department": "3階病棟",
        "position": "看護補助者",
        "reason": "新規配属"
      }
    ]
  },
  "OH-NA-2013-010": {
    "id": "OH-NA-2013-010",
    "name": "渡辺奈々",
    "nameInitial": "渡",
    "position": "主任看護補助者",
    "department": "外来",
    "facility": "小原病院",
    "employeeId": "OH-NA-2013-010",
    "joinDate": "2013年4月1日",
    "tenure": "12年3ヶ月",
    "age": 33,
    "birthDate": "1992年4月25日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月2日",
    "healthStatus": "良好",
    "healthScore": 76,
    "stressIndex": 53,
    "engagement": 86,
    "overtime": 25,
    "paidLeaveRate": 62,
    "avatar": "bg-gradient-to-r from-pink-500 to-purple-600",
    "email": "渡辺.奈々@obara-hp.jp",
    "phone": "080-6096-5869",
    "emergencyContact": "090-8994-1497（兄弟姉妹）",
    "address": "東京都○○区△△9-19-7",
    "evaluationData": {
      "rating": 4.6,
      "performance": 88,
      "skill": 94,
      "teamwork": 70,
      "growth": 4.3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.5,
        "skills": 4,
        "teamwork": 4.4,
        "growth": 4.4,
        "evaluator": "外来 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.7,
        "skills": 4.2,
        "teamwork": 4.5,
        "growth": 4.3,
        "evaluator": "外来 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 91
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 71
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 62
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 60
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年6月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年2月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年9月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2013年4月",
        "department": "外来",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2018年4月",
        "department": "外来",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "OH-NA-2013-011": {
    "id": "OH-NA-2013-011",
    "name": "中村一郎",
    "nameInitial": "中",
    "position": "主任看護補助者",
    "department": "人工透析室",
    "facility": "小原病院",
    "employeeId": "OH-NA-2013-011",
    "joinDate": "2013年4月1日",
    "tenure": "12年3ヶ月",
    "age": 51,
    "birthDate": "1973年12月3日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月2日",
    "healthStatus": "要注意",
    "healthScore": 82,
    "stressIndex": 31,
    "engagement": 81,
    "overtime": 32,
    "paidLeaveRate": 65,
    "avatar": "bg-gradient-to-r from-green-500 to-blue-600",
    "email": "中村.一郎@obara-hp.jp",
    "phone": "080-4890-2006",
    "emergencyContact": "090-1775-4703（親）",
    "address": "東京都○○区△△2-9-2",
    "evaluationData": {
      "rating": 4.7,
      "performance": 88,
      "skill": 94,
      "teamwork": 94,
      "growth": 3.7
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.2,
        "skills": 3.7,
        "teamwork": 4.8,
        "growth": 3.6,
        "evaluator": "人工透析室 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.1,
        "skills": 3.6,
        "teamwork": 4.7,
        "growth": 3.5,
        "evaluator": "人工透析室 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 61
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 89
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 88
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 88
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年7月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年10月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年7月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2013年4月",
        "department": "人工透析室",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2018年4月",
        "department": "人工透析室",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "OH-NA-2012-012": {
    "id": "OH-NA-2012-012",
    "name": "中村奈々",
    "nameInitial": "中",
    "position": "主任看護補助者",
    "department": "4階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NA-2012-012",
    "joinDate": "2012年4月1日",
    "tenure": "13年3ヶ月",
    "age": 42,
    "birthDate": "1983年5月3日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月8日",
    "healthStatus": "良好",
    "healthScore": 95,
    "stressIndex": 30,
    "engagement": 85,
    "overtime": 18,
    "paidLeaveRate": 70,
    "avatar": "bg-gradient-to-r from-blue-500 to-green-600",
    "email": "中村.奈々@obara-hp.jp",
    "phone": "080-7730-8502",
    "emergencyContact": "090-7842-2353（親）",
    "address": "東京都○○区△△7-18-3",
    "evaluationData": {
      "rating": 4,
      "performance": 90,
      "skill": 69,
      "teamwork": 89,
      "growth": 3.7
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.4,
        "skills": 4.6,
        "teamwork": 4.8,
        "growth": 3.9,
        "evaluator": "4階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.2,
        "skills": 4.2,
        "teamwork": 4.1,
        "growth": 4.1,
        "evaluator": "4階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 84
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 93
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 82
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 83
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年10月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年2月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年7月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2012年4月",
        "department": "4階病棟",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2017年4月",
        "department": "4階病棟",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "OH-NA-2012-013": {
    "id": "OH-NA-2012-013",
    "name": "山本千尋",
    "nameInitial": "山",
    "position": "主任看護補助者",
    "department": "3階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NA-2012-013",
    "joinDate": "2012年4月1日",
    "tenure": "13年3ヶ月",
    "age": 37,
    "birthDate": "1988年5月19日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月21日",
    "healthStatus": "要注意",
    "healthScore": 75,
    "stressIndex": 49,
    "engagement": 76,
    "overtime": 15,
    "paidLeaveRate": 55,
    "avatar": "bg-gradient-to-r from-blue-500 to-pink-600",
    "email": "山本.千尋@obara-hp.jp",
    "phone": "080-9756-5966",
    "emergencyContact": "090-4308-8966（兄弟姉妹）",
    "address": "東京都○○区△△6-16-4",
    "evaluationData": {
      "rating": 4.7,
      "performance": 71,
      "skill": 81,
      "teamwork": 91,
      "growth": 3.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.7,
        "skills": 4,
        "teamwork": 4.4,
        "growth": 3.7,
        "evaluator": "3階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4,
        "skills": 3.7,
        "teamwork": 4.5,
        "growth": 4.1,
        "evaluator": "3階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 90
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 64
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 88
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 88
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年12月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年3月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年9月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2012年4月",
        "department": "3階病棟",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2017年4月",
        "department": "3階病棟",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "OH-NA-2009-014": {
    "id": "OH-NA-2009-014",
    "name": "山本雄一",
    "nameInitial": "山",
    "position": "主任看護補助者",
    "department": "5階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NA-2009-014",
    "joinDate": "2009年4月1日",
    "tenure": "16年3ヶ月",
    "age": 59,
    "birthDate": "1966年3月26日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月17日",
    "healthStatus": "要注意",
    "healthScore": 79,
    "stressIndex": 27,
    "engagement": 88,
    "overtime": 17,
    "paidLeaveRate": 39,
    "avatar": "bg-gradient-to-r from-blue-500 to-indigo-600",
    "email": "山本.雄一@obara-hp.jp",
    "phone": "080-8090-4802",
    "emergencyContact": "090-1521-1478（兄弟姉妹）",
    "address": "東京都○○区△△5-4-10",
    "evaluationData": {
      "rating": 4.7,
      "performance": 84,
      "skill": 77,
      "teamwork": 84,
      "growth": 2.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.3,
        "skills": 4.3,
        "teamwork": 4.8,
        "growth": 3.4,
        "evaluator": "5階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.9,
        "skills": 3.8,
        "teamwork": 3.9,
        "growth": 2.8,
        "evaluator": "5階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 93
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 72
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 77
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 79
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年6月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年2月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年4月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2009年4月",
        "department": "5階病棟",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2014年4月",
        "department": "5階病棟",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "OH-NA-2004-015": {
    "id": "OH-NA-2004-015",
    "name": "鈴木愛子",
    "nameInitial": "鈴",
    "position": "主任看護補助者",
    "department": "5階病棟",
    "facility": "小原病院",
    "employeeId": "OH-NA-2004-015",
    "joinDate": "2004年4月1日",
    "tenure": "21年3ヶ月",
    "age": 66,
    "birthDate": "1959年2月27日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月4日",
    "healthStatus": "良好",
    "healthScore": 91,
    "stressIndex": 20,
    "engagement": 90,
    "overtime": 17,
    "paidLeaveRate": 51,
    "avatar": "bg-gradient-to-r from-green-500 to-indigo-600",
    "email": "鈴木.愛子@obara-hp.jp",
    "phone": "080-5667-6662",
    "emergencyContact": "090-6890-6101（配偶者）",
    "address": "東京都○○区△△8-19-1",
    "evaluationData": {
      "rating": 4.3,
      "performance": 71,
      "skill": 94,
      "teamwork": 75,
      "growth": 3.3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.7,
        "skills": 3.6,
        "teamwork": 4.5,
        "growth": 2.6,
        "evaluator": "5階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.6,
        "skills": 3.6,
        "teamwork": 4.7,
        "growth": 2.5,
        "evaluator": "5階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 73
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 78
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 94
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 93
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年5月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年6月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年1月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2004年4月",
        "department": "5階病棟",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2009年4月",
        "department": "5階病棟",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "OH-CG-2022-001": {
    "id": "OH-CG-2022-001",
    "name": "田中陽太",
    "nameInitial": "田",
    "position": "介護士",
    "department": "3階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CG-2022-001",
    "joinDate": "2022年4月1日",
    "tenure": "3年3ヶ月",
    "age": 33,
    "birthDate": "1991年10月26日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月4日",
    "healthStatus": "良好",
    "healthScore": 92,
    "stressIndex": 50,
    "engagement": 82,
    "overtime": 14,
    "paidLeaveRate": 64,
    "avatar": "bg-gradient-to-r from-indigo-500 to-indigo-600",
    "email": "田中.陽太@obara-hp.jp",
    "phone": "080-1552-3920",
    "emergencyContact": "090-5471-4282（兄弟姉妹）",
    "address": "東京都○○区△△8-14-7",
    "evaluationData": {
      "rating": 4.4,
      "performance": 78,
      "skill": 78,
      "teamwork": 77,
      "growth": 4.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.7,
        "skills": 4.4,
        "teamwork": 4,
        "growth": 4.5,
        "evaluator": "3階病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.1,
        "skills": 4.1,
        "teamwork": 3.9,
        "growth": 4.1,
        "evaluator": "3階病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 87
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 66
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 63
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 92
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年3月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年12月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年5月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2022年4月",
        "department": "3階病棟",
        "position": "介護士",
        "reason": "新規配属"
      }
    ]
  },
  "OH-CG-2004-002": {
    "id": "OH-CG-2004-002",
    "name": "加藤千尋",
    "nameInitial": "加",
    "position": "介護主任",
    "department": "5階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CG-2004-002",
    "joinDate": "2004年4月1日",
    "tenure": "21年3ヶ月",
    "age": 69,
    "birthDate": "1956年4月19日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月4日",
    "healthStatus": "良好",
    "healthScore": 79,
    "stressIndex": 27,
    "engagement": 93,
    "overtime": 6,
    "paidLeaveRate": 53,
    "avatar": "bg-gradient-to-r from-green-500 to-blue-600",
    "email": "加藤.千尋@obara-hp.jp",
    "phone": "080-7074-1955",
    "emergencyContact": "090-6186-8324（配偶者）",
    "address": "東京都○○区△△3-19-5",
    "evaluationData": {
      "rating": 4.6,
      "performance": 79,
      "skill": 69,
      "teamwork": 80,
      "growth": 2.7
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.8,
        "skills": 4.8,
        "teamwork": 4.2,
        "growth": 2.8,
        "evaluator": "5階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.4,
        "skills": 4.7,
        "teamwork": 4.7,
        "growth": 2.9,
        "evaluator": "5階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 60
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 90
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 85
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 91
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年10月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年3月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年3月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2004年4月",
        "department": "5階病棟",
        "position": "介護士",
        "reason": "新規配属"
      },
      {
        "date": "2009年4月",
        "department": "5階病棟",
        "position": "介護主任",
        "reason": "昇進"
      }
    ]
  },
  "OH-CG-2023-003": {
    "id": "OH-CG-2023-003",
    "name": "山本由美",
    "nameInitial": "山",
    "position": "介護士",
    "department": "3階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CG-2023-003",
    "joinDate": "2023年4月1日",
    "tenure": "2年3ヶ月",
    "age": 41,
    "birthDate": "1984年7月23日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月14日",
    "healthStatus": "良好",
    "healthScore": 78,
    "stressIndex": 48,
    "engagement": 78,
    "overtime": 11,
    "paidLeaveRate": 62,
    "avatar": "bg-gradient-to-r from-blue-500 to-green-600",
    "email": "山本.由美@obara-hp.jp",
    "phone": "080-1563-5787",
    "emergencyContact": "090-9792-8769（兄弟姉妹）",
    "address": "東京都○○区△△3-4-4",
    "evaluationData": {
      "rating": 4.4,
      "performance": 81,
      "skill": 95,
      "teamwork": 96,
      "growth": 4.3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.7,
        "skills": 4.5,
        "teamwork": 4.6,
        "growth": 4,
        "evaluator": "3階病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.6,
        "skills": 4.1,
        "teamwork": 4.3,
        "growth": 4.3,
        "evaluator": "3階病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 64
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 77
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 67
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 92
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年6月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年7月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年5月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2023年4月",
        "department": "3階病棟",
        "position": "介護士",
        "reason": "新規配属"
      }
    ]
  },
  "OH-CG-2018-004": {
    "id": "OH-CG-2018-004",
    "name": "佐藤千尋",
    "nameInitial": "佐",
    "position": "介護主任",
    "department": "5階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CG-2018-004",
    "joinDate": "2018年4月1日",
    "tenure": "7年3ヶ月",
    "age": 26,
    "birthDate": "1999年4月28日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月21日",
    "healthStatus": "良好",
    "healthScore": 93,
    "stressIndex": 56,
    "engagement": 72,
    "overtime": 16,
    "paidLeaveRate": 62,
    "avatar": "bg-gradient-to-r from-blue-500 to-green-600",
    "email": "佐藤.千尋@obara-hp.jp",
    "phone": "080-2174-4117",
    "emergencyContact": "090-2930-2022（兄弟姉妹）",
    "address": "東京都○○区△△7-15-7",
    "evaluationData": {
      "rating": 4.3,
      "performance": 81,
      "skill": 67,
      "teamwork": 98,
      "growth": 5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 3.5,
        "skills": 3.7,
        "teamwork": 3.9,
        "growth": 4,
        "evaluator": "5階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 3.6,
        "skills": 4.6,
        "teamwork": 4.5,
        "growth": 4.4,
        "evaluator": "5階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 76
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 69
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 68
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 75
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年2月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年3月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年4月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2018年4月",
        "department": "5階病棟",
        "position": "介護士",
        "reason": "新規配属"
      },
      {
        "date": "2023年4月",
        "department": "5階病棟",
        "position": "介護主任",
        "reason": "昇進"
      }
    ]
  },
  "OH-CG-2001-005": {
    "id": "OH-CG-2001-005",
    "name": "佐藤明日香",
    "nameInitial": "佐",
    "position": "介護主任",
    "department": "4階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CG-2001-005",
    "joinDate": "2001年4月1日",
    "tenure": "24年3ヶ月",
    "age": 64,
    "birthDate": "1960年10月16日",
    "evaluation": "C",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月11日",
    "healthStatus": "良好",
    "healthScore": 86,
    "stressIndex": 23,
    "engagement": 86,
    "overtime": 13,
    "paidLeaveRate": 41,
    "avatar": "bg-gradient-to-r from-green-500 to-pink-600",
    "email": "佐藤.明日香@obara-hp.jp",
    "phone": "080-5833-9410",
    "emergencyContact": "090-7719-4064（配偶者）",
    "address": "東京都○○区△△2-6-2",
    "evaluationData": {
      "rating": 4.2,
      "performance": 90,
      "skill": 65,
      "teamwork": 88,
      "growth": 2.5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "C",
        "performance": 4.5,
        "skills": 4.1,
        "teamwork": 4.1,
        "growth": 3.4,
        "evaluator": "4階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "C",
        "performance": 5,
        "skills": 4,
        "teamwork": 4.4,
        "growth": 3.1,
        "evaluator": "4階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 70
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 87
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 85
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 84
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年10月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年2月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年8月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2001年4月",
        "department": "4階病棟",
        "position": "介護士",
        "reason": "新規配属"
      },
      {
        "date": "2006年4月",
        "department": "4階病棟",
        "position": "介護主任",
        "reason": "昇進"
      }
    ]
  },
  "OH-CG-2024-006": {
    "id": "OH-CG-2024-006",
    "name": "中村麻衣",
    "nameInitial": "中",
    "position": "介護士",
    "department": "3階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CG-2024-006",
    "joinDate": "2024年4月1日",
    "tenure": "1年3ヶ月",
    "age": 24,
    "birthDate": "2000年9月18日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月28日",
    "healthStatus": "良好",
    "healthScore": 75,
    "stressIndex": 61,
    "engagement": 76,
    "overtime": 6,
    "paidLeaveRate": 78,
    "avatar": "bg-gradient-to-r from-indigo-500 to-pink-600",
    "email": "中村.麻衣@obara-hp.jp",
    "phone": "080-5241-3577",
    "emergencyContact": "090-7333-2325（兄弟姉妹）",
    "address": "東京都○○区△△3-2-5",
    "evaluationData": {
      "rating": 4.1,
      "performance": 93,
      "skill": 85,
      "teamwork": 94,
      "growth": 4.4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4,
        "skills": 4.7,
        "teamwork": 4.3,
        "growth": 4.8,
        "evaluator": "3階病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 3.5,
        "skills": 3.5,
        "teamwork": 3.9,
        "growth": 4.4,
        "evaluator": "3階病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 87
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 72
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 71
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 78
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年9月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年3月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年12月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2024年4月",
        "department": "3階病棟",
        "position": "介護士",
        "reason": "新規配属"
      }
    ]
  },
  "OH-CG-2018-007": {
    "id": "OH-CG-2018-007",
    "name": "山本愛子",
    "nameInitial": "山",
    "position": "介護主任",
    "department": "3階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CG-2018-007",
    "joinDate": "2018年4月1日",
    "tenure": "7年3ヶ月",
    "age": 27,
    "birthDate": "1998年2月1日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月18日",
    "healthStatus": "良好",
    "healthScore": 83,
    "stressIndex": 53,
    "engagement": 86,
    "overtime": 26,
    "paidLeaveRate": 65,
    "avatar": "bg-gradient-to-r from-purple-500 to-purple-600",
    "email": "山本.愛子@obara-hp.jp",
    "phone": "080-9762-6597",
    "emergencyContact": "090-5688-3582（兄弟姉妹）",
    "address": "東京都○○区△△5-19-13",
    "evaluationData": {
      "rating": 4.5,
      "performance": 83,
      "skill": 76,
      "teamwork": 78,
      "growth": 3.9
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.7,
        "skills": 4.3,
        "teamwork": 4.5,
        "growth": 3.9,
        "evaluator": "3階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4,
        "skills": 4.2,
        "teamwork": 4.1,
        "growth": 3.9,
        "evaluator": "3階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 70
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 84
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 77
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 88
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年9月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年8月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年10月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2018年4月",
        "department": "3階病棟",
        "position": "介護士",
        "reason": "新規配属"
      },
      {
        "date": "2023年4月",
        "department": "3階病棟",
        "position": "介護主任",
        "reason": "昇進"
      }
    ]
  },
  "OH-CG-2015-008": {
    "id": "OH-CG-2015-008",
    "name": "加藤由美",
    "nameInitial": "加",
    "position": "介護主任",
    "department": "4階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CG-2015-008",
    "joinDate": "2015年4月1日",
    "tenure": "10年3ヶ月",
    "age": 44,
    "birthDate": "1981年3月13日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月18日",
    "healthStatus": "良好",
    "healthScore": 87,
    "stressIndex": 49,
    "engagement": 95,
    "overtime": 22,
    "paidLeaveRate": 42,
    "avatar": "bg-gradient-to-r from-blue-500 to-pink-600",
    "email": "加藤.由美@obara-hp.jp",
    "phone": "080-9543-8622",
    "emergencyContact": "090-8858-3368（兄弟姉妹）",
    "address": "東京都○○区△△7-9-2",
    "evaluationData": {
      "rating": 4.6,
      "performance": 95,
      "skill": 82,
      "teamwork": 95,
      "growth": 3.3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.5,
        "skills": 3.7,
        "teamwork": 4.7,
        "growth": 3.1,
        "evaluator": "4階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.2,
        "skills": 3.5,
        "teamwork": 4.3,
        "growth": 3.8,
        "evaluator": "4階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 94
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 66
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 62
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 69
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年6月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年7月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年12月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2015年4月",
        "department": "4階病棟",
        "position": "介護士",
        "reason": "新規配属"
      },
      {
        "date": "2020年4月",
        "department": "4階病棟",
        "position": "介護主任",
        "reason": "昇進"
      }
    ]
  },
  "OH-CG-1997-009": {
    "id": "OH-CG-1997-009",
    "name": "渡辺千尋",
    "nameInitial": "渡",
    "position": "介護主任",
    "department": "5階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CG-1997-009",
    "joinDate": "1997年4月1日",
    "tenure": "28年3ヶ月",
    "age": 70,
    "birthDate": "1955年3月6日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月7日",
    "healthStatus": "要注意",
    "healthScore": 73,
    "stressIndex": 27,
    "engagement": 92,
    "overtime": 19,
    "paidLeaveRate": 57,
    "avatar": "bg-gradient-to-r from-purple-500 to-green-600",
    "email": "渡辺.千尋@obara-hp.jp",
    "phone": "080-4212-9306",
    "emergencyContact": "090-4873-7412（兄弟姉妹）",
    "address": "東京都○○区△△4-2-15",
    "evaluationData": {
      "rating": 4.9,
      "performance": 73,
      "skill": 76,
      "teamwork": 90,
      "growth": 2.7
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.3,
        "skills": 4.7,
        "teamwork": 4.5,
        "growth": 2.9,
        "evaluator": "5階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 5,
        "skills": 3.5,
        "teamwork": 4.4,
        "growth": 2.8,
        "evaluator": "5階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 79
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 87
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 71
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 63
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年4月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年6月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年1月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "1997年4月",
        "department": "5階病棟",
        "position": "介護士",
        "reason": "新規配属"
      },
      {
        "date": "2002年4月",
        "department": "5階病棟",
        "position": "介護主任",
        "reason": "昇進"
      }
    ]
  },
  "OH-CG-2018-010": {
    "id": "OH-CG-2018-010",
    "name": "山本優子",
    "nameInitial": "山",
    "position": "介護主任",
    "department": "3階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CG-2018-010",
    "joinDate": "2018年4月1日",
    "tenure": "7年3ヶ月",
    "age": 31,
    "birthDate": "1994年6月26日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月16日",
    "healthStatus": "要注意",
    "healthScore": 82,
    "stressIndex": 47,
    "engagement": 79,
    "overtime": 11,
    "paidLeaveRate": 52,
    "avatar": "bg-gradient-to-r from-purple-500 to-pink-600",
    "email": "山本.優子@obara-hp.jp",
    "phone": "080-8941-8813",
    "emergencyContact": "090-7520-5983（親）",
    "address": "東京都○○区△△5-9-3",
    "evaluationData": {
      "rating": 4.4,
      "performance": 77,
      "skill": 65,
      "teamwork": 90,
      "growth": 3.9
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.2,
        "skills": 3.8,
        "teamwork": 4.3,
        "growth": 3.6,
        "evaluator": "3階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.7,
        "skills": 3.5,
        "teamwork": 4,
        "growth": 3.6,
        "evaluator": "3階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 61
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 86
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 65
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 76
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年1月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年6月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年8月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2018年4月",
        "department": "3階病棟",
        "position": "介護士",
        "reason": "新規配属"
      },
      {
        "date": "2023年4月",
        "department": "3階病棟",
        "position": "介護主任",
        "reason": "昇進"
      }
    ]
  },
  "OH-CW-2022-001": {
    "id": "OH-CW-2022-001",
    "name": "鈴木千尋",
    "nameInitial": "鈴",
    "position": "介護福祉士",
    "department": "5階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CW-2022-001",
    "joinDate": "2022年4月1日",
    "tenure": "3年3ヶ月",
    "age": 28,
    "birthDate": "1997年3月22日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月16日",
    "healthStatus": "良好",
    "healthScore": 91,
    "stressIndex": 35,
    "engagement": 82,
    "overtime": 29,
    "paidLeaveRate": 58,
    "avatar": "bg-gradient-to-r from-purple-500 to-green-600",
    "email": "鈴木.千尋@obara-hp.jp",
    "phone": "080-1350-3283",
    "emergencyContact": "090-4420-5270（親）",
    "address": "東京都○○区△△5-9-9",
    "evaluationData": {
      "rating": 4.3,
      "performance": 89,
      "skill": 86,
      "teamwork": 77,
      "growth": 4.3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.3,
        "skills": 4.2,
        "teamwork": 4.2,
        "growth": 4.4,
        "evaluator": "5階病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4,
        "skills": 3.6,
        "teamwork": 4.2,
        "growth": 4.1,
        "evaluator": "5階病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 67
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 83
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 72
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 90
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年6月",
        "evaluation": "優秀",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年12月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年6月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2022年4月",
        "department": "5階病棟",
        "position": "介護福祉士",
        "reason": "新規配属"
      }
    ]
  },
  "OH-CW-2003-002": {
    "id": "OH-CW-2003-002",
    "name": "小林愛子",
    "nameInitial": "小",
    "position": "主任介護福祉士",
    "department": "3階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CW-2003-002",
    "joinDate": "2003年4月1日",
    "tenure": "22年3ヶ月",
    "age": 64,
    "birthDate": "1961年6月11日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月12日",
    "healthStatus": "良好",
    "healthScore": 81,
    "stressIndex": 42,
    "engagement": 92,
    "overtime": 22,
    "paidLeaveRate": 58,
    "avatar": "bg-gradient-to-r from-green-500 to-blue-600",
    "email": "小林.愛子@obara-hp.jp",
    "phone": "080-4538-8874",
    "emergencyContact": "090-9191-2619（親）",
    "address": "東京都○○区△△1-16-7",
    "evaluationData": {
      "rating": 4.3,
      "performance": 95,
      "skill": 78,
      "teamwork": 90,
      "growth": 2.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.3,
        "skills": 3.6,
        "teamwork": 4,
        "growth": 2.9,
        "evaluator": "3階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.9,
        "skills": 3.8,
        "teamwork": 3.7,
        "growth": 3.3,
        "evaluator": "3階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 86
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 76
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 84
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 64
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年8月",
        "evaluation": "合格",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年3月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年12月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2003年4月",
        "department": "3階病棟",
        "position": "介護福祉士",
        "reason": "新規配属"
      },
      {
        "date": "2008年4月",
        "department": "3階病棟",
        "position": "主任介護福祉士",
        "reason": "昇進"
      }
    ]
  },
  "OH-CW-2013-003": {
    "id": "OH-CW-2013-003",
    "name": "伊藤真由",
    "nameInitial": "伊",
    "position": "主任介護福祉士",
    "department": "3階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CW-2013-003",
    "joinDate": "2013年4月1日",
    "tenure": "12年3ヶ月",
    "age": 48,
    "birthDate": "1977年7月23日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月5日",
    "healthStatus": "要注意",
    "healthScore": 95,
    "stressIndex": 26,
    "engagement": 81,
    "overtime": 18,
    "paidLeaveRate": 40,
    "avatar": "bg-gradient-to-r from-pink-500 to-pink-600",
    "email": "伊藤.真由@obara-hp.jp",
    "phone": "080-7850-4837",
    "emergencyContact": "090-5555-8200（親）",
    "address": "東京都○○区△△8-1-11",
    "evaluationData": {
      "rating": 4.2,
      "performance": 74,
      "skill": 85,
      "teamwork": 71,
      "growth": 3.4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.7,
        "skills": 4,
        "teamwork": 4.8,
        "growth": 3.9,
        "evaluator": "3階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.1,
        "skills": 3.7,
        "teamwork": 4.4,
        "growth": 3.5,
        "evaluator": "3階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 65
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 61
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 60
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 71
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年9月",
        "evaluation": "良好",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年9月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年10月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2013年4月",
        "department": "3階病棟",
        "position": "介護福祉士",
        "reason": "新規配属"
      },
      {
        "date": "2018年4月",
        "department": "3階病棟",
        "position": "主任介護福祉士",
        "reason": "昇進"
      }
    ]
  },
  "OH-CW-2012-004": {
    "id": "OH-CW-2012-004",
    "name": "渡辺花子",
    "nameInitial": "渡",
    "position": "主任介護福祉士",
    "department": "3階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CW-2012-004",
    "joinDate": "2012年4月1日",
    "tenure": "13年3ヶ月",
    "age": 48,
    "birthDate": "1977年7月10日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月23日",
    "healthStatus": "良好",
    "healthScore": 88,
    "stressIndex": 50,
    "engagement": 90,
    "overtime": 29,
    "paidLeaveRate": 44,
    "avatar": "bg-gradient-to-r from-blue-500 to-green-600",
    "email": "渡辺.花子@obara-hp.jp",
    "phone": "080-6418-2491",
    "emergencyContact": "090-4154-8938（兄弟姉妹）",
    "address": "東京都○○区△△2-4-2",
    "evaluationData": {
      "rating": 4.1,
      "performance": 78,
      "skill": 75,
      "teamwork": 89,
      "growth": 3.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.2,
        "skills": 4.8,
        "teamwork": 4.7,
        "growth": 3.5,
        "evaluator": "3階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.1,
        "skills": 3.8,
        "teamwork": 4,
        "growth": 3.7,
        "evaluator": "3階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 64
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 75
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 82
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 82
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年2月",
        "evaluation": "優秀",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年6月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年1月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2012年4月",
        "department": "3階病棟",
        "position": "介護福祉士",
        "reason": "新規配属"
      },
      {
        "date": "2017年4月",
        "department": "3階病棟",
        "position": "主任介護福祉士",
        "reason": "昇進"
      }
    ]
  },
  "OH-CW-2023-005": {
    "id": "OH-CW-2023-005",
    "name": "山本愛子",
    "nameInitial": "山",
    "position": "介護福祉士",
    "department": "4階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CW-2023-005",
    "joinDate": "2023年4月1日",
    "tenure": "2年3ヶ月",
    "age": 33,
    "birthDate": "1992年1月28日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月28日",
    "healthStatus": "良好",
    "healthScore": 95,
    "stressIndex": 51,
    "engagement": 85,
    "overtime": 12,
    "paidLeaveRate": 51,
    "avatar": "bg-gradient-to-r from-pink-500 to-green-600",
    "email": "山本.愛子@obara-hp.jp",
    "phone": "080-5332-7955",
    "emergencyContact": "090-8457-6137（兄弟姉妹）",
    "address": "東京都○○区△△7-2-6",
    "evaluationData": {
      "rating": 3.8,
      "performance": 88,
      "skill": 68,
      "teamwork": 91,
      "growth": 4.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.4,
        "skills": 3.8,
        "teamwork": 3.9,
        "growth": 3.7,
        "evaluator": "4階病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.3,
        "skills": 4.6,
        "teamwork": 4.5,
        "growth": 4.4,
        "evaluator": "4階病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 72
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 83
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 60
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 82
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年1月",
        "evaluation": "優秀",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年12月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年7月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2023年4月",
        "department": "4階病棟",
        "position": "介護福祉士",
        "reason": "新規配属"
      }
    ]
  },
  "OH-CW-2013-006": {
    "id": "OH-CW-2013-006",
    "name": "田中翔太",
    "nameInitial": "田",
    "position": "主任介護福祉士",
    "department": "4階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CW-2013-006",
    "joinDate": "2013年4月1日",
    "tenure": "12年3ヶ月",
    "age": 42,
    "birthDate": "1983年2月24日",
    "evaluation": "C",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月23日",
    "healthStatus": "良好",
    "healthScore": 72,
    "stressIndex": 53,
    "engagement": 83,
    "overtime": 13,
    "paidLeaveRate": 62,
    "avatar": "bg-gradient-to-r from-indigo-500 to-blue-600",
    "email": "田中.翔太@obara-hp.jp",
    "phone": "080-1098-1739",
    "emergencyContact": "090-6655-5090（兄弟姉妹）",
    "address": "東京都○○区△△7-10-5",
    "evaluationData": {
      "rating": 4,
      "performance": 94,
      "skill": 83,
      "teamwork": 83,
      "growth": 4.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "C",
        "performance": 4.8,
        "skills": 4.2,
        "teamwork": 4.2,
        "growth": 3.9,
        "evaluator": "4階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "C",
        "performance": 4.4,
        "skills": 4.1,
        "teamwork": 3.8,
        "growth": 4,
        "evaluator": "4階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 60
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 76
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 94
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 92
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年3月",
        "evaluation": "良好",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年2月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年1月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2013年4月",
        "department": "4階病棟",
        "position": "介護福祉士",
        "reason": "新規配属"
      },
      {
        "date": "2018年4月",
        "department": "4階病棟",
        "position": "主任介護福祉士",
        "reason": "昇進"
      }
    ]
  },
  "OH-CW-2016-007": {
    "id": "OH-CW-2016-007",
    "name": "伊藤翔太",
    "nameInitial": "伊",
    "position": "主任介護福祉士",
    "department": "5階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CW-2016-007",
    "joinDate": "2016年4月1日",
    "tenure": "9年3ヶ月",
    "age": 29,
    "birthDate": "1996年4月2日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月3日",
    "healthStatus": "良好",
    "healthScore": 81,
    "stressIndex": 42,
    "engagement": 88,
    "overtime": 13,
    "paidLeaveRate": 74,
    "avatar": "bg-gradient-to-r from-green-500 to-green-600",
    "email": "伊藤.翔太@obara-hp.jp",
    "phone": "080-4702-1344",
    "emergencyContact": "090-8743-3082（兄弟姉妹）",
    "address": "東京都○○区△△1-4-5",
    "evaluationData": {
      "rating": 4,
      "performance": 72,
      "skill": 85,
      "teamwork": 78,
      "growth": 4.1
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.8,
        "skills": 4,
        "teamwork": 4.2,
        "growth": 3.5,
        "evaluator": "5階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4,
        "skills": 4.5,
        "teamwork": 3.8,
        "growth": 4.5,
        "evaluator": "5階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 67
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 92
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 93
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 75
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年1月",
        "evaluation": "良好",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年1月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年4月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2016年4月",
        "department": "5階病棟",
        "position": "介護福祉士",
        "reason": "新規配属"
      },
      {
        "date": "2021年4月",
        "department": "5階病棟",
        "position": "主任介護福祉士",
        "reason": "昇進"
      }
    ]
  },
  "OH-CW-2014-008": {
    "id": "OH-CW-2014-008",
    "name": "佐藤由美",
    "nameInitial": "佐",
    "position": "主任介護福祉士",
    "department": "4階病棟",
    "facility": "小原病院",
    "employeeId": "OH-CW-2014-008",
    "joinDate": "2014年4月1日",
    "tenure": "11年3ヶ月",
    "age": 42,
    "birthDate": "1982年10月22日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月18日",
    "healthStatus": "要注意",
    "healthScore": 87,
    "stressIndex": 51,
    "engagement": 82,
    "overtime": 22,
    "paidLeaveRate": 71,
    "avatar": "bg-gradient-to-r from-indigo-500 to-indigo-600",
    "email": "佐藤.由美@obara-hp.jp",
    "phone": "080-2420-3099",
    "emergencyContact": "090-5741-7469（親）",
    "address": "東京都○○区△△4-15-13",
    "evaluationData": {
      "rating": 4.5,
      "performance": 83,
      "skill": 91,
      "teamwork": 77,
      "growth": 4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.4,
        "skills": 3.9,
        "teamwork": 4.4,
        "growth": 3.7,
        "evaluator": "4階病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4,
        "skills": 4.7,
        "teamwork": 3.8,
        "growth": 4.3,
        "evaluator": "4階病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 83
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 87
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 61
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 61
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年5月",
        "evaluation": "優秀",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年2月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年7月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2014年4月",
        "department": "4階病棟",
        "position": "介護福祉士",
        "reason": "新規配属"
      },
      {
        "date": "2019年4月",
        "department": "4階病棟",
        "position": "主任介護福祉士",
        "reason": "昇進"
      }
    ]
  },
  "OH-PT-2017-001": {
    "id": "OH-PT-2017-001",
    "name": "小林優子",
    "nameInitial": "小",
    "position": "主任理学療法士",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-PT-2017-001",
    "joinDate": "2017年4月1日",
    "tenure": "8年3ヶ月",
    "age": 35,
    "birthDate": "1990年2月22日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月16日",
    "healthStatus": "良好",
    "healthScore": 71,
    "stressIndex": 44,
    "engagement": 77,
    "overtime": 30,
    "paidLeaveRate": 64,
    "avatar": "bg-gradient-to-r from-purple-500 to-pink-600",
    "email": "小林.優子@obara-hp.jp",
    "phone": "080-3890-1142",
    "emergencyContact": "090-4633-4074（兄弟姉妹）",
    "address": "東京都○○区△△1-20-6",
    "evaluationData": {
      "rating": 4,
      "performance": 76,
      "skill": 70,
      "teamwork": 86,
      "growth": 3.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.5,
        "skills": 4.4,
        "teamwork": 4.5,
        "growth": 4.4,
        "evaluator": "リハビリテーション科 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.5,
        "skills": 3.4,
        "teamwork": 4.3,
        "growth": 3.5,
        "evaluator": "リハビリテーション科 部長"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 78
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 95
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 60
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 75
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年8月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年9月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年12月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2017年4月",
        "department": "リハビリテーション科",
        "position": "理学療法士",
        "reason": "新規配属"
      },
      {
        "date": "2022年4月",
        "department": "リハビリテーション科",
        "position": "主任理学療法士",
        "reason": "昇進"
      }
    ]
  },
  "OH-PT-2003-002": {
    "id": "OH-PT-2003-002",
    "name": "田中愛子",
    "nameInitial": "田",
    "position": "リハビリ科長",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-PT-2003-002",
    "joinDate": "2003年4月1日",
    "tenure": "22年3ヶ月",
    "age": 69,
    "birthDate": "1955年12月14日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月20日",
    "healthStatus": "良好",
    "healthScore": 79,
    "stressIndex": 27,
    "engagement": 92,
    "overtime": 21,
    "paidLeaveRate": 59,
    "avatar": "bg-gradient-to-r from-indigo-500 to-indigo-600",
    "email": "田中.愛子@obara-hp.jp",
    "phone": "080-6567-9727",
    "emergencyContact": "090-2658-6334（配偶者）",
    "address": "東京都○○区△△3-20-3",
    "evaluationData": {
      "rating": 4.7,
      "performance": 86,
      "skill": 88,
      "teamwork": 85,
      "growth": 2.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.7,
        "skills": 3.9,
        "teamwork": 4.6,
        "growth": 2.9,
        "evaluator": "リハビリテーション科 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.2,
        "skills": 4,
        "teamwork": 4,
        "growth": 3.5,
        "evaluator": "リハビリテーション科 部長"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 81
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 93
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 78
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 75
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年10月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年12月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年2月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2003年4月",
        "department": "リハビリテーション科",
        "position": "理学療法士",
        "reason": "新規配属"
      },
      {
        "date": "2008年4月",
        "department": "リハビリテーション科",
        "position": "主任理学療法士",
        "reason": "昇進"
      },
      {
        "date": "2013年4月",
        "department": "リハビリテーション科",
        "position": "リハビリ科長",
        "reason": "昇進"
      }
    ]
  },
  "OH-PT-2016-003": {
    "id": "OH-PT-2016-003",
    "name": "加藤由美",
    "nameInitial": "加",
    "position": "主任理学療法士",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-PT-2016-003",
    "joinDate": "2016年4月1日",
    "tenure": "9年3ヶ月",
    "age": 37,
    "birthDate": "1988年6月14日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月28日",
    "healthStatus": "要注意",
    "healthScore": 88,
    "stressIndex": 35,
    "engagement": 77,
    "overtime": 16,
    "paidLeaveRate": 75,
    "avatar": "bg-gradient-to-r from-pink-500 to-blue-600",
    "email": "加藤.由美@obara-hp.jp",
    "phone": "080-8921-5252",
    "emergencyContact": "090-3769-2671（配偶者）",
    "address": "東京都○○区△△5-7-5",
    "evaluationData": {
      "rating": 4.4,
      "performance": 71,
      "skill": 66,
      "teamwork": 77,
      "growth": 3.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.3,
        "skills": 4.1,
        "teamwork": 4.2,
        "growth": 4,
        "evaluator": "リハビリテーション科 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 3.9,
        "skills": 3.5,
        "teamwork": 4.6,
        "growth": 4.5,
        "evaluator": "リハビリテーション科 部長"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 95
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 67
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 82
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 63
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年5月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年9月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年2月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2016年4月",
        "department": "リハビリテーション科",
        "position": "理学療法士",
        "reason": "新規配属"
      },
      {
        "date": "2021年4月",
        "department": "リハビリテーション科",
        "position": "主任理学療法士",
        "reason": "昇進"
      }
    ]
  },
  "OH-PT-2005-004": {
    "id": "OH-PT-2005-004",
    "name": "伊藤陽太",
    "nameInitial": "伊",
    "position": "リハビリ科長",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-PT-2005-004",
    "joinDate": "2005年4月1日",
    "tenure": "20年3ヶ月",
    "age": 63,
    "birthDate": "1961年11月28日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月12日",
    "healthStatus": "良好",
    "healthScore": 94,
    "stressIndex": 38,
    "engagement": 91,
    "overtime": 21,
    "paidLeaveRate": 43,
    "avatar": "bg-gradient-to-r from-purple-500 to-pink-600",
    "email": "伊藤.陽太@obara-hp.jp",
    "phone": "080-9281-2379",
    "emergencyContact": "090-7817-6003（兄弟姉妹）",
    "address": "東京都○○区△△7-14-1",
    "evaluationData": {
      "rating": 4.3,
      "performance": 93,
      "skill": 70,
      "teamwork": 95,
      "growth": 3.1
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.2,
        "skills": 3.9,
        "teamwork": 4,
        "growth": 3.1,
        "evaluator": "リハビリテーション科 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.9,
        "skills": 3.5,
        "teamwork": 4.8,
        "growth": 2.9,
        "evaluator": "リハビリテーション科 部長"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 88
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 87
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 61
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 88
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年6月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年12月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年7月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2005年4月",
        "department": "リハビリテーション科",
        "position": "理学療法士",
        "reason": "新規配属"
      },
      {
        "date": "2010年4月",
        "department": "リハビリテーション科",
        "position": "主任理学療法士",
        "reason": "昇進"
      },
      {
        "date": "2015年4月",
        "department": "リハビリテーション科",
        "position": "リハビリ科長",
        "reason": "昇進"
      }
    ]
  },
  "OH-PT-2009-005": {
    "id": "OH-PT-2009-005",
    "name": "田中太郎",
    "nameInitial": "田",
    "position": "リハビリ科長",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-PT-2009-005",
    "joinDate": "2009年4月1日",
    "tenure": "16年3ヶ月",
    "age": 63,
    "birthDate": "1962年4月15日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月24日",
    "healthStatus": "良好",
    "healthScore": 89,
    "stressIndex": 43,
    "engagement": 88,
    "overtime": 10,
    "paidLeaveRate": 54,
    "avatar": "bg-gradient-to-r from-pink-500 to-green-600",
    "email": "田中.太郎@obara-hp.jp",
    "phone": "080-6431-2655",
    "emergencyContact": "090-4761-6274（親）",
    "address": "東京都○○区△△2-18-12",
    "evaluationData": {
      "rating": 4.7,
      "performance": 79,
      "skill": 84,
      "teamwork": 82,
      "growth": 3.4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.7,
        "skills": 4.5,
        "teamwork": 3.9,
        "growth": 2.6,
        "evaluator": "リハビリテーション科 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.9,
        "skills": 3.6,
        "teamwork": 4.1,
        "growth": 2.9,
        "evaluator": "リハビリテーション科 部長"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 79
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 91
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 78
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 68
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年5月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年2月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年5月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2009年4月",
        "department": "リハビリテーション科",
        "position": "理学療法士",
        "reason": "新規配属"
      },
      {
        "date": "2014年4月",
        "department": "リハビリテーション科",
        "position": "主任理学療法士",
        "reason": "昇進"
      },
      {
        "date": "2019年4月",
        "department": "リハビリテーション科",
        "position": "リハビリ科長",
        "reason": "昇進"
      }
    ]
  },
  "OH-PT-2012-006": {
    "id": "OH-PT-2012-006",
    "name": "渡辺美咲",
    "nameInitial": "渡",
    "position": "リハビリ科長",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-PT-2012-006",
    "joinDate": "2012年4月1日",
    "tenure": "13年3ヶ月",
    "age": 53,
    "birthDate": "1972年3月11日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月4日",
    "healthStatus": "良好",
    "healthScore": 95,
    "stressIndex": 36,
    "engagement": 84,
    "overtime": 15,
    "paidLeaveRate": 41,
    "avatar": "bg-gradient-to-r from-blue-500 to-green-600",
    "email": "渡辺.美咲@obara-hp.jp",
    "phone": "080-5156-5782",
    "emergencyContact": "090-1942-5763（親）",
    "address": "東京都○○区△△3-18-7",
    "evaluationData": {
      "rating": 4.1,
      "performance": 82,
      "skill": 91,
      "teamwork": 79,
      "growth": 3.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.9,
        "skills": 4.3,
        "teamwork": 4,
        "growth": 3.1,
        "evaluator": "リハビリテーション科 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.8,
        "skills": 4.4,
        "teamwork": 4,
        "growth": 3.2,
        "evaluator": "リハビリテーション科 部長"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 64
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 73
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 66
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 61
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年2月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年4月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年8月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2012年4月",
        "department": "リハビリテーション科",
        "position": "理学療法士",
        "reason": "新規配属"
      },
      {
        "date": "2017年4月",
        "department": "リハビリテーション科",
        "position": "主任理学療法士",
        "reason": "昇進"
      },
      {
        "date": "2022年4月",
        "department": "リハビリテーション科",
        "position": "リハビリ科長",
        "reason": "昇進"
      }
    ]
  },
  "OH-PT-2016-007": {
    "id": "OH-PT-2016-007",
    "name": "中村一郎",
    "nameInitial": "中",
    "position": "主任理学療法士",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-PT-2016-007",
    "joinDate": "2016年4月1日",
    "tenure": "9年3ヶ月",
    "age": 44,
    "birthDate": "1980年11月5日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月6日",
    "healthStatus": "良好",
    "healthScore": 81,
    "stressIndex": 42,
    "engagement": 94,
    "overtime": 31,
    "paidLeaveRate": 58,
    "avatar": "bg-gradient-to-r from-blue-500 to-pink-600",
    "email": "中村.一郎@obara-hp.jp",
    "phone": "080-6605-5392",
    "emergencyContact": "090-2894-2035（兄弟姉妹）",
    "address": "東京都○○区△△7-13-5",
    "evaluationData": {
      "rating": 4.9,
      "performance": 82,
      "skill": 71,
      "teamwork": 92,
      "growth": 3.7
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.8,
        "skills": 4.5,
        "teamwork": 4.3,
        "growth": 3.6,
        "evaluator": "リハビリテーション科 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.4,
        "skills": 4.1,
        "teamwork": 3.7,
        "growth": 3.2,
        "evaluator": "リハビリテーション科 部長"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 91
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 64
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 68
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 67
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年6月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年2月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年4月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2016年4月",
        "department": "リハビリテーション科",
        "position": "理学療法士",
        "reason": "新規配属"
      },
      {
        "date": "2021年4月",
        "department": "リハビリテーション科",
        "position": "主任理学療法士",
        "reason": "昇進"
      }
    ]
  },
  "OH-PT-2022-008": {
    "id": "OH-PT-2022-008",
    "name": "佐藤優子",
    "nameInitial": "佐",
    "position": "理学療法士",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-PT-2022-008",
    "joinDate": "2022年4月1日",
    "tenure": "3年3ヶ月",
    "age": 35,
    "birthDate": "1989年11月23日",
    "evaluation": "C",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月21日",
    "healthStatus": "良好",
    "healthScore": 76,
    "stressIndex": 41,
    "engagement": 82,
    "overtime": 12,
    "paidLeaveRate": 53,
    "avatar": "bg-gradient-to-r from-green-500 to-pink-600",
    "email": "佐藤.優子@obara-hp.jp",
    "phone": "080-3075-9286",
    "emergencyContact": "090-2599-9204（親）",
    "address": "東京都○○区△△8-8-2",
    "evaluationData": {
      "rating": 4,
      "performance": 82,
      "skill": 79,
      "teamwork": 77,
      "growth": 3.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "C",
        "performance": 4.3,
        "skills": 4,
        "teamwork": 4.9,
        "growth": 3.9,
        "evaluator": "リハビリテーション科 主任"
      },
      {
        "period": "2024年上期",
        "overall": "C",
        "performance": 4.6,
        "skills": 3.8,
        "teamwork": 4.6,
        "growth": 3.8,
        "evaluator": "リハビリテーション科 主任"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 67
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 63
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 70
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 78
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年5月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年1月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年7月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2022年4月",
        "department": "リハビリテーション科",
        "position": "理学療法士",
        "reason": "新規配属"
      }
    ]
  },
  "OH-PT-2022-009": {
    "id": "OH-PT-2022-009",
    "name": "佐藤健司",
    "nameInitial": "佐",
    "position": "理学療法士",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-PT-2022-009",
    "joinDate": "2022年4月1日",
    "tenure": "3年3ヶ月",
    "age": 22,
    "birthDate": "2002年9月28日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月24日",
    "healthStatus": "良好",
    "healthScore": 81,
    "stressIndex": 63,
    "engagement": 71,
    "overtime": 5,
    "paidLeaveRate": 70,
    "avatar": "bg-gradient-to-r from-purple-500 to-purple-600",
    "email": "佐藤.健司@obara-hp.jp",
    "phone": "080-6492-2953",
    "emergencyContact": "090-3473-9986（親）",
    "address": "東京都○○区△△4-6-14",
    "evaluationData": {
      "rating": 3.9,
      "performance": 77,
      "skill": 87,
      "teamwork": 77,
      "growth": 4.9
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4,
        "skills": 4.7,
        "teamwork": 4.6,
        "growth": 4.3,
        "evaluator": "リハビリテーション科 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 3.8,
        "skills": 4.5,
        "teamwork": 4.7,
        "growth": 4.6,
        "evaluator": "リハビリテーション科 主任"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 87
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 78
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 63
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 91
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年7月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年4月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年10月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2022年4月",
        "department": "リハビリテーション科",
        "position": "理学療法士",
        "reason": "新規配属"
      }
    ]
  },
  "OH-PT-2022-010": {
    "id": "OH-PT-2022-010",
    "name": "伊藤一郎",
    "nameInitial": "伊",
    "position": "理学療法士",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-PT-2022-010",
    "joinDate": "2022年4月1日",
    "tenure": "3年3ヶ月",
    "age": 36,
    "birthDate": "1989年6月20日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月1日",
    "healthStatus": "良好",
    "healthScore": 74,
    "stressIndex": 47,
    "engagement": 76,
    "overtime": 13,
    "paidLeaveRate": 67,
    "avatar": "bg-gradient-to-r from-blue-500 to-green-600",
    "email": "伊藤.一郎@obara-hp.jp",
    "phone": "080-3094-4120",
    "emergencyContact": "090-4077-5158（兄弟姉妹）",
    "address": "東京都○○区△△5-4-6",
    "evaluationData": {
      "rating": 3.9,
      "performance": 77,
      "skill": 70,
      "teamwork": 77,
      "growth": 4.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4,
        "skills": 3.9,
        "teamwork": 4.4,
        "growth": 4.2,
        "evaluator": "リハビリテーション科 主任"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.3,
        "skills": 3.9,
        "teamwork": 4.7,
        "growth": 4.4,
        "evaluator": "リハビリテーション科 主任"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 79
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 86
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 82
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 66
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年7月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年4月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年8月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2022年4月",
        "department": "リハビリテーション科",
        "position": "理学療法士",
        "reason": "新規配属"
      }
    ]
  },
  "OH-PT-2022-011": {
    "id": "OH-PT-2022-011",
    "name": "山本翔太",
    "nameInitial": "山",
    "position": "理学療法士",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-PT-2022-011",
    "joinDate": "2022年4月1日",
    "tenure": "3年3ヶ月",
    "age": 27,
    "birthDate": "1998年7月5日",
    "evaluation": "S",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月3日",
    "healthStatus": "良好",
    "healthScore": 82,
    "stressIndex": 38,
    "engagement": 90,
    "overtime": 15,
    "paidLeaveRate": 60,
    "avatar": "bg-gradient-to-r from-indigo-500 to-green-600",
    "email": "山本.翔太@obara-hp.jp",
    "phone": "080-4590-3632",
    "emergencyContact": "090-2867-4114（兄弟姉妹）",
    "address": "東京都○○区△△8-11-13",
    "evaluationData": {
      "rating": 4.4,
      "performance": 93,
      "skill": 81,
      "teamwork": 71,
      "growth": 4.5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "S",
        "performance": 4.8,
        "skills": 3.5,
        "teamwork": 4.4,
        "growth": 4.1,
        "evaluator": "リハビリテーション科 主任"
      },
      {
        "period": "2024年上期",
        "overall": "S",
        "performance": 4.6,
        "skills": 4.6,
        "teamwork": 4,
        "growth": 4.1,
        "evaluator": "リハビリテーション科 主任"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 78
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 66
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 80
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 62
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年8月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年12月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年1月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2022年4月",
        "department": "リハビリテーション科",
        "position": "理学療法士",
        "reason": "新規配属"
      }
    ]
  },
  "OH-PT-2013-012": {
    "id": "OH-PT-2013-012",
    "name": "伊藤健太",
    "nameInitial": "伊",
    "position": "リハビリ科長",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-PT-2013-012",
    "joinDate": "2013年4月1日",
    "tenure": "12年3ヶ月",
    "age": 34,
    "birthDate": "1991年2月26日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月24日",
    "healthStatus": "良好",
    "healthScore": 83,
    "stressIndex": 34,
    "engagement": 89,
    "overtime": 12,
    "paidLeaveRate": 66,
    "avatar": "bg-gradient-to-r from-blue-500 to-indigo-600",
    "email": "伊藤.健太@obara-hp.jp",
    "phone": "080-6895-7790",
    "emergencyContact": "090-6194-9201（兄弟姉妹）",
    "address": "東京都○○区△△3-3-7",
    "evaluationData": {
      "rating": 4.2,
      "performance": 86,
      "skill": 90,
      "teamwork": 96,
      "growth": 4.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.7,
        "skills": 4,
        "teamwork": 4.7,
        "growth": 4.3,
        "evaluator": "リハビリテーション科 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.4,
        "skills": 4.6,
        "teamwork": 4.6,
        "growth": 4.1,
        "evaluator": "リハビリテーション科 部長"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 64
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 87
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 95
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 92
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年4月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年5月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年1月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2013年4月",
        "department": "リハビリテーション科",
        "position": "理学療法士",
        "reason": "新規配属"
      },
      {
        "date": "2018年4月",
        "department": "リハビリテーション科",
        "position": "主任理学療法士",
        "reason": "昇進"
      },
      {
        "date": "2023年4月",
        "department": "リハビリテーション科",
        "position": "リハビリ科長",
        "reason": "昇進"
      }
    ]
  },
  "OH-OT-2002-001": {
    "id": "OH-OT-2002-001",
    "name": "佐藤雄一",
    "nameInitial": "佐",
    "position": "主任作業療法士",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-OT-2002-001",
    "joinDate": "2002年4月1日",
    "tenure": "23年3ヶ月",
    "age": 63,
    "birthDate": "1961年11月15日",
    "evaluation": "C",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月28日",
    "healthStatus": "良好",
    "healthScore": 85,
    "stressIndex": 44,
    "engagement": 91,
    "overtime": 10,
    "paidLeaveRate": 37,
    "avatar": "bg-gradient-to-r from-indigo-500 to-green-600",
    "email": "佐藤.雄一@obara-hp.jp",
    "phone": "080-5694-8044",
    "emergencyContact": "090-7093-2792（配偶者）",
    "address": "東京都○○区△△4-5-14",
    "evaluationData": {
      "rating": 4.2,
      "performance": 78,
      "skill": 86,
      "teamwork": 97,
      "growth": 2.7
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "C",
        "performance": 4.5,
        "skills": 3.9,
        "teamwork": 4.7,
        "growth": 3.4,
        "evaluator": "リハビリテーション科 部長"
      },
      {
        "period": "2024年上期",
        "overall": "C",
        "performance": 4.6,
        "skills": 3.8,
        "teamwork": 3.7,
        "growth": 3.2,
        "evaluator": "リハビリテーション科 部長"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 63
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 65
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 83
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 66
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年2月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年4月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年11月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2002年4月",
        "department": "リハビリテーション科",
        "position": "作業療法士",
        "reason": "新規配属"
      },
      {
        "date": "2007年4月",
        "department": "リハビリテーション科",
        "position": "主任作業療法士",
        "reason": "昇進"
      }
    ]
  },
  "OH-OT-2003-002": {
    "id": "OH-OT-2003-002",
    "name": "伊藤健司",
    "nameInitial": "伊",
    "position": "主任作業療法士",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-OT-2003-002",
    "joinDate": "2003年4月1日",
    "tenure": "22年3ヶ月",
    "age": 64,
    "birthDate": "1961年3月5日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月2日",
    "healthStatus": "良好",
    "healthScore": 77,
    "stressIndex": 41,
    "engagement": 90,
    "overtime": 20,
    "paidLeaveRate": 49,
    "avatar": "bg-gradient-to-r from-indigo-500 to-blue-600",
    "email": "伊藤.健司@obara-hp.jp",
    "phone": "080-7054-3725",
    "emergencyContact": "090-9575-2593（親）",
    "address": "東京都○○区△△4-18-13",
    "evaluationData": {
      "rating": 4.5,
      "performance": 78,
      "skill": 68,
      "teamwork": 70,
      "growth": 3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.5,
        "skills": 3.9,
        "teamwork": 4.1,
        "growth": 3,
        "evaluator": "リハビリテーション科 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.3,
        "skills": 4.6,
        "teamwork": 4.1,
        "growth": 2.6,
        "evaluator": "リハビリテーション科 部長"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 76
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 69
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 95
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 80
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年4月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年12月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年7月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2003年4月",
        "department": "リハビリテーション科",
        "position": "作業療法士",
        "reason": "新規配属"
      },
      {
        "date": "2008年4月",
        "department": "リハビリテーション科",
        "position": "主任作業療法士",
        "reason": "昇進"
      }
    ]
  },
  "OH-OT-2013-003": {
    "id": "OH-OT-2013-003",
    "name": "山本明日香",
    "nameInitial": "山",
    "position": "主任作業療法士",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-OT-2013-003",
    "joinDate": "2013年4月1日",
    "tenure": "12年3ヶ月",
    "age": 51,
    "birthDate": "1973年10月26日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月20日",
    "healthStatus": "要注意",
    "healthScore": 83,
    "stressIndex": 32,
    "engagement": 88,
    "overtime": 16,
    "paidLeaveRate": 54,
    "avatar": "bg-gradient-to-r from-purple-500 to-indigo-600",
    "email": "山本.明日香@obara-hp.jp",
    "phone": "080-6612-2153",
    "emergencyContact": "090-6581-9004（兄弟姉妹）",
    "address": "東京都○○区△△3-19-11",
    "evaluationData": {
      "rating": 4.1,
      "performance": 74,
      "skill": 92,
      "teamwork": 85,
      "growth": 3.3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.4,
        "skills": 4.5,
        "teamwork": 4.2,
        "growth": 3.3,
        "evaluator": "リハビリテーション科 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.5,
        "skills": 3.8,
        "teamwork": 4.1,
        "growth": 3.9,
        "evaluator": "リハビリテーション科 部長"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 95
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 92
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 60
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 82
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年5月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年10月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年12月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2013年4月",
        "department": "リハビリテーション科",
        "position": "作業療法士",
        "reason": "新規配属"
      },
      {
        "date": "2018年4月",
        "department": "リハビリテーション科",
        "position": "主任作業療法士",
        "reason": "昇進"
      }
    ]
  },
  "OH-OT-2007-004": {
    "id": "OH-OT-2007-004",
    "name": "伊藤翔太",
    "nameInitial": "伊",
    "position": "主任作業療法士",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-OT-2007-004",
    "joinDate": "2007年4月1日",
    "tenure": "18年3ヶ月",
    "age": 61,
    "birthDate": "1963年11月18日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月5日",
    "healthStatus": "良好",
    "healthScore": 94,
    "stressIndex": 33,
    "engagement": 93,
    "overtime": 17,
    "paidLeaveRate": 54,
    "avatar": "bg-gradient-to-r from-purple-500 to-green-600",
    "email": "伊藤.翔太@obara-hp.jp",
    "phone": "080-8374-7100",
    "emergencyContact": "090-7786-8562（配偶者）",
    "address": "東京都○○区△△5-19-10",
    "evaluationData": {
      "rating": 4.8,
      "performance": 93,
      "skill": 90,
      "teamwork": 71,
      "growth": 2.7
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.5,
        "skills": 4.2,
        "teamwork": 4.8,
        "growth": 3.4,
        "evaluator": "リハビリテーション科 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.3,
        "skills": 3.9,
        "teamwork": 4.3,
        "growth": 2.8,
        "evaluator": "リハビリテーション科 部長"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 73
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 81
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 93
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 75
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年5月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年6月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年5月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2007年4月",
        "department": "リハビリテーション科",
        "position": "作業療法士",
        "reason": "新規配属"
      },
      {
        "date": "2012年4月",
        "department": "リハビリテーション科",
        "position": "主任作業療法士",
        "reason": "昇進"
      }
    ]
  },
  "OH-OT-2010-005": {
    "id": "OH-OT-2010-005",
    "name": "加藤愛子",
    "nameInitial": "加",
    "position": "主任作業療法士",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-OT-2010-005",
    "joinDate": "2010年4月1日",
    "tenure": "15年3ヶ月",
    "age": 55,
    "birthDate": "1970年4月17日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月28日",
    "healthStatus": "良好",
    "healthScore": 90,
    "stressIndex": 38,
    "engagement": 95,
    "overtime": 33,
    "paidLeaveRate": 44,
    "avatar": "bg-gradient-to-r from-blue-500 to-indigo-600",
    "email": "加藤.愛子@obara-hp.jp",
    "phone": "080-5125-3721",
    "emergencyContact": "090-3008-5852（配偶者）",
    "address": "東京都○○区△△7-20-4",
    "evaluationData": {
      "rating": 4.6,
      "performance": 92,
      "skill": 77,
      "teamwork": 82,
      "growth": 3.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.4,
        "skills": 4.7,
        "teamwork": 4.7,
        "growth": 3.8,
        "evaluator": "リハビリテーション科 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.7,
        "skills": 4.5,
        "teamwork": 3.9,
        "growth": 4,
        "evaluator": "リハビリテーション科 部長"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 87
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 88
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 83
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 61
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年8月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年2月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年1月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2010年4月",
        "department": "リハビリテーション科",
        "position": "作業療法士",
        "reason": "新規配属"
      },
      {
        "date": "2015年4月",
        "department": "リハビリテーション科",
        "position": "主任作業療法士",
        "reason": "昇進"
      }
    ]
  },
  "OH-OT-2006-006": {
    "id": "OH-OT-2006-006",
    "name": "加藤健司",
    "nameInitial": "加",
    "position": "主任作業療法士",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-OT-2006-006",
    "joinDate": "2006年4月1日",
    "tenure": "19年3ヶ月",
    "age": 62,
    "birthDate": "1963年6月7日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月20日",
    "healthStatus": "良好",
    "healthScore": 75,
    "stressIndex": 36,
    "engagement": 95,
    "overtime": 18,
    "paidLeaveRate": 40,
    "avatar": "bg-gradient-to-r from-indigo-500 to-purple-600",
    "email": "加藤.健司@obara-hp.jp",
    "phone": "080-8037-3025",
    "emergencyContact": "090-2537-8418（配偶者）",
    "address": "東京都○○区△△2-6-4",
    "evaluationData": {
      "rating": 4.8,
      "performance": 73,
      "skill": 65,
      "teamwork": 84,
      "growth": 3.1
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.6,
        "skills": 4.5,
        "teamwork": 4.8,
        "growth": 2.5,
        "evaluator": "リハビリテーション科 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.6,
        "skills": 4.3,
        "teamwork": 3.9,
        "growth": 3.1,
        "evaluator": "リハビリテーション科 部長"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 66
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 92
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 79
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 70
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年9月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年5月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年9月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2006年4月",
        "department": "リハビリテーション科",
        "position": "作業療法士",
        "reason": "新規配属"
      },
      {
        "date": "2011年4月",
        "department": "リハビリテーション科",
        "position": "主任作業療法士",
        "reason": "昇進"
      }
    ]
  },
  "OH-OT-2023-007": {
    "id": "OH-OT-2023-007",
    "name": "山本由美",
    "nameInitial": "山",
    "position": "作業療法士",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-OT-2023-007",
    "joinDate": "2023年4月1日",
    "tenure": "2年3ヶ月",
    "age": 25,
    "birthDate": "2000年1月8日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月9日",
    "healthStatus": "良好",
    "healthScore": 88,
    "stressIndex": 62,
    "engagement": 81,
    "overtime": 7,
    "paidLeaveRate": 73,
    "avatar": "bg-gradient-to-r from-purple-500 to-blue-600",
    "email": "山本.由美@obara-hp.jp",
    "phone": "080-3847-8474",
    "emergencyContact": "090-2460-8049（配偶者）",
    "address": "東京都○○区△△6-6-10",
    "evaluationData": {
      "rating": 3.8,
      "performance": 81,
      "skill": 93,
      "teamwork": 95,
      "growth": 4.3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 3.8,
        "skills": 4.1,
        "teamwork": 4.2,
        "growth": 4.5,
        "evaluator": "リハビリテーション科 主任"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 3.9,
        "skills": 4.3,
        "teamwork": 4,
        "growth": 4.9,
        "evaluator": "リハビリテーション科 主任"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 79
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 64
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 88
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 64
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年3月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年10月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年7月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2023年4月",
        "department": "リハビリテーション科",
        "position": "作業療法士",
        "reason": "新規配属"
      }
    ]
  },
  "OH-OT-2010-008": {
    "id": "OH-OT-2010-008",
    "name": "渡辺一郎",
    "nameInitial": "渡",
    "position": "主任作業療法士",
    "department": "リハビリテーション科",
    "facility": "小原病院",
    "employeeId": "OH-OT-2010-008",
    "joinDate": "2010年4月1日",
    "tenure": "15年3ヶ月",
    "age": 54,
    "birthDate": "1970年8月11日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月20日",
    "healthStatus": "要注意",
    "healthScore": 86,
    "stressIndex": 27,
    "engagement": 85,
    "overtime": 16,
    "paidLeaveRate": 46,
    "avatar": "bg-gradient-to-r from-green-500 to-blue-600",
    "email": "渡辺.一郎@obara-hp.jp",
    "phone": "080-7684-4939",
    "emergencyContact": "090-4629-4305（兄弟姉妹）",
    "address": "東京都○○区△△1-5-8",
    "evaluationData": {
      "rating": 4.8,
      "performance": 75,
      "skill": 89,
      "teamwork": 90,
      "growth": 3.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.8,
        "skills": 4.4,
        "teamwork": 4.5,
        "growth": 3.9,
        "evaluator": "リハビリテーション科 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.3,
        "skills": 3.6,
        "teamwork": 4.6,
        "growth": 3.5,
        "evaluator": "リハビリテーション科 部長"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 77
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 72
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 95
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 91
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年1月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年9月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年4月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2010年4月",
        "department": "リハビリテーション科",
        "position": "作業療法士",
        "reason": "新規配属"
      },
      {
        "date": "2015年4月",
        "department": "リハビリテーション科",
        "position": "主任作業療法士",
        "reason": "昇進"
      }
    ]
  },
  "TR-NS-2013-001": {
    "id": "TR-NS-2013-001",
    "name": "小林優子",
    "nameInitial": "小",
    "position": "師長",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2013-001",
    "joinDate": "2013年4月1日",
    "tenure": "12年3ヶ月",
    "age": 48,
    "birthDate": "1977年2月5日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月21日",
    "healthStatus": "良好",
    "healthScore": 95,
    "stressIndex": 31,
    "engagement": 92,
    "overtime": 18,
    "paidLeaveRate": 51,
    "avatar": "bg-gradient-to-r from-blue-500 to-indigo-600",
    "email": "小林.優子@tachigami-hp.jp",
    "phone": "080-6914-7950",
    "emergencyContact": "090-5797-8173（兄弟姉妹）",
    "address": "東京都○○区△△4-18-10",
    "evaluationData": {
      "rating": 4.1,
      "performance": 73,
      "skill": 94,
      "teamwork": 94,
      "growth": 3.5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.2,
        "skills": 3.7,
        "teamwork": 4.1,
        "growth": 3.8,
        "evaluator": "第１病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.8,
        "skills": 3.8,
        "teamwork": 4.2,
        "growth": 3.7,
        "evaluator": "第１病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 93
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 89
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 88
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 65
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年6月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年11月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年6月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2013年4月",
        "department": "第１病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2018年4月",
        "department": "第１病棟",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2023年4月",
        "department": "第１病棟",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "TR-NS-2010-002": {
    "id": "TR-NS-2010-002",
    "name": "田中愛子",
    "nameInitial": "田",
    "position": "師長",
    "department": "外来",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2010-002",
    "joinDate": "2010年4月1日",
    "tenure": "15年3ヶ月",
    "age": 55,
    "birthDate": "1969年11月12日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月9日",
    "healthStatus": "要注意",
    "healthScore": 94,
    "stressIndex": 31,
    "engagement": 90,
    "overtime": 20,
    "paidLeaveRate": 58,
    "avatar": "bg-gradient-to-r from-pink-500 to-indigo-600",
    "email": "田中.愛子@tachigami-hp.jp",
    "phone": "080-7053-3031",
    "emergencyContact": "090-5315-2353（配偶者）",
    "address": "東京都○○区△△9-3-3",
    "evaluationData": {
      "rating": 4.8,
      "performance": 84,
      "skill": 71,
      "teamwork": 92,
      "growth": 3.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.2,
        "skills": 4.4,
        "teamwork": 4.1,
        "growth": 3.2,
        "evaluator": "外来 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.2,
        "skills": 3.4,
        "teamwork": 4.3,
        "growth": 3.3,
        "evaluator": "外来 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 74
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 61
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 95
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 66
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年11月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年8月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年11月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2010年4月",
        "department": "外来",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2015年4月",
        "department": "外来",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2020年4月",
        "department": "外来",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "TR-NS-2010-003": {
    "id": "TR-NS-2010-003",
    "name": "渡辺一郎",
    "nameInitial": "渡",
    "position": "師長",
    "department": "外来",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2010-003",
    "joinDate": "2010年4月1日",
    "tenure": "15年3ヶ月",
    "age": 54,
    "birthDate": "1970年8月4日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月12日",
    "healthStatus": "要注意",
    "healthScore": 94,
    "stressIndex": 27,
    "engagement": 87,
    "overtime": 19,
    "paidLeaveRate": 64,
    "avatar": "bg-gradient-to-r from-indigo-500 to-blue-600",
    "email": "渡辺.一郎@tachigami-hp.jp",
    "phone": "080-9777-7979",
    "emergencyContact": "090-5981-4275（配偶者）",
    "address": "東京都○○区△△3-18-6",
    "evaluationData": {
      "rating": 4.3,
      "performance": 93,
      "skill": 77,
      "teamwork": 96,
      "growth": 3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.5,
        "skills": 3.8,
        "teamwork": 4.8,
        "growth": 3.7,
        "evaluator": "外来 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.7,
        "skills": 3.6,
        "teamwork": 4.8,
        "growth": 3.6,
        "evaluator": "外来 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 73
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 65
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 67
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 91
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年1月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年9月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年3月",
        "evaluation": "優秀",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2010年4月",
        "department": "外来",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2015年4月",
        "department": "外来",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2020年4月",
        "department": "外来",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "TR-NS-2020-004": {
    "id": "TR-NS-2020-004",
    "name": "田中麻衣",
    "nameInitial": "田",
    "position": "看護師",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2020-004",
    "joinDate": "2020年4月1日",
    "tenure": "5年3ヶ月",
    "age": 30,
    "birthDate": "1995年6月12日",
    "evaluation": "C",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月18日",
    "healthStatus": "良好",
    "healthScore": 93,
    "stressIndex": 33,
    "engagement": 75,
    "overtime": 12,
    "paidLeaveRate": 72,
    "avatar": "bg-gradient-to-r from-indigo-500 to-pink-600",
    "email": "田中.麻衣@tachigami-hp.jp",
    "phone": "080-2503-9452",
    "emergencyContact": "090-1769-8321（配偶者）",
    "address": "東京都○○区△△8-4-4",
    "evaluationData": {
      "rating": 4.5,
      "performance": 80,
      "skill": 76,
      "teamwork": 73,
      "growth": 3.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "C",
        "performance": 3.9,
        "skills": 3.9,
        "teamwork": 4,
        "growth": 3.6,
        "evaluator": "第１病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "C",
        "performance": 4.2,
        "skills": 4.2,
        "teamwork": 4.5,
        "growth": 4.4,
        "evaluator": "第１病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 95
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 90
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 93
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 80
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年11月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年8月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年12月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2020年4月",
        "department": "第１病棟",
        "position": "看護師",
        "reason": "新規配属"
      }
    ]
  },
  "TR-NS-2011-005": {
    "id": "TR-NS-2011-005",
    "name": "鈴木由美",
    "nameInitial": "鈴",
    "position": "師長",
    "department": "外来",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2011-005",
    "joinDate": "2011年4月1日",
    "tenure": "14年3ヶ月",
    "age": 34,
    "birthDate": "1990年11月5日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月9日",
    "healthStatus": "良好",
    "healthScore": 80,
    "stressIndex": 38,
    "engagement": 87,
    "overtime": 11,
    "paidLeaveRate": 62,
    "avatar": "bg-gradient-to-r from-green-500 to-purple-600",
    "email": "鈴木.由美@tachigami-hp.jp",
    "phone": "080-8828-1207",
    "emergencyContact": "090-3679-1218（配偶者）",
    "address": "東京都○○区△△2-19-6",
    "evaluationData": {
      "rating": 4.8,
      "performance": 87,
      "skill": 93,
      "teamwork": 89,
      "growth": 3.7
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.2,
        "skills": 3.6,
        "teamwork": 4.6,
        "growth": 3.8,
        "evaluator": "外来 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.6,
        "skills": 4.1,
        "teamwork": 4.1,
        "growth": 4.2,
        "evaluator": "外来 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 69
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 71
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 66
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 74
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年7月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年1月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年11月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2011年4月",
        "department": "外来",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2016年4月",
        "department": "外来",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2021年4月",
        "department": "外来",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "TR-NS-2021-006": {
    "id": "TR-NS-2021-006",
    "name": "山本拓海",
    "nameInitial": "山",
    "position": "看護師",
    "department": "外来",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2021-006",
    "joinDate": "2021年4月1日",
    "tenure": "4年3ヶ月",
    "age": 27,
    "birthDate": "1997年10月18日",
    "evaluation": "C",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月16日",
    "healthStatus": "良好",
    "healthScore": 76,
    "stressIndex": 40,
    "engagement": 84,
    "overtime": 27,
    "paidLeaveRate": 67,
    "avatar": "bg-gradient-to-r from-blue-500 to-indigo-600",
    "email": "山本.拓海@tachigami-hp.jp",
    "phone": "080-1350-9706",
    "emergencyContact": "090-9118-8624（親）",
    "address": "東京都○○区△△1-1-4",
    "evaluationData": {
      "rating": 4,
      "performance": 82,
      "skill": 70,
      "teamwork": 93,
      "growth": 3.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "C",
        "performance": 4.5,
        "skills": 4.7,
        "teamwork": 4.7,
        "growth": 4.4,
        "evaluator": "外来 主任"
      },
      {
        "period": "2024年上期",
        "overall": "C",
        "performance": 4.5,
        "skills": 4.7,
        "teamwork": 4.7,
        "growth": 4.2,
        "evaluator": "外来 主任"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 63
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 80
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 70
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 84
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年1月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年2月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年6月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2021年4月",
        "department": "外来",
        "position": "看護師",
        "reason": "新規配属"
      }
    ]
  },
  "TR-NS-2017-007": {
    "id": "TR-NS-2017-007",
    "name": "高橋悠斗",
    "nameInitial": "高",
    "position": "主任看護師",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2017-007",
    "joinDate": "2017年4月1日",
    "tenure": "8年3ヶ月",
    "age": 41,
    "birthDate": "1983年9月17日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月21日",
    "healthStatus": "良好",
    "healthScore": 79,
    "stressIndex": 34,
    "engagement": 90,
    "overtime": 29,
    "paidLeaveRate": 73,
    "avatar": "bg-gradient-to-r from-pink-500 to-pink-600",
    "email": "高橋.悠斗@tachigami-hp.jp",
    "phone": "080-5392-5257",
    "emergencyContact": "090-5349-6261（配偶者）",
    "address": "東京都○○区△△7-9-3",
    "evaluationData": {
      "rating": 4.3,
      "performance": 84,
      "skill": 86,
      "teamwork": 92,
      "growth": 4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.1,
        "skills": 3.9,
        "teamwork": 4.1,
        "growth": 3.9,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.4,
        "skills": 4,
        "teamwork": 4.4,
        "growth": 3.9,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 77
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 83
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 74
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 80
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年10月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年12月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年5月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2017年4月",
        "department": "介護医療院",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2022年4月",
        "department": "介護医療院",
        "position": "主任看護師",
        "reason": "昇進"
      }
    ]
  },
  "TR-NS-2023-008": {
    "id": "TR-NS-2023-008",
    "name": "加藤奈々",
    "nameInitial": "加",
    "position": "看護師",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2023-008",
    "joinDate": "2023年4月1日",
    "tenure": "2年3ヶ月",
    "age": 23,
    "birthDate": "2002年2月1日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月2日",
    "healthStatus": "要注意",
    "healthScore": 94,
    "stressIndex": 40,
    "engagement": 79,
    "overtime": 9,
    "paidLeaveRate": 83,
    "avatar": "bg-gradient-to-r from-pink-500 to-indigo-600",
    "email": "加藤.奈々@tachigami-hp.jp",
    "phone": "080-2767-5998",
    "emergencyContact": "090-9876-2233（配偶者）",
    "address": "東京都○○区△△1-2-15",
    "evaluationData": {
      "rating": 4.1,
      "performance": 91,
      "skill": 65,
      "teamwork": 97,
      "growth": 4.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 3.8,
        "skills": 4.6,
        "teamwork": 4.1,
        "growth": 5,
        "evaluator": "第１病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 3.8,
        "skills": 4.2,
        "teamwork": 3.8,
        "growth": 4.8,
        "evaluator": "第１病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 65
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 86
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 80
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 90
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年6月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年4月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年5月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2023年4月",
        "department": "第１病棟",
        "position": "看護師",
        "reason": "新規配属"
      }
    ]
  },
  "TR-NS-2019-009": {
    "id": "TR-NS-2019-009",
    "name": "山本優子",
    "nameInitial": "山",
    "position": "主任看護師",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2019-009",
    "joinDate": "2019年4月1日",
    "tenure": "6年3ヶ月",
    "age": 27,
    "birthDate": "1998年5月2日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月22日",
    "healthStatus": "要注意",
    "healthScore": 94,
    "stressIndex": 33,
    "engagement": 86,
    "overtime": 13,
    "paidLeaveRate": 51,
    "avatar": "bg-gradient-to-r from-indigo-500 to-pink-600",
    "email": "山本.優子@tachigami-hp.jp",
    "phone": "080-7119-3845",
    "emergencyContact": "090-6030-2653（兄弟姉妹）",
    "address": "東京都○○区△△5-11-5",
    "evaluationData": {
      "rating": 3.9,
      "performance": 80,
      "skill": 83,
      "teamwork": 83,
      "growth": 3.9
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 3.9,
        "skills": 4.4,
        "teamwork": 4.3,
        "growth": 4,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.3,
        "skills": 4.1,
        "teamwork": 4.1,
        "growth": 4.3,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 76
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 65
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 70
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 95
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年10月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年8月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年12月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2019年4月",
        "department": "介護医療院",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2024年4月",
        "department": "介護医療院",
        "position": "主任看護師",
        "reason": "昇進"
      }
    ]
  },
  "TR-NS-2014-010": {
    "id": "TR-NS-2014-010",
    "name": "田中麻衣",
    "nameInitial": "田",
    "position": "師長",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2014-010",
    "joinDate": "2014年4月1日",
    "tenure": "11年3ヶ月",
    "age": 40,
    "birthDate": "1985年4月4日",
    "evaluation": "C",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月22日",
    "healthStatus": "良好",
    "healthScore": 70,
    "stressIndex": 44,
    "engagement": 90,
    "overtime": 20,
    "paidLeaveRate": 65,
    "avatar": "bg-gradient-to-r from-pink-500 to-blue-600",
    "email": "田中.麻衣@tachigami-hp.jp",
    "phone": "080-2170-7608",
    "emergencyContact": "090-1332-5837（配偶者）",
    "address": "東京都○○区△△3-3-2",
    "evaluationData": {
      "rating": 4.6,
      "performance": 91,
      "skill": 82,
      "teamwork": 90,
      "growth": 4.3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "C",
        "performance": 4.5,
        "skills": 3.9,
        "teamwork": 4.1,
        "growth": 4.2,
        "evaluator": "第１病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "C",
        "performance": 4.3,
        "skills": 3.9,
        "teamwork": 4.1,
        "growth": 3.5,
        "evaluator": "第１病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 89
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 93
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 83
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 75
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年7月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年9月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年5月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2014年4月",
        "department": "第１病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2019年4月",
        "department": "第１病棟",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2024年4月",
        "department": "第１病棟",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "TR-NS-2009-011": {
    "id": "TR-NS-2009-011",
    "name": "山本麻衣",
    "nameInitial": "山",
    "position": "看護部長",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2009-011",
    "joinDate": "2009年4月1日",
    "tenure": "16年3ヶ月",
    "age": 56,
    "birthDate": "1968年8月16日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月9日",
    "healthStatus": "良好",
    "healthScore": 82,
    "stressIndex": 43,
    "engagement": 85,
    "overtime": 28,
    "paidLeaveRate": 47,
    "avatar": "bg-gradient-to-r from-blue-500 to-green-600",
    "email": "山本.麻衣@tachigami-hp.jp",
    "phone": "080-5722-9193",
    "emergencyContact": "090-2200-3093（兄弟姉妹）",
    "address": "東京都○○区△△5-14-1",
    "evaluationData": {
      "rating": 4.7,
      "performance": 75,
      "skill": 81,
      "teamwork": 82,
      "growth": 4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.4,
        "skills": 3.7,
        "teamwork": 4.9,
        "growth": 3.9,
        "evaluator": "第１病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.5,
        "skills": 3.4,
        "teamwork": 4.1,
        "growth": 3.3,
        "evaluator": "第１病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 92
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 76
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 65
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 69
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年9月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年8月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年6月",
        "evaluation": "優秀",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2009年4月",
        "department": "第１病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2014年4月",
        "department": "第１病棟",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2019年4月",
        "department": "第１病棟",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "TR-NS-2015-012": {
    "id": "TR-NS-2015-012",
    "name": "渡辺由美",
    "nameInitial": "渡",
    "position": "主任看護師",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2015-012",
    "joinDate": "2015年4月1日",
    "tenure": "10年3ヶ月",
    "age": 40,
    "birthDate": "1985年4月15日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月15日",
    "healthStatus": "良好",
    "healthScore": 95,
    "stressIndex": 53,
    "engagement": 85,
    "overtime": 24,
    "paidLeaveRate": 74,
    "avatar": "bg-gradient-to-r from-blue-500 to-indigo-600",
    "email": "渡辺.由美@tachigami-hp.jp",
    "phone": "080-1903-2425",
    "emergencyContact": "090-2474-3139（兄弟姉妹）",
    "address": "東京都○○区△△5-10-12",
    "evaluationData": {
      "rating": 4.1,
      "performance": 87,
      "skill": 80,
      "teamwork": 86,
      "growth": 3.5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.1,
        "skills": 4,
        "teamwork": 4.2,
        "growth": 4,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.1,
        "skills": 3.7,
        "teamwork": 4.8,
        "growth": 3.9,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 78
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 71
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 71
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 94
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年9月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年1月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年7月",
        "evaluation": "優秀",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2015年4月",
        "department": "介護医療院",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2020年4月",
        "department": "介護医療院",
        "position": "主任看護師",
        "reason": "昇進"
      }
    ]
  },
  "TR-NS-2018-013": {
    "id": "TR-NS-2018-013",
    "name": "小林花子",
    "nameInitial": "小",
    "position": "主任看護師",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2018-013",
    "joinDate": "2018年4月1日",
    "tenure": "7年3ヶ月",
    "age": 26,
    "birthDate": "1998年11月18日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月21日",
    "healthStatus": "良好",
    "healthScore": 78,
    "stressIndex": 46,
    "engagement": 77,
    "overtime": 10,
    "paidLeaveRate": 77,
    "avatar": "bg-gradient-to-r from-blue-500 to-pink-600",
    "email": "小林.花子@tachigami-hp.jp",
    "phone": "080-6911-2088",
    "emergencyContact": "090-9343-3460（親）",
    "address": "東京都○○区△△4-13-1",
    "evaluationData": {
      "rating": 4.1,
      "performance": 90,
      "skill": 85,
      "teamwork": 84,
      "growth": 4.1
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.1,
        "skills": 3.5,
        "teamwork": 4.2,
        "growth": 4,
        "evaluator": "第１病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 3.6,
        "skills": 4.6,
        "teamwork": 4.2,
        "growth": 4.3,
        "evaluator": "第１病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 61
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 79
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 65
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 80
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年12月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年6月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年5月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2018年4月",
        "department": "第１病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2023年4月",
        "department": "第１病棟",
        "position": "主任看護師",
        "reason": "昇進"
      }
    ]
  },
  "TR-NS-2008-014": {
    "id": "TR-NS-2008-014",
    "name": "鈴木明日香",
    "nameInitial": "鈴",
    "position": "看護部長",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2008-014",
    "joinDate": "2008年4月1日",
    "tenure": "17年3ヶ月",
    "age": 59,
    "birthDate": "1966年7月23日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月24日",
    "healthStatus": "良好",
    "healthScore": 78,
    "stressIndex": 27,
    "engagement": 93,
    "overtime": 14,
    "paidLeaveRate": 55,
    "avatar": "bg-gradient-to-r from-indigo-500 to-purple-600",
    "email": "鈴木.明日香@tachigami-hp.jp",
    "phone": "080-6122-3648",
    "emergencyContact": "090-9975-9164（親）",
    "address": "東京都○○区△△3-7-12",
    "evaluationData": {
      "rating": 4.7,
      "performance": 77,
      "skill": 67,
      "teamwork": 72,
      "growth": 2.7
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.3,
        "skills": 3.6,
        "teamwork": 4,
        "growth": 2.8,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.5,
        "skills": 4.6,
        "teamwork": 4,
        "growth": 2.6,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 79
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 93
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 66
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 64
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年3月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年12月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年1月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2008年4月",
        "department": "介護医療院",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2013年4月",
        "department": "介護医療院",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2018年4月",
        "department": "介護医療院",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "TR-NS-2004-015": {
    "id": "TR-NS-2004-015",
    "name": "高橋花子",
    "nameInitial": "高",
    "position": "看護部長",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2004-015",
    "joinDate": "2004年4月1日",
    "tenure": "21年3ヶ月",
    "age": 62,
    "birthDate": "1962年9月26日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月17日",
    "healthStatus": "良好",
    "healthScore": 81,
    "stressIndex": 25,
    "engagement": 86,
    "overtime": 14,
    "paidLeaveRate": 38,
    "avatar": "bg-gradient-to-r from-pink-500 to-indigo-600",
    "email": "高橋.花子@tachigami-hp.jp",
    "phone": "080-3012-1632",
    "emergencyContact": "090-8359-8606（兄弟姉妹）",
    "address": "東京都○○区△△3-20-9",
    "evaluationData": {
      "rating": 4.4,
      "performance": 86,
      "skill": 77,
      "teamwork": 70,
      "growth": 2.5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.8,
        "skills": 4.1,
        "teamwork": 4.7,
        "growth": 3.1,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.8,
        "skills": 4.4,
        "teamwork": 4.6,
        "growth": 3,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 95
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 81
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 88
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 61
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年3月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年1月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年12月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2004年4月",
        "department": "介護医療院",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2009年4月",
        "department": "介護医療院",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2014年4月",
        "department": "介護医療院",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "TR-NS-2023-016": {
    "id": "TR-NS-2023-016",
    "name": "山本千尋",
    "nameInitial": "山",
    "position": "看護師",
    "department": "外来",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2023-016",
    "joinDate": "2023年4月1日",
    "tenure": "2年3ヶ月",
    "age": 26,
    "birthDate": "1999年3月9日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月7日",
    "healthStatus": "良好",
    "healthScore": 90,
    "stressIndex": 42,
    "engagement": 77,
    "overtime": 17,
    "paidLeaveRate": 64,
    "avatar": "bg-gradient-to-r from-blue-500 to-indigo-600",
    "email": "山本.千尋@tachigami-hp.jp",
    "phone": "080-4763-7187",
    "emergencyContact": "090-3540-8743（親）",
    "address": "東京都○○区△△8-18-7",
    "evaluationData": {
      "rating": 3.8,
      "performance": 84,
      "skill": 87,
      "teamwork": 81,
      "growth": 4.4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.4,
        "skills": 4,
        "teamwork": 4.2,
        "growth": 4.4,
        "evaluator": "外来 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 3.5,
        "skills": 3.7,
        "teamwork": 3.8,
        "growth": 4.5,
        "evaluator": "外来 主任"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 70
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 62
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 78
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 81
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年8月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年8月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年6月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2023年4月",
        "department": "外来",
        "position": "看護師",
        "reason": "新規配属"
      }
    ]
  },
  "TR-NS-2021-017": {
    "id": "TR-NS-2021-017",
    "name": "渡辺陽太",
    "nameInitial": "渡",
    "position": "看護師",
    "department": "外来",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2021-017",
    "joinDate": "2021年4月1日",
    "tenure": "4年3ヶ月",
    "age": 25,
    "birthDate": "2000年2月25日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月14日",
    "healthStatus": "良好",
    "healthScore": 85,
    "stressIndex": 56,
    "engagement": 85,
    "overtime": 14,
    "paidLeaveRate": 80,
    "avatar": "bg-gradient-to-r from-pink-500 to-pink-600",
    "email": "渡辺.陽太@tachigami-hp.jp",
    "phone": "080-8547-9608",
    "emergencyContact": "090-6701-8845（配偶者）",
    "address": "東京都○○区△△4-4-14",
    "evaluationData": {
      "rating": 4,
      "performance": 76,
      "skill": 93,
      "teamwork": 71,
      "growth": 4.5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 3.9,
        "skills": 3.6,
        "teamwork": 3.9,
        "growth": 4.3,
        "evaluator": "外来 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 3.8,
        "skills": 3.8,
        "teamwork": 4.4,
        "growth": 4.7,
        "evaluator": "外来 主任"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 62
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 60
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 62
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 89
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年8月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年9月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年2月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2021年4月",
        "department": "外来",
        "position": "看護師",
        "reason": "新規配属"
      }
    ]
  },
  "TR-NS-1999-018": {
    "id": "TR-NS-1999-018",
    "name": "小林愛子",
    "nameInitial": "小",
    "position": "看護部長",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-1999-018",
    "joinDate": "1999年4月1日",
    "tenure": "26年3ヶ月",
    "age": 69,
    "birthDate": "1955年11月5日",
    "evaluation": "C",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月18日",
    "healthStatus": "良好",
    "healthScore": 78,
    "stressIndex": 30,
    "engagement": 93,
    "overtime": 25,
    "paidLeaveRate": 48,
    "avatar": "bg-gradient-to-r from-blue-500 to-pink-600",
    "email": "小林.愛子@tachigami-hp.jp",
    "phone": "080-4325-1719",
    "emergencyContact": "090-5919-2191（配偶者）",
    "address": "東京都○○区△△2-10-7",
    "evaluationData": {
      "rating": 4.8,
      "performance": 70,
      "skill": 83,
      "teamwork": 87,
      "growth": 3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "C",
        "performance": 4.4,
        "skills": 4,
        "teamwork": 3.8,
        "growth": 2.6,
        "evaluator": "第１病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "C",
        "performance": 4.8,
        "skills": 4.4,
        "teamwork": 4.4,
        "growth": 2.8,
        "evaluator": "第１病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 78
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 74
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 74
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 91
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年4月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年11月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年6月",
        "evaluation": "優秀",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "1999年4月",
        "department": "第１病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2004年4月",
        "department": "第１病棟",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2009年4月",
        "department": "第１病棟",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "TR-NS-2010-019": {
    "id": "TR-NS-2010-019",
    "name": "加藤雄一",
    "nameInitial": "加",
    "position": "師長",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2010-019",
    "joinDate": "2010年4月1日",
    "tenure": "15年3ヶ月",
    "age": 56,
    "birthDate": "1969年5月25日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月8日",
    "healthStatus": "良好",
    "healthScore": 77,
    "stressIndex": 43,
    "engagement": 84,
    "overtime": 33,
    "paidLeaveRate": 55,
    "avatar": "bg-gradient-to-r from-pink-500 to-purple-600",
    "email": "加藤.雄一@tachigami-hp.jp",
    "phone": "080-7832-9385",
    "emergencyContact": "090-7740-1945（親）",
    "address": "東京都○○区△△2-3-4",
    "evaluationData": {
      "rating": 4.1,
      "performance": 81,
      "skill": 95,
      "teamwork": 86,
      "growth": 3.5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4,
        "skills": 3.9,
        "teamwork": 4.7,
        "growth": 3.6,
        "evaluator": "第１病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.8,
        "skills": 3.9,
        "teamwork": 3.9,
        "growth": 3.6,
        "evaluator": "第１病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 75
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 61
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 78
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 84
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年8月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年2月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年10月",
        "evaluation": "合格",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2010年4月",
        "department": "第１病棟",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2015年4月",
        "department": "第１病棟",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2020年4月",
        "department": "第１病棟",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "TR-NS-2009-020": {
    "id": "TR-NS-2009-020",
    "name": "加藤明日香",
    "nameInitial": "加",
    "position": "看護部長",
    "department": "外来",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NS-2009-020",
    "joinDate": "2009年4月1日",
    "tenure": "16年3ヶ月",
    "age": 63,
    "birthDate": "1961年8月5日",
    "evaluation": "C",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月2日",
    "healthStatus": "良好",
    "healthScore": 71,
    "stressIndex": 39,
    "engagement": 92,
    "overtime": 25,
    "paidLeaveRate": 46,
    "avatar": "bg-gradient-to-r from-green-500 to-green-600",
    "email": "加藤.明日香@tachigami-hp.jp",
    "phone": "080-6354-9753",
    "emergencyContact": "090-5802-2846（配偶者）",
    "address": "東京都○○区△△3-6-2",
    "evaluationData": {
      "rating": 4.8,
      "performance": 95,
      "skill": 80,
      "teamwork": 74,
      "growth": 3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "C",
        "performance": 4.9,
        "skills": 4,
        "teamwork": 4.7,
        "growth": 2.6,
        "evaluator": "外来 部長"
      },
      {
        "period": "2024年上期",
        "overall": "C",
        "performance": 4.3,
        "skills": 3.8,
        "teamwork": 4.6,
        "growth": 2.6,
        "evaluator": "外来 部長"
      }
    ],
    "skills": [
      {
        "name": "急性期看護",
        "category": "専門スキル",
        "level": 68
      },
      {
        "name": "患者対応",
        "category": "コミュニケーション",
        "level": 87
      },
      {
        "name": "医療機器操作",
        "category": "技術スキル",
        "level": 80
      },
      {
        "name": "チーム医療",
        "category": "チームワーク",
        "level": 90
      }
    ],
    "trainingHistory": [
      {
        "name": "急性期看護研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2024年4月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "感染管理研修",
        "category": "必須研修",
        "hours": 8,
        "date": "2023年6月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "BLS研修",
        "category": "資格研修",
        "hours": 16,
        "date": "2022年10月",
        "evaluation": "良好",
        "certificate": true
      }
    ],
    "assignmentHistory": [
      {
        "date": "2009年4月",
        "department": "外来",
        "position": "看護師",
        "reason": "新規配属"
      },
      {
        "date": "2014年4月",
        "department": "外来",
        "position": "主任看護師",
        "reason": "昇進"
      },
      {
        "date": "2019年4月",
        "department": "外来",
        "position": "師長",
        "reason": "昇進"
      }
    ]
  },
  "TR-NA-2015-001": {
    "id": "TR-NA-2015-001",
    "name": "小林千尋",
    "nameInitial": "小",
    "position": "主任看護補助者",
    "department": "外来",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NA-2015-001",
    "joinDate": "2015年4月1日",
    "tenure": "10年3ヶ月",
    "age": 32,
    "birthDate": "1992年12月27日",
    "evaluation": "S",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月9日",
    "healthStatus": "要注意",
    "healthScore": 84,
    "stressIndex": 36,
    "engagement": 86,
    "overtime": 23,
    "paidLeaveRate": 50,
    "avatar": "bg-gradient-to-r from-pink-500 to-indigo-600",
    "email": "小林.千尋@tachigami-hp.jp",
    "phone": "080-3603-6441",
    "emergencyContact": "090-8210-2785（配偶者）",
    "address": "東京都○○区△△6-18-11",
    "evaluationData": {
      "rating": 3.9,
      "performance": 85,
      "skill": 90,
      "teamwork": 71,
      "growth": 4.1
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "S",
        "performance": 4.1,
        "skills": 4.4,
        "teamwork": 4.6,
        "growth": 4.1,
        "evaluator": "外来 部長"
      },
      {
        "period": "2024年上期",
        "overall": "S",
        "performance": 3.9,
        "skills": 3.7,
        "teamwork": 4.5,
        "growth": 4.2,
        "evaluator": "外来 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 65
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 81
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 65
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 63
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年5月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年10月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年9月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2015年4月",
        "department": "外来",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2020年4月",
        "department": "外来",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "TR-NA-2019-002": {
    "id": "TR-NA-2019-002",
    "name": "小林由美",
    "nameInitial": "小",
    "position": "主任看護補助者",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NA-2019-002",
    "joinDate": "2019年4月1日",
    "tenure": "6年3ヶ月",
    "age": 24,
    "birthDate": "2001年7月26日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月12日",
    "healthStatus": "良好",
    "healthScore": 91,
    "stressIndex": 54,
    "engagement": 82,
    "overtime": 11,
    "paidLeaveRate": 61,
    "avatar": "bg-gradient-to-r from-pink-500 to-green-600",
    "email": "小林.由美@tachigami-hp.jp",
    "phone": "080-3081-1044",
    "emergencyContact": "090-9786-3962（親）",
    "address": "東京都○○区△△5-6-5",
    "evaluationData": {
      "rating": 4.2,
      "performance": 79,
      "skill": 80,
      "teamwork": 76,
      "growth": 4.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 3.6,
        "skills": 4,
        "teamwork": 4.1,
        "growth": 4,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.3,
        "skills": 3.9,
        "teamwork": 4.8,
        "growth": 4.5,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 92
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 93
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 62
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 63
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年7月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年8月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年5月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2019年4月",
        "department": "介護医療院",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2024年4月",
        "department": "介護医療院",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "TR-NA-2015-003": {
    "id": "TR-NA-2015-003",
    "name": "田中陽太",
    "nameInitial": "田",
    "position": "主任看護補助者",
    "department": "外来",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NA-2015-003",
    "joinDate": "2015年4月1日",
    "tenure": "10年3ヶ月",
    "age": 43,
    "birthDate": "1981年10月8日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月18日",
    "healthStatus": "要注意",
    "healthScore": 94,
    "stressIndex": 43,
    "engagement": 80,
    "overtime": 19,
    "paidLeaveRate": 60,
    "avatar": "bg-gradient-to-r from-indigo-500 to-pink-600",
    "email": "田中.陽太@tachigami-hp.jp",
    "phone": "080-9363-9989",
    "emergencyContact": "090-2790-9483（兄弟姉妹）",
    "address": "東京都○○区△△3-11-6",
    "evaluationData": {
      "rating": 4.2,
      "performance": 85,
      "skill": 73,
      "teamwork": 80,
      "growth": 3.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.4,
        "skills": 3.5,
        "teamwork": 4.6,
        "growth": 3.1,
        "evaluator": "外来 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.9,
        "skills": 4.2,
        "teamwork": 4.7,
        "growth": 3.3,
        "evaluator": "外来 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 86
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 82
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 82
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 61
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年5月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年6月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年7月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2015年4月",
        "department": "外来",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2020年4月",
        "department": "外来",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "TR-NA-2013-004": {
    "id": "TR-NA-2013-004",
    "name": "田中優子",
    "nameInitial": "田",
    "position": "主任看護補助者",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NA-2013-004",
    "joinDate": "2013年4月1日",
    "tenure": "12年3ヶ月",
    "age": 51,
    "birthDate": "1974年6月3日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月9日",
    "healthStatus": "良好",
    "healthScore": 84,
    "stressIndex": 49,
    "engagement": 91,
    "overtime": 30,
    "paidLeaveRate": 52,
    "avatar": "bg-gradient-to-r from-purple-500 to-blue-600",
    "email": "田中.優子@tachigami-hp.jp",
    "phone": "080-6816-3287",
    "emergencyContact": "090-8727-2333（配偶者）",
    "address": "東京都○○区△△1-15-9",
    "evaluationData": {
      "rating": 4.4,
      "performance": 81,
      "skill": 65,
      "teamwork": 72,
      "growth": 3.1
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.6,
        "skills": 3.8,
        "teamwork": 4.5,
        "growth": 3.3,
        "evaluator": "第１病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.8,
        "skills": 4.1,
        "teamwork": 3.8,
        "growth": 3.7,
        "evaluator": "第１病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 94
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 81
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 85
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 70
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年1月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年11月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年8月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2013年4月",
        "department": "第１病棟",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2018年4月",
        "department": "第１病棟",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "TR-NA-2021-005": {
    "id": "TR-NA-2021-005",
    "name": "小林千尋",
    "nameInitial": "小",
    "position": "看護補助者",
    "department": "外来",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NA-2021-005",
    "joinDate": "2021年4月1日",
    "tenure": "4年3ヶ月",
    "age": 30,
    "birthDate": "1995年4月12日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月10日",
    "healthStatus": "要注意",
    "healthScore": 70,
    "stressIndex": 51,
    "engagement": 82,
    "overtime": 10,
    "paidLeaveRate": 69,
    "avatar": "bg-gradient-to-r from-green-500 to-green-600",
    "email": "小林.千尋@tachigami-hp.jp",
    "phone": "080-9829-8237",
    "emergencyContact": "090-9735-7376（兄弟姉妹）",
    "address": "東京都○○区△△1-8-5",
    "evaluationData": {
      "rating": 4.3,
      "performance": 81,
      "skill": 78,
      "teamwork": 97,
      "growth": 4.4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.8,
        "skills": 3.9,
        "teamwork": 4,
        "growth": 3.8,
        "evaluator": "外来 主任"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.2,
        "skills": 4.5,
        "teamwork": 3.8,
        "growth": 4.3,
        "evaluator": "外来 主任"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 79
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 81
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 62
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 66
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年7月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年9月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年6月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2021年4月",
        "department": "外来",
        "position": "看護補助者",
        "reason": "新規配属"
      }
    ]
  },
  "TR-NA-2022-006": {
    "id": "TR-NA-2022-006",
    "name": "加藤拓海",
    "nameInitial": "加",
    "position": "看護補助者",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NA-2022-006",
    "joinDate": "2022年4月1日",
    "tenure": "3年3ヶ月",
    "age": 26,
    "birthDate": "1999年1月10日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月20日",
    "healthStatus": "良好",
    "healthScore": 75,
    "stressIndex": 55,
    "engagement": 84,
    "overtime": 10,
    "paidLeaveRate": 77,
    "avatar": "bg-gradient-to-r from-pink-500 to-green-600",
    "email": "加藤.拓海@tachigami-hp.jp",
    "phone": "080-7887-4557",
    "emergencyContact": "090-8175-4274（配偶者）",
    "address": "東京都○○区△△4-6-7",
    "evaluationData": {
      "rating": 3.6,
      "performance": 90,
      "skill": 91,
      "teamwork": 91,
      "growth": 4.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4,
        "skills": 3.8,
        "teamwork": 4.1,
        "growth": 5,
        "evaluator": "介護医療院 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.5,
        "skills": 3.9,
        "teamwork": 4.7,
        "growth": 4.6,
        "evaluator": "介護医療院 主任"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 72
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 78
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 90
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 70
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年5月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年2月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年5月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2022年4月",
        "department": "介護医療院",
        "position": "看護補助者",
        "reason": "新規配属"
      }
    ]
  },
  "TR-NA-2011-007": {
    "id": "TR-NA-2011-007",
    "name": "加藤由美",
    "nameInitial": "加",
    "position": "主任看護補助者",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NA-2011-007",
    "joinDate": "2011年4月1日",
    "tenure": "14年3ヶ月",
    "age": 37,
    "birthDate": "1988年1月15日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月10日",
    "healthStatus": "良好",
    "healthScore": 75,
    "stressIndex": 32,
    "engagement": 81,
    "overtime": 29,
    "paidLeaveRate": 55,
    "avatar": "bg-gradient-to-r from-indigo-500 to-green-600",
    "email": "加藤.由美@tachigami-hp.jp",
    "phone": "080-3320-1995",
    "emergencyContact": "090-1894-3302（親）",
    "address": "東京都○○区△△3-5-4",
    "evaluationData": {
      "rating": 4.5,
      "performance": 88,
      "skill": 67,
      "teamwork": 71,
      "growth": 4.1
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.4,
        "skills": 4.2,
        "teamwork": 4.8,
        "growth": 3.9,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.4,
        "skills": 3.6,
        "teamwork": 4.7,
        "growth": 3.7,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 85
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 85
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 88
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 80
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年3月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年10月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年5月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2011年4月",
        "department": "介護医療院",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2016年4月",
        "department": "介護医療院",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "TR-NA-2010-008": {
    "id": "TR-NA-2010-008",
    "name": "渡辺雄一",
    "nameInitial": "渡",
    "position": "主任看護補助者",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NA-2010-008",
    "joinDate": "2010年4月1日",
    "tenure": "15年3ヶ月",
    "age": 51,
    "birthDate": "1973年9月24日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月2日",
    "healthStatus": "良好",
    "healthScore": 92,
    "stressIndex": 34,
    "engagement": 84,
    "overtime": 19,
    "paidLeaveRate": 58,
    "avatar": "bg-gradient-to-r from-purple-500 to-indigo-600",
    "email": "渡辺.雄一@tachigami-hp.jp",
    "phone": "080-9549-9785",
    "emergencyContact": "090-2931-6545（親）",
    "address": "東京都○○区△△2-2-5",
    "evaluationData": {
      "rating": 4.8,
      "performance": 82,
      "skill": 84,
      "teamwork": 89,
      "growth": 3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.6,
        "skills": 4.2,
        "teamwork": 4.5,
        "growth": 3.5,
        "evaluator": "第１病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.7,
        "skills": 3.8,
        "teamwork": 4.4,
        "growth": 3.9,
        "evaluator": "第１病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 76
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 94
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 95
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 90
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年9月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年3月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年2月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2010年4月",
        "department": "第１病棟",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2015年4月",
        "department": "第１病棟",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "TR-NA-2013-009": {
    "id": "TR-NA-2013-009",
    "name": "加藤愛子",
    "nameInitial": "加",
    "position": "主任看護補助者",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NA-2013-009",
    "joinDate": "2013年4月1日",
    "tenure": "12年3ヶ月",
    "age": 31,
    "birthDate": "1993年10月15日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月28日",
    "healthStatus": "良好",
    "healthScore": 80,
    "stressIndex": 55,
    "engagement": 80,
    "overtime": 20,
    "paidLeaveRate": 55,
    "avatar": "bg-gradient-to-r from-green-500 to-indigo-600",
    "email": "加藤.愛子@tachigami-hp.jp",
    "phone": "080-9781-4174",
    "emergencyContact": "090-1987-3635（兄弟姉妹）",
    "address": "東京都○○区△△1-3-1",
    "evaluationData": {
      "rating": 4.2,
      "performance": 73,
      "skill": 74,
      "teamwork": 96,
      "growth": 4.3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.6,
        "skills": 3.5,
        "teamwork": 4.7,
        "growth": 4.4,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.1,
        "skills": 4.3,
        "teamwork": 4.1,
        "growth": 3.9,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 65
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 93
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 86
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 94
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年12月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年8月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年2月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2013年4月",
        "department": "介護医療院",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2018年4月",
        "department": "介護医療院",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "TR-NA-2010-010": {
    "id": "TR-NA-2010-010",
    "name": "伊藤麻衣",
    "nameInitial": "伊",
    "position": "主任看護補助者",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NA-2010-010",
    "joinDate": "2010年4月1日",
    "tenure": "15年3ヶ月",
    "age": 45,
    "birthDate": "1979年9月11日",
    "evaluation": "C",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月14日",
    "healthStatus": "良好",
    "healthScore": 95,
    "stressIndex": 43,
    "engagement": 87,
    "overtime": 27,
    "paidLeaveRate": 57,
    "avatar": "bg-gradient-to-r from-blue-500 to-pink-600",
    "email": "伊藤.麻衣@tachigami-hp.jp",
    "phone": "080-6855-9276",
    "emergencyContact": "090-4141-3046（親）",
    "address": "東京都○○区△△4-19-1",
    "evaluationData": {
      "rating": 4.7,
      "performance": 76,
      "skill": 81,
      "teamwork": 86,
      "growth": 3.5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "C",
        "performance": 4.4,
        "skills": 4.6,
        "teamwork": 4,
        "growth": 3.1,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "C",
        "performance": 4.1,
        "skills": 4.3,
        "teamwork": 4.7,
        "growth": 3.8,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 84
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 94
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 95
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 90
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年7月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年10月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年10月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2010年4月",
        "department": "介護医療院",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2015年4月",
        "department": "介護医療院",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "TR-NA-2021-011": {
    "id": "TR-NA-2021-011",
    "name": "鈴木愛子",
    "nameInitial": "鈴",
    "position": "看護補助者",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NA-2021-011",
    "joinDate": "2021年4月1日",
    "tenure": "4年3ヶ月",
    "age": 34,
    "birthDate": "1991年4月5日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月10日",
    "healthStatus": "良好",
    "healthScore": 90,
    "stressIndex": 41,
    "engagement": 82,
    "overtime": 19,
    "paidLeaveRate": 62,
    "avatar": "bg-gradient-to-r from-green-500 to-indigo-600",
    "email": "鈴木.愛子@tachigami-hp.jp",
    "phone": "080-7040-3496",
    "emergencyContact": "090-6822-9565（親）",
    "address": "東京都○○区△△6-18-1",
    "evaluationData": {
      "rating": 4,
      "performance": 93,
      "skill": 69,
      "teamwork": 93,
      "growth": 3.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.4,
        "skills": 4.2,
        "teamwork": 4.6,
        "growth": 4.2,
        "evaluator": "第１病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.6,
        "skills": 3.5,
        "teamwork": 3.9,
        "growth": 4.1,
        "evaluator": "第１病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 71
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 85
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 92
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 84
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年2月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年12月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年5月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2021年4月",
        "department": "第１病棟",
        "position": "看護補助者",
        "reason": "新規配属"
      }
    ]
  },
  "TR-NA-2019-012": {
    "id": "TR-NA-2019-012",
    "name": "渡辺大輔",
    "nameInitial": "渡",
    "position": "主任看護補助者",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-NA-2019-012",
    "joinDate": "2019年4月1日",
    "tenure": "6年3ヶ月",
    "age": 24,
    "birthDate": "2000年9月21日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月11日",
    "healthStatus": "良好",
    "healthScore": 74,
    "stressIndex": 58,
    "engagement": 82,
    "overtime": 8,
    "paidLeaveRate": 73,
    "avatar": "bg-gradient-to-r from-pink-500 to-pink-600",
    "email": "渡辺.大輔@tachigami-hp.jp",
    "phone": "080-4045-1121",
    "emergencyContact": "090-6868-4774（親）",
    "address": "東京都○○区△△1-15-8",
    "evaluationData": {
      "rating": 3.6,
      "performance": 79,
      "skill": 93,
      "teamwork": 76,
      "growth": 4.4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.1,
        "skills": 4.5,
        "teamwork": 4.6,
        "growth": 4.2,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.1,
        "skills": 4.2,
        "teamwork": 4.3,
        "growth": 4.7,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "生活援助",
        "category": "基本スキル",
        "level": 71
      },
      {
        "name": "患者移乗",
        "category": "技術スキル",
        "level": 89
      },
      {
        "name": "清潔ケア",
        "category": "基本スキル",
        "level": 91
      },
      {
        "name": "コミュニケーション",
        "category": "ソフトスキル",
        "level": 84
      }
    ],
    "trainingHistory": [
      {
        "name": "看護補助者基礎研修",
        "category": "基礎研修",
        "hours": 24,
        "date": "2024年5月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "介護技術研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2023年11月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "認知症ケア研修",
        "category": "専門研修",
        "hours": 8,
        "date": "2022年8月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2019年4月",
        "department": "介護医療院",
        "position": "看護補助者",
        "reason": "新規配属"
      },
      {
        "date": "2024年4月",
        "department": "介護医療院",
        "position": "主任看護補助者",
        "reason": "昇進"
      }
    ]
  },
  "TR-CG-2009-001": {
    "id": "TR-CG-2009-001",
    "name": "高橋愛子",
    "nameInitial": "高",
    "position": "介護主任",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CG-2009-001",
    "joinDate": "2009年4月1日",
    "tenure": "16年3ヶ月",
    "age": 68,
    "birthDate": "1957年6月6日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月21日",
    "healthStatus": "良好",
    "healthScore": 87,
    "stressIndex": 44,
    "engagement": 88,
    "overtime": 16,
    "paidLeaveRate": 47,
    "avatar": "bg-gradient-to-r from-pink-500 to-purple-600",
    "email": "高橋.愛子@tachigami-hp.jp",
    "phone": "080-5077-9894",
    "emergencyContact": "090-2829-2458（配偶者）",
    "address": "東京都○○区△△3-14-12",
    "evaluationData": {
      "rating": 4.7,
      "performance": 92,
      "skill": 84,
      "teamwork": 76,
      "growth": 3.4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.4,
        "skills": 4,
        "teamwork": 4.3,
        "growth": 3.1,
        "evaluator": "第１病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.9,
        "skills": 3.4,
        "teamwork": 4.1,
        "growth": 3,
        "evaluator": "第１病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 64
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 74
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 66
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 81
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年11月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年10月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年6月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2009年4月",
        "department": "第１病棟",
        "position": "介護士",
        "reason": "新規配属"
      },
      {
        "date": "2014年4月",
        "department": "第１病棟",
        "position": "介護主任",
        "reason": "昇進"
      }
    ]
  },
  "TR-CG-2001-002": {
    "id": "TR-CG-2001-002",
    "name": "中村千尋",
    "nameInitial": "中",
    "position": "介護主任",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CG-2001-002",
    "joinDate": "2001年4月1日",
    "tenure": "24年3ヶ月",
    "age": 69,
    "birthDate": "1956年6月15日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月17日",
    "healthStatus": "要注意",
    "healthScore": 89,
    "stressIndex": 36,
    "engagement": 95,
    "overtime": 25,
    "paidLeaveRate": 52,
    "avatar": "bg-gradient-to-r from-indigo-500 to-pink-600",
    "email": "中村.千尋@tachigami-hp.jp",
    "phone": "080-4796-4300",
    "emergencyContact": "090-9716-3590（親）",
    "address": "東京都○○区△△1-9-2",
    "evaluationData": {
      "rating": 4.6,
      "performance": 76,
      "skill": 69,
      "teamwork": 73,
      "growth": 2.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 5,
        "skills": 3.7,
        "teamwork": 3.9,
        "growth": 2.6,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.3,
        "skills": 4.2,
        "teamwork": 3.8,
        "growth": 2.6,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 71
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 78
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 76
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 62
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年3月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年8月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年7月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2001年4月",
        "department": "介護医療院",
        "position": "介護士",
        "reason": "新規配属"
      },
      {
        "date": "2006年4月",
        "department": "介護医療院",
        "position": "介護主任",
        "reason": "昇進"
      }
    ]
  },
  "TR-CG-2001-003": {
    "id": "TR-CG-2001-003",
    "name": "鈴木太郎",
    "nameInitial": "鈴",
    "position": "介護主任",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CG-2001-003",
    "joinDate": "2001年4月1日",
    "tenure": "24年3ヶ月",
    "age": 66,
    "birthDate": "1958年11月2日",
    "evaluation": "S",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月9日",
    "healthStatus": "良好",
    "healthScore": 83,
    "stressIndex": 27,
    "engagement": 92,
    "overtime": 13,
    "paidLeaveRate": 38,
    "avatar": "bg-gradient-to-r from-green-500 to-pink-600",
    "email": "鈴木.太郎@tachigami-hp.jp",
    "phone": "080-9403-2225",
    "emergencyContact": "090-3801-6108（配偶者）",
    "address": "東京都○○区△△1-15-15",
    "evaluationData": {
      "rating": 4.9,
      "performance": 73,
      "skill": 94,
      "teamwork": 80,
      "growth": 3.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "S",
        "performance": 4.4,
        "skills": 4,
        "teamwork": 4.3,
        "growth": 3,
        "evaluator": "第１病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "S",
        "performance": 4.9,
        "skills": 3.7,
        "teamwork": 4.1,
        "growth": 3.1,
        "evaluator": "第１病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 65
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 76
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 95
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 68
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年10月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年11月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年10月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2001年4月",
        "department": "第１病棟",
        "position": "介護士",
        "reason": "新規配属"
      },
      {
        "date": "2006年4月",
        "department": "第１病棟",
        "position": "介護主任",
        "reason": "昇進"
      }
    ]
  },
  "TR-CG-2007-004": {
    "id": "TR-CG-2007-004",
    "name": "鈴木由美",
    "nameInitial": "鈴",
    "position": "介護主任",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CG-2007-004",
    "joinDate": "2007年4月1日",
    "tenure": "18年3ヶ月",
    "age": 59,
    "birthDate": "1965年9月17日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月16日",
    "healthStatus": "要注意",
    "healthScore": 77,
    "stressIndex": 34,
    "engagement": 85,
    "overtime": 8,
    "paidLeaveRate": 57,
    "avatar": "bg-gradient-to-r from-indigo-500 to-purple-600",
    "email": "鈴木.由美@tachigami-hp.jp",
    "phone": "080-5043-6801",
    "emergencyContact": "090-2860-8122（配偶者）",
    "address": "東京都○○区△△6-19-15",
    "evaluationData": {
      "rating": 4.6,
      "performance": 79,
      "skill": 83,
      "teamwork": 71,
      "growth": 3.3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.8,
        "skills": 3.9,
        "teamwork": 4.2,
        "growth": 3.1,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.5,
        "skills": 4.5,
        "teamwork": 3.7,
        "growth": 2.9,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 81
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 82
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 71
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 95
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年11月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年3月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年5月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2007年4月",
        "department": "介護医療院",
        "position": "介護士",
        "reason": "新規配属"
      },
      {
        "date": "2012年4月",
        "department": "介護医療院",
        "position": "介護主任",
        "reason": "昇進"
      }
    ]
  },
  "TR-CG-2020-005": {
    "id": "TR-CG-2020-005",
    "name": "鈴木明日香",
    "nameInitial": "鈴",
    "position": "介護士",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CG-2020-005",
    "joinDate": "2020年4月1日",
    "tenure": "5年3ヶ月",
    "age": 23,
    "birthDate": "2001年11月2日",
    "evaluation": "S",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月13日",
    "healthStatus": "要注意",
    "healthScore": 81,
    "stressIndex": 58,
    "engagement": 80,
    "overtime": 6,
    "paidLeaveRate": 64,
    "avatar": "bg-gradient-to-r from-indigo-500 to-indigo-600",
    "email": "鈴木.明日香@tachigami-hp.jp",
    "phone": "080-2910-8948",
    "emergencyContact": "090-6744-3594（親）",
    "address": "東京都○○区△△9-20-10",
    "evaluationData": {
      "rating": 3.7,
      "performance": 72,
      "skill": 66,
      "teamwork": 84,
      "growth": 4.5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "S",
        "performance": 4,
        "skills": 4.7,
        "teamwork": 4.7,
        "growth": 4.5,
        "evaluator": "第１病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "S",
        "performance": 3.8,
        "skills": 4.6,
        "teamwork": 4,
        "growth": 4.9,
        "evaluator": "第１病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 65
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 78
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 86
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 76
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年1月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年5月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年3月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2020年4月",
        "department": "第１病棟",
        "position": "介護士",
        "reason": "新規配属"
      }
    ]
  },
  "TR-CG-2022-006": {
    "id": "TR-CG-2022-006",
    "name": "小林奈々",
    "nameInitial": "小",
    "position": "介護士",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CG-2022-006",
    "joinDate": "2022年4月1日",
    "tenure": "3年3ヶ月",
    "age": 24,
    "birthDate": "2001年5月22日",
    "evaluation": "S",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月28日",
    "healthStatus": "要注意",
    "healthScore": 76,
    "stressIndex": 63,
    "engagement": 71,
    "overtime": 9,
    "paidLeaveRate": 83,
    "avatar": "bg-gradient-to-r from-purple-500 to-purple-600",
    "email": "小林.奈々@tachigami-hp.jp",
    "phone": "080-8920-2305",
    "emergencyContact": "090-3111-1412（兄弟姉妹）",
    "address": "東京都○○区△△5-20-4",
    "evaluationData": {
      "rating": 4.3,
      "performance": 80,
      "skill": 69,
      "teamwork": 77,
      "growth": 4.7
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "S",
        "performance": 4.3,
        "skills": 3.6,
        "teamwork": 4.2,
        "growth": 4.4,
        "evaluator": "介護医療院 主任"
      },
      {
        "period": "2024年上期",
        "overall": "S",
        "performance": 3.7,
        "skills": 3.8,
        "teamwork": 3.8,
        "growth": 4.2,
        "evaluator": "介護医療院 主任"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 77
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 83
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 93
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 80
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年9月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年11月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年9月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2022年4月",
        "department": "介護医療院",
        "position": "介護士",
        "reason": "新規配属"
      }
    ]
  },
  "TR-CG-2011-007": {
    "id": "TR-CG-2011-007",
    "name": "山本健司",
    "nameInitial": "山",
    "position": "介護主任",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CG-2011-007",
    "joinDate": "2011年4月1日",
    "tenure": "14年3ヶ月",
    "age": 39,
    "birthDate": "1986年3月12日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月9日",
    "healthStatus": "良好",
    "healthScore": 93,
    "stressIndex": 44,
    "engagement": 85,
    "overtime": 15,
    "paidLeaveRate": 63,
    "avatar": "bg-gradient-to-r from-indigo-500 to-indigo-600",
    "email": "山本.健司@tachigami-hp.jp",
    "phone": "080-3420-5357",
    "emergencyContact": "090-4288-2169（兄弟姉妹）",
    "address": "東京都○○区△△8-18-4",
    "evaluationData": {
      "rating": 4.1,
      "performance": 95,
      "skill": 75,
      "teamwork": 76,
      "growth": 3.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 3.9,
        "skills": 4.6,
        "teamwork": 4.6,
        "growth": 4.5,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.2,
        "skills": 4.5,
        "teamwork": 4.7,
        "growth": 4.1,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 88
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 70
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 87
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 63
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年5月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年5月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年12月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2011年4月",
        "department": "介護医療院",
        "position": "介護士",
        "reason": "新規配属"
      },
      {
        "date": "2016年4月",
        "department": "介護医療院",
        "position": "介護主任",
        "reason": "昇進"
      }
    ]
  },
  "TR-CG-2019-008": {
    "id": "TR-CG-2019-008",
    "name": "渡辺千尋",
    "nameInitial": "渡",
    "position": "介護主任",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CG-2019-008",
    "joinDate": "2019年4月1日",
    "tenure": "6年3ヶ月",
    "age": 44,
    "birthDate": "1980年12月4日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月5日",
    "healthStatus": "良好",
    "healthScore": 93,
    "stressIndex": 39,
    "engagement": 90,
    "overtime": 26,
    "paidLeaveRate": 56,
    "avatar": "bg-gradient-to-r from-blue-500 to-purple-600",
    "email": "渡辺.千尋@tachigami-hp.jp",
    "phone": "080-5067-8212",
    "emergencyContact": "090-9426-6234（兄弟姉妹）",
    "address": "東京都○○区△△5-6-7",
    "evaluationData": {
      "rating": 4.3,
      "performance": 93,
      "skill": 78,
      "teamwork": 80,
      "growth": 3.7
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.5,
        "skills": 3.6,
        "teamwork": 3.9,
        "growth": 3.5,
        "evaluator": "第１病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.9,
        "skills": 4.2,
        "teamwork": 4.2,
        "growth": 3.9,
        "evaluator": "第１病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 73
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 82
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 78
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 64
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年3月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年6月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年7月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2019年4月",
        "department": "第１病棟",
        "position": "介護士",
        "reason": "新規配属"
      },
      {
        "date": "2024年4月",
        "department": "第１病棟",
        "position": "介護主任",
        "reason": "昇進"
      }
    ]
  },
  "TR-CG-2022-009": {
    "id": "TR-CG-2022-009",
    "name": "高橋千尋",
    "nameInitial": "高",
    "position": "介護士",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CG-2022-009",
    "joinDate": "2022年4月1日",
    "tenure": "3年3ヶ月",
    "age": 25,
    "birthDate": "1999年11月5日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月26日",
    "healthStatus": "良好",
    "healthScore": 70,
    "stressIndex": 45,
    "engagement": 71,
    "overtime": 7,
    "paidLeaveRate": 67,
    "avatar": "bg-gradient-to-r from-blue-500 to-indigo-600",
    "email": "高橋.千尋@tachigami-hp.jp",
    "phone": "080-2910-2604",
    "emergencyContact": "090-2108-3489（兄弟姉妹）",
    "address": "東京都○○区△△2-13-2",
    "evaluationData": {
      "rating": 4.1,
      "performance": 75,
      "skill": 88,
      "teamwork": 96,
      "growth": 4.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.2,
        "skills": 4.1,
        "teamwork": 4,
        "growth": 4.2,
        "evaluator": "介護医療院 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 3.5,
        "skills": 3.8,
        "teamwork": 4.8,
        "growth": 4.8,
        "evaluator": "介護医療院 主任"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 72
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 85
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 81
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 64
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年4月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年6月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年1月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2022年4月",
        "department": "介護医療院",
        "position": "介護士",
        "reason": "新規配属"
      }
    ]
  },
  "TR-CG-2018-010": {
    "id": "TR-CG-2018-010",
    "name": "中村花子",
    "nameInitial": "中",
    "position": "介護主任",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CG-2018-010",
    "joinDate": "2018年4月1日",
    "tenure": "7年3ヶ月",
    "age": 39,
    "birthDate": "1986年4月25日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月27日",
    "healthStatus": "良好",
    "healthScore": 77,
    "stressIndex": 43,
    "engagement": 78,
    "overtime": 22,
    "paidLeaveRate": 74,
    "avatar": "bg-gradient-to-r from-purple-500 to-indigo-600",
    "email": "中村.花子@tachigami-hp.jp",
    "phone": "080-8314-4904",
    "emergencyContact": "090-3113-5575（配偶者）",
    "address": "東京都○○区△△7-9-3",
    "evaluationData": {
      "rating": 4,
      "performance": 79,
      "skill": 65,
      "teamwork": 70,
      "growth": 3.5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 3.9,
        "skills": 3.9,
        "teamwork": 4.3,
        "growth": 4.4,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.3,
        "skills": 3.6,
        "teamwork": 4.3,
        "growth": 4.5,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 83
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 87
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 68
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 84
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年11月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年10月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年3月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2018年4月",
        "department": "介護医療院",
        "position": "介護士",
        "reason": "新規配属"
      },
      {
        "date": "2023年4月",
        "department": "介護医療院",
        "position": "介護主任",
        "reason": "昇進"
      }
    ]
  },
  "TR-CG-2021-011": {
    "id": "TR-CG-2021-011",
    "name": "田中由美",
    "nameInitial": "田",
    "position": "介護士",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CG-2021-011",
    "joinDate": "2021年4月1日",
    "tenure": "4年3ヶ月",
    "age": 22,
    "birthDate": "2002年8月28日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月28日",
    "healthStatus": "要注意",
    "healthScore": 87,
    "stressIndex": 41,
    "engagement": 85,
    "overtime": 7,
    "paidLeaveRate": 61,
    "avatar": "bg-gradient-to-r from-indigo-500 to-green-600",
    "email": "田中.由美@tachigami-hp.jp",
    "phone": "080-3540-7188",
    "emergencyContact": "090-8685-6322（親）",
    "address": "東京都○○区△△1-6-14",
    "evaluationData": {
      "rating": 3.8,
      "performance": 85,
      "skill": 86,
      "teamwork": 70,
      "growth": 5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.3,
        "skills": 3.5,
        "teamwork": 4.1,
        "growth": 4.4,
        "evaluator": "第１病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 3.7,
        "skills": 4.5,
        "teamwork": 4.6,
        "growth": 4.6,
        "evaluator": "第１病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 77
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 91
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 84
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 76
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年5月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年5月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年6月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2021年4月",
        "department": "第１病棟",
        "position": "介護士",
        "reason": "新規配属"
      }
    ]
  },
  "TR-CG-1998-012": {
    "id": "TR-CG-1998-012",
    "name": "小林愛子",
    "nameInitial": "小",
    "position": "介護主任",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CG-1998-012",
    "joinDate": "1998年4月1日",
    "tenure": "27年3ヶ月",
    "age": 69,
    "birthDate": "1955年10月14日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月21日",
    "healthStatus": "良好",
    "healthScore": 79,
    "stressIndex": 36,
    "engagement": 87,
    "overtime": 23,
    "paidLeaveRate": 59,
    "avatar": "bg-gradient-to-r from-pink-500 to-blue-600",
    "email": "小林.愛子@tachigami-hp.jp",
    "phone": "080-2716-5579",
    "emergencyContact": "090-5784-4866（兄弟姉妹）",
    "address": "東京都○○区△△8-16-10",
    "evaluationData": {
      "rating": 4.4,
      "performance": 70,
      "skill": 92,
      "teamwork": 83,
      "growth": 2.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 5,
        "skills": 4.5,
        "teamwork": 4.8,
        "growth": 3.4,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.8,
        "skills": 4.1,
        "teamwork": 4.5,
        "growth": 3.5,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 66
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 71
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 67
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 83
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年10月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年12月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年4月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "1998年4月",
        "department": "介護医療院",
        "position": "介護士",
        "reason": "新規配属"
      },
      {
        "date": "2003年4月",
        "department": "介護医療院",
        "position": "介護主任",
        "reason": "昇進"
      }
    ]
  },
  "TR-CG-2010-013": {
    "id": "TR-CG-2010-013",
    "name": "加藤麻衣",
    "nameInitial": "加",
    "position": "介護主任",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CG-2010-013",
    "joinDate": "2010年4月1日",
    "tenure": "15年3ヶ月",
    "age": 55,
    "birthDate": "1970年6月25日",
    "evaluation": "C",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月15日",
    "healthStatus": "良好",
    "healthScore": 70,
    "stressIndex": 29,
    "engagement": 93,
    "overtime": 19,
    "paidLeaveRate": 65,
    "avatar": "bg-gradient-to-r from-blue-500 to-indigo-600",
    "email": "加藤.麻衣@tachigami-hp.jp",
    "phone": "080-5714-7809",
    "emergencyContact": "090-8195-4609（親）",
    "address": "東京都○○区△△8-14-15",
    "evaluationData": {
      "rating": 4.4,
      "performance": 89,
      "skill": 77,
      "teamwork": 79,
      "growth": 3.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "C",
        "performance": 4.3,
        "skills": 3.5,
        "teamwork": 4.2,
        "growth": 3.4,
        "evaluator": "第１病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "C",
        "performance": 4.6,
        "skills": 4,
        "teamwork": 3.9,
        "growth": 3.8,
        "evaluator": "第１病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 90
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 95
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 64
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 89
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年8月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年3月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年5月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2010年4月",
        "department": "第１病棟",
        "position": "介護士",
        "reason": "新規配属"
      },
      {
        "date": "2015年4月",
        "department": "第１病棟",
        "position": "介護主任",
        "reason": "昇進"
      }
    ]
  },
  "TR-CG-2008-014": {
    "id": "TR-CG-2008-014",
    "name": "田中奈々",
    "nameInitial": "田",
    "position": "介護主任",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CG-2008-014",
    "joinDate": "2008年4月1日",
    "tenure": "17年3ヶ月",
    "age": 61,
    "birthDate": "1964年5月2日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月3日",
    "healthStatus": "良好",
    "healthScore": 78,
    "stressIndex": 39,
    "engagement": 89,
    "overtime": 9,
    "paidLeaveRate": 37,
    "avatar": "bg-gradient-to-r from-blue-500 to-blue-600",
    "email": "田中.奈々@tachigami-hp.jp",
    "phone": "080-5112-1960",
    "emergencyContact": "090-5414-7269（親）",
    "address": "東京都○○区△△5-2-10",
    "evaluationData": {
      "rating": 4.2,
      "performance": 94,
      "skill": 82,
      "teamwork": 92,
      "growth": 2.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.5,
        "skills": 4.5,
        "teamwork": 4.5,
        "growth": 2.9,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.9,
        "skills": 4.3,
        "teamwork": 4.4,
        "growth": 3.3,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 76
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 93
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 92
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 76
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年12月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年10月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年6月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2008年4月",
        "department": "介護医療院",
        "position": "介護士",
        "reason": "新規配属"
      },
      {
        "date": "2013年4月",
        "department": "介護医療院",
        "position": "介護主任",
        "reason": "昇進"
      }
    ]
  },
  "TR-CG-2022-015": {
    "id": "TR-CG-2022-015",
    "name": "高橋千尋",
    "nameInitial": "高",
    "position": "介護士",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CG-2022-015",
    "joinDate": "2022年4月1日",
    "tenure": "3年3ヶ月",
    "age": 33,
    "birthDate": "1992年5月22日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月28日",
    "healthStatus": "良好",
    "healthScore": 82,
    "stressIndex": 50,
    "engagement": 86,
    "overtime": 20,
    "paidLeaveRate": 55,
    "avatar": "bg-gradient-to-r from-purple-500 to-blue-600",
    "email": "高橋.千尋@tachigami-hp.jp",
    "phone": "080-7608-9967",
    "emergencyContact": "090-3250-1095（親）",
    "address": "東京都○○区△△7-1-14",
    "evaluationData": {
      "rating": 4.2,
      "performance": 82,
      "skill": 88,
      "teamwork": 77,
      "growth": 4.1
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.5,
        "skills": 4.4,
        "teamwork": 4.5,
        "growth": 4,
        "evaluator": "介護医療院 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.5,
        "skills": 3.4,
        "teamwork": 4.1,
        "growth": 4,
        "evaluator": "介護医療院 主任"
      }
    ],
    "skills": [
      {
        "name": "介護技術",
        "category": "専門スキル",
        "level": 60
      },
      {
        "name": "認知症ケア",
        "category": "専門スキル",
        "level": 71
      },
      {
        "name": "レクリエーション",
        "category": "活動スキル",
        "level": 71
      },
      {
        "name": "記録作成",
        "category": "事務スキル",
        "level": 68
      }
    ],
    "trainingHistory": [
      {
        "name": "介護技術基礎研修",
        "category": "基礎研修",
        "hours": 32,
        "date": "2024年3月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "認知症ケア専門研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2023年3月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "レクリエーション研修",
        "category": "技術研修",
        "hours": 8,
        "date": "2022年2月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2022年4月",
        "department": "介護医療院",
        "position": "介護士",
        "reason": "新規配属"
      }
    ]
  },
  "TR-CW-2010-001": {
    "id": "TR-CW-2010-001",
    "name": "山本明日香",
    "nameInitial": "山",
    "position": "主任介護福祉士",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CW-2010-001",
    "joinDate": "2010年4月1日",
    "tenure": "15年3ヶ月",
    "age": 49,
    "birthDate": "1976年5月26日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月10日",
    "healthStatus": "良好",
    "healthScore": 88,
    "stressIndex": 42,
    "engagement": 93,
    "overtime": 20,
    "paidLeaveRate": 56,
    "avatar": "bg-gradient-to-r from-pink-500 to-blue-600",
    "email": "山本.明日香@tachigami-hp.jp",
    "phone": "080-4268-3028",
    "emergencyContact": "090-9957-5782（親）",
    "address": "東京都○○区△△5-8-1",
    "evaluationData": {
      "rating": 4.4,
      "performance": 92,
      "skill": 85,
      "teamwork": 75,
      "growth": 3.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.2,
        "skills": 4.7,
        "teamwork": 3.9,
        "growth": 3.9,
        "evaluator": "第１病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.2,
        "skills": 4.5,
        "teamwork": 4.4,
        "growth": 3.6,
        "evaluator": "第１病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 79
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 75
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 73
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 93
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年7月",
        "evaluation": "優秀",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年3月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年7月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2010年4月",
        "department": "第１病棟",
        "position": "介護福祉士",
        "reason": "新規配属"
      },
      {
        "date": "2015年4月",
        "department": "第１病棟",
        "position": "主任介護福祉士",
        "reason": "昇進"
      }
    ]
  },
  "TR-CW-2023-002": {
    "id": "TR-CW-2023-002",
    "name": "中村奈々",
    "nameInitial": "中",
    "position": "介護福祉士",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CW-2023-002",
    "joinDate": "2023年4月1日",
    "tenure": "2年3ヶ月",
    "age": 22,
    "birthDate": "2002年9月20日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月21日",
    "healthStatus": "良好",
    "healthScore": 82,
    "stressIndex": 64,
    "engagement": 72,
    "overtime": 15,
    "paidLeaveRate": 65,
    "avatar": "bg-gradient-to-r from-green-500 to-purple-600",
    "email": "中村.奈々@tachigami-hp.jp",
    "phone": "080-5988-4191",
    "emergencyContact": "090-4741-4558（親）",
    "address": "東京都○○区△△6-17-2",
    "evaluationData": {
      "rating": 3.6,
      "performance": 79,
      "skill": 73,
      "teamwork": 75,
      "growth": 4.7
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 3.5,
        "skills": 4,
        "teamwork": 4.7,
        "growth": 4.4,
        "evaluator": "第１病棟 主任"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 3.5,
        "skills": 4.6,
        "teamwork": 4.4,
        "growth": 4.1,
        "evaluator": "第１病棟 主任"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 62
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 73
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 85
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 67
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年6月",
        "evaluation": "良好",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年5月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年9月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2023年4月",
        "department": "第１病棟",
        "position": "介護福祉士",
        "reason": "新規配属"
      }
    ]
  },
  "TR-CW-2017-003": {
    "id": "TR-CW-2017-003",
    "name": "渡辺千尋",
    "nameInitial": "渡",
    "position": "主任介護福祉士",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CW-2017-003",
    "joinDate": "2017年4月1日",
    "tenure": "8年3ヶ月",
    "age": 39,
    "birthDate": "1986年1月19日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月18日",
    "healthStatus": "要注意",
    "healthScore": 71,
    "stressIndex": 40,
    "engagement": 84,
    "overtime": 24,
    "paidLeaveRate": 59,
    "avatar": "bg-gradient-to-r from-purple-500 to-pink-600",
    "email": "渡辺.千尋@tachigami-hp.jp",
    "phone": "080-7242-2962",
    "emergencyContact": "090-4450-4933（配偶者）",
    "address": "東京都○○区△△1-16-11",
    "evaluationData": {
      "rating": 4.1,
      "performance": 78,
      "skill": 72,
      "teamwork": 70,
      "growth": 4.4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.7,
        "skills": 3.7,
        "teamwork": 4.7,
        "growth": 3.7,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 3.8,
        "skills": 4.4,
        "teamwork": 4.1,
        "growth": 3.8,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 76
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 88
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 66
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 60
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年1月",
        "evaluation": "合格",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年4月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年7月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2017年4月",
        "department": "介護医療院",
        "position": "介護福祉士",
        "reason": "新規配属"
      },
      {
        "date": "2022年4月",
        "department": "介護医療院",
        "position": "主任介護福祉士",
        "reason": "昇進"
      }
    ]
  },
  "TR-CW-2012-004": {
    "id": "TR-CW-2012-004",
    "name": "高橋優子",
    "nameInitial": "高",
    "position": "主任介護福祉士",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CW-2012-004",
    "joinDate": "2012年4月1日",
    "tenure": "13年3ヶ月",
    "age": 49,
    "birthDate": "1975年8月21日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月19日",
    "healthStatus": "要注意",
    "healthScore": 76,
    "stressIndex": 32,
    "engagement": 94,
    "overtime": 24,
    "paidLeaveRate": 52,
    "avatar": "bg-gradient-to-r from-blue-500 to-indigo-600",
    "email": "高橋.優子@tachigami-hp.jp",
    "phone": "080-9755-2396",
    "emergencyContact": "090-3839-8805（兄弟姉妹）",
    "address": "東京都○○区△△8-2-2",
    "evaluationData": {
      "rating": 4.8,
      "performance": 89,
      "skill": 77,
      "teamwork": 91,
      "growth": 3.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.1,
        "skills": 3.6,
        "teamwork": 4.3,
        "growth": 3.8,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.8,
        "skills": 3.8,
        "teamwork": 4.1,
        "growth": 3.6,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 91
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 74
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 86
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 88
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年6月",
        "evaluation": "優秀",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年11月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年9月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2012年4月",
        "department": "介護医療院",
        "position": "介護福祉士",
        "reason": "新規配属"
      },
      {
        "date": "2017年4月",
        "department": "介護医療院",
        "position": "主任介護福祉士",
        "reason": "昇進"
      }
    ]
  },
  "TR-CW-2010-005": {
    "id": "TR-CW-2010-005",
    "name": "小林美咲",
    "nameInitial": "小",
    "position": "主任介護福祉士",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CW-2010-005",
    "joinDate": "2010年4月1日",
    "tenure": "15年3ヶ月",
    "age": 56,
    "birthDate": "1969年5月1日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月12日",
    "healthStatus": "良好",
    "healthScore": 73,
    "stressIndex": 47,
    "engagement": 85,
    "overtime": 24,
    "paidLeaveRate": 64,
    "avatar": "bg-gradient-to-r from-blue-500 to-pink-600",
    "email": "小林.美咲@tachigami-hp.jp",
    "phone": "080-2467-6639",
    "emergencyContact": "090-2037-6148（兄弟姉妹）",
    "address": "東京都○○区△△3-15-11",
    "evaluationData": {
      "rating": 4.2,
      "performance": 92,
      "skill": 84,
      "teamwork": 72,
      "growth": 3.1
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.4,
        "skills": 4.6,
        "teamwork": 4.2,
        "growth": 3,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.5,
        "skills": 4.2,
        "teamwork": 4.6,
        "growth": 3.6,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 62
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 85
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 84
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 67
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年5月",
        "evaluation": "良好",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年7月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年8月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2010年4月",
        "department": "介護医療院",
        "position": "介護福祉士",
        "reason": "新規配属"
      },
      {
        "date": "2015年4月",
        "department": "介護医療院",
        "position": "主任介護福祉士",
        "reason": "昇進"
      }
    ]
  },
  "TR-CW-2007-006": {
    "id": "TR-CW-2007-006",
    "name": "中村花子",
    "nameInitial": "中",
    "position": "主任介護福祉士",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CW-2007-006",
    "joinDate": "2007年4月1日",
    "tenure": "18年3ヶ月",
    "age": 60,
    "birthDate": "1964年8月26日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月14日",
    "healthStatus": "良好",
    "healthScore": 84,
    "stressIndex": 42,
    "engagement": 86,
    "overtime": 19,
    "paidLeaveRate": 35,
    "avatar": "bg-gradient-to-r from-blue-500 to-indigo-600",
    "email": "中村.花子@tachigami-hp.jp",
    "phone": "080-7193-6294",
    "emergencyContact": "090-7241-3946（親）",
    "address": "東京都○○区△△7-9-6",
    "evaluationData": {
      "rating": 4.7,
      "performance": 79,
      "skill": 92,
      "teamwork": 73,
      "growth": 3.5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.6,
        "skills": 3.5,
        "teamwork": 3.8,
        "growth": 2.9,
        "evaluator": "第１病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.4,
        "skills": 4.2,
        "teamwork": 3.8,
        "growth": 2.5,
        "evaluator": "第１病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 79
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 91
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 76
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 69
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年4月",
        "evaluation": "良好",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年9月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年6月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2007年4月",
        "department": "第１病棟",
        "position": "介護福祉士",
        "reason": "新規配属"
      },
      {
        "date": "2012年4月",
        "department": "第１病棟",
        "position": "主任介護福祉士",
        "reason": "昇進"
      }
    ]
  },
  "TR-CW-2008-007": {
    "id": "TR-CW-2008-007",
    "name": "中村花子",
    "nameInitial": "中",
    "position": "主任介護福祉士",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CW-2008-007",
    "joinDate": "2008年4月1日",
    "tenure": "17年3ヶ月",
    "age": 68,
    "birthDate": "1956年12月25日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月10日",
    "healthStatus": "良好",
    "healthScore": 82,
    "stressIndex": 21,
    "engagement": 93,
    "overtime": 13,
    "paidLeaveRate": 57,
    "avatar": "bg-gradient-to-r from-green-500 to-pink-600",
    "email": "中村.花子@tachigami-hp.jp",
    "phone": "080-5800-7576",
    "emergencyContact": "090-3962-8602（配偶者）",
    "address": "東京都○○区△△8-20-13",
    "evaluationData": {
      "rating": 4.5,
      "performance": 81,
      "skill": 71,
      "teamwork": 87,
      "growth": 3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.6,
        "skills": 4.5,
        "teamwork": 4.3,
        "growth": 3.3,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.3,
        "skills": 4.4,
        "teamwork": 4,
        "growth": 2.5,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 64
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 75
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 94
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 87
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年11月",
        "evaluation": "良好",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年10月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年9月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2008年4月",
        "department": "介護医療院",
        "position": "介護福祉士",
        "reason": "新規配属"
      },
      {
        "date": "2013年4月",
        "department": "介護医療院",
        "position": "主任介護福祉士",
        "reason": "昇進"
      }
    ]
  },
  "TR-CW-2004-008": {
    "id": "TR-CW-2004-008",
    "name": "田中明日香",
    "nameInitial": "田",
    "position": "主任介護福祉士",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CW-2004-008",
    "joinDate": "2004年4月1日",
    "tenure": "21年3ヶ月",
    "age": 62,
    "birthDate": "1962年12月3日",
    "evaluation": "C",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月15日",
    "healthStatus": "良好",
    "healthScore": 78,
    "stressIndex": 45,
    "engagement": 85,
    "overtime": 21,
    "paidLeaveRate": 38,
    "avatar": "bg-gradient-to-r from-blue-500 to-indigo-600",
    "email": "田中.明日香@tachigami-hp.jp",
    "phone": "080-8956-1362",
    "emergencyContact": "090-8774-9096（親）",
    "address": "東京都○○区△△3-8-6",
    "evaluationData": {
      "rating": 4.8,
      "performance": 83,
      "skill": 74,
      "teamwork": 73,
      "growth": 2.9
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "C",
        "performance": 4.4,
        "skills": 3.9,
        "teamwork": 4.3,
        "growth": 2.7,
        "evaluator": "第１病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "C",
        "performance": 5,
        "skills": 4.6,
        "teamwork": 4.1,
        "growth": 3.3,
        "evaluator": "第１病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 70
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 64
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 91
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 65
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年7月",
        "evaluation": "合格",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年1月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年10月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2004年4月",
        "department": "第１病棟",
        "position": "介護福祉士",
        "reason": "新規配属"
      },
      {
        "date": "2009年4月",
        "department": "第１病棟",
        "position": "主任介護福祉士",
        "reason": "昇進"
      }
    ]
  },
  "TR-CW-2011-009": {
    "id": "TR-CW-2011-009",
    "name": "加藤健太",
    "nameInitial": "加",
    "position": "主任介護福祉士",
    "department": "介護医療院",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CW-2011-009",
    "joinDate": "2011年4月1日",
    "tenure": "14年3ヶ月",
    "age": 47,
    "birthDate": "1977年10月8日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月26日",
    "healthStatus": "要注意",
    "healthScore": 94,
    "stressIndex": 34,
    "engagement": 82,
    "overtime": 34,
    "paidLeaveRate": 54,
    "avatar": "bg-gradient-to-r from-indigo-500 to-blue-600",
    "email": "加藤.健太@tachigami-hp.jp",
    "phone": "080-5704-2881",
    "emergencyContact": "090-8241-4187（親）",
    "address": "東京都○○区△△2-12-13",
    "evaluationData": {
      "rating": 4.8,
      "performance": 93,
      "skill": 71,
      "teamwork": 82,
      "growth": 3.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.1,
        "skills": 3.6,
        "teamwork": 4.8,
        "growth": 3.6,
        "evaluator": "介護医療院 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.5,
        "skills": 3.5,
        "teamwork": 4.4,
        "growth": 3.7,
        "evaluator": "介護医療院 部長"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 87
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 77
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 90
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 94
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年6月",
        "evaluation": "優秀",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年10月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年8月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2011年4月",
        "department": "介護医療院",
        "position": "介護福祉士",
        "reason": "新規配属"
      },
      {
        "date": "2016年4月",
        "department": "介護医療院",
        "position": "主任介護福祉士",
        "reason": "昇進"
      }
    ]
  },
  "TR-CW-2010-010": {
    "id": "TR-CW-2010-010",
    "name": "渡辺明日香",
    "nameInitial": "渡",
    "position": "主任介護福祉士",
    "department": "第１病棟",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-CW-2010-010",
    "joinDate": "2010年4月1日",
    "tenure": "15年3ヶ月",
    "age": 50,
    "birthDate": "1974年9月21日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月1日",
    "healthStatus": "良好",
    "healthScore": 85,
    "stressIndex": 33,
    "engagement": 84,
    "overtime": 15,
    "paidLeaveRate": 60,
    "avatar": "bg-gradient-to-r from-indigo-500 to-indigo-600",
    "email": "渡辺.明日香@tachigami-hp.jp",
    "phone": "080-1351-4604",
    "emergencyContact": "090-8457-1658（配偶者）",
    "address": "東京都○○区△△1-15-8",
    "evaluationData": {
      "rating": 4.3,
      "performance": 78,
      "skill": 65,
      "teamwork": 79,
      "growth": 3.5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.4,
        "skills": 4.3,
        "teamwork": 4.6,
        "growth": 3,
        "evaluator": "第１病棟 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.2,
        "skills": 3.9,
        "teamwork": 4.7,
        "growth": 4,
        "evaluator": "第１病棟 部長"
      }
    ],
    "skills": [
      {
        "name": "介護計画立案",
        "category": "専門スキル",
        "level": 94
      },
      {
        "name": "身体介護",
        "category": "専門スキル",
        "level": 74
      },
      {
        "name": "家族支援",
        "category": "コミュニケーション",
        "level": 81
      },
      {
        "name": "ケアマネジメント",
        "category": "管理スキル",
        "level": 79
      }
    ],
    "trainingHistory": [
      {
        "name": "介護福祉士実務研修",
        "category": "資格研修",
        "hours": 450,
        "date": "2024年10月",
        "evaluation": "優秀",
        "certificate": true
      },
      {
        "name": "ケアプラン作成研修",
        "category": "専門研修",
        "hours": 16,
        "date": "2023年3月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "介護リーダー研修",
        "category": "リーダー研修",
        "hours": 24,
        "date": "2022年9月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2010年4月",
        "department": "第１病棟",
        "position": "介護福祉士",
        "reason": "新規配属"
      },
      {
        "date": "2015年4月",
        "department": "第１病棟",
        "position": "主任介護福祉士",
        "reason": "昇進"
      }
    ]
  },
  "TR-PT-2024-001": {
    "id": "TR-PT-2024-001",
    "name": "加藤太郎",
    "nameInitial": "加",
    "position": "理学療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-PT-2024-001",
    "joinDate": "2024年4月1日",
    "tenure": "1年3ヶ月",
    "age": 24,
    "birthDate": "2000年12月21日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月23日",
    "healthStatus": "良好",
    "healthScore": 83,
    "stressIndex": 46,
    "engagement": 70,
    "overtime": 9,
    "paidLeaveRate": 61,
    "avatar": "bg-gradient-to-r from-purple-500 to-purple-600",
    "email": "加藤.太郎@tachigami-hp.jp",
    "phone": "080-9197-2714",
    "emergencyContact": "090-1647-4626（兄弟姉妹）",
    "address": "東京都○○区△△3-20-11",
    "evaluationData": {
      "rating": 3.7,
      "performance": 86,
      "skill": 65,
      "teamwork": 96,
      "growth": 5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 3.6,
        "skills": 4.2,
        "teamwork": 3.8,
        "growth": 4.1,
        "evaluator": "リハビリテーション部門 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.4,
        "skills": 4.4,
        "teamwork": 4.3,
        "growth": 4.3,
        "evaluator": "リハビリテーション部門 主任"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 66
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 70
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 78
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 84
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年10月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年11月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年6月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2024年4月",
        "department": "リハビリテーション部門",
        "position": "理学療法士",
        "reason": "新規配属"
      }
    ]
  },
  "TR-PT-2017-002": {
    "id": "TR-PT-2017-002",
    "name": "小林陽太",
    "nameInitial": "小",
    "position": "主任理学療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-PT-2017-002",
    "joinDate": "2017年4月1日",
    "tenure": "8年3ヶ月",
    "age": 25,
    "birthDate": "1999年12月10日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月18日",
    "healthStatus": "良好",
    "healthScore": 91,
    "stressIndex": 50,
    "engagement": 74,
    "overtime": 9,
    "paidLeaveRate": 73,
    "avatar": "bg-gradient-to-r from-purple-500 to-indigo-600",
    "email": "小林.陽太@tachigami-hp.jp",
    "phone": "080-5555-9137",
    "emergencyContact": "090-8429-5664（親）",
    "address": "東京都○○区△△6-2-6",
    "evaluationData": {
      "rating": 4.4,
      "performance": 90,
      "skill": 72,
      "teamwork": 86,
      "growth": 4.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 3.8,
        "skills": 4.8,
        "teamwork": 4.9,
        "growth": 4.1,
        "evaluator": "リハビリテーション部門 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 3.8,
        "skills": 3.4,
        "teamwork": 4,
        "growth": 4.4,
        "evaluator": "リハビリテーション部門 部長"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 79
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 74
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 83
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 74
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年7月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年2月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年3月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2017年4月",
        "department": "リハビリテーション部門",
        "position": "理学療法士",
        "reason": "新規配属"
      },
      {
        "date": "2022年4月",
        "department": "リハビリテーション部門",
        "position": "主任理学療法士",
        "reason": "昇進"
      }
    ]
  },
  "TR-PT-2015-003": {
    "id": "TR-PT-2015-003",
    "name": "鈴木雄一",
    "nameInitial": "鈴",
    "position": "主任理学療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-PT-2015-003",
    "joinDate": "2015年4月1日",
    "tenure": "10年3ヶ月",
    "age": 50,
    "birthDate": "1975年5月4日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月17日",
    "healthStatus": "良好",
    "healthScore": 76,
    "stressIndex": 26,
    "engagement": 80,
    "overtime": 24,
    "paidLeaveRate": 54,
    "avatar": "bg-gradient-to-r from-green-500 to-pink-600",
    "email": "鈴木.雄一@tachigami-hp.jp",
    "phone": "080-2260-7200",
    "emergencyContact": "090-2584-5256（兄弟姉妹）",
    "address": "東京都○○区△△5-19-3",
    "evaluationData": {
      "rating": 4.3,
      "performance": 82,
      "skill": 94,
      "teamwork": 92,
      "growth": 3.7
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.3,
        "skills": 4.6,
        "teamwork": 4.6,
        "growth": 3.6,
        "evaluator": "リハビリテーション部門 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.2,
        "skills": 4.1,
        "teamwork": 4.7,
        "growth": 3.3,
        "evaluator": "リハビリテーション部門 部長"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 63
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 63
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 71
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 95
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年11月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年10月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年10月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2015年4月",
        "department": "リハビリテーション部門",
        "position": "理学療法士",
        "reason": "新規配属"
      },
      {
        "date": "2020年4月",
        "department": "リハビリテーション部門",
        "position": "主任理学療法士",
        "reason": "昇進"
      }
    ]
  },
  "TR-PT-2013-004": {
    "id": "TR-PT-2013-004",
    "name": "山本美咲",
    "nameInitial": "山",
    "position": "リハビリ科長",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-PT-2013-004",
    "joinDate": "2013年4月1日",
    "tenure": "12年3ヶ月",
    "age": 51,
    "birthDate": "1974年6月21日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月16日",
    "healthStatus": "良好",
    "healthScore": 81,
    "stressIndex": 29,
    "engagement": 89,
    "overtime": 17,
    "paidLeaveRate": 42,
    "avatar": "bg-gradient-to-r from-pink-500 to-pink-600",
    "email": "山本.美咲@tachigami-hp.jp",
    "phone": "080-1480-7004",
    "emergencyContact": "090-3415-7010（配偶者）",
    "address": "東京都○○区△△1-8-6",
    "evaluationData": {
      "rating": 4.4,
      "performance": 95,
      "skill": 70,
      "teamwork": 77,
      "growth": 3.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4,
        "skills": 4.6,
        "teamwork": 3.8,
        "growth": 3.7,
        "evaluator": "リハビリテーション部門 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4,
        "skills": 3.5,
        "teamwork": 3.9,
        "growth": 3.9,
        "evaluator": "リハビリテーション部門 部長"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 95
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 82
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 93
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 86
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年12月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年1月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年10月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2013年4月",
        "department": "リハビリテーション部門",
        "position": "理学療法士",
        "reason": "新規配属"
      },
      {
        "date": "2018年4月",
        "department": "リハビリテーション部門",
        "position": "主任理学療法士",
        "reason": "昇進"
      },
      {
        "date": "2023年4月",
        "department": "リハビリテーション部門",
        "position": "リハビリ科長",
        "reason": "昇進"
      }
    ]
  },
  "TR-PT-2010-005": {
    "id": "TR-PT-2010-005",
    "name": "鈴木愛子",
    "nameInitial": "鈴",
    "position": "リハビリ科長",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-PT-2010-005",
    "joinDate": "2010年4月1日",
    "tenure": "15年3ヶ月",
    "age": 46,
    "birthDate": "1979年7月14日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月15日",
    "healthStatus": "良好",
    "healthScore": 84,
    "stressIndex": 42,
    "engagement": 92,
    "overtime": 18,
    "paidLeaveRate": 54,
    "avatar": "bg-gradient-to-r from-purple-500 to-blue-600",
    "email": "鈴木.愛子@tachigami-hp.jp",
    "phone": "080-4021-4627",
    "emergencyContact": "090-8240-4271（配偶者）",
    "address": "東京都○○区△△5-14-4",
    "evaluationData": {
      "rating": 4.6,
      "performance": 70,
      "skill": 74,
      "teamwork": 94,
      "growth": 3.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.5,
        "skills": 3.9,
        "teamwork": 4.2,
        "growth": 3.4,
        "evaluator": "リハビリテーション部門 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.2,
        "skills": 4,
        "teamwork": 4.6,
        "growth": 3.9,
        "evaluator": "リハビリテーション部門 部長"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 87
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 83
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 93
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 80
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年8月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年8月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年8月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2010年4月",
        "department": "リハビリテーション部門",
        "position": "理学療法士",
        "reason": "新規配属"
      },
      {
        "date": "2015年4月",
        "department": "リハビリテーション部門",
        "position": "主任理学療法士",
        "reason": "昇進"
      },
      {
        "date": "2020年4月",
        "department": "リハビリテーション部門",
        "position": "リハビリ科長",
        "reason": "昇進"
      }
    ]
  },
  "TR-PT-2024-006": {
    "id": "TR-PT-2024-006",
    "name": "山本美咲",
    "nameInitial": "山",
    "position": "理学療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-PT-2024-006",
    "joinDate": "2024年4月1日",
    "tenure": "1年3ヶ月",
    "age": 27,
    "birthDate": "1998年2月4日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月28日",
    "healthStatus": "要注意",
    "healthScore": 88,
    "stressIndex": 36,
    "engagement": 84,
    "overtime": 27,
    "paidLeaveRate": 58,
    "avatar": "bg-gradient-to-r from-green-500 to-indigo-600",
    "email": "山本.美咲@tachigami-hp.jp",
    "phone": "080-3518-2973",
    "emergencyContact": "090-7749-6697（親）",
    "address": "東京都○○区△△7-11-15",
    "evaluationData": {
      "rating": 4.3,
      "performance": 72,
      "skill": 89,
      "teamwork": 82,
      "growth": 4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.7,
        "skills": 4.2,
        "teamwork": 4.9,
        "growth": 3.5,
        "evaluator": "リハビリテーション部門 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 3.9,
        "skills": 3.5,
        "teamwork": 4.7,
        "growth": 4.2,
        "evaluator": "リハビリテーション部門 主任"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 95
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 80
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 88
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 60
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年5月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年9月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年2月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2024年4月",
        "department": "リハビリテーション部門",
        "position": "理学療法士",
        "reason": "新規配属"
      }
    ]
  },
  "TR-PT-2009-007": {
    "id": "TR-PT-2009-007",
    "name": "伊藤由美",
    "nameInitial": "伊",
    "position": "リハビリ科長",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-PT-2009-007",
    "joinDate": "2009年4月1日",
    "tenure": "16年3ヶ月",
    "age": 68,
    "birthDate": "1956年10月6日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月1日",
    "healthStatus": "良好",
    "healthScore": 83,
    "stressIndex": 36,
    "engagement": 92,
    "overtime": 12,
    "paidLeaveRate": 51,
    "avatar": "bg-gradient-to-r from-purple-500 to-purple-600",
    "email": "伊藤.由美@tachigami-hp.jp",
    "phone": "080-4869-2009",
    "emergencyContact": "090-8045-7562（兄弟姉妹）",
    "address": "東京都○○区△△4-19-12",
    "evaluationData": {
      "rating": 4.2,
      "performance": 70,
      "skill": 88,
      "teamwork": 92,
      "growth": 3.4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.4,
        "skills": 3.9,
        "teamwork": 4.6,
        "growth": 3.1,
        "evaluator": "リハビリテーション部門 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.4,
        "skills": 4.7,
        "teamwork": 4.1,
        "growth": 2.8,
        "evaluator": "リハビリテーション部門 部長"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 85
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 94
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 61
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 91
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年12月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年8月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年10月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2009年4月",
        "department": "リハビリテーション部門",
        "position": "理学療法士",
        "reason": "新規配属"
      },
      {
        "date": "2014年4月",
        "department": "リハビリテーション部門",
        "position": "主任理学療法士",
        "reason": "昇進"
      },
      {
        "date": "2019年4月",
        "department": "リハビリテーション部門",
        "position": "リハビリ科長",
        "reason": "昇進"
      }
    ]
  },
  "TR-PT-2022-008": {
    "id": "TR-PT-2022-008",
    "name": "加藤由美",
    "nameInitial": "加",
    "position": "理学療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-PT-2022-008",
    "joinDate": "2022年4月1日",
    "tenure": "3年3ヶ月",
    "age": 23,
    "birthDate": "2002年7月11日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月14日",
    "healthStatus": "良好",
    "healthScore": 75,
    "stressIndex": 58,
    "engagement": 84,
    "overtime": 17,
    "paidLeaveRate": 65,
    "avatar": "bg-gradient-to-r from-green-500 to-blue-600",
    "email": "加藤.由美@tachigami-hp.jp",
    "phone": "080-5803-7018",
    "emergencyContact": "090-9852-7044（親）",
    "address": "東京都○○区△△8-1-11",
    "evaluationData": {
      "rating": 3.6,
      "performance": 95,
      "skill": 82,
      "teamwork": 88,
      "growth": 4.5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 3.9,
        "skills": 4.2,
        "teamwork": 4.2,
        "growth": 4.2,
        "evaluator": "リハビリテーション部門 主任"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.2,
        "skills": 3.5,
        "teamwork": 4.4,
        "growth": 4.7,
        "evaluator": "リハビリテーション部門 主任"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 67
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 71
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 83
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 79
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年11月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年6月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年3月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2022年4月",
        "department": "リハビリテーション部門",
        "position": "理学療法士",
        "reason": "新規配属"
      }
    ]
  },
  "TR-PT-2004-009": {
    "id": "TR-PT-2004-009",
    "name": "鈴木悠斗",
    "nameInitial": "鈴",
    "position": "リハビリ科長",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-PT-2004-009",
    "joinDate": "2004年4月1日",
    "tenure": "21年3ヶ月",
    "age": 64,
    "birthDate": "1961年1月17日",
    "evaluation": "C",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月10日",
    "healthStatus": "良好",
    "healthScore": 72,
    "stressIndex": 44,
    "engagement": 86,
    "overtime": 12,
    "paidLeaveRate": 47,
    "avatar": "bg-gradient-to-r from-purple-500 to-indigo-600",
    "email": "鈴木.悠斗@tachigami-hp.jp",
    "phone": "080-6191-4682",
    "emergencyContact": "090-9568-2883（親）",
    "address": "東京都○○区△△7-7-8",
    "evaluationData": {
      "rating": 4.4,
      "performance": 76,
      "skill": 92,
      "teamwork": 97,
      "growth": 3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "C",
        "performance": 4.3,
        "skills": 3.6,
        "teamwork": 4.4,
        "growth": 3.3,
        "evaluator": "リハビリテーション部門 部長"
      },
      {
        "period": "2024年上期",
        "overall": "C",
        "performance": 4.4,
        "skills": 4.5,
        "teamwork": 3.9,
        "growth": 2.9,
        "evaluator": "リハビリテーション部門 部長"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 83
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 90
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 85
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 94
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年7月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年12月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年12月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2004年4月",
        "department": "リハビリテーション部門",
        "position": "理学療法士",
        "reason": "新規配属"
      },
      {
        "date": "2009年4月",
        "department": "リハビリテーション部門",
        "position": "主任理学療法士",
        "reason": "昇進"
      },
      {
        "date": "2014年4月",
        "department": "リハビリテーション部門",
        "position": "リハビリ科長",
        "reason": "昇進"
      }
    ]
  },
  "TR-PT-2002-010": {
    "id": "TR-PT-2002-010",
    "name": "渡辺麻衣",
    "nameInitial": "渡",
    "position": "リハビリ科長",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-PT-2002-010",
    "joinDate": "2002年4月1日",
    "tenure": "23年3ヶ月",
    "age": 64,
    "birthDate": "1960年10月18日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月25日",
    "healthStatus": "良好",
    "healthScore": 84,
    "stressIndex": 31,
    "engagement": 85,
    "overtime": 20,
    "paidLeaveRate": 45,
    "avatar": "bg-gradient-to-r from-pink-500 to-blue-600",
    "email": "渡辺.麻衣@tachigami-hp.jp",
    "phone": "080-7171-9853",
    "emergencyContact": "090-1152-6970（兄弟姉妹）",
    "address": "東京都○○区△△1-8-4",
    "evaluationData": {
      "rating": 4.5,
      "performance": 81,
      "skill": 66,
      "teamwork": 73,
      "growth": 2.5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 5,
        "skills": 4.3,
        "teamwork": 4.4,
        "growth": 3,
        "evaluator": "リハビリテーション部門 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.5,
        "skills": 3.7,
        "teamwork": 3.7,
        "growth": 3.2,
        "evaluator": "リハビリテーション部門 部長"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 61
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 74
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 78
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 86
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年2月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年2月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年10月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2002年4月",
        "department": "リハビリテーション部門",
        "position": "理学療法士",
        "reason": "新規配属"
      },
      {
        "date": "2007年4月",
        "department": "リハビリテーション部門",
        "position": "主任理学療法士",
        "reason": "昇進"
      },
      {
        "date": "2012年4月",
        "department": "リハビリテーション部門",
        "position": "リハビリ科長",
        "reason": "昇進"
      }
    ]
  },
  "TR-PT-2020-011": {
    "id": "TR-PT-2020-011",
    "name": "小林由美",
    "nameInitial": "小",
    "position": "理学療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-PT-2020-011",
    "joinDate": "2020年4月1日",
    "tenure": "5年3ヶ月",
    "age": 23,
    "birthDate": "2002年3月8日",
    "evaluation": "S",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月19日",
    "healthStatus": "良好",
    "healthScore": 83,
    "stressIndex": 52,
    "engagement": 78,
    "overtime": 20,
    "paidLeaveRate": 78,
    "avatar": "bg-gradient-to-r from-indigo-500 to-indigo-600",
    "email": "小林.由美@tachigami-hp.jp",
    "phone": "080-2896-4135",
    "emergencyContact": "090-9389-1956（配偶者）",
    "address": "東京都○○区△△4-4-8",
    "evaluationData": {
      "rating": 3.7,
      "performance": 90,
      "skill": 84,
      "teamwork": 93,
      "growth": 4.4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "S",
        "performance": 4,
        "skills": 4.4,
        "teamwork": 4.4,
        "growth": 5,
        "evaluator": "リハビリテーション部門 主任"
      },
      {
        "period": "2024年上期",
        "overall": "S",
        "performance": 4.5,
        "skills": 3.8,
        "teamwork": 4.6,
        "growth": 4.4,
        "evaluator": "リハビリテーション部門 主任"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 88
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 89
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 68
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 60
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年8月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年1月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年9月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2020年4月",
        "department": "リハビリテーション部門",
        "position": "理学療法士",
        "reason": "新規配属"
      }
    ]
  },
  "TR-PT-2020-012": {
    "id": "TR-PT-2020-012",
    "name": "加藤花子",
    "nameInitial": "加",
    "position": "理学療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-PT-2020-012",
    "joinDate": "2020年4月1日",
    "tenure": "5年3ヶ月",
    "age": 40,
    "birthDate": "1985年7月22日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月7日",
    "healthStatus": "良好",
    "healthScore": 82,
    "stressIndex": 54,
    "engagement": 79,
    "overtime": 26,
    "paidLeaveRate": 67,
    "avatar": "bg-gradient-to-r from-purple-500 to-indigo-600",
    "email": "加藤.花子@tachigami-hp.jp",
    "phone": "080-5309-1287",
    "emergencyContact": "090-9325-2982（親）",
    "address": "東京都○○区△△4-18-4",
    "evaluationData": {
      "rating": 4.8,
      "performance": 94,
      "skill": 78,
      "teamwork": 82,
      "growth": 3.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4,
        "skills": 4.6,
        "teamwork": 3.9,
        "growth": 3.8,
        "evaluator": "リハビリテーション部門 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.4,
        "skills": 4.3,
        "teamwork": 3.7,
        "growth": 4.4,
        "evaluator": "リハビリテーション部門 主任"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 76
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 72
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 88
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 82
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年10月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年7月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年12月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2020年4月",
        "department": "リハビリテーション部門",
        "position": "理学療法士",
        "reason": "新規配属"
      }
    ]
  },
  "TR-PT-2024-013": {
    "id": "TR-PT-2024-013",
    "name": "中村千尋",
    "nameInitial": "中",
    "position": "理学療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-PT-2024-013",
    "joinDate": "2024年4月1日",
    "tenure": "1年3ヶ月",
    "age": 27,
    "birthDate": "1998年6月14日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月8日",
    "healthStatus": "良好",
    "healthScore": 72,
    "stressIndex": 42,
    "engagement": 86,
    "overtime": 26,
    "paidLeaveRate": 68,
    "avatar": "bg-gradient-to-r from-purple-500 to-purple-600",
    "email": "中村.千尋@tachigami-hp.jp",
    "phone": "080-9429-9333",
    "emergencyContact": "090-7880-6297（配偶者）",
    "address": "東京都○○区△△2-9-14",
    "evaluationData": {
      "rating": 4.8,
      "performance": 77,
      "skill": 72,
      "teamwork": 77,
      "growth": 3.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.7,
        "skills": 3.9,
        "teamwork": 4,
        "growth": 4.2,
        "evaluator": "リハビリテーション部門 主任"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.3,
        "skills": 3.9,
        "teamwork": 4.7,
        "growth": 4,
        "evaluator": "リハビリテーション部門 主任"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 63
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 68
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 65
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 91
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年9月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年10月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年11月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2024年4月",
        "department": "リハビリテーション部門",
        "position": "理学療法士",
        "reason": "新規配属"
      }
    ]
  },
  "TR-PT-2020-014": {
    "id": "TR-PT-2020-014",
    "name": "渡辺愛子",
    "nameInitial": "渡",
    "position": "理学療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-PT-2020-014",
    "joinDate": "2020年4月1日",
    "tenure": "5年3ヶ月",
    "age": 31,
    "birthDate": "1993年10月28日",
    "evaluation": "S",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月9日",
    "healthStatus": "良好",
    "healthScore": 89,
    "stressIndex": 32,
    "engagement": 87,
    "overtime": 28,
    "paidLeaveRate": 61,
    "avatar": "bg-gradient-to-r from-purple-500 to-indigo-600",
    "email": "渡辺.愛子@tachigami-hp.jp",
    "phone": "080-5599-1238",
    "emergencyContact": "090-8283-6381（親）",
    "address": "東京都○○区△△4-12-2",
    "evaluationData": {
      "rating": 4.3,
      "performance": 84,
      "skill": 71,
      "teamwork": 93,
      "growth": 3.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "S",
        "performance": 4.2,
        "skills": 3.6,
        "teamwork": 4.5,
        "growth": 3.6,
        "evaluator": "リハビリテーション部門 主任"
      },
      {
        "period": "2024年上期",
        "overall": "S",
        "performance": 4.8,
        "skills": 4.5,
        "teamwork": 4.4,
        "growth": 3.6,
        "evaluator": "リハビリテーション部門 主任"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 90
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 67
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 88
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 93
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年10月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年3月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年8月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2020年4月",
        "department": "リハビリテーション部門",
        "position": "理学療法士",
        "reason": "新規配属"
      }
    ]
  },
  "TR-PT-2006-015": {
    "id": "TR-PT-2006-015",
    "name": "中村大輔",
    "nameInitial": "中",
    "position": "リハビリ科長",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-PT-2006-015",
    "joinDate": "2006年4月1日",
    "tenure": "19年3ヶ月",
    "age": 68,
    "birthDate": "1957年7月8日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月28日",
    "healthStatus": "良好",
    "healthScore": 76,
    "stressIndex": 45,
    "engagement": 87,
    "overtime": 11,
    "paidLeaveRate": 59,
    "avatar": "bg-gradient-to-r from-pink-500 to-purple-600",
    "email": "中村.大輔@tachigami-hp.jp",
    "phone": "080-6467-8344",
    "emergencyContact": "090-8584-6617（配偶者）",
    "address": "東京都○○区△△8-16-2",
    "evaluationData": {
      "rating": 4.7,
      "performance": 79,
      "skill": 69,
      "teamwork": 74,
      "growth": 3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.9,
        "skills": 3.9,
        "teamwork": 4,
        "growth": 2.8,
        "evaluator": "リハビリテーション部門 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.5,
        "skills": 3.8,
        "teamwork": 4,
        "growth": 3.4,
        "evaluator": "リハビリテーション部門 部長"
      }
    ],
    "skills": [
      {
        "name": "運動療法",
        "category": "専門スキル",
        "level": 87
      },
      {
        "name": "評価技術",
        "category": "専門スキル",
        "level": 67
      },
      {
        "name": "物理療法",
        "category": "専門スキル",
        "level": 62
      },
      {
        "name": "患者指導",
        "category": "コミュニケーション",
        "level": 82
      }
    ],
    "trainingHistory": [
      {
        "name": "運動器リハビリテーション研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2024年3月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "脳血管リハビリテーション研修",
        "category": "専門研修",
        "hours": 40,
        "date": "2023年4月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "呼吸器リハビリテーション研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2022年11月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2006年4月",
        "department": "リハビリテーション部門",
        "position": "理学療法士",
        "reason": "新規配属"
      },
      {
        "date": "2011年4月",
        "department": "リハビリテーション部門",
        "position": "主任理学療法士",
        "reason": "昇進"
      },
      {
        "date": "2016年4月",
        "department": "リハビリテーション部門",
        "position": "リハビリ科長",
        "reason": "昇進"
      }
    ]
  },
  "TR-OT-2020-001": {
    "id": "TR-OT-2020-001",
    "name": "山本健太",
    "nameInitial": "山",
    "position": "作業療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-OT-2020-001",
    "joinDate": "2020年4月1日",
    "tenure": "5年3ヶ月",
    "age": 38,
    "birthDate": "1987年3月23日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月4日",
    "healthStatus": "良好",
    "healthScore": 71,
    "stressIndex": 41,
    "engagement": 77,
    "overtime": 22,
    "paidLeaveRate": 53,
    "avatar": "bg-gradient-to-r from-green-500 to-green-600",
    "email": "山本.健太@tachigami-hp.jp",
    "phone": "080-1346-9099",
    "emergencyContact": "090-8879-5595（親）",
    "address": "東京都○○区△△2-2-14",
    "evaluationData": {
      "rating": 4.5,
      "performance": 86,
      "skill": 89,
      "teamwork": 75,
      "growth": 3.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.7,
        "skills": 3.8,
        "teamwork": 3.8,
        "growth": 3.9,
        "evaluator": "リハビリテーション部門 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.6,
        "skills": 4.5,
        "teamwork": 4.4,
        "growth": 3.6,
        "evaluator": "リハビリテーション部門 主任"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 76
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 80
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 94
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 66
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年2月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年4月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年7月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2020年4月",
        "department": "リハビリテーション部門",
        "position": "作業療法士",
        "reason": "新規配属"
      }
    ]
  },
  "TR-OT-2023-002": {
    "id": "TR-OT-2023-002",
    "name": "鈴木由美",
    "nameInitial": "鈴",
    "position": "作業療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-OT-2023-002",
    "joinDate": "2023年4月1日",
    "tenure": "2年3ヶ月",
    "age": 41,
    "birthDate": "1984年3月20日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月15日",
    "healthStatus": "要注意",
    "healthScore": 83,
    "stressIndex": 44,
    "engagement": 84,
    "overtime": 30,
    "paidLeaveRate": 64,
    "avatar": "bg-gradient-to-r from-purple-500 to-green-600",
    "email": "鈴木.由美@tachigami-hp.jp",
    "phone": "080-1251-3465",
    "emergencyContact": "090-4275-1438（兄弟姉妹）",
    "address": "東京都○○区△△7-11-13",
    "evaluationData": {
      "rating": 4.2,
      "performance": 74,
      "skill": 89,
      "teamwork": 72,
      "growth": 4.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.7,
        "skills": 3.9,
        "teamwork": 3.8,
        "growth": 4.1,
        "evaluator": "リハビリテーション部門 主任"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.5,
        "skills": 4.2,
        "teamwork": 4.7,
        "growth": 4,
        "evaluator": "リハビリテーション部門 主任"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 92
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 72
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 76
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 95
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年11月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年10月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年8月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2023年4月",
        "department": "リハビリテーション部門",
        "position": "作業療法士",
        "reason": "新規配属"
      }
    ]
  },
  "TR-OT-2019-003": {
    "id": "TR-OT-2019-003",
    "name": "山本花子",
    "nameInitial": "山",
    "position": "主任作業療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-OT-2019-003",
    "joinDate": "2019年4月1日",
    "tenure": "6年3ヶ月",
    "age": 37,
    "birthDate": "1987年12月8日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月9日",
    "healthStatus": "良好",
    "healthScore": 85,
    "stressIndex": 40,
    "engagement": 75,
    "overtime": 18,
    "paidLeaveRate": 64,
    "avatar": "bg-gradient-to-r from-green-500 to-purple-600",
    "email": "山本.花子@tachigami-hp.jp",
    "phone": "080-5963-2447",
    "emergencyContact": "090-5523-5292（兄弟姉妹）",
    "address": "東京都○○区△△8-8-13",
    "evaluationData": {
      "rating": 3.9,
      "performance": 79,
      "skill": 85,
      "teamwork": 74,
      "growth": 3.6
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 3.8,
        "skills": 4.8,
        "teamwork": 4.3,
        "growth": 3.8,
        "evaluator": "リハビリテーション部門 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.4,
        "skills": 4,
        "teamwork": 4.1,
        "growth": 4.1,
        "evaluator": "リハビリテーション部門 部長"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 76
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 67
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 73
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 71
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年6月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年6月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年6月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2019年4月",
        "department": "リハビリテーション部門",
        "position": "作業療法士",
        "reason": "新規配属"
      },
      {
        "date": "2024年4月",
        "department": "リハビリテーション部門",
        "position": "主任作業療法士",
        "reason": "昇進"
      }
    ]
  },
  "TR-OT-2012-004": {
    "id": "TR-OT-2012-004",
    "name": "山本奈々",
    "nameInitial": "山",
    "position": "主任作業療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-OT-2012-004",
    "joinDate": "2012年4月1日",
    "tenure": "13年3ヶ月",
    "age": 46,
    "birthDate": "1979年6月9日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月24日",
    "healthStatus": "要注意",
    "healthScore": 72,
    "stressIndex": 38,
    "engagement": 83,
    "overtime": 29,
    "paidLeaveRate": 43,
    "avatar": "bg-gradient-to-r from-blue-500 to-pink-600",
    "email": "山本.奈々@tachigami-hp.jp",
    "phone": "080-8641-9298",
    "emergencyContact": "090-8593-7291（兄弟姉妹）",
    "address": "東京都○○区△△8-16-13",
    "evaluationData": {
      "rating": 4.7,
      "performance": 79,
      "skill": 66,
      "teamwork": 94,
      "growth": 3.5
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.9,
        "skills": 3.7,
        "teamwork": 3.9,
        "growth": 3.5,
        "evaluator": "リハビリテーション部門 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.5,
        "skills": 4.6,
        "teamwork": 4.5,
        "growth": 3.5,
        "evaluator": "リハビリテーション部門 部長"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 79
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 88
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 67
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 84
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年11月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年6月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年2月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2012年4月",
        "department": "リハビリテーション部門",
        "position": "作業療法士",
        "reason": "新規配属"
      },
      {
        "date": "2017年4月",
        "department": "リハビリテーション部門",
        "position": "主任作業療法士",
        "reason": "昇進"
      }
    ]
  },
  "TR-OT-2000-005": {
    "id": "TR-OT-2000-005",
    "name": "佐藤愛子",
    "nameInitial": "佐",
    "position": "主任作業療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-OT-2000-005",
    "joinDate": "2000年4月1日",
    "tenure": "25年3ヶ月",
    "age": 67,
    "birthDate": "1957年10月20日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月2日",
    "healthStatus": "良好",
    "healthScore": 78,
    "stressIndex": 41,
    "engagement": 86,
    "overtime": 8,
    "paidLeaveRate": 58,
    "avatar": "bg-gradient-to-r from-purple-500 to-blue-600",
    "email": "佐藤.愛子@tachigami-hp.jp",
    "phone": "080-2781-8731",
    "emergencyContact": "090-6265-2244（親）",
    "address": "東京都○○区△△8-19-2",
    "evaluationData": {
      "rating": 4.9,
      "performance": 90,
      "skill": 87,
      "teamwork": 83,
      "growth": 3.3
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.7,
        "skills": 4.3,
        "teamwork": 4.6,
        "growth": 2.9,
        "evaluator": "リハビリテーション部門 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.7,
        "skills": 3.6,
        "teamwork": 4.2,
        "growth": 3.1,
        "evaluator": "リハビリテーション部門 部長"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 88
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 64
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 61
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 64
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年3月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年4月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年9月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2000年4月",
        "department": "リハビリテーション部門",
        "position": "作業療法士",
        "reason": "新規配属"
      },
      {
        "date": "2005年4月",
        "department": "リハビリテーション部門",
        "position": "主任作業療法士",
        "reason": "昇進"
      }
    ]
  },
  "TR-OT-2017-006": {
    "id": "TR-OT-2017-006",
    "name": "山本千尋",
    "nameInitial": "山",
    "position": "主任作業療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-OT-2017-006",
    "joinDate": "2017年4月1日",
    "tenure": "8年3ヶ月",
    "age": 26,
    "birthDate": "1998年11月4日",
    "evaluation": "C",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月2日",
    "healthStatus": "良好",
    "healthScore": 93,
    "stressIndex": 48,
    "engagement": 78,
    "overtime": 10,
    "paidLeaveRate": 67,
    "avatar": "bg-gradient-to-r from-pink-500 to-indigo-600",
    "email": "山本.千尋@tachigami-hp.jp",
    "phone": "080-9668-4485",
    "emergencyContact": "090-7739-9884（配偶者）",
    "address": "東京都○○区△△1-16-6",
    "evaluationData": {
      "rating": 4.2,
      "performance": 88,
      "skill": 72,
      "teamwork": 70,
      "growth": 4.4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "C",
        "performance": 3.8,
        "skills": 4.7,
        "teamwork": 4.8,
        "growth": 4.4,
        "evaluator": "リハビリテーション部門 部長"
      },
      {
        "period": "2024年上期",
        "overall": "C",
        "performance": 4.1,
        "skills": 3.8,
        "teamwork": 4.7,
        "growth": 4.7,
        "evaluator": "リハビリテーション部門 部長"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 88
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 69
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 89
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 63
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年1月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年6月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年7月",
        "evaluation": "優秀",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2017年4月",
        "department": "リハビリテーション部門",
        "position": "作業療法士",
        "reason": "新規配属"
      },
      {
        "date": "2022年4月",
        "department": "リハビリテーション部門",
        "position": "主任作業療法士",
        "reason": "昇進"
      }
    ]
  },
  "TR-OT-2010-007": {
    "id": "TR-OT-2010-007",
    "name": "高橋奈々",
    "nameInitial": "高",
    "position": "主任作業療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-OT-2010-007",
    "joinDate": "2010年4月1日",
    "tenure": "15年3ヶ月",
    "age": 55,
    "birthDate": "1969年12月13日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月8日",
    "healthStatus": "良好",
    "healthScore": 72,
    "stressIndex": 25,
    "engagement": 81,
    "overtime": 20,
    "paidLeaveRate": 50,
    "avatar": "bg-gradient-to-r from-purple-500 to-pink-600",
    "email": "高橋.奈々@tachigami-hp.jp",
    "phone": "080-3082-2040",
    "emergencyContact": "090-4957-5589（兄弟姉妹）",
    "address": "東京都○○区△△4-11-9",
    "evaluationData": {
      "rating": 4.9,
      "performance": 73,
      "skill": 92,
      "teamwork": 86,
      "growth": 3.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.3,
        "skills": 4.3,
        "teamwork": 3.8,
        "growth": 3.2,
        "evaluator": "リハビリテーション部門 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.7,
        "skills": 3.5,
        "teamwork": 4.6,
        "growth": 3.5,
        "evaluator": "リハビリテーション部門 部長"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 90
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 70
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 77
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 74
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年2月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年10月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年6月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2010年4月",
        "department": "リハビリテーション部門",
        "position": "作業療法士",
        "reason": "新規配属"
      },
      {
        "date": "2015年4月",
        "department": "リハビリテーション部門",
        "position": "主任作業療法士",
        "reason": "昇進"
      }
    ]
  },
  "TR-OT-2009-008": {
    "id": "TR-OT-2009-008",
    "name": "山本優子",
    "nameInitial": "山",
    "position": "主任作業療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-OT-2009-008",
    "joinDate": "2009年4月1日",
    "tenure": "16年3ヶ月",
    "age": 65,
    "birthDate": "1960年3月14日",
    "evaluation": "A",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月24日",
    "healthStatus": "良好",
    "healthScore": 75,
    "stressIndex": 20,
    "engagement": 85,
    "overtime": 8,
    "paidLeaveRate": 60,
    "avatar": "bg-gradient-to-r from-green-500 to-pink-600",
    "email": "山本.優子@tachigami-hp.jp",
    "phone": "080-5617-5004",
    "emergencyContact": "090-6803-9065（親）",
    "address": "東京都○○区△△4-8-1",
    "evaluationData": {
      "rating": 4.4,
      "performance": 85,
      "skill": 85,
      "teamwork": 93,
      "growth": 3.4
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "A",
        "performance": 4.5,
        "skills": 4.5,
        "teamwork": 4.7,
        "growth": 3.3,
        "evaluator": "リハビリテーション部門 部長"
      },
      {
        "period": "2024年上期",
        "overall": "A",
        "performance": 4.5,
        "skills": 4.7,
        "teamwork": 4,
        "growth": 2.7,
        "evaluator": "リハビリテーション部門 部長"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 67
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 88
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 93
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 80
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年10月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年2月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年6月",
        "evaluation": "良好",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2009年4月",
        "department": "リハビリテーション部門",
        "position": "作業療法士",
        "reason": "新規配属"
      },
      {
        "date": "2014年4月",
        "department": "リハビリテーション部門",
        "position": "主任作業療法士",
        "reason": "昇進"
      }
    ]
  },
  "TR-OT-2021-009": {
    "id": "TR-OT-2021-009",
    "name": "加藤悠斗",
    "nameInitial": "加",
    "position": "作業療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-OT-2021-009",
    "joinDate": "2021年4月1日",
    "tenure": "4年3ヶ月",
    "age": 44,
    "birthDate": "1981年1月18日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月27日",
    "healthStatus": "要注意",
    "healthScore": 76,
    "stressIndex": 40,
    "engagement": 94,
    "overtime": 33,
    "paidLeaveRate": 49,
    "avatar": "bg-gradient-to-r from-blue-500 to-blue-600",
    "email": "加藤.悠斗@tachigami-hp.jp",
    "phone": "080-5223-4907",
    "emergencyContact": "090-2269-8670（配偶者）",
    "address": "東京都○○区△△7-18-15",
    "evaluationData": {
      "rating": 4.2,
      "performance": 79,
      "skill": 95,
      "teamwork": 93,
      "growth": 3.2
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.8,
        "skills": 4.4,
        "teamwork": 4.2,
        "growth": 3.8,
        "evaluator": "リハビリテーション部門 主任"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.8,
        "skills": 3.7,
        "teamwork": 4.4,
        "growth": 3.4,
        "evaluator": "リハビリテーション部門 主任"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 81
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 91
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 79
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 88
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年9月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年11月",
        "evaluation": "合格",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年4月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2021年4月",
        "department": "リハビリテーション部門",
        "position": "作業療法士",
        "reason": "新規配属"
      }
    ]
  },
  "TR-OT-2009-010": {
    "id": "TR-OT-2009-010",
    "name": "渡辺優子",
    "nameInitial": "渡",
    "position": "主任作業療法士",
    "department": "リハビリテーション部門",
    "facility": "立神リハビリテーション温泉病院",
    "employeeId": "TR-OT-2009-010",
    "joinDate": "2009年4月1日",
    "tenure": "16年3ヶ月",
    "age": 57,
    "birthDate": "1968年2月19日",
    "evaluation": "B",
    "evaluationPeriod": "2024年下期",
    "nextMeeting": "2025年2月27日",
    "healthStatus": "良好",
    "healthScore": 90,
    "stressIndex": 32,
    "engagement": 86,
    "overtime": 27,
    "paidLeaveRate": 49,
    "avatar": "bg-gradient-to-r from-pink-500 to-green-600",
    "email": "渡辺.優子@tachigami-hp.jp",
    "phone": "080-8900-4039",
    "emergencyContact": "090-7884-2560（兄弟姉妹）",
    "address": "東京都○○区△△6-12-10",
    "evaluationData": {
      "rating": 4.6,
      "performance": 93,
      "skill": 91,
      "teamwork": 79,
      "growth": 3.8
    },
    "evaluationHistory": [
      {
        "period": "2024年下期",
        "overall": "B",
        "performance": 4.1,
        "skills": 3.9,
        "teamwork": 4.3,
        "growth": 3.3,
        "evaluator": "リハビリテーション部門 部長"
      },
      {
        "period": "2024年上期",
        "overall": "B",
        "performance": 4.3,
        "skills": 4.3,
        "teamwork": 4.7,
        "growth": 3.4,
        "evaluator": "リハビリテーション部門 部長"
      }
    ],
    "skills": [
      {
        "name": "日常生活動作訓練",
        "category": "専門スキル",
        "level": 92
      },
      {
        "name": "認知機能評価",
        "category": "専門スキル",
        "level": 79
      },
      {
        "name": "上肢機能訓練",
        "category": "専門スキル",
        "level": 86
      },
      {
        "name": "環境調整",
        "category": "実践スキル",
        "level": 68
      }
    ],
    "trainingHistory": [
      {
        "name": "作業療法評価研修",
        "category": "専門研修",
        "hours": 24,
        "date": "2024年7月",
        "evaluation": "優秀",
        "certificate": false
      },
      {
        "name": "高次脳機能障害研修",
        "category": "専門研修",
        "hours": 32,
        "date": "2023年12月",
        "evaluation": "良好",
        "certificate": false
      },
      {
        "name": "福祉用具選定研修",
        "category": "技術研修",
        "hours": 16,
        "date": "2022年7月",
        "evaluation": "合格",
        "certificate": false
      }
    ],
    "assignmentHistory": [
      {
        "date": "2009年4月",
        "department": "リハビリテーション部門",
        "position": "作業療法士",
        "reason": "新規配属"
      },
      {
        "date": "2014年4月",
        "department": "リハビリテーション部門",
        "position": "主任作業療法士",
        "reason": "昇進"
      }
    ]
  }
};
