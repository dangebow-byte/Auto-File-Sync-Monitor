/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Download, 
  Copy, 
  Check, 
  Settings2, 
  Terminal, 
  FileText, 
  HelpCircle, 
  ShieldCheck, 
  Mail,
  RefreshCw
} from "lucide-react";
import { POWERSHELL_SCRIPT, BATCH_LAUNCHER, SCHEDULED_TASK_CMD } from "../scripts-code";
import { UserRole } from "../types";

interface ScriptConfiguratorProps {
  currentUserRole: UserRole;
}

export default function ScriptConfigurator({ currentUserRole }: ScriptConfiguratorProps) {
  const [sourceDir, setSourceDir] = useState("\\\\192.168.3.105\\c\\iodata");
  const [destDir, setDestDir] = useState("\\\\192.168.3.50\\shared");
  const [logFile, setLogFile] = useState("C:\\iodata\\sync_log.txt");
  const [queueFile, setQueueFile] = useState("C:\\iodata\\retry_queue.json");
  const [apiKey, setApiKey] = useState("sync_key_secure_105_7a9");
  const [agentId, setAgentId] = useState("agent-105");

  // Email Config
  const [smtpServer, setSmtpServer] = useState("smtp.office365.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("notifications@enterprise.com");
  const [smtpPass, setSmtpPass] = useState("SecureSmtpPassword123");
  const [recipient, setRecipient] = useState("dangebow@gmail.com");

  // Code state
  const [customPsScript, setCustomPsScript] = useState("");
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Default API endpoint based on window.location
  const [apiUrl, setApiUrl] = useState("http://localhost:3000/api/agents/report");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setApiUrl(`${window.location.origin}/api/agents/report`);
    }
  }, []);

  // Update script dynamically
  useEffect(() => {
    let script = POWERSHELL_SCRIPT;
    // Perform exact replacements of param values
    script = script.replace(
      /\[string\]\$SourceDir = "[^"]*"/,
      `[string]$SourceDir = "${sourceDir.replace(/\\/g, "\\\\")}"`
    );
    script = script.replace(
      /\[string\]\$DestDir = "[^"]*"/,
      `[string]$DestDir = "${destDir.replace(/\\/g, "\\\\")}"`
    );
    script = script.replace(
      /\[string\]\$LogFile = "[^"]*"/,
      `[string]$LogFile = "${logFile.replace(/\\/g, "\\\\")}"`
    );
    script = script.replace(
      /\[string\]\$RetryQueueFile = "[^"]*"/,
      `[string]$RetryQueueFile = "${queueFile.replace(/\\/g, "\\\\")}"`
    );
    script = script.replace(
      /\[string\]\$DashboardUrl = "[^"]*"/,
      `[string]$DashboardUrl = "${apiUrl}"`
    );
    script = script.replace(
      /\[string\]\$ApiKey = "[^"]*"/,
      `[string]$ApiKey = "${apiKey}"`
    );
    script = script.replace(
      /\[string\]\$AgentId = "[^"]*"/,
      `[string]$AgentId = "${agentId}"`
    );
    script = script.replace(
      /\[string\]\$SmtpServer = "[^"]*"/,
      `[string]$SmtpServer = "${smtpServer}"`
    );
    script = script.replace(
      /\[int\]\$SmtpPort = \d+/,
      `[int]$SmtpPort = ${smtpPort}`
    );
    script = script.replace(
      /\[string\]\$SmtpUser = "[^"]*"/,
      `[string]$SmtpUser = "${smtpUser}"`
    );
    script = script.replace(
      /\[string\]\$SmtpPass = "[^"]*"/,
      `[string]$SmtpPass = "${smtpPass}"`
    );
    script = script.replace(
      /\[string\]\$EmailRecipient = "[^"]*"/,
      `[string]$EmailRecipient = "${recipient}"`
    );

    setCustomPsScript(script);
  }, [sourceDir, destDir, logFile, queueFile, apiKey, agentId, apiUrl, smtpServer, smtpPort, smtpUser, smtpPass, recipient]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownload = (content: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Parameters Panel */}
      <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-xs h-fit space-y-5">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Settings2 className="h-4 w-4 text-indigo-500" />
            Parameter Configurator
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Parameters will rebuild scripts in real-time below.</p>
        </div>

        {/* Form fields */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Local Source Directory (UNC)</label>
            <input
              type="text"
              value={sourceDir}
              onChange={(e) => setSourceDir(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Destination Shared Folder (UNC)</label>
            <input
              type="text"
              value={destDir}
              onChange={(e) => setDestDir(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Agent Node ID</label>
              <input
                type="text"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Access Signature Key</label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Local Compliance Log File Path</label>
            <input
              type="text"
              value={logFile}
              onChange={(e) => setLogFile(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Local Retry Queue Path (JSON)</label>
            <input
              type="text"
              value={queueFile}
              onChange={(e) => setQueueFile(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Central Dashboard Reporting URI</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
            />
          </div>

          {/* SMTP configurations */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-indigo-500" />
              Critical SMTP Email Alerts
            </h4>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">SMTP Relay Host</label>
              <input
                type="text"
                value={smtpServer}
                onChange={(e) => setSmtpServer(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">SMTP User / Username</label>
                <input
                  type="text"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Port</label>
                <input
                  type="text"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">SMTP Secure Password</label>
              <input
                type="password"
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Alert Recipient Email</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Script Code Viewer Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* PowerShell Panel */}
        <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-semibold text-slate-200">Robust Sync Script (sync-agent.ps1)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(customPsScript, "ps")}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 rounded text-xs text-slate-300 font-medium transition"
              >
                {copiedType === "ps" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedType === "ps" ? "Copied!" : "Copy Code"}
              </button>
              <button
                onClick={() => handleDownload(customPsScript, "sync-agent.ps1")}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition"
              >
                <Download className="h-3.5 w-3.5" />
                Download .ps1
              </button>
            </div>
          </div>
          <div className="p-4 bg-slate-950/80">
            <pre className="text-[10px] md:text-xs font-mono text-slate-300 overflow-x-auto max-h-72 leading-relaxed">
              {customPsScript}
            </pre>
          </div>
        </div>

        {/* Batch Launcher Panel */}
        <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-semibold text-slate-200">Batch Scheduler Launcher (sync-agent.bat)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(BATCH_LAUNCHER, "bat")}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 font-medium transition"
              >
                {copiedType === "bat" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedType === "bat" ? "Copied!" : "Copy Code"}
              </button>
              <button
                onClick={() => handleDownload(BATCH_LAUNCHER, "sync-agent.bat")}
                className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition"
              >
                <Download className="h-3.5 w-3.5" />
                Download .bat
              </button>
            </div>
          </div>
          <div className="p-4 bg-slate-950/80">
            <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-40 leading-relaxed">
              {BATCH_LAUNCHER}
            </pre>
          </div>
        </div>

        {/* Installation Instruction Panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-3">
            <HelpCircle className="h-4.5 w-4.5 text-indigo-500" />
            Task Scheduler Deployment Guide (HIPAA/GDPR Security Standard)
          </h4>
          <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
            <p>
              To run this script automatically without user intervention, register it in the Windows Task Scheduler under a restricted system account. This complies with security rules by denying unauthorized interactive shell accesses.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-600 bg-slate-50 border border-slate-100 rounded-lg p-4 font-medium">
              <li>Deploy both <code className="font-semibold text-indigo-600">sync-agent.ps1</code> and <code className="font-semibold text-indigo-600">sync-agent.bat</code> into the directory <code className="font-semibold">C:\iodata\</code> on the source machine.</li>
              <li>Open Windows Command Prompt (cmd) as **Administrator**.</li>
              <li>Execute the following command to register the scheduled task to trigger every 15 minutes:</li>
            </ol>
            <div className="bg-slate-900 border border-slate-950 rounded-lg p-3 text-slate-100 flex items-center justify-between font-mono text-xs overflow-x-auto gap-2">
              <span className="truncate">{SCHEDULED_TASK_CMD}</span>
              <button
                onClick={() => handleCopy(SCHEDULED_TASK_CMD, "cmd")}
                className="shrink-0 p-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-950 text-slate-300 rounded transition"
                title="Copy Command"
              >
                {copiedType === "cmd" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-lg text-amber-800 text-xs flex gap-2">
              <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Access Control Audit Constraint:</span> When setting up the task scheduler, verify that the Local System or specific service account has read permissions on <code className="font-semibold">\\192.168.3.105\c\iodata</code> and full write privileges on <code className="font-semibold">\\192.168.3.50\shared</code>. All authentication is sandboxed locally.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
