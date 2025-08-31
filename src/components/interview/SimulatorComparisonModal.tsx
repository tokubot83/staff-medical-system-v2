'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, RotateCcw, ZoomIn, ZoomOut, RotateCcw as Reset } from 'lucide-react';
import DynamicInterviewSheet from '@/components/interview-bank/DynamicInterviewSheet';
import { 
  getJobRoleLabel, 
  getFacilityTypeLabel, 
  StaffLevel,
  JobRole,
  FacilityType,
  InterviewType
} from '@/types/staff-common';

interface SimulatorComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  
  // 元のシート情報
  originalSheet: any;
  originalStaffProfile: any;
  originalConditions: {
    jobRole: JobRole;
    staffLevel: StaffLevel;
    facilityType: FacilityType;
    interviewType: InterviewType;
    duration: number;
  };
  
  // 比較シート情報
  comparisonSheet: any;
  comparisonStaffProfile: any;
  comparisonConditions: {
    jobRole: JobRole;
    staffLevel: StaffLevel;
    facilityType: FacilityType;
    interviewType: InterviewType;
    duration: number;
  };

  // スタッフレベル一覧
  staffLevels: { value: StaffLevel; label: string; description: string }[];
  interviewTypes: { value: InterviewType; label: string; description: string; classification: string }[];
}

