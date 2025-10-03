/**
 * 配置状況ダッシュボード用サンプルデータ生成
 * 全5施設・500名分の職員配置データ
 */

import { CareerCourseCode } from '@/types/staff';

export interface DeploymentStaff {
  id: string;
  name: string;
  facilityId: string;
  facilityName: string;
  department: string;
  position: string;
  careerCourse: CareerCourseCode;
  canPerformLeaderDuty: boolean | null; // 看護師・准看護師のみ
  accountLevel: number;
  employeeId: string;
}

// 日本人の姓・名リスト
const lastNames = [
  '佐藤', '鈴木', '高橋', '田中', '渡辺', '伊藤', '山本', '中村', '小林', '加藤',
  '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '斎藤', '清水',
  '山崎', '森', '池田', '橋本', '阿部', '石川', '山下', '中島', '小川', '前田'
];

const firstNames = [
  '太郎', '次郎', '三郎', '花子', '美咲', '健太', '翔太', '大輔', '拓也', '裕子',
  '智子', '恵子', '由美', '麻衣', '優子', '直樹', '和也', '良太', '真理子', '千春',
  '愛', '陽菜', '結衣', '颯太', '蓮', '葵', '樹', '誠', '勇気', '美里'
];

// ランダム生成ヘルパー
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomName(): string {
  return `${randomElement(lastNames)} ${randomElement(firstNames)}`;
}

function randomCourse(): CareerCourseCode {
  const courses: CareerCourseCode[] = ['A', 'B', 'C', 'D'];
  const weights = [0.15, 0.30, 0.35, 0.20]; // A:15%, B:30%, C:35%, D:20%
  const rand = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (rand < sum) return courses[i];
  }
  return 'C';
}

// 施設別データ生成

