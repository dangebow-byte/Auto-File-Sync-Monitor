/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Users, 
  Lock, 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  Key, 
  HelpCircle,
  Eye,
  Settings,
  ShieldCheck,
  RefreshCw,
  LogOut,
  UserCheck
} from "lucide-react";
import { AdminUser, UserRole } from "../types";

interface RbacConsoleProps {
  currentUser: AdminUser;
  users: AdminUser[];
  onLogin: (username: string) => Promise<void>;
  onLogout: () => Promise<void>;
}

export default function RbacConsole({ 
  currentUser, 
  users, 
  onLogin, 
  onLogout 
}: RbacConsoleProps) {
  const [selectedUser, setSelectedUser] = useState<string>(currentUser.username);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (username: string) => {
    setLoading(true);
    try {
      await onLogin(username);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case UserRole.AUDITOR:
        return "bg-teal-100 text-teal-800 border-teal-200";
      case UserRole.OPERATOR:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getRolePermissions = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return {
          desc: "Full administrator privileges. Total control over agents, configurations, simulation suites, and logging parameters.",
          permissions: [
            { desc: "Simulate file transfer results and intermittent routing outages", allowed: true },
            { desc: "Rebuild, dynamically configure, and download PowerShell and Batch scripts", allowed: true },
            { desc: "Purge and clear sync trace audit tables", allowed: true },
            { desc: "Inspect and run HIPAA & GDPR compliance checks", allowed: true },
            { desc: "Review and trigger email notifications and alert configurations", allowed: true }
          ]
        };
      case UserRole.OPERATOR:
        return {
          desc: "Restricted system operator. Responsible for managing active alerts and triggering sync sweeps, but blocked from modifying security parameters.",
          permissions: [
            { desc: "Simulate file transfer results and intermittent routing outages", allowed: true },
            { desc: "Rebuild, dynamically configure, and download PowerShell and Batch scripts", allowed: false },
            { desc: "Purge and clear sync trace audit tables", allowed: false },
            { desc: "Inspect and run HIPAA & GDPR compliance checks", allowed: true },
            { desc: "Review and trigger email notifications and alert configurations", allowed: true }
          ]
        };
      case UserRole.AUDITOR:
        return {
          desc: "Read-only compliance auditor. Specialized profile for HIPAA/GDPR validation. No write permissions are permitted under any circumstance.",
          permissions: [
            { desc: "Simulate file transfer results and intermittent routing outages", allowed: false },
            { desc: "Rebuild, dynamically configure, and download PowerShell and Batch scripts", allowed: false },
            { desc: "Purge and clear sync trace audit tables", allowed: false },
            { desc: "Inspect and run HIPAA & GDPR compliance checks", allowed: true },
            { desc: "Review and trigger email notifications and alert configurations", allowed: false }
          ]
        };
    }
  };

  const activePermissions = getRolePermissions(currentUser.role);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Session Management Card */}
      <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 h-fit">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <UserCheck className="h-4.5 w-4.5 text-indigo-500" />
            User Authentication Console
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Switch profiles to audit granular security views and check RBAC enforcements.</p>
        </div>

        {/* Current Active Session */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 blur-xl rounded-full"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Session</span>
          <div>
            <div className="text-sm font-bold text-slate-800">{currentUser.username}</div>
            <div className="text-xs font-mono text-slate-500 mt-0.5">{currentUser.email}</div>
          </div>
          <div className="mt-2">
            <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold border rounded uppercase ${getRoleBadge(currentUser.role)}`}>
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Switch Profile form */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Log In as Simulated User</span>
          <div className="space-y-2">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleRoleChange(user.username)}
                disabled={loading || user.username === currentUser.username}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition ${
                  user.username === currentUser.username
                    ? "bg-indigo-50/40 border-indigo-200/60"
                    : "bg-white hover:bg-slate-50 border-slate-200 cursor-pointer"
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-slate-800">{user.username}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{user.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[9px] font-bold border rounded uppercase ${getRoleBadge(user.role)}`}>
                    {user.role}
                  </span>
                  {user.username === currentUser.username && (
                    <Check className="h-4 w-4 text-indigo-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Permissions matrix column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Permission breakdown panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Key className="h-4.5 w-4.5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800">
              Role Permission Scope for <span className="text-indigo-600">{currentUser.role}</span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-5 leading-normal">
            {activePermissions.desc}
          </p>

          <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 overflow-hidden">
            {activePermissions.permissions.map((p, index) => (
              <div key={index} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/30 transition">
                <span className="text-xs font-medium text-slate-700">{p.desc}</span>
                {p.allowed ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/75 border border-emerald-200 px-2 py-0.5 rounded uppercase">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" /> Allowed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100/75 border border-rose-200 px-2 py-0.5 rounded uppercase">
                    <ShieldAlert className="h-3.5 w-3.5 shrink-0" /> Denied
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Information Callout */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex gap-3.5 items-start">
          <Lock className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-slate-600 space-y-1.5">
            <span className="font-bold text-slate-800">Compliance & HIPAA Regulation Constraint:</span>
            <p>
              Under HIPAA (Health Insurance Portability and Accountability Act) Security § 164.312(a)(1) Access Control, the platform must enforce unique user identification and restrict system triggers to verified personnel.
            </p>
            <p>
              Additionally, GDPR (General Data Protection Regulation) Article 25 requires Data Protection by Design and Default. The central logging server cannot authorize elevated commands (such as purging audit chains) without auditing identity credentials in an immutable logging structure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
