/**
 * Image Storage Service
 * 画像ファイルの保存・取得・管理
 */

import { AppError } from '@/lib/error/AppError';
import { ErrorLevel, ErrorCategory } from '@/lib/error/ErrorTypes';
import { offlineCache } from '@/lib/offline/OfflineCache';

/**
 * 画像メタデータ
 */
export interface ImageMetadata {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  originalSize: number;
  compressionRatio: number;
  dimensions: {
    width: number;
    height: number;
  };
  uploadedAt: Date;
  uploadedBy?: string;
  tags?: string[];
}

/**
 * 保存された画像データ
 */
export interface StoredImage {
  id: string;
  metadata: ImageMetadata;
  original: string; // Data URL
  preview: string;  // Data URL
  thumbnail: string; // Data URL
}

/**
 * 画像ストレージクラス
 */
export class ImageStorage {
  private static instance: ImageStorage;
  private readonly STORAGE_PREFIX = 'staff_image_';
  private readonly METADATA_KEY = 'staff_images_metadata';
  private readonly MAX_STORAGE_SIZE = 50 * 1024 * 1024; // 50MB

  private constructor() {}

  static getInstance(): ImageStorage {
    if (!ImageStorage.instance) {
      ImageStorage.instance = new ImageStorage();
    }
    return ImageStorage.instance;
  }

  /**
   * 画像を保存
   */
  async saveImage(
    imageId: string,
    originalDataUrl: string,
    previewDataUrl: string,
    thumbnailDataUrl: string,
    metadata: Omit<ImageMetadata, 'id' | 'uploadedAt'>
  ): Promise<StoredImage> {
    try {
      // ストレージ容量チェック
      await this.checkStorageSpace();

      const fullMetadata: ImageMetadata = {
        ...metadata,
        id: imageId,
        uploadedAt: new Date()
      };

      const storedImage: StoredImage = {
        id: imageId,
        metadata: fullMetadata,
        original: originalDataUrl,
        preview: previewDataUrl,
        thumbnail: thumbnailDataUrl
      };

      // 画像データを保存
      await this.saveImageData(imageId, storedImage);

      // メタデータを更新
      await this.updateMetadataIndex(fullMetadata);

      return storedImage;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError({
        code: 'ERR_IMAGE_SAVE',
        message: error instanceof Error ? error.message : 'Unknown error during image save',
        userMessage: '画像の保存に失敗しました',
        level: ErrorLevel.ERROR,
        category: ErrorCategory.STORAGE
      });
    }
  }

  /**
   * 画像を取得
   */
  async getImage(imageId: string): Promise<StoredImage | null> {
    try {
      // オフラインキャッシュから取得を試行
      const cached = await offlineCache.get<StoredImage>(`${this.STORAGE_PREFIX}${imageId}`);
      if (cached) {
        return cached;
      }

      // LocalStorageから取得
      const stored = localStorage.getItem(`${this.STORAGE_PREFIX}${imageId}`);
      if (stored) {
        const image = JSON.parse(stored) as StoredImage;
        
        // キャッシュに保存（1時間のTTL）
        await offlineCache.set(`${this.STORAGE_PREFIX}${imageId}`, image, { 
          ttl: 60 * 60 * 1000 
        });
        
        return image;
      }

      return null;
    } catch (error) {
      console.error('Error getting image:', error);
      return null;
    }
  }