// 小原病院 (420名)
function generateObaraHospitalStaff(): DeploymentStaff[] {
  const staff: DeploymentStaff[] = [];
  let idCounter = 1;

  // 看護部 (180名)
  const nursingDepts = [
    { dept: '第1病棟', count: 35, positions: ['病棟師長', '副師長', '主任看護師', '看護師', '准看護師'] },
    { dept: '第2病棟', count: 35, positions: ['病棟師長', '副師長', '主任看護師', '看護師', '准看護師'] },
    { dept: '第3病棟', count: 30, positions: ['副師長', '主任看護師', '看護師', '准看護師'] },
    { dept: '外来', count: 25, positions: ['外来師長', '主任看護師', '看護師', '准看護師'] },
    { dept: '手術室', count: 20, positions: ['主任看護師', '看護師'] },
    { dept: '救急外来', count: 20, positions: ['主任看護師', '看護師'] },
    { dept: '看護部管理', count: 15, positions: ['看護部長', '教育師長', '副師長', '主任看護師'] }
  ];

  nursingDepts.forEach(({ dept, count, positions }) => {
    for (let i = 0; i < count; i++) {
      const position = randomElement(positions);
      const isNurse = position.includes('看護師');
      staff.push({
        id: `obara-${idCounter++}`,
        name: randomName(),
        facilityId: 'obara-hospital',
        facilityName: '医療法人 厚生会 小原病院',
        department: dept,
        position,
        careerCourse: randomCourse(),
        canPerformLeaderDuty: isNurse ? Math.random() > 0.3 : null,
        accountLevel: position.includes('部長') ? 10 : position.includes('師長') ? 7 : position.includes('副師長') ? 6 : position.includes('主任') ? 5 : 3,
        employeeId: `OB-N-${String(idCounter).padStart(4, '0')}`
      });
    }
  });

  // 医局 (45名)
  const medicalDepts = [
    { dept: '脳神経外科', count: 8, positions: ['脳神経外科部長', '医師'] },
    { dept: '外科', count: 6, positions: ['外科部長', '医師'] },
    { dept: '循環器内科', count: 7, positions: ['循環器内科部長', '医師'] },
    { dept: '消化器内科', count: 6, positions: ['消化器内科部長', '医師'] },
    { dept: '整形外科', count: 6, positions: ['医師'] },
    { dept: '内科', count: 8, positions: ['医師'] },
    { dept: '医局管理', count: 4, positions: ['医局長', '医師'] }
  ];

  medicalDepts.forEach(({ dept, count, positions }) => {
    for (let i = 0; i < count; i++) {
      const position = randomElement(positions);
      staff.push({
        id: `obara-${idCounter++}`,
        name: randomName(),
        facilityId: 'obara-hospital',
        facilityName: '医療法人 厚生会 小原病院',
        department: dept,
        position,
        careerCourse: randomCourse(),
        canPerformLeaderDuty: null,
        accountLevel: position.includes('部長') || position.includes('医局長') ? 10 : 8,
        employeeId: `OB-D-${String(idCounter).padStart(4, '0')}`
      });
    }
  });

  // 診療技術部 (65名)
  const techDepts = [
    { dept: '放射線科', count: 12, positions: ['診療放射線科長', '診療放射線技師'] },
    { dept: '検査科', count: 15, positions: ['臨床検査科長', '臨床検査技師'] },
    { dept: '薬剤部', count: 15, positions: ['薬剤部長', '薬剤師'] },
    { dept: '栄養科', count: 8, positions: ['栄養科長', '管理栄養士', '栄養士'] },
    { dept: 'リハビリ科', count: 15, positions: ['リハビリテーション科長', '理学療法士', '作業療法士'] }
  ];

  techDepts.forEach(({ dept, count, positions }) => {
    for (let i = 0; i < count; i++) {
      const position = randomElement(positions);
      staff.push({
        id: `obara-${idCounter++}`,
        name: randomName(),
        facilityId: 'obara-hospital',
        facilityName: '医療法人 厚生会 小原病院',
        department: dept,
        position,
        careerCourse: randomCourse(),
        canPerformLeaderDuty: null,
        accountLevel: position.includes('部長') || position.includes('科長') ? 8 : 5,
        employeeId: `OB-T-${String(idCounter).padStart(4, '0')}`
      });
    }
  });

  // 事務部門 (65名)
  const adminDepts = [
    { dept: '総務課', count: 20, positions: ['総務課長', '総務課主任', '事務職員'] },
    { dept: '医事課', count: 15, positions: ['医事課長', '医事課主任', '医事職員'] },
    { dept: '経理課', count: 12, positions: ['経理課主任', '経理職員'] },
    { dept: '人事課', count: 10, positions: ['人事課主任', '人事職員'] },
    { dept: '施設管理課', count: 8, positions: ['施設管理職員'] }
  ];

  adminDepts.forEach(({ dept, count, positions }) => {
    for (let i = 0; i < count; i++) {
      const position = randomElement(positions);
      staff.push({
        id: `obara-${idCounter++}`,
        name: randomName(),
        facilityId: 'obara-hospital',
        facilityName: '医療法人 厚生会 小原病院',
        department: dept,
        position,
        careerCourse: randomCourse(),
        canPerformLeaderDuty: null,
        accountLevel: position.includes('課長') ? 7 : position.includes('主任') ? 5 : 3,
        employeeId: `OB-A-${String(idCounter).padStart(4, '0')}`
      });
    }
  });

  // その他 (65名 - 残り調整)
  const remaining = 420 - staff.length;
  for (let i = 0; i < remaining; i++) {
    staff.push({
      id: `obara-${idCounter++}`,
      name: randomName(),
      facilityId: 'obara-hospital',
      facilityName: '医療法人 厚生会 小原病院',
      department: randomElement(['第1病棟', '第2病棟', '外来', '検査科', '総務課']),
      position: randomElement(['看護師', '准看護師', '事務職員', '検査技師']),
      careerCourse: randomCourse(),
      canPerformLeaderDuty: Math.random() > 0.5 ? Math.random() > 0.3 : null,
      accountLevel: 3,
      employeeId: `OB-X-${String(idCounter).padStart(4, '0')}`
    });
  }

  return staff;
}

