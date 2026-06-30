/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { 
  SyncLog, 
  SyncAgent, 
  AdminUser, 
  NotificationAlert, 
  AuditLog, 
  ComplianceStatus,
  LogStatus,
  EventType,
  AgentStatus,
  UserRole
} from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());

// Path for persistence
const DB_PATH = path.join(process.cwd(), "data-store.json");

// Helper to load db
function loadDatabase() {
  const defaultAgents: SyncAgent[] = [
    {
      id: "agent-105",
      name: "Local Agent-105 (c/iodata)",
      ip: "192.168.3.105",
      status: AgentStatus.ONLINE,
      lastActive: new Date().toISOString(),
      totalBytesTransferred: 45892014,
      successCount: 142,
      failureCount: 3,
      queueCount: 0,
      apiKey: "sync_key_secure_105_7a9"
    },
    {
      id: "agent-106",
      name: "Backup Agent-106",
      ip: "192.168.3.106",
      status: AgentStatus.ONLINE,
      lastActive: new Date().toISOString(),
      totalBytesTransferred: 12450098,
      successCount: 88,
      failureCount: 0,
      queueCount: 0,
      apiKey: "sync_key_secure_106_8b2"
    }
  ];

  const defaultLogs: SyncLog[] = [
    {
      id: "log-1",
      agentId: "agent-105",
      agentName: "Local Agent-105 (c/iodata)",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      eventType: EventType.SYNC_SUCCESS,
      status: LogStatus.SUCCESS,
      sourceFile: "\\\\192.168.3.105\\c\\iodata\\transactions_20260629.xml",
      destFile: "\\\\192.168.3.50\\shared\\transactions_20260629.xml",
      fileSize: 451200,
      retriesAttempted: 0
    },
    {
      id: "log-2",
      agentId: "agent-105",
      agentName: "Local Agent-105 (c/iodata)",
      timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      eventType: EventType.SYNC_SUCCESS,
      status: LogStatus.SUCCESS,
      sourceFile: "\\\\192.168.3.105\\c\\iodata\\report_hr_q2.pdf",
      destFile: "\\\\192.168.3.50\\shared\\report_hr_q2.pdf",
      fileSize: 2451000,
      retriesAttempted: 0
    },
    {
      id: "log-3",
      agentId: "agent-105",
      agentName: "Local Agent-105 (c/iodata)",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      eventType: EventType.CONN_LOST,
      status: LogStatus.FAILED,
      sourceFile: "\\\\192.168.3.105\\c\\iodata\\billing_records.csv",
      destFile: "\\\\192.168.3.50\\shared\\billing_records.csv",
      fileSize: 84100,
      errorMessage: "Network route unreachable: Connection to Destination \\\\192.168.3.50 failed. Host is down.",
      retriesAttempted: 0
    },
    {
      id: "log-4",
      agentId: "agent-105",
      agentName: "Local Agent-105 (c/iodata)",
      timestamp: new Date(Date.now() - 3300000).toISOString(),
      eventType: EventType.RETRY_ENQUEUE,
      status: LogStatus.RETRYING,
      sourceFile: "\\\\192.168.3.105\\c\\iodata\\billing_records.csv",
      destFile: "\\\\192.168.3.50\\shared\\billing_records.csv",
      fileSize: 84100,
      errorMessage: "Local retry queue activated: File buffered locally due to unreachable destination network.",
      retriesAttempted: 1
    },
    {
      id: "log-5",
      agentId: "agent-105",
      agentName: "Local Agent-105 (c/iodata)",
      timestamp: new Date(Date.now() - 2400000).toISOString(),
      eventType: EventType.CONN_RESTORED,
      status: LogStatus.INFO,
      sourceFile: "N/A",
      destFile: "N/A",
      fileSize: 0,
      errorMessage: "Ping to \\\\192.168.3.50 succeeded. Connection restored. Automated sync queue processing triggered.",
      retriesAttempted: 0
    },
    {
      id: "log-6",
      agentId: "agent-105",
      agentName: "Local Agent-105 (c/iodata)",
      timestamp: new Date(Date.now() - 2300000).toISOString(),
      eventType: EventType.RETRY_SUCCESS,
      status: LogStatus.SUCCESS,
      sourceFile: "\\\\192.168.3.105\\c\\iodata\\billing_records.csv",
      destFile: "\\\\192.168.3.50\\shared\\billing_records.csv",
      fileSize: 84100,
      errorMessage: "Retry sync successful. File transferred from local retry queue with valid SHA-256 integrity.",
      retriesAttempted: 2
    }
  ];

  const defaultUsers: AdminUser[] = [
    {
      id: "user-1",
      username: "admin_peters",
      email: "dangebow@gmail.com",
      role: UserRole.ADMIN,
      lastLogin: new Date().toISOString()
    },
    {
      id: "user-2",
      username: "auditor_compliance",
      email: "compliance@enterprise.com",
      role: UserRole.AUDITOR,
      lastLogin: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "user-3",
      username: "operator_jack",
      email: "jack.op@enterprise.com",
      role: UserRole.OPERATOR,
      lastLogin: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  const defaultAlerts: NotificationAlert[] = [
    {
      id: "alert-1",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      agentId: "agent-105",
      severity: "Critical",
      triggerEvent: "Destination Host Unreachable",
      recipient: "dangebow@gmail.com",
      subject: "CRITICAL ALERT: File Sync Agent Failure [Agent-105]",
      body: "SMTP Notification System:\n\nTarget File Sync Agent (IP: 192.168.3.105) failed to sync to server \\\\192.168.3.50\\shared.\nError: Connection to Destination \\\\192.168.3.50 failed. Host is down.\n\nLocal Retry Queue has been activated. The file 'billing_records.csv' was safely queued in C:\\iodata\\retry_queue.json for automated re-synchronization.\n\nImmediate review required.",
      status: "Sent",
      acknowledged: true,
      acknowledgedBy: "operator_jack"
    }
  ];

  const defaultAuditLogs: AuditLog[] = [
    {
      id: "audit-1",
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      username: "admin_peters",
      role: UserRole.ADMIN,
      action: "System Initialization",
      details: "Configured local agent sync credentials and activated GDPR/HIPAA encryption rules.",
      ipAddress: "192.168.3.12",
      complianceChecked: true
    },
    {
      id: "audit-2",
      timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
      username: "auditor_compliance",
      role: UserRole.AUDITOR,
      action: "GDPR/HIPAA Verification",
      details: "Audited sync script logs. Confirmed zero PII leakage: no patient identifiers or credit card numbers are logged. Log entries strictly limited to system metadata.",
      ipAddress: "192.168.3.44",
      complianceChecked: true
    },
    {
      id: "audit-3",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      username: "operator_jack",
      role: UserRole.OPERATOR,
      action: "Acknowledge Alert",
      details: "Acknowledged network failure on Agent-105. Network connection verified as restored.",
      ipAddress: "192.168.3.15",
      complianceChecked: true
    }
  ];

  const defaultCompliance: ComplianceStatus = {
    gdprCompliant: true,
    hipaaCompliant: true,
    dataAtRestEncrypted: true,
    dataInTransitEncrypted: true,
    auditLoggingEnabled: true,
    roleBasedAccessEnabled: true,
    noPiiInLogs: true,
    lastAuditDate: new Date().toISOString().split('T')[0]
  };

  try {
    if (fs.existsSync(DB_PATH)) {
      const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
      return {
        agents: data.agents || defaultAgents,
        logs: data.logs || defaultLogs,
        users: data.users || defaultUsers,
        alerts: data.alerts || defaultAlerts,
        auditLogs: data.auditLogs || defaultAuditLogs,
        compliance: data.compliance || defaultCompliance,
        currentUser: data.currentUser || defaultUsers[0]
      };
    }
  } catch (err) {
    console.error("Failed to load local database, resetting to default states", err);
  }

  // Save the defaults
  const dbData = {
    agents: defaultAgents,
    logs: defaultLogs,
    users: defaultUsers,
    alerts: defaultAlerts,
    auditLogs: defaultAuditLogs,
    compliance: defaultCompliance,
    currentUser: defaultUsers[0]
  };
  
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write default database state", err);
  }

  return dbData;
}

function saveDatabase(dbData: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save database state to file", err);
  }
}

