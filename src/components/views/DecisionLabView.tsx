/**
 * KAIROS// Decision Lab Workspace
 * 17-section comprehensive strategic decision environment
 */

import React, { useState } from 'react';
import {
  Layers,
  ShieldAlert,
  Users,
  Cpu,
  CheckCircle2,
  GitPullRequest,
  CheckSquare,
  Compass,
  FileText,
  AlertTriangle,
  History,
  Share2,
  DollarSign,
  Plus,
  ArrowRight,
  Stamp,
  Download,
} from 'lucide-react';
import {
  ApprovalRecord,
  CouncilRun,
  Decision,
  EvidenceItem,
  ExecutionTask,
  RealityMetricTracking,
} from '../../types/kairos';
import { NavViewId } from '../NavigationSidebar';

interface DecisionLabViewProps {
  decision: Decision | null;
  councilRun: CouncilRun | null;
  evidence: EvidenceItem[];
  tasks: ExecutionTask[];
  realityMetrics: RealityMetricTracking[];
  onUpdateDecision: (id: string, updates: Partial<Decision>) => Promise<void>;
  onSubmitApproval: (payload: {
    decisionId: string;
    approverName: string;
    approverTitle: string;
    conditionsImposed: string[];
    executiveMemo: string;
  }) => Promise<void>;
  onNavigate: (view: NavViewId) => void;
  onOpenCreateModal: () => void;
}