// 立神リハビリテーション温泉病院 (180名)
function generateTategamiRehabStaff(): DeploymentStaff[] {
  const staff: DeploymentStaff[] = [];
  let idCounter = 1;

  // 看護部 (100名)
  const nursingDepts = [
    { dept: '第1病棟', count: 25, positions: ['第１病棟師長', '主任', '看護師', '准看護師'] },
    { dept: '介護医療院', count: 35, positions: ['介護医療院師長', '介護主任', '看護師', '准看護師', '介護職員'] },
    { dept: '外来', count: 15, positions: ['外来師長', '主任', '看護師', '准看護師'] },
    { dept: '看護部管理', count: 25, positions: ['総師長', '副総師長', '師長', '主任'] }
  ];

  nursingDepts.forEach(({ dept, count, positions }) => {
    for (let i = 0; i < count; i++) {
      const position = randomElement(positions);
      const isNurse = position.includes('看護師');
      staff.push({
        id: `tategami-${idCounter++}`,
        name: randomName(),
        facilityId: 'tategami-rehabilitation',
        facilityName: '立神リハビリテーション温泉病院',
        department: dept,
        position,
        careerCourse: randomCourse(),
        canPerformLeaderDuty: isNurse ? Math.random() > 0.3 : null,
        accountLevel: position.includes('総師長') ? 10 : position.includes('副総師長') ? 9 : position.includes('師長') ? 7 : position.includes('主任') ? 5 : 3,
        employeeId: `TG-N-${String(idCounter).padStart(4, '0')}`
      });
    }
  });

  // 診療技術部 (60名)
  const techDepts = [
    { dept: 'リハビリテーション部', count: 35, positions: ['統括主任', 'リハビリテーション部門主任', '理学療法士', '作業療法士', '言語聴覚士'] },
    { dept: '放射線部', count: 3, positions: ['放射線部門主任', '診療放射線技師'] },
    { dept: '検査部', count: 4, positions: ['検査部門主任', '臨床検査技師'] },
    { dept: '栄養部', count: 5, positions: ['栄養部門主任', '管理栄養士', '栄養士'] },
    { dept: '薬局', count: 5, positions: ['薬局長', '薬剤師'] },
    { dept: '診療技術部管理', count: 8, positions: ['統括主任', 'リハビリテーション部門主任'] }
  ];

  techDepts.forEach(({ dept, count, positions }) => {
    for (let i = 0; i < count; i++) {
      const position = randomElement(positions);
      staff.push({
        id: `tategami-${idCounter++}`,
        name: randomName(),
        facilityId: 'tategami-rehabilitation',
        facilityName: '立神リハビリテーション温泉病院',
        department: dept,
        position,
        careerCourse: randomCourse(),
        canPerformLeaderDuty: null,
        accountLevel: position.includes('薬局長') ? 8 : position.includes('統括主任') ? 7 : position.includes('主任') ? 5 : 3,
        employeeId: `TG-T-${String(idCounter).padStart(4, '0')}`
      });
    }
  });

  // 事務部門 (20名)
  const adminDepts = [
    { dept: '事務部', count: 8, positions: ['事務長', '事務職員'] },
    { dept: '総務課', count: 8, positions: ['総務課主任', '総務職員'] },
    { dept: '医事課', count: 4, positions: ['医事課主任', '医事職員'] }
  ];

  adminDepts.forEach(({ dept, count, positions }) => {
    for (let i = 0; i < count; i++) {
      const position = randomElement(positions);
      staff.push({
        id: `tategami-${idCounter++}`,
        name: randomName(),
        facilityId: 'tategami-rehabilitation',
        facilityName: '立神リハビリテーション温泉病院',
        department: dept,
        position,
        careerCourse: randomCourse(),
        canPerformLeaderDuty: null,
        accountLevel: position.includes('事務長') ? 11 : position.includes('主任') ? 5 : 3,
        employeeId: `TG-A-${String(idCounter).padStart(4, '0')}`
      });
    }
  });

  return staff;
}

