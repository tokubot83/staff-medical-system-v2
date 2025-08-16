/**
 * Image Management Admin Page
 * 管理者用画像管理ページ
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Trash2, Download, Upload, Search, Filter, Eye, Users, HardDrive, AlertCircle } from 'lucide-react';
import { imageStorage, ImageMetadata, StoredImage } from '@/lib/image/imageStorage';
import { formatFileSize } from '@/lib/image/imageUtils';
import { ProfileImage, StaffAvatarList } from '@/components/image/ProfileImage';
import { ImageUploader } from '@/components/image/ImageUploader';
import CommonHeader from '@/components/CommonHeader';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface StorageStats {
  totalSize: number;
  imageCount: number;
  availableSpace: number;
  usagePercentage: number;
}

export default function ImageManagementPage() {
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageMetadata[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'profile' | 'orphaned'>('all');
  const [showUploader, setShowUploader] = useState(false);
  const [selectedImage, setSelectedImage] = useState<StoredImage | null>(null);
  
  const { handleError } = useErrorHandler();

  /**
   * データを読み込み
   */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [imageList, stats] = await Promise.all([
        imageStorage.getImageList(),
        imageStorage.getStorageUsage()
      ]);
      
      setImages(imageList);
      setStorageStats(stats);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * フィルター適用
   */
  useEffect(() => {
    let filtered = images;

    // 検索フィルター
    if (searchTerm) {
      filtered = filtered.filter(image =>
        image.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // タイプフィルター
    switch (filterType) {
      case 'profile':
        filtered = filtered.filter(image => 
          image.tags?.some(tag => tag.startsWith('profile:'))
        );
        break;
      case 'orphaned':
        filtered = filtered.filter(image => 
          !image.tags?.some(tag => tag.startsWith('staff:') || tag.startsWith('profile:'))
        );
        break;
    }

    setFilteredImages(filtered);
  }, [images, searchTerm, filterType]);

  /**
   * 画像削除
   */
  const handleDeleteImages = useCallback(async () => {
    if (selectedImages.size === 0) return;
    
    const confirmation = confirm(`選択した${selectedImages.size}件の画像を削除しますか？`);
    if (!confirmation) return;

    try {
      const deletePromises = Array.from(selectedImages).map(imageId =>
        imageStorage.deleteImage(imageId)
      );
      
      await Promise.all(deletePromises);
      setSelectedImages(new Set());
      await loadData();
    } catch (error) {
      handleError(error);
    }
  }, [selectedImages, handleError, loadData]);

  /**
   * 古い画像の自動削除
   */
  const handleCleanup = useCallback(async () => {
    const confirmation = confirm('180日以上前の未使用画像を削除しますか？');
    if (!confirmation) return;

    try {
      const deletedCount = await imageStorage.cleanupOldImages(180);
      alert(`${deletedCount}件の画像を削除しました`);
      await loadData();
    } catch (error) {
      handleError(error);
    }
  }, [handleError, loadData]);

  /**
   * 画像プレビュー
   */
  const handlePreviewImage = useCallback(async (imageId: string) => {
    try {
      const image = await imageStorage.getImage(imageId);
      setSelectedImage(image);
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  /**
   * 選択状態の切り替え
   */
  const toggleSelection = useCallback((imageId: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  }, [selectedImages]);

  /**
   * 全選択/全解除
   */
  const toggleSelectAll = useCallback(() => {
    if (selectedImages.size === filteredImages.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(filteredImages.map(img => img.id)));
    }
  }, [selectedImages.size, filteredImages]);

  if (loading) {
    return (
      <div>
        <CommonHeader title="画像管理" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">読み込み中...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CommonHeader title="画像管理" />
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* ストレージ使用量 */}
        {storageStats && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                ストレージ使用量
              </h2>
              <button
                onClick={handleCleanup}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                古い画像を削除
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl font-bold text-gray-900">
                  {storageStats.imageCount}
                </div>
                <div className="text-sm text-gray-600">画像数</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl font-bold text-gray-900">
                  {formatFileSize(storageStats.totalSize)}
                </div>
                <div className="text-sm text-gray-600">使用容量</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl font-bold text-gray-900">
                  {formatFileSize(storageStats.availableSpace)}
                </div>
                <div className="text-sm text-gray-600">利用可能</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl font-bold text-gray-900">
                  {storageStats.usagePercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">使用率</div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  storageStats.usagePercentage > 90 ? 'bg-red-500' :
                  storageStats.usagePercentage > 70 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(storageStats.usagePercentage, 100)}%` }}
              ></div>
            </div>
            
            {storageStats.usagePercentage > 90 && (
              <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                ストレージ容量が不足しています。古い画像の削除を検討してください。
              </div>
            )}
          </div>
        )}

        {/* コントロールパネル */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* 検索・フィルター */}
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ファイル名・タグで検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">すべて</option>
                <option value="profile">プロフィール画像</option>
                <option value="orphaned">未割り当て</option>
              </select>
            </div>

            {/* アクションボタン */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowUploader(!showUploader)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
                アップロード
              </button>
              
              {selectedImages.size > 0 && (
                <button
                  onClick={handleDeleteImages}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  削除 ({selectedImages.size})
                </button>
              )}
            </div>
          </div>

          {/* 一括選択 */}
          {filteredImages.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={selectedImages.size === filteredImages.length && filteredImages.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                すべて選択 ({filteredImages.length}件)
              </label>
            </div>
          )}
        </div>

        {/* アップローダー */}
        {showUploader && (
          <div className="bg-white rounded-lg shadow p-6">
            <ImageUploader
              onUpload={() => {
                loadData();
                setShowUploader(false);
              }}
              maxFiles={5}
              showPreview={true}
            />
          </div>
        )}

        {/* 画像一覧 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            画像一覧 ({filteredImages.length}件)
          </h2>
          
          {filteredImages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {images.length === 0 ? '画像がありません' : '検索条件に一致する画像がありません'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                    selectedImages.has(image.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                >
                  {/* 選択チェックボックス */}
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="checkbox"
                      checked={selectedImages.has(image.id)}
                      onChange={() => toggleSelection(image.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handlePreviewImage(image.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  {/* 画像プレビュー */}
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <ProfileImage
                      staffId={image.tags?.find(tag => tag.startsWith('staff:'))?.replace('staff:', '') || ''}
                      staffName={image.fileName}
                      size="lg"
                      className="w-full h-full"
                    />
                  </div>

                  {/* 画像情報 */}
                  <div className="space-y-2 text-sm">
                    <div className="font-medium text-gray-900 truncate">
                      {image.fileName}
                    </div>
                    <div className="text-gray-600">
                      {formatFileSize(image.fileSize)}
                    </div>
                    <div className="text-gray-600">
                      {image.dimensions.width} × {image.dimensions.height}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {new Date(image.uploadedAt).toLocaleDateString('ja-JP')}
                    </div>
                    
                    {/* タグ表示 */}
                    {image.tags && image.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {image.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              tag.startsWith('profile:') 
                                ? 'bg-green-100 text-green-800'
                                : tag.startsWith('staff:')
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {tag.replace('staff:', '').replace('profile:', 'プロフィール:')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 画像プレビューモーダル */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">画像プレビュー</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Image
                    src={selectedImage.preview}
                    alt={selectedImage.metadata.fileName}
                    width={500}
                    height={500}
                    className="w-full h-auto rounded-lg"
                    unoptimized
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">ファイル情報</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">ファイル名:</dt>
                        <dd className="text-gray-900">{selectedImage.metadata.fileName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">形式:</dt>
                        <dd className="text-gray-900">{selectedImage.metadata.fileType}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">サイズ:</dt>
                        <dd className="text-gray-900">{formatFileSize(selectedImage.metadata.fileSize)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">解像度:</dt>
                        <dd className="text-gray-900">
                          {selectedImage.metadata.dimensions.width} × {selectedImage.metadata.dimensions.height}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">アップロード日:</dt>
                        <dd className="text-gray-900">
                          {new Date(selectedImage.metadata.uploadedAt).toLocaleString('ja-JP')}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}