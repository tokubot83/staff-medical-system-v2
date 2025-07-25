"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartmentStaffCount = exports.facilityStaffCount = exports.staffListData = exports.staffDatabase = exports.tachigamiStaffDatabase = exports.obaraStaffDatabase = void 0;
// 小原病院のスタッフデータ
exports.obaraStaffDatabase = {
    // 小原病院 - 看護部
    'OH-NS-2021-001': {
        id: 'OH-NS-2021-001',
        name: '田中美咲',
        nameInitial: '田',
        position: '看護師',
        department: '3階病棟',
        facility: '小原病院',
        employeeId: 'OH-NS-2021-001',
        joinDate: '2021年4月1日',
        tenure: '3年9ヶ月',
        age: 29,
        birthDate: '1995年3月15日',
        evaluation: 'A',
        evaluationPeriod: '2024年下期',
        nextMeeting: '2025年2月10日',
        healthStatus: '良好',
        stressIndex: 40,
        engagement: 88,
        overtime: 15,
        paidLeaveRate: 75,
        avatar: 'bg-gradient-to-r from-blue-500 to-indigo-600',
        email: 'tanaka.misaki@obara-hp.jp',
        phone: '080-1234-5678',
        emergencyContact: '090-8765-4321（配偶者）',
        address: '東京都○○区△△1-2-3',
        evaluationHistory: [
            { period: '2024年下期', overall: 'A', performance: 4.5, skills: 4.3, teamwork: 4.7, growth: 4.4, evaluator: '3階病棟 師長' },
            { period: '2024年上期', overall: 'B+', performance: 4.0, skills: 3.9, teamwork: 4.3, growth: 4.1, evaluator: '3階病棟 師長' },
        ],
        skills: [
            { name: '看護実践能力', level: 4, category: 'JNAラダー' },
            { name: '急性期看護', level: 4, category: '専門技術' },
            { name: 'チーム医療', level: 4, category: '連携' },
        ],
        trainingHistory: [
            { name: '急性期看護研修', date: '2024年10月', category: '専門技術', hours: 16, evaluation: '優秀', certificate: true },
            { name: '医療安全研修', date: '2024年8月', category: '安全管理', hours: 4, evaluation: '良好', certificate: true },
        ],
        assignmentHistory: [
            { date: '2021年4月1日', department: '3階病棟', position: '看護師', reason: '新卒配属' },
        ],
    },
    // 小原病院 - 診療技術部
    'OH-PT-2020-015': {
        id: 'OH-PT-2020-015',
        name: '山田健太',
        nameInitial: '山',
        position: '理学療法士',
        department: '理学療法室',
        facility: '小原病院',
        employeeId: 'OH-PT-2020-015',
        joinDate: '2020年4月1日',
        tenure: '4年9ヶ月',
        age: 30,
        birthDate: '1994年8月20日',
        evaluation: 'B+',
        evaluationPeriod: '2024年下期',
        nextMeeting: '2025年2月15日',
        healthStatus: '良好',
        stressIndex: 35,
        engagement: 90,
        overtime: 10,
        paidLeaveRate: 80,
        avatar: 'bg-gradient-to-r from-green-500 to-teal-600',
        email: 'yamada.kenta@obara-hp.jp',
        phone: '080-2345-6789',
        emergencyContact: '090-7654-3210（妻）',
        address: '東京都○○区△△2-3-4',
        evaluationHistory: [
            { period: '2024年下期', overall: 'B+', performance: 4.1, skills: 4.0, teamwork: 4.2, growth: 4.0, evaluator: '理学療法室 主任' },
            { period: '2024年上期', overall: 'B', performance: 3.8, skills: 3.7, teamwork: 4.0, growth: 3.9, evaluator: '理学療法室 主任' },
        ],
        skills: [
            { name: '運動器リハビリ', level: 4, category: '専門技術' },
            { name: '脳血管リハビリ', level: 3, category: '専門技術' },
            { name: '患者評価', level: 4, category: '基本技術' },
        ],
        trainingHistory: [
            { name: '運動器リハビリ上級研修', date: '2024年9月', category: '専門技術', hours: 20, evaluation: '良好', certificate: true },
            { name: 'リハビリテーション学会参加', date: '2024年6月', category: '学術', hours: 16, evaluation: '参加', certificate: true },
        ],
        assignmentHistory: [
            { date: '2020年4月1日', department: '理学療法室', position: '理学療法士', reason: '新卒配属' },
        ],
    },
    // 小原病院 - 医師
    'OH-DR-2015-003': {
        id: 'OH-DR-2015-003',
        name: '佐藤一郎',
        nameInitial: '佐',
        position: '医師',
        department: '循環器内科',
        facility: '小原病院',
        employeeId: 'OH-DR-2015-003',
        joinDate: '2015年4月1日',
        tenure: '9年9ヶ月',
        age: 42,
        birthDate: '1982年5月10日',
        evaluation: 'S',
        evaluationPeriod: '2024年下期',
        nextMeeting: '2025年3月1日',
        healthStatus: '良好',
        stressIndex: 50,
        engagement: 85,
        overtime: 40,
        paidLeaveRate: 45,
        avatar: 'bg-gradient-to-r from-purple-500 to-pink-600',
        email: 'sato.ichiro@obara-hp.jp',
        phone: '080-3456-7890',
        emergencyContact: '090-6543-2109（妻）',
        address: '東京都○○区△△3-4-5',
        evaluationHistory: [
            { period: '2024年下期', overall: 'S', performance: 4.8, skills: 4.9, teamwork: 4.6, growth: 4.5, evaluator: '循環器内科 部長' },
            { period: '2024年上期', overall: 'A', performance: 4.5, skills: 4.6, teamwork: 4.4, growth: 4.3, evaluator: '循環器内科 部長' },
        ],
        skills: [
            { name: '心臓カテーテル検査', level: 5, category: '専門技術' },
            { name: '心エコー', level: 5, category: '専門技術' },
            { name: '循環器診療', level: 5, category: '専門技術' },
        ],
        trainingHistory: [
            { name: '心臓カテーテル学会', date: '2024年11月', category: '学術', hours: 24, evaluation: '発表', certificate: true },
            { name: '循環器専門医更新研修', date: '2024年9月', category: '専門資格', hours: 30, evaluation: '合格', certificate: true },
        ],
        assignmentHistory: [
            { date: '2020年4月1日', department: '循環器内科', position: '医師', reason: '専門性向上' },
            { date: '2015年4月1日', department: '内科', position: '医師', reason: '中途採用' },
        ],
    },
};
// 立神リハビリテーション温泉病院のスタッフデータ
exports.tachigamiStaffDatabase = {
    // 立神病院 - 看護部門
    'TG-NS-2019-001': {
        id: 'TG-NS-2019-001',
        name: '鈴木花子',
        nameInitial: '鈴',
        position: '看護師',
        department: '第１病棟',
        facility: '立神リハビリテーション温泉病院',
        employeeId: 'TG-NS-2019-001',
        joinDate: '2019年4月1日',
        tenure: '5年9ヶ月',
        age: 32,
        birthDate: '1992年7月25日',
        evaluation: 'A',
        evaluationPeriod: '2024年下期',
        nextMeeting: '2025年2月20日',
        healthStatus: '良好',
        stressIndex: 45,
        engagement: 85,
        overtime: 12,
        paidLeaveRate: 70,
        avatar: 'bg-gradient-to-r from-pink-500 to-rose-600',
        email: 'suzuki.hanako@tachigami-hp.jp',
        phone: '080-4567-8901',
        emergencyContact: '090-5432-1098（母）',
        address: '○○県△△市□□1-2-3',
        evaluationHistory: [
            { period: '2024年下期', overall: 'A', performance: 4.4, skills: 4.3, teamwork: 4.6, growth: 4.2, evaluator: '第１病棟 師長' },
            { period: '2024年上期', overall: 'B+', performance: 4.0, skills: 3.9, teamwork: 4.2, growth: 4.0, evaluator: '第１病棟 師長' },
        ],
        skills: [
            { name: '看護実践能力', level: 4, category: 'JNAラダー' },
            { name: '回復期看護', level: 4, category: '専門技術' },
            { name: '温泉療法支援', level: 3, category: '専門技術' },
        ],
        trainingHistory: [
            { name: '回復期リハビリ看護研修', date: '2024年10月', category: '専門技術', hours: 16, evaluation: '優秀', certificate: true },
            { name: '温泉療法研修', date: '2024年7月', category: '専門技術', hours: 8, evaluation: '良好', certificate: true },
        ],
        assignmentHistory: [
            { date: '2019年4月1日', department: '第１病棟', position: '看護師', reason: '新卒配属' },
        ],
    },
    // 立神病院 - リハビリテーション部門
    'TG-PT-2018-010': {
        id: 'TG-PT-2018-010',
        name: '高橋太郎',
        nameInitial: '高',
        position: '理学療法士',
        department: 'リハビリテーション部門',
        facility: '立神リハビリテーション温泉病院',
        employeeId: 'TG-PT-2018-010',
        joinDate: '2018年4月1日',
        tenure: '6年9ヶ月',
        age: 35,
        birthDate: '1989年9月15日',
        evaluation: 'S',
        evaluationPeriod: '2024年下期',
        nextMeeting: '2025年3月5日',
        healthStatus: '良好',
        stressIndex: 38,
        engagement: 92,
        overtime: 8,
        paidLeaveRate: 85,
        avatar: 'bg-gradient-to-r from-teal-500 to-cyan-600',
        email: 'takahashi.taro@tachigami-hp.jp',
        phone: '080-5678-9012',
        emergencyContact: '090-4321-0987（妻）',
        address: '○○県△△市□□2-3-4',
        evaluationHistory: [
            { period: '2024年下期', overall: 'S', performance: 4.7, skills: 4.8, teamwork: 4.6, growth: 4.5, evaluator: 'リハビリテーション部門 統括主任' },
            { period: '2024年上期', overall: 'A', performance: 4.5, skills: 4.5, teamwork: 4.4, growth: 4.3, evaluator: 'リハビリテーション部門 統括主任' },
        ],
        skills: [
            { name: '脳血管リハビリ', level: 5, category: '専門技術' },
            { name: '運動器リハビリ', level: 5, category: '専門技術' },
            { name: '温泉リハビリ', level: 4, category: '専門技術' },
            { name: '後輩指導', level: 4, category: '管理スキル' },
        ],
        trainingHistory: [
            { name: '温泉リハビリテーション専門研修', date: '2024年11月', category: '専門技術', hours: 24, evaluation: '優秀', certificate: true },
            { name: 'リハビリ指導者研修', date: '2024年8月', category: '管理・指導', hours: 16, evaluation: '優秀', certificate: true },
        ],
        assignmentHistory: [
            { date: '2022年4月1日', department: 'リハビリテーション部門', position: '理学療法士（リーダー）', reason: '昇格' },
            { date: '2018年4月1日', department: 'リハビリテーション部門', position: '理学療法士', reason: '新卒配属' },
        ],
    },
    // 立神病院 - 介護医療院
    'TG-CW-2020-005': {
        id: 'TG-CW-2020-005',
        name: '伊藤美香',
        nameInitial: '伊',
        position: '介護職員',
        department: '介護医療院',
        facility: '立神リハビリテーション温泉病院',
        employeeId: 'TG-CW-2020-005',
        joinDate: '2020年4月1日',
        tenure: '4年9ヶ月',
        age: 28,
        birthDate: '1996年2月10日',
        evaluation: 'B+',
        evaluationPeriod: '2024年下期',
        nextMeeting: '2025年2月25日',
        healthStatus: '良好',
        stressIndex: 42,
        engagement: 86,
        overtime: 15,
        paidLeaveRate: 75,
        avatar: 'bg-gradient-to-r from-yellow-500 to-amber-600',
        email: 'ito.mika@tachigami-hp.jp',
        phone: '080-6789-0123',
        emergencyContact: '090-3210-9876（父）',
        address: '○○県△△市□□3-4-5',
        evaluationHistory: [
            { period: '2024年下期', overall: 'B+', performance: 4.0, skills: 3.9, teamwork: 4.3, growth: 4.1, evaluator: '介護医療院 介護主任' },
            { period: '2024年上期', overall: 'B', performance: 3.7, skills: 3.6, teamwork: 4.0, growth: 3.8, evaluator: '介護医療院 介護主任' },
        ],
        skills: [
            { name: '身体介護', level: 4, category: '基本技術' },
            { name: '認知症ケア', level: 4, category: '専門技術' },
            { name: 'レクリエーション', level: 3, category: '支援技術' },
        ],
        trainingHistory: [
            { name: '認知症ケア実践者研修', date: '2024年9月', category: '専門技術', hours: 30, evaluation: '修了', certificate: true },
            { name: '介護技術向上研修', date: '2024年6月', category: '基本技術', hours: 12, evaluation: '良好', certificate: true },
        ],
        assignmentHistory: [
            { date: '2020年4月1日', department: '介護医療院', position: '介護職員', reason: '新卒配属' },
        ],
    },
};
// 全スタッフデータベース（両病院統合）
exports.staffDatabase = __assign(__assign({}, exports.obaraStaffDatabase), exports.tachigamiStaffDatabase);
// スタッフ一覧データ（ダッシュボード用）
exports.staffListData = Object.values(exports.staffDatabase).map(function (staff) { return ({
    id: staff.id,
    name: staff.name,
    nameInitial: staff.nameInitial,
    department: staff.department,
    facility: staff.facility,
    position: staff.position,
    status: staff.evaluation === 'S' || staff.evaluation === 'A' ? 'excellent' :
        staff.evaluation === 'B+' || staff.evaluation === 'B' ? 'good' : 'average',
    priority: staff.stressIndex > 60 ? 'high' :
        staff.stressIndex > 40 ? 'medium' : 'normal',
    avatar: staff.avatar,
    stressIndex: staff.stressIndex,
    engagement: staff.engagement,
}); });
// 施設別スタッフ数の集計
exports.facilityStaffCount = {
    '小原病院': Object.values(exports.obaraStaffDatabase).length,
    '立神リハビリテーション温泉病院': Object.values(exports.tachigamiStaffDatabase).length
};
// 部門別スタッフ数の集計
var getDepartmentStaffCount = function (facility) {
    var targetStaff = facility
        ? Object.values(exports.staffDatabase).filter(function (s) { return s.facility === facility; })
        : Object.values(exports.staffDatabase);
    return targetStaff.reduce(function (acc, staff) {
        acc[staff.department] = (acc[staff.department] || 0) + 1;
        return acc;
    }, {});
};
exports.getDepartmentStaffCount = getDepartmentStaffCount;
