/**
 * Image Uploader Component
 * 画像アップロード用コンポーネント
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, Eye, FileImage, AlertCircle, CheckCircle } from 'lucide-react';
import { processImage, formatFileSize, IMAGE_CONFIG, ImageProcessResult } from '@/lib/image/imageUtils';
import { imageStorage, ImageMetadata } from '@/lib/image/imageStorage';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onUpload?: (imageId: string, metadata: ImageMetadata) => void;
  onError?: (error: string) => void;
  staffId?: string;
  maxFiles?: number;
  showPreview?: boolean;
  className?: string;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  result: ImageProcessResult | null;
}

export function ImageUploader({
  onUpload,
  onError,
  staffId,
  maxFiles = 1,
  showPreview = true,
  className
}: ImageUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    result: null
  });
  
  const [dragActive, setDragActive] = useState(false);
  const [previewMode, setPreviewMode] = useState<'preview' | 'thumbnail' | 'original'>('preview');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleError } = useErrorHandler();

  /**
   * ファイル選択処理
   */
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // 現在は1ファイルのみ対応
    
    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      result: null
    });

    try {
      // 画像処理（リサイズ、プレビュー生成）
      setUploadState(prev => ({ ...prev, progress: 30 }));
      const result = await processImage(file);
      
      setUploadState(prev => ({ ...prev, progress: 60, result }));

      // 画像保存
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const metadata: Omit<ImageMetadata, 'id' | 'uploadedAt'> = {
        fileName: file.name,
        fileType: file.type,
        fileSize: result.compressedBlob.size,
        originalSize: result.metadata.originalSize,
        compressionRatio: result.metadata.compressionRatio,
        dimensions: result.metadata.dimensions,
        tags: staffId ? [`staff:${staffId}`] : []
      };

      await imageStorage.saveImage(
        imageId,
        result.previewDataUrl, // 実際は圧縮版を保存
        result.previewDataUrl,
        result.thumbnailDataUrl,
        metadata
      );

      setUploadState(prev => ({ ...prev, progress: 100 }));

      // 完了通知
      onUpload?.(imageId, { ...metadata, id: imageId, uploadedAt: new Date() });
      
      // 成功状態を少し表示してからリセット
      setTimeout(() => {
        setUploadState({
          isUploading: false,
          progress: 0,
          error: null,
          result: null
        });
      }, 2000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '画像のアップロードに失敗しました';
      
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        result: null
      });

      onError?.(errorMessage);
      handleError(error);
    }
  }, [onUpload, onError, staffId, handleError]);

  /**
   * ドラッグ&ドロップ処理
   */
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  /**
   * ファイル入力クリック
   */
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * プレビューモード切り替え
   */
  const togglePreviewMode = useCallback(() => {
    const modes: Array<typeof previewMode> = ['thumbnail', 'preview', 'original'];
    const currentIndex = modes.indexOf(previewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setPreviewMode(modes[nextIndex]);
  }, [previewMode]);

  /**
   * アップロード結果をクリア
   */
  const clearResult = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      result: null
    });
  }, []);

  // プレビュー画像URL
  const getPreviewUrl = useCallback(() => {
    if (!uploadState.result) return '';
    
    switch (previewMode) {
      case 'thumbnail': return uploadState.result.thumbnailDataUrl;
      case 'original': return uploadState.result.previewDataUrl; // 元画像は大きすぎるためpreviewを使用
      default: return uploadState.result.previewDataUrl;
    }
  }, [uploadState.result, previewMode]);

  return (
    <div className={cn('w-full', className)}>
      {/* アップロードエリア */}
      {!uploadState.result && (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : uploadState.error
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50',
            uploadState.isUploading && 'pointer-events-none opacity-50'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={IMAGE_CONFIG.ALLOWED_TYPES.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          {uploadState.isUploading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  画像を処理中... {uploadState.progress}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadState.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                {uploadState.error ? (
                  <AlertCircle className="h-12 w-12 text-red-500" />
                ) : (
                  <Upload className="h-12 w-12 text-gray-400" />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="text-lg font-medium text-gray-900">
                  {uploadState.error ? 'エラーが発生しました' : '画像をアップロード'}
                </div>
                
                {uploadState.error ? (
                  <div className="text-sm text-red-600">
                    {uploadState.error}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    ファイルをここにドラッグするか、クリックして選択してください
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <div>対応形式: JPG, PNG, WebP</div>
                <div>最大サイズ: {formatFileSize(IMAGE_CONFIG.MAX_FILE_SIZE)}</div>
              </div>

              {uploadState.error && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadState(prev => ({ ...prev, error: null }));
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  再試行
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* プレビューエリア */}
      {showPreview && uploadState.result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">アップロード完了</h3>
            <div className="flex items-center gap-2">
              {uploadState.progress === 100 && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              <button
                onClick={clearResult}
                className="text-gray-500 hover:text-gray-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 画像プレビュー */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">プレビュー</span>
                  <button
                    onClick={togglePreviewMode}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="h-3 w-3" />
                    {previewMode === 'thumbnail' ? 'サムネイル' :
                     previewMode === 'preview' ? 'プレビュー' : 'オリジナル'}
                  </button>
                </div>
                
                <div className="relative bg-gray-50 rounded border p-2">
                  <img
                    src={getPreviewUrl()}
                    alt="Preview"
                    className="max-w-full h-auto mx-auto rounded"
                    style={{ maxHeight: '200px' }}
                  />
                </div>
              </div>

              {/* 画像情報 */}
              <div className="space-y-3">
                <span className="text-sm font-medium text-gray-700">画像情報</span>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>ファイル名:</span>
                    <span className="truncate ml-2">{uploadState.result.originalFile.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>形式:</span>
                    <span>{uploadState.result.originalFile.type}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>元サイズ:</span>
                    <span>{formatFileSize(uploadState.result.metadata.originalSize)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>圧縮後:</span>
                    <span>{formatFileSize(uploadState.result.metadata.compressedSize)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>圧縮率:</span>
                    <span className="text-green-600">
                      {uploadState.result.metadata.compressionRatio}% 削減
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>解像度:</span>
                    <span>
                      {uploadState.result.metadata.dimensions.width} × {uploadState.result.metadata.dimensions.height}
                    </span>
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