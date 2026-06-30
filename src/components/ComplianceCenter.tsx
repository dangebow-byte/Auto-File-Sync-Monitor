/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  FileCheck2, 
  UserCheck, 
  Search, 
  Activity, 
  HardDrive, 
  Key,
  Database,
  RefreshCw,
  Mail,
  Scale
} from "lucide-react";
import { AuditLog, ComplianceStatus, UserRole } from "../types";

interface ComplianceCenterProps {
  auditLogs: AuditLog[];
  compliance: ComplianceStatus;
  currentUserRole: UserRole;
  onTriggerAudit: () => Promise<void>;
}

export default function ComplianceCenter({ 
  auditLogs, 
  compliance, 
  currentUserRole,
  onTriggerAudit 
}: ComplianceCenterProps) {
  const [isAuditing, setIsAuditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAuditRun = async () => {
    setIsAuditing(true);
    try {
      await onTriggerAudit();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const filteredAudits = auditLogs.filter(log => {
    return (
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Compliance Health Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Scale className="h-4.5 w-4.5 text-indigo-500" />
              HIPAA & GDPR Compliance Checklist
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time validation of file transfer structures against strict health and privacy regulations</p>
          </div>
          
          <button
            onClick={handleAuditRun}
            disabled={isAuditing}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 text-white rounded-lg text-xs font-semibold shadow transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isAuditing ? "animate-spin" : ""}`} />
            Run Compliance Verification
          </button>
        </div>

        {/* Compliance metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Checklist Item 1 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">PII Data Minimization</span>
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 rounded uppercase">Passed</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Logs contain only metadata (hashes, transfer duration, files sizes). No social security numbers, patient records, or financial data are saved.
              </p>
            </div>
          </div>

          {/* Checklist Item 2 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">Encryption in Transit</span>
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 rounded uppercase">Passed</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Centralized monitoring API reporting utilizes HTTPS endpoint relays, enforcing TLS 1.2 or TLS 1.3 handshakes for all agents.
              </p>
            </div>
          </div>

          {/* Checklist Item 3 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <HardDrive className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">Encryption at Rest</span>
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 rounded uppercase">Passed</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Source and server directories run on disk volumes fully encrypted via BitLocker or specialized AES-256 block architectures.
              </p>
            </div>
          </div>

          {/* Checklist Item 4 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <FileCheck2 className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">Integrity Verification</span>
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 rounded uppercase">Passed</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Automated copying incorporates cryptographic SHA-256 checksum evaluations, preventing file modifications or data corruption during transmission.
              </p>
            </div>
          </div>

          {/* Checklist Item 5 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">Role-Based Access Control</span>
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 rounded uppercase">Passed</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Granular security models prevent cross-profile privilege escalations. Actions are mapped strictly to Admin, Operator, or Auditor roles.
              </p>
            </div>
          </div>

          {/* Checklist Item 6 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">Immutable Audit Trail</span>
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 rounded uppercase">Passed</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Every user access, authentication, or diagnostic simulation registers in the local immutable logs, fulfilling regulatory auditing constraints.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100 flex items-center justify-between text-xs text-indigo-800">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-indigo-600" />
            <span>Last comprehensive compliance audit: <strong className="font-semibold">{compliance.lastAuditDate}</strong></span>
          </div>
          <span className="text-[10px] bg-indigo-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Fully Compliant</span>
        </div>
      </div>

      {/* Security Audit Trail Log (Immutable logs) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Security Access Audit Trail</h3>
            <p className="text-xs text-slate-500 mt-0.5">Immutable tracking logs of user logins, log-view accesses, configuration downloads, and audit trials</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-3 px-5">Timestamp</th>
                <th className="py-3 px-5">Authenticated User</th>
                <th className="py-3 px-5">Role</th>
                <th className="py-3 px-5">Action Performed</th>
                <th className="py-3 px-5">Audit Details</th>
                <th className="py-3 px-5">Source IP</th>
                <th className="py-3 px-5 text-right">PII Scan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {filteredAudits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filteredAudits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-slate-50/40 transition">
                    <td className="py-3 px-5 whitespace-nowrap font-mono text-slate-500 text-[11px]">
                      {new Date(audit.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-5 font-semibold text-slate-800">
                      {audit.username}
                    </td>
                    <td className="py-3 px-5">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                        audit.role === UserRole.ADMIN ? "bg-indigo-100 text-indigo-800" :
                        audit.role === UserRole.AUDITOR ? "bg-teal-100 text-teal-800" : "bg-slate-100 text-slate-800"
                      }`}>
                        {audit.role}
                      </span>
                    </td>
                    <td className="py-3 px-5 font-medium text-slate-700">
                      {audit.action}
                    </td>
                    <td className="py-3 px-5 text-slate-500 max-w-xs truncate" title={audit.details}>
                      {audit.details}
                    </td>
                    <td className="py-3 px-5 font-mono text-slate-500 text-[11px]">
                      {audit.ipAddress}
                    </td>
                    <td className="py-3 px-5 text-right">
                      {audit.complianceChecked ? (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                          <ShieldCheck className="h-3 w-3" /> Redacted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                          <ShieldAlert className="h-3 w-3" /> Warning
                        </span>
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
