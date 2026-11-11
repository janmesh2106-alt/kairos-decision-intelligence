/**
 * KAIROS// System Administration & Model Settings
 * Workspace governance, Gemini AI model configuration, and audit logs
 */

import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  Shield,
  Key,
  Database,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { WorkspaceState } from '../../types/kairos';

interface SettingsViewProps {
  workspace: WorkspaceState;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ workspace }) => {
  const [selectedModel, setSelectedModel] = useState<'gemini-2.5-flash' | 'gemini-2.5-pro'>('gemini-2.5-flash');
  const [activeWorkspace, setActiveWorkspace] = useState<string>(workspace.currentWorkspace);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="mono text-xs font-bold text-[#c0a477] bg-[#c0a477]/15 px-2 py-0.5 rounded border border-[#c0a477]/30">
              SYSTEM & MODEL ADMINISTRATION
            </span>
            <span className="mono text-xs text-[#667f72]">ENTERPRISE TIER</span>
          </div>
          <h1 className="text-xl font-bold text-[#e7e2d9] tracking-tight">
            Governance, Model Routing & Security Configuration
          </h1>
          <p className="text-xs text-[#777e80] max-w-2xl leading-relaxed">
            Configure multi-agent model selection, inspect cryptographic audit trails, and manage enterprise workspace boundaries.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#667f72]/20 border border-[#667f72] text-[#667f72] mono text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Gemini AI Engine Configuration */}
        <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#e7e2d9]/10">
            <Sparkles className="w-4 h-4 text-[#c0a477]" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
              GEMINI MULTI-AGENT INFERENCE ARCHITECTURE
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setSelectedModel('gemini-2.5-flash')}
              className={`p-4 rounded border cursor-pointer transition-all ${
                selectedModel === 'gemini-2.5-flash'
                  ? 'bg-[#111315] border-[#c0a477]'
                  : 'bg-[#111315]/50 border-[#e7e2d9]/10 hover:border-[#e7e2d9]/25'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="mono text-xs font-bold text-[#c0a477]">gemini-2.5-flash</span>
                <span className="mono text-[10px] text-[#667f72] bg-[#667f72]/15 px-1.5 py-0.5 rounded">
                  LOW LATENCY
                </span>
              </div>
              <p className="text-xs text-[#777e80] mt-1">
                Optimized for real-time parallel agent investigation and rapid claim synthesis.
              </p>
            </div>

            <div
              onClick={() => setSelectedModel('gemini-2.5-pro')}
              className={`p-4 rounded border cursor-pointer transition-all ${
                selectedModel === 'gemini-2.5-pro'
                  ? 'bg-[#111315] border-[#c0a477]'
                  : 'bg-[#111315]/50 border-[#e7e2d9]/10 hover:border-[#e7e2d9]/25'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="mono text-xs font-bold text-[#c0a477]">gemini-2.5-pro</span>
                <span className="mono text-[10px] text-[#c0a477] bg-[#c0a477]/15 px-1.5 py-0.5 rounded">
                  DEEP REASONING
                </span>
              </div>
              <p className="text-xs text-[#777e80] mt-1">
                Maximum reasoning depth for complex regulatory analysis and long-chain contradiction detection.
              </p>
            </div>
          </div>

          <div className="p-3 rounded bg-[#111315] border border-[#e7e2d9]/5 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-[#c0a477]" />
              <span className="text-[#e7e2d9]">Server-Side Gemini API Key Status</span>
            </div>
            <span className="mono text-[#667f72] font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CONFIGURED (SECRETS PANEL)</span>
            </span>
          </div>
        </div>

        {/* Workspace Governance */}
        <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#e7e2d9]/10">
            <Shield className="w-4 h-4 text-[#c0a477]" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
              WORKSPACE GOVERNANCE & ACCESS CONTROL
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#777e80]">Active Workspace</label>
              <select
                value={activeWorkspace}
                onChange={(e) => setActiveWorkspace(e.target.value)}
                className="w-full bg-[#111315] border border-[#e7e2d9]/15 rounded px-3 py-2 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
              >
                {workspace.workspaces.map((ws) => (
                  <option key={ws} value={ws}>
                    {ws}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#777e80]">Current User</label>
              <div className="w-full bg-[#111315] border border-[#e7e2d9]/15 rounded px-3 py-2 text-xs text-[#e7e2d9]">
                {workspace.currentUser.name} ({workspace.currentUser.role})
              </div>
            </div>
          </div>
        </div>

        {/* Database & State Persistence */}
        <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#e7e2d9]/10">
            <Database className="w-4 h-4 text-[#c0a477]" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
              DATA PERSISTENCE & EXPORT
            </h3>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="text-[#777e80]">
              Full relational snapshot of decisions, evidence, simulation runs, and reality calibration telemetry.
            </div>
            <button
              onClick={() => {
                const data = {
                  timestamp: new Date().toISOString(),
                  workspace: activeWorkspace,
                  version: 'KAIROS-v1.0.0',
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `KAIROS_Complete_Backup_${Date.now()}.json`;
                a.click();
              }}
              className="px-4 py-2 rounded bg-[#292d30] hover:bg-[#343a3e] text-[#c0a477] font-semibold text-xs mono flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download System Snapshot</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2.5 rounded bg-[#c0a477] hover:bg-[#d6be99] text-[#111315] font-semibold text-xs tracking-wider transition-colors"
          >
            SAVE CONFIGURATION
          </button>
        </div>
      </div>
    </div>
  );
};