// エスポワール立神 (150名)
function generateEspoirTategamiStaff(): DeploymentStaff[] {
  const staff: DeploymentStaff[] = [];
  let idCounter = 1;

  // 入所課 (70名)
  const nyusho = [
    { dept: '看護部', count: 20, positions: ['看護師長', '看護主任', '看護師', '准看護師'] },
    { dept: '介護部Aフロア', count: 12, positions: ['介護部Aフロア主任', '介護部Aフロアマネージャー', '介護職員'] },
    { dept: '介護部Bフロア', count: 12, positions: ['介護部Bフロア主任', '介護部Bフロアマネージャー', '介護職員'] },
    { dept: '介護部Cフロア', count: 12, positions: ['介護部Cフロア主任', '介護部Cフロアマネージャー', '介護職員'] },
    { dept: '支援相談部', count: 8, positions: ['支援相談室長', '相談員'] },
    { dept: 'ケアプラン管理部', count: 6, positions: ['ケアプラン管理部リーダー', 'ケアマネージャー'] }
  ];

  nyusho.forEach(({ dept, count, positions }) => {
    for (let i = 0; i < count; i++) {
      const position = randomElement(positions);
      const isNurse = position.includes('看護師');
      staff.push({
        id: `espoir-${idCounter++}`,
        name: randomName(),
        facilityId: 'espoir-tategami',
        facilityName: '介護老人保健施設エスポワール立神',
        department: dept,
        position,
        careerCourse: randomCourse(),
        canPerformLeaderDuty: isNurse ? Math.random() > 0.3 : null,
        accountLevel: position.includes('師長') || position.includes('室長') ? 10 : position.includes('主任') || position.includes('リーダー') || position.includes('マネージャー') ? 5 : 3,
        employeeId: `EP-I-${String(idCounter).padStart(4, '0')}`
      });
    }
  });

  // 在宅課 (50名)
  const zaitaku = [
    { dept: '通所リハビリテーション事業所', count: 15, positions: ['通所リハビリテーション事業所管理者', '通所リハビリテーション主任', '介護職員', '理学療法士'] },
    { dept: '訪問介護事業所', count: 8, positions: ['訪問介護事業所管理者', '訪問介護員'] },
    { dept: '居宅介護支援事業所', count: 10, positions: ['居宅介護支援事業所管理者', '居宅介護支援事業所主任', 'ケアマネージャー'] },
    { dept: '訪問リハビリテーション事業所', count: 6, positions: ['訪問リハビリテーション事業所管理者代行', '理学療法士', '作業療法士'] },
    { dept: 'リハビリテーション部', count: 8, positions: ['リハビリテーション部主任', '理学療法士', '作業療法士'] },
    { dept: '栄養管理部', count: 3, positions: ['栄養管理部主任', '管理栄養士'] }
  ];

  zaitaku.forEach(({ dept, count, positions }) => {
    for (let i = 0; i < count; i++) {
      const position = randomElement(positions);
      staff.push({
        id: `espoir-${idCounter++}`,
        name: randomName(),
        facilityId: 'espoir-tategami',
        facilityName: '介護老人保健施設エスポワール立神',
        department: dept,
        position,
        careerCourse: randomCourse(),
        canPerformLeaderDuty: null,
        accountLevel: position.includes('管理者') ? 10 : position.includes('代行') ? 9 : position.includes('主任') ? 5 : 3,
        employeeId: `EP-Z-${String(idCounter).padStart(4, '0')}`
      });
    }
  });

  // 事務部・経営層 (30名)
  const admin = [
    { dept: '施設管理', count: 3, positions: ['施設長', '入所課課長', '在宅課課長'] },
    { dept: '事務部', count: 27, positions: ['事務長', '事務主任', '事務職員'] }
  ];

  admin.forEach(({ dept, count, positions }) => {
    for (let i = 0; i < count; i++) {
      const position = randomElement(positions);
      staff.push({
        id: `espoir-${idCounter++}`,
        name: randomName(),
        facilityId: 'espoir-tategami',
        facilityName: '介護老人保健施設エスポワール立神',
        department: dept,
        position,
        careerCourse: randomCourse(),
        canPerformLeaderDuty: null,
        accountLevel: position.includes('施設長') ? 13 : position.includes('課長') || position.includes('事務長') ? 11 : position.includes('主任') ? 5 : 3,
        employeeId: `EP-A-${String(idCounter).padStart(4, '0')}`
      });
    }
  });

  return staff;
}