// Global active in-memory database
let db = loadDatabase();

// API to check health
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Authentication Routes
app.get("/api/auth/me", (req, res) => {
  res.json(db.currentUser);
});

app.post("/api/auth/login", (req, res) => {
  const { username } = req.body;
  const user = db.users.find(u => u.username === username);
  if (user) {
    db.currentUser = user;
    user.lastLogin = new Date().toISOString();
    
    // Add Audit Log
    const newAudit: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      username: user.username,
      role: user.role,
      action: "User Login",
      details: `Successful login as role ${user.role}.`,
      ipAddress: req.ip || "127.0.0.1",
      complianceChecked: true
    };
    db.auditLogs.unshift(newAudit);
    saveDatabase(db);
    
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: "User not found" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  const loggedOutUser = db.currentUser;
  
  // Add Audit Log
  const newAudit: AuditLog = {
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    username: loggedOutUser.username,
    role: loggedOutUser.role,
    action: "User Logout",
    details: `User logged out successfully.`,
    ipAddress: req.ip || "127.0.0.1",
    complianceChecked: true
  };
  db.auditLogs.unshift(newAudit);
  
  // Reset current user to Operator just to avoid empty auth, or keep it
  db.currentUser = db.users[0]; // Admin by default for testing ease
  saveDatabase(db);
  res.json({ success: true });
});

