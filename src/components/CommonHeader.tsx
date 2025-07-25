'use client';

import React from 'react';
import Link from 'next/link';

interface CommonHeaderProps {
  title?: string;
}

export default function CommonHeader({ 
  title = '職員カルテシステム'
}: CommonHeaderProps) {
  return (
    <header className="bg-gray-700 text-white p-5 border-b" style={{ backgroundColor: '#374151' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl">
              🏥
            </div>
            <div>
              <h1 className="text-2xl font-light">{title}</h1>
              <p className="text-sm opacity-90">医療法人厚生会</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}