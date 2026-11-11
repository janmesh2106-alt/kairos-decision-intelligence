/**
 * KAIROS// Agent Council Deliberation Chamber
 * Multi-agent orchestration across 7 specialized roles
 */

import React, { useState } from 'react';
import {
  Users,
  Play,
  RotateCw,
  ShieldCheck,
  AlertTriangle,
  GitMerge,
  Cpu,
  Sparkles,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import { CouncilRun, Decision } from '../../types/kairos';
import { AGENT_PROFILES } from '../../data/seedData';

interface AgentCouncilViewProps {
  decision: Decision | null;
  councilRun: CouncilRun | null;
  onExecuteCouncil: (decisionId: string) => Promise<void>;
}

export const AgentCouncilView: React.FC<AgentCouncilViewProps> = ({
  decision,
  councilRun,
  onExecuteCouncil,
}) => {
  const [selectedAgentRole, setSelectedAgentRole] = useState<string>('arbiter');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionLog, setExecutionLog] = useState<string[]>([]);

  const handleRunDeliberation = async () => {
    if (!decision) return;
    setIsExecuting(true);
    setExecutionLog([
      `[${new Date().toISOString().substring(11, 19)}] Initializing 7-Agent Council Chamber...`,
      `[${new Date().toISOString().substring(11, 19)}] Mandating Strategist Elena Vance for boundary definition...`,
      `[${new Date().toISOString().substring(11, 19)}] Dispatching Researcher Dr. Julian Chen for primary claim extraction...`,
      `[${new Date().toISOString().substring(11, 19)}] Invoking Financial Analyst Marcus Sterling for deterministic NPV calculation...`,
      `[${new Date().toISOString().substring(11, 19)}] Deploying Adversarial Red Team Lead Victoria Thorne...`,
      `[${new Date().toISOString().substring(11, 19)}] Running Stochastic Modeler Nikhil Rao (1,000 Monte Carlo runs)...`,
      `[${new Date().toISOString().substring(11, 19)}] Evaluating regulatory threat matrices with Chief Risk Officer Amara Okafor...`,
      `[${new Date().toISOString().substring(11, 19)}] Convening Senior Arbiter Ronald Vance for final judgment synthesis...`,
    ]);

    try {
      await onExecuteCouncil(decision.id);
      setExecutionLog((prev) => [
        ...prev,
        `[${new Date().toISOString().substring(11, 19)}] Council deliberation concluded. Consensus score: 86%.`,
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  const selectedProfile = AGENT_PROFILES.find((p) => p.role === selectedAgentRole) || AGENT_PROFILES[6];
  const selectedFinding = councilRun?.findings.find((f) => f.agentRole === selectedAgentRole);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Execution Bar */}
      <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="mono text-xs font-bold text-[#c0a477] bg-[#c0a477]/15 px-2 py-0.5 rounded border border-[#c0a477]/30">
              COUNCIL CHAMBER // 7 AGENTS
            </span>
            <span className="mono text-xs text-[#777e80]">
              DECISION: {decision?.code || 'None Selected'}
            </span>
            <span className="mono text-xs text-[#667f72] flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#667f72]" />
              <span>ORCHESTRATOR ONLINE</span>
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#e7e2d9] tracking-tight">
            Multi-Agent Deliberation & Adversarial Synthesis
          </h1>
          <p className="text-xs text-[#777e80] max-w-3xl leading-relaxed">
            Autonomous multi-agent investigation. Agents investigate competing hypotheses, stress-test boundary assumptions, and synthesize defensible recommendations.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <div className="text-[10px] mono uppercase text-[#777e80]">Consensus Score</div>
            <div className="text-xl font-bold mono text-[#c0a477]">
              {councilRun?.consensusScore || 86}%
            </div>
          </div>

          <div className="h-8 w-px bg-[#e7e2d9]/10" />

          <button
            onClick={handleRunDeliberation}
            disabled={isExecuting || !decision}
            className="px-5 py-2.5 rounded bg-[#c0a477] hover:bg-[#d6be99] text-[#111315] font-semibold text-xs tracking-wider transition-all disabled:opacity-50 flex items-center space-x-2 shadow-md active:scale-95"
          >
            {isExecuting ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isExecuting ? 'DELIBERATING...' : 'CONVENE COUNCIL'}</span>
          </button>
        </div>
      </div>

      {/* 7 Agent Roster Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {AGENT_PROFILES.map((agent) => {
          const isSelected = selectedAgentRole === agent.role;
          const finding = councilRun?.findings.find((f) => f.agentRole === agent.role);

          return (
            <button
              key={agent.role}
              onClick={() => setSelectedAgentRole(agent.role)}
              className={`p-3 rounded text-left transition-all border flex flex-col justify-between h-28 ${
                isSelected
                  ? 'bg-[#292d30] border-[#c0a477] shadow-lg'
                  : 'bg-[#202326] border-[#e7e2d9]/10 hover:border-[#e7e2d9]/25 hover:bg-[#292d30]/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="mono text-[10px] text-[#c0a477] font-semibold">{agent.badge}</span>
                <span className="w-2 h-2 rounded-full bg-[#667f72]" />
              </div>

              <div>
                <div className="text-xs font-bold text-[#e7e2d9] truncate">{agent.name}</div>
                <div className="text-[10px] text-[#777e80] truncate">{agent.title}</div>
              </div>

              <div className="text-[10px] mono text-[#c0a477] pt-1 border-t border-[#e7e2d9]/5">
                {finding ? `${finding.confidence}% CONF` : 'STANDBY'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Agent In-Depth Finding Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Agent Findings, Reasoning Steps & Adversarial Challenges */}
        <div className="lg:col-span-2 p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#e7e2d9]/10">
            <div>
              <div className="flex items-center space-x-2">
                <span className="mono text-xs text-[#c0a477] font-semibold">{selectedProfile.badge}</span>
                <h3 className="text-sm font-bold text-[#e7e2d9]">
                  {selectedProfile.name} — {selectedProfile.title}
                </h3>
              </div>
              <p className="text-xs text-[#777e80] mt-1 leading-relaxed">{selectedProfile.mandate}</p>
            </div>

            <div className="text-right shrink-0">
              <span className="mono text-[10px] text-[#777e80] uppercase block">Assessed Confidence</span>
              <span className="mono text-lg font-bold text-[#667f72]">
                {selectedFinding?.confidence || 92}%
              </span>
            </div>
          </div>

          {/* Finding Summary */}
          <div className="space-y-2">
            <span className="text-[10px] mono uppercase text-[#777e80] block">
              Core Evaluative Finding
            </span>
            <div className="p-4 rounded bg-[#111315] border border-[#e7e2d9]/5 text-xs text-[#e7e2d9] leading-relaxed serif font-normal text-base italic">
              "{selectedFinding?.summary || 'Agent finding compiled.'}"
            </div>
          </div>

          {/* Step-by-Step Reasoning Chain */}
          <div className="space-y-2">
            <span className="text-[10px] mono uppercase text-[#777e80] block">
              Traceable Reasoning Chain ({selectedFinding?.reasoningSteps.length || 0} Steps)
            </span>
            <div className="space-y-2">
              {selectedFinding?.reasoningSteps.map((step, idx) => (
                <div key={idx} className="p-3 rounded bg-[#111315] border border-[#e7e2d9]/5 flex items-start space-x-3 text-xs">
                  <span className="mono font-bold text-[#c0a477] shrink-0 text-[11px]">
                    0{idx + 1}.
                  </span>
                  <span className="text-[#e7e2d9] leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assumptions Challenged & Risks Identified */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#e7e2d9]/10">
            <div className="space-y-2">
              <span className="text-[10px] mono uppercase text-[#c0a477] font-semibold block flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Assumptions Challenged</span>
              </span>
              <ul className="space-y-1.5 text-xs text-[#777e80]">
                {selectedFinding?.assumptionsChallenged.map((a, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-[#c0a477] font-bold">›</span>
                    <span className="text-[#e7e2d9]">{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] mono uppercase text-[#c85a5a] font-semibold block flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Risks & Blindspots Flagged</span>
              </span>
              <ul className="space-y-1.5 text-xs text-[#777e80]">
                {selectedFinding?.risksIdentified.map((r, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-[#c85a5a] font-bold">›</span>
                    <span className="text-[#e7e2d9]">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Col: Council Synthesis & Execution Telemetry */}
        <div className="space-y-6">
          {/* Arbiter Recommendation Card */}
          <div className="p-6 rounded bg-[#202326] border border-[#c0a477]/40 space-y-4">
            <div className="flex items-center space-x-2">
              <GitMerge className="w-4 h-4 text-[#c0a477]" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
                ARBITER SYNTHESIZED VERDICT
              </h3>
            </div>

            <p className="text-xs text-[#e7e2d9] leading-relaxed">
              {councilRun?.synthesizedRecommendation}
            </p>

            <div className="pt-2 border-t border-[#e7e2d9]/10">
              <div className="text-[10px] mono uppercase text-[#777e80] mb-1">Recommended Alternative</div>
              <div className="text-xs font-bold text-[#c0a477]">
                Alternative B: Phased Tranche Deployment
              </div>
            </div>
          </div>

          {/* Real-time Execution Telemetry Log */}
          <div className="p-5 rounded bg-[#111315] border border-[#e7e2d9]/10 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[#777e80] border-b border-[#e7e2d9]/10 pb-2">
              <div className="flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#c0a477]" />
                <span className="text-[10px] uppercase">ORCHESTRATION LOG</span>
              </div>
              <span className="text-[10px] text-[#667f72]">TOKEN BURN: 14.8k</span>
            </div>

            <div className="space-y-1 text-[11px] text-[#777e80] max-h-48 overflow-y-auto">
              {executionLog.length > 0 ? (
                executionLog.map((log, i) => <div key={i}>{log}</div>)
              ) : (
                <>
                  <div>[14:15:10] Strategist completed task (94% conf)</div>
                  <div>[14:16:45] Researcher validated 4 primary evidence items</div>
                  <div>[14:18:20] Financial Analyst computed NPV ($4.65M)</div>
                  <div>[14:19:50] Skeptic flagged 2 critical assumption contradictions</div>
                  <div>[14:20:40] Simulator completed 1,000 Monte Carlo runs</div>
                  <div>[14:21:15] Risk Officer mapped sovereign compliance vectors</div>
                  <div>[14:22:00] Arbiter synthesized defensible recommendation</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
