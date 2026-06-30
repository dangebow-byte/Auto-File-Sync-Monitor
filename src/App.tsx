/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  FileText, 
  ShieldCheck, 
  Download, 
  Users, 
  Lock, 
  Settings2, 
  Mail, 
  Server,
  Terminal,
  Clock,
  LogOut,
  AlertCircle,
  Bell,
  Scale
} from "lucide-react";

import { 
  SyncAgent, 
  SyncLog, 
  AdminUser, 
  NotificationAlert, 
  AuditLog, 
  ComplianceStatus, 
  UserRole,
  LogStatus
} from "./types";

import DashboardOverview from "./components/DashboardOverview";
import LogAuditor from "./components/LogAuditor";
import ScriptConfigurator from "./components/ScriptConfigurator";
import ComplianceCenter from "./components/ComplianceCenter";
import RbacConsole from "./components/RbacConsole";

export default function App() {
  const [activeTab, setActiveTab] = useState<"overview" | "logs" | "script" | "compliance" | "rbac">("overview");
  
  // State
  const [agents, setAgents] = useState<SyncAgent[]>([]);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [alerts, setAlerts] = useState<NotificationAlert[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [compliance, setCompliance] = useState<ComplianceStatus | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Poll for updates
  const fetchState = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const [agentsRes, logsRes, alertsRes, auditRes, compRes, userRes] = await Promise.all([
        fetch("/api/agents"),
        fetch("/api/logs"),
        fetch("/api/notifications"),
        fetch("/api/audit-logs"),
        fetch("/api/compliance"),
        fetch("/api/auth/me")
      ]);

      const [agentsData, logsData, alertsData, auditData, compData, userData] = await Promise.all([
        agentsRes.json(),
        logsRes.json(),
        alertsRes.json(),
        auditRes.json(),
        compRes.json(),
        userRes.json()
      ]);

      setAgents(agentsData);
      setLogs(logsData);
      setAlerts(alertsData);
      setAuditLogs(auditData);
      setCompliance(compData);
      setCurrentUser(userData);

      // Extract unique simulated users for RBAC Console
      // We can mock this simply or query from a mock user pool
      setUsers([
        { id: "user-1", username: "admin_peters", email: "dangebow@gmail.com", role: UserRole.ADMIN, lastLogin: "" },
        { id: "user-2", username: "auditor_compliance", email: "compliance@enterprise.com", role: UserRole.AUDITOR, lastLogin: "" },
        { id: "user-3", username: "operator_jack", email: "jack.op@enterprise.com", role: UserRole.OPERATOR, lastLogin: "" }
      ]);

    } catch (err) {
      console.error("Failed to fetch dashboard states", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchState(true);
    // Poll every 3 seconds for active simulation logs updates
    const interval = setInterval(() => {
      fetchState(false);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Actions
  const handleSimulateEvent = async (action: string, agentId: string) => {
    try {
      const response = await fetch("/api/agents/simulate-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, agentId })
      });
      if (response.ok) {
        await fetchState();
      } else {
        const errData = await response.json();
        alert(`Simulation Failed: ${errData.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearLogs = async () => {
    try {
      const response = await fetch("/api/logs/clear", { method: "POST" });
      if (response.ok) {
        await fetchState();
      } else {
        const errData = await response.json();
        alert(`Failed: ${errData.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/notifications/acknowledge/${alertId}`, { method: "POST" });
      if (response.ok) {
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (username: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
      });
      if (response.ok) {
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerAudit = async () => {
    try {
      const response = await fetch("/api/compliance/audit", { method: "POST" });
      if (response.ok) {
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-600">Loading enterprise sync monitor...</span>
        </div>
      </div>
    );
  }

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* Premium Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-lg shadow-sm">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">Auto File Sync Monitor</h1>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Active Security State
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Enterprise Transfer & Audit Dashboard</p>
            </div>
          </div>

          {/* Active User Information & Quick controls */}
          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800">{currentUser.username}</span>
                <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">{currentUser.role} Control</span>
              </div>
            )}
            
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            
            {/* Realtime Audit State check */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 font-mono">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              <span>UTC [REDACTED_AUDIT_STAMP]</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Active Alert Notification Banners */}
        {unacknowledgedAlerts.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-lg shrink-0 mt-0.5">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  Critical Error Event Detected
                  <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.5 rounded">SMTP Relay Triggered</span>
                </h4>
                <p className="text-xs text-rose-700 mt-1">
                  Active failure registered: {unacknowledgedAlerts[0].subject}. Local retry buffer is holding file synchronization queues securely.
                </p>
              </div>
            </div>
            
            <button
              onClick={() => handleAcknowledgeAlert(unacknowledgedAlerts[0].id)}
              disabled={currentUser?.role === UserRole.AUDITOR}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition shrink-0"
            >
              Acknowledge Alert
            </button>
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
              activeTab === "overview" 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            Agent Overview & Simulator
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
              activeTab === "logs" 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            Trace logs & Audits
          </button>
          <button
            onClick={() => setActiveTab("script")}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
              activeTab === "script" 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            Script Configurator & Download
          </button>
          <button
            onClick={() => setActiveTab("compliance")}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
              activeTab === "compliance" 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            GDPR / HIPAA Compliance Checklist
          </button>
          <button
            onClick={() => setActiveTab("rbac")}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
              activeTab === "rbac" 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            RBAC Profile logins
          </button>
        </div>

        {/* Tab Viewport */}
        <div className="min-h-128 transition-all duration-300">
          {activeTab === "overview" && currentUser && (
            <DashboardOverview 
              agents={agents} 
              logs={logs} 
              currentUserRole={currentUser.role}
              onSimulateEvent={handleSimulateEvent}
            />
          )}

          {activeTab === "logs" && currentUser && (
            <LogAuditor 
              logs={logs} 
              currentUserRole={currentUser.role}
              onClearLogs={handleClearLogs}
            />
          )}

          {activeTab === "script" && currentUser && (
            <ScriptConfigurator 
              currentUserRole={currentUser.role}
            />
          )}

          {activeTab === "compliance" && compliance && currentUser && (
            <ComplianceCenter 
              auditLogs={auditLogs} 
              compliance={compliance}
              currentUserRole={currentUser.role}
              onTriggerAudit={handleTriggerAudit}
            />
          )}

          {activeTab === "rbac" && currentUser && (
            <RbacConsole 
              currentUser={currentUser} 
              users={users} 
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Scale className="h-4 w-4 text-slate-400" />
            <span>GDPR Articles 25 & 32 & HIPAA Security Framework Compliant System</span>
          </div>
          <div>
            <span>© 2026 Enterprise Automated Data Transfer. Built for High-Integrity Local Copying.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
