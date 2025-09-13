/**
 * 時間枠拡張管理システム
 * VoiceDriveのPattern D要求に対応した柔軟な時間枠設定
 */

import { TimeSlot } from '@/types/pattern-d-interview';

export interface ExtendedTimeSlot extends TimeSlot {
  categoryType: 'fixed' | 'flexible' | 'custom';
  availableInterviewers: string[];
  maxConcurrent: number;
  bufferMinutes: number;
  isRecurring: boolean;
  customRules?: TimeSlotRule[];
}

export interface TimeSlotRule {
  id: string;
  condition: string;
  action: string;
  priority: number;
}

export interface TimeSlotConfig {
  morning: TimeSlotCategory;
  afternoon: TimeSlotCategory;
  evening: TimeSlotCategory;
}

export interface TimeSlotCategory {
  baseRange: { start: string; end: string };
  intervalMinutes: number;
  standardDurations: number[];
  flexibleEndTime: boolean;
  customSlotsAllowed: boolean;
}

export class TimeSlotManager {
  private defaultConfig: TimeSlotConfig = {
    morning: {
      baseRange: { start: '09:00', end: '11:30' },
      intervalMinutes: 30,
      standardDurations: [30, 45, 60],
      flexibleEndTime: false,
      customSlotsAllowed: true
    },
    afternoon: {
      baseRange: { start: '14:00', end: '16:30' },
      intervalMinutes: 30,
      standardDurations: [30, 45, 60],
      flexibleEndTime: false,
      customSlotsAllowed: true
    },
    evening: {
      baseRange: { start: '17:30', end: '19:00' },
      intervalMinutes: 15, // より柔軟な間隔
      standardDurations: [15, 30, 45],
      flexibleEndTime: true, // 夕方は終了時間が柔軟
      customSlotsAllowed: true
    }
  };

  /**
   * VoiceDrive要求に対応したタイムスロット生成
   */
  generateTimeSlots(
    date: string,
    timePreferences: {
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
      anytime: boolean;
    },
    duration: { min: number; max: number }
  ): ExtendedTimeSlot[] {
    const slots: ExtendedTimeSlot[] = [];
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;

    // 午前枠の生成
    if (timePreferences.morning || timePreferences.anytime) {
      slots.push(...this.generateSlotsForCategory('morning', dayOfWeek, duration));
    }

    // 午後枠の生成
    if (timePreferences.afternoon || timePreferences.anytime) {
      slots.push(...this.generateSlotsForCategory('afternoon', dayOfWeek, duration));
    }

    // 夕方枠の生成
    if (timePreferences.evening || timePreferences.anytime) {
      slots.push(...this.generateSlotsForCategory('evening', dayOfWeek, duration));
    }

    return this.optimizeSlots(slots, duration);
  }

  /**
   * カテゴリ別タイムスロット生成
   */
  private generateSlotsForCategory(
    category: 'morning' | 'afternoon' | 'evening',
    dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6,
    duration: { min: number; max: number }
  ): ExtendedTimeSlot[] {
    const config = this.defaultConfig[category];
    const slots: ExtendedTimeSlot[] = [];

    const startTime = this.parseTime(config.baseRange.start);
    const endTime = this.parseTime(config.baseRange.end);
    const intervalMs = config.intervalMinutes * 60 * 1000;

    let currentTime = startTime;
    let slotIndex = 0;

    while (currentTime + (duration.min * 60 * 1000) <= endTime) {
      // 基本スロット
      for (const standardDuration of config.standardDurations) {
        if (standardDuration >= duration.min && standardDuration <= duration.max) {
          const slot: ExtendedTimeSlot = {
            id: `${category}-${dayOfWeek}-${slotIndex}-${standardDuration}`,
            dayOfWeek,
            startTime: this.formatTime(currentTime),
            endTime: this.formatTime(currentTime + (standardDuration * 60 * 1000)),
            duration: standardDuration,
            maxBookings: category === 'evening' ? 2 : 1, // 夕方は複数予約可能
            slotType: category,
            isActive: true,
            categoryType: 'fixed',
            availableInterviewers: [], // TODO: 担当者情報から取得
            maxConcurrent: 1,
            bufferMinutes: 5,
            isRecurring: true
          };

          slots.push(slot);
        }
      }

      // カスタムスロット（夕方のみ）
      if (category === 'evening' && config.customSlotsAllowed) {
        const customSlot: ExtendedTimeSlot = {
          id: `${category}-custom-${dayOfWeek}-${slotIndex}`,
          dayOfWeek,
          startTime: this.formatTime(currentTime),
          endTime: this.formatTime(currentTime + (duration.max * 60 * 1000)),
          duration: duration.max,
          maxBookings: 1,
          slotType: category,
          isActive: true,
          categoryType: 'flexible',
          availableInterviewers: [],
          maxConcurrent: 1,
          bufferMinutes: 10,
          isRecurring: false,
          customRules: [
            {
              id: 'evening-flexibility',
              condition: 'time_after_17:30',
              action: 'allow_custom_duration',
              priority: 1
            }
          ]
        };

        slots.push(customSlot);
      }

      currentTime += intervalMs;
      slotIndex++;
    }

    return slots;
  }