export default function SimulatorComparisonModal({
  isOpen,
  onClose,
  originalSheet,
  originalStaffProfile,
  originalConditions,
  comparisonSheet,
  comparisonStaffProfile,
  comparisonConditions,
  staffLevels,
  interviewTypes
}: SimulatorComparisonModalProps) {
  // 全画面固定のためフラグは削除
  const [activeSection, setActiveSection] = useState(0);
  const [leftScale, setLeftScale] = useState(0.6); // 左側のシートの拡大率（デフォルト60%）
  const [rightScale, setRightScale] = useState(0.6); // 右側のシートの拡大率（デフォルト60%）

  useEffect(() => {
    if (isOpen) {
      // モーダルが開いているときはボディのスクロールを防ぐ
      document.body.style.overflow = 'hidden';
    }

    // Escキーでモーダルを閉じる
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // ズーム調整関数
  const adjustZoom = (side: 'left' | 'right', delta: number) => {
    if (side === 'left') {
      setLeftScale(prev => Math.min(1.5, Math.max(0.5, prev + delta)));
    } else {
      setRightScale(prev => Math.min(1.5, Math.max(0.5, prev + delta)));
    }
  };

  const resetZoom = (side: 'left' | 'right') => {
    if (side === 'left') {
      setLeftScale(0.6);
    } else {
      setRightScale(0.6);
    }
  };

  const getConditionDifferences = () => {
    const diffs = [];
    if (originalConditions.jobRole !== comparisonConditions.jobRole) {
      diffs.push('職種');
    }
    if (originalConditions.staffLevel !== comparisonConditions.staffLevel) {
      diffs.push('経験レベル');
    }
    if (originalConditions.facilityType !== comparisonConditions.facilityType) {
      diffs.push('施設タイプ');
    }
    if (originalConditions.interviewType !== comparisonConditions.interviewType) {
      diffs.push('面談種別');
    }
    if (originalConditions.duration !== comparisonConditions.duration) {
      diffs.push('面談時間');
    }
    return diffs;
  };

  const differences = getConditionDifferences();

  return (
    <div 
      className="simulator-comparison-modal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
      }}
    >
      {/* 背景オーバーレイ */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(31, 41, 55, 0.75)'
        }}
        onClick={onClose}
      />

      {/* メインコンテンツ（第3段階：比較機能の基本レイアウト修正） */}
      <div 
        className="comparison-modal-content"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          maxWidth: 'none',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '0',
          overflow: 'hidden',
          boxShadow: 'none',
          margin: '0'
        }}
      >
        {/* ヘッダー */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
              面談シート条件比較
            </h2>
            {differences.length > 0 && (
              <p style={{ fontSize: '14px', opacity: 0.9, margin: '4px 0 0 0' }}>
                変更箇所: {differences.join('、')}
              </p>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* 閉じるボタン */}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '6px',
                padding: '8px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 条件サマリー */}
        <div style={{
          background: '#f8f9fa',
          padding: '12px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-around',
          fontSize: '14px'
        }}>
          <div style={{ flex: 1, borderRight: '1px solid #e5e7eb', paddingRight: '24px' }}>
            <strong style={{ color: '#667eea' }}>元の条件</strong>
            <div style={{ marginTop: '4px', color: '#666' }}>
              {getJobRoleLabel(originalConditions.jobRole)} / {' '}
              {staffLevels.find(l => l.value === originalConditions.staffLevel)?.label} / {' '}
              {getFacilityTypeLabel(originalConditions.facilityType)} / {' '}
              {interviewTypes.find(t => t.value === originalConditions.interviewType)?.label} / {' '}
              {originalConditions.duration}分
            </div>
          </div>
          <div style={{ flex: 1, paddingLeft: '24px' }}>
            <strong style={{ color: '#764ba2' }}>比較条件</strong>
            <div style={{ marginTop: '4px', color: '#666' }}>
              <span style={{ color: comparisonConditions.jobRole !== originalConditions.jobRole ? '#e74c3c' : 'inherit' }}>
                {getJobRoleLabel(comparisonConditions.jobRole)}
              </span> / {' '}
              <span style={{ color: comparisonConditions.staffLevel !== originalConditions.staffLevel ? '#e74c3c' : 'inherit' }}>
                {staffLevels.find(l => l.value === comparisonConditions.staffLevel)?.label}
              </span> / {' '}
              <span style={{ color: comparisonConditions.facilityType !== originalConditions.facilityType ? '#e74c3c' : 'inherit' }}>
                {getFacilityTypeLabel(comparisonConditions.facilityType)}
              </span> / {' '}
              <span style={{ color: comparisonConditions.interviewType !== originalConditions.interviewType ? '#e74c3c' : 'inherit' }}>
                {interviewTypes.find(t => t.value === comparisonConditions.interviewType)?.label}
              </span> / {' '}
              <span style={{ color: comparisonConditions.duration !== originalConditions.duration ? '#e74c3c' : 'inherit' }}>
                {comparisonConditions.duration}分
              </span>
            </div>
          </div>
        </div>

        {/* コンテンツエリア（横スクロール対応） */}
        <div style={{ 
          flex: 1, 
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          position: 'relative'
        }}>
          {/* 元のシート */}
          <div style={{ 
            minWidth: 'calc(50vw - 1px)',
            width: '50%',
            borderRight: '2px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
              padding: '12px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50', margin: 0 }}>
                  元の面談シート
                </h3>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>
                  バージョン: {originalSheet?.metadata?.version || 'v6'}
                </p>
              </div>
              
              {/* ズームコントロール */}
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <button
                  onClick={() => adjustZoom('left', -0.1)}
                  style={{
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="縮小"
                >
                  <ZoomOut size={16} />
                </button>
                
                <span style={{ 
                  padding: '4px 8px',
                  background: 'white',
                  borderRadius: '4px',
                  fontSize: '13px',
                  minWidth: '50px',
                  textAlign: 'center'
                }}>
                  {Math.round(leftScale * 100)}%
                </span>
                
                <button
                  onClick={() => adjustZoom('left', 0.1)}
                  style={{
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="拡大"
                >
                  <ZoomIn size={16} />
                </button>
                
                <button
                  onClick={() => resetZoom('left')}
                  style={{
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="リセット"
                >
                  <Reset size={16} />
                </button>
              </div>
            </div>
            
            <div style={{ 
              flex: 1, 
              overflowY: 'auto',
              overflowX: 'auto',
              padding: '20px',
              display: 'flex',
              justifyContent: 'flex-start'
            }}>
              <div style={{
                transform: `scale(${leftScale})`,
                transformOrigin: 'top left',
                width: leftScale < 1 ? `${100 / leftScale}%` : '100%'
              }}>
                <DynamicInterviewSheet 
                  sheetData={originalSheet}
                  staffProfile={originalStaffProfile}
                  readOnly={true}
                  onSave={() => {}}
                />
              </div>
            </div>
          </div>

          {/* 比較シート */}
          <div style={{ 
            minWidth: 'calc(50vw - 1px)',
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #fff4e6 0%, #ffe0b2 100%)',
              padding: '12px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#e65100', margin: 0 }}>
                  比較用面談シート
                </h3>
                <p style={{ fontSize: '13px', color: '#bf360c', margin: '4px 0 0 0' }}>
                  バージョン: {comparisonSheet?.metadata?.version || 'v6'}
                </p>
              </div>
              
              {/* ズームコントロール */}
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <button
                  onClick={() => adjustZoom('right', -0.1)}
                  style={{
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="縮小"
                >
                  <ZoomOut size={16} />
                </button>
                
                <span style={{ 
                  padding: '4px 8px',
                  background: 'white',
                  borderRadius: '4px',
                  fontSize: '13px',
                  minWidth: '50px',
                  textAlign: 'center'
                }}>
                  {Math.round(rightScale * 100)}%
                </span>
                
                <button
                  onClick={() => adjustZoom('right', 0.1)}
                  style={{
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="拡大"
                >
                  <ZoomIn size={16} />
                </button>
                
                <button
                  onClick={() => resetZoom('right')}
                  style={{
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="リセット"
                >
                  <Reset size={16} />
                </button>
              </div>
            </div>
            
            <div style={{ 
              flex: 1, 
              overflowY: 'auto',
              overflowX: 'auto',
              padding: '20px',
              display: 'flex',
              justifyContent: 'flex-start'
            }}>
              <div style={{
                transform: `scale(${rightScale})`,
                transformOrigin: 'top left',
                width: rightScale < 1 ? `${100 / rightScale}%` : '100%'
              }}>
                <DynamicInterviewSheet 
                  sheetData={comparisonSheet}
                  staffProfile={comparisonStaffProfile}
                  readOnly={true}
                  onSave={() => {}}
                />
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div style={{
          background: '#f8f9fa',
          padding: '12px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            横スクロールで両シートを比較できます
          </div>
          
          <button
            onClick={onClose}
            style={{
              background: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer'
            }}
          >
            比較を終了
          </button>
        </div>
      </div>
    </div>
  );
}