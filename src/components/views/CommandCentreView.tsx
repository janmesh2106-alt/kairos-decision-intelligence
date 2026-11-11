/**
 * KAIROS// Executive Command Centre
 * Central situational awareness dashboard with intelligence indicators and living graph preview
 */

import React from 'react';
import {
  Activity,
  Layers,
  Users,
  Cpu,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Compass,
  Sparkles,
  GitFork,
  ExternalLink,
} from 'lucide-react';
import { Decision, EvidenceItem, ExecutionTask, RealityMetricTracking } from '../../types/kairos';
import { NavViewId } from '../NavigationSidebar';

interface CommandCentreViewProps {
  decisions: Decision[];
  activeDecision: Decision | null;
  evidence: EvidenceItem[];
  tasks: ExecutionTask[];
  realityMetrics: RealityMetricTracking[];
  onSelectDecision: (d: Decision) => void;
  onNavigate: (view: NavViewId) => void;
  onOpenCreateModal: () => void;
}

export const CommandCentreView: React.FC<CommandCentreViewProps> = ({
  decisions,
  activeDecision,
  evidence,
  tasks,
  realityMetrics,
  onSelectDecision,
  onNavigate,
  onOpenCreateModal,
}) => {
  const activeCount = decisions.filter((d) => d.status !== 'archived').length;
  const verifiedEvidenceCount = evidence.filter((e) => e.verificationStatus === 'verified').length;
  const pendingApprovalsCount = decisions.filter((d) => d.status === 'recommended').length;
  const inExecutionTasksCount = tasks.filter((t) => t.stage === 'in_progress').length;
  const realityDeviationsCount = realityMetrics.filter((r) => r.status === 'underperforming').length;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome & Executive Brief */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e7e2d9]/10">
        <div>
          <div className="mono text-xs text-[#c0a477] font-semibold tracking-wider mb-1 flex items-center space-x-2">
            <span>TERMINAL CONTEXT: ENTERPRISE STRATEGIC GOVERNANCE</span>
            <span className="text-[#777e80]">|</span>
            <span className="text-[#667f72]">CALIBRATED REALITY LOOP ACTIVE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#e7e2d9]">Executive Command Centre</h1>
          <p className="text-xs text-[#777e80] mt-1 max-w-2xl leading-relaxed">
            Continuous synthesis connecting Intelligence → Evidence → Multi-Agent Deliberation → Quantitative Simulation → Approved Execution → Reality Calibration.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('simulation_chamber')}
            className="px-3.5 py-2 rounded bg-[#202326] hover:bg-[#292d30] border border-[#e7e2d9]/10 text-xs text-[#e7e2d9] font-medium transition-colors flex items-center space-x-2"
          >
            <Cpu className="w-4 h-4 text-[#c0a477]" />
            <span>Launch Simulation</span>
          </button>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded bg-[#c0a477] hover:bg-[#d6be99] text-[#111315] text-xs font-semibold tracking-wider transition-colors flex items-center space-x-2 shadow-sm"
          >
            <span>NEW STRATEGIC DECISION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Intelligence Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-3.5 rounded bg-[#202326]/80 border border-[#e7e2d9]/10">
          <div className="text-[10px] mono uppercase text-[#777e80]">Active Decisions</div>
          <div className="text-2xl font-bold mono text-[#e7e2d9] mt-1">{activeCount}</div>
          <div className="text-[10px] text-[#c0a477] mt-0.5">3 in deliberation</div>
        </div>

        <div className="p-3.5 rounded bg-[#202326]/80 border border-[#e7e2d9]/10">
          <div className="text-[10px] mono uppercase text-[#777e80]">Evidence Items</div>
          <div className="text-2xl font-bold mono text-[#e7e2d9] mt-1">{evidence.length}</div>
          <div className="text-[10px] text-[#667f72] mt-0.5">{verifiedEvidenceCount} verified facts</div>
        </div>

        <div className="p-3.5 rounded bg-[#202326]/80 border border-[#e7e2d9]/10">
          <div className="text-[10px] mono uppercase text-[#777e80]">Pending Approvals</div>
          <div className="text-2xl font-bold mono text-[#c0a477] mt-1">{pendingApprovalsCount}</div>
          <div className="text-[10px] text-[#777e80] mt-0.5">Awaiting signature</div>
        </div>

        <div className="p-3.5 rounded bg-[#202326]/80 border border-[#e7e2d9]/10">
          <div className="text-[10px] mono uppercase text-[#777e80]">Active Tasks</div>
          <div className="text-2xl font-bold mono text-[#e7e2d9] mt-1">{inExecutionTasksCount}</div>
          <div className="text-[10px] text-[#667f72] mt-0.5">On-schedule execution</div>
        </div>

        <div className="p-3.5 rounded bg-[#202326]/80 border border-[#e7e2d9]/10">
          <div className="text-[10px] mono uppercase text-[#777e80]">Reality Tracking</div>
          <div className="text-2xl font-bold mono text-[#e7e2d9] mt-1">{realityMetrics.length}</div>
          <div className="text-[10px] text-[#777e80] mt-0.5">KPI variance metrics</div>
        </div>

        <div className="p-3.5 rounded bg-[#202326]/80 border border-[#c85a5a]/25 bg-[#c85a5a]/5">
          <div className="text-[10px] mono uppercase text-[#c85a5a] flex items-center space-x-1">
            <ShieldAlert className="w-3 h-3" />
            <span>Deviations</span>
          </div>
          <div className="text-2xl font-bold mono text-[#c85a5a] mt-1">{realityDeviationsCount}</div>
          <div className="text-[10px] text-[#c85a5a]/80 mt-0.5">Calibrating models</div>
        </div>
      </div>

      {/* Main Grid: Living Intelligence Preview & Executive Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Signature Living Intelligence Network Canvas Preview */}
        <div className="lg:col-span-2 rounded bg-[#202326] border border-[#e7e2d9]/10 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d9]/10">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#c0a477] animate-ping" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
                  LIVING INTELLIGENCE NETWORK // TOPOLOGY OVERVIEW
                </h3>
              </div>
              <button
                onClick={() => onNavigate('intelligence_network')}
                className="text-xs text-[#c0a477] hover:underline flex items-center space-x-1"
              >
                <span>Open Full Interactive Graph</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Stylized Node Cluster Visual Preview */}
            <div
              onClick={() => onNavigate('intelligence_network')}
              className="my-4 h-64 rounded bg-[#111315] border border-[#e7e2d9]/5 relative overflow-hidden cursor-pointer group flex items-center justify-center bg-terminal-grid"
            >
              {/* Decorative SVG connection network */}
              <svg className="w-full h-full absolute inset-0 opacity-80" viewBox="0 0 600 240">
                <line x1="120" y1="120" x2="300" y2="70" stroke="#c0a477" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
                <line x1="300" y1="70" x2="480" y2="130" stroke="#667f72" strokeWidth="1.5" strokeOpacity="0.5" />
                <line x1="300" y1="70" x2="280" y2="190" stroke="#777e80" strokeWidth="1" strokeOpacity="0.3" />
                <line x1="120" y1="120" x2="280" y2="190" stroke="#c85a5a" strokeWidth="1.5" strokeOpacity="0.4" />
                <line x1="280" y1="190" x2="480" y2="130" stroke="#c0a477" strokeWidth="1" strokeOpacity="0.3" />

                {/* Nodes */}
                <g className="cursor-pointer">
                  <circle cx="300" cy="70" r="18" fill="#202326" stroke="#c0a477" strokeWidth="2" />
                  <text x="300" y="74" textAnchor="middle" fill="#c0a477" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="600">
                    DEC-084
                  </text>
                  <text x="300" y="100" textAnchor="middle" fill="#e7e2d9" fontSize="11" fontFamily="Inter">
                    APAC Expansion
                  </text>
                </g>

                <g className="cursor-pointer">
                  <circle cx="120" cy="120" r="14" fill="#202326" stroke="#667f72" strokeWidth="1.5" />
                  <text x="120" y="124" textAnchor="middle" fill="#667f72" fontSize="9" fontFamily="IBM Plex Mono">
                    FACT
                  </text>
                  <text x="120" y="148" textAnchor="middle" fill="#777e80" fontSize="10">
                    27.4% CAGR Growth
                  </text>
                </g>

                <g className="cursor-pointer">
                  <circle cx="480" cy="130" r="14" fill="#202326" stroke="#c85a5a" strokeWidth="1.5" />
                  <text x="480" y="134" textAnchor="middle" fill="#c85a5a" fontSize="9" fontFamily="IBM Plex Mono">
                    RISK
                  </text>
                  <text x="480" y="158" textAnchor="middle" fill="#777e80" fontSize="10">
                    CloudNexus -22%
                  </text>
                </g>

                <g className="cursor-pointer">
                  <circle cx="280" cy="190" r="13" fill="#202326" stroke="#c0a477" strokeWidth="1.5" />
                  <text x="280" y="194" textAnchor="middle" fill="#c0a477" fontSize="8" fontFamily="IBM Plex Mono">
                    ALT-B
                  </text>
                  <text x="280" y="218" textAnchor="middle" fill="#e7e2d9" fontSize="10">
                    Phased Singapore Tranche
                  </text>
                </g>
              </svg>

              <div className="absolute bottom-3 right-3 text-[11px] mono text-[#c0a477] bg-[#202326]/90 px-2.5 py-1 rounded border border-[#c0a477]/30 flex items-center space-x-1.5 group-hover:scale-105 transition-transform">
                <span>EXPLORE 14 ENTITY CLUSTERS</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#e7e2d9]/10 text-xs">
            <div>
              <span className="text-[#777e80] block text-[10px] mono uppercase">Active Decision</span>
              <span className="font-semibold text-[#e7e2d9] truncate block">
                {activeDecision?.title || 'None Selected'}
              </span>
            </div>
            <div>
              <span className="text-[#777e80] block text-[10px] mono uppercase">Synthesized Direction</span>
              <span className="text-[#667f72] font-semibold truncate block">Alternative B (Phased Tranche)</span>
            </div>
            <div>
              <span className="text-[#777e80] block text-[10px] mono uppercase">Council Consensus</span>
              <span className="mono text-[#c0a477] font-semibold block">86% Strong Alignment</span>
            </div>
          </div>
        </div>

        {/* Right Col: Executive Attention Panel */}
        <div className="rounded bg-[#202326] border border-[#e7e2d9]/10 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d9]/10">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-[#c0a477]" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
                  EXECUTIVE ATTENTION
                </h3>
              </div>
              <span className="text-[10px] mono text-[#c85a5a] bg-[#c85a5a]/15 px-1.5 py-0.5 rounded">
                CRITICAL MATTERS
              </span>
            </div>

            <div className="mt-3 space-y-3">
              <div className="p-3 rounded bg-[#111315] border-l-2 border-[#c85a5a] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#e7e2d9]">Contradictory Evidence</span>
                  <span className="text-[10px] mono text-[#c85a5a]">HIGH IMPACT</span>
                </div>
                <p className="text-[11px] text-[#777e80] leading-snug">
                  Assumed 7.5-month Tokyo banking sales cycle directly contradicts 14.2-month unpartnered baseline. Partner distribution mandate required.
                </p>
              </div>

              <div className="p-3 rounded bg-[#111315] border-l-2 border-[#c0a477] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#e7e2d9]">Pending Board Authorization</span>
                  <span className="text-[10px] mono text-[#c0a477]">DEC-084</span>
                </div>
                <p className="text-[11px] text-[#777e80] leading-snug">
                  Phase-1 $1.8M Singapore beachhead recommended by Arbiter Ronald Vance with 3 binding covenants.
                </p>
                <button
                  onClick={() => onNavigate('decision_lab')}
                  className="text-[10px] text-[#c0a477] hover:underline flex items-center space-x-1 pt-1 font-semibold"
                >
                  <span>Review Approval Memo</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-3 rounded bg-[#111315] border-l-2 border-[#667f72] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#e7e2d9]">Reality Calibration Active</span>
                  <span className="text-[10px] mono text-[#667f72]">+12.8% REV</span>
                </div>
                <p className="text-[11px] text-[#777e80] leading-snug">
                  Singapore pilot contracts closed 3 weeks ahead of schedule. Feedback loop updated unit economics.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#e7e2d9]/10">
            <button
              onClick={() => onNavigate('dependency_engine')}
              className="w-full py-2 px-3 rounded bg-[#292d30] hover:bg-[#343a3e] text-xs font-medium text-[#c0a477] flex items-center justify-between transition-colors"
            >
              <div className="flex items-center space-x-2">
                <GitFork className="w-3.5 h-3.5" />
                <span>Simulate Variable Sensitivity Chain</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Strategic Decision Portfolio Table */}
      <div className="rounded bg-[#202326] border border-[#e7e2d9]/10 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d9]/10">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
              DECISION PORTFOLIO // ACTIVE ENTERPRISE JURISDICTIONS
            </h3>
            <p className="text-[11px] text-[#777e80]">
              Traceable decisions linked to evidence, multi-agent findings, and execution tracking
            </p>
          </div>
          <button
            onClick={onOpenCreateModal}
            className="text-xs text-[#c0a477] hover:underline flex items-center space-x-1"
          >
            <span>+ Create Decision</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e7e2d9]/10 text-[10px] mono text-[#777e80] uppercase">
                <th className="py-2 px-3">Code / Title</th>
                <th className="py-2 px-3">Industry</th>
                <th className="py-2 px-3">Capital Outlay</th>
                <th className="py-2 px-3">Horizon</th>
                <th className="py-2 px-3">Risk Profile</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7e2d9]/5">
              {decisions.map((dec) => (
                <tr
                  key={dec.id}
                  onClick={() => {
                    onSelectDecision(dec);
                    onNavigate('decision_lab');
                  }}
                  className={`hover:bg-[#292d30] cursor-pointer transition-colors ${
                    activeDecision?.id === dec.id ? 'bg-[#292d30]/60' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#e7e2d9] flex items-center space-x-2">
                      <span className="mono text-[#c0a477] text-[11px]">{dec.code}</span>
                      <span>{dec.title}</span>
                    </div>
                    <div className="text-[11px] text-[#777e80] truncate max-w-[420px]">
                      {dec.problemStatement}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#777e80]">{dec.industry}</td>
                  <td className="py-3 px-3 mono text-[#c0a477]">
                    ${(dec.capitalAllocation / 1000000).toFixed(2)}M
                  </td>
                  <td className="py-3 px-3 mono text-[#777e80]">{dec.timeHorizonMonths} mo</td>
                  <td className="py-3 px-3">
                    <span className="mono text-[10px] px-2 py-0.5 rounded bg-[#111315] uppercase border border-[#e7e2d9]/10 text-[#777e80]">
                      {dec.riskTolerance}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`mono text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
                        dec.status === 'recommended'
                          ? 'bg-[#c0a477]/15 text-[#c0a477] border border-[#c0a477]/30'
                          : dec.status === 'approved'
                          ? 'bg-[#667f72]/15 text-[#667f72] border border-[#667f72]/30'
                          : 'bg-[#292d30] text-[#777e80]'
                      }`}
                    >
                      {dec.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDecision(dec);
                        onNavigate('decision_lab');
                      }}
                      className="px-2.5 py-1 rounded bg-[#111315] hover:bg-[#202326] text-[11px] text-[#c0a477] border border-[#e7e2d9]/10"
                    >
                      Open Lab
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