  /**
   * スロット最適化
   */
  private optimizeSlots(
    slots: ExtendedTimeSlot[],
    duration: { min: number; max: number }
  ): ExtendedTimeSlot[] {
    return slots
      .filter(slot => {
        // 時間制約フィルタリング
        return slot.duration >= duration.min && slot.duration <= duration.max;
      })
      .sort((a, b) => {
        // 優先度付きソート
        const priorityA = this.calculateSlotPriority(a);
        const priorityB = this.calculateSlotPriority(b);
        return priorityB - priorityA;
      })
      .slice(0, 20); // 最大20スロット
  }

  /**
   * スロット優先度計算
   */
  private calculateSlotPriority(slot: ExtendedTimeSlot): number {
    let priority = 100;

    // 時間帯による優先度
    switch (slot.slotType) {
      case 'morning':
        priority += 30; // 午前は高優先度
        break;
      case 'afternoon':
        priority += 20; // 午後は中優先度
        break;
      case 'evening':
        priority += 10; // 夕方は低優先度
        break;
    }

    // スロットタイプによる優先度
    switch (slot.categoryType) {
      case 'fixed':
        priority += 15; // 固定スロットは安定性が高い
        break;
      case 'flexible':
        priority += 10; // 柔軟スロットは調整可能
        break;
      case 'custom':
        priority += 5; // カスタムは特別対応
        break;
    }

    // 利用可能担当者数による調整
    priority += slot.availableInterviewers.length * 2;

    return priority;
  }

  /**
   * 担当者可用性チェック
   */
  async checkInterviewerAvailability(
    interviewerId: string,
    date: string,
    timeSlot: ExtendedTimeSlot
  ): Promise<boolean> {
    // TODO: データベースから担当者の可用性をチェック
    // 現在はモック実装
    return Math.random() > 0.3; // 70%の確率で利用可能
  }

  /**
   * 動的時間枠追加
   */
  async addDynamicTimeSlot(
    category: 'morning' | 'afternoon' | 'evening',
    customSlot: {
      startTime: string;
      duration: number;
      interviewerId: string;
      specialRules?: TimeSlotRule[];
    }
  ): Promise<ExtendedTimeSlot> {
    const slot: ExtendedTimeSlot = {
      id: `dynamic-${Date.now()}`,
      dayOfWeek: new Date().getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      startTime: customSlot.startTime,
      endTime: this.formatTime(
        this.parseTime(customSlot.startTime) + (customSlot.duration * 60 * 1000)
      ),
      duration: customSlot.duration,
      maxBookings: 1,
      slotType: category,
      isActive: true,
      categoryType: 'custom',
      availableInterviewers: [customSlot.interviewerId],
      maxConcurrent: 1,
      bufferMinutes: 10,
      isRecurring: false,
      customRules: customSlot.specialRules || []
    };

    // TODO: データベースに保存
    console.log('Dynamic slot added:', slot);

    return slot;
  }

  /**
   * 時間枠負荷分析
   */
  analyzeTimeSlotLoad(slots: ExtendedTimeSlot[]): {
    morning: { total: number; available: number; loadPercentage: number };
    afternoon: { total: number; available: number; loadPercentage: number };
    evening: { total: number; available: number; loadPercentage: number };
  } {
    const analysis = {
      morning: { total: 0, available: 0, loadPercentage: 0 },
      afternoon: { total: 0, available: 0, loadPercentage: 0 },
      evening: { total: 0, available: 0, loadPercentage: 0 }
    };

    slots.forEach(slot => {
      analysis[slot.slotType].total++;
      if (slot.isActive && slot.availableInterviewers.length > 0) {
        analysis[slot.slotType].available++;
      }
    });

    // 負荷率計算
    Object.keys(analysis).forEach(key => {
      const category = analysis[key as keyof typeof analysis];
      category.loadPercentage = category.total > 0
        ? Math.round(((category.total - category.available) / category.total) * 100)
        : 0;
    });

    return analysis;
  }

  /**
   * 最適化提案生成
   */
  generateOptimizationSuggestions(
    loadAnalysis: ReturnType<typeof this.analyzeTimeSlotLoad>
  ): string[] {
    const suggestions: string[] = [];

    Object.entries(loadAnalysis).forEach(([timeType, data]) => {
      const typeName = {
        morning: '午前',
        afternoon: '午後',
        evening: '夕方'
      }[timeType];

      if (data.loadPercentage > 80) {
        suggestions.push(
          `${typeName}の負荷が高い（${data.loadPercentage}%）ため、時間枠の追加を検討してください`
        );
      } else if (data.loadPercentage < 20) {
        suggestions.push(
          `${typeName}の利用率が低い（${100 - data.loadPercentage}%）ため、時間枠の統合を検討できます`
        );
      }
    });

    return suggestions;
  }

  // ユーティリティメソッド
  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return (hours * 60 + minutes) * 60 * 1000; // ミリ秒に変換
  }

  private formatTime(timeMs: number): string {
    const totalMinutes = Math.floor(timeMs / (60 * 1000));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}