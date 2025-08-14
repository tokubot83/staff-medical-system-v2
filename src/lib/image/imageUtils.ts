/**
 * Image Upload Utilities
 * 画像アップロード・処理のユーティリティ関数
 */

import { AppError } from '@/lib/error/AppError';
import { ErrorLevel, ErrorCategory } from '@/lib/error/ErrorTypes';

/**
 * 画像設定
 */
export const IMAGE_CONFIG = {
  // ファイルサイズ制限（5MB）
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  
  // 許可する画像形式
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
  
  // 許可する拡張子
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'] as const,
  
  // プレビュー画像サイズ
  PREVIEW_SIZE: {
    width: 200,
    height: 200
  },
  
  // サムネイル画像サイズ
  THUMBNAIL_SIZE: {
    width: 100,
    height: 100
  },
  
  // 画像品質（JPEG）
  JPEG_QUALITY: 0.8
};

/**
 * ファイルバリデーション結果
 */
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  file?: File;
}

/**
 * 画像処理結果
 */
export interface ImageProcessResult {
  originalFile: File;
  previewDataUrl: string;
  thumbnailDataUrl: string;
  compressedBlob: Blob;
  metadata: {
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    dimensions: {
      width: number;
      height: number;
    };
  };
}

/**
 * ファイルバリデーション
 */
export function validateImageFile(file: File): FileValidationResult {
  // ファイルサイズチェック
  if (file.size > IMAGE_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `ファイルサイズが大きすぎます。${Math.round(IMAGE_CONFIG.MAX_FILE_SIZE / 1024 / 1024)}MB以下のファイルを選択してください。`
    };
  }

  // ファイル形式チェック
  if (!IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type as any)) {
    return {
      isValid: false,
      error: `サポートされていないファイル形式です。対応形式: ${IMAGE_CONFIG.ALLOWED_EXTENSIONS.join(', ')}`
    };
  }

  // 拡張子チェック
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!IMAGE_CONFIG.ALLOWED_EXTENSIONS.includes(fileExtension as any)) {
    return {
      isValid: false,
      error: `無効な拡張子です。対応形式: ${IMAGE_CONFIG.ALLOWED_EXTENSIONS.join(', ')}`
    };
  }

  return {
    isValid: true,
    file
  };
}

/**
 * 画像をリサイズ
 */
export function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = IMAGE_CONFIG.JPEG_QUALITY
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // アスペクト比を維持してリサイズ
      let { width, height } = calculateDimensions(
        img.width,
        img.height,
        maxWidth,
        maxHeight
      );

      canvas.width = width;
      canvas.height = height;

      // 高品質リサイズ
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
      }

      // Blobとして出力
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new AppError({
              code: 'ERR_IMAGE_RESIZE',
              message: 'Failed to resize image',
              userMessage: '画像のリサイズに失敗しました',
              level: ErrorLevel.ERROR,
              category: ErrorCategory.SYSTEM
            }));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      reject(new AppError({
        code: 'ERR_IMAGE_LOAD',
        message: 'Failed to load image for resizing',
        userMessage: '画像の読み込みに失敗しました',
        level: ErrorLevel.ERROR,
        category: ErrorCategory.VALIDATION
      }));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * 画像の寸法を計算（アスペクト比維持）
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
  
  return {
    width: Math.round(originalWidth * ratio),
    height: Math.round(originalHeight * ratio)
  };
}

/**
 * ファイルをデータURLに変換
 */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new AppError({
          code: 'ERR_FILE_READ',
          message: 'Failed to read file as data URL',
          userMessage: 'ファイルの読み込みに失敗しました',
          level: ErrorLevel.ERROR,
          category: ErrorCategory.SYSTEM
        }));
      }
    };
    
    reader.onerror = () => {
      reject(new AppError({
        code: 'ERR_FILE_READ',
        message: 'FileReader error',
        userMessage: 'ファイルの読み込み中にエラーが発生しました',
        level: ErrorLevel.ERROR,
        category: ErrorCategory.SYSTEM
      }));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * 画像を処理（リサイズ、プレビュー生成）
 */
export async function processImage(file: File): Promise<ImageProcessResult> {
  try {
    // バリデーション
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      throw new AppError({
        code: 'ERR_VALIDATION',
        message: validation.error || 'Invalid file',
        userMessage: validation.error || 'ファイルが無効です',
        level: ErrorLevel.ERROR,
        category: ErrorCategory.VALIDATION
      });
    }

    // 元画像の寸法を取得
    const dimensions = await getImageDimensions(file);

    // プレビュー画像生成
    const previewBlob = await resizeImage(
      file,
      IMAGE_CONFIG.PREVIEW_SIZE.width,
      IMAGE_CONFIG.PREVIEW_SIZE.height
    );
    const previewDataUrl = await fileToDataURL(new File([previewBlob], file.name, { type: file.type }));

    // サムネイル画像生成
    const thumbnailBlob = await resizeImage(
      file,
      IMAGE_CONFIG.THUMBNAIL_SIZE.width,
      IMAGE_CONFIG.THUMBNAIL_SIZE.height
    );
    const thumbnailDataUrl = await fileToDataURL(new File([thumbnailBlob], file.name, { type: file.type }));

    // 圧縮版作成（元画像が大きい場合）
    let compressedBlob: Blob = file;
    if (dimensions.width > 800 || dimensions.height > 600) {
      compressedBlob = await resizeImage(file, 800, 600, IMAGE_CONFIG.JPEG_QUALITY);
    }

    return {
      originalFile: file,
      previewDataUrl,
      thumbnailDataUrl,
      compressedBlob,
      metadata: {
        originalSize: file.size,
        compressedSize: compressedBlob.size,
        compressionRatio: Math.round((1 - compressedBlob.size / file.size) * 100),
        dimensions
      }
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new AppError({
      code: 'ERR_IMAGE_PROCESS',
      message: error instanceof Error ? error.message : 'Unknown error during image processing',
      userMessage: '画像の処理中にエラーが発生しました',
      level: ErrorLevel.ERROR,
      category: ErrorCategory.SYSTEM
    });
  }
}

/**
 * 画像の寸法を取得
 */
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new AppError({
        code: 'ERR_IMAGE_DIMENSIONS',
        message: 'Failed to load image for dimension calculation',
        userMessage: '画像の寸法取得に失敗しました',
        level: ErrorLevel.ERROR,
        category: ErrorCategory.VALIDATION
      }));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * データURLからBlobに変換
 */
export function dataURLToBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
}

/**
 * ファイルサイズを人間が読める形式に変換
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}