  /**
   * 画像一覧を取得
   */
  async getImageList(): Promise<ImageMetadata[]> {
    try {
      const metadataJson = localStorage.getItem(this.METADATA_KEY);
      if (metadataJson) {
        const metadata = JSON.parse(metadataJson) as ImageMetadata[];
        return metadata.sort((a, b) => 
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
      }
      return [];
    } catch (error) {
      console.error('Error getting image list:', error);
      return [];
    }
  }

  /**
   * 画像を削除
   */
  async deleteImage(imageId: string): Promise<boolean> {
    try {
      // 画像データを削除
      localStorage.removeItem(`${this.STORAGE_PREFIX}${imageId}`);
      
      // オフラインキャッシュからも削除
      await offlineCache.remove(`${this.STORAGE_PREFIX}${imageId}`);

      // メタデータから削除
      await this.removeFromMetadataIndex(imageId);

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  /**
   * 特定職員の画像を取得
   */
  async getStaffImages(staffId: string): Promise<StoredImage[]> {
    try {
      const metadata = await this.getImageList();
      const staffImages = metadata.filter(meta => 
        meta.tags?.includes(`staff:${staffId}`)
      );

      const images: StoredImage[] = [];
      for (const meta of staffImages) {
        const image = await this.getImage(meta.id);
        if (image) {
          images.push(image);
        }
      }

      return images;
    } catch (error) {
      console.error('Error getting staff images:', error);
      return [];
    }
  }

  /**
   * 職員のプロフィール画像を設定
   */
  async setStaffProfileImage(staffId: string, imageId: string): Promise<void> {
    try {
      // 既存のプロフィール画像タグを削除
      await this.removeStaffProfileTag(staffId);

      // 新しい画像にプロフィールタグを追加
      const image = await this.getImage(imageId);
      if (image) {
        const updatedTags = [...(image.metadata.tags || []), `profile:${staffId}`];
        const updatedMetadata: ImageMetadata = {
          ...image.metadata,
          tags: updatedTags
        };

        const updatedImage: StoredImage = {
          ...image,
          metadata: updatedMetadata
        };

        await this.saveImageData(imageId, updatedImage);
        await this.updateMetadataIndex(updatedMetadata);
      }
    } catch (error) {
      throw new AppError({
        code: 'ERR_PROFILE_IMAGE_SET',
        message: 'Failed to set staff profile image',
        userMessage: 'プロフィール画像の設定に失敗しました',
        level: ErrorLevel.ERROR,
        category: ErrorCategory.STORAGE
      });
    }
  }

  /**
   * 職員のプロフィール画像を取得
   */
  async getStaffProfileImage(staffId: string): Promise<StoredImage | null> {
    try {
      const metadata = await this.getImageList();
      const profileImage = metadata.find(meta => 
        meta.tags?.includes(`profile:${staffId}`)
      );

      if (profileImage) {
        return await this.getImage(profileImage.id);
      }

      return null;
    } catch (error) {
      console.error('Error getting staff profile image:', error);
      return null;
    }
  }

  /**
   * ストレージ使用量を取得
   */
  async getStorageUsage(): Promise<{
    totalSize: number;
    imageCount: number;
    availableSpace: number;
    usagePercentage: number;
  }> {
    try {
      const metadata = await this.getImageList();
      const totalSize = metadata.reduce((sum, meta) => sum + meta.fileSize, 0);
      const imageCount = metadata.length;
      const availableSpace = this.MAX_STORAGE_SIZE - totalSize;
      const usagePercentage = (totalSize / this.MAX_STORAGE_SIZE) * 100;

      return {
        totalSize,
        imageCount,
        availableSpace,
        usagePercentage
      };
    } catch (error) {
      console.error('Error getting storage usage:', error);
      return {
        totalSize: 0,
        imageCount: 0,
        availableSpace: this.MAX_STORAGE_SIZE,
        usagePercentage: 0
      };
    }
  }

  /**
   * 古い画像を自動削除
   */
  async cleanupOldImages(maxAge: number = 365): Promise<number> {
    try {
      const metadata = await this.getImageList();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - maxAge);

      let deletedCount = 0;
      for (const meta of metadata) {
        if (new Date(meta.uploadedAt) < cutoffDate && 
            !meta.tags?.some(tag => tag.startsWith('profile:'))) {
          const deleted = await this.deleteImage(meta.id);
          if (deleted) deletedCount++;
        }
      }

      return deletedCount;
    } catch (error) {
      console.error('Error during cleanup:', error);
      return 0;
    }
  }

  // ==================== プライベートメソッド ====================

  private async saveImageData(imageId: string, image: StoredImage): Promise<void> {
    const key = `${this.STORAGE_PREFIX}${imageId}`;
    localStorage.setItem(key, JSON.stringify(image));
    
    // オフラインキャッシュにも保存
    await offlineCache.set(key, image, { ttl: 60 * 60 * 1000 });
  }

  private async updateMetadataIndex(metadata: ImageMetadata): Promise<void> {
    const existing = await this.getImageList();
    const updated = existing.filter(meta => meta.id !== metadata.id);
    updated.push(metadata);
    
    localStorage.setItem(this.METADATA_KEY, JSON.stringify(updated));
  }

  private async removeFromMetadataIndex(imageId: string): Promise<void> {
    const existing = await this.getImageList();
    const updated = existing.filter(meta => meta.id !== imageId);
    
    localStorage.setItem(this.METADATA_KEY, JSON.stringify(updated));
  }

  private async removeStaffProfileTag(staffId: string): Promise<void> {
    const metadata = await this.getImageList();
    
    for (const meta of metadata) {
      if (meta.tags?.includes(`profile:${staffId}`)) {
        const image = await this.getImage(meta.id);
        if (image) {
          const updatedTags = meta.tags.filter(tag => tag !== `profile:${staffId}`);
          const updatedMetadata: ImageMetadata = {
            ...meta,
            tags: updatedTags
          };

          const updatedImage: StoredImage = {
            ...image,
            metadata: updatedMetadata
          };

          await this.saveImageData(meta.id, updatedImage);
          await this.updateMetadataIndex(updatedMetadata);
        }
      }
    }
  }

  private async checkStorageSpace(): Promise<void> {
    const usage = await this.getStorageUsage();
    
    if (usage.usagePercentage > 90) {
      // 古い画像を自動削除
      await this.cleanupOldImages(180); // 180日以上前の画像を削除
    }

    if (usage.usagePercentage > 95) {
      throw new AppError({
        code: 'ERR_QUOTA_EXCEEDED',
        message: 'Storage quota exceeded',
        userMessage: 'ストレージの容量が不足しています。古い画像を削除してください。',
        level: ErrorLevel.ERROR,
        category: ErrorCategory.STORAGE
      });
    }
  }
}

// シングルトンインスタンスをエクスポート
export const imageStorage = ImageStorage.getInstance();