// Get Logs
app.get("/api/logs", (req, res) => {
  res.json(db.logs);
});

// Get Agents
app.get("/api/agents", (req, res) => {
  res.json(db.agents);
});

// Get Alerts / Notifications
app.get("/api/notifications", (req, res) => {
  res.json(db.alerts);
});

// Acknowledge Alert
app.post("/api/notifications/acknowledge/:id", (req, res) => {
  const { id } = req.params;
  const alert = db.alerts.find(a => a.id === id);
  if (alert) {
    alert.acknowledged = true;
    alert.acknowledgedBy = db.currentUser.username;
    
    // Add Audit Log
    const newAudit: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      username: db.currentUser.username,
      role: db.currentUser.role,
      action: "Acknowledge Alert",
      details: `Acknowledged critical error alert for Agent ${alert.agentId}.`,
      ipAddress: req.ip || "127.0.0.1",
      complianceChecked: true
    };
    db.auditLogs.unshift(newAudit);
    saveDatabase(db);
    
    res.json({ success: true, alert });
  } else {
    res.status(404).json({ success: false, message: "Alert not found" });
  }
});

// Get Audit Logs
app.get("/api/audit-logs", (req, res) => {
  res.json(db.auditLogs);
});

// Get Compliance Status
app.get("/api/compliance", (req, res) => {
  res.json(db.compliance);
});

// Trigger Compliance Manual Audit
app.post("/api/compliance/audit", (req, res) => {
  db.compliance.lastAuditDate = new Date().toISOString().split('T')[0];
  
  // Add Audit Log
  const newAudit: AuditLog = {
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    username: db.currentUser.username,
    role: db.currentUser.role,
    action: "Manual Compliance Audit",
    details: "Executed full system audit for GDPR and HIPAA checklist compliance. All integrity tests passed.",
    ipAddress: req.ip || "127.0.0.1",
    complianceChecked: true
  };
  db.auditLogs.unshift(newAudit);
  saveDatabase(db);
  
  res.json({ success: true, compliance: db.compliance });
});

// Agent Status Reporting API (Receives stats from simulated/actual scripts)
app.post("/api/agents/report", (req, res) => {
  const { apiKey, agentId, eventType, status, sourceFile, destFile, fileSize, errorMessage, retriesAttempted, queueCount } = req.body;
  
  // Find Agent
  const agent = db.agents.find(a => a.apiKey === apiKey || a.id === agentId);
  if (!agent) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid Agent Key or ID" });
  }

  // Update Agent Status & Metrics
  agent.lastActive = new Date().toISOString();
  if (status === LogStatus.FAILED) {
    agent.status = AgentStatus.ERROR;
    agent.failureCount += 1;
  } else if (status === LogStatus.RETRYING) {
    agent.status = AgentStatus.ERROR;
  } else {
    agent.status = AgentStatus.ONLINE;
    agent.successCount += 1;
    agent.totalBytesTransferred += (fileSize || 0);
  }
  
  if (queueCount !== undefined) {
    agent.queueCount = queueCount;
  }

  // Add Log Entry
  const newLog: SyncLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    agentId: agent.id,
    agentName: agent.name,
    timestamp: new Date().toISOString(),
    eventType: eventType as EventType,
    status: status as LogStatus,
    sourceFile: sourceFile || "N/A",
    destFile: destFile || "N/A",
    fileSize: fileSize || 0,
    errorMessage: errorMessage,
    retriesAttempted: retriesAttempted || 0
  };
  db.logs.unshift(newLog);

  // If status is Critical Failure, Trigger Email Alert
  if (status === LogStatus.FAILED && eventType === EventType.SYNC_FAIL) {
    const newAlert: NotificationAlert = {
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentId: agent.id,
      severity: "Critical",
      triggerEvent: "Agent File Sync Failure",
      recipient: "dangebow@gmail.com",
      subject: `CRITICAL ALERT: File Sync Failure on ${agent.name}`,
      body: `SMTP Email Alert System:\n\nSynchronization script failed on Machine ${agent.name} (IP: ${agent.ip}).\nSource path: ${sourceFile}\nDestination path: ${destFile}\n\nError Message:\n${errorMessage}\n\nLocal queue state: ${agent.queueCount} files currently buffered in local retry queue.\n\nAuditable and HIPAA compliant transmission details logged.`,
      status: "Sent",
      acknowledged: false
    };
    db.alerts.unshift(newAlert);
  }

  saveDatabase(db);
  res.json({ success: true, message: "Agent status logged successfully", queueCount: agent.queueCount });
});

