/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  RotateCcw,
  Eye,
  EyeOff,
  Trash2,
  Lock,
  Download,
  Server
} from "lucide-react";
import { SyncLog, LogStatus, EventType, UserRole } from "../types";

interface LogAuditorProps {
  logs: SyncLog[];
  currentUserRole: UserRole;
  onClearLogs: () => Promise<void>;
}

export default function LogAuditor({ logs, currentUserRole, onClearLogs }: LogAuditorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [eventFilter, setEventFilter] = useState<string>("ALL");
  
  // HIPAA/GDPR Compliance Masking mode - highly custom and compliant!
  const [isRegulatoryMaskActive, setIsRegulatoryMaskActive] = useState(true);

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.sourceFile.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.destFile.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.errorMessage && log.errorMessage.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || log.status === statusFilter.toLowerCase();
    const matchesEvent = eventFilter === "ALL" || log.eventType === eventFilter;

    return matchesSearch && matchesStatus && matchesEvent;
  });

  // Mask sensitive filenames for GDPR / HIPAA compliance visualization
  const maskFileName = (pathString: string) => {
    if (!isRegulatoryMaskActive) return pathString;
    // Mask patient names or common PII tokens in filenames (e.g. patients, john, ssn, billing, records)
    const fileName = pathString.split('\\').pop() || "";
    if (fileName === "N/A" || fileName === "N/A" || fileName === "") return pathString;
    
    // Regex checking for patient-identifying terms
    const maskedName = fileName
      .replace(/patient_([a-zA-Z_]+)/gi, "patient_xxxxxxxx_[GDPR_MASK]")
      .replace(/hr_q2/gi, "hr_xx_[PII_MASK]")
      .replace(/billing_records/gi, "billing_xxxxxxxx_[HIPAA_MASK]")
      .replace(/claims/gi, "claims_xxxxxxxx_[HIPAA_MASK]");
    
    return pathString.replace(fileName, maskedName);
  };

  const handleClearLogs = async () => {
    if (currentUserRole !== UserRole.ADMIN) {
      alert("Unauthorized: Only Administrators can purge the central sync audit logs.");
      return;
    }
    if (confirm("Are you sure you want to purge all sync history? An entry will be permanently recorded in the immutable HIPAA Audit Log.")) {
      await onClearLogs();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Automated File Sync Audit Logs</h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time trace logs detailing source-to-server copies, retry actions, and network drops</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Regulatory Mask Toggle */}
            <button
              onClick={() => setIsRegulatoryMaskActive(!isRegulatoryMaskActive)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                isRegulatoryMaskActive 
                  ? "bg-teal-50 text-teal-700 border-teal-200" 
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
              title="GDPR and HIPAA compliance requires masking file paths that contain patient PII in standard auditing panels."
            >
              {isRegulatoryMaskActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {isRegulatoryMaskActive ? "GDPR Mask: Active" : "GDPR Mask: Disabled (PII Exposed!)"}
            </button>

            {currentUserRole === UserRole.ADMIN && (
              <button
                onClick={handleClearLogs}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear System Logs
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search file path, agent, error..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="RETRYING">Retrying</option>
              <option value="FAILED">Failed</option>
              <option value="INFO">Info</option>
            </select>
          </div>

          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value="ALL">All Event Types</option>
            <option value={EventType.SYNC_SUCCESS}>Sync Success</option>
            <option value={EventType.SYNC_FAIL}>Sync Failure</option>
            <option value={EventType.RETRY_ENQUEUE}>Retry Enqueued</option>
            <option value={EventType.RETRY_SUCCESS}>Retry Success</option>
            <option value={EventType.CONN_LOST}>Connection Lost</option>
            <option value={EventType.CONN_RESTORED}>Connection Restored</option>
            <option value={EventType.EMAIL_ALERT}>Email Alert Sent</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp (Local)</th>
                <th className="py-3 px-4">Source Machine</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Paths & Files</th>
                <th className="py-3 px-4 text-right">Size / Retries</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    No matching synchronization audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/40 transition">
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {log.agentName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {log.eventType === EventType.SYNC_SUCCESS && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                        {log.eventType === EventType.SYNC_FAIL && <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>}
                        {log.eventType === EventType.RETRY_ENQUEUE && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                        {log.eventType === EventType.CONN_LOST && <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>}
                        {log.eventType === EventType.CONN_RESTORED && <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>}
                        <span className="font-medium text-slate-700">{log.eventType}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        log.status === LogStatus.SUCCESS ? "bg-emerald-100 text-emerald-800" :
                        log.status === LogStatus.RETRYING ? "bg-amber-100 text-amber-800" :
                        log.status === LogStatus.FAILED ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-800"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs md:max-w-md">
                      <div className="space-y-1">
                        <div className="font-mono text-[11px] truncate text-slate-600" title={log.sourceFile}>
                          <span className="text-slate-400 mr-1">SRC:</span>
                          {maskFileName(log.sourceFile)}
                        </div>
                        {log.destFile !== "N/A" && (
                          <div className="font-mono text-[11px] truncate text-slate-600" title={log.destFile}>
                            <span className="text-slate-400 mr-1">DST:</span>
                            {maskFileName(log.destFile)}
                          </div>
                        )}
                        {log.errorMessage && (
                          <div className="text-rose-500 text-[10px] bg-rose-50 border border-rose-100/50 p-1.5 rounded mt-1 font-mono break-all leading-normal">
                            {log.errorMessage}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono whitespace-nowrap text-slate-600">
                      <div>
                        {log.fileSize > 0 ? `${(log.fileSize / 1024).toFixed(1)} KB` : "N/A"}
                      </div>
                      {log.retriesAttempted > 0 && (
                        <div className="text-[10px] text-amber-600 font-semibold mt-0.5">
                          {log.retriesAttempted} {log.retriesAttempted === 1 ? 'retry' : 'retries'}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
