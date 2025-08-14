/**
 * Profile Image Component  
 * プロフィール画像表示・管理コンポーネント
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { User, Camera, Edit3, Trash2, Upload } from 'lucide-react';
import { imageStorage, StoredImage } from '@/lib/image/imageStorage';
import { ImageUploader } from './ImageUploader';
import { cn } from '@/lib/utils';

interface ProfileImageProps {
  staffId: string;
  staffName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  showName?: boolean;
  className?: string;
  onImageChange?: (imageId: string | null) => void;
}

const sizeClasses = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-16 h-16 text-lg', 
  lg: 'w-24 h-24 text-xl',
  xl: 'w-32 h-32 text-2xl'
};

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8', 
  xl: 'h-10 w-10'
};

export function ProfileImage({
  staffId,
  staffName,
  size = 'md',
  editable = false,
  showName = false,
  className,
  onImageChange
}: ProfileImageProps) {
  const [profileImage, setProfileImage] = useState<StoredImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * プロフィール画像を読み込み
   */
  const loadProfileImage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const image = await imageStorage.getStaffProfileImage(staffId);
      setProfileImage(image);
    } catch (error) {
      console.error('Failed to load profile image:', error);
      setError('画像の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    loadProfileImage();
  }, [loadProfileImage]);

  /**
   * 画像アップロード完了処理
   */
  const handleUploadComplete = useCallback(async (imageId: string) => {
    try {
      await imageStorage.setStaffProfileImage(staffId, imageId);
      await loadProfileImage();
      setShowUploader(false);
      onImageChange?.(imageId);
    } catch (error) {
      console.error('Failed to set profile image:', error);
      setError('プロフィール画像の設定に失敗しました');
    }
  }, [staffId, loadProfileImage, onImageChange]);

  /**
   * 画像削除処理
   */
  const handleDeleteImage = useCallback(async () => {
    if (!profileImage || !confirm('プロフィール画像を削除しますか？')) return;

    try {
      const deleted = await imageStorage.deleteImage(profileImage.id);
      if (deleted) {
        setProfileImage(null);
        onImageChange?.(null);
      }
    } catch (error) {
      console.error('Failed to delete profile image:', error);
      setError('画像の削除に失敗しました');
    }
  }, [profileImage, onImageChange]);

  /**
   * イニシャル取得
   */
  const getInitials = useCallback((name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }, []);

  /**
   * 背景色生成（名前ベース）
   */
  const getBackgroundColor = useCallback((name: string) => {
    const colors = [
      'bg-gradient-to-br from-purple-500 to-pink-600',
      'bg-gradient-to-br from-blue-500 to-cyan-600',
      'bg-gradient-to-br from-green-500 to-teal-600',
      'bg-gradient-to-br from-yellow-500 to-orange-600',
      'bg-gradient-to-br from-red-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-purple-600'
    ];
    
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  }, []);

  if (showUploader) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">プロフィール画像の変更</h3>
          <button
            onClick={() => setShowUploader(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <ImageUploader
          staffId={staffId}
          onUpload={handleUploadComplete}
          onError={setError}
          maxFiles={1}
          showPreview={true}
        />

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* プロフィール画像 */}
      <div className={cn(
        'relative rounded-full overflow-hidden border-2 border-white shadow-lg',
        sizeClasses[size]
      )}>
        {loading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
          </div>
        ) : profileImage ? (
          <img
            src={profileImage.thumbnail}
            alt={`${staffName}のプロフィール`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Profile image failed to load');
              setProfileImage(null);
            }}
          />
        ) : (
          <div className={cn(
            'w-full h-full flex items-center justify-center text-white font-bold',
            getBackgroundColor(staffName)
          )}>
            {getInitials(staffName)}
          </div>
        )}

        {/* カメラアイコンオーバーレイ */}
        {editable && !loading && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 cursor-pointer group"
               onClick={() => setShowUploader(true)}>
            <Camera className={cn(
              'text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200',
              iconSizes[size]
            )} />
          </div>
        )}
      </div>

      {/* 編集ボタン */}
      {editable && !loading && size !== 'sm' && (
        <div className="absolute -bottom-1 -right-1 flex gap-1">
          <button
            onClick={() => setShowUploader(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
            title="画像を変更"
          >
            <Edit3 className="h-3 w-3" />
          </button>
          
          {profileImage && (
            <button
              onClick={handleDeleteImage}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
              title="画像を削除"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {/* 名前表示 */}
      {showName && (
        <div className="mt-2 text-center">
          <div className={cn(
            'font-medium text-gray-900',
            size === 'sm' ? 'text-xs' :
            size === 'md' ? 'text-sm' :
            size === 'lg' ? 'text-base' : 'text-lg'
          )}>
            {staffName}
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {error && !showUploader && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1 whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
}

/**
 * 職員一覧用のコンパクトなプロフィール画像
 */
export function StaffAvatarList({
  staffList,
  maxDisplay = 5,
  size = 'sm',
  className
}: {
  staffList: Array<{ id: string; name: string }>;
  maxDisplay?: number;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const displayList = staffList.slice(0, maxDisplay);
  const remaining = Math.max(0, staffList.length - maxDisplay);

  return (
    <div className={cn('flex -space-x-2', className)}>
      {displayList.map((staff) => (
        <div key={staff.id} className="relative">
          <ProfileImage
            staffId={staff.id}
            staffName={staff.name}
            size={size}
            className="ring-2 ring-white"
          />
        </div>
      ))}
      
      {remaining > 0 && (
        <div className={cn(
          'flex items-center justify-center bg-gray-200 text-gray-600 rounded-full ring-2 ring-white font-medium',
          sizeClasses[size]
        )}>
          +{remaining}
        </div>
      )}
    </div>
  );
}