/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  FileText, 
  Mail, 
  Network, 
  Database, 
  ArrowRightLeft, 
  Wifi, 
  WifiOff, 
  Server,
  Terminal,
  Clock
} from "lucide-react";
import { SyncAgent, SyncLog, LogStatus, AgentStatus, UserRole } from "../types";
import { motion } from "motion/react";

interface DashboardOverviewProps {
  agents: SyncAgent[];
  logs: SyncLog[];
  currentUserRole: UserRole;
  onSimulateEvent: (action: string, agentId: string) => Promise<void>;
}

export default function DashboardOverview({ 
  agents, 
  logs, 
  currentUserRole,
  onSimulateEvent 
}: DashboardOverviewProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>("agent-105");
  const [isSimulating, setIsSimulating] = useState<string | null>(null);

  const activeAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  // Calculations
  const totalFilesSynced = logs.filter(l => l.status === LogStatus.SUCCESS).length;
  const activeAlerts = logs.filter(l => l.eventType === "Connection Lost" || l.status === LogStatus.FAILED).length;
  const totalBytes = agents.reduce((sum, a) => sum + a.totalBytesTransferred, 0);
  const totalQueueSize = agents.reduce((sum, a) => sum + a.queueCount, 0);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSimulate = async (action: string) => {
    if (currentUserRole === UserRole.AUDITOR) {
      alert("Permission Denied: Auditors have read-only permissions and cannot trigger simulation events.");
      return;
    }
    setIsSimulating(action);
    try {
      await onSimulateEvent(action, selectedAgentId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Playground Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h2 className="text-lg font-semibold tracking-tight">Enterprise Agent Simulation Playground</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select an agent and trigger sync conditions to test local queuing, email alerting, and network restoration behaviors in real-time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Target Agent:</span>
            <select 
              value={selectedAgentId} 
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.ip})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Interactive Pipeline Architecture Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center bg-slate-950/70 rounded-xl p-6 border border-slate-800/80 mb-6">
          {/* Node 1: Local Agent */}
          <div className="flex flex-col items-center text-center p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-full mb-3">
              <Terminal className="h-6 w-6" />
            </div>
            <div className="text-sm font-medium">{activeAgent.name}</div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">Source IP: {activeAgent.ip}</div>
            <div className="mt-3 flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded font-semibold">
                UNC: \\\\{activeAgent.ip}\\c\\iodata
              </span>
            </div>
            {activeAgent.queueCount > 0 && (
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mt-3 px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 rounded text-amber-400 text-xs font-semibold flex items-center gap-1"
              >
                <Database className="h-3 w-3" />
                {activeAgent.queueCount} Files Buffered Offline
              </motion.div>
            )}
          </div>

          {/* Connection Channel */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-xs font-mono mb-2 flex items-center gap-1">
              <ArrowRightLeft className="h-3 w-3 text-slate-400" />
              <span>INTERMITTENT NETWORK</span>
            </div>
            
            <div className="w-full flex items-center justify-center px-4 relative">
              <div className="w-full h-1 bg-slate-800 rounded"></div>
              {/* Animated particle flow */}
              {activeAgent.status === AgentStatus.ONLINE ? (
                <motion.div 
                  animate={{ x: [-80, 80] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute w-3 h-3 bg-emerald-400 rounded-full blur-xs"
                />
              ) : activeAgent.queueCount > 0 ? (
                <div className="absolute flex items-center gap-1 px-2 py-0.5 bg-rose-500/15 border border-rose-500/30 rounded text-rose-400 text-[10px] font-bold">
                  <WifiOff className="h-3 w-3" />
                  Route Severed
                </div>
              ) : (
                <div className="absolute w-3 h-3 bg-slate-600 rounded-full" />
              )}
            </div>
            
            <div className="text-center mt-3 text-xs">
              {activeAgent.status === AgentStatus.ONLINE ? (
                <span className="text-emerald-400 flex items-center gap-1 justify-center">
                  <Wifi className="h-3 w-3" /> VPN Tunnel Active (TLS 1.3)
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1 justify-center">
                  <WifiOff className="h-3 w-3" /> Connection Timeout
                </span>
              )}
            </div>
          </div>

          {/* Node 2: Server Shared Directory */}
          <div className="flex flex-col items-center text-center p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full mb-3">
              <Server className="h-6 w-6" />
            </div>
            <div className="text-sm font-medium">Server Shared Node</div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">Dest IP: 192.168.3.50</div>
            <div className="mt-3 flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded font-semibold">
                UNC: \\\\192.168.3.50\\shared
              </span>
            </div>
            <div className="mt-3 text-xs text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span>GDPR / HIPAA Encrypted Directory</span>
            </div>
          </div>
        </div>

        {/* Control Actions buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleSimulate("sync_run_success")}
            disabled={isSimulating !== null || currentUserRole === UserRole.AUDITOR}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-slate-800 text-white font-medium text-sm px-4 py-3 rounded-lg shadow transition flex items-center justify-center gap-2 border border-emerald-500/20"
          >
            {isSimulating === "sync_run_success" ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Run Scheduled Copy (Success)
          </button>
          
          <button
            onClick={() => handleSimulate("network_outage")}
            disabled={isSimulating !== null || currentUserRole === UserRole.AUDITOR}
            className="flex-1 bg-rose-950/45 hover:bg-rose-950/70 text-rose-300 border border-rose-800/60 active:bg-rose-900 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium text-sm px-4 py-3 rounded-lg shadow transition flex items-center justify-center gap-2"
          >
            {isSimulating === "network_outage" ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            )}
            Simulate Route Timeout (Trigger local queue)
          </button>
          
          <button
            onClick={() => handleSimulate("network_restore")}
            disabled={isSimulating !== null || activeAgent.queueCount === 0 || currentUserRole === UserRole.AUDITOR}
            className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900/40 disabled:border-slate-800/40 disabled:text-slate-600 text-slate-200 border border-slate-700 font-medium text-sm px-4 py-3 rounded-lg shadow transition flex items-center justify-center gap-2"
          >
            {isSimulating === "network_restore" ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Simulate Connection Restore (Flush Queue)
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Synchronized Sweep Count</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-2">{totalFilesSynced} Sweeps</h3>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-3 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
              100%
            </span>
            <span>integrity hashing verification</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Local Buffer Queue Size</p>
              <h3 className="text-2xl font-bold mt-2 text-slate-800">
                {totalQueueSize} {totalQueueSize === 1 ? 'file' : 'files'}
              </h3>
            </div>
            <div className={`p-2.5 rounded-lg ${totalQueueSize > 0 ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
              <Database className="h-5 w-5" />
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-3">
            {totalQueueSize > 0 ? (
              <span className="text-amber-600 font-semibold">Offline queue active.</span>
            ) : (
              <span>All files securely server-reconciled.</span>
            )}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Volume Transferred</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-2">{formatBytes(totalBytes)}</h3>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-3">
            <span>Aggregated across active transfer agents.</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Monitoring Alerts</p>
              <h3 className="text-2xl font-bold mt-2 text-slate-800">
                {activeAlerts > 0 ? `${activeAlerts} Alerts` : "0 Alerts"}
              </h3>
            </div>
            <div className={`p-2.5 rounded-lg ${activeAlerts > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
              <Mail className="h-5 w-5" />
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-3">
            <span>Connected directly to SMTP trigger relays.</span>
          </div>
        </div>
      </div>

      {/* Agents Network Nodes Grid */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Local Machines (Sync Nodes)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Monitoring agents actively polling directories and copying to 192.168.3.50</p>
          </div>
          <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 font-semibold rounded">
            {agents.length} nodes registered
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {agents.map((agent) => (
            <div key={agent.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
              <div className="flex items-start gap-3">
                <div className={`mt-1 p-2 rounded-lg ${
                  agent.status === AgentStatus.ONLINE ? 'bg-emerald-50 text-emerald-600' : 
                  agent.status === AgentStatus.ERROR ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'
                }`}>
                  <Terminal className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{agent.name}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                      agent.status === AgentStatus.ONLINE ? 'bg-emerald-100 text-emerald-800' : 
                      agent.status === AgentStatus.ERROR ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    <span>IP Address: {agent.ip}</span>
                    <span>•</span>
                    <span>Last Synced Event: {new Date(agent.lastActive).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              {/* Stats column */}
              <div className="flex items-center gap-6 justify-between md:justify-end text-right">
                <div className="text-center sm:text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sync Sweeps</div>
                  <div className="text-sm font-semibold text-slate-700 mt-0.5">
                    <span className="text-emerald-600">{agent.successCount} OK</span>
                    {agent.failureCount > 0 && <span className="text-rose-500 ml-2">{agent.failureCount} Fail</span>}
                  </div>
                </div>
                
                <div className="text-center sm:text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Queue State</div>
                  <div className={`text-sm font-semibold mt-0.5 ${agent.queueCount > 0 ? "text-amber-600" : "text-slate-500"}`}>
                    {agent.queueCount > 0 ? `${agent.queueCount} Buffered` : "Empty"}
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Signature</div>
                  <div className="text-xs font-mono text-slate-400 mt-1 bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5">
                    {agent.apiKey.slice(0, 8)}...
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
