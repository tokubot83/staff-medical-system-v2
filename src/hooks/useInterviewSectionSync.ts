/**
 * 面談シートのセクション同期フック
 * 前回と今回のシートのセクションを自動同期する
 */

import { useState, useCallback, useEffect } from 'react';

export interface SectionSyncState {
  currentSection: number;
  previousSection: number;
  isAutoSync: boolean;
  maxSections: number;
}

export interface SectionSyncActions {
  setCurrentSection: (section: number) => void;
  nextSection: () => void;
  prevSection: () => void;
  resetSection: () => void;
  toggleAutoSync: () => void;
  syncToPrevious: (section: number) => void;
  setMaxSections: (max: number) => void;
}

export const useInterviewSectionSync = (
  initialSection: number = 0,
  initialAutoSync: boolean = true
): [SectionSyncState, SectionSyncActions] => {
  const [currentSection, setCurrentSectionState] = useState(initialSection);
  const [previousSection, setPreviousSection] = useState(initialSection);
  const [isAutoSync, setIsAutoSync] = useState(initialAutoSync);
  const [maxSections, setMaxSections] = useState(10); // デフォルト最大セクション数

  // セクション変更時の同期処理
  const handleSectionChange = useCallback((newSection: number) => {
    setCurrentSectionState(newSection);
    
    // 自動同期が有効な場合、前回シートも同じセクションに移動
    if (isAutoSync) {
      setPreviousSection(newSection);
    }
  }, [isAutoSync]);

  // セクションを設定（外部から呼び出し可能）
  const setCurrentSection = useCallback((section: number) => {
    const validSection = Math.max(0, Math.min(section, maxSections - 1));
    handleSectionChange(validSection);
  }, [handleSectionChange, maxSections]);

  // 次のセクションへ移動
  const nextSection = useCallback(() => {
    if (currentSection < maxSections - 1) {
      handleSectionChange(currentSection + 1);
    }
  }, [currentSection, maxSections, handleSectionChange]);

  // 前のセクションへ移動
  const prevSection = useCallback(() => {
    if (currentSection > 0) {
      handleSectionChange(currentSection - 1);
    }
  }, [currentSection, handleSectionChange]);

  // 最初のセクションにリセット
  const resetSection = useCallback(() => {
    handleSectionChange(0);
  }, [handleSectionChange]);

  // 自動同期のオン/オフ切り替え
  const toggleAutoSync = useCallback(() => {
    setIsAutoSync(prev => {
      const newAutoSync = !prev;
      
      // 自動同期を有効にした場合、即座に同期
      if (newAutoSync) {
        setPreviousSection(currentSection);
      }
      
      return newAutoSync;
    });
  }, [currentSection]);

  // 前回シートを特定のセクションに手動で移動
  const syncToPrevious = useCallback((section: number) => {
    const validSection = Math.max(0, Math.min(section, maxSections - 1));
    setPreviousSection(validSection);
  }, [maxSections]);

  // 最大セクション数を設定
  const setMaxSectionsCallback = useCallback((max: number) => {
    setMaxSections(Math.max(1, max));
    
    // 現在のセクションが最大値を超える場合は調整
    if (currentSection >= max) {
      handleSectionChange(max - 1);
    }
  }, [currentSection, handleSectionChange]);

  // 初期値が変更された場合の同期
  useEffect(() => {
    if (initialSection !== currentSection) {
      setCurrentSectionState(initialSection);
      if (isAutoSync) {
        setPreviousSection(initialSection);
      }
    }
  }, [initialSection]); // currentSectionとisAutoSyncは依存から除外（無限ループ防止）

  const state: SectionSyncState = {
    currentSection,
    previousSection,
    isAutoSync,
    maxSections
  };

  const actions: SectionSyncActions = {
    setCurrentSection,
    nextSection,
    prevSection,
    resetSection,
    toggleAutoSync,
    syncToPrevious,
    setMaxSections: setMaxSectionsCallback
  };

  return [state, actions];
};