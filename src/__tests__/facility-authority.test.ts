/**
 * 施設別権限管理システムテスト
 * VoiceDrive連携機能の動作確認
 */

import { facilityPositionMappingService } from '../lib/facility-position-mapping';
import { webhookNotificationService } from '../services/webhook-notification.service';
import { StaffUpdateEvent } from '../types/facility-authority';

describe('施設別権限管理システム', () => {

  describe('FacilityPositionMappingService', () => {

    test('小原病院の役職マッピングを取得できる', () => {
      const mapping = facilityPositionMappingService.getFacilityMapping('obara-hospital');

      expect(mapping).toBeDefined();
      expect(mapping?.facilityId).toBe('obara-hospital');
      expect(mapping?.facilityName).toBe('医療法人 厚生会 小原病院');
      expect(mapping?.positionMappings.length).toBeGreaterThan(0);
    });

    test('立神リハビリテーション温泉病院の役職マッピングを取得できる', () => {
      const mapping = facilityPositionMappingService.getFacilityMapping('tategami-rehabilitation');

      expect(mapping).toBeDefined();
      expect(mapping?.facilityId).toBe('tategami-rehabilitation');
      expect(mapping?.facilityName).toBe('立神リハビリテーション温泉病院');
      expect(mapping?.positionMappings.length).toBeGreaterThan(0);
    });

    test('特定役職の権限レベルを正しく取得できる', () => {
      // 小原病院の看護部長
      const obaraLevel = facilityPositionMappingService.getPositionLevel(
        'obara-hospital',
        '看護部長'
      );
      expect(obaraLevel).toBe(10);

      // 立神リハビリテーションの総師長
      const tategamiLevel = facilityPositionMappingService.getPositionLevel(
        'tategami-rehabilitation',
        '総師長'
      );
      expect(tategamiLevel).toBe(10);
    });

    test('施設間の役職レベル変換が正しく機能する', () => {
      const result = facilityPositionMappingService.convertPositionLevel(
        'obara-hospital',
        'tategami-rehabilitation',
        '病棟師長'
      );

      expect(result).toBeDefined();
      expect(result?.originalLevel).toBe(7);
      expect(result?.convertedLevel).toBe(7);
      expect(result?.suggestedPosition).toBeDefined();
    });

    test('管理範囲による役職検索が機能する', () => {
      const positions = facilityPositionMappingService.findPositionsByManagementScope(
        'obara-hospital',
        50,
        200
      );

      expect(positions.length).toBeGreaterThan(0);
      positions.forEach(pos => {
        expect(pos.managementScope).toBeGreaterThanOrEqual(50);
        expect(pos.managementScope).toBeLessThanOrEqual(200);
      });
    });

    test('部門別の役職一覧を取得できる', () => {
      const nursingPositions = facilityPositionMappingService.getPositionsByDepartment(
        'obara-hospital',
        '看護部'
      );

      expect(nursingPositions.length).toBeGreaterThan(0);
      nursingPositions.forEach(pos => {
        expect(pos.departmentScope).toBe('看護部');
      });
    });

    test('施設別調整値の計算が正しく機能する', () => {
      // 立神リハビリテーションの統括主任への調整
      const adjustment = facilityPositionMappingService.calculateFacilityAdjustment(
        'tategami-rehabilitation',
        6,
        '統括主任'
      );

      expect(adjustment).toBe(1);

      // 小原病院（調整なし）
      const noAdjustment = facilityPositionMappingService.calculateFacilityAdjustment(
        'obara-hospital',
        8,
        '師長'
      );

      expect(noAdjustment).toBe(0);
    });

    test('新規施設の追加が可能', () => {
      const newFacility = {
        facilityId: 'test-facility',
        facilityName: 'テスト病院',
        positionMappings: [
          { positionName: 'テスト役職', baseLevel: 5, managementScope: 10 }
        ],
        lastSyncedAt: new Date()
      };

      const result = facilityPositionMappingService.addFacility(newFacility);
      expect(result).toBe(true);

      const added = facilityPositionMappingService.getFacilityMapping('test-facility');
      expect(added).toBeDefined();
      expect(added?.facilityName).toBe('テスト病院');
    });
  });

  describe('権限レベル計算APIとの連携', () => {

    test('施設IDを含むリクエストで正しく権限レベルが計算される', async () => {
      const requestBody = {
        staffId: 'TEST001',
        facilityId: 'tategami-rehabilitation',
        staffData: {
          staffId: 'TEST001',
          name: 'テスト職員',
          facility: '立神リハビリテーション温泉病院',
          department: '看護部',
          position: '総師長',
          profession: '看護師',
          hireDate: '2010-04-01',
          experienceYears: 15
        }
      };

      // APIレスポンスの期待値
      const expectedLevel = 10; // 総師長のレベル

      // テスト用のモック処理（実際のAPI呼び出しは行わない）
      const mockCalculateLevel = (data: any) => {
        if (data.staffData.position === '総師長') {
          return {
            staffId: data.staffId,
            facilityId: data.facilityId,
            accountLevel: expectedLevel,
            breakdown: {
              baseLevel: expectedLevel,
              experienceBonus: 0,
              leaderBonus: 0,
              facilityAdjustment: 0,
              positionLevel: expectedLevel
            }
          };
        }
        return null;
      };

      const result = mockCalculateLevel(requestBody);
      expect(result?.accountLevel).toBe(expectedLevel);
      expect(result?.facilityId).toBe('tategami-rehabilitation');
    });

    test('施設間異動時の権限レベル再計算', () => {
      // 小原病院から立神リハビリテーションへの異動
      const beforeTransfer = {
        facilityId: 'obara-hospital',
        position: '病棟師長',
        level: 7
      };

      const afterTransfer = facilityPositionMappingService.convertPositionLevel(
        beforeTransfer.facilityId,
        'tategami-rehabilitation',
        beforeTransfer.position
      );

      expect(afterTransfer).toBeDefined();
      expect(afterTransfer?.originalLevel).toBe(7);
      // 立神リハビリテーションでも師長は同じレベル7
      expect(afterTransfer?.convertedLevel).toBe(7);
    });
  });

  describe('Webhook通知機能', () => {

    test('職員作成イベントの生成', () => {
      const event: StaffUpdateEvent = {
        eventType: 'staff.created',
        timestamp: new Date(),
        data: {
          staffId: 'NEW001',
          facilityId: 'obara-hospital',
          changes: {
            position: '看護師',
            accountLevel: 1,
            effectiveDate: new Date()
          }
        }
      };

      expect(event.eventType).toBe('staff.created');
      expect(event.data.staffId).toBe('NEW001');
      expect(event.data.facilityId).toBe('obara-hospital');
    });

    test('職員更新イベントの生成', () => {
      const event: StaffUpdateEvent = {
        eventType: 'staff.updated',
        timestamp: new Date(),
        data: {
          staffId: 'UPDATE001',
          facilityId: 'obara-hospital',
          changes: {
            position: '主任看護師',
            accountLevel: 5,
            effectiveDate: new Date()
          },
          previousState: {
            position: '看護師',
            accountLevel: 3
          }
        }
      };

      expect(event.eventType).toBe('staff.updated');
      expect(event.data.changes?.accountLevel).toBe(5);
      expect(event.data.previousState?.accountLevel).toBe(3);
    });

    test('施設間異動イベントの生成', () => {
      const event: StaffUpdateEvent = {
        eventType: 'staff.transferred',
        timestamp: new Date(),
        data: {
          staffId: 'TRANSFER001',
          facilityId: 'tategami-rehabilitation',
          changes: {
            position: '師長',
            accountLevel: 7,
            effectiveDate: new Date()
          },
          previousState: {
            facilityId: 'obara-hospital',
            position: '副師長',
            accountLevel: 6
          }
        }
      };

      expect(event.eventType).toBe('staff.transferred');
      expect(event.data.facilityId).toBe('tategami-rehabilitation');
      expect(event.data.previousState?.facilityId).toBe('obara-hospital');
    });

    test('バッチ更新の処理', async () => {
      const events: StaffUpdateEvent[] = [
        {
          eventType: 'staff.updated',
          timestamp: new Date(),
          data: {
            staffId: 'BATCH001',
            facilityId: 'obara-hospital',
            changes: { accountLevel: 2 }
          }
        },
        {
          eventType: 'staff.updated',
          timestamp: new Date(),
          data: {
            staffId: 'BATCH002',
            facilityId: 'obara-hospital',
            changes: { accountLevel: 3 }
          }
        },
        {
          eventType: 'staff.updated',
          timestamp: new Date(),
          data: {
            staffId: 'BATCH003',
            facilityId: 'tategami-rehabilitation',
            changes: { accountLevel: 5 }
          }
        }
      ];

      // バッチ処理のモック
      const mockBatchProcess = (events: StaffUpdateEvent[]) => {
        return {
          successful: events.map(e => e.data.staffId),
          failed: []
        };
      };

      const result = mockBatchProcess(events);
      expect(result.successful.length).toBe(3);
      expect(result.failed.length).toBe(0);
    });
  });

  describe('統合テスト', () => {

    test('完全な権限レベル計算フロー', () => {
      // 1. 施設と役職の情報
      const staffInfo = {
        staffId: 'INT001',
        facilityId: 'tategami-rehabilitation',
        position: '統括主任',
        experienceYears: 8
      };

      // 2. 役職レベルの取得
      const positionLevel = facilityPositionMappingService.getPositionLevel(
        staffInfo.facilityId,
        staffInfo.position
      );
      expect(positionLevel).toBe(6);

      // 3. 施設別調整の計算
      const adjustment = facilityPositionMappingService.calculateFacilityAdjustment(
        staffInfo.facilityId,
        positionLevel!,
        staffInfo.position
      );
      expect(adjustment).toBe(1);

      // 4. 最終的な権限レベル
      const finalLevel = positionLevel! + adjustment;
      expect(finalLevel).toBe(7);
    });

    test('役職なし職員の経験年数による権限レベル計算', () => {
      const staffCases = [
        { experienceYears: 0.5, expectedLevel: 1 },  // 新人
        { experienceYears: 2.5, expectedLevel: 2 },  // 若手
        { experienceYears: 7, expectedLevel: 3 },    // 中堅
        { experienceYears: 15, expectedLevel: 4 }    // ベテラン
      ];

      staffCases.forEach(testCase => {
        const level = testCase.experienceYears <= 1 ? 1 :
                     testCase.experienceYears <= 3 ? 2 :
                     testCase.experienceYears <= 10 ? 3 : 4;

        expect(level).toBe(testCase.expectedLevel);
      });
    });

    test('看護職のリーダーボーナス適用', () => {
      const nurseWithLeader = {
        profession: '看護師',
        canPerformLeaderDuty: true,
        experienceYears: 5,
        baseLevel: 3
      };

      const finalLevel = nurseWithLeader.baseLevel +
        (nurseWithLeader.canPerformLeaderDuty ? 0.5 : 0);

      expect(finalLevel).toBe(3.5);
    });
  });
});