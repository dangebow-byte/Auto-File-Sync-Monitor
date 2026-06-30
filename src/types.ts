/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum LogStatus {
  SUCCESS = "success",
  RETRYING = "retrying",
  FAILED = "failed",
  INFO = "info"
}

export enum EventType {
  SYNC_SUCCESS = "Sync Success",
  SYNC_FAIL = "Sync Failure",
  RETRY_ENQUEUE = "Retry Enqueued",
  RETRY_SUCCESS = "Retry Success",
  CONN_LOST = "Connection Lost",
  CONN_RESTORED = "Connection Restored",
  EMAIL_ALERT = "Email Alert Sent",
  EMAIL_FAIL = "Email Alert Failed",
  SYSTEM_AUDIT = "System Audit Event",
  MANUAL_SYNC = "Manual Sync Request"
}

export interface SyncLog {
  id: string;
  agentId: string;
  agentName: string;
  timestamp: string; // ISO String
  eventType: EventType;
  status: LogStatus;
  sourceFile: string;
  destFile: string;
  fileSize: number; // in bytes
  errorMessage?: string;
  retriesAttempted: number;
}

export enum AgentStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  ERROR = "error"
}

export interface SyncAgent {
  id: string;
  name: string;
  ip: string;
  status: AgentStatus;
  lastActive: string;
  totalBytesTransferred: number;
  successCount: number;
  failureCount: number;
  queueCount: number;
  apiKey: string;
}

export enum UserRole {
  ADMIN = "Admin",
  AUDITOR = "Auditor",
  OPERATOR = "Operator"
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  lastLogin: string;
}

export interface NotificationAlert {
  id: string;
  timestamp: string;
  agentId: string;
  severity: "Critical" | "Warning" | "Info";
  triggerEvent: string;
  recipient: string;
  subject: string;
  body: string;
  status: "Sent" | "Failed";
  acknowledged: boolean;
  acknowledgedBy?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  username: string;
  role: UserRole;
  action: string; // e.g., "Downloaded Script", "Viewed Audit Log", "Cleared Log Queue"
  details: string;
  ipAddress: string;
  complianceChecked: boolean; // Indicates checked for PII omission (GDPR/HIPAA compliance check)
}

export interface ComplianceStatus {
  gdprCompliant: boolean;
  hipaaCompliant: boolean;
  dataAtRestEncrypted: boolean;
  dataInTransitEncrypted: boolean;
  auditLoggingEnabled: boolean;
  roleBasedAccessEnabled: boolean;
  noPiiInLogs: boolean;
  lastAuditDate: string;
}
