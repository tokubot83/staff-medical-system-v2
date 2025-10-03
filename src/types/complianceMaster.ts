'use client';

// VoiceDrive統合型コンプライアンス管理システムの型定義

export interface VoiceDriveIntegration {
  id: string;
  enabled: boolean;
  apiEndpoint: string;
  encryptionMethod: 'AES-256-GCM' | 'RSA-4096' | 'ChaCha20-Poly1305';
  autoImportEnabled: boolean;
  importInterval: number; // minutes
  anonymizationLevel: 'full' | 'partial' | 'conditional';
  hashAlgorithm: 'SHA-256' | 'SHA-512' | 'BLAKE2b';
  retentionPeriod: number; // days
  dataCategories: DataCategory[];
  fieldMappings: FieldMapping[];
  validationRules: ValidationRule[];
  notificationTriggers: NotificationTrigger[];
}

export interface DataCategory {
  id: string;
  name: string;
  voiceDriveCode: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  requiredResponseTime: number; // hours
  escalationPath: string[];
  assignedCommittee?: string;
  autoTriage: boolean;
  keywords: string[];
}

export interface FieldMapping {
  voiceDriveField: string;
  systemField: string;
  transformation?: string;
  required: boolean;
  encrypted: boolean;
}

export interface ValidationRule {
  id: string;
  field: string;
  rule: string;
  errorMessage: string;
  autoCorrect: boolean;
}

export interface NotificationTrigger {
  event: string;
  recipients: string[];
  template: string;
  priority: 'urgent' | 'high' | 'normal';
  channels: ('email' | 'sms' | 'teams' | 'slack')[];
}

export interface CaseWorkflow {
  id: string;
  name: string;
  description: string;
  stages: WorkflowStage[];
  transitions: WorkflowTransition[];
  automations: WorkflowAutomation[];
  slaRules: SLARule[];
  escalationMatrix: EscalationLevel[];
}

export interface WorkflowStage {
  id: string;
  name: string;
  type: 'initial' | 'investigation' | 'review' | 'resolution' | 'closed';
  requiredActions: RequiredAction[];
  permissions: StagePermission[];
  duration: {
    target: number; // hours
    warning: number; // hours
    critical: number; // hours
  };
  checklistItems: ChecklistItem[];
  requiredDocuments: string[];
}

export interface RequiredAction {
  id: string;
  name: string;
  responsible: string;
  deadline: number; // hours from stage start
  mandatory: boolean;
  form?: string;
}

export interface StagePermission {
  role: string;
  actions: ('view' | 'edit' | 'approve' | 'reject' | 'escalate')[];
}

// 通報受付確認通知（VoiceDrive → 通報者への通知用）
export interface AcknowledgementNotification {
  reportId: string;           // VoiceDriveのレポートID
  caseNumber: string;         // 医療システムのケース番号
  anonymousId: string;        // 匿名ID
  receivedAt: string;         // 受付日時（ISO 8601）
  category: string;           // 通報カテゴリ
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;            // 通報者へのメッセージ
  nextSteps: {
    description: string;      // 今後の流れ
    estimatedResponseTime: {
      value: number;
      unit: 'hours' | 'days';
    };
    deadlineForAdditionalInfo?: string; // 追加情報提供期限
  };
  anonymityProtection: {
    level: 'full' | 'conditional' | 'partial';
    message: string;
  };
  trackingInfo: {
    statusCheckUrl?: string;  // ステータス確認URL
    contactMethod?: string;   // 連絡方法
  };
}

export interface ChecklistItem {
  id: string;
  text: string;
  required: boolean;
  order: number;
}

export interface WorkflowTransition {
  id: string;
  from: string;
  to: string;
  condition: string;
  automatic: boolean;
  requiresApproval: boolean;
  approvers?: string[];
}

export interface WorkflowAutomation {
  id: string;
  trigger: string;
  actions: AutomationAction[];
  conditions: string[];
  enabled: boolean;
}

export interface AutomationAction {
  type: 'assign' | 'notify' | 'escalate' | 'create_task' | 'update_field';
  parameters: Record<string, any>;
}

export interface SLARule {
  id: string;
  name: string;
  condition: string;
  targetTime: number; // hours
  warningTime: number; // hours
  breachAction: string;
}

export interface EscalationLevel {
  level: number;
  triggerCondition: string;
  escalateTo: string[];
  notificationTemplate: string;
  autoEscalate: boolean;
  timeLimit: number; // hours
}

