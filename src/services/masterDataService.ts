import { MasterRecord, ChangeHistory, ImportResult } from '@/types/masterData';
import { masterSchemas } from '@/config/masterSchemas';

class MasterDataService {
  private readonly STORAGE_PREFIX = 'master_';
  private readonly HISTORY_PREFIX = 'history_';
  
  private getStorageKey(masterType: string): string {
    return `${this.STORAGE_PREFIX}${masterType}`;
  }
  
  private getHistoryKey(masterType: string): string {
    return `${this.HISTORY_PREFIX}${masterType}`;
  }
  
  async getAll(masterType: string): Promise<MasterRecord[]> {
    try {
      const stored = localStorage.getItem(this.getStorageKey(masterType));
      if (!stored) return this.getInitialData(masterType);
      return JSON.parse(stored);
    } catch (error) {
      console.error(`Error loading ${masterType} data:`, error);
      return this.getInitialData(masterType);
    }
  }
  
  async getById(masterType: string, id: string): Promise<MasterRecord | null> {
    const records = await this.getAll(masterType);
    return records.find(r => r.id === id) || null;
  }
  
  async create(masterType: string, data: Record<string, any>): Promise<MasterRecord> {
    const records = await this.getAll(masterType);
    const newRecord: MasterRecord = {
      id: this.generateId(),
      data,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      },
    };
    
    records.push(newRecord);
    this.save(masterType, records);
    
    await this.addHistory(masterType, {
      masterType,
      recordId: newRecord.id,
      action: 'create',
      timestamp: new Date().toISOString(),
    });
    
