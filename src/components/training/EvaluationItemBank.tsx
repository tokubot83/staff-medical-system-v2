'use client';

import React, { useState } from 'react';
import styles from '@/app/training/Training.module.css';
import {
  corporateEvaluationItems,
  facilitySpecificItems,
  trainingPrograms,
  recommendedItemSets,
  experienceLevels,
  roles,
  facilityTypes,
  getItemsByRole,
  getItemsByLevel,
  getTrainingsByItem,
  getRecommendedSet,
  calculateTotalPoints,
  type EvaluationItem,
  type TrainingProgram,
  type ItemSet
} from '@/data/evaluationItemBank';

export default function EvaluationItemBank() {
  const [selectedFacility, setSelectedFacility] = useState('acute');
  const [selectedRole, setSelectedRole] = useState('nurse');
  const [selectedLevel, setSelectedLevel] = useState('midlevel');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'browse' | 'select' | 'mapping'>('browse');

  // 推奨セットの取得
  const recommendedSet = getRecommendedSet(selectedFacility, selectedRole, selectedLevel);
  
  // フィルタリングされた項目
  const filteredCorporateItems = corporateEvaluationItems.filter(item =>
    (item.targetRoles.includes(selectedRole) || item.targetRoles.includes('all')) &&
    (item.targetLevels.includes(selectedLevel) || item.targetLevels.includes('all'))
  );

  const filteredFacilityItems = facilitySpecificItems.filter(item =>
    (item.targetRoles.includes(selectedRole) || item.targetRoles.includes('all')) &&
    (item.targetLevels.includes(selectedLevel) || item.targetLevels.includes('all'))
  );

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  const handleApplyRecommendedSet = () => {
    if (recommendedSet) {
      setSelectedItems([...recommendedSet.corporateItems, ...recommendedSet.facilityItems]);
    }
  };

  const totalPoints = calculateTotalPoints(selectedItems);

  return (
    <div className={styles.itemBankContainer}>
      {/* 開発メモ */}
      <div style={{
        backgroundColor: '#f0f8ff',
        border: '2px dashed #4169e1',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <h3 style={{ color: '#4169e1', marginBottom: '12px' }}>
          📝 開発メモ：教育研修・人事評価連動システム
        </h3>
        <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#333' }}>
          <h4 style={{ marginTop: '16px', marginBottom: '8px' }}>【システム概要】</h4>
          <p>このシステムは、教育研修と人事評価を完全に連動させる革新的な人材育成システムです。</p>
          
          <h4 style={{ marginTop: '16px', marginBottom: '8px' }}>【評価構成（100点満点）】</h4>
          <ul style={{ marginLeft: '20px' }}>
            <li><strong>技術評価（50点）</strong>
              <ul style={{ marginLeft: '20px', marginTop: '4px' }}>
                <li>法人統一項目（30点）：法定研修ベース、全施設共通</li>
                <li>施設特化項目（20点）：項目バンクから各施設が選択</li>
              </ul>
            </li>
            <li><strong>施設評価（25点）</strong>：各施設独自の評価</li>
            <li><strong>法人評価（25点）</strong>：法人共通の評価</li>
          </ul>

          <h4 style={{ marginTop: '16px', marginBottom: '8px' }}>【連動の仕組み】</h4>
          <ol style={{ marginLeft: '20px' }}>
            <li>評価項目ごとに必要な研修を設定</li>
            <li>研修受講により評価項目の達成度が向上</li>
            <li>評価結果から不足スキルを特定し、推奨研修を提示</li>
            <li>PDCAサイクルで継続的な改善</li>
          </ol>

          <h4 style={{ marginTop: '16px', marginBottom: '8px' }}>【項目バンクの役割】</h4>
          <ul style={{ marginLeft: '20px' }}>
            <li>施設種別・職種・経験レベルに応じた評価項目を提供</li>
            <li>各施設が特性に合わせて項目を選択可能</li>
            <li>選択した項目に対応する研修を自動提案</li>
            <li>法人全体で品質を保ちながら柔軟性を確保</li>
          </ul>

          <h4 style={{ marginTop: '16px', marginBottom: '8px' }}>【導入効果】</h4>
          <ul style={{ marginLeft: '20px' }}>
            <li>研修参加の動機付け向上（評価に直結）</li>
            <li>スキルギャップの可視化</li>
            <li>計画的な人材育成</li>
            <li>公平で透明性の高い評価制度</li>
          </ul>

          <p style={{ marginTop: '16px', fontWeight: 'bold', color: '#4169e1' }}>
            ※このシステムは法人教育師長と人事部が協働で運用し、戦略的な人材育成を実現します。
          </p>
        </div>
      </div>

      {/* ヘッダー */}
      <div className={styles.itemBankHeader}>
        <h2>📋 評価項目バンク</h2>
        <p className={styles.headerDescription}>
          人事評価の技術評価項目（50点）と研修プログラムの連携管理
        </p>
      </div>

      {/* モード切替 */}
      <div className={styles.viewModeSelector}>
        <button
          className={viewMode === 'browse' ? styles.active : ''}
          onClick={() => setViewMode('browse')}
        >
          項目一覧
        </button>
        <button
          className={viewMode === 'select' ? styles.active : ''}
          onClick={() => setViewMode('select')}
        >
          項目選択
        </button>
        <button
          className={viewMode === 'mapping' ? styles.active : ''}
          onClick={() => setViewMode('mapping')}
        >
          研修マッピング
        </button>
      </div>

      {/* フィルター */}
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>施設種別</label>
          <select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className={styles.filterSelect}
          >
            {Object.entries(facilityTypes).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>職種</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className={styles.filterSelect}
          >
            {Object.entries(roles).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>経験レベル</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className={styles.filterSelect}
          >
            {Object.entries(experienceLevels).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 推奨セット */}
      {recommendedSet && viewMode === 'select' && (
        <div className={styles.recommendedSetCard}>
          <h3>🎯 推奨項目セット</h3>
          <p>{recommendedSet.name}</p>
          <p className={styles.setPoints}>合計: {recommendedSet.totalPoints}点</p>
          <button 
            onClick={handleApplyRecommendedSet}
            className={styles.applySetButton}
          >
            推奨セットを適用
          </button>
        </div>
      )}

      {/* コンテンツ表示 */}
      {viewMode === 'browse' && (
        <div className={styles.itemsContainer}>
          {/* 法人統一項目 */}
          <div className={styles.itemSection}>
            <h3 className={styles.sectionTitle}>
              🏢 法人統一項目（30点） - 法定研修ベース
            </h3>
            <div className={styles.itemGrid}>
              {filteredCorporateItems.map(item => (
                <ItemCard key={item.id} item={item} mode="browse" />
              ))}
            </div>
          </div>

          {/* 施設特化項目 */}
          <div className={styles.itemSection}>
            <h3 className={styles.sectionTitle}>
              🏥 施設特化項目（20点） - 選択可能
            </h3>
            <div className={styles.itemGrid}>
              {filteredFacilityItems.map(item => (
                <ItemCard key={item.id} item={item} mode="browse" />
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'select' && (
        <div className={styles.selectContainer}>
          <div className={styles.selectHeader}>
            <h3>評価項目の選択</h3>
            <div className={styles.pointCounter}>
              選択中: {totalPoints}点 / 50点
            </div>
          </div>
          
          {/* 法人統一項目 */}
          <div className={styles.selectSection}>
            <h4>法人統一項目（必須）</h4>
            <div className={styles.selectGrid}>
              {filteredCorporateItems.map(item => (
                <SelectableItem
                  key={item.id}
                  item={item}
                  selected={selectedItems.includes(item.id)}
                  onSelect={handleItemSelect}
                  disabled={item.type === 'required'}
                />
              ))}
            </div>
          </div>

          {/* 施設特化項目 */}
          <div className={styles.selectSection}>
            <h4>施設特化項目（選択）</h4>
            <div className={styles.selectGrid}>
              {filteredFacilityItems.map(item => (
                <SelectableItem
                  key={item.id}
                  item={item}
                  selected={selectedItems.includes(item.id)}
                  onSelect={handleItemSelect}
                  disabled={false}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'mapping' && (
        <MappingView
          selectedRole={selectedRole}
          selectedLevel={selectedLevel}
        />
      )}
    </div>
  );
}

// 項目カードコンポーネント
function ItemCard({ item, mode }: { item: EvaluationItem; mode: string }) {
  const relatedTrainings = getTrainingsByItem(item.id);

  return (
    <div className={styles.itemCard}>
      <div className={styles.itemHeader}>
        <h4>{item.name}</h4>
        <span className={styles.pointBadge}>{item.points}点</span>
      </div>
      <p className={styles.itemDescription}>{item.description}</p>
      
      {relatedTrainings.length > 0 && (
        <div className={styles.relatedTrainings}>
          <h5>必要な研修:</h5>
          <ul>
            {relatedTrainings.map(training => (
              <li key={training.id}>
                {training.name}
                {training.frequency && ` (${training.frequency})`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.evaluationCriteria}>
        <h5>評価基準:</h5>
        <ul>
          {item.evaluationCriteria.slice(0, 2).map((criteria, index) => (
            <li key={index}>{criteria}</li>
          ))}
          {item.evaluationCriteria.length > 2 && (
            <li className={styles.moreItems}>
              他{item.evaluationCriteria.length - 2}項目...
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

// 選択可能項目コンポーネント
function SelectableItem({
  item,
  selected,
  onSelect,
  disabled
}: {
  item: EvaluationItem;
  selected: boolean;
  onSelect: (id: string) => void;
  disabled: boolean;
}) {
  return (
    <div
      className={`${styles.selectableItem} ${selected ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
      onClick={() => !disabled && onSelect(item.id)}
    >
      <div className={styles.selectableHeader}>
        <input
          type="checkbox"
          checked={selected || disabled}
          readOnly={disabled}
          onChange={() => {}}
        />
        <span>{item.name}</span>
        <span className={styles.points}>{item.points}点</span>
      </div>
      <p className={styles.selectableDescription}>{item.description}</p>
    </div>
  );
}

// マッピングビューコンポーネント
function MappingView({
  selectedRole,
  selectedLevel
}: {
  selectedRole: string;
  selectedLevel: string;
}) {
  const relevantItems = getItemsByRole(selectedRole).filter(item =>
    item.targetLevels.includes(selectedLevel) || item.targetLevels.includes('all')
  );

  return (
    <div className={styles.mappingContainer}>
      <h3>📊 評価項目と研修のマッピング</h3>
      
      <div className={styles.mappingTable}>
        <table>
          <thead>
            <tr>
              <th>評価項目</th>
              <th>配点</th>
              <th>必要研修</th>
              <th>実施頻度</th>
              <th>研修時間</th>
            </tr>
          </thead>
          <tbody>
            {relevantItems.map(item => {
              const trainings = getTrainingsByItem(item.id);
              return (
                <React.Fragment key={item.id}>
                  {trainings.length > 0 ? (
                    trainings.map((training, index) => (
                      <tr key={`${item.id}-${training.id}`}>
                        {index === 0 && (
                          <>
                            <td rowSpan={trainings.length}>{item.name}</td>
                            <td rowSpan={trainings.length} className={styles.centerCell}>
                              {item.points}点
                            </td>
                          </>
                        )}
                        <td>{training.name}</td>
                        <td className={styles.centerCell}>{training.frequency || '-'}</td>
                        <td className={styles.centerCell}>{training.duration}時間</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>{item.name}</td>
                      <td className={styles.centerCell}>{item.points}点</td>
                      <td colSpan={3} className={styles.noTraining}>
                        研修未設定
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.mappingSummary}>
        <h4>📈 統計情報</h4>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>評価項目数</span>
            <span className={styles.summaryValue}>{relevantItems.length}項目</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>合計配点</span>
            <span className={styles.summaryValue}>
              {calculateTotalPoints(relevantItems.map(i => i.id))}点
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>必要研修数</span>
            <span className={styles.summaryValue}>
              {new Set(
                relevantItems.flatMap(item => 
                  getTrainingsByItem(item.id).map(t => t.id)
                )
              ).size}件
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}