export const DecisionLabView: React.FC<DecisionLabViewProps> = ({
  decision,
  councilRun,
  evidence,
  tasks,
  realityMetrics,
  onUpdateDecision,
  onSubmitApproval,
  onNavigate,
  onOpenCreateModal,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'evidence'
    | 'agents'
    | 'simulations'
    | 'recommendations'
    | 'approvals'
    | 'execution'
    | 'reality'
    | 'audit'
  >('overview');

  const [approverName, setApproverName] = useState<string>('Marcus Vance');
  const [approverTitle, setApproverTitle] = useState<string>('Chief Executive Officer & Board Chair');
  const [approvalConditions, setApprovalConditions] = useState<string>(
    '1. Enforce $1.8M Phase-1 capital ceiling strictly.\n2. Milestone review at $1.2M Singapore ARR prior to Tokyo incorporation tranche.\n3. Quarterly reality monitor variance review with Senior Arbiter.'
  );
  const [approvalMemo, setApprovalMemo] = useState<string>(
    'The Board of Directors hereby grants conditional executive authorization for Alternative B. Downside sovereign risks are quarantined through milestone-gated deployment.'
  );
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [showApprovalSuccess, setShowApprovalSuccess] = useState<boolean>(false);

  if (!decision) {
    return (
      <div className="p-12 text-center max-w-xl mx-auto space-y-4">
        <Layers className="w-12 h-12 text-[#c0a477] mx-auto opacity-70" />
        <h2 className="text-lg font-semibold text-[#e7e2d9]">No Strategic Decision Selected</h2>
        <p className="text-xs text-[#777e80]">
          Select an active strategic decision from the portfolio or initialize a new decision architecture.
        </p>
        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2 rounded bg-[#c0a477] text-[#111315] font-semibold text-xs tracking-wider"
        >
          CREATE NEW DECISION
        </button>
      </div>
    );
  }

  const handleApprovalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApproving(true);
    try {
      const conditionsList = approvalConditions
        .split('\n')
        .map((s) => s.replace(/^\d+\.\s*/, '').trim())
        .filter(Boolean);

      await onSubmitApproval({
        decisionId: decision.id,
        approverName,
        approverTitle,
        conditionsImposed: conditionsList,
        executiveMemo: approvalMemo,
      });

      setShowApprovalSuccess(true);
      setTimeout(() => setShowApprovalSuccess(false), 4000);
    } finally {
      setIsApproving(false);
    }
  };

  const tabs = [
    { id: 'overview', label: '1. Overview & Objectives', icon: FileText },
    { id: 'evidence', label: `2. Evidence & Claims (${evidence.length})`, icon: ShieldAlert },
    { id: 'agents', label: '3. Agent Council Findings', icon: Users },
    { id: 'simulations', label: '4. Quantitative Simulations', icon: Cpu },
    { id: 'recommendations', label: '5. Synthesized Recommendation', icon: GitPullRequest },
    { id: 'approvals', label: '6. Executive Board Authorization', icon: Stamp },
    { id: 'execution', label: `7. Execution Plan (${tasks.length})`, icon: CheckSquare },
    { id: 'reality', label: `8. Reality Calibration (${realityMetrics.length})`, icon: Compass },
    { id: 'audit', label: '9. Audit History & Memo', icon: History },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Decision Header Strip */}
      <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="mono text-xs font-bold text-[#c0a477] bg-[#c0a477]/15 px-2 py-0.5 rounded border border-[#c0a477]/30">
                {decision.code}
              </span>
              <span className="mono text-xs text-[#777e80]">{decision.organization}</span>
              <span className="mono text-xs text-[#777e80]">|</span>
              <span className="mono text-xs text-[#777e80]">{decision.geographicScope}</span>
              <span className="mono text-xs text-[#777e80]">|</span>
              <span className="mono text-xs text-[#667f72]">VER: v{decision.version}.0</span>
            </div>
            <h1 className="text-xl font-bold text-[#e7e2d9] tracking-tight">{decision.title}</h1>
            <p className="text-xs text-[#777e80] leading-relaxed max-w-4xl">
              {decision.problemStatement}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="text-right">
              <div className="text-[10px] mono uppercase text-[#777e80]">Capital Commitment</div>
              <div className="text-base font-bold mono text-[#c0a477]">
                ${(decision.capitalAllocation / 1000000).toFixed(2)}M USD
              </div>
              <div className="text-[10px] mono text-[#777e80]">
                {decision.timeHorizonMonths} Mo Horizon
              </div>
            </div>

            <div className="h-8 w-px bg-[#e7e2d9]/10" />

            <div className="text-right">
              <div className="text-[10px] mono uppercase text-[#777e80]">Decision Status</div>
              <div
                className={`mono text-xs font-semibold px-2 py-0.5 rounded uppercase mt-0.5 ${
                  decision.status === 'approved'
                    ? 'bg-[#667f72]/20 text-[#667f72] border border-[#667f72]/40'
                    : decision.status === 'recommended'
                    ? 'bg-[#c0a477]/20 text-[#c0a477] border border-[#c0a477]/40'
                    : 'bg-[#292d30] text-[#777e80]'
                }`}
              >
                {decision.status}
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pt-2 border-t border-[#e7e2d9]/10 text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded flex items-center space-x-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#111315] text-[#c0a477] font-semibold border-b-2 border-[#c0a477]'
                    : 'text-[#777e80] hover:text-[#e7e2d9] hover:bg-[#292d30]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview, Objectives & Constraints */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strategic Objectives */}
          <div className="p-5 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#e7e2d9]/10">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
                STRATEGIC OBJECTIVES & TARGET METRICS
              </h3>
              <span className="mono text-[10px] text-[#c0a477]">
                {decision.objectives.length} TARGETS
              </span>
            </div>

            <div className="space-y-2">
              {decision.objectives.map((obj) => (
                <div key={obj.id} className="p-3 rounded bg-[#111315] border border-[#e7e2d9]/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-[#e7e2d9]">{obj.metric}</span>
                    <div className="text-[11px] mono text-[#c0a477] font-semibold mt-0.5">
                      Target: {obj.targetValue}
                    </div>
                  </div>
                  <span className="mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#202326] text-[#777e80]">
                    {obj.priority}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <span className="text-[10px] mono uppercase text-[#777e80] block mb-1">
                Strategic Mandate Statement
              </span>
              <p className="text-xs text-[#e7e2d9] italic bg-[#111315] p-3 rounded border border-[#e7e2d9]/5">
                "{decision.strategicObjective}"
              </p>
            </div>
          </div>

          {/* Hard & Soft Constraints */}
          <div className="p-5 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#e7e2d9]/10">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
                OPERATIONAL BOUNDARY CONSTRAINTS
              </h3>
              <span className="mono text-[10px] text-[#c85a5a]">
                {decision.constraints.length} BOUNDARIES
              </span>
            </div>

            <div className="space-y-2">
              {decision.constraints.map((c) => (
                <div key={c.id} className="p-3 rounded bg-[#111315] border-l-2 border-[#c85a5a] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="mono text-[10px] uppercase text-[#777e80] bg-[#202326] px-1.5 py-0.5 rounded">
                        {c.type}
                      </span>
                      {c.isHardConstraint && (
                        <span className="mono text-[10px] text-[#c85a5a] font-semibold">
                          HARD CONSTRAINT (ZERO DEVIATION)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#e7e2d9]">{c.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Success Criteria */}
            <div className="pt-2">
              <span className="text-[10px] mono uppercase text-[#777e80] block mb-2">
                Defensible Success Criteria
              </span>
              <ul className="space-y-1.5 text-xs text-[#e7e2d9]">
                {decision.successCriteria.map((crit, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#667f72] shrink-0" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Evidence & Claims */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
                EPISTEMIC EVIDENCE REPOSITORY // {decision.code}
              </h3>
              <p className="text-[11px] text-[#777e80]">
                Every claim classified into FACT, ASSUMPTION, HYPOTHESIS, or RECOMMENDATION with traceability.
              </p>
            </div>
            <button
              onClick={() => onNavigate('research_library')}
              className="px-3 py-1.5 rounded bg-[#202326] hover:bg-[#292d30] border border-[#e7e2d9]/10 text-xs text-[#c0a477] flex items-center space-x-1.5"
            >
              <span>Ingest Document or Research Note</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidence.map((item) => (
              <div key={item.id} className="p-4 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                      item.epistemicType === 'FACT'
                        ? 'bg-[#667f72]/20 text-[#667f72] border border-[#667f72]/30'
                        : item.epistemicType === 'ASSUMPTION'
                        ? 'bg-[#c0a477]/20 text-[#c0a477] border border-[#c0a477]/30'
                        : item.epistemicType === 'HYPOTHESIS'
                        ? 'bg-[#777e80]/20 text-[#777e80] border border-[#777e80]/30'
                        : 'bg-[#e7e2d9]/20 text-[#e7e2d9] border border-[#e7e2d9]/30'
                    }`}
                  >
                    {item.epistemicType}
                  </span>
                  <div className="flex items-center space-x-2 text-[10px] mono text-[#777e80]">
                    <span>CONFIDENCE: {item.confidenceScore}%</span>
                    <span>•</span>
                    <span className="uppercase">{item.verificationStatus}</span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-[#e7e2d9]">{item.title}</div>
                <div className="text-xs text-[#e7e2d9] bg-[#111315] p-3 rounded border border-[#e7e2d9]/5">
                  "{item.extractedClaim}"
                </div>

                <div className="text-[11px] text-[#777e80] space-y-1">
                  <div>
                    <span className="mono uppercase text-[10px]">Source: </span>
                    <span className="text-[#e7e2d9]">{item.sourceDocument}</span>
                  </div>
                  <div>
                    <span className="mono uppercase text-[10px]">Reliability Note: </span>
                    <span>{item.reliabilityExplanation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Agent Council Findings */}
      {activeTab === 'agents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
                MULTI-AGENT DELIBERATION FINDINGS
              </h3>
              <p className="text-[11px] text-[#777e80]">
                Autonomous investigation across Strategist, Researcher, Financial Analyst, Skeptic, Simulator, Risk Officer, and Arbiter.
              </p>
            </div>
            <button
              onClick={() => onNavigate('agent_council')}
              className="px-3.5 py-1.5 rounded bg-[#c0a477] text-[#111315] font-semibold text-xs flex items-center space-x-1.5"
            >
              <span>Open Council Chamber</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {councilRun?.findings.map((f) => (
              <div key={f.agentRole} className="p-4 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="mono text-[10px] px-2 py-0.5 rounded uppercase font-semibold text-[#c0a477] bg-[#c0a477]/10 border border-[#c0a477]/30">
                      {f.agentRole.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-[#e7e2d9]">{f.agentName}</span>
                  </div>
                  <span className="mono text-[10px] text-[#667f72] font-semibold">
                    {f.confidence}% CONFIDENCE
                  </span>
                </div>

                <p className="text-xs text-[#e7e2d9] leading-relaxed">{f.summary}</p>

                <div className="space-y-1.5 pt-2 border-t border-[#e7e2d9]/5">
                  <div className="text-[10px] mono uppercase text-[#777e80]">Primary Reasoning Chain</div>
                  <ul className="space-y-1 text-[11px] text-[#777e80]">
                    {f.reasoningSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-[#c0a477] mono font-bold">›</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Quantitative Simulations */}
      {activeTab === 'simulations' && (
        <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
                QUANTITATIVE SIMULATION SNAPSHOT // 1,000-RUN MONTE CARLO
              </h3>
              <p className="text-[11px] text-[#777e80]">
                Deterministic stochastic variance modeling based on capital outlay of ${(decision.capitalAllocation / 1000000).toFixed(2)}M.
              </p>
            </div>
            <button
              onClick={() => onNavigate('simulation_chamber')}
              className="px-4 py-2 rounded bg-[#c0a477] text-[#111315] font-semibold text-xs flex items-center space-x-1.5"
            >
              <span>Open Quantitative Simulation Chamber</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3 rounded bg-[#111315] border border-[#e7e2d9]/5">
              <div className="text-[10px] mono text-[#777e80] uppercase">Expected NPV</div>
              <div className="text-xl font-bold mono text-[#667f72] mt-1">+$4.65M</div>
              <div className="text-[10px] text-[#777e80]">10% annual discount rate</div>
            </div>

            <div className="p-3 rounded bg-[#111315] border border-[#e7e2d9]/5">
              <div className="text-[10px] mono text-[#777e80] uppercase">Expected IRR</div>
              <div className="text-xl font-bold mono text-[#c0a477] mt-1">38.4%</div>
              <div className="text-[10px] text-[#777e80]">Internal Rate of Return</div>
            </div>

            <div className="p-3 rounded bg-[#111315] border border-[#e7e2d9]/5">
              <div className="text-[10px] mono text-[#777e80] uppercase">Break-Even Month</div>
              <div className="text-xl font-bold mono text-[#e7e2d9] mt-1">Month 15</div>
              <div className="text-[10px] text-[#667f72]">Cumulative cash positive</div>
            </div>

            <div className="p-3 rounded bg-[#111315] border border-[#e7e2d9]/5">
              <div className="text-[10px] mono text-[#777e80] uppercase">Profitability Odds</div>
              <div className="text-xl font-bold mono text-[#667f72] mt-1">87.4%</div>
              <div className="text-[10px] text-[#777e80]">874/1,000 runs positive</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="p-6 rounded bg-[#202326] border border-[#c0a477]/40 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="mono text-xs font-bold text-[#c0a477] bg-[#c0a477]/15 px-2 py-0.5 rounded border border-[#c0a477]/30">
                FINAL SYNTHESIS // ARBITER RONALD VANCE
              </span>
              <span className="mono text-xs text-[#777e80]">Consensus Score: {councilRun?.consensusScore}%</span>
            </div>

            <p className="text-sm text-[#e7e2d9] leading-relaxed serif font-normal text-lg italic">
              "{councilRun?.synthesizedRecommendation}"
            </p>

            <div className="pt-2 border-t border-[#e7e2d9]/10">
              <span className="mono text-[10px] uppercase text-[#777e80] block mb-2">
                Unresolved Strategic Uncertainties (Preserved Transparency)
              </span>
              <ul className="space-y-1 text-xs text-[#c0a477]">
                {councilRun?.unresolvedUncertainties.map((u, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-[#c85a5a] font-bold">!</span>
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Strategic Alternatives Evaluation Matrix */}
          <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
              STRATEGIC ALTERNATIVES EVALUATION MATRIX
            </h3>

            <div className="space-y-3">
              {councilRun?.alternatives.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-4 rounded border ${
                    alt.status === 'recommended'
                      ? 'bg-[#111315] border-[#c0a477]'
                      : 'bg-[#111315]/50 border-[#e7e2d9]/10 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-[#e7e2d9] flex items-center space-x-2">
                      <span>{alt.title}</span>
                      {alt.status === 'recommended' && (
                        <span className="mono text-[10px] bg-[#c0a477]/20 text-[#c0a477] px-2 py-0.5 rounded border border-[#c0a477]/30">
                          RECOMMENDED ACTION
                        </span>
                      )}
                      {alt.status === 'rejected' && (
                        <span className="mono text-[10px] bg-[#c85a5a]/20 text-[#c85a5a] px-2 py-0.5 rounded border border-[#c85a5a]/30">
                          REJECTED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-xs mono">
                      <span className="text-[#c0a477]">SCORE: {alt.score}/100</span>
                      <span className="text-[#777e80]">RISK: {alt.riskScore}/100</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[11px] pt-2 border-t border-[#e7e2d9]/5">
                    <div>
                      <span className="mono uppercase text-[#667f72] font-semibold block mb-1">Pros</span>
                      <ul className="space-y-0.5 text-[#777e80]">
                        {alt.pros.map((p, i) => (
                          <li key={i}>+ {p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="mono uppercase text-[#c85a5a] font-semibold block mb-1">Cons / Downside</span>
                      <ul className="space-y-0.5 text-[#777e80]">
                        {alt.cons.map((c, i) => (
                          <li key={i}>- {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {alt.rejectionReason && (
                    <div className="mt-2 text-[11px] text-[#c85a5a] bg-[#c85a5a]/10 p-2 rounded">
                      <span className="mono uppercase font-semibold">Arbiter Rejection Rationale: </span>
                      {alt.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Executive Approvals */}
      {activeTab === 'approvals' && (
        <div className="max-w-3xl mx-auto p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-[#e7e2d9]/10">
            <Stamp className="w-6 h-6 text-[#c0a477]" />
            <div>
              <h2 className="text-base font-bold text-[#e7e2d9]">Executive Board Authorization Ceremony</h2>
              <p className="text-xs text-[#777e80]">
                Formal digital cryptographic sign-off converting recommendation into authorized capital allocation.
              </p>
            </div>
          </div>

          {showApprovalSuccess && (
            <div className="p-4 rounded bg-[#667f72]/20 border border-[#667f72] text-[#e7e2d9] text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-[#667f72]" />
              <span>
                Executive Authorization Ratified. Cryptographic SHA-256 seal anchored to decision ledger.
              </span>
            </div>
          )}

          <form onSubmit={handleApprovalSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#777e80]">Authorizing Signatory</label>
                <input
                  type="text"
                  required
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  className="w-full bg-[#111315] border border-[#e7e2d9]/15 rounded px-3 py-2 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#777e80]">Signatory Title</label>
                <input
                  type="text"
                  required
                  value={approverTitle}
                  onChange={(e) => setApproverTitle(e.target.value)}
                  className="w-full bg-[#111315] border border-[#e7e2d9]/15 rounded px-3 py-2 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#777e80]">
                Binding Execution Conditions Imposed
              </label>
              <textarea
                rows={3}
                value={approvalConditions}
                onChange={(e) => setApprovalConditions(e.target.value)}
                className="w-full bg-[#111315] border border-[#e7e2d9]/15 rounded px-3 py-2 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477] font-mono resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#777e80]">Executive Minute Memorandum</label>
              <textarea
                rows={3}
                value={approvalMemo}
                onChange={(e) => setApprovalMemo(e.target.value)}
                className="w-full bg-[#111315] border border-[#e7e2d9]/15 rounded px-3 py-2 text-xs text-[#e7e2d9] focus:outline-none focus:border-[#c0a477] resize-none"
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#e7e2d9]/10">
              <div className="mono text-[10px] text-[#777e80]">
                STATUS: {decision.status === 'approved' ? 'RATIFIED & SECURED' : 'PENDING BOARD SEAL'}
              </div>

              <button
                type="submit"
                disabled={isApproving}
                className="px-6 py-2.5 rounded bg-[#c0a477] hover:bg-[#d6be99] text-[#111315] font-semibold text-xs tracking-wider transition-colors flex items-center space-x-2"
              >
                <Stamp className="w-4 h-4" />
                <span>{isApproving ? 'GENERATING SIGNATURE...' : 'RATIFY EXECUTIVE APPROVAL'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 7: Execution Plan Quick Jump */}
      {activeTab === 'execution' && (
        <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
                EXECUTION ROOM // WORKSTREAM PROGRESS ({tasks.length} MILESTONES)
              </h3>
              <p className="text-[11px] text-[#777e80]">
                Convert strategic directives directly into assigned milestones, deadlines, and budgets.
              </p>
            </div>
            <button
              onClick={() => onNavigate('execution_room')}
              className="px-4 py-2 rounded bg-[#c0a477] text-[#111315] font-semibold text-xs flex items-center space-x-1.5"
            >
              <span>Open Execution Kanban & Gantt</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {tasks.map((task) => (
              <div key={task.id} className="p-3 rounded bg-[#111315] border border-[#e7e2d9]/5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-[#e7e2d9]">{task.title}</div>
                  <div className="text-[11px] text-[#777e80] mt-0.5">
                    Owner: {task.owner} | Due: {task.deadline}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="mono text-xs text-[#c0a477]">${(task.budgetAllocated / 1000).toFixed(0)}k</span>
                  <span className="mono text-[10px] px-2 py-0.5 rounded uppercase bg-[#202326] text-[#777e80]">
                    {task.stage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Reality Calibration */}
      {activeTab === 'reality' && (
        <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
                PREDICTION VERSUS REALITY LOOP
              </h3>
              <p className="text-[11px] text-[#777e80]">
                Track variance between original forecasts and post-implementation reality observations.
              </p>
            </div>
            <button
              onClick={() => onNavigate('reality_monitor')}
              className="px-4 py-2 rounded bg-[#c0a477] text-[#111315] font-semibold text-xs flex items-center space-x-1.5"
            >
              <span>Open Reality Monitor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {realityMetrics.map((rm) => (
              <div key={rm.id} className="p-3 rounded bg-[#111315] border border-[#e7e2d9]/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#e7e2d9]">{rm.metricName}</span>
                  <span
                    className={`mono text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
                      rm.status === 'outperforming'
                        ? 'text-[#667f72] bg-[#667f72]/15'
                        : rm.status === 'underperforming'
                        ? 'text-[#c85a5a] bg-[#c85a5a]/15'
                        : 'text-[#c0a477] bg-[#c0a477]/15'
                    }`}
                  >
                    {rm.variancePct > 0 ? `+${rm.variancePct}%` : `${rm.variancePct}%`} VARIANCE
                  </span>
                </div>
                <p className="text-[11px] text-[#777e80] leading-snug">{rm.rootCauseAnalysis}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 9: Audit & Export Memo */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded bg-[#202326] border border-[#e7e2d9]/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#e7e2d9]">
                DECISION AUDIT RECORD & MEMORANDUM
              </h3>
              <p className="text-[11px] text-[#777e80]">Immutable chronological log of all updates and votes.</p>
            </div>
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify({ decision, councilRun, evidence, tasks }, null, 2)], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${decision.code}_Executive_Decision_Memo.json`;
                a.click();
              }}
              className="px-3.5 py-1.5 rounded bg-[#292d30] hover:bg-[#343a3e] text-xs text-[#c0a477] flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Decision Package (JSON)</span>
            </button>
          </div>

          <div className="font-mono text-xs bg-[#111315] p-4 rounded text-[#777e80] space-y-2 border border-[#e7e2d9]/5">
            <div>[2026-09-14 08:30:00 UTC] DECISION INITIALIZED by Sarah Jenkins (EVP)</div>
            <div>[2026-09-15 14:10:00 UTC] EVIDENCE POOL LINKED: 6 items extracted and epistemically classified</div>
            <div>[2026-11-10 14:22:00 UTC] 7-AGENT COUNCIL DELIBERATION CONCLUDED: Alternative B recommended</div>
            <div>[2026-11-10 16:45:00 UTC] EXECUTIVE RATIFICATION: Sealed by CEO Marcus Vance (KAIROS-SIG-SHA256)</div>
            <div>[2026-11-11 00:00:00 UTC] WORKSTREAM MILESTONES MAPPED TO EXECUTION ROOM</div>
          </div>
        </div>
      )}
    </div>
  );
};
