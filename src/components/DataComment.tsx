import React, { useState } from 'react';
import { DataComment as DataCommentType, commentIcons, commentStyles } from '@/types/commentTypes';

interface DataCommentProps {
  comment: DataCommentType;
  inline?: boolean;
}

export const DataComment: React.FC<DataCommentProps> = ({ comment, inline = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const style = commentStyles[comment.type];
  const icon = commentIcons[comment.type];

  if (inline) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm ${style.bgColor} ${style.textColor} ${style.borderColor} border`}>
        <span>{icon}</span>
        <span className="font-medium">{comment.title}</span>
      </span>
    );
  }

  return (
    <div 
      className={`p-4 rounded-lg border ${style.bgColor} ${style.borderColor} ${style.textColor} cursor-pointer transition-all duration-200 hover:shadow-md`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{icon}</span>
          <div className="flex-1">
            <h4 className="font-semibold text-base">{comment.title}</h4>
            {isExpanded && (
              <p className="mt-2 text-sm opacity-90">{comment.message}</p>
            )}
          </div>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

interface DataCommentListProps {
  comments: DataCommentType[];
  className?: string;
}

export const DataCommentList: React.FC<DataCommentListProps> = ({ comments, className = '' }) => {
  if (comments.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-3">データ解釈・インサイト</h3>
      {comments.map((comment) => (
        <DataComment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

interface MetricWithCommentProps {
  label: string;
  value: string | number;
  unit?: string;
  comment?: DataCommentType;
  className?: string;
}

export const MetricWithComment: React.FC<MetricWithCommentProps> = ({
  label,
  value,
  unit,
  comment,
  className = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{label}</span>
        {comment && (
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="text-lg">{commentIcons[comment.type]}</span>
            </button>
            {showTooltip && (
              <div className="absolute z-10 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 -top-2 right-full mr-2">
                <div className="absolute w-2 h-2 bg-white border-t border-r border-gray-200 transform rotate-45 -right-1 top-3"></div>
                <h5 className="font-semibold text-sm mb-1">{comment.title}</h5>
                <p className="text-xs text-gray-600">{comment.message}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold">
        {value}
        {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
      </p>
    </div>
  );
};