import React from 'react';
import { DataComment as DataCommentType, commentIcons, commentStyles } from '@/types/commentTypes';

interface DataCommentProps {
  comment: DataCommentType;
  inline?: boolean;
}

export const DataComment: React.FC<DataCommentProps> = ({ comment, inline = false }) => {
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
      className={`p-4 rounded-lg border ${style.bgColor} ${style.borderColor} ${style.textColor} transition-all duration-200`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-base">{comment.title}</h4>
          <p className="mt-2 text-sm opacity-90">{comment.message}</p>
        </div>
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
  const [showTooltip, setShowTooltip] = React.useState(false);

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

// シンプルなDataCommentコンポーネント（デフォルトエクスポート）
interface SimpleDataCommentProps {
  comment: string;
  details?: string[];
}

const SimpleDataComment: React.FC<SimpleDataCommentProps> = ({ comment, details }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
      <h3 className="text-lg font-semibold text-blue-900 mb-2">分析インサイト</h3>
      <p className="text-blue-800 mb-3">{comment}</p>
      {details && details.length > 0 && (
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          {details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SimpleDataComment;