// グループホーム宝寿庵 (30名)
function generateGroupHomeHojuanStaff(): DeploymentStaff[] {
  const staff: DeploymentStaff[] = [];
  let idCounter = 1;

  const depts = [
    { dept: '管理部', count: 3, positions: ['施設長', '管理者'] },
    { dept: 'ケアプラン部', count: 2, positions: ['計画作成担当者'] },
    { dept: 'ケアユニット1', count: 8, positions: ['ユニットリーダー', '介護職員', '夜勤専従職員'] },
    { dept: 'ケアユニット2', count: 8, positions: ['ユニットリーダー', '介護職員', '夜勤専従職員'] },
    { dept: '介護部', count: 9, positions: ['介護主任', '介護職員', '夜勤専従職員'] }
  ];

  depts.forEach(({ dept, count, positions }) => {
    for (let i = 0; i < count; i++) {
      const position = randomElement(positions);
      staff.push({
        id: `hojuan-${idCounter++}`,
        name: randomName(),
        facilityId: 'group-home-hojuan',
        facilityName: 'グループホーム宝寿庵',
        department: dept,
        position,
        careerCourse: randomCourse(),
        canPerformLeaderDuty: null,
        accountLevel: position.includes('施設長') ? 11 : position.includes('管理者') ? 9 : position.includes('計画作成担当者') ? 7 : position.includes('リーダー') || position.includes('主任') ? 5 : 3,
        employeeId: `HJ-${String(idCounter).padStart(4, '0')}`
      });
    }
  });

  return staff;
}

// 訪問看護ステーション立神 (20名)
function generateVisitingNurseStationStaff(): DeploymentStaff[] {
  const staff: DeploymentStaff[] = [];
  let idCounter = 1;

  const depts = [
    { dept: '管理部', count: 2, positions: ['管理者', '統括責任者'] },
    { dept: '看護部', count: 13, positions: ['主任看護師', '看護師', '准看護師'] },
    { dept: 'リハビリ部', count: 3, positions: ['リハビリスタッフ'] },
    { dept: '事務部', count: 2, positions: ['事務職員'] }
  ];

  depts.forEach(({ dept, count, positions }) => {
    for (let i = 0; i < count; i++) {
      const position = randomElement(positions);
      const isNurse = position.includes('看護師');
      staff.push({
        id: `vns-${idCounter++}`,
        name: randomName(),
        facilityId: 'visiting-nurse-station-tategami',
        facilityName: '訪問看護ステーション立神',
        department: dept,
        position,
        careerCourse: randomCourse(),
        canPerformLeaderDuty: isNurse ? Math.random() > 0.3 : null,
        accountLevel: position.includes('管理者') ? 11 : position.includes('統括責任者') ? 9 : position.includes('主任') ? 7 : 3,
        employeeId: `VN-${String(idCounter).padStart(4, '0')}`
      });
    }
  });

  return staff;
}

// 全施設統合データ生成
export function generateAllFacilitiesStaff(): DeploymentStaff[] {
  return [
    ...generateObaraHospitalStaff(),
    ...generateTategamiRehabStaff(),
    ...generateEspoirTategamiStaff(),
    ...generateGroupHomeHojuanStaff(),
    ...generateVisitingNurseStationStaff()
  ];
}

// 施設ごとの集計データ
export function getFacilitySummary(staff: DeploymentStaff[]) {
  const facilities = new Map<string, {
    facilityId: string;
    facilityName: string;
    totalCount: number;
    byDepartment: Map<string, number>;
    byCourse: Map<CareerCourseCode, number>;
    leaderCapable: number;
  }>();

  staff.forEach(s => {
    if (!facilities.has(s.facilityId)) {
      facilities.set(s.facilityId, {
        facilityId: s.facilityId,
        facilityName: s.facilityName,
        totalCount: 0,
        byDepartment: new Map(),
        byCourse: new Map(),
        leaderCapable: 0
      });
    }

    const fac = facilities.get(s.facilityId)!;
    fac.totalCount++;
    fac.byDepartment.set(s.department, (fac.byDepartment.get(s.department) || 0) + 1);
    fac.byCourse.set(s.careerCourse, (fac.byCourse.get(s.careerCourse) || 0) + 1);
    if (s.canPerformLeaderDuty === true) fac.leaderCapable++;
  });

  return Array.from(facilities.values());
}
