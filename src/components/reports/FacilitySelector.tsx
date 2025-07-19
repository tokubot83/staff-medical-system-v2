'use client';

import React from 'react';
import { facilities } from '@/app/data/facilityData';

interface FacilitySelectorProps {
  selectedFacility: string;
  onFacilityChange: (facilityId: string) => void;
}

export default function FacilitySelector({ selectedFacility, onFacilityChange }: FacilitySelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <label htmlFor="facility-select" className="block text-sm font-medium text-gray-700 mb-2">
        施設を選択
      </label>
      <select
        id="facility-select"
        value={selectedFacility}
        onChange={(e) => onFacilityChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">全施設</option>
        {facilities.map((facility) => (
          <option key={facility.id} value={facility.id}>
            {facility.name}
          </option>
        ))}
      </select>
      
      {selectedFacility && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          {(() => {
            const facility = facilities.find(f => f.id === selectedFacility);
            if (!facility) return null;
            
            return (
              <>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">場所:</span> {facility.location}
                </p>
                {facility.beds && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">病床数:</span> {facility.beds}床
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  <span className="font-medium">職員数:</span> {facility.staffCount}名
                </p>
                {facility.departments && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">診療科:</span> {facility.departments.join('、')}
                  </p>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}