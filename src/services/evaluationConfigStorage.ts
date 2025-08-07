import { FacilityEvaluationConfig } from '@/types/evaluation-config';

const STORAGE_KEY = 'facility-evaluation-configs';

export class EvaluationConfigStorage {
  static saveConfig(config: FacilityEvaluationConfig): void {
    const configs = this.getAllConfigs();
    
    // 同じ施設の既存設定を更新
    const existingIndex = configs.findIndex(c => 
      c.facilityType === config.facilityType && 
      c.facilityName === config.facilityName
    );
    
    if (existingIndex >= 0) {
      configs[existingIndex] = config;
    } else {
      configs.push(config);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  }
  
  static getConfig(facilityType: string, facilityName: string): FacilityEvaluationConfig | null {
    const configs = this.getAllConfigs();
    return configs.find(c => 
      c.facilityType === facilityType && 
      c.facilityName === facilityName
    ) || null;
  }
  
  static getAllConfigs(): FacilityEvaluationConfig[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    try {
      const configs = JSON.parse(stored);
      // Date型の復元
      return configs.map((config: any) => ({
        ...config,
        configuredAt: new Date(config.configuredAt),
        approvedAt: config.approvedAt ? new Date(config.approvedAt) : undefined
      }));
    } catch (error) {
      console.error('Failed to parse stored configs:', error);
      return [];
    }
  }
  
  static deleteConfig(facilityId: string): void {
    const configs = this.getAllConfigs();
    const filtered = configs.filter(c => c.facilityId !== facilityId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
  
  static getConfigsByFacilityType(facilityType: string): FacilityEvaluationConfig[] {
    return this.getAllConfigs().filter(c => c.facilityType === facilityType);
  }
  
  static approveConfig(facilityId: string, approvedBy: string): void {
    const configs = this.getAllConfigs();
    const config = configs.find(c => c.facilityId === facilityId);
    
    if (config) {
      config.approvedBy = approvedBy;
      config.approvedAt = new Date();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
    }
  }
}