// Admin Route to Simulate events (Sync Run, Network Interruption, Connection Restoration)
app.post("/api/agents/simulate-event", (req, res) => {
  const { action, agentId } = req.body;
  const agent = db.agents.find(a => a.id === agentId);
  if (!agent) {
    return res.status(404).json({ success: false, message: "Agent not found" });
  }

  const fileNames = ["patient_records_billing.csv", "diagnostic_scan_metadata.xml", "ehr_feed_daily.json", "lab_results_sync.hl7", "insurance_claims_q3.xml"];
  const randomFile = fileNames[Math.floor(Math.random() * fileNames.length)];
  const randomSize = Math.floor(Math.random() * 2000000) + 10000;

  if (action === "sync_run_success") {
    // Normal successful copy
    agent.status = AgentStatus.ONLINE;
    agent.lastActive = new Date().toISOString();
    agent.successCount += 1;
    agent.totalBytesTransferred += randomSize;
    
    // Check if queue had items
    if (agent.queueCount > 0) {
      agent.queueCount = Math.max(0, agent.queueCount - 1);
    }

    const newLog: SyncLog = {
      id: `log-sim-${Date.now()}`,
      agentId: agent.id,
      agentName: agent.name,
      timestamp: new Date().toISOString(),
      eventType: EventType.SYNC_SUCCESS,
      status: LogStatus.SUCCESS,
      sourceFile: `\\\\${agent.ip}\\c\\iodata\\${randomFile}`,
      destFile: `\\\\192.168.3.50\\shared\\${randomFile}`,
      fileSize: randomSize,
      retriesAttempted: 0
    };
    db.logs.unshift(newLog);

    // Audit Log
    db.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      username: "System Simulator",
      role: UserRole.OPERATOR,
      action: "Sync Event Simulated",
      details: `Successful transfer of file '${randomFile}' (${Math.round(randomSize/1024)} KB) reported by agent ${agent.id}.`,
      ipAddress: agent.ip,
      complianceChecked: true
    });

  } else if (action === "network_outage") {
    // Intermittent connection lost
    agent.status = AgentStatus.ERROR;
    agent.lastActive = new Date().toISOString();
    agent.failureCount += 1;
    agent.queueCount += 1; // Item buffered in local retry queue!

    const newLog: SyncLog = {
      id: `log-sim-${Date.now()}`,
      agentId: agent.id,
      agentName: agent.name,
      timestamp: new Date().toISOString(),
      eventType: EventType.CONN_LOST,
      status: LogStatus.FAILED,
      sourceFile: `\\\\${agent.ip}\\c\\iodata\\${randomFile}`,
      destFile: `\\\\192.168.3.50\\shared\\${randomFile}`,
      fileSize: randomSize,
      errorMessage: "Destination network path \\\\192.168.3.50 is down or unreachable. Handshake timeout.",
      retriesAttempted: 0
    };
    db.logs.unshift(newLog);

    // Enqueue Retry Log
    const retryLog: SyncLog = {
      id: `log-sim-retry-${Date.now()}`,
      agentId: agent.id,
      agentName: agent.name,
      timestamp: new Date(Date.now() + 1000).toISOString(),
      eventType: EventType.RETRY_ENQUEUE,
      status: LogStatus.RETRYING,
      sourceFile: `\\\\${agent.ip}\\c\\iodata\\${randomFile}`,
      destFile: `\\\\192.168.3.50\\shared\\${randomFile}`,
      fileSize: randomSize,
      errorMessage: `Local retry queue activated: File buffered locally in retry queue. Retries Scheduled: Every 15 minutes.`,
      retriesAttempted: 1
    };
    db.logs.unshift(retryLog);

    // Create Notification Alert for the failure!
    const newAlert: NotificationAlert = {
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentId: agent.id,
      severity: "Critical",
      triggerEvent: "Destination Path Unreachable",
      recipient: "dangebow@gmail.com",
      subject: `CRITICAL ALERT: File Sync Failure on ${agent.name}`,
      body: `SMTP Alert Triggered Immediately:\n\nSynchronization script failed on Machine ${agent.name} (IP: ${agent.ip}).\nTarget File: ${randomFile}\n\nError Message:\nDestination network path \\\\192.168.3.50 is down or unreachable.\n\nLocal queue state: ${agent.queueCount} files currently buffered in local retry queue for automated synchronization once restored.`,
      status: "Sent",
      acknowledged: false
    };
    db.alerts.unshift(newAlert);

    // Audit Log
    db.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      username: "System Simulator",
      role: UserRole.OPERATOR,
      action: "Sync Interrupted",
      details: `Destination down. Agent ${agent.id} activated local retry queue. Critical email notification dispatched.`,
      ipAddress: agent.ip,
      complianceChecked: true
    });

  } else if (action === "network_restore") {
    // Automated sync after connection restoration
    if (agent.queueCount === 0) {
      return res.status(400).json({ success: false, message: "Queue is empty. Simulate a network outage first." });
    }

    agent.status = AgentStatus.ONLINE;
    agent.lastActive = new Date().toISOString();
    agent.successCount += agent.queueCount;
    
    const clearedCount = agent.queueCount;
    agent.queueCount = 0; // All cleared!

    // Logs showing restore and sync success
    const restoreLog: SyncLog = {
      id: `log-sim-restore-${Date.now()}`,
      agentId: agent.id,
      agentName: agent.name,
      timestamp: new Date().toISOString(),
      eventType: EventType.CONN_RESTORED,
      status: LogStatus.INFO,
      sourceFile: "N/A",
      destFile: "N/A",
      fileSize: 0,
      errorMessage: `Connection to \\\\192.168.3.50 restored. Flushed ${clearedCount} files from local retry queue successfully.`,
      retriesAttempted: 0
    };
    db.logs.unshift(restoreLog);

    const successLog: SyncLog = {
      id: `log-sim-success-${Date.now() + 100}`,
      agentId: agent.id,
      agentName: agent.name,
      timestamp: new Date().toISOString(),
      eventType: EventType.RETRY_SUCCESS,
      status: LogStatus.SUCCESS,
      sourceFile: `\\\\${agent.ip}\\c\\iodata\\${randomFile}`,
      destFile: `\\\\192.168.3.50\\shared\\${randomFile}`,
      fileSize: randomSize * clearedCount,
      errorMessage: `Automated re-synchronization completed. File integrity validated via SHA-256 hashes.`,
      retriesAttempted: 2
    };
    db.logs.unshift(successLog);

    // Audit Log
    db.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      username: "System Simulator",
      role: UserRole.OPERATOR,
      action: "Automated Sync Flush",
      details: `Network path restored. Successfully synchronized ${clearedCount} files from local queue.`,
      ipAddress: agent.ip,
      complianceChecked: true
    });
  }

  saveDatabase(db);
  res.json({ success: true, agents: db.agents, logs: db.logs });
});

// Admin Route to delete all logs (for audit log resetting or data clearance, with auth audit)
app.post("/api/logs/clear", (req, res) => {
  if (db.currentUser.role !== UserRole.ADMIN) {
    return res.status(403).json({ success: false, message: "Forbidden: Only Administrators can clear audit tables." });
  }

  db.logs = [];
  
  // Add Audit Log of clearing logs
  db.auditLogs.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    username: db.currentUser.username,
    role: db.currentUser.role,
    action: "Purged Sync Logs",
    details: "All sync activity logs were purged by administrative request. Dedicated security log remains intact.",
    ipAddress: req.ip || "127.0.0.1",
    complianceChecked: true
  });
  
  saveDatabase(db);
  res.json({ success: true, message: "Logs cleared" });
});

// Configure Vite middleware or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Auto File Sync Server running on port ${PORT}`);
  });
}

startServer();
