'use client';

import React from 'react';
import Link from 'next/link';
import { Facility } from '@/app/data/facilityData';
interface ReportLayoutProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  facility?: Facility;
  children: React.ReactNode;
  onExportPDF?: () => void;
  categoryPath?: string;
  categoryName?: string;
}

export default function ReportLayout({
  title,
  description,
  icon,
  color,
  facility,
  children,
  onExportPDF,
  categoryPath,
  categoryName
}: ReportLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* レポート説明 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`${color} text-white rounded-lg p-4 text-3xl`}>
                  {icon}
                </div>
                <div className="ml-4">
                  <p className="text-gray-600">{description}</p>
                </div>
              </div>
            
            {onExportPDF && (
              <button
                onClick={onExportPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDFで出力
              </button>
            )}
          </div>
        </div>

        {/* 施設情報 */}
        {facility && (
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{facility.name}</h3>
                <p className="text-sm text-gray-600">{facility.type} - {facility.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">職員数: <span className="font-semibold">{facility.staffCount}名</span></p>
                {facility.beds && (
                  <p className="text-sm text-gray-600">病床数: <span className="font-semibold">{facility.beds}床</span></p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* レポート内容 */}
        <div className="bg-white rounded-lg shadow">
          {children}
        </div>

        {/* フッター */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>レポート生成日時: {new Date().toLocaleString('ja-JP')}</p>
          <p className="mt-1">医療法人厚生会 人事管理システム</p>
          </div>
        </div>
      </div>
    </div>
  );
}