export interface CommitteeManagement {
  id: string;
  committees: Committee[];
  assignmentRules: CommitteeAssignmentRule[];
  meetingSchedules: MeetingSchedule[];
  votingRules: VotingRule[];
  reportingRequirements: ReportingRequirement[];
}

export interface Committee {
  id: string;
  name: string;
  type: 'harassment' | 'disciplinary' | 'ethics' | 'safety' | 'audit';
  members: CommitteeMember[];
  jurisdiction: string[];
  quorum: number;
  decisionAuthority: string[];
  meetingFrequency: string;
  reportingLine: string;
}

export interface CommitteeMember {
  userId: string;
  name: string;
  role: 'chair' | 'vice-chair' | 'secretary' | 'member';
  votingRights: boolean;
  term: {
    start: string;
    end: string;
  };
}

export interface CommitteeAssignmentRule {
  id: string;
  condition: string;
  committee: string;
  priority: number;
  autoAssign: boolean;
}

export interface MeetingSchedule {
  id: string;
  committee: string;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'ad-hoc';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  duration: number; // minutes
  location: string;
  virtualMeetingLink?: string;
}

export interface VotingRule {
  id: string;
  committee: string;
  decisionType: string;
  requiredMajority: 'simple' | 'two-thirds' | 'unanimous';
  quorumRequired: boolean;
  anonymousVoting: boolean;
}

export interface ReportingRequirement {
  id: string;
  committee: string;
  reportType: string;
  frequency: string;
  recipients: string[];
  template: string;
  deadline: number; // days after period end
}

export interface AnonymityProtection {
  id: string;
  protectionLevels: ProtectionLevel[];
  disclosureRules: DisclosureRule[];
  identityManagement: IdentityManagement;
  dataRedaction: DataRedaction;
  accessControl: AccessControl;
}

export interface ProtectionLevel {
  id: string;
  name: string;
  description: string;
  restrictions: string[];
  allowedDisclosure: string[];
  retentionPeriod: number; // days
  destructionMethod: string;
}

export interface DisclosureRule {
  id: string;
  condition: string;
  level: 'full' | 'partial' | 'none';
  requiresConsent: boolean;
  approvalProcess: string;
  documentationRequired: string[];
}

export interface IdentityManagement {
  anonymousIdFormat: string;
  hashingAlgorithm: string;
  saltGeneration: string;
  keyRotationPeriod: number; // days
  backupEncryption: string;
}

export interface DataRedaction {
  automaticRedaction: boolean;
  redactionPatterns: RedactionPattern[];
  sensitiveFields: string[];
  reviewRequired: boolean;
}

export interface RedactionPattern {
  id: string;
  pattern: string;
  replacement: string;
  description: string;
}

export interface AccessControl {
  roles: AccessRole[];
  permissions: Permission[];
  auditLogging: boolean;
  mfaRequired: boolean;
  sessionTimeout: number; // minutes
}

export interface AccessRole {
  id: string;
  name: string;
  permissions: string[];
  dataAccess: string[];
  restrictions: string[];
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  conditions: string[];
}

export interface AuditTrail {
  id: string;
  configuration: AuditConfiguration;
  logRetention: LogRetention;
  reportGeneration: ReportGeneration;
  complianceChecks: ComplianceCheck[];
  evidenceManagement: EvidenceManagement;
}

export interface AuditConfiguration {
  enabledEvents: string[];
  detailLevel: 'minimal' | 'standard' | 'detailed' | 'forensic';
  timestampFormat: string;
  hashChaining: boolean;
  tamperDetection: boolean;
}

export interface LogRetention {
  retentionPeriod: number; // days
  archiveLocation: string;
  compressionEnabled: boolean;
  encryptionKey: string;
  purgeSchedule: string;
}

export interface ReportGeneration {
  templates: ReportTemplate[];
  schedules: ReportSchedule[];
  distribution: ReportDistribution[];
  formats: ('PDF' | 'Excel' | 'CSV' | 'JSON')[];
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: string;
  sections: ReportSection[];
  filters: string[];
  grouping: string[];
}

export interface ReportSection {
  id: string;
  title: string;
  dataSource: string;
  visualization: 'table' | 'chart' | 'summary' | 'timeline';
  columns?: string[];
  calculations?: string[];
}

export interface ReportSchedule {
  id: string;
  template: string;
  frequency: string;
  recipients: string[];
  filters: Record<string, any>;
}

export interface ReportDistribution {
  id: string;
  method: 'email' | 'portal' | 'api' | 'sftp';
  recipients: string[];
  encryption: boolean;
  password?: string;
}

export interface ComplianceCheck {
  id: string;
  regulation: string;
  requirements: string[];
  checkFrequency: string;
  automatedChecks: string[];
  documentation: string[];
}