    return newRecord;
  }
  
  async update(masterType: string, id: string, data: Record<string, any>): Promise<MasterRecord | null> {
    const records = await this.getAll(masterType);
    const index = records.findIndex(r => r.id === id);
    
    if (index === -1) return null;
    
    const oldRecord = records[index];
    const changes = this.getChanges(oldRecord.data, data);
    
    const updatedRecord: MasterRecord = {
      ...oldRecord,
      data,
      metadata: {
        createdAt: oldRecord.metadata?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: oldRecord.metadata?.createdBy,
        updatedBy: oldRecord.metadata?.updatedBy,
        version: (oldRecord.metadata?.version || 0) + 1,
      },
    };
    
    records[index] = updatedRecord;
    this.save(masterType, records);
    
    await this.addHistory(masterType, {
      masterType,
      recordId: id,
      action: 'update',
      changes,
      timestamp: new Date().toISOString(),
    });
    
    return updatedRecord;
  }
  
  async delete(masterType: string, id: string): Promise<boolean> {
    const records = await this.getAll(masterType);
    const index = records.findIndex(r => r.id === id);
    
    if (index === -1) return false;
    
    records.splice(index, 1);
    this.save(masterType, records);
    
    await this.addHistory(masterType, {
      masterType,
      recordId: id,
      action: 'delete',
      timestamp: new Date().toISOString(),
    });
    
    return true;
  }
  
  async bulkDelete(masterType: string, ids: string[]): Promise<number> {
    const records = await this.getAll(masterType);
    const initialCount = records.length;
    const filtered = records.filter(r => !ids.includes(r.id));
    const deletedCount = initialCount - filtered.length;
    
    if (deletedCount > 0) {
      this.save(masterType, filtered);
      
      for (const id of ids) {
        await this.addHistory(masterType, {
          masterType,
          recordId: id,
          action: 'delete',
          timestamp: new Date().toISOString(),
        });
      }
    }
    
    return deletedCount;
  }
  
  async importData(masterType: string, data: any[], mode: 'append' | 'replace' = 'append'): Promise<ImportResult> {
    const schema = masterSchemas[masterType];
    if (!schema) {
      return {
        success: false,
        totalRecords: data.length,
        successCount: 0,
        errorCount: data.length,
        errors: [{ row: 0, message: 'Invalid master type' }],
      };
    }
    
    const errors: ImportResult['errors'] = [];
    const validRecords: MasterRecord[] = [];
    
    data.forEach((item, index) => {
      const validation = this.validateRecord(masterType, item);
      if (!validation.valid) {
        errors?.push({
          row: index + 1,
          field: validation.field,
          message: validation.message || 'Validation failed',
        });
      } else {
        validRecords.push({
          id: item.id || this.generateId(),
          data: item,
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
          },
        });
      }
    });
    
    if (validRecords.length > 0) {
      if (mode === 'replace') {
        this.save(masterType, validRecords);
      } else {
        const existing = await this.getAll(masterType);
        this.save(masterType, [...existing, ...validRecords]);
      }
    }
    
    return {
      success: errors?.length === 0,
      totalRecords: data.length,
      successCount: validRecords.length,
      errorCount: errors?.length || 0,
      errors,
    };
  }
  
  async exportData(masterType: string, format: 'json' | 'csv' = 'json'): Promise<string> {
    const records = await this.getAll(masterType);
    const schema = masterSchemas[masterType];
    
    if (format === 'csv') {
      return this.convertToCSV(records, schema?.exportFields);
    }
    
    return JSON.stringify(records.map(r => r.data), null, 2);
  }
  
  async getHistory(masterType: string, recordId?: string): Promise<ChangeHistory[]> {
    try {
      const stored = localStorage.getItem(this.getHistoryKey(masterType));
      if (!stored) return [];
      
      const history: ChangeHistory[] = JSON.parse(stored);
      
      if (recordId) {
        return history.filter(h => h.recordId === recordId);
      }
      
      return history;
    } catch (error) {
      console.error(`Error loading history for ${masterType}:`, error);
      return [];
    }
  }
  
  private async addHistory(masterType: string, entry: Omit<ChangeHistory, 'id'>): Promise<void> {
    const history = await this.getHistory(masterType);
    history.push({
      ...entry,
      id: this.generateId(),
    });
    
    localStorage.setItem(this.getHistoryKey(masterType), JSON.stringify(history));
  }
  
  private save(masterType: string, records: MasterRecord[]): void {
    localStorage.setItem(this.getStorageKey(masterType), JSON.stringify(records));
  }
  
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private validateRecord(masterType: string, data: Record<string, any>): { valid: boolean; field?: string; message?: string } {
    const schema = masterSchemas[masterType];
    if (!schema) {
      return { valid: false, message: 'Schema not found' };
    }
    
    for (const field of schema.fields) {
      if (field.required && !data[field.key]) {
        return { valid: false, field: field.key, message: `${field.label}は必須です` };
      }
      
      if (field.validation) {
        const value = data[field.key];
        
        if (field.type === 'number' && value != null) {
          if (field.validation.min !== undefined && value < field.validation.min) {
            return { valid: false, field: field.key, message: `${field.label}は${field.validation.min}以上である必要があります` };
          }
          if (field.validation.max !== undefined && value > field.validation.max) {
            return { valid: false, field: field.key, message: `${field.label}は${field.validation.max}以下である必要があります` };
          }
        }
        
        if (field.type === 'string' && field.validation.pattern && value) {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(value)) {
            return { valid: false, field: field.key, message: field.validation.message || `${field.label}の形式が正しくありません` };
          }
        }
      }
    }
    
    return { valid: true };
  }
  
  private getChanges(oldData: Record<string, any>, newData: Record<string, any>) {
    const changes: ChangeHistory['changes'] = [];
    
    for (const key in newData) {
      if (oldData[key] !== newData[key]) {
        changes?.push({
          field: key,
          oldValue: oldData[key],
          newValue: newData[key],
        });
      }
    }
    
    return changes;
  }
  
  private convertToCSV(records: MasterRecord[], exportFields?: string[]): string {
    if (records.length === 0) return '';
    
    const fields = exportFields || Object.keys(records[0].data);
    const headers = fields.join(',');
    
    const rows = records.map(record => {
      return fields.map(field => {
        const value = record.data[field];
        if (value == null) return '';
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value.toString();
      }).join(',');
    });
    
    return [headers, ...rows].join('\n');
  }
  
  private getInitialData(masterType: string): MasterRecord[] {
    switch (masterType) {
      case 'staff':
        return [
          {
            id: '1',
            data: {
              id: '1',
              employeeNumber: 'E001',
              name: '山田太郎',
              nameKana: 'ヤマダタロウ',
              email: 'yamada@example.com',
              department: 'medical',
              position: 'manager',
              hireDate: '2020-04-01',
              employmentType: 'fulltime',
              isActive: true,
            },
            metadata: {
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              version: 1,
            },
          },
          {
            id: '2',
            data: {
              id: '2',
              employeeNumber: 'E002',
              name: '佐藤花子',
              nameKana: 'サトウハナコ',
              email: 'sato@example.com',
              department: 'nursing',
              position: 'chief',
              hireDate: '2021-04-01',
              employmentType: 'fulltime',
              isActive: true,
            },
            metadata: {
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              version: 1,
            },
          },
        ];
        
      case 'facility':
        return [
          {
            id: '1',
            data: {
              id: '1',
              code: 'F001',
              name: '本院',
              type: 'hospital',
              address: '東京都渋谷区1-1-1',
              phone: '03-1234-5678',
              manager: '院長 田中',
              capacity: 200,
              isActive: true,
            },
            metadata: {
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              version: 1,
            },
          },
        ];
        
      case 'training':
        return [
          {
            id: '1',
            data: {
              id: '1',
              code: 'T001',
              name: '医療安全研修',
              category: 'mandatory',
              description: '医療安全に関する基本的な知識と実践',
              duration: 3,
              frequency: 'yearly',
              targetAudience: ['all'],
              isMandatory: true,
              isActive: true,
            },
            metadata: {
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              version: 1,
            },
          },
        ];
        
      case 'evaluationItem':
        return [
          {
            id: '1',
            data: {
              id: '1',
              code: 'EV001',
              name: '専門知識',
              category: 'knowledge',
              description: '業務に必要な専門知識を有している',
              evaluationType: 'score5',
              weight: 2,
              targetPosition: ['all'],
              displayOrder: 1,
              isRequired: true,
              isActive: true,
            },
            metadata: {
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              version: 1,
            },
          },
        ];
        
      default:
        return [];
    }
  }
}

export const masterDataService = new MasterDataService();