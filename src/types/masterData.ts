export type FieldType = 'string' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect' | 'textarea';

export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  defaultValue?: any;
  hidden?: boolean;
  readonly?: boolean;
}

export interface MasterSchema {
  name: string;
  label: string;
  fields: FieldDefinition[];
  searchableFields?: string[];
  sortableFields?: string[];
  exportFields?: string[];
}

export interface MasterRecord {
  id: string;
  data: Record<string, any>;
  metadata?: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
    version?: number;
  };
  customFields?: Record<string, any>;
}

export interface ChangeHistory {
  id: string;
  masterType: string;
  recordId: string;
  action: 'create' | 'update' | 'delete';
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  timestamp: string;
  userId?: string;
  userName?: string;
}

export interface ImportResult {
  success: boolean;
  totalRecords: number;
  successCount: number;
  errorCount: number;
  errors?: {
    row: number;
    field?: string;
    message: string;
  }[];
}