export interface EvidenceManagement {
  storageLocation: string;
  chainOfCustody: boolean;
  digitalSignatures: boolean;
  timestamping: boolean;
  integrityVerification: string;
}

export interface NotificationSystem {
  id: string;
  channels: NotificationChannel[];
  templates: NotificationTemplate[];
  rules: NotificationRule[];
  preferences: NotificationPreference[];
  escalations: NotificationEscalation[];
}

export interface NotificationChannel {
  id: string;
  type: 'email' | 'sms' | 'teams' | 'slack' | 'push' | 'webhook';
  configuration: Record<string, any>;
  enabled: boolean;
  priority: number;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  channel: string;
  subject?: string;
  body: string;
  variables: string[];
  attachments?: string[];
}

export interface NotificationRule {
  id: string;
  event: string;
  condition: string;
  template: string;
  recipients: RecipientRule[];
  delay?: number; // minutes
  repeat?: {
    enabled: boolean;
    interval: number; // minutes
    maxAttempts: number;
  };
}

export interface RecipientRule {
  type: 'role' | 'user' | 'group' | 'dynamic';
  value: string;
  condition?: string;
}

export interface NotificationPreference {
  userId: string;
  channels: string[];
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  categories: string[];
}

export interface NotificationEscalation {
  id: string;
  trigger: string;
  levels: EscalationStep[];
}

export interface EscalationStep {
  level: number;
  delay: number; // minutes
  recipients: string[];
  template: string;
}

export interface Investigation {
  id: string;
  caseId: string;
  investigators: Investigator[];
  timeline: InvestigationEvent[];
  interviews: Interview[];
  evidence: Evidence[];
  findings: Finding[];
  recommendations: Recommendation[];
  status: 'planning' | 'active' | 'review' | 'complete';
}

export interface Investigator {
  userId: string;
  name: string;
  role: 'lead' | 'member' | 'observer';
  assignedDate: string;
  expertise: string[];
}

export interface InvestigationEvent {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  actor: string;
  attachments?: string[];
}

export interface Interview {
  id: string;
  subject: string;
  interviewer: string;
  date: string;
  location: string;
  transcript?: string;
  recording?: string;
  notes: string;
  followUp: string[];
}

export interface Evidence {
  id: string;
  type: 'document' | 'email' | 'recording' | 'witness' | 'physical' | 'digital';
  description: string;
  source: string;
  collectedBy: string;
  collectedDate: string;
  chainOfCustody: ChainOfCustodyEntry[];
  location: string;
  integrity: string;
}

export interface ChainOfCustodyEntry {
  timestamp: string;
  from: string;
  to: string;
  action: string;
  location: string;
  witness?: string;
}

export interface Finding {
  id: string;
  category: string;
  description: string;
  evidence: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  substantiated: boolean;
  violationOf: string[];
}

export interface Recommendation {
  id: string;
  type: 'disciplinary' | 'corrective' | 'preventive' | 'training' | 'policy';
  description: string;
  responsible: string;
  deadline: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  status: 'pending' | 'approved' | 'implemented' | 'rejected';
}

export interface ComplianceDashboard {
  id: string;
  widgets: DashboardWidget[];
  layouts: DashboardLayout[];
  refreshInterval: number; // seconds
  dataFilters: DataFilter[];
}

export interface DashboardWidget {
  id: string;
  type: 'stat' | 'chart' | 'list' | 'timeline' | 'heatmap' | 'gauge';
  title: string;
  dataSource: string;
  configuration: Record<string, any>;
  refreshRate?: number;
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: WidgetPosition[];
  default: boolean;
}

export interface WidgetPosition {
  widgetId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DataFilter {
  id: string;
  field: string;
  operator: string;
  value: any;
  label: string;
}

export interface ComplianceMasterConfig {
  voiceDriveIntegration: VoiceDriveIntegration;
  caseWorkflow: CaseWorkflow;
  committeeManagement: CommitteeManagement;
  anonymityProtection: AnonymityProtection;
  auditTrail: AuditTrail;
  notificationSystem: NotificationSystem;
  dashboard: ComplianceDashboard;
  systemSettings: SystemSettings;
}

export interface SystemSettings {
  organizationName: string;
  complianceOfficer: string;
  regulatoryFrameworks: string[];
  reportingPeriod: 'monthly' | 'quarterly' | 'annually';
  timezone: string;
  language: string;
  dataRetentionPolicy: number; // days
  backupFrequency: string;
  maintenanceWindow: {
    day: string;
    time: string;
    duration: number; // hours
  };
}